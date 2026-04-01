import { apiFetch } from "@/lib/api.client";

export function getCourses(params: Record<string, any>) {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  return apiFetch(`/courses?${query}`);
}

export function getCourseProviders(params: Record<string, any>) {
  const query = new URLSearchParams(params as any).toString();
  return apiFetch(`/admin/course-providers?${query}`);
}

export function getLeads(params: Record<string, any>) {
  const query = new URLSearchParams(params as any).toString();
  return apiFetch(`/admin/leads?${query}`);
}

export function getFeedbacks(params: Record<string, any>) {
  const query = new URLSearchParams(params as any).toString();
  return apiFetch(`/admin/feedbacks?${query}`);
}

export function getGiftVouchers(params: Record<string, any>) {
  const query = new URLSearchParams(params as any).toString();
  return apiFetch(`/admin/giftvouchers?${query}`);
}

export async function getReviews(params: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  return apiFetch(`/admin/reviews?${query}`);
}
export async function updateReviewStatus(
  reviewId: string,
  status: "approved" | "pending" | "rejected"
) {
  return apiFetch(`/admin/reviews/${reviewId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
export async function updateCourseStatus(id: string, status: string) {
  const res = await apiFetch(
    `/courses/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) throw new Error("Failed to update course status");

  return res.json();
}
