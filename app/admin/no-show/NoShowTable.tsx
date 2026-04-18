export default function NoShowTable({ data, onAction }: any) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
          <tr>
            <th className="px-6 py-4 text-left">Instructor</th>
            <th className="px-6 py-4 text-left">Learner</th>
            <th className="px-6 py-4 text-center">Slot</th>
            <th className="px-6 py-4 text-center">Reason</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {data?.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-12 text-gray-500">
                No records found
              </td>
            </tr>
          ) : (
            data.map((item: any) => (
              <tr key={item._id} className="hover:bg-gray-50">
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
                    {item.startTime}
                  </div>
                </td>

                {/* Reason */}
                <td className="px-6 py-4 text-center">
                  {item.reasonType}
                </td>

                {/* Status */}
                <td className="px-6 py-4 text-center">
                  <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                    {item.status}
                  </span>
                </td>

                {/* Action */}
                <td className="px-6 py-4 text-center">
                  {item.status === "PENDING" ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onAction("approve", item)}
                        className="px-3 py-1.5 text-xs rounded-lg bg-green-100 text-green-700"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => onAction("reject", item)}
                        className="px-3 py-1.5 text-xs rounded-lg bg-red-100 text-red-700"
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