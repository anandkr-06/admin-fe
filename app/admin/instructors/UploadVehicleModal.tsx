"use client";

import { useState } from "react";
import {
  uploadFileToStatic,
  uploadInstructorVehicles,
} from "@/services/instructor.service";

export default function UploadVehicleModal({
  id,
  onClose,
  onSuccess,
}: {
  id: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [autoFile, setAutoFile] = useState<File | null>(null);
  const [manualFile, setManualFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

async function handleSubmit() {
  if (!autoFile && !manualFile) {
    alert("Please upload at least one image");
    return;
  }

  try {
    setLoading(true);

    const vehicles: {
      type: "auto" | "manual";
      image: string;
    }[] = [];

    // ✅ Upload auto
    if (autoFile) {
      const res = await uploadFileToStatic(autoFile);

      vehicles.push({
        type: "auto",
        image: res?.path, // 🔥 IMPORTANT CHANGE
      });
    }

    // ✅ Upload manual
    if (manualFile) {
      const res = await uploadFileToStatic(manualFile);

      vehicles.push({
        type: "manual",
        image: res?.path, // 🔥 IMPORTANT CHANGE
      });
    }

    // ✅ Send to backend
    await uploadInstructorVehicles(id, vehicles);

    onSuccess();
    onClose();
  } catch (err) {
    console.error(err);
    alert("Upload failed");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95">

        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-900 mb-5">
          Upload Vehicle Images
        </h2>

        {/* Upload Fields */}
        <div className="space-y-4">

          {/* Auto Upload */}
          <UploadBox
            label="Auto Vehicle"
            file={autoFile}
            onChange={setAutoFile}
          />

          {/* Manual Upload */}
          <UploadBox
            label="Manual Vehicle"
            file={manualFile}
            onChange={setManualFile}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Upload Box ---------- */

function UploadBox({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-black transition">

        <span className="text-sm text-gray-500">
          {file ? file.name : "Click to upload image"}
        </span>

        <input
          type="file"
          className="hidden"
          onChange={(e) =>
            onChange(e.target.files?.[0] || null)
          }
        />
      </label>
    </div>
  );
}