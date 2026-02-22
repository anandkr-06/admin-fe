"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminPage from "@/app/admin/components/AdminPage";
import toast from "react-hot-toast";
import {
  getInstructorProfile,
  deactivateInstructor,
  activateInstructor
} from "@/services/instructor.service";

export default function InstructorProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deactivating, setDeactivating] = useState(false);
  const handleToggleStatus = async () => {
  if (!id) return;

  const action = data.isActive ? "deactivate" : "activate";

    if (!confirm(`Are you sure you want to ${action} this instructor?`)) 
  return;


  try {
    setDeactivating(true);

    if (data.isActive) {
      await deactivateInstructor(id);
    } else {
      await activateInstructor(id);
    }

    setData((prev: any) => ({
      ...prev,
      isActive: !prev.isActive,
    }));

    toast.success(
      `Instructor ${action}d successfully.`
    );
  } catch (error) {
    toast.error(`Failed to ${action} instructor.`);
  } finally {
    setDeactivating(false);
  }
};


  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);
        const res = await getInstructorProfile(id);
        setData(res);
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <AdminPage title="Instructor Profile">
        <div className="p-6 text-gray-500">Loading profile...</div>
      </AdminPage>
    );
  }

  if (!data) {
    return (
      <AdminPage title="Instructor Profile">
        <div className="p-6 text-red-500">Failed to load profile.</div>
      </AdminPage>
    );
  }

  return (
    <AdminPage title="Instructor Profile">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold">
              {data.name?.[0]}
            </div>

            {/* Name + Email */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {data.name}
              </h2>
              <p className="text-gray-500">{data.email}</p>

              <span
                className={`mt-2 inline-block px-3 py-1 text-xs font-medium rounded-full
                  ${
                    data.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
              >
                {data.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm">
              Edit
            </button> */}
            <button
  disabled={deactivating}
  onClick={handleToggleStatus}
  className={`px-4 py-2 rounded-lg text-sm transition
    ${
      data.isActive
        ? "bg-red-500 hover:bg-red-600 text-white"
        : "bg-green-600 hover:bg-green-700 text-white"
    }`}
>
  {deactivating
    ? "Processing..."
    : data.isActive
    ? "Deactivate"
    : "Activate"}
</button>

          </div>
        </div>

        {/* Details Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Account Information">
            <Info label="Full Name" value={data.name} />
            <Info label="Email Address" value={data.email} />
            <Info
              label="Account Status"
              value={data.isActive ? "Active" : "Inactive"}
            />
          </Card>

          <Card title="Metadata">
            <Info
              label="Created At"
              value={new Date(data.createdAt).toLocaleString("en-AU")}
            />
            <Info label="Instructor ID" value={data.id} />
          </Card>
        </div>
      </div>
    </AdminPage>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );
}
