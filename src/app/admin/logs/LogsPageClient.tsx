// @ts-nocheck
"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, FileText, Terminal } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  UPDATE: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  DELETE: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  BAN: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  default: "bg-muted text-muted-foreground",
};

function actionBadge(action: string) {
  const prefix = action.split("_")[0];
  const cls = ACTION_COLORS[prefix] ?? ACTION_COLORS.default;
  return <Badge className={cn("text-[10px]", cls)}>{action.replace(/_/g, " ")}</Badge>;
}

export default function LogsPageClient() {
  const trpc = useTRPC();
  const [tab, setTab] = useState<"admin" | "system">("admin");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const adminLogs = useQuery(
    trpc.admin.logs.list.queryOptions({ page, limit: 30, search: search || undefined }),
    { enabled: tab === "admin" },
  );

  const systemLogs = useQuery(
    trpc.admin.logs.systemLogs.queryOptions({ page, limit: 30, search: search || undefined }),
    { enabled: tab === "system" },
  );

  const active = tab === "admin" ? adminLogs : systemLogs;
  const logs = (active.data as { logs: unknown[]; pages: number; total: number } | undefined);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border/50 bg-card px-5 py-4">
        <h1 className="text-xl font-bold tracking-tight">Audit Logs</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Track all admin and user actions</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-1 rounded-lg border bg-muted/30 p-0.5">
          {(["admin", "system"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setPage(1); }}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors",
                tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t === "admin" ? "Admin actions" : "User activity"}
            </button>
          ))}
        </div>
        <Input
          placeholder="Search action..."
          className="h-8 w-48 text-sm"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          {active.isLoading ? (
            <div className="space-y-1 p-3">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
            </div>
          ) : (logs?.logs ?? []).length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No logs found.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {(logs?.logs as Array<{
                id: string;
                action: string;
                targetType?: string;
                targetId?: string;
                createdAt: Date;
                ipAddress?: string;
                adminUser?: { user: { email: string; name: string | null; image: string | null } };
                user?: { email: string; name: string | null; image: string | null };
              }>).map((log) => {
                const actor = log.adminUser?.user ?? log.user;
                return (
                  <div key={log.id} className="flex items-center gap-3 px-4 py-3">
                    {actor ? (
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarImage src={actor.image ?? undefined} />
                        <AvatarFallback className="text-xs">
                          {(actor.name ?? actor.email).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                        <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {actionBadge(log.action)}
                        {log.targetType && (
                          <Badge variant="outline" className="text-[10px] capitalize">{log.targetType}</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {actor?.email ?? "System"}
                        </span>
                      </div>
                      {log.targetId && (
                        <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{log.targetId}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right text-xs text-muted-foreground">
                      <p>{format(new Date(log.createdAt), "MMM d, HH:mm")}</p>
                      {log.ipAddress && <p className="font-mono">{log.ipAddress}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {logs && logs.pages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground">
            Page {page} of {logs.pages} · {logs.total} entries
          </p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-3 w-3" /> Prev
            </Button>
            <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" disabled={page >= logs.pages} onClick={() => setPage((p) => p + 1)}>
              Next <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
