"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getInstructorOrders } from "@/services/instructor.service";
import AdminPage from "@/app/admin/components/AdminPage";

export default function InstructorOrdersPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [orders, setOrders] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

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
        statusFilter === "ALL" ||
        order.paymentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  return (
    <AdminPage title="Instructor Orders">
      <div className="space-y-4">

        {/* Top Controls */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

          {/* Search */}
          <input
            type="text"
            placeholder="Search by learner or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Filter */}
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

        {/* Table Container */}
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
                    <tr
                      key={order._id}
                      className="border-t hover:bg-gray-50 cursor-pointer transition"
                      onClick={() =>
                        router.push(
                          `/admin/instructors/${id}/orders/${order._id}`
                        )
                      }
                    >
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

                      <td className="p-4 capitalize">
                        {order.vehicleType}
                      </td>

                      <td className="p-4">
                        {order.totalHours} hrs
                      </td>

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
                        {new Date(order.createdAt).toLocaleDateString("en-AU")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Meta */}
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
