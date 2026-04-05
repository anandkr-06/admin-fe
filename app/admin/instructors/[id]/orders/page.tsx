"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getInstructorOrders } from "@/services/instructor.service";
import AdminPage from "@/app/admin/components/AdminPage";
import { ChevronDown } from "lucide-react";

export default function InstructorOrdersPage() {
  const params = useParams();
  const id = params?.id as string;

  const [orders, setOrders] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const toggleRow = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  // ✅ Reset page on search/filter
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  // ✅ API call with server-side params
  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      setLoading(true);

      const res = await getInstructorOrders(id, {
        page,
        search,
        status: statusFilter,
      });

      setOrders(res?.data || []);
      setMeta(res?.meta || null);
      setLoading(false);
    }

    fetchData();
  }, [id, page, search, statusFilter]);

  return (
    <AdminPage title="Instructor Orders">
      <div className="space-y-4">
        {/* Controls */}
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
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No matching orders found
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 text-gray-600 uppercase text-xs">
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
                  {orders.map((order) => (
                    <>
                      {/* Row */}
                      <tr
                        key={order._id}
                        className="border-t hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleRow(order._id)}
                      >
                        <td className="p-4">
                          <ChevronDown
                            size={16}
                            className={
                              expandedRow === order._id ? "rotate-180" : ""
                            }
                          />
                        </td>

                        <td className="p-4 text-indigo-600 font-medium">
                          #{order._id.slice(-6)}
                        </td>

                        <td className="p-4">
                          {order.learnerId?.firstName}{" "}
                          {order.learnerId?.lastName}
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
                          <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                            {order.paymentStatus}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                            {order.status}
                          </span>
                        </td>

                        <td className="p-4 text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-AU",
                          )}
                        </td>
                      </tr>

                      {/* Expanded */}
                      {expandedRow === order._id && (
                        <tr>
                          <td colSpan={9} className="p-4 bg-gray-50">
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
                                  className="border p-4 rounded-xl bg-white"
                                >
                                  <div className="text-xs text-indigo-600 font-semibold mb-1">
                                    Booking ID: #{slot._id.slice(-6)}
                                  </div>

                                  <div className="flex justify-between">
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

                                  <div className="text-sm text-gray-600">
                                    ⏰ {slot.startTime} - {slot.endTime}
                                  </div>
                                  <div className="text-sm mt-1">
                                    <span className="font-medium">Type:</span>{" "}
                                    {slot.type}
                                  </div>

                                  {/* ✅ CANCELLED + NOSHOW */}
                                  {["CANCELLED", "NOSHOW"].includes(
                                    slot.status,
                                  ) &&
                                    slot.actionMeta && (
                                      <div className="mt-3 text-xs bg-red-50 border border-red-100 rounded-lg p-2 space-y-1">
                                        <div>
                                          <span className="font-medium text-gray-600">
                                            Acted By:
                                          </span>{" "}
                                          <span className="capitalize text-red-600 font-semibold">
                                            {slot.actionMeta.actedBy}
                                          </span>
                                        </div>

                                        <div>
                                          <span className="font-medium text-gray-600">
                                            Reason:
                                          </span>{" "}
                                          {slot.actionMeta.reasonType}
                                        </div>

                                        {/* ✅ Only for NOSHOW */}
                                        {slot.status === "NOSHOW" && (
                                          <>
                                            {slot.actionMeta.comment && (
                                              <div>
                                                <span className="font-medium text-gray-600">
                                                  Comment:
                                                </span>{" "}
                                                {slot.actionMeta.comment}
                                              </div>
                                            )}

                                            {slot.actionMeta.attachment && (
                                              <div>
                                                <span className="font-medium text-gray-600">
                                                  Attachment:
                                                </span>{" "}
                                                <a
                                                  href={`https://static.anylicence.com/media/${slot.actionMeta.attachment.replace(/^uploads\//, "")}`}
                                                  target="_blank"
                                                  className="text-indigo-600 underline"
                                                >
                                                  View File
                                                </a>
                                              </div>
                                            )}
                                          </>
                                        )}

                                        <div>
                                          <span className="font-medium text-gray-600">
                                            Acted At:
                                          </span>{" "}
                                          {new Date(
                                            slot.actionMeta.actedAt,
                                          ).toLocaleString("en-AU")}
                                        </div>
                                      </div>
                                    )}
                                  {slot.type === "LESSON" &&
                                    slot.pickupLocation && (
                                      <div className="text-xs text-gray-500 mt-2">
                                        📍 {slot.pickupLocation.pickupAddress},{" "}
                                        {slot.pickupLocation.suburb},{" "}
                                        {slot.pickupLocation.state}
                                      </div>
                                    )}

                                  {slot.type === "TEST" && (
                                    <div className="text-xs text-gray-500 mt-2 space-y-1">
                                      <div>📍 Test: {slot.testLocation}</div>
                                      <div>
                                        Pickup: {slot.pickupPoint?.pickupPoint}
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

        {/* Pagination */}
        {meta && (
          <div className="flex justify-between text-sm text-gray-500">
            <div>
              Showing {orders.length} of {meta.total}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="border px-3 py-1 rounded"
              >
                Prev
              </button>

              <span>
                {meta.page} / {meta.totalPages}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === meta.totalPages}
                className="border px-3 py-1 rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
