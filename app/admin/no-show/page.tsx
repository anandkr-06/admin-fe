"use client";

import { useEffect, useState } from "react";
import { getNoShowRequests } from "@/services/noShow";
import NoShowTable from "./NoShowTable";
import NoShowFilters from "./NoShowFilters";
import ActionModal from "./ActionModal";

export default function NoShowPage() {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    status: "PENDING",
    startDate: "",
    endDate: "",
  });

  const [modal, setModal] = useState<{
    type: "approve" | "reject";
    item: any;
  } | null>(null);

  const fetchNoShow = async () => {
    try {
      const res = await getNoShowRequests({
        page,
        limit: 10,
        ...filters,
        sortBy: "createdAt",
        order: "desc",
      });

      setData(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("No Show fetch error", error);
    }
  };

  useEffect(() => {
    fetchNoShow();
  }, [page, filters]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">No Show Requests</h1>

      <NoShowFilters filters={filters} setFilters={setFilters} />

      <NoShowTable
        data={data}
        onAction={(type: any, item: any) =>
          setModal({ type, item })
        }
      />

      {/* MODAL */}
      {modal && (
        <ActionModal
          type={modal.type}
          item={modal.item}
          onClose={() => setModal(null)}
          refresh={fetchNoShow}
        />
      )}

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