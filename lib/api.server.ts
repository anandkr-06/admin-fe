"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function apiServerFetch(
    path: string,
    options: RequestInit = {}
) {
    const cookieStore = await cookies(); // ✅ FIXED

    const cookieHeader = cookieStore
        .getAll()
        .map(c => `${c.name}=${c.value}`)
        .join("; ");

    let res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
            Cookie: cookieHeader, // ✅ cookies forwarded
        },
        cache: "no-store",
    });
    if (res.status === 401) {
        const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
            method: "POST",
            headers: {
                Cookie: cookieHeader, // 🔥 MUST forward cookies again
            },
            cache: "no-store",
        });

        // ❌ refresh failed → redirect
        if (!refreshRes.ok) {
            redirect("/login"); // ✅ SAFE in server component
        }

        // 3️⃣ Retry original request
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
    return res;
}


// export async function apiServerFetch(
//   path: string,
//   options: RequestInit = {},
// ) {
//   const cookieStore = cookies();

//   const cookieHeader = cookieStore
//     .getAll()
//     .map(c => `${c.name}=${c.value}`)
//     .join("; ");

//   return fetch(`${API_BASE}${path}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       Cookie: cookieHeader,
//       ...(options.headers || {}),
//     },
//     cache: "no-store",
//   });
// }
