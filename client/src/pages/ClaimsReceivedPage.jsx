import { useEffect, useState } from "react";

import { Link } from "react-router";

import { apiRequest } from "../api.js";

export default function ClaimsReceivedPage() {
  const [claims, setClaims] = useState([]);

  const [loading, setLoading] = useState(true);

  const [processingClaim, setProcessingClaim] = useState(null);

  const [processingHandover, setProcessingHandover] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    loadClaimsReceived();
  }, []);

  async function loadClaimsReceived() {
    try {
      setLoading(true);
      setError("");

      const reportsPayload = await apiRequest("/reports/my");

      const ownedReports = reportsPayload.reports || [];

      const claimEntries = await Promise.all(
        ownedReports.map(async (report) => {
          try {
            const payload = await apiRequest(`/claims/report/${report._id}`);

            return (payload.claims || []).map((claim) => ({
              ...claim,
              report,
            }));
          } catch {
            return [];
          }
        }),
      );

      const allClaims = claimEntries
        .flat()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setClaims(allClaims);
    } catch (requestError) {
      setError(requestError.message || "Failed to load received claims.");
    } finally {
      setLoading(false);
    }
  }

  async function handleClaimStatus(claimId, status) {
    try {
      setProcessingClaim(claimId);
      setError("");

      const payload = await apiRequest(`/claims/${claimId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setClaims((current) =>
        current.map((claim) => {
          if (claim._id !== claimId) {
            return claim;
          }

          return {
            ...claim,

            // Keep the already populated claimant object.
            // The status API may return claimant as only an ObjectId.
            claimant: claim.claimant,

            ...payload.claim,

            // Make sure the populated claimant is NOT overwritten.
            claimant: claim.claimant,

            report:
              status === "approved"
                ? {
                    ...claim.report,
                    status: "claimed",
                  }
                : claim.report,
          };
        }),
      );
    } catch (requestError) {
      setError(requestError.message || "Failed to update the claim.");
    } finally {
      setProcessingClaim(null);
    }
  }

  async function handleConfirmHandover(claimId) {
    try {
      setProcessingHandover(claimId);
      setError("");

      const payload = await apiRequest(`/claims/${claimId}/handover`, {
        method: "PATCH",
      });

      setClaims((current) =>
        current.map((claim) =>
          claim._id === claimId
            ? {
                ...claim,
                ...payload.claim,
                claimant: claim.claimant,
              }
            : claim,
        ),
      );
    } catch (requestError) {
      setError(requestError.message || "Failed to confirm the handover.");
    } finally {
      setProcessingHandover(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <Link to="/profile" className="flex items-center gap-3">
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

        {/* Page heading */}
        <section className="mt-6">
          <div className="mb-6">
            <h1 className="text-3xl font-black tracking-tight text-slate-950">
              Claims Received
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review and manage claims submitted for your reports.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Loading received claims...
              </p>
            </div>
          ) : claims.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-base font-bold text-slate-900">
                No claims received yet.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Claims submitted for your reports will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {claims.map((claim) => {
                const report = claim.report;

                return (
                  <article
                    key={claim._id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    {/* Claim header */}
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

                          {report?.status === "returned" && (
                            <span className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-xs font-bold capitalize text-violet-700">
                              returned
                            </span>
                          )}
                        </div>

                        <h2 className="mt-4 text-xl font-extrabold tracking-tight text-slate-950">
                          {report?.title || "Report"}
                        </h2>

                        <p className="mt-3 text-sm font-extrabold text-slate-900">
                          {claim.claimant?.name || "Unknown user"}
                        </p>

                        {claim.claimant?.email && (
                          <p className="mt-1 break-all text-sm text-slate-500">
                            {claim.claimant.email}
                          </p>
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

                    {/* Claim message */}
                    <div className="mt-5 rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Claim message
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {claim.message}
                      </p>
                    </div>

                    {/* Pending actions */}
                    {claim.status === "pending" &&
                      report?.status === "active" && (
                        <div className="mt-5 flex flex-wrap gap-3">
                          <button
                            type="button"
                            disabled={processingClaim === claim._id}
                            onClick={() =>
                              handleClaimStatus(claim._id, "approved")
                            }
                            className="inline-flex min-h-10 items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {processingClaim === claim._id
                              ? "Processing..."
                              : "Approve"}
                          </button>

                          <button
                            type="button"
                            disabled={processingClaim === claim._id}
                            onClick={() =>
                              handleClaimStatus(claim._id, "rejected")
                            }
                            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-rose-200 bg-white px-5 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                    {/* Approved / handover */}
                    {claim.status === "approved" &&
                      report?.status === "claimed" && (
                        <div className="mt-5 flex flex-col gap-4 rounded-xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-extrabold text-blue-900">
                              Claim approved
                            </p>

                            <p className="mt-1 text-sm leading-6 text-blue-700">
                              Complete the physical handover, then confirm that
                              you handed over the item.
                            </p>
                          </div>

                          {!claim.ownerConfirmedAt ? (
                            <button
                              type="button"
                              disabled={processingHandover === claim._id}
                              onClick={() => handleConfirmHandover(claim._id)}
                              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {processingHandover === claim._id
                                ? "Updating..."
                                : "I handed over the item"}
                            </button>
                          ) : (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                              <p className="text-sm font-extrabold text-emerald-800">
                                Handover confirmed
                              </p>

                              <p className="mt-1 text-xs leading-5 text-emerald-700">
                                Waiting for the claimant to confirm receipt.
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                    {/* Handover waiting for claimant */}
                    {claim.status === "approved" &&
                      claim.ownerConfirmedAt &&
                      report?.status === "claimed" && (
                        <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-4">
                          <p className="text-sm font-extrabold text-emerald-900">
                            Handover ready for claimant confirmation
                          </p>

                          <p className="mt-1 text-sm leading-6 text-emerald-700">
                            The claimant has been notified to confirm that they
                            received the item.
                          </p>
                        </div>
                      )}

                    {/* Completed */}
                    {claim.status === "completed" &&
                      report?.status === "returned" && (
                        <div className="mt-5 rounded-xl border border-violet-100 bg-violet-50 px-4 py-4">
                          <p className="text-sm font-extrabold text-violet-900">
                            Item returned successfully
                          </p>

                          <p className="mt-1 text-sm leading-6 text-violet-700">
                            The claimant confirmed receiving the item. This
                            report is now completed.
                          </p>
                        </div>
                      )}

                    {/* Rejected */}
                    {claim.status === "rejected" && (
                      <div className="mt-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-4">
                        <p className="text-sm font-extrabold text-rose-900">
                          Claim rejected
                        </p>

                        <p className="mt-1 text-sm leading-6 text-rose-700">
                          This claim has been rejected and no further action is
                          required.
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
