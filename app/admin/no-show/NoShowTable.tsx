import { useState } from "react";

/* ---------------- TOAST ---------------- */
const showToast = (message: string, type: "success" | "error" = "success") => {
  const toast = document.createElement("div");

  toast.className = `
    fixed top-5 right-5 z-[9999]
    px-4 py-2 rounded-lg shadow-lg text-white text-sm font-medium
    ${type === "success" ? "bg-green-600" : "bg-red-600"}
    animate-slideIn
  `;

  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};

/* ---------------- COMPONENT ---------------- */
export default function NoShowTable({ data, onAction }: any) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (type: "approve" | "reject", item: any) => {
    try {
      setLoadingId(item._id);

      await onAction(type, item);

      showToast(
        type === "approve"
          ? "No-show request approved"
          : "No-show request rejected",
        "success"
      );
    } catch (err) {
      showToast("Action failed. Please try again.", "error");
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
          <tr>
            <th className="px-6 py-4 text-left">Instructor</th>
            <th className="px-6 py-4 text-left">Learner</th>
            <th className="px-6 py-4 text-center">Slot</th>
            <th className="px-6 py-4 text-center">Reason</th>
            <th className="px-6 py-4 text-center">Attachment</th>
            <th className="px-6 py-4 text-center">Comments</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {data?.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-12 text-gray-500">
                No records found
              </td>
            </tr>
          ) : (
            data.map((item: any) => {
              const isLoading = loadingId === item._id;

              const fileUrl = item.attachment
                ? `https://static.anylicence.com/media/${item.attachment.replace(
                    /^uploads\//,
                    ""
                  )}`
                : null;

              return (
                <tr key={item._id} className="hover:bg-gray-50 transition">
                  {/* Instructor */}
                  <td className="px-6 py-4 font-medium">
                    {item.instructorName}
                  </td>

                  {/* Learner */}
                  <td className="px-6 py-4">
                    {item.learnerName || "N/A"}
                  </td>

                  {/* Slot */}
                  <td className="px-6 py-4 text-center">
                    <div>{item.slotDate}</div>
                    <div className="text-xs text-gray-400">
                      {item.startTime} - {item.endTime}
                    </div>
                  </td>

                  {/* Reason */}
                  <td className="px-6 py-4 text-center">
                    {item.reasonType}
                  </td>

                  {/* Attachment */}
                  <td className="px-6 py-4 text-center">
                    {fileUrl ? (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 font-medium hover:underline"
                      >
                        View File
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">No file</span>
                    )}
                  </td>

                  {/* Comments */}
                  <td className="px-6 py-4 text-center">
                    {item.comment || "—"}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-center">
                    {item.status === "PENDING" ? (
                      <div className="flex justify-center gap-2">
                        {/* APPROVE */}
                        <button
                          disabled={isLoading}
                          onClick={() => handleAction("approve", item)}
                          className="
                            px-4 py-2 text-xs font-semibold rounded-lg
                            bg-green-600 text-white
                            shadow-sm
                            hover:bg-green-700 hover:shadow-md
                            active:scale-95
                            disabled:opacity-50 disabled:cursor-not-allowed
                            flex items-center gap-2 transition
                          "
                        >
                          {isLoading && (
                            <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          )}
                          Approve
                        </button>

                        {/* REJECT */}
                        <button
                          disabled={isLoading}
                          onClick={() => handleAction("reject", item)}
                          className="
                            px-4 py-2 text-xs font-semibold rounded-lg
                            bg-red-600 text-white
                            shadow-sm
                            hover:bg-red-700 hover:shadow-md
                            active:scale-95
                            disabled:opacity-50 disabled:cursor-not-allowed
                            flex items-center gap-2 transition
                          "
                        >
                          {isLoading && (
                            <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          )}
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* ANIMATION */}
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease;
          }
        `}
      </style>
    </div>
  );
}