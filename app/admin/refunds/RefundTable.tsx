import { approveRefund, rejectRefund } from "@/services/refund";

export default function RefundTable({ data, refresh }: any) {
  const handleApprove = async (id: string) => {
    await approveRefund(id);
    refresh();
  };

  const handleReject = async (id: string) => {
    await rejectRefund(id);
    refresh();
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
            data.map((item: any) => (
              <tr key={item._id} className="hover:bg-gray-50 transition">
                {/* USER */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
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
                  ₹{item.amount}
                </td>

                {/* STATUS */}
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
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
                      <button
                        onClick={() => handleApprove(item._id)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(item._id)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}