"use client";

import { useState } from "react";
import { createGuestUser } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function GuestLoginBtn() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGuest = async () => {
    setLoading(true);
    const res = await createGuestUser();
    if (res.success) {
      router.push("/calendar");
      return;
    } else {
      alert("Opps, something went wrong, please try again.");
      setLoading(false);
    }
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
