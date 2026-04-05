"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProviderActions({ providerId }: any) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Actions
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() =>
            router.push(`/admin/course-providers/${providerId}/profile`)
          }
        >
          <Eye size={14} className="mr-2" />
          View Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            router.push(`/admin/course-providers/${providerId}/courses`)
          }
        >
          <BookOpen size={14} className="mr-2" />
          Courses
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}