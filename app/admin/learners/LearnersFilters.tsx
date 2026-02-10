"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LearnerFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const [search, setSearch] = useState(params.get("search") || "");
  const [status, setStatus] = useState(params.get("status") || "");
  const [role, setRole] = useState(params.get("role") || "");

  function applyFilters() {
    const query = new URLSearchParams({
      ...(search && { search }),
      ...(status && { status }),
      ...(role && { role }),
    });

    router.push(`/admin/learners?${query.toString()}`);
  }

  return (
    <div className="mb-4 flex gap-3">
      <input
        className="border p-2"
        placeholder="Search name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="border p-2"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      {/* <select
        className="border p-2"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="">All Roles</option>
        <option value="INSTRUCTOR">Instructor</option>
        <option value="ADMIN">Admin</option>
        <option value="MANAGER">Manager</option>
      </select> */}

      <button
        onClick={applyFilters}
        className="rounded bg-black px-4 py-2 text-white"
      >
        Apply
      </button>
    </div>
  );
}
