"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminPage from "@/app/admin/components/AdminPage";
import { getLearnerWallet } from "@/services/learners.service";

export default function WalletPage() {
  const { id } = useParams();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchWallet() {
      try {
        setLoading(true);
        const res = await getLearnerWallet(id as string);
        setData(res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchWallet();
  }, [id]);

  if (loading) {
    return (
      <AdminPage title="Wallet">
        <div className="p-6 text-gray-400">Loading...</div>
      </AdminPage>
    );
  }

  return (
    <AdminPage title="Wallet">
      <div className="bg-white rounded-2xl border shadow-sm">

        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-sm font-medium text-gray-600">
            Wallet Transactions
          </h2>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            {/* HEAD */}
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Balance</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 text-gray-400"
                  >
                    No Transactions Found
                  </td>
                </tr>
              ) : (
                data.map((t) => (
                  <tr
                    key={t._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {/* TYPE */}
                    <td className="p-4">
                      <TypeBadge type={t.type} />
                    </td>

                    {/* AMOUNT */}
                    <td className="p-4 font-semibold">
                      ₹{t.amount}
                    </td>

                    {/* BALANCE */}
                    <td className="p-4 text-gray-600">
                      ₹{t.balanceAfter}
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <StatusBadge status={t.status} />
                    </td>

                    {/* DATE */}
                    <td className="p-4 text-gray-500 text-xs">
                      {formatDate(t.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </AdminPage>
  );
}

/* ================= BADGES ================= */

function TypeBadge({ type }: { type: string }) {
  const map: any = {
    CREDIT: "bg-green-100 text-green-600",
    DEBIT: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${
        map[type] || "bg-gray-100 text-gray-600"
      }`}
    >
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: any = {
    COMPLETED: "bg-green-100 text-green-600",
    PENDING: "bg-yellow-100 text-yellow-600",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

/* ================= UTIL ================= */

function formatDate(date: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
}