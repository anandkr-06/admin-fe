"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminPage from "@/app/admin/components/AdminPage";
import { getLearnerReviews } from "@/services/learners.service";

export default function ReviewsPage() {
  const { id } = useParams();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchReviews() {
      try {
        setLoading(true);
        const res = await getLearnerReviews(id as string);
        setReviews(res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [id]);

  if (loading) {
    return (
      <AdminPage title="Reviews">
        <div className="p-6 text-gray-400">Loading...</div>
      </AdminPage>
    );
  }

  return (
    <AdminPage title="Reviews">
      <div className="space-y-4">

        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-xl border">
            No Reviews Found
          </div>
        ) : (
          reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              {/* TOP SECTION */}
              <div className="flex justify-between items-center mb-3">
                
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <StarRating rating={r.rating} />
                  <span className="text-sm text-gray-500 ml-2">
                    {r.rating}/5
                  </span>
                </div>

                {/* Status */}
                <StatusBadge status={r.status} />
              </div>

              {/* COMMENT */}
              <p className="text-gray-700 text-sm leading-relaxed">
                {r.comment}
              </p>

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
                <span>Order: #{r.orderId?.slice(-6)}</span>
                <span>{formatDate(r.createdAt)}</span>
              </div>
            </div>
          ))
        )}

      </div>
    </AdminPage>
  );
}

/* ================= STAR RATING ================= */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="text-yellow-400 text-lg">
          {i <= rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

/* ================= STATUS BADGE ================= */

function StatusBadge({ status }: { status: string }) {
  const map: any = {
    approved: "bg-green-100 text-green-600",
    pending: "bg-yellow-100 text-yellow-600",
    rejected: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium capitalize ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

/* ================= UTIL ================= */

function formatDate(date: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
}