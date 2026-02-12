"use client";

import Link from "next/link";
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  Settings,
} from "lucide-react";
import LogoutButton from "../LogoutButton";
import { useState } from "react";
import { User } from "../../app/types/user";

type SidebarProps = {
  user: User;
};

type MenuItem = {
  name: string;
  href?: string;
  icon: any;
  roles: string[];
  children?: {
    name: string;
    href: string;
    roles: string[];
  }[];
};

const menuItems: MenuItem[] = [
  { name: "Dashboard", href: "/admin", icon: Home, roles: ["ADMIN","MANAGER"] },
  {
    name: "Academics",
    icon: GraduationCap,
    roles: ["ADMIN","MANAGER"],
    children: [
      { name: "Instructors", href: "/admin/instructors", roles: ["ADMIN","MANAGER"] },
      { name: "Learners", href: "/admin/learners", roles: ["ADMIN","MANAGER"] },
      { name: "Courses", href: "/admin/courses", roles: ["ADMIN","MANAGER"] },
    ],
  },
  {
    name: "Orders",
    icon: Layers,
    roles: ["ADMIN","MANAGER"],
    children: [
      { name: "All Orders", href: "/admin/orders", roles: ["ADMIN","MANAGER"] },
      { name: "Test Orders", href: "/admin/test-orders", roles: ["ADMIN","MANAGER"] },
      { name: "Private Orders", href: "/admin/private-orders", roles: ["ADMIN","MANAGER"] },
    ],
  },

  { name: "Reviews", href: "/admin/reviews", icon: Layers, roles: ["ADMIN","MANAGER"] },
  { name: "Feedbacks", href: "/admin/feedbacks", icon: Layers, roles: ["ADMIN","MANAGER"] },
  { name: "Gift Vouchers", href: "/admin/gift-vouchers", icon: Layers, roles: ["ADMIN","MANAGER"] },
  { name: "Settings", href: "/admin/settings", icon: Settings, roles: ["ADMIN","MANAGER"] },
];


export default function Sidebar({ user }: SidebarProps) {
  // ✅ Hooks MUST be here
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleMenu = (name: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-gray-50 p-4">
      <h2 className="mb-6 text-xl font-bold">Admin Panel</h2>

      <nav className="flex flex-1 flex-col gap-1">
        {menuItems
          .filter(item => item.roles.includes(user.role))
          .map(item => {
            const Icon = item.icon;
            const isOpen = openMenus[item.name];

            if (item.children) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className="flex w-full items-center gap-2 rounded px-2 py-2 hover:bg-gray-100"
                  >
                    <Icon size={18} />
                    <span className="flex-1 text-left">{item.name}</span>
                    <span className="text-xs">{isOpen ? "▲" : "▼"}</span>
                  </button>

                  {isOpen && (
                    <div className="ml-6 mt-1 flex flex-col gap-1">
                      {item.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="rounded px-2 py-1 text-sm hover:bg-gray-100"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                className="flex items-center gap-2 rounded px-2 py-2 hover:bg-gray-100"
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
      </nav>

      {/* Profile */}
      <div className="mt-auto relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex w-full items-center gap-2 rounded border px-2 py-1 hover:bg-gray-100"
        >
          <img src={user.avatarUrl} className="h-8 w-8 rounded-full" />
          <span className="flex-1 text-left">{user.name}</span>
        </button>

        {profileOpen && (
          <div className="absolute bottom-12 left-0 w-full rounded bg-white p-3 shadow-lg">
            <div className="mb-2 text-sm text-gray-600">{user.email}</div>
            <Link href="/admin/profile" className="block rounded px-2 py-1 hover:bg-gray-100">
              View Profile
            </Link>
            <LogoutButton />
          </div>
        )}
      </div>
    </aside>
  );
}
