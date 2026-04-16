"use client";

import { useEffect, useState } from "react";
import { getRefundRequests } from "@/services/refund";
import RefundTable from "./RefundTable";
import RefundFilters from "./RefundFilters";

export default function RefundPage() {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

 const [filters, setFilters] = useState({
  search: "",
  status: "PENDING",
  fromDate: "",
  toDate: "",
});

  const fetchRefunds = async () => {
    try {
      const res = await getRefundRequests({
        page,
        limit: 10,
        ...filters,
        sortBy: "createdAt",
        order: "desc",
      });

      // IMPORTANT: your apiFetch returns full object
      setData(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Refund fetch error", error);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, [page, filters]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Refund Requests</h1>

      <RefundFilters filters={filters} setFilters={setFilters} />

      <RefundTable data={data} refresh={fetchRefunds} />

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded"
        >
          Prev
        </button>

        <span>
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}