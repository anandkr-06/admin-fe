import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(email: string, password: string) {
  const { data } = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });

  // 🔐 Store tokens (stateless)
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);

  return data;
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export async function getMe() {
  const { data } = await axios.get("/auth/me");
  return data;
}