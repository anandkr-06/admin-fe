export default function RefundFilters({
  filters,
  setFilters,
  onApply,
}: any) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search email..."
        className="border rounded-lg px-4 py-2 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
        value={filters.search}
        onChange={(e) =>
          setFilters({ ...filters, search: e.target.value })
        }
      />

      {/* STATUS */}
      <select
        className="border rounded-lg px-4 py-2 text-sm focus:outline-none"
        value={filters.status}
        onChange={(e) =>
          setFilters({ ...filters, status: e.target.value })
        }
      >
        <option value="">All Status</option>
        <option value="PENDING">Pending</option>
        <option value="COMPLETED">Completed</option>
        <option value="REJECTED">Rejected</option>
        <option value="FAILED">Failed</option>
      </select>

      {/* FROM DATE */}
      <input
        type="date"
        className="border rounded-lg px-3 py-2 text-sm"
        value={filters.fromDate}
        onChange={(e) =>
          setFilters({ ...filters, fromDate: e.target.value })
        }
      />

      {/* TO DATE */}
      <input
        type="date"
        className="border rounded-lg px-3 py-2 text-sm"
        value={filters.toDate}
        onChange={(e) =>
          setFilters({ ...filters, toDate: e.target.value })
        }
      />

      {/* APPLY BUTTON */}
      <button
        onClick={onApply}
        className="bg-black text-white px-5 py-2 rounded-lg text-sm hover:opacity-90"
      >
        Apply
      </button>

      {/* CLEAR BUTTON (optional but useful) */}
      <button
        onClick={() =>
          setFilters({
            search: "",
            status: "",
            fromDate: "",
            toDate: "",
          })
        }
        className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100"
      >
        Clear
      </button>
    </div>
  );
}