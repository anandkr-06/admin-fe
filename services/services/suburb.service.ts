import { apiFetch } from "@/lib/api.client";

/* ==========================
   SUBURBS
========================== */

export function getSuburbs(params: Record<string, any>) {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  return apiFetch(`/admin/suburbs?${query}`);
}



export function createSuburb(payload: any) {
  return apiFetch("/admin/suburbs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateSuburb(payload: any) {
  return apiFetch(`/admin/suburbs/${payload._id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}