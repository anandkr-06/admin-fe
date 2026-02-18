import Sidebar from "@/components/admin/sidebar";
import { redirect } from "next/navigation";
import { getMe } from "@/services/auth.service";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMe();

  // ✅ Redirect ONLY here (safe in layout)
  if (!user) redirect("/login");

  return (
    <div className="flex h-screen">
      <Sidebar user={user} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
