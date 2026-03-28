"use client";

import { useState } from "react";
import { toggleLearner } from "@/services/learners.service";

type Learner = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
};

export default function LearnersTable({
  learners,
}: {
  learners: Learner[];
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleToggle(id: string, isActive: boolean) {
    try {
      setLoadingId(id);
      await toggleLearner(id, isActive);
      window.location.reload(); // simple refresh (or lift state if needed)
    } catch (error) {
      console.error("Toggle failed:", error);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border">
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
          {learners.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-6 text-center text-gray-500">
                No learners found
              </td>
            </tr>
          ) : (
            learners.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">
                  {user.firstName} {user.lastName}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {user.email}
                </td>

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

                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() =>
                      handleToggle(user._id, user.isActive)
                    }
                    disabled={loadingId === user._id}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white ${
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

                  <button className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-100">
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}