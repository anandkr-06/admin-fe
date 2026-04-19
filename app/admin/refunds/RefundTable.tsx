import { useState } from "react";
import { approveRefund, rejectRefund } from "@/services/refund";

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
export default function RefundTable({ data, refresh }: any) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    try {
      setLoadingId(id);
      await approveRefund(id);

      showToast("Refund approved successfully", "success");
      refresh();
    } catch (err) {
      showToast("Failed to approve refund", "error");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setLoadingId(id);
      await rejectRefund(id);

      showToast("Refund rejected successfully", "success");
      refresh();
    } catch (err) {
      showToast("Failed to reject refund", "error");
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
        {/* HEADER */}
        <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
          <tr>
            <th className="px-6 py-4 text-left">User</th>
            <th className="px-6 py-4 text-left">Contact</th>
            <th className="px-6 py-4 text-center">Amount</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Created</th>
            <th className="px-6 py-4 text-center">Action</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y">
          {data?.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-12 text-gray-500">
                No refund requests found
              </td>
            </tr>
          ) : (
            data.map((item: any) => {
              const isLoading = loadingId === item._id;

              return (
                <tr key={item._id} className="hover:bg-gray-50 transition">
                  {/* USER */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-200 text-sm font-medium">
                        {item.learner.firstName?.[0]}
                      </div>

                      <div>
                        <div className="font-medium text-gray-900">
                          {item.learner.firstName} {item.learner.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {item._id.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* CONTACT */}
                  <td className="px-6 py-4">
                    <div className="text-gray-800">
                      {item.learner.email}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.learner.mobileNumber}
                    </div>
                  </td>

                  {/* AMOUNT */}
                  <td className="px-6 py-4 text-center font-medium">
                    ${item.amount}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4 text-center text-gray-600">
                    <div>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleTimeString()}
                    </div>
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-4 text-center">
                    {item.status === "PENDING" ? (
                      <div className="flex justify-center gap-2">
                        {/* APPROVE */}
                        <button
                          disabled={isLoading}
                          onClick={() => handleApprove(item._id)}
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
                          onClick={() => handleReject(item._id)}
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

      {/* ANIMATION STYLE */}
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