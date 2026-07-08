"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  GraduationCap,
  Layers,
  Settings,
  Gift,
  MessageSquare,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  MapPin,
} from "lucide-react";

import LogoutButton from "../LogoutButton";
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
  {
    name: "Dashboard",
    href: "/admin",
    icon: Home,
    roles: ["ADMIN", "MANAGER"],
  },

  {
    name: "Academics",
    icon: GraduationCap,
    roles: ["ADMIN", "MANAGER"],
    children: [
      {
        name: "Instructors",
        href: "/admin/instructors",
        roles: ["ADMIN", "MANAGER"],
      },
      {
        name: "Learners",
        href: "/admin/learners",
        roles: ["ADMIN", "MANAGER"],
      },
      { name: "Courses", href: "/admin/courses", roles: ["ADMIN", "MANAGER"] },
      {
        name: "Course Providers",
        href: "/admin/course-providers",
        roles: ["ADMIN", "MANAGER"],
      },
    ],
  },

  {
    name: "Orders",
    icon: Layers,
    roles: ["ADMIN", "MANAGER"],
    children: [
      { name: "Orders", href: "/admin/orders", roles: ["ADMIN", "MANAGER"] },
      // { name: "Test Orders", href: "/admin/orders/test", roles: ["ADMIN", "MANAGER"] },
      // { name: "Private Orders", href: "/admin/orders/private", roles: ["ADMIN", "MANAGER"] },
    ],
  },
  {
    name: "Refunds",
    href: "/admin/refunds",
    icon: ClipboardList,
    roles: ["ADMIN", "MANAGER"],
  },
  {
    name: "No Show",
    href: "/admin/no-show",
    icon: ClipboardList,
    roles: ["ADMIN", "MANAGER"],
  },
  {
    name: "Leads",
    href: "/admin/leads",
    icon: ClipboardList,
    roles: ["ADMIN", "MANAGER"],
  },
  {
    name: "Suburbs",
    href: "/admin/suburbs",
    icon: MapPin,
    roles: ["ADMIN", "MANAGER"],
  },
   {
    name: "Test Locations",
    href: "/admin/test-locations",
    icon: MapPin,
    roles: ["ADMIN", "MANAGER"],
  },
  {
    name: "Reviews",
    href: "/admin/reviews",
    icon: MessageSquare,
    roles: ["ADMIN", "MANAGER"],
  },
  {
    name: "Feedbacks",
    href: "/admin/feedbacks",
    icon: MessageSquare,
    roles: ["ADMIN", "MANAGER"],
  },
  {
    name: "Gift Vouchers",
    href: "/admin/gift-vouchers",
    icon: Gift,
    roles: ["ADMIN", "MANAGER"],
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    roles: ["ADMIN", "MANAGER"],
  },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white p-4 shadow-sm">
      {/* Logo / Title */}
      <h2 className="mb-8 text-xl font-semibold tracking-tight">Admin Panel</h2>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1">
        {menuItems
          .filter((item) => item.roles.includes(user.role))
          .map((item) => {
            const Icon = item.icon;

            const isActiveChild = item.children?.some(
              (child) => pathname === child.href,
            );

            const isOpen = openMenus[item.name] || isActiveChild;

            // ----- If has children -----
            if (item.children) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-black transition"
                  >
                    <Icon size={18} />
                    <span className="flex-1 text-left">{item.name}</span>
                    {isOpen ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>

                  {isOpen && (
                    <div className="ml-6 mt-1 flex flex-col gap-1">
                      {item.children
                        .filter((child) => child.roles.includes(user.role))
                        .map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`rounded-md px-3 py-1.5 text-sm transition ${
                              pathname === child.href
                                ? "bg-gray-200 font-medium text-black"
                                : "text-gray-500 hover:bg-gray-100"
                            }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              );
            }

            // ----- Normal Menu Item -----
            return (
              <Link
                key={item.href}
                href={item.href!}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  pathname === item.href
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
      </nav>

      {/* Profile Section */}
      <div className="mt-auto relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex w-full items-center gap-3 rounded-lg border px-3 py-2 hover:bg-gray-100 transition"
        >
          <img
            src={user.avatarUrl || "/avatar.png"}
            alt="avatar"
            className="h-8 w-8 rounded-full object-cover"
          />
          <div className="flex-1 text-left">
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-xs text-gray-500">{user.role}</div>
          </div>
        </button>

        {profileOpen && (
          <div className="absolute bottom-14 left-0 w-full rounded-lg bg-white p-3 shadow-lg border">
            <div className="mb-2 text-xs text-gray-500">{user.email}</div>

            <Link
              href="/admin/profile"
              className="block rounded-md px-2 py-1 text-sm hover:bg-gray-100"
            >
              View Profile
            </Link>

            <div className="mt-2 border-t pt-2">
              <LogoutButton />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
