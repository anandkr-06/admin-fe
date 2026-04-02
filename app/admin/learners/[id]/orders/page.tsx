"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminPage from "@/app/admin/components/AdminPage";
import { getLearnerOrders } from "@/services/learners.service";
import { ChevronDown } from "lucide-react";

export default function OrdersPage() {
  const { id } = useParams();

  const [orders, setOrders] = useState<any[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getLearnerOrders(id as string).then((res) => {
      setOrders(res || []);
    });
  }, [id]);

  const toggleRow = (orderId: string) => {
    setExpandedRow((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <AdminPage title="Orders">
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            {/* HEAD */}
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-500 text-xs uppercase">
                <th className="p-4"></th>
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
              {orders.map((order) => (
                <>
                  {/* ORDER ROW */}
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleRow(order._id)}
                  >
                    <td className="p-4">
                      <ChevronDown
                        size={16}
                        className={`transition ${
                          expandedRow === order._id ? "rotate-180" : ""
                        }`}
                      />
                    </td>

                    <td className="p-4 font-medium text-indigo-600">
                      #{order._id.slice(-6)}
                    </td>

                    <td className="p-4 capitalize">{order.vehicleType}</td>

                    <td className="p-4">{order.usedHours} hrs</td>

                    <td className="p-4 font-semibold">₹{order.totalAmount}</td>

                    <td className="p-4">
                      <Badge status={order.paymentStatus} type="payment" />
                    </td>

                    <td className="p-4">
                      <Badge status={order.status} type="status" />
                    </td>

                    <td className="p-4 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>

                  {/* ACCORDION SLOT ROW */}
                  {expandedRow === order._id && (
                    <tr className="bg-gray-50">
                      <td colSpan={8} className="p-4">
                        <div className="rounded-xl border bg-white p-4 space-y-4">

                          {/* HEADER */}
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-gray-700">
                              Booked Slots ({order.bookedSlots?.length})
                            </h3>
                          </div>

                          {/* SLOT GRID */}
                          <div className="grid md:grid-cols-2 gap-4">
                            {order.bookedSlots?.map((slot: any) => (
                              <div
                                key={slot._id}
                                className="border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition"
                              >
                                {/* ✅ BOOKING ID */}
                                <div className="text-xs text-indigo-600 font-semibold mb-1">
                                  Booking ID: #{slot._id.slice(-6)}
                                </div>

                                {/* DATE */}
                                <div className="font-medium text-gray-800">
                                  {new Date(slot.date).toLocaleDateString()}
                                </div>

                                {/* TIME */}
                                <div className="text-sm text-gray-600 mt-1">
                                  ⏰ {slot.startTime} - {slot.endTime}
                                </div>

                                {/* TYPE */}
                                <div className="text-sm mt-1">
                                  <span className="font-medium">Type:</span>{" "}
                                  {slot.type}
                                </div>

                                {/* STATUS */}
                                <div className="mt-2">
                                  <Badge status={slot.status} type="status" />
                                </div>

                                {/* LOCATION */}
                                {slot.pickupLocation && (
                                  <div className="text-xs text-gray-500 mt-2">
                                    📍 {slot.pickupLocation.pickupAddress},{" "}
                                    {slot.pickupLocation.suburb},{" "}
                                    {slot.pickupLocation.state}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
}

/* ================= BADGE ================= */

function Badge({ status, type }: any) {
  let styles = "bg-gray-100 text-gray-600";

  if (type === "payment") {
    if (status === "PAID") styles = "bg-green-100 text-green-700";
    if (status === "PENDING") styles = "bg-yellow-100 text-yellow-700";
  }

  if (type === "status") {
    if (status === "CONFIRMED" || status === "BOOKED")
      styles = "bg-green-100 text-green-700";
    if (status === "CANCELLED") styles = "bg-red-100 text-red-700";
    if (status === "NOSHOW") styles = "bg-gray-200 text-gray-600";
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
}