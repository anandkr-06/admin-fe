"use client";

import api from "@/lib/axios";

export async function login(email: string, password: string) {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });

  // 🔐 Store tokens (stateless)
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);

  return data;
}


export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data;
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
