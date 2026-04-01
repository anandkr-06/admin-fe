"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api.client";

interface Props {
  slotType?: "TEST" | "LESSON" | "private-orders";
  title: string;
}

export default function OrdersList({ slotType, title }: Props) {
  const [orders, setOrders] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [page, slotType]);

  async function fetchOrders() {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", "10");

      if (slotType) params.append("slotType", slotType);

      const res = await apiFetch(`/admin/orders?${params.toString()}`);

      setOrders(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      console.error("Orders API error", err);
    } finally {
      setLoading(false);
    }
  }

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString();

  const statusStyles: Record<string, string> = {
    CONFIRMED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-600",
    RESCHEDULED: "bg-yellow-100 text-yellow-700",
    BOOKED: "bg-blue-100 text-blue-700",
  };

  const paymentStyles: Record<string, string> = {
    PAID: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    FAILED: "bg-red-100 text-red-600",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-500 mt-1">
          Complete overview of all bookings
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-3xl font-bold">{meta?.total || 0}</p>
          </CardContent>
        </Card>
{/* 
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </p>
          </CardContent>
        </Card> */}

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Page</p>
            <p className="text-3xl font-bold">
              {meta?.page || 1} / {meta?.totalPages || 1}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="rounded-2xl shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-16 text-gray-500">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              No orders found
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                      className="border-b hover:bg-gray-50 align-top"
                    >
                      {/* Order */}
                      <td className="p-4 font-semibold">
                        #{order._id.slice(-6)}
                        <div className="text-xs text-gray-400">
                          {order.vehicleType?.toUpperCase()}
                        </div>
                      </td>

                      {/* Created */}
                      <td className="p-4 text-xs text-gray-600">
                        {formatDate(order.createdAt)}
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

                      {/* Slots (FIXED HERE) */}
                      <td className="p-4 text-xs">
                        {order.bookedSlots?.length ? (
                          <div className="space-y-2 max-w-[220px]">
                            {order.bookedSlots.map((slot: any) => (
                              <div
                                key={slot._id}
                                className="border rounded-lg p-2 bg-gray-50"
                              >
                                <p className="font-medium">
                                  {slot.date}
                                </p>

                                <p className="text-gray-600">
                                  {slot.startTime} - {slot.endTime}
                                </p>

                                <div className="flex items-center gap-2 mt-1">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
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
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">
                            No slots
                          </span>
                        )}
                      </td>

                      {/* Payment */}
                      <td className="p-4 text-xs space-y-1">
                        <p className="font-semibold text-green-600">
                          {formatCurrency(order.totalAmount)}
                        </p>

                        <p className="text-gray-500">
                          Payable:{" "}
                          {formatCurrency(order.payableAmount || 0)}
                        </p>

                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
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
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Page {meta.page} of {meta.totalPages}
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              disabled={meta.page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            <Button
              disabled={meta.page >= meta.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}