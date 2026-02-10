// import Sidebar from "@/components/admin/sidebar";
// import Header from "@/components/admin/header";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar />
//       <div className="flex-1 flex flex-col">
//         <Header />
//         <main className="flex-1 overflow-y-auto p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }
import Sidebar from "@/components/admin/sidebar";
import { getMe } from "@/services/auth.service";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const res = await getMe(); // 🔥 redirect handled internally

  const user = await res.json();
console.log("user me>",user);
  return (
    <div className="flex h-screen">
      <Sidebar user={user} />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}

