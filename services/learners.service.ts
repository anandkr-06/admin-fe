// import { apiServerFetch } from "@/lib/api";

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

  // const res = await apiServerFetch(`/learners?${qs.toString()}`);
const res = {ok:"ok",data:[]};
  if (!res.ok) {
    // const err = await res.json();
    // throw new Error(err.message || "Failed to fetch learners");
  }

  return res;
}



import { apiFetch } from "@/lib/api.client";

export function getInstructors(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
}) {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();
  return apiFetch(`/learners?${query}`);
}

export function toggleInstructor(
  id: string,
  action: "activate" | "deactivate",
) {
  return apiFetch(`/learners/${id}/${action}`, {
    method: "PATCH",
  });
}
