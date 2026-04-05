"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CourseActions({
  course,
  onStatusChange,
  loadingId,
}: any) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Actions
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        {/* View Course Details */}
        <DropdownMenuItem
          onClick={() => router.push(`/admin/courses/${course._id}`)}
        >
          <Eye size={14} className="mr-2" />
          View Details
        </DropdownMenuItem>

        {/* Leads (FIXED) */}
        <DropdownMenuItem
  onClick={() =>
    router.push(
      `/admin/course-providers/${course.provider?._id}/courses/${course._id}/leads`
    )
  }
>
  <Users size={14} className="mr-2" />
  Leads
</DropdownMenuItem>

        {/* Approve */}
        <DropdownMenuItem
          disabled={
            loadingId === course._id ||
            course.status === "APPROVED"
          }
          onClick={() =>
            onStatusChange(course._id, "APPROVED")
          }
        >
          <CheckCircle size={14} className="mr-2 text-green-600" />
          Approve
        </DropdownMenuItem>

        {/* Reject */}
        <DropdownMenuItem
          disabled={
            loadingId === course._id ||
            course.status === "REJECTED"
          }
          onClick={() =>
            onStatusChange(course._id, "REJECTED")
          }
        >
          <XCircle size={14} className="mr-2 text-red-600" />
          Reject
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}