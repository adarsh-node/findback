import mongoose from "mongoose";
import Claim from "../models/Claim.js";
import ItemReport from "../models/ItemReport.js";
import Notification from "../models/Notification.js";

async function createNotification(data) {
  try {
    await Notification.create(data);
  } catch (error) {
    // Notification failure should never break the main claim action.
    console.error("Create notification error:", error);
  }
}

export const createClaim = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { message } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({
        message: "Invalid report ID",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Claim message is required",
      });
    }

    const report = await ItemReport.findById(reportId);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    if (report.user.toString() === req.user._id.toString()) {
      return res.status(403).json({
        message: "You cannot claim your own report",
      });
    }

    if (report.status !== "active") {
      return res.status(400).json({
        message: "This report is no longer available for claims",
      });
    }

    const existingClaim = await Claim.findOne({
      report: reportId,
      claimant: req.user._id,
    });

    if (existingClaim) {
      return res.status(409).json({
        message: "You have already submitted a claim for this report",
      });
    }

    const claim = await Claim.create({
      report: reportId,
      claimant: req.user._id,
      message: message.trim(),
    });

    await createNotification({
      recipient: report.user,
      type: "claim_received",
      title: "New claim received",
      message: `Someone submitted a claim for "${report.title}".`,
      report: report._id,
      claim: claim._id,
    });

    return res.status(201).json({
      message: "Claim submitted successfully",
      claim,
    });
  } catch (error) {
    console.error("Create claim error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid claim data",
      });
    }

    return res.status(500).json({
      message: "Failed to create claim",
    });
  }
};

export const getReportClaims = async (req, res) => {
  try {
    const { reportId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({
        message: "Invalid report ID",
      });
    }

    const report = await ItemReport.findById(reportId);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to view these claims",
      });
    }

    const claims = await Claim.find({ report: reportId })
      .populate("claimant", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      claims,
    });
  } catch (error) {
    console.error("Get report claims error:", error);

    return res.status(500).json({
      message: "Failed to fetch claims",
    });
  }
};

export const updateClaimStatus = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(claimId)) {
      return res.status(400).json({
        message: "Invalid claim ID",
      });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid claim status",
      });
    }

    const claim = await Claim.findById(claimId);

    if (!claim) {
      return res.status(404).json({
        message: "Claim not found",
      });
    }

    const report = await ItemReport.findById(claim.report);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to manage this claim",
      });
    }

    if (claim.status !== "pending") {
      return res.status(400).json({
        message: "This claim has already been processed",
      });
    }

    claim.status = status;

    if (status === "approved") {
      report.status = "claimed";

      await report.save();

      // Once one claim is approved, all other pending claims
      // for the same report are no longer valid.
      await Claim.updateMany(
        {
          report: report._id,
          _id: { $ne: claim._id },
          status: "pending",
        },
        {
          $set: {
            status: "rejected",
          },
        },
      );
    }

    await claim.save();

    await createNotification({
      recipient: claim.claimant,
      type:
        status === "approved"
          ? "claim_approved"
          : "claim_rejected",
      title:
        status === "approved"
          ? "Claim approved"
          : "Claim rejected",
      message:
        status === "approved"
          ? `Your claim for "${report.title}" has been approved. Arrange the handover with the report owner.`
          : `Your claim for "${report.title}" has been rejected.`,
      report: report._id,
      claim: claim._id,
    });

    return res.status(200).json({
      message: `Claim ${status} successfully`,
      claim,
    });
  } catch (error) {
    console.error("Update claim status error:", error);

    return res.status(500).json({
      message: "Failed to update claim status",
    });
  }
};

/*
 * Owner confirms that the physical item has been handed over
 * to the approved claimant.
 *
 * IMPORTANT:
 * This does NOT complete the claim yet.
 */
export const confirmOwnerHandover = async (req, res) => {
  try {
    const { claimId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(claimId)) {
      return res.status(400).json({
        message: "Invalid claim ID",
      });
    }

    const claim = await Claim.findById(claimId);

    if (!claim) {
      return res.status(404).json({
        message: "Claim not found",
      });
    }

    const report = await ItemReport.findById(claim.report);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    // Only the report owner can confirm the handover.
    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the report owner can confirm the handover",
      });
    }

    if (claim.status !== "approved") {
      return res.status(400).json({
        message: "Only an approved claim can enter the handover process",
      });
    }

    if (report.status !== "claimed") {
      return res.status(400).json({
        message: "This report is not currently awaiting handover",
      });
    }

    if (claim.ownerConfirmedAt) {
      return res.status(400).json({
        message: "Handover has already been confirmed by the owner",
      });
    }

    claim.ownerConfirmedAt = new Date();

    await claim.save();

    await createNotification({
      recipient: claim.claimant,
      type: "handover_started",
      title: "Handover ready for confirmation",
      message: `The owner has confirmed handing over "${report.title}". Please confirm when you have received the item.`,
      report: report._id,
      claim: claim._id,
    });

    return res.status(200).json({
      message: "Handover marked as completed by owner",
      claim,
    });
  } catch (error) {
    console.error("Confirm owner handover error:", error);

    return res.status(500).json({
      message: "Failed to confirm handover",
    });
  }
};

/*
 * Claimant confirms that they actually received the item.
 *
 * Only after this confirmation:
 * Claim = completed
 * Report = returned
 */
export const confirmClaimantReceipt = async (req, res) => {
  try {
    const { claimId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(claimId)) {
      return res.status(400).json({
        message: "Invalid claim ID",
      });
    }

    const claim = await Claim.findById(claimId);

    if (!claim) {
      return res.status(404).json({
        message: "Claim not found",
      });
    }

    const report = await ItemReport.findById(claim.report);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    // Only the claimant can confirm receipt.
    if (claim.claimant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the claimant can confirm receipt",
      });
    }

    if (claim.status !== "approved") {
      return res.status(400).json({
        message: "Only an approved claim can be completed",
      });
    }

    if (!claim.ownerConfirmedAt) {
      return res.status(400).json({
        message: "The owner must confirm the handover first",
      });
    }

    if (claim.claimantConfirmedAt) {
      return res.status(400).json({
        message: "Receipt has already been confirmed",
      });
    }

    claim.claimantConfirmedAt = new Date();
    claim.status = "completed";

    report.status = "returned";

    await claim.save();
    await report.save();

    await createNotification({
      recipient: report.user,
      type: "handover_completed",
      title: "Item returned successfully",
      message: `The claimant confirmed receiving "${report.title}". The report is now completed.`,
      report: report._id,
      claim: claim._id,
    });

    return res.status(200).json({
      message: "Item receipt confirmed successfully",
      claim,
      report,
    });
  } catch (error) {
    console.error("Confirm claimant receipt error:", error);

    return res.status(500).json({
      message: "Failed to confirm item receipt",
    });
  }
};

export const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({
      claimant: req.user._id,
    })
      .populate("report", "title type category status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      claims,
    });
  } catch (error) {
    console.error("Get my claims error:", error);

    return res.status(500).json({
      message: "Failed to fetch your claims",
    });
  }
};