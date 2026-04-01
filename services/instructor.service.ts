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
  return apiFetch(`/instructors/${id}/private-learners`);
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

export async function deactivateInstructor(id: string) {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/instructors/${id}/deactivate`,
    {
      method: "PATCH", // confirm if PATCH or POST from backend
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to deactivate instructor");
  }

  return res.json();
}

export async function activateInstructor(id: string) {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/instructors/${id}/activate`,
    {
      method: "PATCH", // confirm method if different
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to activate instructor");
  }

  return res.json();
}

export const uploadFileToStatic = async (file: File) => {
  const tokenData = await fetch(
    "https://static.anylicence.com/upload/get-token"
  );
  const token = await tokenData.json();

  const formData = new FormData();
  formData.append("fileFor", "vehicle"); // optional: "vehicle"
  formData.append("file", file);

  const res = await fetch(
    "https://static.anylicence.com/upload/file",
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token?.token}`,
      },
    }
  );

  return res.json(); // should return { url: "..." }
};
export async function uploadInstructorVehicles(
  instructorId: string,
  vehicles: {
    type: "auto" | "manual";
    image: string;
  }[]
) {
  return apiFetch(`/instructors/${instructorId}/vehicles`, {
    method: "PATCH",
    body: JSON.stringify({ vehicles }),
  });
}

export async function getInstructorWallet(id: string) {
  const res = await apiFetch(`/instructors/${id}/wallet`);
 
  return res.data
}
