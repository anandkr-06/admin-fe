import { apiFetch } from "@/lib/api.client";
import { ENV } from "@/lib/utils";

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
export async function getInstructorOrders(
  id: string,
  params?: { page?: string | number; search?: string; status?: string }
) {
  const query = new URLSearchParams();

  if (params?.page !== undefined) query.append("page", String(params.page));
  if (params?.search) query.append("search", params.search);
  if (params?.status && params.status !== "ALL") {
    query.append("status", params.status);
  }

  return apiFetch(`/instructors/${id}/orders?${query.toString()}`);
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
    `${ENV.IMAGE_UPLOAD_URL}get-token`
  );
  const token = await tokenData.json();

  const formData = new FormData();
  formData.append("fileFor", "vehicle"); // optional: "vehicle"
  formData.append("file", file);

  const res = await fetch(
    `${ENV.IMAGE_UPLOAD_URL}file`,
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

export const uploadProfileImageFile = async (file: File) => {
  const tokenData = await fetch(`${ENV.IMAGE_UPLOAD_URL}get-token`);
  const token = await tokenData.json();

  const formData = new FormData();
  formData.append("fileFor", "profile");
  formData.append("file", file);

  const res = await fetch(`${ENV.IMAGE_UPLOAD_URL}file`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token?.token}`,
    },
  });

  if (!res.ok) {
    throw new Error("File upload failed");
  }

  return res.json();
};

export const uploadVehicleImageFile = async (file: File) => {
  const tokenData = await fetch(`${ENV.IMAGE_UPLOAD_URL}get-token`);

  if (!tokenData.ok) {
    throw new Error("Unable to prepare vehicle image upload");
  }

  const token = await tokenData.json();

  const formData = new FormData();
  formData.append("fileFor", "vehicle");
  formData.append("file", file);

  const res = await fetch(`${ENV.IMAGE_UPLOAD_URL}file`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token?.token}`,
    },
  });

  if (!res.ok) {
    let message = "Vehicle image upload failed";

    try {
      const error = await res.json();
      message = error?.message || error?.error || message;
    } catch {
      message = res.status === 413 ? "Vehicle image is too large" : message;
    }

    throw new Error(message);
  }

  return res.json();
};

export const uploadInstructorDocumentFile = async (
  file: File,
  documentKey: string
) => {
  const tokenData = await fetch(`${ENV.IMAGE_UPLOAD_URL}get-token`);
  const token = await tokenData.json();

  const formData = new FormData();
  formData.append("fileFor", documentKey);
  formData.append("file", file);

  const res = await fetch(`${ENV.IMAGE_UPLOAD_URL}file`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token?.token}`,
    },
  });

  if (!res.ok) {
    throw new Error("File upload failed");
  }

  return res.json();
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

export function toggleInstructorPublish(
  id: string,
  action: "publish" | "unpublish"
) {
  return apiFetch(`/instructors/${id}/${action}`, {
    method: "PATCH",
  });
}



export function updateInstructorProfile(
  id: string,
  payload: Record<string, unknown>
) {
  return apiFetch(`/instructors/${id}/profile`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function updateInstructorDocuments(
  id: string,
  payload: Record<string, unknown>
) {
  return apiFetch(`/instructors/${id}/documents`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function updateInstructorServiceAreas(
  id: string,
  payload: Record<string, unknown>
) {
  return apiFetch(`/instructors/${id}/service-areas`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function getAvailableSuburbs(search: string) {
  const query = search.trim();
  return apiFetch(
    `/api/suburbs/v1/get_available_suburbs?page=1&limit=50&search=${encodeURIComponent(query)}`
  );
}

export function getTestLocationOptions(search: string) {
  const query = search.trim();
  return apiFetch(
    `/api/testlocation/v1/get_test_locations?page=1&limit=20&search=${encodeURIComponent(query)}`
  );
}

export function updateInstructorTestLocations(
  id: string,
  payload: Record<string, unknown>
) {
  return apiFetch(`/instructors/${id}/test-locations`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function updateInstructorAutoVehicle(
  id: string,
  payload: Record<string, unknown>
) {
  return apiFetch(`/instructors/${id}/vehicle/auto`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function updateInstructorManualVehicle(
  id: string,
  payload: Record<string, unknown>
) {
  return apiFetch(`/instructors/${id}/vehicle/manual`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function updateInstructorPrivateVehicle(
  id: string,
  payload: Record<string, unknown>
) {
  return apiFetch(`/instructors/${id}/vehicle/private`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function updateInstructorAdditionalInformation(
  id: string,
  payload: Record<string, unknown>
) {
  return apiFetch(`/instructors/${id}/additional-information`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
