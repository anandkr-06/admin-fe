"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getGiftVouchers } from "@/services/admin.service";

export default function GiftVouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const res = await getGiftVouchers({
          page: 1,
          limit: 10,
          sortBy: "amount",
          sortOrder: "desc",
        });

        setVouchers(res.data || []);
        setMeta(res.meta || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const totalVouchers = meta?.total || 0;
  const totalAmount = vouchers.reduce(
    (sum, v) => sum + (v.amount || 0),
    0
  );
  const pendingCount = vouchers.filter(
    (v) => v.status === "PENDING"
  ).length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            Gift Vouchers
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage issued gift vouchers
          </p>
        </div>
        {/* <Button>Export</Button> */}
      </div>

      {/* KPI */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Total Vouchers" value={totalVouchers} />
        <StatCard
          title="Pending Vouchers"
          value={pendingCount}
          color="text-orange-600"
        />
        <StatCard
          title="Total Amount"
          value={`$${totalAmount}`}
          color="text-blue-600"
        />
      </div>

      {/* Table */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-16 text-gray-500">
              Loading vouchers...
            </div>
          ) : vouchers.length === 0 ? (
            <EmptyState icon="🎁" title="No Vouchers Found" />
          ) : (
            <VoucherTable vouchers={vouchers} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Components ---------------- */

function StatCard({ title, value, color = "text-gray-900" }: any) {
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
      <CardContent className="p-6">
        <p className="text-sm text-gray-500">{title}</p>
        <p className={`text-3xl font-bold mt-2 ${color}`}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function VoucherTable({ vouchers }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="p-3">Recipient</th>
            <th className="p-3">Sender</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Balance</th>
            <th className="p-3">Expires</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((v: any) => (
            <tr key={v._id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                {v.recipient.firstName} {v.recipient.lastName}
              </td>
              <td className="p-3">
                {v.sender.firstName} {v.sender.lastName}
              </td>
              <td className="p-3">${v.amount}</td>
              <td className="p-3">${v.balance}</td>
              <td className="p-3">
                {new Date(v.expiresAt).toLocaleDateString()}
              </td>
              <td className="p-3">
                <StatusBadge status={v.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: any) {
  const styles: any = {
    PENDING: "bg-orange-100 text-orange-700",
    REDEEMED: "bg-green-100 text-green-700",
    EXPIRED: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function EmptyState({ icon, title }: any) {
  return (
    <div className="text-center py-16 space-y-4">
      <div className="text-5xl">{icon}</div>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
}