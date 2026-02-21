import AdminPage from "@/app/admin/components/AdminPage";
import { getInstructorProfile } from "@/services/instructor.service";

export default async function InstructorProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getInstructorProfile(params.id);

  return (
    <AdminPage title="Instructor Profile">
      <div className="grid md:grid-cols-2 gap-6">
        <Info label="First Name" value={data.firstName} />
        <Info label="Last Name" value={data.lastName} />
        <Info label="Email" value={data.email} />
        <Info label="Role" value={data.role} />
        <Info
          label="Status"
          value={data.isActive ? "Active" : "Inactive"}
        />
      </div>
    </AdminPage>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-4 bg-gray-50">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
