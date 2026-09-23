import express from "express";
import upload from "../middleware/upload.js";

import {
  createReport,
  getReports,
  getMyReports,
  getReportById,
  updateReport,
  deleteReport,
} from "../controllers/reportController.js";

import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, upload.array("images", 5), createReport);
router.get("/", getReports);
router.get("/my", requireAuth, getMyReports);
router.get("/:id", getReportById);
router.patch("/:id", requireAuth, updateReport);
router.delete("/:id", requireAuth, deleteReport);

export default router;