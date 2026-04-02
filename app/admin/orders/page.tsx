"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api.client";

export default function OrdersTablePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // ✅ FILTER STATE
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    search: "",
  });

  // ✅ FETCH DATA
  useEffect(() => {
    fetchOrders();
  }, [page, filters]);

  async function fetchOrders() {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        page: String(page),
        limit: "10",
        ...(filters.status && { status: filters.status }),
        ...(filters.paymentStatus && {
          paymentStatus: filters.paymentStatus,
        }),
        ...(filters.search && { search: filters.search }),
      });

      const res = await apiFetch(`/admin/orders?${query}`);

      setOrders(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const statusStyles: any = {
    CONFIRMED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-600",
    RESCHEDULED: "bg-yellow-100 text-yellow-700",
    BOOKED: "bg-blue-100 text-blue-700",
  };

  const paymentStyles: any = {
    PAID: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="space-y-6">
      {/* 🔥 FILTER BAR */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4 flex flex-wrap gap-4 items-center">
          {/* Search */}
          <input
            type="text"
            placeholder="Search learner/instructor"
            value={filters.search}
            onChange={(e) => {
              setPage(1);
              setFilters((prev) => ({
                ...prev,
                search: e.target.value,
              }));
            }}
            className="border px-3 py-2 rounded-lg text-sm w-60"
          />

          {/* Status Filter */}
          {/* <select
            value={filters.status}
            onChange={(e) => {
              setPage(1);
              setFilters((prev) => ({
                ...prev,
                status: e.target.value,
              }));
            }}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            <option value="">All Status</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="RESCHEDULED">RESCHEDULED</option>
            <option value="BOOKED">BOOKED</option>
          </select> */}

          {/* Payment Filter */}
          <select
            value={filters.paymentStatus}
            onChange={(e) => {
              setPage(1);
              setFilters((prev) => ({
                ...prev,
                paymentStatus: e.target.value,
              }));
            }}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            <option value="">All Payments</option>
            <option value="PAID">PAID</option>
            <option value="PENDING">PENDING</option>
          </select>

          {/* Reset */}
          <Button
            variant="outline"
            onClick={() => {
              setFilters({
                status: "",
                paymentStatus: "",
                search: "",
              });
              setPage(1);
            }}
          >
            Reset
          </Button>
        </CardContent>
      </Card>

      {/* 📊 TABLE */}
      <Card className="rounded-2xl shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-20">Loading...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-gray-600">
                  <th className="p-4 text-left">Order</th>
                  <th className="p-4 text-left">Created</th>
                  <th className="p-4 text-left">Learner</th>
                  <th className="p-4 text-left">Instructor</th>
                  <th className="p-4 text-left">Booking</th>
                  <th className="p-4 text-left">Slots</th>
                  <th className="p-4 text-left">Payment</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order: any) => (
                  <tr
                    key={order._id}
                    className="border-b align-top hover:bg-gray-50"
                  >
                    {/* Order */}
                    <td className="p-4 font-medium">
                      #{order._id.slice(-6)}
                      <div className="text-xs text-gray-400 uppercase">
                        {order.vehicleType}
                      </div>
                    </td>

                    {/* Created */}
                    <td className="p-4 text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>

                    {/* Learner */}
                    <td className="p-4">
                      <p className="font-medium">
                        {order.learner?.firstName}{" "}
                        {order.learner?.lastName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.learner?.email}
                      </p>
                    </td>

                    {/* Instructor */}
                    <td className="p-4">
                      <p className="font-medium">
                        {order.instructor?.firstName}{" "}
                        {order.instructor?.lastName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.instructor?.email}
                      </p>
                    </td>

                    {/* Booking */}
                    <td className="p-4 text-xs space-y-1">
                      <p>
                        Mode:{" "}
                        <span className="font-medium">
                          {order.bookingMode}
                        </span>
                      </p>
                      <p>
                        Slots:{" "}
                        <span className="font-medium">
                          {order.bookedSlots?.length || 0}
                        </span>
                      </p>
                    </td>

                    {/* Slots */}
                    <td className="p-4">
                      <div className="space-y-2 min-w-[180px]">
                        {order.bookedSlots?.length ? (
                          order.bookedSlots.map((slot: any) => (
                            <div
                              key={slot._id}
                              className="border rounded-xl p-3 bg-gray-50"
                            >
                               <div className="text-xs text-indigo-600 font-semibold mb-1">
                                Booking ID: #{slot._id.slice(-6)}
                              </div>
                              <p className="text-xs font-medium">
                                {slot.date}
                              </p>

                              <p className="text-xs text-gray-600">
                                {slot.startTime} - {slot.endTime}
                              </p>

                              <div className="flex items-center gap-2 mt-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-[10px] ${
                                    statusStyles[slot.status] ||
                                    "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {slot.status}
                                </span>

                                <span className="text-[10px] text-gray-400">
                                  {slot.type}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">
                            No slots
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Payment */}
                    <td className="p-4 text-xs">
                      <p className="font-semibold text-green-600">
                        {formatCurrency(order.totalAmount)}
                      </p>

                      <p className="text-gray-400">
                        Payable:{" "}
                        {formatCurrency(order.payableAmount || 0)}
                      </p>

                      <span
                        className={`inline-block mt-1 px-2 py-1 rounded-full text-[10px] ${
                          paymentStyles[order.paymentStatus] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          statusStyles[order.status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* 🔁 PAGINATION */}
      {meta && (
        <div className="flex justify-end gap-3">
          <Button
            disabled={meta.page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>

          <Button
            disabled={meta.page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}