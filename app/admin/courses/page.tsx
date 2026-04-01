"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDays, ExternalLink } from "lucide-react";
import { getCourses, updateCourseStatus } from "@/services/admin.service";

/* ---------------- Filters ---------------- */

function Filters({ filters, setFilters, onApply, providers }: any) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="p-4 grid md:grid-cols-7 gap-4">
        <Input
          placeholder="Search course..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
        />

        <select
          className="border rounded-lg px-3"
          value={filters.providerId}
          onChange={(e) =>
            setFilters({ ...filters, providerId: e.target.value })
          }
        >
          <option value="">All Providers</option>
          {providers.map((p: any) => (
            <option key={p._id} value={p._id}>
              {p.instituteName}
            </option>
          ))}
        </select>

        <Input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
        />

        <Input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            setFilters({ ...filters, endDate: e.target.value })
          }
        />

        <select
          className="border rounded-lg px-3"
          value={filters.sortBy}
          onChange={(e) =>
            setFilters({ ...filters, sortBy: e.target.value })
          }
        >
          <option value="createdAt">Created</option>
          <option value="price">Price</option>
        </select>

        <select
          className="border rounded-lg px-3"
          value={filters.sortOrder}
          onChange={(e) =>
            setFilters({ ...filters, sortOrder: e.target.value })
          }
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>

        <Button className="md:col-span-7" onClick={onApply}>
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}

/* ---------------- Table ---------------- */

function CoursesTable({ courses, onStatusChange }: any) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleAction(id: string, status: string) {
    try {
      setLoadingId(id);
      await onStatusChange(id, status);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b sticky top-0 z-10">
          <tr>
            <th className="p-4 text-left">Course</th>
            <th className="p-4 text-left">Provider</th>
            <th className="p-4 text-left">Location</th>
            <th className="p-4 text-left">Seats</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">URL</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.map((course: any) => (
            <tr key={course._id} className="border-b hover:bg-gray-50">
              <td className="p-4">
                <div className="font-medium">{course.courseName}</div>
                <div className="text-xs text-gray-500">
                  {course.category}
                </div>
              </td>

              <td className="p-4">
                {course.provider?.instituteName || "-"}
              </td>

              <td className="p-4 text-xs">
                {course.location?.suburb}, {course.location?.state}
              </td>

              <td className="p-4">{course.seats}</td>

              <td className="p-4 text-green-600 font-medium">
                ₹{course.price}
              </td>

              <td className="p-4">
                {course.url ? (
                  <a
                    href={course.url}
                    target="_blank"
                    className="text-blue-600 text-xs flex items-center gap-1"
                  >
                    Visit <ExternalLink size={12} />
                  </a>
                ) : (
                  "N/A"
                )}
              </td>

              <td className="p-4">
                <StatusBadge status={course.status} />
              </td>

              <td className="p-4 flex gap-2">
                <Button
                  size="sm"
                  disabled={
                    loadingId === course._id ||
                    course.status === "APPROVED"
                  }
                  onClick={() =>
                    handleAction(course._id, "APPROVED")
                  }
                  className="bg-green-600 text-white"
                >
                  {loadingId === course._id ? "..." : "Approve"}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={
                    loadingId === course._id ||
                    course.status === "REJECTED"
                  }
                  onClick={() =>
                    handleAction(course._id, "REJECTED")
                  }
                >
                  Reject
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Status Badge ---------------- */

function StatusBadge({ status }: any) {
  const styles: any = {
    APPROVED: "bg-green-100 text-green-700",
    PENDING_APPROVAL: "bg-yellow-100 text-yellow-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${styles[status]}`}>
      {status}
    </span>
  );
}

/* ---------------- KPI ---------------- */

function StatCard({ title, value }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </CardContent>
    </Card>
  );
}

/* ---------------- Empty ---------------- */

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="text-5xl">📚</div>
      <h2 className="font-semibold mt-2">No Courses Found</h2>
    </div>
  );
}

/* ---------------- MAIN ---------------- */

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [statusTab, setStatusTab] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    providerId: "",
    startDate: "",
    endDate: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  async function fetchCourses(customFilters = filters, status = statusTab) {
    try {
      setLoading(true);

      const res = await getCourses({
        page: 1,
        limit: 10,
        ...(customFilters.search && { search: customFilters.search }),
        ...(status && { status }),
        ...(customFilters.providerId && {
          providerId: customFilters.providerId,
        }),
        ...(customFilters.startDate && {
          startDate: customFilters.startDate,
        }),
        ...(customFilters.endDate && {
          endDate: customFilters.endDate,
        }),
        sortBy: customFilters.sortBy,
        sortOrder: customFilters.sortOrder,
      });

      setCourses(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProviders() {
    try {
      const res = await fetch(
        "https://devadminapi.anylicence.com/admin/course-providers?page=1&limit=50"
      );
      const data = await res.json();
      setProviders(data.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleStatusChange(id: string, status: string) {
    try {
      await updateCourseStatus(id, status);

      setCourses((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, status } : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCourses();
    fetchProviders();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Courses</h1>
          <p className="text-sm text-gray-500">
            Manage training courses
          </p>
        </div>

        {/* <Button>
          <CalendarDays size={16} className="mr-2" />
          Export
        </Button> */}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { label: "All", value: "" },
          { label: "Pending", value: "PENDING_APPROVAL" },
          { label: "Approved", value: "APPROVED" },
          { label: "Rejected", value: "REJECTED" },
        ].map((tab) => (
          <Button
            key={tab.value}
            variant={statusTab === tab.value ? "default" : "outline"}
            onClick={() => {
              setStatusTab(tab.value);
              fetchCourses(filters, tab.value);
            }}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Filters */}
      <Filters
        filters={filters}
        setFilters={setFilters}
        providers={providers}
        onApply={() => fetchCourses(filters)}
      />

      {/* KPI */}
      <StatCard title="Total Courses" value={meta?.total || 0} />

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-10 text-center">Loading...</div>
          ) : courses.length === 0 ? (
            <EmptyState />
          ) : (
            <CoursesTable
              courses={courses}
              onStatusChange={handleStatusChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}