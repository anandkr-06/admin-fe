import { useState } from "react";
import { approveNoShow, rejectNoShow } from "@/services/noShow";

export default function ActionModal({ type, item, onClose, refresh }: any) {
  const [remark, setRemark] = useState("");
  const [decision, setDecision] = useState("PAY_INSTRUCTOR");
  const [loading, setLoading] = useState(false);
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
  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (type === "approve") {
        await approveNoShow(item._id, {
          decision,
          remark, // ✅ include remark
        });
        showToast(
        type === "approve"
          ? "No-show request approved"
          : "No-show request rejected",
        "success"
      );
      } else {
        await rejectNoShow(item._id, remark); // ✅ FIXED
      }

      onClose();
      refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-5 w-[400px] rounded-xl">
        <h2 className="text-lg font-semibold mb-3">
          {type === "approve" ? "Approve Request" : "Reject Request"}
        </h2>

        {type === "approve" && (
          <select
            className="w-full border p-2 mb-3"
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
          >
            <option value="PAY_INSTRUCTOR">Pay Instructor</option>
            <option value="REFUND_LEARNER">Refund Learner</option>
          </select>
        )}
        <textarea
          placeholder="Enter remark..."
          className="w-full border p-2 mb-3"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
