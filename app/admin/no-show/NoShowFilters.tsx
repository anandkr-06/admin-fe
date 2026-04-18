export default function NoShowFilters({
  filters,
  setFilters,
}: any) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <input
        type="text"
        placeholder="Search..."
        className="border rounded-lg px-4 py-2 w-64 text-sm"
        value={filters.search}
        onChange={(e) =>
          setFilters({ ...filters, search: e.target.value })
        }
      />

      <select
        className="border rounded-lg px-4 py-2 text-sm"
        value={filters.status}
        onChange={(e) =>
          setFilters({ ...filters, status: e.target.value })
        }
      >
        <option value="">All</option>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
      </select>

      <input
        type="date"
        value={filters.startDate}
        onChange={(e) =>
          setFilters({ ...filters, startDate: e.target.value })
        }
        className="border rounded-lg px-3 py-2 text-sm"
      />

      <input
        type="date"
        value={filters.endDate}
        onChange={(e) =>
          setFilters({ ...filters, endDate: e.target.value })
        }
        className="border rounded-lg px-3 py-2 text-sm"
      />

      <button
        onClick={() =>
          setFilters({
            search: "",
            status: "",
            startDate: "",
            endDate: "",
          })
        }
        className="px-4 py-2 border rounded-lg text-sm"
      >
        Clear
      </button>
    </div>
  );
}