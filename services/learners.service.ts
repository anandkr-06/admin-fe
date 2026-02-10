import { apiServerFetch } from "@/lib/api.server";

export async function getLearners(params: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}) {
  const qs = new URLSearchParams();

  qs.set("page", String(params.page));
  qs.set("limit", String(params.limit));

  if (params.search) qs.set("search", params.search);
  if (params.status) qs.set("status", params.status);

  console.log("CALLING API:", `/learners?${qs.toString()}`);

  const res = await apiServerFetch(`/learners?${qs.toString()}`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch learners");
  }

  return res.json();
}
