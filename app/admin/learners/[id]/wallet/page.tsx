"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminPage from "@/app/admin/components/AdminPage";
import { getLearnerWallet } from "@/services/learners.service";

export default function WalletPage() {
  const { id } = useParams();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<any>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!id) return;

    async function fetchWallet() {
      try {
        setLoading(true);
        const res = await getLearnerWallet(id as string, page);
        debugger;
        setData(res?.data || []);
        setMeta(res?.meta || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchWallet();
  }, [id, page]);

  useEffect(() => {
    if (!id) return;

    async function fetchWallet() {
      try {
        setLoading(true);
        debugger;
        const res = await getLearnerWallet(id as string);
        setData(res?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchWallet();
  }, [id]);

  const latestBalance = data?.[0]?.balanceAfter || 0;

  if (loading) {
    return (
      <AdminPage title="Wallet">
        <div className="p-6 text-gray-400">Loading...</div>
      </AdminPage>
    );
  }

  function getShortId(id: string) {
    if (!id) return "-";
    return id.slice(-6); // ✅ last 6 digits
  }

  return (
    <AdminPage title="Wallet">
      <div className="bg-white rounded-2xl border shadow-sm">
        {/* HEADER (Balance) */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-700">Balance</h2>

          <div className="text-2xl font-bold text-gray-800">
            ${latestBalance.toFixed(2)}
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* HEAD */}
            <thead className="border-b text-xs uppercase text-gray-500">
              <tr className="text-left">
                <th className="p-4">Transaction</th>
                <th className="p-4">Item Name</th>
                <th className="p-4">EntityId</th>
                <th className="p-4">Date</th>
                <th className="p-4">Source</th>
                <th className="p-4">After Balance</th>
                <th className="p-4">Amount</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    No Transactions Found
                  </td>
                </tr>
              ) : (
                data.map((t) => (
                  <tr
                    key={t._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {/* TRANSACTION */}
                    <td className="p-4 text-gray-700">
                      {t.source} ({t.type})
                    </td>

                    {/* ITEM NAME */}
                    <td className="p-4 text-gray-700">
                      {t.description || "-"}
                    </td>

                    {/* ENTITY ID */}
                    <td className="p-4 text-gray-500">
                      {getShortId(t.referenceEntityId)}
                    </td>

                    {/* DATE */}
                    <td className="p-4 text-gray-500">
                      {formatDateTime(t.createdAt)}
                    </td>

                    {/* SOURCE */}
                    <td className="p-4 text-gray-700">{t.source}</td>

                    {/* AFTER BALANCE */}
                    <td className="p-4 text-gray-700">
                      {t.balanceAfter.toFixed(2)}
                    </td>

                    {/* AMOUNT */}
                    <td
                      className={`p-4 font-semibold ${
                        t.type === "CREDIT" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.type === "CREDIT" ? "+" : "-"}${t.amount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center p-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm text-gray-600">
              Page {meta?.page} of {meta?.totalPages}
            </span>

            <button
              onClick={() =>
                setPage((p) => (meta && p < meta.totalPages ? p + 1 : p))
              }
              disabled={meta && page === meta.totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}

/* ================= UTIL ================= */

function formatDateTime(date: string) {
  if (!date) return "-";
  const d = new Date(date);

  return `${d.toLocaleDateString()} | ${d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}
