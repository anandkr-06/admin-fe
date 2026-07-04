"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera } from "lucide-react";
import {
  updateInstructorAutoVehicle,
  updateInstructorManualVehicle,
  updateInstructorPrivateVehicle,
  uploadVehicleImageFile,
} from "@/services/instructor.service";
import { ENV } from "@/lib/utils";
import CropImageModal from "../CropImageModal";

type Props = {
  instructorId: string;
  data?: any;
  onSuccess?: () => void;
};

const MAX_VEHICLE_IMAGE_SIZE_MB = 5;
const MAX_VEHICLE_IMAGE_SIZE_BYTES = MAX_VEHICLE_IMAGE_SIZE_MB * 1024 * 1024;

export default function VehiclesSection({ instructorId, data, onSuccess }: Props) {
  const [vehicleType, setVehicleType] = useState<"auto" | "manual">("auto");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicleImage, setVehicleImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const getImageSrc = (value?: string) => {
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
    if (value.startsWith("/")) {
      return value;
    }
    const mediaBase = (ENV.IMAGE_MEDIA_URL || "").replace(/\/+$/, "");
    const normalized = value.replace(/^\/+/, "").replace(/^uploads\//, "");
    return `${mediaBase}/${normalized}`;
  };

  const { register, reset, handleSubmit } = useForm({
    defaultValues: {
      registrationNumber: "",
      licenceCategory: "",
      make: "",
      model: "",
      color: "",
      year: "",
      transmissionType: "auto",
      ancapSafetyRating: "",
      hasDualControls: false,
      pricePerHour: "",
      testPricePerHour: "",
    },
  });

  useEffect(() => {
    // Determine which vehicle to use based on vehicleType
    let vehicle: any = {};
    
    if (data?.vehicles) {
      if (Array.isArray(data.vehicles)) {
        vehicle = data.vehicles[0] || {};
      } else if (typeof data.vehicles === "object") {
        // vehicles is an object with auto/manual/private keys
        vehicle = data.vehicles[vehicleType]?.details || data.vehicles[vehicleType] || {};
      }
    }

    // Fallback to direct vehicle property
    if (!vehicle.registrationNumber && data?.vehicle) {
      vehicle = data.vehicle;
    }

    reset({
      registrationNumber: vehicle.registrationNumber || "",
      licenceCategory: vehicle.licenceCategory || "",
      make: vehicle.make || "",
      model: vehicle.model || "",
      color: vehicle.color || "",
      year: vehicle.year || "",
      transmissionType: vehicle.transmissionType || "auto",
      ancapSafetyRating: vehicle.ancapSafetyRating || "",
      hasDualControls: Boolean(vehicle.hasDualControls),
      pricePerHour: vehicle.pricePerHour || "",
      testPricePerHour: vehicle.testPricePerHour || "",
    });

    const vehicleImages = data?.vehicleImages || data?.vehiclesImage || [];
    const imageForType = Array.isArray(vehicleImages)
      ? vehicleImages.find((item: any) => item?.type === vehicleType)?.image
      : null;

    // Prefill vehicle image if present in multiple possible locations
    const img = vehicle.image || imageForType || null;
    setVehicleImage(img || null);
  }, [data, reset, vehicleType]);

  const uploadVehicleImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploadError(null);

    if (file.size > MAX_VEHICLE_IMAGE_SIZE_BYTES) {
      const message = `Vehicle image must be ${MAX_VEHICLE_IMAGE_SIZE_MB} MB or smaller`;
      setUploadError(message);
      toast.error(message);
      e.target.value = "";
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    setImageToCrop(fileUrl);
    setShowCropper(true);
  };

  const onCropDone = async (file: File) => {
    try {
      setShowCropper(false);
      setUploading(true);

      const res = await uploadVehicleImageFile(file);
      setVehicleImage(res.url || res.path || "");
      setUploadError(null);
      toast.success("Vehicle image uploaded successfully");
    } catch (error: any) {
      const message = error?.message || "Vehicle image upload failed";
      setUploadError(message);
      toast.error(message);
    } finally {
      setUploading(false);
      if (imageToCrop) {
        URL.revokeObjectURL(imageToCrop);
      }
      setImageToCrop(null);
    }
  };

  const onSubmit = async (form: any) => {
    try {
      setIsSubmitting(true);
      const payload = {
        registrationNumber: form.registrationNumber,
        licenceCategory: form.licenceCategory,
        make: form.make,
        model: form.model,
        color: form.color,
        year: Number(form.year || 0),
        transmissionType: form.transmissionType,
        ancapSafetyRating: Number(form.ancapSafetyRating || 0),
        hasDualControls: Boolean(form.hasDualControls),
        pricePerHour: Number(form.pricePerHour || 0),
        testPricePerHour: Number(form.testPricePerHour || 0),
      };

      if (vehicleType === "auto") {
        await updateInstructorAutoVehicle(instructorId, { ...payload, image: vehicleImage });
      } else if (vehicleType === "manual") {
        await updateInstructorManualVehicle(instructorId, { ...payload, image: vehicleImage });
      } else {
        await updateInstructorPrivateVehicle(instructorId, { ...payload, image: vehicleImage });
      }

      toast.success("Vehicle updated successfully");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update vehicle");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Vehicle Image */}
      <div className="flex items-center gap-6">
        <div className="w-32 h-24 rounded overflow-hidden bg-gray-100 border">
          {vehicleImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getImageSrc(vehicleImage)}
              alt="vehicle"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">No Image</div>
          )}
        </div>

        <div className="flex flex-col items-start gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100">
            <Camera className="h-4 w-4 text-slate-500" />
            <span>{vehicleImage ? "Change image" : "Upload image"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={uploadVehicleImage}
            />
          </label>

          {uploading && (
            <p className="text-sm text-gray-500">Uploading...</p>
          )}
          {uploadError && (
            <p className="max-w-xs text-sm text-red-600">{uploadError}</p>
          )}
        </div>

        {showCropper && imageToCrop ? (
          <CropImageModal
            image={imageToCrop}
            onClose={() => {
              setShowCropper(false);
              if (imageToCrop) URL.revokeObjectURL(imageToCrop);
              setImageToCrop(null);
            }}
            onCropDone={onCropDone}
          />
        ) : null}
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Vehicle Type</label>
        <Select value={vehicleType} onValueChange={(value) => setVehicleType(value as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            {/* <SelectItem value="private">Private</SelectItem> */}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-medium">Registration Number</label>
          <Input {...register("registrationNumber")} />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Licence Category</label>
          <Input {...register("licenceCategory")} />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Make</label>
          <Input {...register("make")} />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Model</label>
          <Input {...register("model")} />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Color</label>
          <Input {...register("color")} />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Year</label>
          <Input type="number" {...register("year")} />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Transmission Type</label>
          <Input {...register("transmissionType")} />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">ANCAP Safety Rating</label>
          <Input type="number" {...register("ancapSafetyRating")} />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Dual Controls</label>
          <Input type="checkbox" className="mt-2 h-4 w-4" {...register("hasDualControls")} />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Price Per Hour</label>
          <Input type="number" {...register("pricePerHour")} />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Test Price Per Hour</label>
          <Input type="number" {...register("testPricePerHour")} />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Vehicle"}
      </Button>
    </form>
  );
}
