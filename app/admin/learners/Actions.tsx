"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ListCheck, View, Wallet, Star } from "lucide-react";

export function LearnerActions({ id }: { id: string }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline">
          Actions
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>

          {/* View Profile */}
          <DropdownMenuItem
            onSelect={() => router.push(`/admin/learners/${id}`)}
          >
            <View className="mr-2 h-4 w-4" />
            View Profile
          </DropdownMenuItem>

          {/* Orders */}
          <DropdownMenuItem
            onSelect={() => router.push(`/admin/learners/${id}/orders`)}
          >
            <ListCheck className="mr-2 h-4 w-4" />
            Orders
          </DropdownMenuItem>

          {/* Stats */}
          <DropdownMenuItem
            onSelect={() => router.push(`/admin/learners/${id}/stats`)}
          >
            <ListCheck className="mr-2 h-4 w-4" />
            Stats
          </DropdownMenuItem>

          {/* Wallet Transactions */}
          <DropdownMenuItem
            onSelect={() => router.push(`/admin/learners/${id}/wallet`)}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Wallet Transactions
          </DropdownMenuItem>

          {/* Reviews & Feedback */}
          <DropdownMenuItem
            onSelect={() => router.push(`/admin/learners/${id}/reviews`) }
          >
            <Star className="mr-2 h-4 w-4" />
            Reviews 
          </DropdownMenuItem>
           <DropdownMenuItem
            onSelect={() => router.push(`/admin/learners/${id}/feedbacks`) }
          >
            <Star className="mr-2 h-4 w-4" />
            Feedback
          </DropdownMenuItem>

        </DropdownMenuGroup>
        

        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}