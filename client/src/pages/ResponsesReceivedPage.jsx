import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router";

import { apiRequest } from "../api.js";

function StatusBadge({ status }) {
  const styles = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rejected: "border-rose-200 bg-rose-50 text-rose-700",
    completed: "border-sky-200 bg-sky-50 text-sky-700",
  };

  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full border px-3 text-xs font-bold capitalize ${
        styles[status] || "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function ResponseCard({
  response,
  onStatusChange,
  onConfirmReceipt,
  loadingAction,
}) {
  const finder = response.finder;

  const isPending = response.status === "pending";
  const isApproved = response.status === "approved";
  const isRejected = response.status === "rejected";
  const isCompleted = response.status === "completed";

  const finderHandedOver = Boolean(response.finderConfirmedAt);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-lg">
            👤
          </div>

          <div>
            <h2 className="text-base font-extrabold text-slate-950">
              {finder?.name || "Unknown user"}
            </h2>

            {finder?.email && (
              <p className="mt-0.5 text-sm text-slate-500">
                {finder.email}
              </p>
            )}
          </div>
        </div>

        <StatusBadge status={response.status} />
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          Finder's message
        </p>

        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {response.message}
        </p>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Response submitted
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {new Date(response.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Handover
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {finderHandedOver
              ? "Finder confirmed handover"
              : "Waiting for finder"}
          </p>
        </div>
      </div>

      {isPending && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={Boolean(loadingAction)}
            onClick={() => onStatusChange(response._id, "approved")}
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loadingAction === `approve-${response._id}`
              ? "Approving..."
              : "Approve"}
          </button>

          <button
            type="button"
            disabled={Boolean(loadingAction)}
            onClick={() => onStatusChange(response._id, "rejected")}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-rose-200 bg-white px-4 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingAction === `reject-${response._id}`
              ? "Rejecting..."
              : "Reject"}
          </button>
        </div>
      )}

      {isApproved && !finderHandedOver && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-bold text-emerald-900">
            Response approved
          </p>

          <p className="mt-1 text-sm leading-5 text-emerald-700">
            The finder can now hand over the item. You will be able to confirm
            receipt after they confirm the handover.
          </p>
        </div>
      )}

      {isApproved && finderHandedOver && (
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-bold text-blue-950">
            Finder has handed over the item
          </p>

          <p className="mt-1 text-sm leading-5 text-blue-700">
            Confirm that you received the item to complete the recovery.
          </p>

          <button
            type="button"
            disabled={Boolean(loadingAction)}
            onClick={() => onConfirmReceipt(response._id)}
            className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loadingAction === `receipt-${response._id}`
              ? "Confirming..."
              : "I Received the Item"}
          </button>
        </div>
      )}

      {isRejected && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm font-bold text-rose-900">
            Response rejected
          </p>

          <p className="mt-1 text-sm text-rose-700">
            This response was not selected for the item.
          </p>
        </div>
      )}

      {isCompleted && (
        <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4">
          <p className="text-sm font-bold text-sky-950">
            Item returned successfully
          </p>

          <p className="mt-1 text-sm leading-5 text-sky-700">
            You confirmed receipt of the item. This recovery is now complete.
          </p>
        </div>
      )}
    </article>
  );
}

