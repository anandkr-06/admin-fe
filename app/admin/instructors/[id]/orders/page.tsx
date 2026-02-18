import AdminPage from "@/app/admin/components/AdminPage";
import { getInstructorOrders } from "@/services/instructor.service";

export default async function InstructorOrdersPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getInstructorOrders(params.id);

  return (
    <AdminPage title="Instructor Orders">
      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="p-3 text-left">Order ID</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((o: any) => (
            <tr key={o._id} className="border-t">
              <td className="p-3">{o._id}</td>
              <td className="p-3">₹ {o.amount}</td>
              <td className="p-3">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminPage>
  );
}
