"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api.client";

interface Props {
  slotType?: "TEST" | "LESSON";
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

      if (slotType) {
        params.append("slotType", slotType);
      }

      const res = await apiFetch(
        `/admin/orders?${params.toString()}`
      );

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-500 mt-1">
          Manage and track bookings
        </p>
      </div>

      {/* KPI */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6 flex justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Total Orders
            </p>
            <p className="text-2xl font-bold">
              {meta?.total || 0}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Revenue ($)
            </p>
            <p className="text-2xl font-bold text-green-600">
              $ {totalRevenue.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-16">
              Loading...
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-3 text-left">
                    Order
                  </th>
                  <th className="p-3 text-left">
                    Learner
                  </th>
                  <th className="p-3 text-left">
                    Instructor
                  </th>
                  <th className="p-3 text-left">
                    Slots
                  </th>
                  <th className="p-3 text-left">
                    Amount
                  </th>
                  <th className="p-3 text-left">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50"
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
                    <td className="p-3">
                      {order.bookedSlots?.length || 0}
                    </td>
                    <td className="p-3 font-semibold">
                      $ {order.totalAmount}
                    </td>
                    <td className="p-3">
                      {order.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta && (
        <div className="flex justify-end gap-3">
          <Button
            disabled={meta.page <= 1}
            onClick={() =>
              setPage((prev) => prev - 1)
            }
          >
            Previous
          </Button>
          <Button
            disabled={meta.page >= meta.totalPages}
            onClick={() =>
              setPage((prev) => prev + 1)
            }
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}