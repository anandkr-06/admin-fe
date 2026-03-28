"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api.client";
import LearnersTable from "./LearnersTable";

export default function LearnersPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  async function fetchData() {
    setLoading(true);

    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search && { search }),
      });

      const json = await apiFetch(`/learners?${query.toString()}`);

      setData({
        data: json.data || [],
        meta: json.meta || {
          page: 1,
          totalPages: 1,
          total: 0,
        },
      });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [page, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Learners</h1>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-96 px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Table */}
      {loading ? (
        <div className="p-6 text-gray-500">Loading...</div>
      ) : (
        <LearnersTable learners={data?.data || []} />
      )}

      {/* ✅ Pagination (ONLY HERE) */}
      {data?.meta && (
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            Page {data.meta.page} of {data.meta.totalPages}
          </div>

          <div className="flex gap-2">
            <button
              disabled={data.meta.page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={data.meta.page === data.meta.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}