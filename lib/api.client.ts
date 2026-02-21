import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://devadminapi.anylicence.com";

export async function apiFetch(
  path: string,
  options: RequestInit = {},
) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include", // 🔥 REQUIRED for cookies
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Request failed");
  }

  return res.json();
}