"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/services/auth.service";

export default function LogoutButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false); // modal state

  const handleLogout = () => {
    logout();                // remove tokens
    router.replace("/login");
  };

  return (
    <>
      {/* Logout Button */}
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded bg-red-600 px-3 py-2 text-left text-white hover:bg-red-700"
      >
        🚪 Logout
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-80 rounded bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">
              Confirm Logout
            </h2>
            <p className="mb-6 text-sm text-gray-700">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded border px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="rounded bg-red-100 px-4 py-2 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


