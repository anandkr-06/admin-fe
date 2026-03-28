"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AdminPage from "@/app/admin/components/AdminPage";
import { getInstructorPrivateOrders } from "@/services/instructor.service";

export default function InstructorPrivateOrdersPage() {
  const params = useParams();
  const id = params?.id as string;

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);
        const res = await getInstructorPrivateOrders(id);
        setOrders(res?.data || []);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        `${order.privateLearnerId?.firstName} ${order.privateLearnerId?.lastName} ${order.privateLearnerId?.email}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "ALL" || order.paymentStatus === filter;

      return matchesSearch && matchesFilter;
    });
  }, [orders, search, filter]);

  return (
    <AdminPage title="Private Orders">
      <div className="space-y-8">

        {/* Controls */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search learner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="ALL">All Payments</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white border rounded-2xl p-10 text-center text-gray-500 shadow-sm">
            Loading private orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white border rounded-2xl p-12 text-center text-gray-500 shadow-sm">
            No private orders found.
          </div>
        ) : (
          <div className="space-y-8">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all p-6 space-y-6"
              >
                {/* Header */}
                <div className="flex justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {order.privateLearnerId?.firstName}{" "}
                      {order.privateLearnerId?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.privateLearnerId?.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.privateLearnerId?.mobileNumber}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Badge status={order.status} />
                    <PaymentBadge status={order.paymentStatus} />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-6">

                  {/* Vehicle */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Vehicle Type
                    </p>
                    <p className="font-medium capitalize text-gray-900">
                      {order.vehicleType}
                    </p>
                  </div>

                  {/* Lesson Slots */}
                  {order.lessonSlots?.length > 0 && (
                    <Section title="Lesson Slots">
                      {order.lessonSlots.map((slot: any, i: number) => (
                        <div
                          key={i}
                          className="bg-gray-50/60 border border-gray-100 rounded-xl p-4 text-sm space-y-1"
                        >
                          <p>
                            {slot.bookingDate} | {slot.startTime} -{" "}
                            {slot.endTime}
                          </p>
                          <p>
                            {slot.pickupAddress}, {slot.suburb}, {slot.state}
                          </p>
                          <p className="font-semibold text-gray-900">
                            {formatAUD(slot.price)}
                          </p>
                        </div>
                      ))}
                    </Section>
                  )}

                  {/* Test Package */}
                  {order.testPackage && (
                    <Section title="Test Package">
                      <div className="bg-gray-50/60 border border-gray-100 rounded-xl p-4 text-sm space-y-1">
                        <p>
                          {order.testPackage.bookingDate} |{" "}
                          {order.testPackage.startTime} -{" "}
                          {order.testPackage.endTime}
                        </p>
                        <p>{order.testPackage.testLocation}</p>
                        <p>Pickup: {order.testPackage.pickupPoint}</p>
                        <p>Drop: {order.testPackage.dropPoint}</p>
                        <p className="font-semibold text-gray-900">
                          {formatAUD(order.testPackage.price)}
                        </p>
                      </div>
                    </Section>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                  <span className="text-xs text-gray-400">
                    Created:{" "}
                    {new Date(order.createdAt).toLocaleString("en-AU")}
                  </span>

                  <span className="text-xl font-bold text-gray-900">
                    {formatAUD(order.totalAmount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminPage>
  );
}

/* ---------- Currency Formatter ---------- */

function formatAUD(amount: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "$",
  }).format(amount);
}

/* ---------- Section ---------- */

function Section({ title, children }: any) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
        {title}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/* ---------- Status Badge ---------- */

function Badge({ status }: { status: string }) {
  const colors: any = {
    CONFIRMED: "bg-green-100 text-green-700",
    PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

/* ---------- Payment Badge ---------- */

function PaymentBadge({ status }: { status: string }) {
  const colors: any = {
    PAID: "bg-blue-100 text-blue-700",
    PENDING: "bg-orange-100 text-orange-700",
    FAILED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
