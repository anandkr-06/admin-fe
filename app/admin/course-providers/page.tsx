"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import toast from "react-hot-toast";
import ProviderActions from "./Actions";

import {
  getCourseProviders,
  toggleCourseProvider,
} from "@/services/courseProvider.service";

export default function CourseProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    isActive: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getCourseProviders(filters);
      setProviders(res.data || []);
      setMeta(res.meta || null);
    } catch {
      toast.error("Failed to fetch providers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters.page]);

  const applyFilters = () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
    fetchData();
  };

  const total = meta?.total || 0;
  const active = providers.filter((p) => p.isActive).length;
  const inactive = providers.filter((p) => !p.isActive).length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Course Providers</h1>
        <p className="text-sm text-gray-500">
          Manage registered training institutes
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Total Providers" value={total} />
        <StatCard title="Active" value={active} color="text-green-600" />
        <StatCard title="Inactive" value={inactive} color="text-red-600" />
      </div>

      {/* FILTERS */}
      <Card className="rounded-2xl border shadow-sm">
  <CardContent className="p-4">
    
    {/* SINGLE ROW FILTERS */}
    <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap">

      {/* Search */}
      <Input
        placeholder="Search course..."
        value={filters.search}
        onChange={(e) =>
          setFilters({ ...filters, search: e.target.value })
        }
        className="min-w-[180px]"
      />

      {/* Status */}
      <select
        value={filters.isActive}
        onChange={(e) =>
          setFilters({ ...filters, isActive: e.target.value })
        }
        className="border px-3 py-2 rounded-lg text-sm min-w-[160px]"
      >
        <option value="">All Providers</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>

      {/* Start Date */}
      <Input
        type="date"
        value={filters.startDate}
        onChange={(e) =>
          setFilters({ ...filters, startDate: e.target.value })
        }
        className="min-w-[160px]"
      />

      {/* End Date */}
      <Input
        type="date"
        value={filters.endDate}
        onChange={(e) =>
          setFilters({ ...filters, endDate: e.target.value })
        }
        className="min-w-[160px]"
      />

      {/* Sort By */}
      <select
        value={filters.sortBy}
        onChange={(e) =>
          setFilters({ ...filters, sortBy: e.target.value })
        }
        className="border px-3 py-2 rounded-lg text-sm min-w-[140px]"
      >
        <option value="createdAt">Created</option>
        <option value="instituteName">Name</option>
      </select>

      {/* Sort Order */}
      <select
        value={filters.sortOrder}
        onChange={(e) =>
          setFilters({ ...filters, sortOrder: e.target.value })
        }
        className="border px-3 py-2 rounded-lg text-sm min-w-[120px]"
      >
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>

      {/* Limit */}
      <select
        value={filters.limit}
        onChange={(e) =>
          setFilters({
            ...filters,
            limit: Number(e.target.value),
          })
        }
        className="border px-3 py-2 rounded-lg text-sm min-w-[100px]"
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>
    </div>

    {/* APPLY BUTTON */}
    <Button
      onClick={applyFilters}
      className="w-full mt-4 bg-black text-white"
    >
      Apply Filters
    </Button>
  </CardContent>
</Card>

      {/* TABLE */}
      <Card className="rounded-2xl">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 text-left">Institute</th>
                    <th className="p-4 text-left">Contact</th>
                    <th className="p-4 text-left">Location</th>
                    <th className="p-4 text-left">Website</th>
                    <th className="p-4 text-left">Consent</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Created</th>
                    <th className="p-4 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {providers.map((p) => (
                    <Row key={p._id} p={p} refresh={fetchData} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PAGINATION */}
      <Pagination meta={meta} setFilters={setFilters} />
    </div>
  );
}

/* ---------------- ROW ---------------- */

function Row({ p, refresh }: any) {
  const [loading, setLoading] = useState(false);

  const getLogo = () => {
    if (!p.logoUrl) return null;
    if (p.logoUrl.startsWith("http")) return p.logoUrl;
    return `https://static.anylicence.com/media/${p.logoUrl.replace(
      "uploads/",
      ""
    )}`;
  };

  const handleToggle = async () => {
    try {
      setLoading(true);
      await toggleCourseProvider(p._id, p.isActive);
      toast.success(p.isActive ? "Deactivated" : "Activated");
      refresh();
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="border-b">
      {/* Institute */}
      <td className="p-4">
        <div className="flex items-center gap-3">
          {getLogo() ? (
            <img
              src={getLogo()}
              className="h-10 w-10 rounded-lg border"
            />
          ) : (
            <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
              {p.instituteName?.charAt(0)}
            </div>
          )}

          <div>
            <div className="font-medium">{p.instituteName}</div>
            <div className="text-xs text-gray-500">ID: {p._id}</div>
          </div>
        </div>
      </td>

      {/* Contact */}
      <td className="p-4">
        <div>{p.email}</div>
        <div className="text-xs text-gray-500">{p.phone}</div>
      </td>

      {/* Location */}
      <td className="p-4">
        <div>
          {p.location?.suburb}, {p.location?.state}
        </div>
        <div className="text-xs text-gray-500">
          {p.location?.postCode}
        </div>
      </td>

      {/* Website */}
      <td className="p-4">
        {p.websiteUrl && (
          <a
            href={p.websiteUrl}
            target="_blank"
            className="flex items-center gap-1 text-blue-600"
          >
            <Globe size={14} />
            Visit
          </a>
        )}
      </td>

      {/* Consent */}
      <td className="p-4 text-xs">
        <div>T&C: {p.isAgreedToTermsAndConditions ? "✅" : "❌"}</div>
        <div>Offers: {p.isAgreedToCommunicationAndOffers ? "✅" : "❌"}</div>
      </td>

      {/* Status */}
      <td className="p-4">
        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
          {p.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Created */}
      <td className="p-4 text-xs">
        {new Date(p.createdAt).toLocaleDateString()}
        <div>{new Date(p.createdAt).toLocaleTimeString()}</div>
      </td>

      {/* Actions */}
      <td className="p-4 flex gap-2">
        <button
          onClick={handleToggle}
          className={`px-3 py-1 rounded-lg text-xs ${
            p.isActive
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {loading ? "..." : p.isActive ? "Deactivate" : "Activate"}
        </button>

        <ProviderActions providerId={p._id} />
      </td>
    </tr>
  );
}

/* ---------------- KPI ---------------- */

function StatCard({ title, value, color = "text-black" }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-gray-500">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

/* ---------------- PAGINATION ---------------- */

function Pagination({ meta, setFilters }: any) {
  if (!meta) return null;

  const page = Number(meta.page || 1);
  const totalPages = Number(meta.totalPages || 1);

  const isPrevDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;

  return (
    <div className="flex justify-between items-center mt-4">
      <p className="text-sm text-gray-500">
        Page {page} of {totalPages}
      </p>

      <div className="flex gap-2">
        <button
          disabled={isPrevDisabled}
          className={`px-3 py-1 rounded ${
            isPrevDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
          onClick={() =>
            setFilters((p: any) => ({ ...p, page: p.page - 1 }))
          }
        >
          Prev
        </button>

        <button
          disabled={isNextDisabled}
          className={`px-3 py-1 rounded ${
            isNextDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
          onClick={() =>
            setFilters((p: any) => ({ ...p, page: p.page + 1 }))
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}