"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminPage from "@/app/admin/components/AdminPage";
import { getInstructorOrders } from "@/services/instructor.service";

export default function InstructorStatsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchStats() {
      const res = await getInstructorOrders(id);
      const orders = res.data || [];

      const totalOrders = orders.length;

      const totalRevenue = orders.reduce(
        (sum: number, o: any) => sum + (o.payableAmount || 0),
        0,
      );

      const totalHours = orders.reduce(
        (sum: number, o: any) => sum + (o.totalHours || 0),
        0,
      );

      const uniqueLearners = new Set(orders.map((o: any) => o.learnerId?._id));

      setStats({
        totalOrders,
        totalRevenue,
        totalHours,
        activeLearners: uniqueLearners.size,
      });
    }

    fetchStats();
  }, [id]);

  if (!stats) {
    return (
      <AdminPage title="Instructor Stats">
        <div className="p-6">Loading stats...</div>
      </AdminPage>
    );
  }

  return (
    <AdminPage title="Instructor Stats">
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={stats.totalOrders} />
        <StatCard
          title="Total Revenue"
          value={new Intl.NumberFormat("en-AU", {
            style: "currency",
            currency: "$",
          }).format(stats.totalRevenue)}
        />
        <StatCard title="Total Hours" value={`${stats.totalHours} hrs`} />
        <StatCard title="Active Learners" value={stats.activeLearners} />
      </div>
    </AdminPage>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
