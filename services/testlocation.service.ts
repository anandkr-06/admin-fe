import { apiFetch } from "@/lib/api.client";

export function getTestLocations(params: { page?: number; limit?: number; search?: string } = {}) {
  const query = new URLSearchParams(
    Object.entries(params as any)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();

  return apiFetch(`/testlocation/v1/get_test_locations?${query}`);
}

export function addTestLocation(payload: Record<string, any>) {
  return apiFetch(`/testlocation/v1/add_test_location`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTestLocation(id: string, payload: Record<string, any>) {
  return apiFetch(`/testlocation/v1/update_test_location/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
