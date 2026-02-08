import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-[rgba(var(--arch-muted-rgb)/0.2)] animate-pulse rounded-none",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
