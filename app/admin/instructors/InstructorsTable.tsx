"use client";

import { useRouter } from "next/navigation";
import { toggleInstructor } from "@/services/instructor.service";
import InstructorActions from "./Actions";

type Instructor = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
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

  function goToPage(page: number) {
    router.push(`/admin/instructors?page=${page}`);
  }
  
  async function handleToggle(
    id: string,
    isActive: boolean,
  ) {
    await toggleInstructor(
      id,
      isActive ? "deactivate" : "activate",
    );

    router.refresh(); // 🔥 re-fetch server data
  }

  return (
    <>
      {/* <table className="w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">First Name</th>
            <th className="border p-2 text-left">Last Name</th>
            <th className="border p-2 text-left">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {instructors.map((inst) => (
            <tr key={inst._id}>
              <td className="border p-2">{inst.firstName}</td>
              <td className="border p-2">{inst.lastName}</td>
              <td className="border p-2">{inst.email}</td>
              <td className="border p-2 text-center">{inst.role}</td>
              <td className="border p-2 text-center">
                {inst.isActive ? "✅ Active" : "❌ Inactive"}
              </td>
              <td className="border p-2 text-center">
                <button className="text-blue-600 hover:underline">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
      <table className="w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">First Name</th>
            <th className="border p-2 text-left">Last Name</th>
            <th className="border p-2 text-left">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {instructors.map((i) => (
            <tr key={i._id}>
              <td className="border p-2">{i.firstName}</td>
              <td className="border p-2">{i.lastName}</td>
              <td className="border p-2">{i.email}</td>
              <td className="border p-2">
                {i.isActive ? "Active" : "Inactive"}
              </td>
              <td className="border p-2">
                <button
                  onClick={() =>
                    handleToggle(i._id, i.isActive)
                  }
                  className={`rounded px-3 py-1 text-white ${
                    i.isActive
                      ? "bg-red-600"
                      : "bg-green-600"
                  }`}
                >
                  {i.isActive ? "Deactivate" : "Activate"}
                </button>
              </td>
              <td className="border p-2 text-center">
                <button className="text-blue-600 hover:underline">
                  View
                </button>
                {/* <InstructorActions /> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <span>
          Page {meta.page} of {meta.totalPages}
        </span>

        <div className="space-x-2">
          <button
            disabled={meta.page === 1}
            onClick={() => goToPage(meta.page - 1)}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Prev
          </button>

          <button
            disabled={meta.page === meta.totalPages}
            onClick={() => goToPage(meta.page + 1)}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
