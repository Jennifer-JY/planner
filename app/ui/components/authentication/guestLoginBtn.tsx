"use client";

import { createGuestUser } from "@/lib/actions";

export default function GuestLoginBtn() {
  const handleGuest = async () => {
    await createGuestUser();
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
