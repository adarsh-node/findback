import express from "express";

import {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notificationController.js";

import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, getMyNotifications);

router.get(
  "/unread-count",
  requireAuth,
  getUnreadNotificationCount,
);

router.patch(
  "/:id/read",
  requireAuth,
  markNotificationAsRead,
);

router.patch(
  "/read-all",
  requireAuth,
  markAllNotificationsAsRead,
);

export default router;