import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiRequest } from "../api.js";

function ReportCard({ report }) {
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

          <h2 className="mt-4 text-xl font-extrabold tracking-tight text-slate-950">
            {report.title}
          </h2>

          {report.category && (
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                {report.category}
              </span>
            </div>
          )}

          {report.description && (
            <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
              {report.description}
            </p>
          )}
        </div>

        <Link
          to={`/reports/${report._id}`}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
        >
          View Report
        </Link>
      </div>
    </article>
  );
}

export default function MyReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      setLoading(true);
      setError("");

      const payload = await apiRequest("/reports/my");

      setReports(payload.reports || []);
    } catch (requestError) {
      setError(
        requestError.message || "Failed to load your reports.",
      );
    } finally {
      setLoading(false);
    }
  }

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
          <div className="mb-6">
            <h1 className="text-3xl font-black tracking-tight text-slate-950">
              My Reports
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              All lost and found reports you have created.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Loading your reports...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
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
            <div className="space-y-5">
              {reports.map((report) => (
                <ReportCard
                  key={report._id}
                  report={report}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}