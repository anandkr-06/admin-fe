"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toggleLearner } from "@/services/learners.service";


type Learner = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
};

export default function LearnersTable({
  learners,
  meta,
}: {
  learners: Learner[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  function goToPage(page: number) {
    router.push(`/admin/learners?page=${page}`);
  }

async function handleToggle(id: string, isActive: boolean) {
  try {
    setLoadingId(id);

   await toggleLearner(id, isActive);


    router.refresh();
  } catch (error) {
    console.error("Toggle failed:", error);
  } finally {
    setLoadingId(null);
  }
}


  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {learners.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">
                  {user.firstName} {user.lastName}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {user.email}
                </td>

                {/* <td className="px-6 py-4 text-gray-600">
                  {user.role}
                </td> */}

                {/* Status Badge */}
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      user.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() =>
                      handleToggle(user._id, user.isActive)
                    }
                    disabled={loadingId === user._id}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white transition ${
                      user.isActive
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    } ${
                      loadingId === user._id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {loadingId === user._id
                      ? "Processing..."
                      : user.isActive
                      ? "Deactivate"
                      : "Activate"}
                  </button>

                  <button className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-100">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t px-6 py-4 text-sm">
        <span className="text-gray-500">
          Page {meta.page} of {meta.totalPages}
        </span>

        <div className="flex gap-2">
          <button
            disabled={meta.page === 1}
            onClick={() => goToPage(meta.page - 1)}
            className="rounded-lg border px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>

          <button
            disabled={meta.page === meta.totalPages}
            onClick={() => goToPage(meta.page + 1)}
            className="rounded-lg border px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
