"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminPage from "@/app/admin/components/AdminPage";
import { getLearnerFeedbacks } from "@/services/learners.service";

export default function FeedbackPage() {
  const { id } = useParams();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchFeedbacks() {
      try {
        setLoading(true);
        const res = await getLearnerFeedbacks(id as string);
        setData(res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeedbacks();
  }, [id]);

  if (loading) {
    return (
      <AdminPage title="Feedbacks">
        <div className="p-6 text-gray-400">Loading...</div>
      </AdminPage>
    );
  }

  return (
    <AdminPage title="Feedbacks">
      <div className="space-y-4">

        {data.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-xl border">
            No Feedback Found
          </div>
        ) : (
          data.map((f) => (
            <div
              key={f._id}
              className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-3">

                {/* TYPE */}
                <TypeBadge type={f.feedbackType} />

                {/* DATE */}
                <span className="text-xs text-gray-400">
                  {formatDate(f.createdAt)}
                </span>
              </div>

              {/* DESCRIPTION */}
              <p className="text-gray-700 text-sm leading-relaxed">
                {f.description}
              </p>

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-4 text-xs text-gray-400">

                {/* OWNER */}
                <span className="capitalize">
                  {f.ownerType}
                </span>

                {/* ATTACHMENT */}
                {f.fileUrl ? (
                  <a
                    href={"https://static.anylicence.com/media/"+f.fileUrl.toString().replace("uploads/", "")}
                    target="_blank"
                    className="text-indigo-600 hover:underline"
                  >
                    View Attachment
                  </a>
                ) : (
                  <span>No Attachment</span>
                )}
              </div>
            </div>
          ))
        )}

      </div>
    </AdminPage>
  );
}

/* ================= TYPE BADGE ================= */

function TypeBadge({ type }: { type: string }) {
  const map: any = {
    SUPPORT: "bg-blue-100 text-blue-600",
    SUGGESTIONS: "bg-purple-100 text-purple-600",
    BUG: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${
        map[type] || "bg-gray-100 text-gray-600"
      }`}
    >
      {type}
    </span>
  );
}

/* ================= UTIL ================= */

function formatDate(date: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
}