import express from "express";

import {
  createFoundResponse,
  getReportResponses,
  getMyResponses,
  updateFoundResponseStatus,
  confirmFinderHandover,
  confirmOwnerReceipt,
} from "../controllers/foundResponseController.js";

import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/:reportId",
  requireAuth,
  createFoundResponse,
);

router.get(
  "/my",
  requireAuth,
  getMyResponses,
);

router.get(
  "/report/:reportId",
  requireAuth,
  getReportResponses,
);

router.patch(
  "/:responseId/status",
  requireAuth,
  updateFoundResponseStatus,
);

router.patch(
  "/:responseId/handover",
  requireAuth,
  confirmFinderHandover,
);

router.patch(
  "/:responseId/confirm-receipt",
  requireAuth,
  confirmOwnerReceipt,
);

export default router;