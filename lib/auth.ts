import { api } from "./api.client";

export interface LoginPayload {
  email: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}

export async function logout() {
    await api.post("/auth/logout");
  }
  