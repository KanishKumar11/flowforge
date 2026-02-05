import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-(--arch-muted)/20 animate-pulse rounded-none", className)}
      {...props}
    />
  );
}

export { Skeleton };
