import { apiFetch } from "@/lib/api.client";

/* ================= LIST ================= */
export function getRefundRequests(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}) {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  return apiFetch(`/learners/refund-requests?${query}`);
}

/* ================= ACTION ================= */
export function approveRefund(id: string) {
  return apiFetch(`/learners/refund/${id}/approve`, {
    method: "POST",
  });
}

export function rejectRefund(id: string) {
  return apiFetch(`/learners/refund/${id}/reject`, {
    method: "POST",
  });
}