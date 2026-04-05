"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AdminPage from "@/app/admin/components/AdminPage";
import { getInstructorPrivateOrders } from "@/services/instructor.service";

export default function InstructorPrivateOrdersPage() {
  const params = useParams();
  const id = params?.id as string;

  const [orders, setOrders] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);

        const res = await getInstructorPrivateOrders(id);

        setOrders(res?.data || []);
        setMeta(res?.meta || {});
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, page]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const text =
        `${order.privateLearnerId?.firstName} ${order.privateLearnerId?.lastName} ${order.privateLearnerId?.email}`
          .toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      const matchesFilter =
        filter === "ALL" || order.paymentStatus === filter;

      return matchesSearch && matchesFilter;
    });
  }, [orders, search, filter]);

  return (
    <AdminPage title="Private Orders">
      <div className="space-y-6">

        {/* Controls */}
        <div className="bg-white border rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Search learner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 px-3 py-2 border rounded-lg text-sm"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="ALL">All Payments</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">Learner</th>
                  <th className="px-4 py-3 text-left">Contact</th>
                  <th className="px-4 py-3 text-left">Vehicle</th>
                  <th className="px-4 py-3 text-left">Slot</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Payment</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Created</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="text-center py-10">
                      Loading...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-10">
                      No data found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const slot = order.lessonSlots?.[0];

                    return (
                      <tr
                        key={order._id}
                        className="border-t hover:bg-gray-50"
                      >
                        {/* Learner */}
                        <td className="px-4 py-3 font-medium">
                          {order.privateLearnerId?.firstName}{" "}
                          {order.privateLearnerId?.lastName}
                        </td>

                        {/* Contact */}
                        <td className="px-4 py-3 text-gray-600">
                          <div>{order.privateLearnerId?.email}</div>
                          <div className="text-xs">
                            {order.privateLearnerId?.mobileNumber}
                          </div>
                        </td>

                        {/* Vehicle */}
                        <td className="px-4 py-3">
                          {order.vehicleType}
                        </td>

                        {/* Slot */}
                        <td className="px-4 py-3">
                          {slot?.bookingDate}
                          <div className="text-xs text-gray-500">
                            {slot?.startTime} - {slot?.endTime}
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-4 py-3 text-xs">
                          {slot?.pickupAddress}
                          <div>
                            {slot?.suburb}, {slot?.state}
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3">
                          {formatAUD(slot?.price)}
                        </td>

                        {/* Total */}
                        <td className="px-4 py-3 font-semibold">
                          {formatAUD(order.totalAmount)}
                        </td>

                        {/* Payment */}
                        <td className="px-4 py-3">
                          <PaymentBadge status={order.paymentStatus} />
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <Badge status={order.status} />
                        </td>

                        {/* Created */}
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleString("en-AU", {
                            timeZone: "Australia/Sydney",
                          })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4 border-t text-sm">
            <span>
              Page {meta?.page || 1} of {meta?.totalPages || 1}
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              <button
                disabled={page === meta?.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}

/* ---------- Utils ---------- */

function formatAUD(amount?: number) {
  if (!amount) return "$0.00";

  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amount);
}

function Badge({ status }: { status: string }) {
  const colors: any = {
    CONFIRMED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs ${
        colors[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const colors: any = {
    PAID: "bg-blue-100 text-blue-700",
    PENDING: "bg-orange-100 text-orange-700",
    FAILED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs ${
        colors[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
}