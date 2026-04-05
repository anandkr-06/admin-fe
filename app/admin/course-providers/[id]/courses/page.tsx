"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getCourseProviderCourses } from "@/services/courseProvider.service";
import { format } from "date-fns";

export default function ProviderCoursesPage() {
  const { id } = useParams();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await getCourseProviderCourses(id as string, {
          page: 1,
          limit: 10,
        });

        setCourses(res.data || []);
      } catch (err) {
        console.error("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      case "PENDING_APPROVAL":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Courses</h1>

      {courses.length === 0 ? (
        <div>No courses found</div>
      ) : (
        <div className="overflow-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase">
              <tr>
                <th className="p-3 text-left">Course</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Schedule</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Seats</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Provider</th>
                <th className="p-3 text-left">Status</th>
                {/* <th className="p-3 text-left">Flags</th> */}
                <th className="p-3 text-left">Created</th>
                <th className="p-3 text-left">URL</th>
                <th className="p-3 text-left">Leads</th>
              </tr>
            </thead>

            <tbody>
              {courses.map((c: any) => (
                <tr key={c._id} className="border-t hover:bg-gray-50">
                  {/* Course */}
                  <td className="p-3 font-medium">{c.courseName}</td>

                  {/* Category */}
                  <td className="p-3">{c.category}</td>

                  {/* Price */}
                  <td className="p-3 font-medium">₹{c.price}</td>

                  {/* Schedule */}
                  <td className="p-3">
                    {c.schedules?.map((s: any, i: number) => (
                      <div key={i} className="text-xs">
                        {format(new Date(s.startDateTime), "dd MMM yyyy")} -{" "}
                        {format(new Date(s.endDateTime), "dd MMM yyyy")}
                      </div>
                    ))}
                  </td>

                  {/* Location */}
                  <td className="p-3 text-xs">
                    {c.location?.suburb}, {c.location?.state} -{" "}
                    {c.location?.postCode}
                  </td>

                  {/* Seats */}
                  <td className="p-3">{c.seats}</td>

                  {/* Type */}
                  <td className="p-3">{c.courseType}</td>

                  {/* Provider */}
                  <td className="p-3 text-xs">
                    {c.provider?.instituteName}
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </td>

                  {/* Flags */}
                  {/* <td className="p-3 text-xs space-y-1">
                    <div>
                      Active:{" "}
                      <span
                        className={
                          c.isActive ? "text-green-600" : "text-red-500"
                        }
                      >
                        {c.isActive ? "Yes" : "No"}
                      </span>
                    </div>
                    <div>
                      Deleted:{" "}
                      <span
                        className={
                          c.isDeleted ? "text-red-500" : "text-green-600"
                        }
                      >
                        {c.isDeleted ? "Yes" : "No"}
                      </span>
                    </div>
                  </td> */}

                  {/* Created */}
                  <td className="p-3 text-xs">
                    {format(new Date(c.createdAt), "dd MMM yyyy")}
                  </td>

                  {/* Action */}
                  <td className="p-3">
                    {c.url ? (
                      <a
                        href={c.url}
                        target="_blank"
                        className="text-blue-600 underline text-xs"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">No Link</span>
                    )}
                  </td>
                  <td className="p-3">
  <button
    onClick={() =>
      window.open(
        `/admin/course-providers/${id}/courses/${c._id}/leads`,
        "_blank"
      )
    }
    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
  >
    Leads
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}