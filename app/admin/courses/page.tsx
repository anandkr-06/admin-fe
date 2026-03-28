"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCourses } from "@/services/admin.service";
import { CalendarDays } from "lucide-react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const res = await getCourses({
          page: 1,
          limit: 10,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        setCourses(res.data || []);
        setMeta(res.meta || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const totalCourses = meta?.total || 0;
  const pendingCount = courses.filter(
    (c) => c.status === "PENDING_APPROVAL"
  ).length;

  const activeCount = courses.filter(
    (c) => c.isActive
  ).length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            Courses
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and review training courses
          </p>
        </div>

        <Button>
          <CalendarDays size={16} className="mr-2" />
          Export
        </Button>
      </div>

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

/* ---------------- Components ---------------- */

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

function CoursesTable({ courses }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="p-4 text-left">Course</th>
            <th className="p-4 text-left">Provider</th>
            <th className="p-4 text-left">Location</th>
            <th className="p-4 text-left">Schedules</th>
            <th className="p-4 text-left">Seats</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Type</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course: any) => (
            <tr key={course._id} className="border-b hover:bg-gray-50 transition">
              <td className="p-4 font-medium">
                {course.courseName}
                <div className="text-xs text-gray-500">
                  {course.category}
                </div>
              </td>

              <td className="p-4">
                {course.provider?.instituteName || "-"}
              </td>

              <td className="p-4">
                {course.location?.suburb},{" "}
                {course.location?.state}
                <div className="text-xs text-gray-500">
                  {course.location?.postCode}
                </div>
              </td>

              <td className="p-4">
                {course.courseType === "Flexible"? "No Expiry Date"  :course.schedules?.slice(0, 2).map((s: any, i: number) => (
                  <div key={i} className="text-xs text-gray-600">
                    {new Date(s.startDateTime).toLocaleDateString()} -{" "}
                    {new Date(s.endDateTime).toLocaleDateString()}
                  </div>
                ))}
                {course.schedules?.length > 2 && (
                  <div className="text-xs text-blue-600">
                    +{course.schedules.length - 2} more
                  </div>
                )}
              </td>

              <td className="p-4">{course.seats}</td>

              <td className="p-4">${course.price}</td>

              <td className="p-4">{course.courseType}</td>

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
      <h2 className="text-xl font-semibold">
        No Courses Found
      </h2>
      <p className="text-gray-500 text-sm">
        Courses will appear here once created.
      </p>
    </div>
  );
}