import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiRequest } from "../api.js";

function ClaimCard({ claim, onConfirmReceipt, processingReceipt }) {
  const report = claim.report;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            {/* Report type */}
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${
                report?.type === "lost"
                  ? "bg-rose-50 text-rose-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {report?.type || "report"}
            </span>

            {/* Claim status */}
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

            {/* Returned */}
            {report?.status === "returned" && (
              <span className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-xs font-bold capitalize text-violet-700">
                returned
              </span>
            )}
          </div>

          <h2 className="mt-4 text-xl font-extrabold tracking-tight text-slate-950">
            {report?.title || "Report"}
          </h2>

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

      {/* Claim message */}
      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Your claim
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {claim.message}
        </p>
      </div>

      {/* Approved - waiting for owner handover */}
      {claim.status === "approved" &&
        !claim.ownerConfirmedAt && (
          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-4">
            <p className="text-sm font-extrabold text-blue-900">
              Claim approved
            </p>

            <p className="mt-1 text-sm leading-6 text-blue-700">
              Your claim has been approved. Arrange the physical
              handover with the report owner.
            </p>
          </div>
        )}

      {/* Owner confirmed handover - claimant must confirm */}
      {claim.status === "approved" &&
        claim.ownerConfirmedAt &&
        !claim.claimantConfirmedAt && (
          <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm font-extrabold text-emerald-900">
              Handover ready for confirmation
            </p>

            <p className="mt-1 text-sm leading-6 text-emerald-700">
              The owner has confirmed handing over the item.
              Confirm only after you have physically received it.
            </p>

            <button
              type="button"
              disabled={processingReceipt === claim._id}
              onClick={() => onConfirmReceipt(claim._id)}
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processingReceipt === claim._id
                ? "Confirming..."
                : "I received the item"}
            </button>
          </div>
        )}

      {/* Completed */}
      {claim.status === "completed" &&
        claim.claimantConfirmedAt &&
        report?.status === "returned" && (
          <div className="mt-5 rounded-xl border border-violet-100 bg-violet-50 px-4 py-4">
            <p className="text-sm font-extrabold text-violet-900">
              Item received successfully
            </p>

            <p className="mt-1 text-sm leading-6 text-violet-700">
              You confirmed receiving the item. This claim has been
              completed.
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
}

export default function MyClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingReceipt, setProcessingReceipt] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadClaims();
  }, []);

  async function loadClaims() {
    try {
      setLoading(true);
      setError("");

      const payload = await apiRequest("/claims/my");

      setClaims(payload.claims || []);
    } catch (requestError) {
      setError(
        requestError.message || "Failed to load your claims.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmReceipt(claimId) {
    try {
      setProcessingReceipt(claimId);
      setError("");

      const payload = await apiRequest(
        `/claims/${claimId}/confirm-receipt`,
        {
          method: "PATCH",
        },
      );

      setClaims((current) =>
        current.map((claim) =>
          claim._id === claimId
            ? {
                ...claim,
                ...payload.claim,
                report: payload.report
                  ? {
                      ...claim.report,
                      ...payload.report,
                    }
                  : claim.report,
              }
            : claim,
        ),
      );
    } catch (requestError) {
      setError(
        requestError.message ||
          "Failed to confirm item receipt.",
      );
    } finally {
      setProcessingReceipt(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
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

        {/* Page */}
        <section className="mt-6">
          <div className="mb-6">
            <h1 className="text-3xl font-black tracking-tight text-slate-950">
              My Claims
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Claims you have submitted for reported items.
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
                Loading your claims...
              </p>
            </div>
          ) : claims.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-base font-bold text-slate-900">
                You haven't submitted any claims yet.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Browse reports and submit a claim when you find an item
                that belongs to you.
              </p>

              <Link
                to="/reports"
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
              >
                Browse reports
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {claims.map((claim) => (
                <ClaimCard
                  key={claim._id}
                  claim={claim}
                  onConfirmReceipt={handleConfirmReceipt}
                  processingReceipt={processingReceipt}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}