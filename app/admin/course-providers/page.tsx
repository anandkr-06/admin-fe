"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCourseProviders } from "@/services/admin.service";
import { Building2, Globe } from "lucide-react";
import toast from "react-hot-toast";
import { toggleCourseProviderStatus } from "@/services/admin.service";

export default function CourseProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
 const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getCourseProviders({
          page: 1,
          limit: 10,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        setProviders(res.data || []);
        setMeta(res.meta || null);
      } catch (err) {
        console.error("Failed to fetch providers", err);
      } finally {
        setLoading(false);
      }
    }
  useEffect(() => {
    fetchData();
  }, []);

  const totalProviders = meta?.total || 0;
  const activeProviders = providers.filter((p) => p.isActive).length;
  const inactiveProviders = providers.filter((p) => !p.isActive).length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Course Providers</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage registered training institutes
          </p>
        </div>

        {/* <Button> */}
          {/* <Building2 size={16} className="mr-2" />
          Add Provider
        </Button> */}
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Total Providers" value={totalProviders} />
        <StatCard
          title="Active"
          value={activeProviders}
          color="text-green-600"
        />
        <StatCard
          title="Inactive"
          value={inactiveProviders}
          color="text-red-600"
        />
      </div>

      {/* Table */}
      <Card className="rounded-2xl shadow-sm border">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 text-center text-gray-500">
              Loading providers...
            </div>
          ) : providers.length === 0 ? (
            <EmptyState />
          ) : (
            <ProvidersTable providers={providers} setProviders={setProviders} fetchData={fetchData}/>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Components ---------------- */

function StatCard({ title, value, color = "text-gray-900" }: any) {
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
      <CardContent className="p-6">
        <p className="text-sm text-gray-500">{title}</p>
        <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function ProvidersTable({ providers, setProviders, fetchData }: any) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  function getLogoUrl(logoPath?: string) {
    if (!logoPath) return null;

    if (logoPath.startsWith("http")) return logoPath;

    const cleanPath = logoPath.replace(/^uploads\//, "");
    return `https://static.anylicence.com/media/${cleanPath}`;
  }

const handleToggle = async (id: string) => {
  try {
    setLoadingId(id);
   debugger
    const currentProvider = providers.find((p) => p._id === id);
    const newStatus = !currentProvider?.isActive;

    await toggleCourseProviderStatus(id, newStatus);

    toast.success(
      `Provider ${newStatus ? "activated" : "deactivated"}`
    );

    // 🔥 RE-FETCH DATA (KEY CHANGE)
    await fetchData();

  } catch (err) {
    toast.error("Failed to update status");
  } finally {
    setLoadingId(null);
  }
};

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
            <th className="p-4 text-left">Action</th> {/* ✅ NEW */}
          </tr>
        </thead>

        <tbody>
          {providers.map((p: any) => {
            const logoUrl = getLogoUrl(p.logoUrl);

            return (
              <tr key={p._id} className="border-b hover:bg-gray-50 transition">
                {/* ✅ Institute */}
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
                      <div className="font-medium">{p.instituteName}</div>
                      <div className="text-xs text-gray-500">ID: {p._id}</div>
                    </div>
                  </div>
                </td>

                {/* ✅ Contact */}
                <td className="p-4">
                  <div>{p.email}</div>
                  <div className="text-xs text-gray-500">
                    {p.phone || "No Phone"}
                  </div>
                </td>

                {/* ✅ Location */}
                <td className="p-4">
                  <div>
                    {p.location?.suburb || "-"}, {p.location?.state || "-"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {p.location?.postCode || "-"}
                  </div>
                </td>

                {/* ✅ Website */}
                <td className="p-4">
                  {p.websiteUrl ? (
                    <a
                      href={
                        p.websiteUrl.startsWith("http")
                          ? p.websiteUrl
                          : `https://${p.websiteUrl}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Globe size={14} />
                      Visit
                    </a>
                  ) : (
                    <span className="text-gray-400 text-xs">No Website</span>
                  )}
                </td>

                {/* ✅ Consent */}
                <td className="p-4 text-xs space-y-1">
                  <div>T&C: {p.isAgreedToTermsAndConditions ? "✅" : "❌"}</div>
                  <div>
                    Offers: {p.isAgreedToCommunicationAndOffers ? "✅" : "❌"}
                  </div>
                </td>

                {/* ✅ Status */}
                <td className="p-4">
                  <StatusBadge active={p.isActive} />
                </td>

                {/* ✅ Created */}
                <td className="p-4 text-gray-500 text-xs">
                  {new Date(p.createdAt).toLocaleDateString()}
                  <div className="text-[10px]">
                    {new Date(p.createdAt).toLocaleTimeString()}
                  </div>
                </td>

                {/* ✅ Action */}
                <td className="p-4">
                  <button
                    onClick={() => handleToggle(p._id)}
                    disabled={loadingId === p._id}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      p.isActive
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    } ${
                      loadingId === p._id ? "opacity-50 cursor-not-allowed" : ""
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
    </div>
  );
}

function StatusBadge({ active }: any) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 space-y-4">
      <div className="text-6xl">🏫</div>
      <h2 className="text-xl font-semibold">No Course Providers Found</h2>
      <p className="text-gray-500 text-sm">
        Providers will appear here once registered.
      </p>
    </div>
  );
}
