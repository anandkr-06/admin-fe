"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toggleInstructor } from "@/services/instructor.service";
import { InstructorActions } from "./Actions";
import { Card } from "@/components/ui/card";

type Instructor = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  isPaid: boolean;
};

export default function InstructorsTable({
  instructors,
  meta,
}: {
  instructors: Instructor[];
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
    router.push(`/admin/instructors?page=${page}`);
  }

  async function handleToggle(id: string, isActive: boolean) {
    try {
      setLoadingId(id);
      await toggleInstructor(
        id,
        isActive ? "deactivate" : "activate"
      );
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <Card className="rounded-3xl shadow-sm border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-5">Instructor</th>
              <th className="p-5">Email</th>
              <th className="p-5">Created Date</th>
              <th className="p-5">Status</th>
              <th className="p-5">IsPaid</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {instructors.map((inst) => (
              <tr
                key={inst._id}
                className="border-b last:border-none hover:bg-gray-50/70 transition-all duration-200"
              >
                {/* Instructor Info */}
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold">
                      {inst.firstName[0]}
                      {inst.lastName[0]}
                    </div>

                    <div>
                      <div className="font-medium text-gray-900">
                        {inst.firstName} {inst.lastName}
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {inst._id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="p-5 text-gray-600">
                  {inst.email}
                </td>
                <td className="p-5 text-gray-600">
                  {new Date(inst.createdAt).toLocaleDateString()}
                </td>
                {/* Status */}
                <td className="p-5">
                  <StatusBadge isActive={inst.isActive} />
                </td>
                <td className="p-5 text-gray-600">
                  {inst.isPaid ? "true" : "false"}
                </td>

                {/* Actions */}
                <td className="p-5">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() =>
                        handleToggle(
                          inst._id,
                          inst.isActive
                        )
                      }
                      disabled={loadingId === inst._id}
                      className={`px-4 py-2 text-xs font-medium rounded-xl transition-all duration-200 ${
                        inst.isActive
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      } ${
                        loadingId === inst._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {loadingId === inst._id
                        ? "Updating..."
                        : inst.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    <InstructorActions id={inst._id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {instructors.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No instructors found.
          </div>
        )}
      </div>

      {/* Modern Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 rounded-b-3xl">
        <div className="text-sm text-gray-500">
          Page{" "}
          <span className="font-semibold text-gray-800">
            {meta.page}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">
            {meta.totalPages}
          </span>{" "}
          • {meta.total} total instructors
        </div>

        <div className="flex gap-2">
          <button
            disabled={meta.page === 1}
            onClick={() => goToPage(meta.page - 1)}
            className="px-4 py-2 text-sm rounded-xl border hover:bg-gray-100 disabled:opacity-40 transition"
          >
            Previous
          </button>

          <button
            disabled={meta.page === meta.totalPages}
            onClick={() => goToPage(meta.page + 1)}
            className="px-4 py-2 text-sm rounded-xl border hover:bg-gray-100 disabled:opacity-40 transition"
          >
            Next
          </button>
        </div>
      </div>
    </Card>
  );
}

/* ---------- Status Badge ---------- */

function StatusBadge({
  isActive,
}: {
  isActive: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          isActive ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      <span
        className={`text-xs font-medium ${
          isActive
            ? "text-green-600"
            : "text-gray-500"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    </div>
  );
}
