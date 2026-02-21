"use client";

import { useRouter } from "next/navigation";
import { deleteInstructor } from "@/services/instructor.service";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ListCheck, TrashIcon, View } from "lucide-react";

export function InstructorActions({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete instructor?")) return;

    try {
      await deleteInstructor(id);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline">
          Actions
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => router.push(`/admin/instructors/${id}`)}>
            <View className="mr-2 h-4 w-4" />
            View Profile
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => router.push(`/admin/instructors/${id}/orders`)}>
            <ListCheck className="mr-2 h-4 w-4" />
            Orders
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => router.push(`/admin/instructors/${id}/private-learners`)}>
            <ListCheck className="mr-2 h-4 w-4" />
            Private Learners
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => router.push(`/admin/instructors/${id}/private-orders`)}>
            <ListCheck className="mr-2 h-4 w-4" />
            Private Orders
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => router.push(`/admin/instructors/${id}/stats`)}>
            <ListCheck className="mr-2 h-4 w-4" />
            Stats
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onSelect={handleDelete}
        >
          <TrashIcon className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
