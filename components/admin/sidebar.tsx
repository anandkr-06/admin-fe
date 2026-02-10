"use client";

import Link from "next/link";
import { Home, Users, GraduationCap, BookOpen, Layers, Settings } from "lucide-react";
import LogoutButton from "../LogoutButton";
import { useState } from "react";
import { User } from "../../app/types/user";



type SidebarProps = {
  user: User;
};

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: Home, roles: ["ADMIN","MANAGER"] },
  { name: "Instructors", href: "/admin/instructors", icon: GraduationCap, roles: ["ADMIN","MANAGER"] },
  { name: "Learners", href: "/admin/learners", icon: Users, roles: ["ADMIN","MANAGER"] },
  { name: "Courses", href: "/admin/courses", icon: BookOpen, roles: ["ADMIN","MANAGER"] },
  { name: "Orders", href: "/admin/orders", icon: Layers, roles: ["ADMIN","MANAGER"] },
  { name: "Settings", href: "/admin/settings", icon: Settings, roles: ["ADMIN","MANAGER"] },
];

export default function Sidebar({ user }: SidebarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-gray-50 p-4">
    {/* Logo / Title */}
    <h2 className="mb-6 text-xl font-bold">Admin Panel</h2>

    {/* Navigation */}
    <nav className="flex flex-1 flex-col gap-2">
      {menuItems
        .filter(item => item?.roles.includes(user.role))
        .map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="hover:underline"
          >
            {item.name}
          </Link>
        ))}
    </nav>

    {/* Profile + Logout */}
    <div className="mt-auto relative">
      <button
        onClick={() => setProfileOpen(!profileOpen)}
        className="flex w-full items-center gap-2 rounded border px-2 py-1 hover:bg-gray-100"
      >
        <img
          src={user.avatarUrl}
          alt="Avatar"
          className="h-8 w-8 rounded-full"
        />
        <span className="flex-1 text-left">{user.name}</span>
      </button>

      {profileOpen && (
        <div className="absolute bottom-12 left-0 w-full rounded bg-white p-3 shadow-lg">
          <div className="mb-2 text-sm text-gray-600">{user.email}</div>

          <Link
            href="/admin/profile"
            className="block rounded px-2 py-1 hover:bg-gray-100"
          >
            View Profile
          </Link>

          <div className="mt-2">
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  </aside>
  );
}

// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import LogoutButton from "./LogoutButton";

// // Dummy user data; replace with real user from `/auth/me`
// const user = {
//   name: "Admin User",
//   email: "admin@example.com",
//   role: "ADMIN", // or MANAGER
//   avatarUrl: "https://i.pravatar.cc/40",
// };

// export default function Sidebar() {
//   const [profileOpen, setProfileOpen] = useState(false);

//   const menuItems = [
//     { label: "Dashboard", href: "/admin/dashboard", roles: ["ADMIN","MANAGER"] },
//     { label: "Instructors", href: "/admin/instructors", roles: ["ADMIN","MANAGER"] },
//     { label: "Learners", href: "/admin/learners", roles: ["ADMIN","MANAGER"] },
//     { label: "Courses", href: "/admin/courses", roles: ["ADMIN"] }, // only ADMIN
//   ];

//   return (
    
//   );
// }
