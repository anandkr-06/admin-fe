/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

import {
  updateInstructorProfile,
  uploadProfileImageFile,
} from "@/services/instructor.service";
import { ENV } from "@/lib/utils";
import CropImageModal from "../CropImageModal";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera } from "lucide-react";

import ReactSelect from "react-select";

const LANGUAGE_OPTIONS = [
  { value: "English", label: "English" },
  { value: "Mandarin", label: "Mandarin" },
  { value: "Arabic", label: "Arabic" },
  { value: "Vietnamese", label: "Vietnamese" },
  { value: "Cantonese", label: "Cantonese" },
  { value: "Punjabi", label: "Punjabi" },
  { value: "Greek", label: "Greek" },
  { value: "Italian", label: "Italian" },
  { value: "Hindi", label: "Hindi" },
  { value: "Spanish", label: "Spanish" },
  { value: "Nepali", label: "Nepali" },
  { value: "Tagalog", label: "Tagalog" },
  { value: "Korean", label: "Korean" },
  { value: "Urdu", label: "Urdu" },
  { value: "Tamil", label: "Tamil" },
  { value: "Filipino", label: "Filipino" },
  { value: "Sinhalese", label: "Sinhalese" },
  { value: "Gujarati", label: "Gujarati" },
  { value: "Malayalam", label: "Malayalam" },
  { value: "Indonesian", label: "Indonesian" },
  { value: "Persian", label: "Persian" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Bengali", label: "Bengali" },
  { value: "Portuguese", label: "Portuguese" },
];

type Props = {
  instructorId: string;
  data: any;
  onSuccess?: () => void;
};

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dob: string;
  postCode: string;
  transmissionType: string;
  description: string;
  gender: string;
  profileImage: string;
  proficientLanguages: {
    label: string;
    value: string;
  }[];
};

