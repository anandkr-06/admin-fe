import InstructorsTable from "./InstructorsTable";
import Filters from "./InstructorFilters";
import { getInstructors } from "@/services/instructor.service";

export default async function InstructorsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    role?: string;
  }>;
}) {
  const params = await searchParams; // ✅ REQUIRED

  const page = Number(params.page || 1);

  const data = await getInstructors({
    page,
    limit: 10,
    search: params.search,
    status: params.status,
    role: params.role,
  });
  console.log("🚀 ~ file: page.tsx:22 ~ InstructorsPage ~ data:", data);
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Instructors</h1>

      <Filters />
      
      <InstructorsTable
        instructors={data.data}
        meta={data.meta}
      />
    </div>
  );
}
