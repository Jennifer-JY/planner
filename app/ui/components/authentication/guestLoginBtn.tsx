"use client";
import { signIn } from "@/auth";
import { createGuestUser } from "@/lib/actions";

export default function GuestLoginBtn() {
  const email = process.env.NEXT_PUBLIC_GUEST_EMAIL!;
  const password = process.env.NEXT_PUBLIC_GUEST_PASSWORD!;

  const handleGuest = async () => {
    await createGuestUser(email, password);
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/calendar",
    });
  };
  return (
    <>
      <button
        onClick={handleGuest}
        className="bg-[#FF495C] text-white rounded-md w-40 h-8"
      >
        Try it out as a guest
      </button>
    </>
  );
}
