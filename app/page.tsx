import { redirect } from "next/navigation";
import { getMe } from "@/services/auth.service";

export default async function HomePage() {
  try {
    const res = await getMe();

    if (res.ok) {
      // ✅ logged in
      redirect("/admin");
    }
  } catch {
    // ignore
  }

  // ❌ not logged in
  redirect("/login");
}
