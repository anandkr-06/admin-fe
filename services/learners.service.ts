import { apiServerFetch } from "@/lib/api.server";
import { apiFetch } from "@/lib/api.client";

export function toggleLearner(id: string, isActive: boolean) {
  return apiFetch(`/learners/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      isActive: !isActive,
    }),
  });
}


export async function getLearners(params: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}) {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  const res = await apiServerFetch(`/learners?${query}`);

  if (!res.ok) {
    throw new Error("Failed to fetch learners");
  }

  const json = await res.json();

  return {
    data: json.data || [],
    meta: {
      page: json.page || 1,
      limit: json.limit || 10,
      total: json.total || 0,
      totalPages: Math.ceil(
        (json.total || 0) / (json.limit || 10)
      ),
    },
  };
}
