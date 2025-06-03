"use client";

import { useState } from "react";

export default function GuestLoginBtn() {
  const [loading, setLoading] = useState(false);

  const handleGuest = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/guest-login", {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        window.location.href = "/calendar";
        return;
      } else {
        alert("Oops, something went wrong, please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Oops, something went wrong, please try again.");
    } finally {
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
