"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getInstructorOrders } from "@/services/instructor.service";
import AdminPage from "@/app/admin/components/AdminPage";
import { ChevronDown } from "lucide-react";

export default function InstructorOrdersPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [orders, setOrders] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      setLoading(true);
      const res = await getInstructorOrders(id);
      setOrders(res?.data || []);
      setMeta(res?.meta || null);
      setLoading(false);
    }

    fetchData();
  }, [id]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.learnerId?.firstName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        order.learnerId?.lastName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        order._id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || order.paymentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  return (
    <AdminPage title="Instructor Orders">
      <div className="space-y-4">
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search by learner or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Payments</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-6 text-gray-500">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No matching orders found
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 text-gray-600 uppercase text-xs tracking-wider z-10">
                  <tr>
                    <th className="p-4"></th>
                    <th className="p-4 text-left">Order</th>
                    <th className="p-4 text-left">Learner</th>
                    <th className="p-4 text-left">Vehicle</th>
                    <th className="p-4 text-left">Hours</th>
                    <th className="p-4 text-left">Amount</th>
                    <th className="p-4 text-left">Payment</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Created</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <>
                      {/* Main Row */}
                      <tr
                        key={order._id}
                        className="border-t hover:bg-gray-50 cursor-pointer transition"
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

                        <td className="p-4">
                          <div className="font-medium">
                            {order.learnerId?.firstName}{" "}
                            {order.learnerId?.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.learnerId?.email}
                          </div>
                        </td>

                        <td className="p-4 capitalize">{order.vehicleType}</td>

                        <td className="p-4">{order.usedHours} hrs</td>

                        <td className="p-4 font-semibold">
                          {new Intl.NumberFormat("en-AU", {
                            style: "currency",
                            currency: "AUD",
                          }).format(order.totalAmount)}
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium
                              ${
                                order.paymentStatus === "PAID"
                                  ? "bg-green-100 text-green-700"
                                  : order.paymentStatus === "FAILED"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                            {order.status}
                          </span>
                        </td>

                        <td className="p-4 text-gray-500 text-xs">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-AU",
                          )}
                        </td>
                      </tr>

                      {/* Accordion Row */}
                      {expandedRow === order._id && (
                        <tr className="bg-gray-50">
                          <td colSpan={9} className="p-4">
                            <div className="rounded-xl border bg-white p-4 space-y-4 shadow-sm">
                              
                              <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-gray-700">
                                  Booked Slots ({order.bookedSlots?.length})
                                </h3>
                                <span className="text-xs text-gray-500">
                                  {order.orderTypeFullName}
                                </span>
                              </div>

                              <div className="grid md:grid-cols-2 gap-4">
                                {order.bookedSlots?.map((slot: any) => (
                                  <div
                                    key={slot._id}
                                    className="border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition"
                                  >
                                    {/* Date + Status */}
                                    <div className="text-xs text-indigo-600 font-semibold mb-1">
                                Booking ID: #{slot._id.slice(-6)}
                              </div>
                                    <div className="flex justify-between items-center mb-2">
                                      <div className="font-medium text-gray-800">
                                        {new Date(slot.date).toLocaleDateString(
                                          "en-AU",
                                        )}
                                      </div>

                                      <span
                                        className={`text-xs px-2 py-1 rounded-full font-medium
                                        ${
                                          slot.status === "BOOKED"
                                            ? "bg-green-100 text-green-700"
                                            : slot.status === "CANCELLED"
                                              ? "bg-red-100 text-red-700"
                                              : "bg-yellow-100 text-yellow-700"
                                        }`}
                                      >
                                        {slot.status}
                                      </span>
                                    </div>

                                    {/* Time */}
                                    <div className="text-sm text-gray-600">
                                      ⏰ {slot.startTime} - {slot.endTime}
                                    </div>

                                    {/* Type */}
                                    <div className="text-sm mt-1">
                                      <span className="font-medium">Type:</span>{" "}
                                      {slot.type}
                                    </div>

                                    {/* Lesson */}
                                    {slot.type === "LESSON" &&
                                      slot.pickupLocation && (
                                        <div className="text-xs text-gray-500 mt-2">
                                          📍 {slot.pickupLocation.pickupAddress}
                                          , {slot.pickupLocation.suburb},{" "}
                                          {slot.pickupLocation.state}
                                        </div>
                                      )}

                                    {/* Test */}
                                    {slot.type === "TEST" && (
                                      <div className="text-xs text-gray-500 mt-2 space-y-1">
                                        <div>📍 Test: {slot.testLocation}</div>
                                        <div>
                                          Pickup:{" "}
                                          {slot.pickupPoint?.pickupPoint}
                                        </div>
                                        <div>
                                          Drop: {slot.dropPoint?.dropPoint}
                                        </div>
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
          )}
        </div>

        {/* Footer */}
        {meta && (
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              Showing {filteredOrders.length} of {meta.total} orders
            </div>
            <div>
              Page {meta.page} of {meta.totalPages}
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
