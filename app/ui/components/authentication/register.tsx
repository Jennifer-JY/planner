"use client";

import { signIn } from "@/auth";
import { register } from "@/lib/actions";
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
        callbackUrl: callbackUrl,
      });
    }
  }, [callbackUrl, retMessage]);

  return (
    <div className="w-96">
      <form
        className="flex flex-col border-solid border-2 p-8 bg-white"
        action={formAction}
      >
        <label htmlFor="register-email">E-mail</label>
        <input
          id="register-email"
          className="border-solid border-2 h-10"
          type="text"
          name="email"
        ></input>
        {retMessage?.errors?.email && (
          <>
            Error:{" "}
            {retMessage.errors.email.map((msg, index) => (
              <div className="text-red-500 text-sm mt-1" key={index}>
                {msg};
              </div>
            ))}
          </>
        )}

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          className="border-solid border-2 h-10"
          name="password"
        ></input>
        {retMessage?.errors?.password && (
          <>
            Error:{" "}
            {retMessage.errors.password.map((msg, index) => (
              <div className="text-red-500 text-sm mt-1" key={index}>
                {msg};
              </div>
            ))}
          </>
        )}

        <label htmlFor="register-password-confirm">Confirm Password</label>
        <input
          id="register-password-confirm"
          className="border-solid border-2 h-10"
          name="confirmPassword"
        ></input>
        {retMessage?.errors?.confirmPassword && (
          <>
            Error:{" "}
            {retMessage.errors.confirmPassword.map((msg, index) => (
              <div className="text-red-500 text-sm mt-1" key={index}>
                {msg};
              </div>
            ))}
          </>
        )}

        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <button
          type="submit"
          aria-disabled={isPending}
          className="border-solid border-2 mt-8 w-1/2 mx-auto h-8 bg-[#1574E9] text-white font-bold rounded-md"
        >
          Register
        </button>
        {retMessage?.errors?.general && (
          <>
            Error:{" "}
            {retMessage.errors.general.map((msg, index) => (
              <div className="text-red-500 text-sm mt-1" key={index}>
                {msg};
              </div>
            ))}
          </>
        )}
      </form>
    </div>
  );
};

export default RegisterForm;
