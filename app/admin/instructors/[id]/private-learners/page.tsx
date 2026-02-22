"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminPage from "@/app/admin/components/AdminPage";
import { getInstructorPrivateLearners } from "@/services/instructor.service";

export default function PrivateLearnersPage() {
  const params = useParams();
  const router = useRouter();
  const instructorId = params?.id as string;

  const [learners, setLearners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!instructorId) return;

    async function fetchData() {
      try {
        setLoading(true);
        const res = await getInstructorPrivateLearners(instructorId);
        setLearners(res?.data || []);
      } catch (err) {
        console.error("Failed to load learners");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [instructorId]);

  const filteredLearners = useMemo(() => {
    return learners.filter((l) =>
      `${l.firstName} ${l.lastName} ${l.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [learners, search]);

  return (
    <AdminPage title="Private Learners">
      <div className="space-y-4">

        {/* Search */}
        <input
          type="text"
          placeholder="Search learners..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {loading ? (
          <div className="p-6 text-gray-500">Loading learners...</div>
        ) : filteredLearners.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No learners found
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLearners.map((l: any) => (
              <div
                key={l._id}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    router.push(
                      `/admin/instructors/${instructorId}/private-learners/${l._id}`
                    );
                  }
                }}
                onClick={() =>
                  router.push(
                    `/admin/instructors/${instructorId}/private-learners/${l._id}`
                  )
                }
                className="cursor-pointer bg-white border rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-lg">
                    {l.firstName?.charAt(0)?.toUpperCase() || "L"}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {l.firstName} {l.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{l.email}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/admin/instructors/${instructorId}/private-learners/${l._id}`
                      );
                    }}
                    className="px-3 py-1 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
                  >
                    View
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/admin/instructors/${instructorId}/private-learners/${l._id}/orders`
                      );
                    }}
                    className="px-3 py-1 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Orders
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminPage>
  );
}
