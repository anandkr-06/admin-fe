"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { getCourseDetails } from "@/services/course.service";

/* ---------------- STATUS BADGE ---------------- */
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

/* ---------------- MAIN ---------------- */
export default function CourseDetailsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function fetchCourse() {
    try {
      const res = await getCourseDetails(id as string);
      setCourse(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourse();
  }, [id]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (!course) return <div className="p-10">No Data</div>;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          {course.courseName}
        </h1>
        <p className="text-sm text-gray-500">
          Manage course details
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Price" value={`$${course.price}`} />
        <StatCard title="Seats" value={course.seats} />
        <StatCard title="Type" value={course.courseType} />
        <StatCard
          title="Status"
          value={<StatusBadge status={course.status} />}
        />
      </div>

      {/* Main Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Course Info */}
        <Card>
          <CardContent className="p-6 space-y-3">
            <h2 className="font-semibold text-lg">Course Info</h2>

            <Info label="Course Name" value={course.courseName} />
            <Info label="Category" value={course.category} />
            <Info label="Price" value={`$${course.price}`} />
            <Info label="Seats" value={course.seats} />
            <Info label="Course Type" value={course.courseType} />
            <Info label="Active" value={course.isActive ? "Yes" : "No"} />
          </CardContent>
        </Card>

        {/* Provider Info */}
        <Card>
          <CardContent className="p-6 space-y-3">
            <h2 className="font-semibold text-lg">Provider</h2>

            <Info
              label="Institute"
              value={course.providerId?.instituteName}
            />
            <Info
              label="Email"
              value={course.providerId?.email}
            />
            <Info label="Provider ID" value={course.providerId?._id} />
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardContent className="p-6 space-y-3">
            <h2 className="font-semibold text-lg">Location</h2>

            <Info label="Suburb" value={course.location?.suburb} />
            <Info label="State" value={course.location?.state} />
            <Info label="Post Code" value={course.location?.postCode} />
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardContent className="p-6 space-y-3">
            <h2 className="font-semibold text-lg">Schedules</h2>

            {course.schedules?.length ? (
              course.schedules.map((s: any, i: number) => (
                <div
                  key={i}
                  className="border rounded-lg p-3 text-sm"
                >
                  <p>
                    <strong>Start:</strong>{" "}
                    {new Date(s.startDateTime).toLocaleString()}
                  </p>
                  <p>
                    <strong>End:</strong>{" "}
                    {new Date(s.endDateTime).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No schedules available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Website */}
      {course.url && (
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-lg mb-2">Website</h2>
            <a
              href={course.url}
              target="_blank"
              className="text-blue-600 underline text-sm"
            >
              {course.url}
            </a>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardContent className="p-6 grid md:grid-cols-2 gap-4">
          <Info
            label="Created At"
            value={new Date(course.createdAt).toLocaleString()}
          />
          <Info
            label="Updated At"
            value={new Date(course.updatedAt).toLocaleString()}
          />
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function StatCard({ title, value }: any) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: any) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-sm">{value || "-"}</p>
    </div>
  );
}