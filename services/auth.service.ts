import { apiFetch } from "@/lib/api.client";
import { apiServerFetch } from "@/lib/api.server";

export async function login(email: string, password: string) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return apiFetch("/auth/logout", {
    method: "POST",
  });
}


export async function getMe() {
  return await apiServerFetch("/auth/me"); // may return null
}

