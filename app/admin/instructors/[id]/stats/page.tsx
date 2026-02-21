import AdminPage from "@/app/admin/components/AdminPage";
import { getInstructorStats } from "@/services/instructor.service";

export default async function Page({ params }: { params: { id: string } }) {
  const stats = await getInstructorStats(params.id);

  return (
    <AdminPage title="Instructor Stats">
      <div className="grid md:grid-cols-3 gap-4">
        <Stat label="Total Orders" value={stats.totalOrders} />
        <Stat label="Total Revenue" value={`₹ ${stats.totalRevenue}`} />
        <Stat label="Active Learners" value={stats.activeLearners} />
      </div>
    </AdminPage>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border p-6 bg-white shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}