export default function ResponsesReceivedPage() {
  const [reports, setReports] = useState([]);
  const [responses, setResponses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [loadingAction, setLoadingAction] = useState("");

  useEffect(() => {
    async function loadResponses() {
      try {
        setLoading(true);
        setError("");

        const reportPayload = await apiRequest("/reports/my");

        const ownedReports = reportPayload.reports || [];

        const lostReports = ownedReports.filter(
          (report) => report.type === "lost",
        );

        setReports(lostReports);

        if (lostReports.length === 0) {
          setResponses([]);
          return;
        }

        const responseResults = await Promise.all(
          lostReports.map(async (report) => {
            const payload = await apiRequest(
              `/responses/report/${report._id}`,
            );

            return (payload.responses || []).map((response) => ({
              ...response,
              report,
            }));
          }),
        );

        const allResponses = responseResults.flat();

        allResponses.sort(
          (first, second) =>
            new Date(second.createdAt) -
            new Date(first.createdAt),
        );

        setResponses(allResponses);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadResponses();
  }, []);

  async function handleStatusChange(responseId, status) {
    try {
      setLoadingAction(
        `${status === "approved" ? "approve" : "reject"}-${responseId}`,
      );
      setError("");

      const payload = await apiRequest(
        `/responses/${responseId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
          }),
        },
      );

      setResponses((currentResponses) =>
        currentResponses.map((response) => {
          if (response._id !== responseId) {
            return response;
          }

          return {
            ...response,
            ...payload.response,
          };
        }),
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingAction("");
    }
  }

  async function handleConfirmReceipt(responseId) {
    try {
      setLoadingAction(`receipt-${responseId}`);
      setError("");

      const payload = await apiRequest(
        `/responses/${responseId}/confirm-receipt`,
        {
          method: "PATCH",
        },
      );

      setResponses((currentResponses) =>
        currentResponses.map((response) => {
          if (response._id !== responseId) {
            return response;
          }

          return {
            ...response,
            ...payload.response,
            report: payload.report || response.report,
          };
        }),
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingAction("");
    }
  }

  const pendingCount = useMemo(
    () =>
      responses.filter(
        (response) => response.status === "pending",
      ).length,
    [responses],
  );

  const approvedCount = useMemo(
    () =>
      responses.filter(
        (response) => response.status === "approved",
      ).length,
    [responses],
  );

  const completedCount = useMemo(
    () =>
      responses.filter(
        (response) => response.status === "completed",
      ).length,
    [responses],
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f8fb]">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:px-8">
          <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-slate-200" />

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
          </div>

          <div className="mt-6 space-y-4">
            <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-base font-black text-white shadow-sm">
              F
            </span>

            <div>
              <p className="text-lg font-extrabold tracking-tight text-slate-950">
                FindBack
              </p>

              <p className="hidden text-[10px] font-medium text-slate-400 sm:block">
                Lost & found, connected
              </p>
            </div>
          </Link>

          <Link
            to="/profile"
            className="inline-flex min-h-9 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Profile
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:px-8">
        <Link
          to="/profile"
          className="inline-flex min-h-8 items-center rounded-lg px-2 text-sm font-bold text-slate-500 transition hover:bg-white hover:text-slate-900"
        >
          ← Back to profile
        </Link>

        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-rose-500">
            Lost item recovery
          </p>

          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950">
            Responses Received
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Review people who have reported finding your lost items. Approve
            the response that matches your item, then confirm receipt after
            the finder hands it over.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-600">
              Pending
            </p>

            <p className="mt-1 text-2xl font-extrabold text-amber-900">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
              Approved
            </p>

            <p className="mt-1 text-2xl font-extrabold text-emerald-900">
              {approvedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-sky-600">
              Completed
            </p>

            <p className="mt-1 text-2xl font-extrabold text-sky-900">
              {completedCount}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        {responses.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-2xl">
              🔎
            </div>

            <h2 className="mt-4 text-lg font-extrabold text-slate-950">
              No responses yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              When someone finds one of your lost items and submits a response,
              it will appear here.
            </p>

            <Link
              to="/profile/reports"
              className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              View my reports
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {responses.map((response) => (
              <div key={response._id}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <Link
                    to={`/reports/${response.report?._id}`}
                    className="text-sm font-bold text-slate-700 hover:text-emerald-600"
                  >
                    {response.report?.title || "Lost report"}
                  </Link>

                  <span className="text-xs font-medium text-slate-400">
                    {response.report?.category || ""}
                  </span>
                </div>

                <ResponseCard
                  response={response}
                  onStatusChange={handleStatusChange}
                  onConfirmReceipt={handleConfirmReceipt}
                  loadingAction={loadingAction}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}