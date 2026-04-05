"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getCourseProviderProfile } from "@/services/courseProvider.service";

export default function ProviderProfilePage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await getCourseProviderProfile(id as string);
        setData(res);
      } catch (err) {
        console.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data) return <div className="p-6">No Data</div>;

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        {data.logoUrl && (
          <img
            src={`${process.env.NEXT_PUBLIC_IAMGE_URL}/${data.logoUrl.replace(/^uploads\//, "")}`}
            alt="logo"
            className="w-16 h-16 rounded-lg object-cover border"
          />
        )}

        <div>
          <h1 className="text-2xl font-semibold">
            {data.instituteName || "-"}
          </h1>

          <span
            className={`inline-block mt-1 px-3 py-1 text-xs rounded-full ${
              data.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {data.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* BASIC INFO */}
        <div className="border rounded-xl p-4 space-y-2">
          <h2 className="font-semibold text-lg mb-2">Basic Info</h2>

          <p><b>Email:</b> {data.email || "-"}</p>
          <p><b>Phone:</b> {data.phone || "-"}</p>
          <p>
            <b>Website:</b>{" "}
            {data.websiteUrl ? (
              <a
                href={data.websiteUrl}
                target="_blank"
                className="text-blue-600 underline"
              >
                {data.websiteUrl}
              </a>
            ) : (
              "-"
            )}
          </p>
        </div>

        {/* LOCATION */}
        <div className="border rounded-xl p-4 space-y-2">
          <h2 className="font-semibold text-lg mb-2">Location</h2>

          <p><b>Suburb:</b> {data.location?.suburb || "-"}</p>
          <p><b>State:</b> {data.location?.state || "-"}</p>
          <p><b>Post Code:</b> {data.location?.postCode || "-"}</p>
        </div>

        {/* PREFERENCES */}
        <div className="border rounded-xl p-4 space-y-2">
          <h2 className="font-semibold text-lg mb-2">Preferences</h2>

          <p>
            <b>Accepted Terms:</b>{" "}
            {data.isAgreedToTermsAndConditions ? "Yes" : "No"}
          </p>
          <p>
            <b>Marketing Emails:</b>{" "}
            {data.isAgreedToCommunicationAndOffers ? "Yes" : "No"}
          </p>
        </div>

        {/* META INFO */}
        <div className="border rounded-xl p-4 space-y-2">
          <h2 className="font-semibold text-lg mb-2">Meta Info</h2>

          <p>
            <b>Created At:</b>{" "}
            {data.createdAt
              ? new Date(data.createdAt).toLocaleString()
              : "-"}
          </p>

          <p>
            <b>Updated At:</b>{" "}
            {data.updatedAt
              ? new Date(data.updatedAt).toLocaleString()
              : "-"}
          </p>

          <p><b>ID:</b> {data._id}</p>
        </div>
      </div>
    </div>
  );
}