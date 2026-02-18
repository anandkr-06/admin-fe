import AdminPage from "@/app/admin/components/AdminPage";
import { getInstructorPrivateLearners } from "@/services/instructor.service";

export default async function Page({ params }: { params: { id: string } }) {
  const learners = await getInstructorPrivateLearners(params.id);

  return (
    <AdminPage title="Private Learners">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {learners.map((l: any) => (
          <div key={l._id} className="border rounded-lg p-4 bg-gray-50">
            <p className="font-medium">{l.name}</p>
            <p className="text-sm text-gray-500">{l.email}</p>
          </div>
        ))}
      </div>
    </AdminPage>
  );
}
