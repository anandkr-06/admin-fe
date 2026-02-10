import Filters from "./LearnersFilters";
import { getLearners } from "@/services/learners.service";
import LearnersTable from "./LearnersTable";

export default async function LearnersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;

  const page = Number(params.page || 1);

  const data = await getLearners({
    page,
    limit: 10,
    search: params.search,   // ✅ ONLY THIS
    status: params.status,
  });

  if (!data.data.length && page > 1) {
    return (
      <div className="p-6">
        <h1 className="mb-4 text-2xl font-bold">Learners</h1>
        <Filters />
        <p className="text-gray-500">
          No learners found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Learners</h1>
      <Filters />
      <LearnersTable
        learners={data.data}
        meta={data.meta}
      />
    </div>
  );
}
