"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminPage from "@/app/admin/components/AdminPage";
import { getLearnerStats } from "@/services/learners.service";

export default function StatsPage() {
  const { id } = useParams();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchStats() {
      try {
        setLoading(true);
        const res = await getLearnerStats(id as string);
        setStats(res || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [id]);

  if (loading) {
    return (
      <AdminPage title="Stats">
        <div className="p-6 text-gray-400">Loading...</div>
      </AdminPage>
    );
  }

  if (!stats) {
    return (
      <AdminPage title="Stats">
        <div className="p-6 text-gray-400">No Data Found</div>
      </AdminPage>
    );
  }

  return (
    <AdminPage title="Stats">
      <div className="space-y-6">

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <StatCard
            title="Completed Orders"
            value={stats.completedOrders}
          />

          <StatCard
            title="Slot Stats"
            value={stats.slotStats}
          />

        </div>

      </div>
    </AdminPage>
  );
}

/* ================= CARD ================= */

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      
      <p className="text-sm text-gray-500">{title}</p>

      <div className="mt-2 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">
          {value ?? 0}
        </h2>

        {/* simple visual indicator */}
        <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
          {value ?? 0}
        </div>
      </div>

    </div>
  );
}