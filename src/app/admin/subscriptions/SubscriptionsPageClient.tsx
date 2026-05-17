"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const PLAN_COLORS: Record<string, string> = {
  free: "bg-muted text-muted-foreground",
  pro: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  enterprise: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
};

export default function SubscriptionsPageClient() {
  const trpc = useTRPC();
  // Show team plans; for full Polar.sh integration the tRPC layer would proxy subscription data
  const { data, isLoading } = useQuery(
    trpc.admin.users.list.queryOptions({ page: 1, limit: 50, sortBy: "createdAt", sortOrder: "desc" }),
  );

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border/50 bg-card px-5 py-4">
        <h1 className="text-xl font-bold tracking-tight">Subscriptions</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          View user plans · Subscription management is handled by{" "}
          <a href="https://polar.sh" target="_blank" rel="noreferrer" className="underline">
            Polar.sh
          </a>
        </p>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-1 p-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {(data?.users ?? []).map((u) => (
                <div key={u.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium">{u.name ?? "—"}</p>
                    <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={cn("text-xs capitalize", PLAN_COLORS["free"])}>
                      <CreditCard className="mr-1 h-3 w-3" /> Free
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
