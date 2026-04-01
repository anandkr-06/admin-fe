"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminPage from "@/app/admin/components/AdminPage";
import { getLearnerOrders } from "@/services/learners.service";

export default function OrdersPage() {
  const { id } = useParams();

  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  useEffect(() => {
    if (!id) return;

    getLearnerOrders(id as string).then((res) => {
      setOrders(res || []);
    });
  }, [id]);

  // 🔍 FILTER LOGIC
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o._id
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPayment = paymentFilter
      ? o.paymentStatus === paymentFilter
      : true;

    return matchesSearch && matchesPayment;
  });

  return (
    <AdminPage title="Orders">
      <div className="bg-white rounded-2xl border shadow-sm">

        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <input
            placeholder="Search by order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-64 outline-none focus:ring-2 focus:ring-indigo-200"
          />

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="">All Payments</option>
            <option value="PAID">PAID</option>
            <option value="PENDING">PENDING</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            {/* HEAD */}
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4">Order</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Hours</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-400"
                  >
                    No Orders Found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr
                    key={o._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {/* ORDER */}
                    <td className="p-4 font-medium text-indigo-600">
                      #{o._id.slice(-6)}
                    </td>

                    {/* VEHICLE */}
                    <td className="p-4 capitalize">
                      {o.vehicleType}
                    </td>

                    {/* HOURS */}
                    <td className="p-4">
                      {o.usedHours} hrs
                    </td>

                    {/* AMOUNT */}
                    <td className="p-4 font-semibold">
                      ₹{o.totalAmount}
                    </td>

                    {/* PAYMENT */}
                    <td className="p-4">
                      <PaymentBadge status={o.paymentStatus} />
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <StatusBadge status={o.status} />
                    </td>

                    {/* CREATED */}
                    <td className="p-4 text-gray-500 text-xs">
                      {new Date(o.createdAt).toLocaleDateString()}
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

function PaymentBadge({ status }: { status: string }) {
  const map: any = {
    PAID: "bg-green-100 text-green-600",
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

function StatusBadge({ status }: { status: string }) {
  const map: any = {
    CONFIRMED: "bg-blue-100 text-blue-600",
    CANCELLED: "bg-red-100 text-red-600",
    NOSHOW: "bg-gray-200 text-gray-600",
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