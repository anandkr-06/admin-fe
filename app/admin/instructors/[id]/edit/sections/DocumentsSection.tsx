"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ENV } from "@/lib/utils";
import { updateInstructorDocuments, uploadInstructorDocumentFile } from "@/services/instructor.service";

type DocumentEntry = {
  documentNumber?: string;
  expiryDate?: string;
  issueDate?: string;
  attachment?: string;
};

type DocumentsData = {
  industryAuthorityCard?: DocumentEntry;
  certificateOfCurrency?: DocumentEntry;
  vehicleRegistration?: DocumentEntry;
  driverLicence?: DocumentEntry;
  blueCard?: DocumentEntry;
  certificateIvMotorVehicleTraining?: DocumentEntry;
};

type Props = {
  instructorId: string;
  data?: Record<string, unknown>;
  onSuccess?: () => void;
};

type FormValues = {
  certificateOfCurrencyIssueDate: string;
  certificateOfCurrencyExpiryDate: string;
  industryAuthorityCardExpiryDate: string;
  vehicleRegistrationExpiryDate: string;
  driverLicenceExpiryDate: string;
  blueCardExpiryDate: string;
  certificateIvMotorVehicleTrainingIssueDate: string;
};

type DocumentConfig = {
  key: string;
  label: string;
  hasDocumentNumber?: boolean;
  hasIssueDate?: boolean;
  hasExpiryDate?: boolean;
};

const DOCUMENTS: DocumentConfig[] = [
  {
    key: "certificateOfCurrency",
    label: "Vehicle Insurance",
    hasIssueDate: true,
    hasExpiryDate: true,
  },
  {
    key: "industryAuthorityCard",
    label: "Industry Authority Card",
    hasExpiryDate: true,
  },
  {
    key: "vehicleRegistration",
    label: "Vehicle Registration",
    hasExpiryDate: true,
  },
  {
    key: "driverLicence",
    label: "Driver Licence",
    hasExpiryDate: true,
  },
  {
    key: "blueCard",
    label: "WWCC/Blue Card",
    hasExpiryDate: true,
  },
  {
    key: "certificateIvMotorVehicleTraining",
    label: "Certificate IV in Motor Vehicle Training",
  },
];

