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
/* ================= PROFILE ================= */
export function getInstructorProfile(id: string) {
  return apiFetch(`/instructors/${id}/profile`);
}

/* ================= ORDERS ================= */
export function getInstructorOrders(id: string) {
  return apiFetch(`/instructors/${id}/orders`);
}

/* ================= PRIVATE LEARNERS ================= */
export function getInstructorPrivateLearners(id: string) {
  return apiFetch(`/instructors/${id}/profile`);
}

/* ================= PRIVATE ORDERS ================= */
export function getInstructorPrivateOrders(id: string) {
  return apiFetch(`/instructors/${id}/private-orders`);
}

/* ================= STATS ================= */
export function getInstructorStats(id: string) {
  return apiFetch(`/instructors/${id}/orders`);
}

/* ================= SOFT DELETE ================= */
export function deleteInstructor(id: string) {
  return apiFetch(`/instructors/${id}`, {
    method: "DELETE",
  });
}

