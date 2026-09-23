import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router";

import { apiRequest } from "../api.js";

import { useAuth } from "../hooks/useAuth.js";

const categoryLabels = {
  electronics: "Electronics",
  documents: "Documents",
  "wallet-money": "Wallets & Money",
  bags: "Bags",
  keys: "Keys",
  jewelry: "Jewelry",
  clothing: "Clothing",
  vehicles: "Vehicles",
  pets: "Pets",
  other: "Other",
};

function StatusBadge({ status }) {
  const styles = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    claimed: "bg-amber-50 text-amber-700 border-amber-200",
    returned: "bg-sky-50 text-sky-700 border-sky-200",
    closed: "bg-slate-100 text-slate-600 border-slate-200",
    matched: "bg-violet-50 text-violet-700 border-violet-200",
  };

  return (
    <span
      className={`inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-bold capitalize ${
        styles[status] || "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      {status}
    </span>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-start gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-base shadow-sm">
          {icon}
        </span>

        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-0.5 break-words text-sm font-semibold leading-5 text-slate-800">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ReportDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);

  const [claimMessage, setClaimMessage] = useState("");
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState("");
  const [claimSuccess, setClaimSuccess] = useState("");

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
        setError("");

        const payload = await apiRequest(`/reports/${id}`);

        setReport(payload.report);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [id]);

  async function handleClaimSubmit(event) {
    event.preventDefault();

    try {
      setClaimLoading(true);
      setClaimError("");
      setClaimSuccess("");

      const payload = await apiRequest(`/claims/${id}`, {
        method: "POST",
        body: JSON.stringify({
          message: claimMessage,
        }),
      });

      setClaimSuccess(payload.message);
      setClaimMessage("");
    } catch (requestError) {
      setClaimError(requestError.message);
    } finally {
      setClaimLoading(false);
    }
  }

  async function handleDeleteReport() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await apiRequest(`/reports/${report._id}`, {
        method: "DELETE",
      });

      navigate("/?reports=1");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f8fb]">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
          <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="h-[400px] animate-pulse rounded-3xl bg-slate-200" />

            <div className="space-y-3">
              <div className="h-8 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-20 animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-28 animate-pulse rounded-2xl bg-slate-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
            <p className="font-bold">Unable to load this report</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>

          <Link
            to="/?reports=1"
            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-bold text-white hover:bg-slate-800"
          >
            ← Back to reports
          </Link>
        </div>
      </main>
    );
  }

  if (!report) {
    return null;
  }

  const images = report.images || [];
  const mainImage = images[selectedImage]?.url;

  const reportOwnerId =
    typeof report.user === "object" ? report.user?._id : report.user;

  const currentUserId = user?._id || user?.id;

  const isOwner =
    Boolean(currentUserId) &&
    Boolean(reportOwnerId) &&
    currentUserId === reportOwnerId;

  const canClaim = Boolean(user) && !isOwner && report.status === "active";

  const category = categoryLabels[report.category] || report.category;

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
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

          <div className="flex items-center gap-2">
            <Link
              to="/?reports=1"
              className="inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 sm:px-4 sm:text-sm"
            >
              Browse reports
            </Link>

            {user && (
              <Link
                to="/profile"
                className="hidden min-h-9 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-800 sm:inline-flex"
              >
                Profile
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          to="/?reports=1"
          className="inline-flex min-h-8 items-center rounded-lg px-2 text-sm font-bold text-slate-500 transition hover:bg-white hover:text-slate-900"
        >
          ← Back to reports
        </Link>

        {/* Main */}
        <div className="mt-3 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Gallery */}
          <section>
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
              <div className="relative bg-slate-100">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={report.title}
                    className="h-[300px] w-full object-cover sm:h-[360px] lg:h-[500px]"
                  />
                ) : (
                  <div className="grid h-[300px] place-items-center text-sm font-medium text-slate-400 sm:h-[360px] lg:h-[430px]">
                    No image available
                  </div>
                )}

                {/* LOST / FOUND badge stays on image */}
                <div className="absolute left-4 top-4">
                  <span
                    className={`inline-flex min-h-8 items-center rounded-full px-3.5 text-xs font-black tracking-wide shadow-sm ${
                      report.type === "lost"
                        ? "bg-rose-500 text-white"
                        : "bg-emerald-500 text-white"
                    }`}
                  >
                    {report.type === "lost" ? "LOST ITEM" : "FOUND ITEM"}
                  </span>
                </div>
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2.5 p-3 sm:grid-cols-5">
                  {images.map((image, index) => (
                    <button
                      key={image.publicId}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`overflow-hidden rounded-lg border-2 ${
                        selectedImage === index
                          ? "border-emerald-500"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${report.title} ${index + 1}`}
                        className="h-16 w-full object-cover sm:h-18"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Details */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={`inline-flex min-h-8 items-center rounded-full px-3.5 text-xs font-black tracking-wide ${
                  report.type === "lost"
                    ? "bg-rose-50 text-rose-600"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {report.type === "lost" ? "LOST" : "FOUND"}
              </span>

              <StatusBadge status={report.status} />
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              {report.title}
            </h1>

            {/* Category badge */}
            <span className="mt-2 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              {category}
            </span>

            {/* Description */}
            <div className="mt-5">
              <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Description
              </h2>

              <p className="mt-2 whitespace-pre-wrap text-[15px] leading-6 text-slate-700">
                {report.description}
              </p>
            </div>

            {/* Info */}
            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              <InfoCard
                icon="📅"
                label="Date"
                value={new Date(report.date).toLocaleDateString()}
              />

              <InfoCard
                icon="📍"
                label="Location"
                value={report.location?.address}
              />
            </div>

            {/* Coordinates */}
            {report.location?.point?.coordinates && (
              <div className="mt-2.5 grid gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-start gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-base shadow-sm">
                    📌
                  </span>

                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Coordinates
                    </p>

                    <p className="mt-0.5 break-words text-sm font-semibold leading-5 text-slate-800">
                      {report.location.point.coordinates[1]},{" "}
                      {report.location.point.coordinates[0]}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Claim */}
            <div className="mt-5 border-t border-slate-200 pt-5">
              {!user && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-lg shadow-sm">
                      🔐
                    </div>

                    <h2 className="text-base font-extrabold text-slate-900">
                      Is this your item?
                    </h2>
                  </div>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    Log in to submit a claim and explain why you believe this
                    item belongs to you.
                  </p>

                  <Link
                    to="/login"
                    className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    Log in to claim
                  </Link>
                </div>
              )}

              {isOwner && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-center gap-2">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-lg shadow-sm">
                      👤
                    </div>

                    <h2 className="text-base font-extrabold text-blue-950">
                      This is your report
                    </h2>
                  </div>

                  <p className="mt-1 text-sm leading-5 text-blue-700">
                    Claims from other users will appear in your profile.
                  </p>

                  {report.status === "active" && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        to={`/reports/new?edit=${report._id}`}
                        className="inline-flex min-h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700"
                      >
                        Edit Report
                      </Link>

                      <button
                        type="button"
                        onClick={handleDeleteReport}
                        className="inline-flex min-h-9 items-center justify-center rounded-lg border border-rose-200 bg-white px-4 text-sm font-bold text-rose-600 transition hover:bg-rose-50"
                      >
                        Delete Report
                      </button>
                    </div>
                  )}

                  {report.status !== "active" && (
                    <p className="mt-3 text-sm font-medium text-blue-700">
                      This report can no longer be edited or deleted because
                      its status is {report.status}.
                    </p>
                  )}

                  <Link
                    to="/profile"
                    className="mt-3 inline-flex min-h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    View my profile
                  </Link>
                </div>
              )}

              {canClaim && (
                <form onSubmit={handleClaimSubmit}>
                  <div>
                    <span className="inline-flex min-h-7 items-center rounded-full bg-emerald-50 px-3 text-xs font-bold text-emerald-700">
                      This item is available
                    </span>

                    <h2 className="mt-3 text-lg font-extrabold text-slate-950">
                      Think this is yours?
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Tell the owner something only the real owner would know.
                      This helps them verify your claim.
                    </p>
                  </div>

                  <label
                    htmlFor="claim-message"
                    className="mt-4 block text-sm font-bold text-slate-700"
                  >
                    Why is this your item?
                  </label>

                  <textarea
                    id="claim-message"
                    value={claimMessage}
                    onChange={(event) => setClaimMessage(event.target.value)}
                    placeholder="Example: This is my backpack. It has a small blue keychain attached to the zipper."
                    minLength={10}
                    maxLength={1000}
                    required
                    rows={3}
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-5 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                  />

                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Minimum 10 characters
                    </span>

                    <span className="text-xs font-medium text-slate-400">
                      {claimMessage.length}/1000
                    </span>
                  </div>

                  {claimError && (
                    <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
                      {claimError}
                    </div>
                  )}

                  {claimSuccess && (
                    <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                      {claimSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={claimLoading}
                    className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {claimLoading ? "Submitting claim..." : "Submit claim"}
                  </button>
                </form>
              )}

              {user && !isOwner && report.status !== "active" && (
                <div
                  className={`rounded-xl border p-4 ${
                    report.status === "returned"
                      ? "border-sky-200 bg-sky-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-lg shadow-sm">
                      {report.status === "returned" ? "✓" : "ℹ"}
                    </div>

                    <h2
                      className={`text-base font-extrabold ${
                        report.status === "returned"
                          ? "text-sky-950"
                          : "text-slate-900"
                      }`}
                    >
                      {report.status === "returned"
                        ? "This item has been returned"
                        : "Claims are no longer available"}
                    </h2>
                  </div>

                  <p
                    className={`mt-1 text-sm leading-5 ${
                      report.status === "returned"
                        ? "text-sky-700"
                        : "text-slate-600"
                    }`}
                  >
                    {report.status === "returned"
                      ? "This report has already been marked as returned to its owner."
                      : `This report is currently marked as ${report.status}.`}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}