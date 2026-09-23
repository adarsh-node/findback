import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import { apiRequest } from "../api.js";

const categories = [
  "electronics",
  "documents",
  "wallet-money",
  "bags",
  "keys",
  "jewelry",
  "clothing",
  "vehicles",
  "pets",
  "other",
];

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

const categoryIcons = {
  electronics: "📱",
  documents: "📄",
  "wallet-money": "💳",
  bags: "🎒",
  keys: "🔑",
  jewelry: "💍",
  clothing: "👕",
  vehicles: "🚲",
  pets: "🐾",
  other: "📦",
};

function ReportCard({ report }) {
  const image = report.images?.[0]?.url;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,23,42,0.09)]">
      {image ? (
        <img
          src={image}
          alt={report.title}
          className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="grid h-56 place-items-center bg-slate-100 text-sm font-medium text-slate-400">
          No image available
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide ${
              report.type === "lost"
                ? "bg-rose-50 text-rose-600"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {report.type === "lost" ? "LOST" : "FOUND"}
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-500">
            {report.status}
          </span>
        </div>

        <h3 className="mt-4 line-clamp-1 text-lg font-bold text-slate-900">
          {report.title}
        </h3>

        <p className="mt-1 text-sm font-medium text-slate-500">
          {categoryLabels[report.category] || report.category}
        </p>

        <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-slate-600">
          {report.description}
        </p>

        <div className="mt-4 space-y-2 text-sm text-slate-500">
          <p className="line-clamp-1">
            <span className="mr-2">📍</span>
            {report.location?.address}
          </p>

          <p>
            <span className="mr-2">📅</span>
            {new Date(report.date).toLocaleDateString()}
          </p>
        </div>

        <Link
          to={`/reports/${report._id}`}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          View report
        </Link>
      </div>
    </article>
  );
}

export default function HomePage() {
  const { user, logout } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalReports: 0,
  });

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        params.set("page", page);
        params.set("limit", "6");

        if (search) {
          params.set("search", search);
        }

        if (type) {
          params.set("type", type);
        }

        if (category) {
          params.set("category", category);
        }

        const payload = await apiRequest(`/reports?${params.toString()}`);

        setReports(payload.reports || []);
        setPagination(
          payload.pagination || {
            page: 1,
            totalPages: 1,
            totalReports: 0,
          },
        );
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [page, search, type, category]);

  const scrollToReports = () => {
    document.getElementById("reports")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());

    requestAnimationFrame(() => {
      scrollToReports();
    });
  };

  const handleTypeChange = (event) => {
    setPage(1);
    setType(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setPage(1);
    setCategory(event.target.value);
  };

  const handleReset = () => {
    setSearchInput("");
    setSearch("");
    setType("");
    setCategory("");
    setPage(1);
  };

  const handleHeroTypeFilter = (selectedType) => {
    setSearchInput("");
    setSearch("");
    setCategory("");
    setType(selectedType);
    setPage(1);

    requestAnimationFrame(() => {
      scrollToReports();
    });
  };

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-lg font-black text-white shadow-sm">
              F
            </span>

            <div>
              <p className="text-lg font-extrabold tracking-tight text-slate-950">
                FindBack
              </p>

              <p className="hidden text-[11px] font-medium text-slate-400 sm:block">
                Lost & found, connected
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/reports/new"
                  className="hidden min-h-10 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700 sm:inline-flex"
                >
                  Report an item
                </Link>

                <Link
                  to="/profile"
                  className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Profile
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="hidden min-h-10 items-center justify-center rounded-xl px-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 sm:inline-flex"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex min-h-10 items-center justify-center rounded-xl px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="inline-flex min-h-10 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  Create account
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Find it. Claim it. Bring it back.
            </span>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Lost something?
              <span className="block text-emerald-600">
                Let's help you find it.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Search lost and found reports from the community, or report an
              item you've lost or found.
            </p>

            <form
              onSubmit={handleSearch}
              className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_12px_40px_rgba(15,23,42,0.10)] sm:flex-row"
            >
              <div className="flex min-w-0 flex-1 items-center rounded-xl bg-slate-50 px-4">
                <span className="mr-3 text-lg text-slate-400">⌕</span>

                <input
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search for wallets, bags, phones, keys..."
                  className="min-h-12 min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
                />
              </div>

              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-600 px-7 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Search
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleHeroTypeFilter("lost")}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-5 text-sm font-bold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
              >
                I lost something
              </button>

              <button
                type="button"
                onClick={() => handleHeroTypeFilter("found")}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-5 text-sm font-bold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
              >
                I found something
              </button>

              {user && (
                <Link
                  to="/reports/new"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  + Report an item
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
              Browse
            </p>

            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">
              Browse by category
            </h2>
          </div>

          {(type || category || search) && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            >
              <span>↻</span>
              Reset filters
            </button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5 lg:grid-cols-10">
          {categories.map((itemCategory) => {
            const selected = category === itemCategory;

            return (
              <button
                key={itemCategory}
                type="button"
                onClick={() => {
                  setCategory(selected ? "" : itemCategory);
                  setPage(1);

                  requestAnimationFrame(() => {
                    scrollToReports();
                  });
                }}
                className={`group flex min-h-24 flex-col items-center justify-center rounded-2xl border px-3 py-4 transition ${
                  selected
                    ? "border-emerald-200 bg-emerald-50 shadow-sm"
                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/50"
                }`}
              >
                <span className="text-2xl transition group-hover:scale-110">
                  {categoryIcons[itemCategory]}
                </span>

                <span
                  className={`mt-2 text-xs font-bold ${
                    selected ? "text-emerald-700" : "text-slate-600"
                  }`}
                >
                  {categoryLabels[itemCategory]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Reports */}
      <section
        id="reports"
        className="scroll-mt-24 mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.04)] sm:p-7">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
                Community
              </p>

              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">
                Lost & found reports
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Search and filter reports to find what you're looking for.
              </p>
            </div>

            {!loading && !error && (
              <p className="text-sm font-semibold text-slate-500">
                {pagination.totalReports}{" "}
                {pagination.totalReports === 1 ? "report" : "reports"}
              </p>
            )}
          </div>

          {/* Filters */}
          <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_180px_200px_auto]">
            <form
              onSubmit={handleSearch}
              className="flex min-w-0 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 focus-within:border-emerald-400 focus-within:bg-white"
            >
              <span className="mr-3 text-slate-400">⌕</span>

              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search reports..."
                className="min-h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                className="ml-2 inline-flex min-h-9 items-center justify-center rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-700"
              >
                Search
              </button>
            </form>

            <select
              value={type}
              onChange={handleTypeChange}
              className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold capitalize text-slate-700 outline-none focus:border-emerald-400"
            >
              <option value="">All reports</option>
              <option value="lost">Lost items</option>
              <option value="found">Found items</option>
            </select>

            <select
              value={category}
              onChange={handleCategoryChange}
              className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400"
            >
              <option value="">All categories</option>

              {categories.map((itemCategory) => (
                <option key={itemCategory} value={itemCategory}>
                  {categoryLabels[itemCategory]}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            >
              <span className="text-base">↻</span>
              Reset filters
            </button>
          </div>

          {/* Content */}
          <div className="mt-8">
            {loading && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <div className="h-56 animate-pulse bg-slate-100" />

                    <div className="space-y-4 p-5">
                      <div className="h-5 w-20 animate-pulse rounded bg-slate-100" />
                      <div className="h-6 w-3/4 animate-pulse rounded bg-slate-100" />
                      <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                      <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                      <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
                <p className="font-bold">Something went wrong</p>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            )}

            {!loading && !error && reports.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-2xl shadow-sm">
                  🔎
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  No matching reports
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Try a different search term or remove one of the filters to
                  see more reports.
                </p>

                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white hover:bg-slate-800"
                >
                  <span>↻</span>
                  Clear filters
                </button>
              </div>
            )}

            {!loading && !error && reports.length > 0 && (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {reports.map((report) => (
                    <ReportCard key={report._id} report={report} />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((current) => current - 1)}
                      className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <span className="min-w-24 text-center text-sm font-semibold text-slate-500">
                      {pagination.page} / {pagination.totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={page >= pagination.totalPages}
                      onClick={() => setPage((current) => current + 1)}
                      className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      {!user && (
        <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-center text-white sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
              Help someone get it back
            </p>

            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold tracking-tight">
              Found something that belongs to someone else?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300">
              Create an account and post the item so its owner has a chance to
              find it.
            </p>

            <Link
              to="/register"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-500 px-6 text-sm font-bold text-white transition hover:bg-emerald-400"
            >
              Get started
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
