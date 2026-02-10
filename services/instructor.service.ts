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
  return apiFetch(`/instructors?${query}`);
}

export function toggleInstructor(
  id: string,
  action: "activate" | "deactivate",
) {
  return apiFetch(`/instructors/${id}/${action}`, {
    method: "PATCH",
  });
}
