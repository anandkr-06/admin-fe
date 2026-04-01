import { apiFetch } from "@/lib/api.client";

/* ================= LIST ================= */
export function getLearners(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  return apiFetch(`/learners?${query}`);
}
export async function getLearnerProfile(id: string) {
  return await apiFetch(`/learners/${id}/profile`);
}
/* ================= ACTION ================= */
export function toggleLearner(
  id: string,
  isActive: boolean
) {
  return apiFetch(`/learners/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      isActive: !isActive, // toggle
    }),
  });
}


/* ================= DELETE ================= */
export function deleteLearner(id: string) {
  return apiFetch(`/learners/${id}`, {
    method: "DELETE",
  });
}
// export async function getLearnerProfile(id: string) {
//   const res = await apiFetch(`/learners/${id}/profile`);
//   return res.data;
// }

export async function getLearnerOrders(id: string) {
  const res = await apiFetch(`/learners/${id}/orders`);
  return res.data;
}

export async function getLearnerWallet(id: string) {
  const res = await apiFetch(`/learners/${id}/wallet`);
 
  return res.data
}

export async function getLearnerReviews(id: string) {
  const res = await apiFetch(`/learners/${id}/reviews`);
 
  return res.data
}

export async function getLearnerFeedbacks(id: string) {
  const res = await apiFetch(`/learners/${id}/feedbacks`);
 
  return res.data
}

export async function getLearnerStats(id: string) {
  return await apiFetch(`/learners/${id}/stats`);
}
