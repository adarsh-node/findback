import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { apiRequest } from "../api.js";
import { useAuth } from "../hooks/useAuth.js";

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

function CreateReportPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const searchParams = new URLSearchParams(window.location.search);
  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);

  const [form, setForm] = useState({
    type: "lost",
    title: "",
    category: "other",
    description: "",
    date: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(isEditMode);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    async function loadReport() {
      try {
        setLoadingReport(true);
        setError("");

        const payload = await apiRequest(`/reports/${editId}`);
        const report = payload.report;

        const reportOwnerId =
          typeof report.user === "object" ? report.user?._id : report.user;

        const currentUserId = user?._id || user?.id;

        if (
          !currentUserId ||
          !reportOwnerId ||
          currentUserId !== reportOwnerId
        ) {
          setError("You are not allowed to edit this report.");
          return;
        }

        if (report.status !== "active") {
          setError("Only active reports can be edited.");
          return;
        }

        setForm({
          type: report.type || "lost",
          title: report.title || "",
          category: report.category || "other",
          description: report.description || "",
          date: report.date
            ? new Date(report.date).toISOString().slice(0, 10)
            : "",
          address: report.location?.address || "",
          latitude: report.location?.point?.coordinates?.[1] ?? "",
          longitude: report.location?.point?.coordinates?.[0] ?? "",
        });
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoadingReport(false);
      }
    }

    loadReport();
  }, [editId, isEditMode, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImagesChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length > 5) {
      setError("You can upload a maximum of 5 images.");
      return;
    }

    setError("");
    setImages(selectedFiles);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setSuccess("");
      setLoading(true);

      const latitude = Number(form.latitude);
      const longitude = Number(form.longitude);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        throw new Error("Please enter valid latitude and longitude.");
      }

      if (isEditMode) {
        await apiRequest(`/reports/${editId}`, {
          method: "PATCH",
          body: JSON.stringify({
            type: form.type,
            title: form.title,
            category: form.category,
            description: form.description,
            date: form.date,
            location: {
              address: form.address,
              point: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
            },
          }),
        });

        setSuccess("Report updated successfully.");

        setTimeout(() => {
          navigate(`/reports/${editId}`);
        }, 500);

        return;
      }

      const formData = new FormData();

      formData.append("type", form.type);
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("date", form.date);

      formData.append(
        "location",
        JSON.stringify({
          address: form.address,
          point: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        }),
      );

      images.forEach((image) => {
        formData.append("images", image);
      });

      await apiRequest("/reports", {
        method: "POST",
        body: formData,
      });

      setSuccess("Report created successfully.");

      setForm({
        type: "lost",
        title: "",
        category: "other",
        description: "",
        date: "",
        address: "",
        latitude: "",
        longitude: "",
      });

      setImages([]);

      event.target.reset();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingReport) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Loading report...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? "Edit Report" : "Create a Report"}
          </h1>

          <p className="mt-2 text-gray-600">
            {isEditMode
              ? "Update the details of your report."
              : "Report a lost or found item to help get it back to its owner."}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Report Type
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({ ...current, type: "lost" }))
                }
                className={`rounded-lg border px-4 py-3 font-medium ${
                  form.type === "lost"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                I Lost Something
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({ ...current, type: "found" }))
                }
                className={`rounded-lg border px-4 py-3 font-medium ${
                  form.type === "found"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                I Found Something
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Item Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Black leather wallet"
              minLength={3}
              maxLength={100}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Category
            </label>

            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the item, identifying details, color, brand, etc."
              minLength={10}
              maxLength={2000}
              rows={5}
              required
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Date
            </label>

            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Location / Address
            </label>

            <input
              id="address"
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              placeholder="e.g. Majestic Metro Station, Bangalore"
              maxLength={300}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="latitude"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Latitude
              </label>

              <input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                value={form.latitude}
                onChange={handleChange}
                placeholder="12.9716"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="longitude"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Longitude
              </label>

              <input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                value={form.longitude}
                onChange={handleChange}
                placeholder="77.5946"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {!isEditMode && (
            <div>
              <label
                htmlFor="images"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Images
              </label>

              <input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />

              <p className="mt-2 text-sm text-gray-500">
                You can upload up to 5 images. Each image must be 5 MB or less.
              </p>

              {images.length > 0 && (
                <p className="mt-2 text-sm text-gray-700">
                  {images.length} image{images.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          )}

          {isEditMode && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Existing images will remain unchanged.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? isEditMode
                ? "Updating Report..."
                : "Creating Report..."
              : isEditMode
                ? "Update Report"
                : "Create Report"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default CreateReportPage;
