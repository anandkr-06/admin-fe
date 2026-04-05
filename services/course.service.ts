import { apiFetch } from "@/lib/api.client";

/* ================= COURSE DETAILS ================= */
export async function getCourseDetails(id: string) {
  return await apiFetch(`/courses/${id}`);
}