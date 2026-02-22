"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api.client";
import LearnersTable from "./LearnersTable";
import Filters from "./LearnersFilters";

export default function LearnersPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const json = await apiFetch("/learners?page=1&limit=10");

      setData({
        data: json.data || [],
        meta: {
          page: json.page || 1,
          limit: json.limit || 10,
          total: json.total || 0,
          totalPages: Math.ceil(
            (json.total || 0) / (json.limit || 10)
          ),
        },
      });
    }

    fetchData();
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Learners</h1>

      <Filters />

      <LearnersTable
        learners={data.data}
        meta={data.meta}
      />
    </div>
  );
}
