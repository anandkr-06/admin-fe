"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api.client";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    paymentStatus: "",
    minAmount: "",
    maxAmount: "",
  });

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  async function fetchOrders() {
    try {
      setLoading(true);

      const query = new URLSearchParams(
        Object.entries(filters)
          .filter(([, v]) => v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString();

      const res = await apiFetch(`/admin/orders?${query}`);

      setOrders(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      console.error("Orders API error", err);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- KPI LOGIC ---------------- */

  const totalOrders = meta?.total || 0;

  const confirmedOrders = orders.filter(
    (o) => o.status === "CONFIRMED"
  ).length;

  const pendingPayments = orders.filter(
    (o) => o.paymentStatus === "PENDING"
  ).length;

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Orders Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage learner bookings & payments
          </p>
        </div>
        <Button onClick={fetchOrders}>Refresh</Button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={totalOrders} />
        <StatCard
          title="Confirmed Orders"
          value={confirmedOrders}
          gradient="from-blue-500 to-indigo-600"
        />
        <StatCard
          title="Pending Payments"
          value={pendingPayments}
          gradient="from-orange-400 to-amber-500"
        />
        <StatCard
          title="Revenue ($)"
          value={`$ ${totalRevenue.toFixed(2)}`}
          gradient="from-green-500 to-emerald-600"
        />
      </div>

      {/* FILTERS */}
      <Card className="rounded-2xl border shadow-sm">
        <CardContent className="p-6 grid md:grid-cols-6 gap-4">
          <Input
            placeholder="Min Amount"
            type="number"
            onChange={(e) =>
              setFilters({ ...filters, minAmount: e.target.value })
            }
          />
          <Input
            placeholder="Max Amount"
            type="number"
            onChange={(e) =>
              setFilters({ ...filters, maxAmount: e.target.value })
            }
          />

          <select
            className="border rounded-lg px-3"
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="">All Status</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            className="border rounded-lg px-3"
            onChange={(e) =>
              setFilters({
                ...filters,
                paymentStatus: e.target.value,
              })
            }
          >
            <option value="">All Payments</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
          </select>

          <Button onClick={fetchOrders}>Apply</Button>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-20 text-gray-500">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <EmptyState />
          ) : (
            <OrdersTable orders={orders} />
          )}
        </CardContent>
      </Card>

      {/* PAGINATION */}
      {meta && (
        <div className="flex justify-end gap-3">
          <Button
            disabled={meta.page <= 1}
            onClick={() =>
              setFilters({
                ...filters,
                page: meta.page - 1,
              })
            }
          >
            Previous
          </Button>
          <Button
            disabled={meta.page >= meta.totalPages}
            onClick={() =>
              setFilters({
                ...filters,
                page: meta.page + 1,
              })
            }
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({
  title,
  value,
  gradient = "from-gray-700 to-gray-900",
}: any) {
  return (
    <div
      className={`rounded-2xl p-6 text-white bg-gradient-to-br ${gradient} shadow-md`}
    >
      <p className="text-sm opacity-80">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function OrdersTable({ orders }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-3 text-left">Order</th>
            <th className="p-3 text-left">Learner</th>
            <th className="p-3 text-left">Instructor</th>
            <th className="p-3 text-left">Vehicle</th>
            <th className="p-3 text-left">Slots</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Payment</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Created</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any) => (
            <tr
              key={order._id}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="p-3 font-medium">
                #{order._id.slice(-6)}
              </td>

              <td className="p-3">
                {order.learner?.firstName}{" "}
                {order.learner?.lastName}
              </td>

              <td className="p-3">
                {order.instructor?.firstName}{" "}
                {order.instructor?.lastName}
              </td>

              <td className="p-3 capitalize">
                {order.vehicleType}
              </td>

              <td className="p-3">
                {order.bookedSlots?.length || 0} Slots
              </td>

              <td className="p-3 font-semibold">
                $ {order.totalAmount}
              </td>

              <td className="p-3">
                <Badge status={order.paymentStatus} />
              </td>

              <td className="p-3">
                <Badge status={order.status} />
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

function Badge({ status }: any) {
  const styles: any = {
    CONFIRMED: "bg-blue-100 text-blue-700",
    CANCELLED: "bg-red-100 text-red-700",
    PAID: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    BOOKED: "bg-indigo-100 text-indigo-700",
    COMPLETED: "bg-green-100 text-green-700",
    RESCHEDULED: "bg-purple-100 text-purple-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 space-y-4">
      <div className="text-5xl">🧾</div>
      <h2 className="text-xl font-semibold">
        No Orders Found
      </h2>
      <p className="text-gray-500 text-sm">
        Orders will appear here once learners start booking.
      </p>
    </div>
  );
}