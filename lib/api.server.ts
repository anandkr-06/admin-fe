"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function apiServerFetch(
  path: string,
  options: RequestInit = {}
) {
  // ✅ Next 16 → cookies() is async
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map(c => `${c.name}=${c.value}`)
    .join("; ");

  let res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  // 🔁 If token expired → try refresh
  if (res.status === 401) {
    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    // ❌ refresh failed → go login
    if (!refreshRes.ok) {
      redirect("/login");
    }

    // 🔄 retry original request
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });
  }

  // ❌ Still failed → throw (prevents silent 500 crash)
  if (!res.ok) {
    console.error("API SERVER ERROR:", res.status, path);
    throw new Error(`API request failed: ${res.status}`);
  }

  // ✅ IMPORTANT: return parsed JSON (not Response)
  return res.json();
}
