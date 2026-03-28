"use client";

export default function LearnerFilters({
  search,
  setSearch,
  status,
  setStatus,
}: any) {
  return (
    <div className="flex gap-3 rounded-xl border bg-white p-4 shadow-sm">
      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-lg border px-3 py-2"
      >
        <option value="">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
}