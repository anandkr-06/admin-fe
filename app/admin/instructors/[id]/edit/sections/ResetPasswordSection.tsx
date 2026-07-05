"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateInstructorPassword } from "@/services/instructor.service";

type Props = {
  instructorId: string;
  onSuccess?: () => void;
};

export default function ResetPasswordSection({
  instructorId,
  onSuccess,
}: Props) {
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextPassword = password.trim();

    if (!nextPassword) {
      toast.error("Password is required");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateInstructorPassword(instructorId, {
        password: nextPassword,
      });
      setPassword("");
      toast.success("Password updated successfully");
      onSuccess?.();
    } catch {
      toast.error("Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-medium">
            New Password
          </label>

          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
}
