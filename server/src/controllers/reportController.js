import mongoose from "mongoose";
import ItemReport from "../models/ItemReport.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createReport = async (req, res) => {
  try {
    const {
      type,
      title,
      category,
      description,
      date,
      location: rawLocation,
    } = req.body;

    let location = rawLocation;

    if (typeof rawLocation === "string") {
      try {
        location = JSON.parse(rawLocation);
      } catch {
        return res.status(400).json({
          message: "Invalid location data",
        });
      }
    }

    // Basic validation
    if (
      !type ||
      !title ||
      !category ||
      !description ||
      !date ||
      !location?.address ||
      !location?.point?.coordinates
    ) {
      return res.status(400).json({
        message: "All required report fields must be provided",
      });
    }

    const [longitude, latitude] = location.point.coordinates;

    // Validate coordinates
    if (
      typeof longitude !== "number" ||
      typeof latitude !== "number" ||
      longitude < -180 ||
      longitude > 180 ||
      latitude < -90 ||
      latitude > 90
    ) {
      return res.status(400).json({
        message: "Invalid location coordinates",
      });
    }

    console.log("Files received:", req.files);
    const images = [];

    if (req.files?.length) {
      for (const file of req.files) {
        const uploadedImage = await uploadToCloudinary(file.buffer);
        images.push(uploadedImage);
      }
    }

    const report = await ItemReport.create({
      type,
      title,
      category,
      description,
      date,
      location: {
        address: location.address,
        point: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      images,
      user: req.user._id,
    });

    return res.status(201).json({
      message: "Report created successfully",
      report,
    });
  } catch (error) {
    console.error("Create report error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid report data",
      });
    }

    return res.status(500).json({
      message: "Failed to create report",
    });
  }
};

export const getReports = async (req, res) => {
  try {
    const { type, category, search, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

   if (search) {
  const safeSearch = escapeRegex(search);

  filter.$or = [
    { title: { $regex: safeSearch, $options: "i" } },
    { description: { $regex: safeSearch, $options: "i" } },
  ];
}

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 50);
    const skip = (pageNumber - 1) * limitNumber;

    const [reports, totalReports] = await Promise.all([
      ItemReport.find(filter)
        .populate("user", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),

      ItemReport.countDocuments(filter),
    ]);

    return res.status(200).json({
      reports,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalReports,
        totalPages: Math.ceil(totalReports / limitNumber),
      },
    });
  } catch (error) {
    console.error("Get reports error:", error);

    return res.status(500).json({
      message: "Failed to fetch reports",
    });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const reports = await ItemReport.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("user", "name");

    return res.status(200).json({
      reports,
    });
  } catch (error) {
    console.error("Get my reports error:", error);

    return res.status(500).json({
      message: "Failed to fetch your reports",
    });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid report ID",
      });
    }

    const report = await ItemReport.findById(id).populate("user", "name");

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    return res.status(200).json({
      report,
    });
  } catch (error) {
    console.error("Get report by ID error:", error);

    return res.status(500).json({
      message: "Failed to fetch report",
    });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid report ID",
      });
    }

    const report = await ItemReport.findById(id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    // Only the owner can update the report
    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this report",
      });
    }

    if (report.status !== "active") {
      return res.status(400).json({
        message: "Only active reports can be updated",
      });
    }

    const { type, title, category, description, date, location } = req.body;

    if (
      type === undefined &&
      title === undefined &&
      category === undefined &&
      description === undefined &&
      date === undefined &&
      location === undefined
    ) {
      return res.status(400).json({
        message: "No fields provided for update",
      });
    }

    if (type !== undefined) {
      report.type = type;
    }

    if (title !== undefined) {
      report.title = title;
    }

    if (category !== undefined) {
      report.category = category;
    }

    if (description !== undefined) {
      report.description = description;
    }

    if (date !== undefined) {
      report.date = date;
    }

    if (location !== undefined) {
      if (!location.address || !location.point?.coordinates) {
        return res.status(400).json({
          message: "Invalid location data",
        });
      }

      const [longitude, latitude] = location.point.coordinates;

      if (
        typeof longitude !== "number" ||
        typeof latitude !== "number" ||
        longitude < -180 ||
        longitude > 180 ||
        latitude < -90 ||
        latitude > 90
      ) {
        return res.status(400).json({
          message: "Invalid location coordinates",
        });
      }

      report.location = {
        address: location.address,
        point: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      };
    }

    await report.save();

    return res.status(200).json({
      message: "Report updated successfully",
      report,
    });
  } catch (error) {
    console.error("Update report error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid report data",
      });
    }

    return res.status(500).json({
      message: "Failed to update report",
    });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid report ID",
      });
    }

    const report = await ItemReport.findById(id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    // Only the owner can delete the report
    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this report",
      });
    }

    if (report.status !== "active") {
      return res.status(400).json({
        message: "Only active reports can be deleted",
      });
    }

    await ItemReport.findByIdAndDelete(id);

    return res.status(204).send();
  } catch (error) {
    console.error("Delete report error:", error);

    return res.status(500).json({
      message: "Failed to delete report",
    });
  }
};
