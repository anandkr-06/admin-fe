"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminPage from "@/app/admin/components/AdminPage";
import { getLearnerProfile } from "@/services/learners.service";

export default function LearnerProfilePage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);
        const res = await getLearnerProfile(id as string);
        setData(res || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <AdminPage title="Learner Profile">
        <div className="p-6 text-gray-400">Loading...</div>
      </AdminPage>
    );
  }

  if (!data) {
    return (
      <AdminPage title="Learner Profile">
        <div className="p-6 text-gray-400">No Data Found</div>
      </AdminPage>
    );
  }

  return (
    <AdminPage title="Learner Profile">
      <div className="space-y-6">

        {/* PROFILE CARD */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex gap-6 items-center">
          
          {/* Avatar */}
          <div className="h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white text-xl font-bold">
            {data.firstName?.[0]}
            {data.lastName?.[0]}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">
              {data.firstName} {data.lastName}
            </h2>

            <p className="text-sm text-gray-500">{data.email}</p>
            <p className="text-sm text-gray-500">{data.mobileNumber}</p>

            <div className="flex flex-wrap gap-3 mt-3">
              <span className="px-3 py-1 text-xs rounded-full bg-gray-100">
                {data.state}
              </span>

              <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-600">
                Wallet ${data.walletBalance}
              </span>

              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  data.isActive
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {data.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <InfoCard label="Date of Birth" value={data.dob} />
          <InfoCard label="Pickup Address" value={data.pickUpAddress} />
          <InfoCard label="User Type" value={data.whichBestDescribeYou} />
          <InfoCard label="Created At" value={formatDate(data.created)} />
          <InfoCard label="Last Updated" value={formatDate(data.lastUpdated)} />
        </div>

      </div>
    </AdminPage>
  );
}

/* ================= REUSABLE COMPONENT ================= */

function InfoCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-medium text-gray-800 mt-1">
        {value || "-"}
      </p>
    </div>
  );
}

/* ================= UTIL ================= */

function formatDate(date: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
}