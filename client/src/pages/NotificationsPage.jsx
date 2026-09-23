import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { apiRequest } from "../api.js";

function NotificationCard({
  notification,
  onOpen,
}) {
  const unread = !notification.isRead;

  const notificationIcon =
    notification.type === "claim_received"
      ? "🫴"
      : notification.type === "claim_approved"
        ? "✓"
        : notification.type === "claim_rejected"
          ? "✕"
          : notification.type === "handover_started"
            ? "↔"
            : notification.type === "handover_completed"
              ? "✓"
              : "🔔";

  return (
    <button
      type="button"
      onClick={() => onOpen(notification)}
      className={`w-full rounded-2xl border p-5 text-left shadow-sm transition ${
        unread
          ? "border-emerald-200 bg-emerald-50/40 hover:border-emerald-300"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
            unread
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {notificationIcon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h2
              className={`text-sm ${
                unread
                  ? "font-extrabold text-slate-950"
                  : "font-bold text-slate-800"
              }`}
            >
              {notification.title}
            </h2>

            {unread && (
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
            )}
          </div>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {notification.message}
          </p>

          <p className="mt-3 text-xs font-medium text-slate-400">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </button>
  );
}

export default function NotificationsPage() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");

      const payload = await apiRequest("/notifications");

      setNotifications(payload.notifications || []);
    } catch (requestError) {
      setError(
        requestError.message || "Failed to load notifications.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleOpenNotification(notification) {
    try {
      setError("");

      if (!notification.isRead) {
        await apiRequest(
          `/notifications/${notification._id}/read`,
          {
            method: "PATCH",
          },
        );

        setNotifications((current) =>
          current.map((item) =>
            item._id === notification._id
              ? { ...item, isRead: true }
              : item,
          ),
        );
      }

      // A new claim received needs to go to the
      // report owner's Claims Received page.
      if (notification.type === "claim_received") {
        navigate("/profile/claims-received");
        return;
      }

      // Claim approval/rejection and handover notifications
      // belong to the user's own claims.
      if (
        notification.type === "claim_approved" ||
        notification.type === "claim_rejected" ||
        notification.type === "handover_started" ||
        notification.type === "handover_completed"
      ) {
        navigate("/profile/claims");
        return;
      }

      // Fallback for future notification types that
      // are associated with a report.
      if (notification.report?._id) {
        navigate(`/reports/${notification.report._id}`);
      }
    } catch (requestError) {
      setError(
        requestError.message || "Failed to open notification.",
      );
    }
  }

  async function handleMarkAllAsRead() {
    try {
      setProcessing(true);
      setError("");

      await apiRequest("/notifications/read-all", {
        method: "PATCH",
      });

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    } catch (requestError) {
      setError(
        requestError.message ||
          "Failed to mark notifications as read.",
      );
    } finally {
      setProcessing(false);
    }
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/profile"
            className="flex items-center gap-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-xl font-black text-white shadow-sm">
              F
            </span>

            <span>
              <span className="block text-xl font-black tracking-tight text-slate-950">
                FindBack
              </span>

              <span className="block text-xs font-medium text-slate-400">
                Lost & found, connected
              </span>
            </span>
          </Link>

          <Link
            to="/profile"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
          >
            ← Profile
          </Link>
        </div>

        <section className="mt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950">
                Notifications
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Stay updated on your claims and reports.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                disabled={processing}
                onClick={handleMarkAllAsRead}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing
                  ? "Updating..."
                  : "Mark all as read"}
              </button>
            )}
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Loading notifications...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                🔔
              </div>

              <p className="mt-4 text-base font-bold text-slate-900">
                No notifications yet.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Notifications about claims and report activity will
                appear here.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification._id}
                  notification={notification}
                  onOpen={handleOpenNotification}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}