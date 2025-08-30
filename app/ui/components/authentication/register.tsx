"use client";

import { signIn } from "@/auth";
import { register } from "@/lib/actions/authentication";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";

const RegisterForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/calendar";
  const [retMessage, formAction, isPending] = useActionState(
    register,
    undefined
  );

  useEffect(() => {
    if (retMessage?.success) {
      signIn("credentials", {
        email: retMessage.signInInfo?.email,
        password: retMessage.signInInfo?.password,
        callbackUrl,
      });
    }
  }, [callbackUrl, retMessage]);

  return (
    <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-md p-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Create your account
      </h2>

      <form className="flex flex-col space-y-5" action={formAction}>
        {/* Email */}
        <div className="flex flex-col">
          <label
            htmlFor="register-email"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            E-mail
          </label>
          <input
            id="register-email"
            className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            type="email"
            name="email"
            placeholder="you@example.com"
            required
          />
          {retMessage?.errors?.email && (
            <>
              <span className="sr-only">Error:</span>
              <ul className="mt-1 text-sm text-red-600 list-disc list-inside">
                {retMessage.errors.email.map((msg, index) => (
                  <li key={index}>{msg};</li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label
            htmlFor="register-password"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="register-password"
            className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            minLength={8}
          />
          {retMessage?.errors?.password && (
            <>
              <span className="sr-only">Error:</span>
              <ul className="mt-1 text-sm text-red-600 list-disc list-inside">
                {retMessage.errors.password.map((msg, index) => (
                  <li key={index}>{msg};</li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col">
          <label
            htmlFor="register-password-confirm"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password
          </label>
          <input
            id="register-password-confirm"
            className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            minLength={8}
          />
          {retMessage?.errors?.confirmPassword && (
            <>
              <span className="sr-only">Error:</span>
              <ul className="mt-1 text-sm text-red-600 list-disc list-inside">
                {retMessage.errors.confirmPassword.map((msg, index) => (
                  <li key={index}>{msg};</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <input type="hidden" name="redirectTo" value={callbackUrl} />

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className={clsx(
            "h-10 w-full rounded-md font-semibold transition",
            isPending
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-[#1574E9] hover:bg-[#0f63c7] text-white"
          )}
        >
          {isPending ? "Registering..." : "Register"}
        </button>

        {/* General errors */}
        {retMessage?.errors?.general && (
          <div
            className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            role="alert"
            aria-live="polite"
            aria-atomic="true"
          >
            Error:{" "}
            <ul className="list-disc list-inside">
              {retMessage.errors.general.map((msg, index) => (
                <li key={index}>{msg};</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterForm;
