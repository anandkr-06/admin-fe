"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api.client";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await apiFetch("/orders"); // API ready
        setOrders(res.data || []);
        setMeta(res.meta || null);
      } catch (err) {
        console.warn("Orders API not available");
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  // ---- KPI Calculations ----
  const totalOrders = meta?.total || orders.length;

  const completedOrders = orders.filter(
    (o) => o.status === "completed"
  ).length;

  const pendingOrders = orders.filter(
    (o) => o.status === "pending"
  ).length;

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.amount || 0),
    0
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track customer orders
          </p>
        </div>
        <Button disabled>Export</Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={totalOrders} />
        <StatCard
          title="Completed Orders"
          value={completedOrders}
          color="text-green-600"
        />
        <StatCard
          title="Pending Orders"
          value={pendingOrders}
          color="text-orange-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          color="text-blue-600"
        />
      </div>

      {/* Table Section */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-16 text-gray-500">
              Loading orders...
            </div>
          ) : error || orders.length === 0 ? (
            <EmptyState />
          ) : (
            <OrdersTable orders={orders} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ----------------- Components ----------------- */

function StatCard({
  title,
  value,
  color = "text-gray-900",
}: any) {
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
      <CardContent className="p-6">
        <p className="text-sm text-gray-500">
          {title}
        </p>
        <p className={`text-3xl font-bold mt-2 ${color}`}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function OrdersTable({ orders }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="p-3">Order ID</th>
            <th className="p-3">Learner</th>
            <th className="p-3">Instructor</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any) => (
            <tr key={order._id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-medium">
                {order._id}
              </td>
              <td className="p-3">
                {order.learnerName || "-"}
              </td>
              <td className="p-3">
                {order.instructorName || "-"}
              </td>
              <td className="p-3">
                ${order.amount || 0}
              </td>
              <td className="p-3">
                <StatusBadge status={order.status} />
              </td>
              <td className="p-3">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: any) {
  const colors: any = {
    completed: "bg-green-100 text-green-700",
    pending: "bg-orange-100 text-orange-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status || "N/A"}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 space-y-4">
      <div className="text-5xl">🧾</div>
      <h2 className="text-xl font-semibold">
        No Orders Found
      </h2>
      <p className="text-gray-500 text-sm">
        Orders will appear here once customers start purchasing.
      </p>
      <Button disabled>Awaiting Orders API</Button>
    </div>
  );
}
