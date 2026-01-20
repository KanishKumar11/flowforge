"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FavoriteToggleProps {
  workflowId: string;
  isFavorite: boolean;
  size?: "sm" | "default" | "lg" | "icon";
}

export function FavoriteToggle({ workflowId, isFavorite, size = "icon" }: FavoriteToggleProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const toggleFavorite = useMutation(
    trpc.workflows.toggleFavorite.mutationOptions({
      onSuccess: (workflow) => {
        queryClient.invalidateQueries({ queryKey: ["workflows"] });
        toast.success(workflow.isFavorite ? "Added to favorites" : "Removed from favorites");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite.mutate({ id: workflowId });
      }}
      disabled={toggleFavorite.isPending}
      className={cn(
        "transition-colors",
        isFavorite ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground hover:text-yellow-500"
      )}
    >
      <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
    </Button>
  );
}
