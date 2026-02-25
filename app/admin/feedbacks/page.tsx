"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFeedbacks } from "@/services/admin.service";
import { MessageSquare, Paperclip } from "lucide-react";

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const res = await getFeedbacks({
          page: 1,
          limit: 10,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        setFeedbacks(res.data || []);
        setMeta(res.meta || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const total = meta?.total || 0;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            Feedback Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor comments, questions & suggestions
          </p>
        </div>

        <Button>
          <MessageSquare size={16} className="mr-2" />
          Export
        </Button>
      </div>

      {/* KPI */}
      <div className="grid md:grid-cols-1 gap-6">
        <StatCard title="Total Feedback" value={total} />
      </div>

      {/* Table */}
      <Card className="rounded-2xl shadow-sm border">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 text-center text-gray-500">
              Loading feedback...
            </div>
          ) : feedbacks.length === 0 ? (
            <EmptyState />
          ) : (
            <FeedbackTable feedbacks={feedbacks} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Components ---------------- */

function StatCard({ title, value }: any) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </CardContent>
    </Card>
  );
}

function FeedbackTable({ feedbacks }: any) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function getFileUrl(filePath?: string) {
    if (!filePath) return null;

    if (filePath.startsWith("http")) return filePath;

    const cleanPath = filePath.replace(/^uploads\//, "");
    return `https://static.anylicence.com/media/${cleanPath}`;
  }

  function isImage(filePath?: string) {
    if (!filePath) return false;
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(filePath);
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Owner</th>
              <th className="p-4 text-left">Attachment</th>
              <th className="p-4 text-left">Created</th>
            </tr>
          </thead>

          <tbody>
            {feedbacks.map((f: any) => {
              const fileUrl = getFileUrl(f.fileUrl);
              const image = isImage(f.fileUrl);

              return (
                <tr key={f._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4">
                    <TypeBadge type={f.feedbackType} />
                  </td>

                  <td className="p-4 max-w-sm">
                    <div className="line-clamp-2 text-gray-700">
                      {f.description}
                    </div>
                  </td>

                  <td className="p-4">
                    <OwnerBadge owner={f.ownerType} />
                  </td>

                  <td className="p-4">
                    {fileUrl ? (
                      <button
                        onClick={() => setPreviewUrl(fileUrl)}
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        <Paperclip size={14} />
                        View
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        No File
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-gray-500">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 relative">

            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            {/\.(jpg|jpeg|png|webp|gif)$/i.test(previewUrl) ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-[70vh] mx-auto rounded-lg"
              />
            ) : (
              <div className="text-center space-y-4">
                <p className="text-gray-700">
                  This file type cannot be previewed.
                </p>
                <a
                  href={previewUrl}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg"
                >
                  Download File
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function TypeBadge({ type }: any) {
  const styles: any = {
    COMMENTS: "bg-blue-100 text-blue-700",
    QUESTIONS: "bg-purple-100 text-purple-700",
    SUGGESTIONS: "bg-green-100 text-green-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
      {type}
    </span>
  );
}

function OwnerBadge({ owner }: any) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        owner === "learner"
          ? "bg-indigo-100 text-indigo-700"
          : "bg-orange-100 text-orange-700"
      }`}
    >
      {owner}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 space-y-4">
      <div className="text-6xl">💬</div>
      <h2 className="text-xl font-semibold">
        No Feedback Available
      </h2>
      <p className="text-gray-500 text-sm">
        User feedback will appear here once submitted.
      </p>
    </div>
  );
}