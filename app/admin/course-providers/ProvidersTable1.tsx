"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Globe } from "lucide-react";
import toast from "react-hot-toast";
import { toggleCourseProviderStatus } from "@/services/admin.service";
import { ENV } from "@/lib/utils";

export default function ProvidersTable({
  providers,
  meta,
}: {
  providers: any[];
  meta: any;
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  function getLogoUrl(logoPath?: string) {
    if (!logoPath) return null;

    if (logoPath.startsWith("http")) return logoPath;

    const cleanPath = logoPath.replace(/^uploads\//, "");
    return `${ENV.IMAGE_MEDIA_URL}${cleanPath}`;
  }

  async function handleToggle(id: string, isActive: boolean) {
    try {
      setLoadingId(id);

      await toggleCourseProviderStatus(id, !isActive);

      toast.success(
        `Provider ${isActive ? "deactivated" : "activated"}`
      );

      // ✅ KEY PART (same as instructor)
      router.refresh();
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="p-4 text-left">Institute</th>
            <th className="p-4 text-left">Contact</th>
            <th className="p-4 text-left">Location</th>
            <th className="p-4 text-left">Website</th>
            <th className="p-4 text-left">Consent</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Created</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {providers.map((p) => {
            const logoUrl = getLogoUrl(p.logoUrl);

            return (
              <tr key={p._id} className="border-b hover:bg-gray-50 transition">
                {/* Institute */}
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="logo"
                        className="h-10 w-10 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center text-xs font-medium">
                        {p.instituteName?.charAt(0)}
                      </div>
                    )}

                    <div>
                      <div className="font-medium">
                        {p.instituteName}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {p._id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="p-4">
                  <div>{p.email}</div>
                  <div className="text-xs text-gray-500">
                    {p.phone}
                  </div>
                </td>

                {/* Location */}
                <td className="p-4">
                  {p.location?.suburb}, {p.location?.state}
                  <div className="text-xs text-gray-500">
                    {p.location?.postCode}
                  </div>
                </td>

                {/* Website */}
                <td className="p-4">
                  {p.websiteUrl ? (
                    <a
                      href={p.websiteUrl}
                      target="_blank"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Globe size={14} />
                      Visit
                    </a>
                  ) : (
                    <span className="text-gray-400 text-xs">
                      No Website
                    </span>
                  )}
                </td>

                {/* Consent */}
                <td className="p-4 text-xs space-y-1">
                  <div>
                    T&C: {p.isAgreedToTermsAndConditions ? "✅" : "❌"}
                  </div>
                  <div>
                    Offers: {p.isAgreedToCommunicationAndOffers ? "✅" : "❌"}
                  </div>
                </td>

                {/* Status */}
                <td className="p-4">
                  <StatusBadge isActive={p.isActive} />
                </td>

                {/* Created */}
                <td className="p-4 text-gray-500 text-xs">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>

                {/* Action */}
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleToggle(p._id, p.isActive)}
                    disabled={loadingId === p._id}
                    className={`px-4 py-2 text-xs font-medium rounded-xl ${
                      p.isActive
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    } ${
                      loadingId === p._id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {loadingId === p._id
                      ? "Updating..."
                      : p.isActive
                      ? "Deactivate"
                      : "Activate"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {providers.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No providers found.
        </div>
      )}
    </div>
  );
}

/* ---------- Status Badge ---------- */

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          isActive ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      <span
        className={`text-xs font-medium ${
          isActive ? "text-green-600" : "text-gray-500"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    </div>
  );
}