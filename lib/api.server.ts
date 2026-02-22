"use server";

import { cookies } from "next/headers";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://devadminapi.anylicence.com";

export async function apiServerFetch(
  path: string,
  options: RequestInit = {}
) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("accessToken")?.value;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  return res;
}
