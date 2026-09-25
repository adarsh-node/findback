import { useEffect, useState } from "react";
import { Link } from "react-router";

import { apiRequest } from "../api.js";
import { useAuth } from "../hooks/useAuth.js";

function ReportCard({ report, reportClaims, processingClaim, onClaimStatus }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${
                report.type === "lost"
                  ? "bg-rose-50 text-rose-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {report.type}
            </span>

            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold capitalize ${
                report.status === "active"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : report.status === "matched"
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : report.status === "claimed"
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : report.status === "returned"
                        ? "border-violet-200 bg-violet-50 text-violet-700"
                        : "border-slate-200 bg-slate-50 text-slate-600"
              }`}
            >
              {report.status}
            </span>
          </div>

          <h3 className="mt-4 text-xl font-extrabold tracking-tight text-slate-950">
            {report.title}
          </h3>

          <div className="mt-2">
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
              {report.category}
            </span>
          </div>
        </div>

        <Link
          to={`/reports/${report._id}`}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
        >
          View Report
        </Link>
      </div>

      <div className="my-5 h-px bg-slate-200" />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-lg">
            🫴
          </span>

          <h4 className="text-base font-extrabold text-slate-900">Claims</h4>
        </div>

        <span className="text-sm font-medium text-slate-400">
          {reportClaims.length} {reportClaims.length === 1 ? "claim" : "claims"}
        </span>
      </div>

      {reportClaims.length === 0 ? (
        <div className="mt-3 rounded-xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
          No claims have been submitted for this report.
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {reportClaims.map((claim) => (
            <div
              key={claim._id}
              className="rounded-xl border border-slate-200 p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-slate-900">
                    {claim.claimant?.name || "Unknown user"}
                  </p>

                  {claim.claimant?.email && (
                    <p className="mt-1 break-all text-sm text-slate-500">
                      {claim.claimant.email}
                    </p>
                  )}

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {claim.message}
                  </p>
                </div>

                <span
                  className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-bold capitalize ${
                    claim.status === "pending"
                      ? "bg-amber-50 text-amber-700"
                      : claim.status === "approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : claim.status === "completed"
                          ? "bg-violet-50 text-violet-700"
                          : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {claim.status}
                </span>
              </div>

              {claim.status === "pending" && report.status === "active" && (
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={processingClaim === claim._id}
                    onClick={() =>
                      onClaimStatus(claim._id, "approved", report._id)
                    }
                    className="inline-flex min-h-10 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {processingClaim === claim._id
                      ? "Processing..."
                      : "Approve"}
                  </button>

                  <button
                    type="button"
                    disabled={processingClaim === claim._id}
                    onClick={() =>
                      onClaimStatus(claim._id, "rejected", report._id)
                    }
                    className="inline-flex min-h-10 items-center justify-center rounded-xl border border-rose-200 bg-white px-4 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {processingClaim === claim._id ? "Processing..." : "Reject"}
                  </button>
                </div>
              )}

              {claim.status === "approved" && report.status === "claimed" && (
                <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium leading-6 text-emerald-700">
                  This claim has been approved. Go to Claims Received to
                  complete the physical handover confirmation.
                </div>
              )}

              {claim.status === "completed" && report.status === "returned" && (
                <div className="mt-5 rounded-xl bg-violet-50 px-4 py-3 text-sm font-medium leading-6 text-violet-700">
                  The claimant confirmed receiving the item. This report has
                  been returned successfully.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

function ClaimCard({ claim }) {
  const report = claim.report;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${
                report?.type === "lost"
                  ? "bg-rose-50 text-rose-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {report?.type || "report"}
            </span>

            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold capitalize ${
                claim.status === "pending"
                  ? "bg-amber-50 text-amber-700"
                  : claim.status === "approved"
                    ? "bg-emerald-50 text-emerald-700"
                    : claim.status === "completed"
                      ? "bg-violet-50 text-violet-700"
                      : "bg-rose-50 text-rose-700"
              }`}
            >
              {claim.status}
            </span>
          </div>

          <h3 className="mt-4 text-xl font-extrabold tracking-tight text-slate-950">
            {report?.title || "Report"}
          </h3>

          {report?.category && (
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                {report.category}
              </span>
            </div>
          )}
        </div>

        {report?._id && (
          <Link
            to={`/reports/${report._id}`}
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
          >
            View Report
          </Link>
        )}
      </div>

      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Your claim
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-600">{claim.message}</p>
      </div>
    </article>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const [reports, setReports] = useState([]);
  const [claims, setClaims] = useState({});
  const [myClaims, setMyClaims] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [responsesReceivedCount, setResponsesReceivedCount] = useState(0);
  const [myResponsesCount, setMyResponsesCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [processingClaim, setProcessingClaim] = useState(null);

  const [showAllReports, setShowAllReports] = useState(false);
  const [showAllClaims, setShowAllClaims] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  async function loadProfileData() {
    try {
      setLoading(true);
      setError("");

      const [
        reportsPayload,
        myClaimsPayload,
        notificationPayload,
        myResponsesPayload,
      ] = await Promise.all([
        apiRequest("/reports/my"),
        apiRequest("/claims/my"),
        apiRequest("/notifications/unread-count"),
        apiRequest("/responses/my"),
      ]);

      const ownedReports = reportsPayload.reports || [];

      setReports(ownedReports);
      setMyClaims(myClaimsPayload.claims || []);
      setNotificationCount(notificationPayload.count || 0);
      setMyResponsesCount((myResponsesPayload.responses || []).length);

      const claimsEntries = await Promise.all(
        ownedReports.map(async (report) => {
          try {
            const payload = await apiRequest(`/claims/report/${report._id}`);

            return [report._id, payload.claims || []];
          } catch {
            return [report._id, []];
          }
        }),
      );

      setClaims(Object.fromEntries(claimsEntries));

      const lostReports = ownedReports.filter(
        (report) => report.type === "lost",
      );

      const responsesEntries = await Promise.all(
        lostReports.map(async (report) => {
          try {
            const payload = await apiRequest(`/responses/report/${report._id}`);

            return payload.responses || [];
          } catch {
            return [];
          }
        }),
      );

      setResponsesReceivedCount(
        responsesEntries.reduce(
          (total, reportResponses) => total + reportResponses.length,
          0,
        ),
      );
    } catch (requestError) {
      setError(requestError.message || "Failed to load your profile data.");
    } finally {
      setLoading(false);
    }
  }

  async function handleClaimStatus(claimId, status, reportId) {
    try {
      setProcessingClaim(claimId);
      setError("");

      const payload = await apiRequest(`/claims/${claimId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      const updatedClaim = payload.claim;

      setClaims((current) => ({
        ...current,
        [reportId]: (current[reportId] || []).map((claim) =>
          claim._id === claimId ? updatedClaim : claim,
        ),
      }));

      if (status === "approved") {
        setReports((current) =>
          current.map((report) =>
            report._id === reportId ? { ...report, status: "claimed" } : report,
          ),
        );
      }
    } catch (requestError) {
      setError(requestError.message || "Failed to update the claim.");
    } finally {
      setProcessingClaim(null);
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (requestError) {
      setError(requestError.message || "Failed to log out.");
    }
  }

  const claimsReceived = Object.values(claims).reduce(
    (total, reportClaims) => total + reportClaims.length,
    0,
  );

  // Latest 3 on both laptop and mobile.
  const visibleReports = showAllReports ? reports : reports.slice(0, 3);

  const visibleClaims = showAllClaims ? myClaims : myClaims.slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl">
        {/* Top navigation */}
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
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
            to="/reports"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Browse reports
          </Link>
        </div>

        {/* Profile section */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-2xl">
                👤
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950">
                  Your Profile
                </h1>

                <p className="mt-1 text-base text-slate-500">
                  Manage your FindBack activity
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
              <Link
                to="/"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
              >
                Home
              </Link>

              <Link
                to="/reports/new"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                + Report an item
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Log out
              </button>
            </div>
          </div>

          {/* Name + Email */}
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Name
              </p>

              <p className="mt-1 text-base font-semibold text-slate-900">
                {user?.name || "—"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Email
              </p>

              <p className="mt-1 break-all text-base font-semibold text-slate-900">
                {user?.email || "—"}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3">
            <Link
              to="/profile/reports"
              className="rounded-xl border border-blue-200 bg-blue-50 p-3 transition hover:border-blue-300 hover:bg-blue-100"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                My Reports
              </p>

              <p className="mt-1 text-xl font-black text-slate-950">
                {reports.length}
              </p>
            </Link>

            <Link
              to="/profile/claims-received"
              className="rounded-xl border border-amber-200 bg-amber-50 p-3 transition hover:border-amber-300 hover:bg-amber-100"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-amber-600">
                Claims Received
              </p>

              <p className="mt-1 text-xl font-black text-slate-950">
                {claimsReceived}
              </p>
            </Link>

            <Link
              to="/profile/claims"
              className="rounded-xl border border-violet-200 bg-violet-50 p-3 transition hover:border-violet-300 hover:bg-violet-100"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-violet-600">
                My Claims
              </p>

              <p className="mt-1 text-xl font-black text-slate-950">
                {myClaims.length}
              </p>
            </Link>

            <Link
              to="/notifications"
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 transition hover:border-emerald-300 hover:bg-emerald-100"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                Notifications
              </p>

              <p className="mt-1 text-xl font-black text-slate-950">
                {notificationCount}
              </p>
            </Link>
            <Link
              to="/profile/responses-received"
              className="rounded-xl border border-rose-200 bg-rose-50 p-3 transition hover:border-rose-300 hover:bg-rose-100"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-rose-600">
                Responses Received
              </p>

              <p className="mt-1 text-xl font-black text-slate-950">
                {responsesReceivedCount}
              </p>
            </Link>

            <Link
              to="/profile/responses"
              className="rounded-xl border border-cyan-200 bg-cyan-50 p-3 transition hover:border-cyan-300 hover:bg-cyan-100"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-cyan-600">
                My Responses
              </p>

              <p className="mt-1 text-xl font-black text-slate-950">
                {myResponsesCount}
              </p>
            </Link>
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        {/* My Reports */}
        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              My Reports
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Reports you have created
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Loading your reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-base font-bold text-slate-900">
                You haven't created any reports yet.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Create a lost or found report to get started.
              </p>

              <Link
                to="/reports/new"
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                + Report an item
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-5">
                {visibleReports.map((report) => (
                  <ReportCard
                    key={report._id}
                    report={report}
                    reportClaims={claims[report._id] || []}
                    processingClaim={processingClaim}
                    onClaimStatus={handleClaimStatus}
                  />
                ))}
              </div>

              {/* View all reports at the END */}
              {reports.length > 3 && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllReports((value) => !value)}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    {showAllReports ? "Show less" : "View all reports →"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* My Claims */}
        <section className="mt-10 pb-12">
          <div className="mb-5">
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              My Claims
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Claims you have submitted
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Loading your claims...</p>
            </div>
          ) : myClaims.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-base font-bold text-slate-900">
                You haven't submitted any claims yet.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                When you find an item that belongs to you, you can submit a
                claim from its report page.
              </p>

              <Link
                to="/reports"
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
              >
                Browse reports
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-5">
                {visibleClaims.map((claim) => (
                  <ClaimCard key={claim._id} claim={claim} />
                ))}
              </div>

              {/* View all claims at the END */}
              {myClaims.length > 3 && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllClaims((value) => !value)}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    {showAllClaims ? "Show less" : "View all claims →"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
