"use client";

import { authenticate } from "@/lib/actions/authentication";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/calendar";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-1/2 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Log in
        </h2>

        <form action={formAction} className="flex flex-col space-y-5">
          {/* Email */}
          <div className="flex flex-col">
            <label
              htmlFor="login-email"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              E-mail
            </label>
            <input
              id="login-email"
              className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label
              htmlFor="login-password"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-2 px-2 text-sm text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={callbackUrl} />

          {/* Submit */}
          <button
            type="submit"
            aria-disabled={isPending}
            disabled={isPending}
            className="h-10 w-full rounded-md bg-[#1574E9] hover:bg-[#0f63c7] text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Error */}
        {errorMessage && (
          <div
            className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            role="alert"
            aria-live="polite"
            aria-atomic="true"
          >
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-2 my-6">
          <div className="flex-1 border-t border-gray-300" />
          <span className="text-sm text-gray-400">OR</span>
          <div className="flex-1 border-t border-gray-300" />
        </div>

        {/* Register link */}
        <div className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            className="text-blue-600 font-medium hover:underline"
            href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