export default function PersonalDetails({
  instructorId,
  data,
  onSuccess,
}: Props) {
  const [uploading, setUploading] = useState(false);
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
    const normalized = value.replace(/^uploads\//, "");
    return `${ENV.IMAGE_MEDIA_URL}/${normalized}`;
  };
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: {
      errors,
    },
  } = useForm<FormData>({
    defaultValues: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
      mobileNumber: data?.mobileNumber || data?.mobile || "",
      dob: data?.dob ? data.dob.substring(0, 10) : "",
      postCode: data?.postCode || "",
      transmissionType: data?.transmissionType || "auto",
      description: data?.description || "",
      gender: data?.gender || "",
      profileImage: data?.profileImage || "",
      proficientLanguages: data?.proficientLanguages?.map((item: string) => ({
        label: item,
        value: item,
      })) || [],
    },
  });

  useEffect(() => {
    if (!data) return;

    reset({
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      mobileNumber: data.mobileNumber || data.mobile || "",
      dob: data.dob
        ? data.dob.substring(0, 10)
        : "",
      postCode: data.postCode || "",
      transmissionType:
        data.transmissionType || "auto",
      description: data.description || "",
      gender: data.gender || "",
      profileImage:
        data.profileImage || "",
      proficientLanguages:
        data.proficientLanguages?.map(
          (item: string) => ({
            label: item,
            value: item,
          })
        ) || [],
    });
  }, [data, reset]);

  const uploadProfileImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setImageToCrop(fileUrl);
    setShowCropper(true);
  };

  const onCropDone = async (file: File) => {
    try {
      setShowCropper(false);
      setUploading(true);

      const res = await uploadProfileImageFile(file);
      setValue("profileImage", res.url || res.path || "");
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
      if (imageToCrop) {
        URL.revokeObjectURL(imageToCrop);
      }
      setImageToCrop(null);
    }
  };

  const onSubmit = async (form: FormData) => {
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      mobileNumber: form.mobileNumber,
      dob: form.dob,
      postCode: form.postCode,
      transmissionType: form.transmissionType,
      description: form.description,
      gender: form.gender,
      profileImage: form.profileImage,
      proficientLanguages: form.proficientLanguages.map(
        (item) => item.value
      ),
    };

    try {
      await updateInstructorProfile(
        instructorId,
        payload
      );

      toast.success(
        "Profile updated successfully"
      );

      onSuccess?.();

    } catch {

      toast.error(
        "Failed to update profile"
      );

    }
  };

  return (
      <form
    onSubmit={handleSubmit(onSubmit)}
    className="space-y-6"
  >
    {/* Profile Image */}
    <div className="flex items-center gap-6">

      <div className="w-28 h-28 rounded-full border overflow-hidden bg-gray-100">
        {watch("profileImage") ? (
          <img
            src={getImageSrc(watch("profileImage"))}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="flex flex-col items-start gap-2">
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100">
          <Camera className="h-4 w-4 text-slate-500" />
          <span>{watch("profileImage") ? "Change photo" : "Upload photo"}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={uploadProfileImage}
          />
        </label>

        {uploading && (
          <p className="text-sm text-gray-500 mt-2">
            Uploading...
          </p>
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

    {/* First Row */}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div>

        <label className="block mb-2 text-sm font-medium">
          First Name
        </label>

        <Input
          {...register("firstName", {
            required: "First Name is required",
          })}
        />

        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.firstName.message}
          </p>
        )}

      </div>

      <div>

        <label className="block mb-2 text-sm font-medium">
          Last Name
        </label>

        <Input
          {...register("lastName", {
            required: "Last Name is required",
          })}
        />

        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.lastName.message}
          </p>
        )}

      </div>

    </div>

    {/* Second Row */}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div>

        <label className="block mb-2 text-sm font-medium">
          Email
        </label>

        <Input
          type="email"
          {...register("email", {
            required: "Email is required",
          })}
        />

        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </p>
        )}

      </div>

      <div>

        <label className="block mb-2 text-sm font-medium">
          Mobile Number
        </label>

        <Input
          {...register("mobileNumber", {
            required: "Mobile number is required",
          })}
        />

        {errors.mobileNumber && (
          <p className="text-red-500 text-sm mt-1">
            {errors.mobileNumber.message}
          </p>
        )}

      </div>

    </div>

    {/* Third Row */}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div>

        <label className="block mb-2 text-sm font-medium">
          Date Of Birth
        </label>

        <Input
          type="date"
          {...register("dob")}
        />

      </div>

      <div>

        <label className="block mb-2 text-sm font-medium">
          Post Code
        </label>

        <Input
          {...register("postCode")}
        />

      </div>

    </div>

    {/* Fourth Row */}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div>

        <label className="block mb-2 text-sm font-medium">
          Gender
        </label>

        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="male">
                  Male
                </SelectItem>

                <SelectItem value="female">
                  Female
                </SelectItem>

                <SelectItem value="other">
                  Other
                </SelectItem>

              </SelectContent>

            </Select>
          )}
        />

      </div>

      <div>

        <label className="block mb-2 text-sm font-medium">
          Transmission
        </label>

        <Controller
          control={control}
          name="transmissionType"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="auto">
                  Auto
                </SelectItem>

                <SelectItem value="manual">
                  Manual
                </SelectItem>

                <SelectItem value="both">
                  Both
                </SelectItem>

              </SelectContent>

            </Select>
          )}
        />

      </div>

    </div>

    {/* Languages */}

    <div>

      <label className="block mb-2 text-sm font-medium">
        Proficient Languages
      </label>

      <Controller
        control={control}
        name="proficientLanguages"
        render={({ field }) => (
          <ReactSelect
            {...field}
            isMulti
            options={LANGUAGE_OPTIONS}
            classNamePrefix="react-select"
          />
        )}
      />

    </div>

    {/* Description */}

    <div>

      <label className="block mb-2 text-sm font-medium">
        Description
      </label>

      <Textarea
        rows={6}
        {...register("description")}
      />

    </div>

    <div className="flex justify-end">
      <Button type="submit" disabled={uploading}>
        {uploading ? "Saving..." : "Save Profile"}
      </Button>
    </div>
    </form>
  );
}
