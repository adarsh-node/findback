import mongoose from "mongoose";

import FoundResponse from "../models/FoundResponse.js";
import ItemReport from "../models/ItemReport.js";
import Notification from "../models/Notification.js";

async function createNotification({
  recipient,
  type,
  title,
  message,
  report,
  foundResponse,
}) {
  try {
    await Notification.create({
      recipient,
      type,
      title,
      message,
      report,
      foundResponse,
    });
  } catch (error) {
    console.error("Create notification error:", error);
  }
}

export const createFoundResponse = async (req, res) => {
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
        message: "Message is required",
      });
    }

    const report = await ItemReport.findById(reportId);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    if (report.type !== "lost") {
      return res.status(400).json({
        message: "Responses can only be submitted for lost reports",
      });
    }

    if (report.status !== "active") {
      return res.status(400).json({
        message: "This report is no longer accepting responses",
      });
    }

    if (report.user.toString() === req.user._id.toString()) {
      return res.status(403).json({
        message: "You cannot respond to your own report",
      });
    }

    const existingResponse = await FoundResponse.findOne({
      report: report._id,
      finder: req.user._id,
    });

    if (existingResponse) {
      return res.status(409).json({
        message: "You have already responded to this report",
      });
    }

    const foundResponse = await FoundResponse.create({
      report: report._id,
      finder: req.user._id,
      message: message.trim(),
    });

    await createNotification({
      recipient: report.user,
      type: "response_received",
      title: "New response received",
      message: `Someone reported finding your lost item "${report.title}".`,
      report: report._id,
      foundResponse: foundResponse._id,
    });

    return res.status(201).json({
      message: "Your response has been sent to the report owner",
      response: foundResponse,
    });
  } catch (error) {
    console.error("Create found response error:", error);

    if (error?.code === 11000) {
      return res.status(409).json({
        message: "You have already responded to this report",
      });
    }

    return res.status(500).json({
      message: "Failed to submit response",
    });
  }
};

export const getReportResponses = async (req, res) => {
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

    if (report.type !== "lost") {
      return res.status(400).json({
        message: "Responses are only available for lost reports",
      });
    }

    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only view responses for your own report",
      });
    }

    const responses = await FoundResponse.find({
      report: report._id,
    })
      .populate("finder", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      responses,
    });
  } catch (error) {
    console.error("Get report responses error:", error);

    return res.status(500).json({
      message: "Failed to load responses",
    });
  }
};

export const getMyResponses = async (req, res) => {
  try {
    const responses = await FoundResponse.find({
      finder: req.user._id,
    })
      .populate("report", "title type category status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      responses,
    });
  } catch (error) {
    console.error("Get my responses error:", error);

    return res.status(500).json({
      message: "Failed to load your responses",
    });
  }
};

export const updateFoundResponseStatus = async (req, res) => {
  try {
    const { responseId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(responseId)) {
      return res.status(400).json({
        message: "Invalid response ID",
      });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be approved or rejected",
      });
    }

    const response = await FoundResponse.findById(responseId);

    if (!response) {
      return res.status(404).json({
        message: "Response not found",
      });
    }

    const report = await ItemReport.findById(response.report);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    if (report.type !== "lost") {
      return res.status(400).json({
        message: "This response belongs to a non-lost report",
      });
    }

    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the report owner can update this response",
      });
    }

    if (response.status !== "pending") {
      return res.status(400).json({
        message: "This response has already been processed",
      });
    }

    if (report.status !== "active") {
      return res.status(400).json({
        message: "This report is no longer active",
      });
    }

    response.status = status;

    await response.save();

    if (status === "approved") {
      report.status = "claimed";
      await report.save();

      const otherPendingResponses = await FoundResponse.find({
        report: report._id,
        _id: { $ne: response._id },
        status: "pending",
      }).select("_id finder");

      if (otherPendingResponses.length > 0) {
        await FoundResponse.updateMany(
          {
            report: report._id,
            _id: { $ne: response._id },
            status: "pending",
          },
          {
            $set: {
              status: "rejected",
            },
          },
        );

        await Promise.all(
          otherPendingResponses.map((otherResponse) =>
            createNotification({
              recipient: otherResponse.finder,
              type: "response_rejected",
              title: "Response not selected",
              message: `Another response was selected for "${report.title}".`,
              report: report._id,
              foundResponse: otherResponse._id,
            }),
          ),
        );
      }

      await createNotification({
        recipient: response.finder,
        type: "response_approved",
        title: "Your response was approved",
        message: `The owner approved your response for "${report.title}".`,
        report: report._id,
        foundResponse: response._id,
      });
    } else {
      await createNotification({
        recipient: response.finder,
        type: "response_rejected",
        title: "Your response was rejected",
        message: `The owner rejected your response for "${report.title}".`,
        report: report._id,
        foundResponse: response._id,
      });
    }

    return res.status(200).json({
      message:
        status === "approved"
          ? "Response approved"
          : "Response rejected",
      response,
    });
  } catch (error) {
    console.error("Update found response status error:", error);

    return res.status(500).json({
      message: "Failed to update response",
    });
  }
};

