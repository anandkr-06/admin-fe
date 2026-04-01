"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getReviews } from "@/services/admin.service";
import { MessageSquare } from "lucide-react";
import { updateReviewStatus } from "@/services/admin.service";

/* ---------------- Table ---------------- */
type ReviewStatus = "approved" | "pending" | "rejected";

function ReviewsTable({ reviews, onStatusChange }: any) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleUpdate(id: string, status: string) {
    try {
      setLoadingId(id);
      await onStatusChange(id, status);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="p-4 text-left">Rating</th>
            <th className="p-4 text-left">Comment</th>
            <th className="p-4 text-left">Instructor</th>
            <th className="p-4 text-left">Learner</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Actions</th>
            <th className="p-4 text-left">Created</th>
          </tr>
        </thead>

        <tbody>
          {reviews.map((r: any) => (
            <tr key={r._id} className="border-b hover:bg-gray-50">
              
              <td className="p-4">⭐ {r.rating}</td>

              <td className="p-4 max-w-sm">
                <div className="line-clamp-2">{r.comment}</div>
              </td>

              <td className="p-4 text-xs">{r.instructorId}</td>
              <td className="p-4 text-xs">{r.learnerId}</td>

              <td className="p-4">
                <StatusBadge status={r.status} />
              </td>

              {/* ✅ ACTIONS */}
              <td className="p-4 flex gap-2">
                <Button
                  size="sm"
                  disabled={loadingId === r._id || r.status === "approved"}
                  onClick={() => handleUpdate(r._id, "approved")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {loadingId === r._id ? "..." : "Approve"}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={loadingId === r._id || r.status === "rejected"}
                  onClick={() => handleUpdate(r._id, "rejected")}
                >
                  Reject
                </Button>
              </td>

              <td className="p-4 text-gray-500">
                {new Date(r.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Status Badge ---------------- */

function StatusBadge({ status }: any) {
  const styles: any = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${styles[status]}`}>
      {status}
    </span>
  );
}

/* ---------------- KPI ---------------- */

function StatCard({ title, value }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </CardContent>
    </Card>
  );
}

/* ---------------- Pagination ---------------- */

function Pagination({ meta, page, setPage }: any) {
  if (!meta || meta.totalPages <= 1) return null;

  return (
    <div className="flex justify-end gap-2">
      <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Prev
      </Button>

      <span className="px-3 py-2 text-sm">
        {page} / {meta.totalPages}
      </span>

      <Button
        disabled={page === meta.totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}

/* ---------------- Empty ---------------- */

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="text-5xl">⭐</div>
      <h2 className="font-semibold mt-2">No Reviews Found</h2>
    </div>
  );
}

/* ---------------- MAIN ---------------- */

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("approved");

  async function fetchReviews() {
    try {
      setLoading(true);

      const res = await getReviews({
        page,
        limit: 5,
        status,
      });

      setReviews(res.data || []);
      setMeta(res.pagination || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, [page, status]);

  async function handleStatusChange(id: string, status: ReviewStatus) {
  try {
    await updateReviewStatus(id, status);

    // ✅ Optimistic UI update
    setReviews((prev) =>
      prev.map((r) =>
        r._id === id ? { ...r, status } : r
      )
    );

  } catch (err) {
    console.error(err);
  }
}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reviews</h1>
          <p className="text-sm text-gray-500">
            Manage learner reviews
          </p>
        </div>

        {/* <Button>
          <MessageSquare size={16} className="mr-2" />
          Export
        </Button> */}
      </div>

      {/* KPI */}
      <StatCard title="Total Reviews" value={meta?.total || 0} />

      {/* Filters */}
      <div className="flex gap-2">
        {["approved", "pending", "rejected"].map((s) => (
          <Button
            key={s}
            variant={status === s ? "default" : "outline"}
            onClick={() => {
              setStatus(s);
              setPage(1);
            }}
          >
            {s}
          </Button>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-10 text-center">Loading...</div>
          ) : reviews.length === 0 ? (
            <EmptyState />
          ) : (
            <ReviewsTable reviews={reviews} onStatusChange={handleStatusChange}/>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <Pagination meta={meta} page={page} setPage={setPage} />
    </div>
  );
}