"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { AdminDataTable } from "@/features/admin/components/AdminDataTable";
import { StatsCard } from "@/features/admin/components/StatsCard";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertCircle, CheckCircle2, MoreHorizontal, Trash2, Workflow, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type WF = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  user: { email: string; name: string | null } | null;
  _count: { executions: number; schedules: number };
};

export default function WorkflowsPageClient() {
  const trpc = useTRPC();
  const qc = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<WF | null>(null);

  const { data, isLoading } = useQuery(
    trpc.admin.workflows.list.queryOptions({
      page,
      limit: 20,
      search: search || undefined,
    }),
  );

  const { data: stats } = useQuery(
    trpc.admin.workflows.executionStats.queryOptions(),
  );

  const deleteMutation = useMutation(
    trpc.admin.workflows.deleteWorkflow.mutationOptions({
      onSuccess: () => {
        toast.success("Workflow deleted");
        qc.invalidateQueries(trpc.admin.workflows.list.pathFilter());
        setDeleteTarget(null);
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  const columns: ColumnDef<WF>[] = [
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.user?.email ?? "—"}</p>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={cn(
            "text-xs",
            row.original.isActive
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
              : "bg-muted text-muted-foreground",
          )}
        >
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "executions",
      header: "Executions",
      cell: ({ row }) => (
        <span className="tabular-nums">{row.original._count.executions}</span>
      ),
    },
    {
      id: "schedules",
      header: "Schedules",
      cell: ({ row }) => (
        <span className="tabular-nums">{row.original._count.schedules}</span>
      ),
    },
    {
      id: "created",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTarget(row.original);
              }}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card px-5 py-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Workflows</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Manage all {data?.total ?? "…"} workflows</p>
        </div>
      </div>

      {stats && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Executions"
            value={stats.byStatus.reduce((sum, s) => sum + s._count, 0)}
            icon={Zap}
            iconColor="text-violet-600"
            index={0}
          />
          <StatsCard
            title="Successful"
            value={stats.byStatus.find((s) => s.status === "SUCCESS")?._count ?? 0}
            icon={CheckCircle2}
            iconColor="text-emerald-600"
            index={1}
          />
          <StatsCard
            title="Failed"
            value={stats.byStatus.find((s) => s.status === "ERROR")?._count ?? 0}
            icon={AlertCircle}
            iconColor="text-red-600"
            index={2}
          />
          <StatsCard
            title="Avg Duration"
            value={`${((stats.avgDuration ?? 0) / 1000).toFixed(1)}s`}
            icon={Workflow}
            iconColor="text-amber-600"
            index={3}
          />
        </div>
      )}

      <AdminDataTable
        columns={columns}
        data={(data?.workflows as unknown as WF[]) ?? []}
        loading={isLoading}
        toolbar={
          <Input
            placeholder="Search workflows..."
            className="h-8 w-52 text-sm"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        }
        emptyState={
          <div className="py-8 text-center">
            <Workflow className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No workflows found</p>
          </div>
        }
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete workflow?"
        description={`Delete "${deleteTarget?.name}" and all execution history. This cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate({ workflowId: deleteTarget!.id })}
      />
    </div>
  );
}
