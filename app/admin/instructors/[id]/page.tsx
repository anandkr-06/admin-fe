"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminPage from "@/app/admin/components/AdminPage";
import toast from "react-hot-toast";
import {
  getInstructorProfile,
  deactivateInstructor,
  activateInstructor,
} from "@/services/instructor.service";
import { ENV } from "@/lib/utils";

/* ---------------- HELPERS ---------------- */
export const IMAGE_DOMAIN = ENV.IMAGE_MEDIA_URL;

function mergeSlots(slots: any[]) {
  if (!slots?.length) return [];

  const sorted = [...slots].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  const merged: any[] = [];

  sorted.forEach((slot) => {
    const last = merged[merged.length - 1];

    if (
      last &&
      last.endTime === slot.startTime &&
      last.isBooked === slot.isBooked &&
      last.isTempBlocked === slot.isTempBlocked
    ) {
      last.endTime = slot.endTime;
    } else {
      merged.push({ ...slot });
    }
  });

  return merged;
}

/* ---------------- AVAILABILITY ---------------- */

function AvailabilitySection({ availability }: any) {
  const [weekIndex, setWeekIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  const weeks = availability?.weeks || [];
  const currentWeek = weeks[weekIndex];

  if (!currentWeek) return null;

  return (
    <div className="bg-white rounded-xl border p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">
          {currentWeek.startDate} → {currentWeek.endDate}
        </h3>

        <div className="flex gap-2">
          <button
            disabled={weekIndex === 0}
            onClick={() => setWeekIndex((p) => p - 1)}
            className="px-3 py-1 bg-gray-100 rounded"
          >
            Prev
          </button>

          <button
            disabled={weekIndex === weeks.length - 1}
            onClick={() => setWeekIndex((p) => p + 1)}
            className="px-3 py-1 bg-gray-100 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-3 text-xs mb-4">
        <span className="bg-green-100 px-2 py-1 rounded">Available</span>
        <span className="bg-red-100 px-2 py-1 rounded">Booked</span>
        <span className="bg-yellow-100 px-2 py-1 rounded">Blocked</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {currentWeek.days.map((day: any) => {
          const mergedSlots = mergeSlots(day.slots);

          return (
            <div key={day.date} className="border rounded-lg p-3 bg-gray-50">
              <p className="text-xs font-semibold mb-2">{day.date}</p>

              <div className="flex flex-col gap-1">
                {mergedSlots.map((slot: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setSelectedSlot({ ...slot, date: day.date })
                    }
                    className={`text-xs px-2 py-1 rounded ${
                      slot.isBooked
                        ? "bg-red-100 text-red-600"
                        : slot.isTempBlocked
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {slot.startTime} - {slot.endTime}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[350px]">
            <h4 className="font-semibold mb-3">Slot Details</h4>

            <div className="space-y-2 text-sm">
              <p><b>Date:</b> {selectedSlot.date}</p>
              <p><b>Time:</b> {selectedSlot.startTime} - {selectedSlot.endTime}</p>
              <p>
                <b>Status:</b>{" "}
                {selectedSlot.isBooked
                  ? "Booked"
                  : selectedSlot.isTempBlocked
                  ? "Blocked"
                  : "Available"}
              </p>

              {selectedSlot.bookingId && (
                <p><b>Booking ID:</b> {selectedSlot.bookingId}</p>
              )}

              {selectedSlot.tempBookingId && (
                <p><b>Temp Booking ID:</b> {selectedSlot.tempBookingId}</p>
              )}

              {selectedSlot.pickupAddress && (
                <p><b>Pickup:</b> {selectedSlot.pickupAddress}</p>
              )}

              {selectedSlot.suburb && (
                <p><b>Suburb:</b> {selectedSlot.suburb}</p>
              )}

              {selectedSlot.state && (
                <p><b>State:</b> {selectedSlot.state}</p>
              )}
            </div>

            <button
              onClick={() => setSelectedSlot(null)}
              className="mt-4 w-full bg-gray-200 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- MAIN ---------------- */

export default function InstructorProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("auto");

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoading(true);
        const res = await getInstructorProfile(id);
        setData(res);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <AdminPage title="Instructor Profile">Loading...</AdminPage>;
  if (!data) return <AdminPage title="Instructor Profile">Error</AdminPage>;

  const vehicle = data.vehicles?.[activeTab];

  return (
    <AdminPage title="Instructor Profile">
      <div className="space-y-6">

        {/* Header */}
        <div className="bg-white p-6 rounded-xl border">
          <h2 className="text-xl font-semibold">{data.name}</h2>
          <p className="text-gray-500">{data.email}</p>
        </div>

        {/* Metadata + Rating */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Metadata">
            <Info label="ID" value={data.id} />
            <Info label="Created" value={new Date(data.createdAt).toLocaleString()} />
            <Info label="Verified" value={data.isVerified ? "Yes" : "No"} />
          </Card>

          <Card title="Rating">
            <Info label="Average" value={data.rating?.avg} />
            <Info label="Total" value={data.rating?.total} />
          </Card>
        </div>

        {/* Vehicles */}
        <Card title="Vehicles">
  <div className="flex gap-2 mb-4">
    {["auto", "manual", "private"].map((t: any) => (
      <button
        key={t}
        onClick={() => setActiveTab(t)}
        className={`px-3 py-1 rounded ${
          activeTab === t ? "bg-indigo-600 text-white" : "bg-gray-100"
        }`}
      >
        {t}
      </button>
    ))}
  </div>

  {!vehicle?.hasVehicle ? (
    <p className="text-gray-500">No vehicle available</p>
  ) : activeTab === "private" ? (
    <div className="grid grid-cols-2 gap-3">
      <Info label="Auto Price/hr" value={vehicle.auto?.pricePerHour} />
      <Info label="Auto Test Price" value={vehicle.auto?.testPricePerHour} />
      <Info label="Manual Price/hr" value={vehicle.manual?.pricePerHour} />
      <Info label="Manual Test Price" value={vehicle.manual?.testPricePerHour} />
    </div>
  ) : (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

      {/* Pricing */}
      <Info label="Price / Hour" value={`$${vehicle.pricePerHour}`} />
      <Info label="Test Price / Hour" value={`$${vehicle.testPricePerHour}`} />

      {/* Basic */}
      <Info label="Make" value={vehicle.details?.make} />
      <Info label="Model" value={vehicle.details?.model} />
      <Info label="Color" value={vehicle.details?.color} />
      <Info label="Year" value={vehicle.details?.year} />

      {/* Advanced */}
      <Info label="Transmission" value={vehicle.details?.transmissionType} />
      <Info label="Safety Rating" value={vehicle.details?.ancapSafetyRating} />
      <Info
        label="Dual Controls"
        value={vehicle.details?.hasDualControls ? "Yes" : "No"}
      />

      {/* Optional */}
      <Info
        label="Registration No"
        value={vehicle.details?.registrationNumber}
      />
    </div>
  )}
</Card>

        {/* Service Areas */}
        <Card title="Service Areas">
          {data.serviceAreas?.map((a: any) => (
            <div key={a._id}>{a.suburb} ({a.state})</div>
          ))}
        </Card>

        {/* Test Locations */}
        <Card title="Test Locations">
          {data.testLocations?.map((l: any) => (
            <div key={l._id}>{l.location} - {l.address}</div>
          ))}
        </Card>

        {/* Documents */}
      <Card title="Documents">
  {Object.entries(data.documents || {}).map(([key, doc]: any) => {
    const hasAttachment = !!doc.attachment;

    return (
      <div key={key} className="border-b pb-3 mb-3">
        <p className="font-medium capitalize">{key}</p>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <Info label="Document Number" value={doc.documentNumber} />
          <Info label="Status" value={doc.status} />
          <Info label="Issue Date" value={doc.issueDate || "-"} />
          <Info label="Expiry Date" value={doc.expiryDate || "-"} />
        </div>

        {/* Attachment Section */}
        <div className="mt-3">
          {hasAttachment ? (
            <a
              href={`${IMAGE_DOMAIN}/${doc.attachment.toString().replace("uploads/", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
            >
              View Document
            </a>
          ) : (
            <span className="text-xs text-gray-500 italic">
              No attachment available
            </span>
          )}
        </div>
      </div>
    );
  })}
</Card>

        {/* Availability */}
        <AvailabilitySection availability={data.availability} />

      </div>
    </AdminPage>
  );
}

/* ---------------- UI HELPERS ---------------- */

function Card({ title, children }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border">
      <h3 className="mb-3 font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value ?? "-"}</p>
    </div>
  );
}