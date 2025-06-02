"use client";

import { useState } from "react";
import { createGuestUser } from "@/lib/actions";

export default function GuestLoginBtn() {
  const [loading, setLoading] = useState(false);

  const handleGuest = async () => {
    setLoading(true);
    await createGuestUser();
    setLoading(false);
  };

  return (
    <button
      onClick={handleGuest}
      disabled={loading}
      className={`rounded-md w-40 h-8 ${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#FF495C]"
      } text-white`}
    >
      {loading ? "Logging in..." : "Try it out as a guest"}
    </button>
  );
}
