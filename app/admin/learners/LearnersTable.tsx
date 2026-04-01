"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleLearner } from "@/services/learners.service";
import { LearnerActions } from "./Actions";
import { Card } from "@/components/ui/card";

type Learner = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  walletBalance: number;
  created: string;
  isActive: boolean;
};

export default function LearnersTable({
  learners,
}: {
  learners: Learner[];
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

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
    <Card className="rounded-3xl shadow-sm border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          
          {/* HEADER */}
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-5">Learner</th>
              <th className="p-5">Contact</th>
              <th className="p-5">Wallet</th>
              <th className="p-5">Created</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {learners.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-16 text-gray-400"
                >
                  No learners found
                </td>
              </tr>
            ) : (
              learners.map((user) => (
                <tr
                  key={user._id}
                  className="border-b last:border-none hover:bg-gray-50/70 transition"
                >
                  
                  {/* 👤 Learner Info */}
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      
                      {/* Avatar */}
                      <div className="h-11 w-11 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white font-semibold">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>

                      {/* Name + ID */}
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-gray-400">
                          ID: {user._id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 📧 Contact */}
                  <td className="p-5">
                    <div className="text-gray-700 text-sm">
                      {user.email}
                    </div>
                    <div className="text-xs text-gray-400">
                      {user.mobileNumber}
                    </div>
                  </td>

                  {/* 💰 Wallet */}
                  <td className="p-5">
                    <span className="font-semibold text-indigo-600">
                      ${user.walletBalance}
                    </span>
                  </td>

                  {/* 📅 Created */}
                  <td className="p-5 text-gray-500 text-sm">
                    {new Date(user.created).toLocaleDateString()}
                  </td>

                  {/* 🟢 Status */}
                  <td className="p-5">
                    <StatusBadge isActive={user.isActive} />
                  </td>

                  {/* ⚙️ Actions */}
                  <td className="p-5">
                    <div className="flex items-center justify-end gap-3">
                      
                      {/* Toggle */}
                      <button
                        onClick={() =>
                          handleToggle(user._id, user.isActive)
                        }
                        disabled={loadingId === user._id}
                        className={`px-4 py-2 text-xs font-medium rounded-xl transition ${
                          user.isActive
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        } ${
                          loadingId === user._id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {loadingId === user._id
                          ? "Updating..."
                          : user.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      {/* Dropdown */}
                      <LearnerActions id={user._id} />
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ---------- STATUS BADGE ---------- */

function StatusBadge({ isActive }: { isActive: boolean }) {
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