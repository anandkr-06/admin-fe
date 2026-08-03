"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateInstructorAdditionalInformation } from "@/services/instructor.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  data?: any;
  onSuccess?: () => void;
};

export default function AdditionalInformationSection({
  instructorId,
  data,
  onSuccess,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, control, reset, handleSubmit } = useForm({
    defaultValues: {
      languagesKnown: [] as { value: string; label: string }[],
      proficientLanguages: [] as { value: string; label: string }[],
      instructorExperienceYears: "",
      isMemberOfDrivingAssociation: false,
      drivingAssociations: "",
    },
  });

  useEffect(() => {
    reset({
      languagesKnown: (data?.languagesKnown || []).map((item: string) => ({
        value: item,
        label: item,
      })),
      proficientLanguages: (data?.proficientLanguages || []).map(
        (item: string) => ({ value: item, label: item }),
      ),
      instructorExperienceYears: data?.instructorExperienceYears || "",
      isMemberOfDrivingAssociation: data?.isMemberOfDrivingAssociation || false,
      drivingAssociations: (data?.drivingAssociations || []).join(", "),
    });
  }, [data, reset]);

  const onSubmit = async (form: any) => {
    try {
      setIsSubmitting(true);
      await updateInstructorAdditionalInformation(instructorId, {
        languagesKnown: form.languagesKnown.map((item: any) => item.value),
        proficientLanguages: form.proficientLanguages.map(
          (item: any) => item.value,
        ),
        instructorExperienceYears: Number(form.instructorExperienceYears || 0),
        isMemberOfDrivingAssociation: form.isMemberOfDrivingAssociation,
        drivingAssociations: form.drivingAssociations
          .split(",")
          .map((item: string) => item.trim())
          .filter(Boolean),
      });
      toast.success("Additional information updated successfully");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update additional information");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block mb-2 text-sm font-medium">
          Languages Known
        </label>
        <Controller
          control={control}
          name="languagesKnown"
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

      <div>
        <label className="block mb-2 text-sm font-medium">
          Instructor Experience Since Years
        </label>
        <select
          {...register("instructorExperienceYears")}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-600 focus:outline-none"
        >
          <option value="">Select experience</option>
          {Array.from({ length: 40 }, (_, i) => {
            const year = new Date().getFullYear() - i;

            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">
          Member of Driving Association
        </label>
        <Controller
          control={control}
          name="isMemberOfDrivingAssociation"
          render={({ field }) => (
            <Select
              value={field.value ? "true" : "false"}
              onValueChange={(value) => field.onChange(value === "true")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">
          Driving Associations
        </label>
        <Input
          {...register("drivingAssociations")}
          placeholder="Separate with commas"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Additional Information"}
      </Button>
    </form>
  );
}
