"use client";

import { authenticate } from "@/lib/actions/authentication";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/calendar";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <div className="w-96">
      <form
        action={formAction}
        className="flex flex-col border-solid border-2 p-8 bg-white"
      >
        <label htmlFor="login-email">E-mail</label>
        <input
          id="login-email"
          className="border-solid border-2 h-10"
          type="text"
          name="email"
        ></input>
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          className="border-solid border-2 h-10"
          name="password"
          type="password"
        ></input>
        <input type="hidden" name="redirectTo" value={callbackUrl} />

        {!isPending && (
          <button
            type="submit"
            aria-disabled={isPending}
            disabled={isPending}
            className="border-solid border-2 mt-8 w-1/2 mx-auto h-8 bg-[#1574E9] text-white font-bold rounded-md"
          >
            LogIn
          </button>
        )}

        {isPending && (
          <button
            className="text-white bg-gray-400 cursor-not-allowed border-solid border-2 mt-8 w-1/2 mx-auto h-8 font-bold rounded-md"
            disabled
          >
            Logging in...
          </button>
        )}

        <div className="mt-7">
          Don&apos;t have an account?{" "}
          <Link
            className="underline text-blue-500 hover:text-blue-300"
            href="/register"
          >
            Register
          </Link>
        </div>
        {errorMessage && <>Error: {errorMessage}</>}
      </form>
    </div>
  );
};

export default LoginForm;
