"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LearnerFilters() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  function applyFilters() {
    const query = new URLSearchParams({
      ...(firstName && { firstName }),
      ...(email && { email }),
    });

    router.push(`/admin/learners?${query.toString()}`);
  }

  return (
    <div className="flex gap-3 rounded-xl border bg-white p-4 shadow-sm">
      <input
        className="rounded-lg border px-3 py-2"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={applyFilters}
        className="rounded-lg bg-black px-4 py-2 text-white"
      >
        Apply
      </button>
    </div>
  );
}
