"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function apiServerFetch(
  path: string,
  options: RequestInit = {}
) {
  try {
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

    // 🔁 Try refresh on 401
    if (res.status === 401) {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { Cookie: cookieHeader },
        cache: "no-store",
      });

      // ❌ Refresh failed → return null (DO NOT redirect or throw here)
      if (!refreshRes.ok) {
        redirect("/login");
      }

      // 🔄 Retry original request
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

    // ❌ Still not OK → return null instead of throwing
    if (!res.ok) {
      console.error("API SERVER ERROR:", res.status, path);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("apiServerFetch fatal error:", err);
    return null; // 🚫 NEVER throw in SSR helpers
  }
}
