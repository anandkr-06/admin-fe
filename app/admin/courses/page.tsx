"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCourses } from "@/services/admin.service";
import { CalendarDays, ExternalLink } from "lucide-react";

/* ---------------- Filters ---------------- */

function Filters({ filters, setFilters, onApply, providers }: any) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="p-4 grid md:grid-cols-7 gap-4">
        {/* Search */}
        <Input
          placeholder="Search course..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
        />

        {/* Status */}
        <select
          className="border rounded-lg px-3"
          value={filters.status}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">All Status</option>
          <option value="PENDING_APPROVAL">Pending</option>
          <option value="APPROVED">Approved</option>
        </select>

        {/* Provider Dropdown */}
        <select
          className="border rounded-lg px-3"
          value={filters.providerId}
          onChange={(e) =>
            setFilters({ ...filters, providerId: e.target.value })
          }
        >
          <option value="">All Providers</option>
          {providers.length === 0 ? (
            <option disabled>Loading providers...</option>
          ) : (
            providers.map((p: any) => (
              <option key={p._id} value={p._id}>
                {p.instituteName} ({p.location?.state})
              </option>
            ))
          )}
        </select>

        {/* Dates */}
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

        {/* Sort */}
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

function CoursesTable({ courses }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b sticky top-0 z-10">
          <tr>
            <th className="p-4 text-left">Course</th>
            <th className="p-4 text-left">Provider</th>
            <th className="p-4 text-left">Location</th>
            <th className="p-4 text-left">Schedules</th>
            <th className="p-4 text-left">Seats</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">URL</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {courses.map((course: any) => (
            <tr
              key={course._id}
              className="border-b hover:bg-gray-50 transition group"
            >
              {/* Course */}
              <td className="p-4">
                <div className="font-medium group-hover:text-blue-600 transition">
                  {course.courseName}
                </div>
                <div className="text-xs text-gray-500">
                  {course.category}
                </div>
              </td>

              {/* Provider */}
              <td className="p-4">
                {course.provider?.instituteName || "-"}
              </td>

              {/* Location */}
              <td className="p-4 text-xs">
                {course.location?.suburb}, {course.location?.state}
                <div className="text-gray-400">
                  {course.location?.postCode}
                </div>
              </td>

              {/* Schedule */}
              <td className="p-4 text-xs space-y-1">
                {course.courseType === "Flexible"
                  ? "No Expiry"
                  : course.schedules?.slice(0, 2).map((s: any, i: number) => (
                      <div key={i}>
                        {new Date(s.startDateTime).toLocaleDateString()} -{" "}
                        {new Date(s.endDateTime).toLocaleDateString()}
                      </div>
                    ))}

                {course.schedules?.length > 2 && (
                  <div className="text-blue-500 text-xs">
                    +{course.schedules.length - 2} more
                  </div>
                )}
              </td>

              {/* Seats */}
              <td className="p-4">{course.seats}</td>

              {/* Price */}
              <td className="p-4 font-medium text-green-600">
                ₹{course.price?.toLocaleString()}
              </td>

              {/* URL */}
              <td className="p-4">
                {course.url ? (
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition"
                  >
                    Visit <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="text-gray-400 text-xs">N/A</span>
                )}
              </td>

              {/* Status */}
              <td className="p-4">
                <StatusBadge
                  status={course.status}
                  active={course.isActive}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Page ---------------- */

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    providerId: "",
    startDate: "",
    endDate: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  /* Fetch Courses */
  async function fetchCourses(customFilters = filters) {
    try {
      setLoading(true);

      const res = await getCourses({
        page: 1,
        limit: 10,
        ...(customFilters.search && { search: customFilters.search }),
        ...(customFilters.status && { status: customFilters.status }),
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

  /* Fetch Providers */
  async function fetchProviders() {
    try {
      const res = await fetch(
        "https://devadminapi.anylicence.com/admin/course-providers?page=1&limit=50&sortBy=createdAt&sortOrder=desc"
      );
      const data = await res.json();
      setProviders(data.data || []);
    } catch (err) {
      console.error("Provider fetch failed", err);
    }
  }

  useEffect(() => {
    fetchCourses();
    fetchProviders();
  }, []);

  const totalCourses = meta?.total || 0;
  const pendingCount = courses.filter(
    (c) => c.status === "PENDING_APPROVAL"
  ).length;

  const activeCount = courses.filter((c) => c.isActive).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Courses</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and review training courses
          </p>
        </div>

        <Button>
          <CalendarDays size={16} className="mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Filters
        filters={filters}
        setFilters={setFilters}
        providers={providers}
        onApply={() => fetchCourses(filters)}
      />

      {/* KPI */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Total Courses" value={totalCourses} />
        <StatCard
          title="Pending Approval"
          value={pendingCount}
          color="text-orange-600"
        />
        <StatCard
          title="Active Courses"
          value={activeCount}
          color="text-green-600"
        />
      </div>

      {/* Table */}
      <Card className="rounded-2xl shadow-sm border">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 text-center text-gray-500">
              Loading courses...
            </div>
          ) : courses.length === 0 ? (
            <EmptyState />
          ) : (
            <CoursesTable courses={courses} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Small Components ---------------- */

function StatCard({ title, value, color = "text-gray-900" }: any) {
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
      <CardContent className="p-6">
        <p className="text-sm text-gray-500">{title}</p>
        <p className={`text-3xl font-bold mt-2 ${color}`}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status, active }: any) {
  return (
    <div className="flex flex-col gap-1">
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 w-fit">
        {status}
      </span>

      <span
        className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
          active
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {active ? "Active" : "Inactive"}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 space-y-4">
      <div className="text-6xl">📚</div>
      <h2 className="text-xl font-semibold">No Courses Found</h2>
      <p className="text-gray-500 text-sm">
        Courses will appear here once created.
      </p>
    </div>
  );
}