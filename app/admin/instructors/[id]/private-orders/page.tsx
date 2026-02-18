import { getInstructorPrivateOrders } from "@/services/instructor.service";

export default async function InstructorPrivateOrdersPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getInstructorPrivateOrders(params.id);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Private Orders</h1>

      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
