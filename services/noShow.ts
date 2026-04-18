import { apiFetch } from "@/lib/api.client";

/* ================= LIST ================= */
export function getNoShowRequests(params: any) {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  return apiFetch(`/instructors/admin/no-show-requests?${query}`); // ✅ FIXED
}

/* ================= ACTION ================= */
export function approveNoShow(id: string, decision: string) {
  return apiFetch(`/instructors/no-show-requests/${id}/approve`, {
    method: "PATCH",
    body: JSON.stringify({ decision }),
  });
}

export function rejectNoShow(id: string, remark: string) {
  return apiFetch(`/instructors/no-show-requests/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ remark }),
  });
}