export default function DocumentsSection({ instructorId, data, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadedPaths, setUploadedPaths] = useState<Record<string, string | null>>({});
  const [uploadedFileNames, setUploadedFileNames] = useState<Record<string, string>>({});

  const { register, reset, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      certificateOfCurrencyIssueDate: "",
      certificateOfCurrencyExpiryDate: "",
      industryAuthorityCardExpiryDate: "",
      vehicleRegistrationExpiryDate: "",
      driverLicenceExpiryDate: "",
      blueCardExpiryDate: "",
      certificateIvMotorVehicleTrainingIssueDate: "",
    },
  });

  useEffect(() => {
    const documents = (data?.documents as DocumentsData | undefined) || {};
    reset({
      certificateOfCurrencyIssueDate:
        documents.certificateOfCurrency?.issueDate || "",
      certificateOfCurrencyExpiryDate:
        documents.certificateOfCurrency?.expiryDate || "",
      industryAuthorityCardExpiryDate:
        documents.industryAuthorityCard?.expiryDate || "",
      vehicleRegistrationExpiryDate:
        documents.vehicleRegistration?.expiryDate || "",
      driverLicenceExpiryDate:
        documents.driverLicence?.expiryDate || "",
      blueCardExpiryDate:
        documents.blueCard?.expiryDate || "",
      certificateIvMotorVehicleTrainingIssueDate:
        documents.certificateIvMotorVehicleTraining?.issueDate || "",
    });

    type DocumentRaw =
      | string
      | { attachment?: string; path?: string; url?: string }
      | undefined;

    const initialPaths: Record<string, string | null> = {};
    const initialNames: Record<string, string> = {};

    DOCUMENTS.forEach((doc) => {
      const raw = (documents as Record<string, unknown> | undefined)?.[doc.key as string] as DocumentRaw;
      let attachment: string | null = null;

      if (!raw) {
        attachment = null;
      } else if (typeof raw === "string") {
        attachment = raw;
      } else if (raw.attachment) {
        attachment = raw.attachment;
      } else if (raw.path) {
        attachment = raw.path;
      } else if (raw.url) {
        attachment = raw.url;
      }

      if (attachment) {
        initialPaths[doc.key] = attachment;
        initialNames[doc.key] = String(attachment).split("/").pop() || doc.label;
      }
    });

    setUploadedPaths(initialPaths);
    setUploadedFileNames(initialNames);
  }, [data, reset]);

  const handleUpload = async (file: File, docKey: string) => {
    const MAX_SIZE = 1 * 1024 * 1024;
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

    if (file.size > MAX_SIZE) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      toast.error(`${file.name} is ${sizeMB} MB. Maximum allowed size is 1 MB`);
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, JPG, and PNG files are allowed");
      return;
    }

    try {
      setUploadingKey(docKey);
      toast.loading("Uploading document...", { id: docKey });
      const res = await uploadInstructorDocumentFile(file, docKey);
      const path = res?.path || res?.url || null;
      if (path) {
        setUploadedPaths((prev) => ({ ...prev, [docKey]: path }));
        setUploadedFileNames((prev) => ({ ...prev, [docKey]: file.name }));
      }
      toast.success("Document uploaded successfully", { id: docKey });
    } catch {
      toast.error("Document upload failed", { id: docKey });
    } finally {
      setUploadingKey(null);
    }
  };

  const onSubmit = async (form: FormValues) => {
    try {
      setIsSubmitting(true);
      const payload: Record<string, unknown> = {};

      payload.certificateOfCurrency = {
        issueDate: form.certificateOfCurrencyIssueDate || undefined,
        expiryDate: form.certificateOfCurrencyExpiryDate || undefined,
        attachment: uploadedPaths.certificateOfCurrency || null,
      };

      payload.industryAuthorityCard = {
        expiryDate: form.industryAuthorityCardExpiryDate || undefined,
        attachment: uploadedPaths.industryAuthorityCard || null,
      };

      payload.vehicleRegistration = {
        expiryDate: form.vehicleRegistrationExpiryDate || undefined,
        attachment: uploadedPaths.vehicleRegistration || null,
      };

      payload.driverLicence = {
        expiryDate: form.driverLicenceExpiryDate || undefined,
        attachment: uploadedPaths.driverLicence || null,
      };

      payload.blueCard = {
        expiryDate: form.blueCardExpiryDate || undefined,
        attachment: uploadedPaths.blueCard || null,
      };

      payload.certificateIvMotorVehicleTraining = {
        issueDate: form.certificateIvMotorVehicleTrainingIssueDate || undefined,
        attachment: uploadedPaths.certificateIvMotorVehicleTraining || null,
      };

      await updateInstructorDocuments(instructorId, payload);
      toast.success("Documents updated successfully");
      onSuccess?.();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update documents";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {DOCUMENTS.map((doc) => {
          const docData = (data?.documents as Record<string, any> | undefined)?.[doc.key];
          const issueDate = docData?.issueDate || "-";
          const expiryDate = docData?.expiryDate || "-";
          const uploadStatus = uploadedPaths[doc.key] ? "Uploaded" : "Not Uploaded";
              const issueDateField =
            doc.key === "certificateOfCurrency"
              ? "certificateOfCurrencyIssueDate"
              : doc.key === "certificateIvMotorVehicleTraining"
              ? "certificateIvMotorVehicleTrainingIssueDate"
              : "";
          const expiryDateField =
            doc.key === "certificateOfCurrency"
              ? "certificateOfCurrencyExpiryDate"
              : doc.key === "industryAuthorityCard"
              ? "industryAuthorityCardExpiryDate"
              : doc.key === "vehicleRegistration"
              ? "vehicleRegistrationExpiryDate"
              : doc.key === "driverLicence"
              ? "driverLicenceExpiryDate"
              : doc.key === "blueCard"
              ? "blueCardExpiryDate"
              : "";

          const documentNumberField =
            doc.key === "certificateOfCurrency"
              ? "certificateOfCurrencyDocumentNumber"
              : doc.key === "industryAuthorityCard"
              ? "industryAuthorityCardDocumentNumber"
              : doc.key === "vehicleRegistration"
              ? "vehicleRegistrationDocumentNumber"
              : doc.key === "driverLicence"
              ? "driverLicenceDocumentNumber"
              : doc.key === "blueCard"
              ? "blueCardDocumentNumber"
              : doc.key === "certificateIvMotorVehicleTraining"
              ? "certificateIvMotorVehicleTrainingDocumentNumber"
              : "";

          return (
            <div key={doc.key} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{doc.label}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    {doc.hasIssueDate ? (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1">
                        Issue Date: {issueDate}
                      </span>
                    ) : null}
                    {doc.hasExpiryDate ? (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                        Expiry Date: {expiryDate}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${uploadedPaths[doc.key] ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                  >
                    {uploadStatus}
                  </span>
                  {uploadedPaths[doc.key] ? (
                    <button
                      type="button"
                      onClick={() => {
                        const p = uploadedPaths[doc.key] as string;
                        const full = p.startsWith("http")
                          ? p
                          : `${(ENV.IMAGE_MEDIA_URL || "").replace(/\/+$/, "")}/${p.replace(/^uploads\//, "")}`;
                        window.open(full, "_blank");
                      }}
                      className="text-sm font-medium text-blue-600 underline"
                    >
                      View Document
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {doc.hasDocumentNumber ? (
                  <div>
                    <label className="mb-2 block text-sm font-medium">Document Number</label>
                    <Input
                      {...register(documentNumberField as never)}
                    />
                  </div>
                ) : null}

                {doc.hasIssueDate ? (
                  <div>
                    <label className="mb-2 block text-sm font-medium">Issue Date</label>
                    <Input type="date" {...register(issueDateField as never)} />
                  </div>
                ) : null}

                {doc.hasExpiryDate ? (
                  <div>
                    <label className="mb-2 block text-sm font-medium">Expiry Date</label>
                    <Input type="date" {...register(expiryDateField as never)} />
                  </div>
                ) : null}

                <div>
                  <label className="mb-2 block text-sm font-medium">Upload File</label>
                  <label className="flex h-10 cursor-pointer items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-3 text-sm text-gray-600">
                    <span className="truncate">{uploadedFileNames[doc.key] || "Choose file"}</span>
                    <span className="ml-2 text-xs font-semibold text-amber-600">BROWSE</span>
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) handleUpload(file, doc.key);
                        event.target.value = "";
                      }}
                    />
                  </label>
                  {uploadedPaths[doc.key] ? (
                    <button
                      type="button"
                      onClick={() => {
                        const p = uploadedPaths[doc.key] as string;
                        const full = p.startsWith("http")
                          ? p
                          : `${(ENV.IMAGE_MEDIA_URL || "").replace(/\/+$/, "")}/${p.replace(/^uploads\//, "")}`;
                        window.open(full, "_blank");
                      }}
                      className="mt-2 text-sm text-blue-600 underline"
                    >
                      View uploaded file
                    </button>
                  ) : null}
                  {uploadingKey === doc.key ? <p className="mt-2 text-sm text-gray-500">Uploading...</p> : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Documents"}
        </Button>
      </div>
    </form>
  );
}
