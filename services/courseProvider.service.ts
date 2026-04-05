import { apiFetch } from "@/lib/api.client";

/* ================= PROFILE ================= */
export async function getCourseProviderProfile(id: string) {
  return await apiFetch(`/admin/course-providers/${id}/profile`);
}

/* ================= COURSES ================= */
export async function getCourseProviderCourses(
  id: string,
  params: { page?: number; limit?: number; status?: string }
) {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  return await apiFetch(
    `/admin/course-providers/${id}/courses?${query}`
  );
}

/* ================= ACTION ================= */
// export function toggleCourseProvider(
//   id: string,
//   isActive: boolean
// ) {
//   return apiFetch(`/admin/course-providers/${id}/status`, {
//     method: "PATCH",
//     body: JSON.stringify({
//       isActive: !isActive,
//     }),
//   });
// }


/* ================= LIST ================= */
export function getCourseProviders(params: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  return apiFetch(`/admin/course-providers?${query}`);
}

/* ================= ACTION ================= */
export function toggleCourseProvider(id: string, isActive: boolean) {
  return apiFetch(`/admin/course-providers/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      isActive: !isActive,
    }),
  });
}

/* ================= LEADS ================= */
export async function getCourseLeads(
  courseId: string,
  params: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }
) {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  return await apiFetch(
    `/courses/${courseId}/leads?${query}`
  );
}
