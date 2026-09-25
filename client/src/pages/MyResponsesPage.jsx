import { useEffect, useState } from "react";

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
  onConfirmHandover,
  loadingAction,
}) {
  const report = response.report;

  const isPending = response.status === "pending";
  const isApproved = response.status === "approved";
  const isRejected = response.status === "rejected";
  const isCompleted = response.status === "completed";

  const handoverConfirmed = Boolean(response.finderConfirmedAt);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Lost item
          </p>

          <h2 className="mt-1 text-lg font-extrabold text-slate-950">
            {report?.title || "Lost report"}
          </h2>
        </div>

        <StatusBadge status={response.status} />
      </div>

      {report && (
        <div className="mt-4 flex flex-wrap gap-2">
          {report.category && (
            <span className="inline-flex min-h-7 items-center rounded-full border border-slate-200 bg-slate-50 px-3 text-xs font-bold capitalize text-slate-600">
              {report.category}
            </span>
          )}

          <span className="inline-flex min-h-7 items-center rounded-full border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-600">
            LOST
          </span>
        </div>
      )}

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          Your message
        </p>

        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {response.message}
        </p>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Submitted
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
            {handoverConfirmed
              ? "Handover confirmed"
              : isApproved
                ? "Waiting for you"
                : "Not started"}
          </p>
        </div>
      </div>

      {isPending && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-bold text-amber-900">
            Waiting for the owner
          </p>

          <p className="mt-1 text-sm leading-5 text-amber-700">
            The owner is reviewing your response. You can proceed with the
            handover only after they approve it.
          </p>
        </div>
      )}

      {isApproved && !handoverConfirmed && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-bold text-emerald-900">
            Your response was approved
          </p>

          <p className="mt-1 text-sm leading-5 text-emerald-700">
            Coordinate with the owner and hand over the item. Confirm the
            handover only after you have actually given the item to them.
          </p>

          <button
            type="button"
            disabled={Boolean(loadingAction)}
            onClick={() => onConfirmHandover(response._id)}
            className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loadingAction === `handover-${response._id}`
              ? "Confirming..."
              : "I Handed Over the Item"}
          </button>
        </div>
      )}

      {isApproved && handoverConfirmed && (
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-bold text-blue-950">
            Handover confirmed
          </p>

          <p className="mt-1 text-sm leading-5 text-blue-700">
            You confirmed handing over the item. The owner now needs to
            confirm that they received it.
          </p>
        </div>
      )}

      {isRejected && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm font-bold text-rose-900">
            Response rejected
          </p>

          <p className="mt-1 text-sm leading-5 text-rose-700">
            The owner did not select this response for the item.
          </p>
        </div>
      )}

      {isCompleted && (
        <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4">
          <p className="text-sm font-bold text-sky-950">
            Item returned successfully
          </p>

          <p className="mt-1 text-sm leading-5 text-sky-700">
            The owner confirmed receiving the item. This recovery is complete.
          </p>
        </div>
      )}

      {report?._id && (
        <Link
          to={`/reports/${report._id}`}
          className="mt-4 inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          View Report
        </Link>
      )}
    </article>
  );
}

export default function MyResponsesPage() {
  const [responses, setResponses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [loadingAction, setLoadingAction] = useState("");

  useEffect(() => {
    async function loadResponses() {
      try {
        setLoading(true);
        setError("");

        const payload = await apiRequest("/responses/my");

        const sortedResponses = [...(payload.responses || [])].sort(
          (first, second) =>
            new Date(second.createdAt) -
            new Date(first.createdAt),
        );

        setResponses(sortedResponses);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadResponses();
  }, []);

  async function handleConfirmHandover(responseId) {
    try {
      setLoadingAction(`handover-${responseId}`);
      setError("");

      const payload = await apiRequest(
        `/responses/${responseId}/handover`,
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
          };
        }),
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingAction("");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f8fb]">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:px-8">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-slate-200" />

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
            My Responses
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Track responses you submitted for lost items and complete the
            handover when the owner approves your response.
          </p>
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
              When you find someone's lost item and send a response, it will
              appear here.
            </p>

            <Link
              to="/?reports=1"
              className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Browse lost items
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {responses.map((response) => (
              <ResponseCard
                key={response._id}
                response={response}
                onConfirmHandover={handleConfirmHandover}
                loadingAction={loadingAction}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}