export const confirmFinderHandover = async (req, res) => {
  try {
    const { responseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(responseId)) {
      return res.status(400).json({
        message: "Invalid response ID",
      });
    }

    const response = await FoundResponse.findById(responseId);

    if (!response) {
      return res.status(404).json({
        message: "Response not found",
      });
    }

    const report = await ItemReport.findById(response.report);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    if (response.finder.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the finder can confirm the handover",
      });
    }

    if (response.status !== "approved") {
      return res.status(400).json({
        message: "Only an approved response can proceed to handover",
      });
    }

    if (report.status !== "claimed") {
      return res.status(400).json({
        message: "This report is not ready for handover",
      });
    }

    if (response.finderConfirmedAt) {
      return res.status(400).json({
        message: "Handover has already been confirmed",
      });
    }

    response.finderConfirmedAt = new Date();

    await response.save();

    await createNotification({
      recipient: report.user,
      type: "response_handover_started",
      title: "Finder handed over the item",
      message: `The finder has confirmed handing over "${report.title}". Please confirm that you received it.`,
      report: report._id,
      foundResponse: response._id,
    });

    return res.status(200).json({
      message: "Handover confirmed. Waiting for the owner to confirm receipt.",
      response,
    });
  } catch (error) {
    console.error("Confirm finder handover error:", error);

    return res.status(500).json({
      message: "Failed to confirm handover",
    });
  }
};

export const confirmOwnerReceipt = async (req, res) => {
  try {
    const { responseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(responseId)) {
      return res.status(400).json({
        message: "Invalid response ID",
      });
    }

    const response = await FoundResponse.findById(responseId);

    if (!response) {
      return res.status(404).json({
        message: "Response not found",
      });
    }

    const report = await ItemReport.findById(response.report);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the report owner can confirm receipt",
      });
    }

    if (response.status !== "approved") {
      return res.status(400).json({
        message: "Only an approved response can be completed",
      });
    }

    if (!response.finderConfirmedAt) {
      return res.status(400).json({
        message: "The finder must confirm the handover first",
      });
    }

    if (response.ownerConfirmedAt) {
      return res.status(400).json({
        message: "Receipt has already been confirmed",
      });
    }

    response.ownerConfirmedAt = new Date();
    response.status = "completed";

    report.status = "returned";

    await response.save();
    await report.save();

    await createNotification({
      recipient: response.finder,
      type: "response_handover_completed",
      title: "Item returned successfully",
      message: `The owner confirmed receiving "${report.title}".`,
      report: report._id,
      foundResponse: response._id,
    });

    return res.status(200).json({
      message: "Receipt confirmed. The report is now marked as returned.",
      response,
      report,
    });
  } catch (error) {
    console.error("Confirm owner receipt error:", error);

    return res.status(500).json({
      message: "Failed to confirm receipt",
    });
  }
};