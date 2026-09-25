import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";

export default function AuthPage({ mode }) {
  const isRegistration = mode === "register";
  const navigate = useNavigate();
  const { user, login, register } = useAuth();

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (user) return <Navigate to="/profile" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData);

    try {
      if (isRegistration) {
        await register(values);
      } else {
        await login(values);
      }

      navigate("/profile");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-6 py-12 text-slate-900">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <Link
          className="text-sm font-semibold tracking-[0.24em] text-emerald-700"
          to="/"
        >
          FINDBACK
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight">
          {isRegistration ? "Create your account" : "Welcome back"}
        </h1>

        <p className="mt-2 text-slate-600">
          {isRegistration
            ? "Start with a secure FindBack profile."
            : "Log in to your FindBack account."}
        </p>

        {error && (
          <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {isRegistration && (
            <label className="block text-sm font-medium">
              Name
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                name="name"
                minLength="2"
                maxLength="100"
                required
              />
            </label>
          )}

          <label className="block text-sm font-medium">
            Email address
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </label>

          <label className="block text-sm font-medium">
            Password
            <div className="relative mt-1">
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-16"
                name="password"
                type={showPassword ? "text" : "password"}
                minLength="8"
                maxLength="72"
                autoComplete={
                  isRegistration ? "new-password" : "current-password"
                }
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-0 px-3 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button
            className="w-full rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? "Please wait…"
              : isRegistration
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {isRegistration ? "Already have an account?" : "New to FindBack?"}{" "}
          <Link
            className="font-semibold text-emerald-700 hover:text-emerald-800"
            to={isRegistration ? "/login" : "/register"}
          >
            {isRegistration ? "Log in" : "Create an account"}
          </Link>
        </p>
      </section>
    </main>
  );
}
