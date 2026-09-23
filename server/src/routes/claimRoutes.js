import express from "express";

import {
  createClaim,
  getReportClaims,
  getMyClaims,
  updateClaimStatus,
  confirmOwnerHandover,
  confirmClaimantReceipt,
} from "../controllers/claimController.js";

import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/:reportId", requireAuth, createClaim);

router.get("/my", requireAuth, getMyClaims);

router.get(
  "/report/:reportId",
  requireAuth,
  getReportClaims,
);

router.patch(
  "/:claimId/status",
  requireAuth,
  updateClaimStatus,
);

router.patch(
  "/:claimId/handover",
  requireAuth,
  confirmOwnerHandover,
);

router.patch(
  "/:claimId/confirm-receipt",
  requireAuth,
  confirmClaimantReceipt,
);

export default router;