"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
} from "date-fns";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  History,
  Loader2,
  MoreVertical,
  Play,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC, useVanillaClient } from "@/trpc/client";

type ExecutionStatus =
  | "PENDING"
  | "RUNNING"
  | "SUCCESS"
  | "ERROR"
  | "CANCELLED"
  | "WAITING";

const statusConfig: Record<
  ExecutionStatus,
  {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    classes: string;
  }
> = {
  PENDING: { icon: Clock, label: "Pending", classes: "badge-pending" },
  RUNNING: { icon: Loader2, label: "Running", classes: "badge-pending" },
  SUCCESS: { icon: CheckCircle2, label: "Success", classes: "badge-success" },
  ERROR: { icon: AlertCircle, label: "Failed", classes: "badge-error" },
  CANCELLED: { icon: XCircle, label: "Cancelled", classes: "badge-neutral" },
  WAITING: { icon: Clock, label: "Waiting", classes: "badge-warning" },
};

function formatDurationMs(ms: number | null | undefined): string {
  if (!ms) return "—";
  if (ms < 1000) return `${ms}ms`;
  const duration = intervalToDuration({ start: 0, end: ms });
  return (
    formatDuration(duration, { format: ["minutes", "seconds"] }) ||
    `${Math.round(ms / 1000)}s`
  );
}

// Helper component defined outside
const StatusIconWrapper = ({
  status,
  Icon,
}: {
  status: ExecutionStatus;
  Icon: React.ComponentType<{ className?: string }>;
}) => {
  const getStatusClasses = (s: ExecutionStatus) => {
    switch (s) {
      case "SUCCESS":
        return "bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-fg) border-(--arch-fg)";
      case "ERROR":
        return "bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-fg) border-(--arch-fg)";
      case "RUNNING":
        return "bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-fg) border-(--arch-fg)";
      default:
        return "bg-[rgba(var(--arch-muted-rgb)/0.1)] text-(--arch-muted) border-(--arch-muted)";
    }
  };

  return (
    <div className={`p-3 rounded-none border ${getStatusClasses(status)}`}>
      <Icon
        className={`h-5 w-5 ${status === "RUNNING" ? "animate-spin" : ""}`}
      />
    </div>
  );
};

// Helper component to fix type instantiation depth issues
const StatusBadge = ({
  status,
  classes,
}: {
  status: ExecutionStatus;
  classes: string;
}) => {
  return (
    <Badge
      variant="outline"
      className={`${classes} border px-2.5 py-0.5 text-xs font-semibold`}
    >
      {status === "SUCCESS"
        ? "Success"
        : status === "ERROR"
          ? "Failed"
          : status === "RUNNING"
            ? "Running"
            : status === "PENDING"
              ? "Pending"
              : status === "CANCELLED"
                ? "Cancelled"
                : "Waiting"}
    </Badge>
  );
};

export function ExecutionsPageClient() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const trpc = useTRPC();
  const client = useVanillaClient();
  const {
    data: executionsData,
    isLoading,
    refetch,
  } = useQuery(
    trpc.executions.list.queryOptions({
      status:
        statusFilter !== "all" ? (statusFilter as ExecutionStatus) : undefined,
      limit: 50,
    }),
  );

  const { data: stats } = useQuery(
    trpc.executions.stats.queryOptions({ days: 7 }),
  );

  const retryExecution = useMutation({
    mutationFn: (data: { id: string }) => client.executions.retry.mutate(data),
    onSuccess: () => {
      refetch();
      toast.success("Execution queued for retry");
    },
    onError: () => {
      toast.error("Failed to retry execution");
    },
  });

  const deleteExecution = useMutation({
    mutationFn: (data: { id: string }) => client.executions.delete.mutate(data),
    onSuccess: () => {
      refetch();
      toast.success("Execution deleted");
    },
    onError: () => {
      toast.error("Failed to delete execution");
    },
  });

  const executions = executionsData?.items || [];

  return (
    <div className="flex flex-col h-full space-y-6">
      <DashboardHeader
        title="Executions"
        description="Monitor workflow execution history and performance"
      />

      <div className="flex-1 px-8 pb-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 border border-(--arch-border) bg-(--arch-bg) group hover:border-(--arch-fg) transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-fg) border border-(--arch-border)">
                    <History className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono text-(--arch-fg)">
                      {stats.total}
                    </p>
                    <p className="text-xs text-(--arch-muted) font-mono uppercase tracking-wider">
                      Total (7 days)
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 border border-(--arch-border) bg-(--arch-bg) group hover:border-(--arch-fg) transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-fg) border border-(--arch-border)">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono text-(--arch-fg)">
                      {stats.success}
                    </p>
                    <p className="text-xs text-(--arch-muted) font-mono uppercase tracking-wider">
                      Successful
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 border border-(--arch-border) bg-(--arch-bg) group hover:border-(--arch-fg) transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-fg) border border-(--arch-border)">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono text-(--arch-fg)">
                      {stats.error}
                    </p>
                    <p className="text-xs text-(--arch-muted) font-mono uppercase tracking-wider">
                      Failed
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 border border-(--arch-border) bg-(--arch-bg) group hover:border-(--arch-fg) transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-fg) border border-(--arch-border)">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono text-(--arch-fg)">
                      {stats.successRate.toFixed(0)}%
                    </p>
                    <p className="text-xs text-(--arch-muted) font-mono uppercase tracking-wider">
                      Success Rate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex items-center gap-4 p-1 bg-(--arch-bg) border border-(--arch-border) w-fit rounded-none">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-transparent border-none focus:ring-0 text-(--arch-fg) font-mono text-xs uppercase">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-(--arch-bg) border-(--arch-border) rounded-none">
                <SelectItem
                  value="all"
                  className="font-mono text-xs text-(--arch-fg) focus:bg-(--arch-fg) focus:text-(--arch-bg)"
                >
                  All Statuses
                </SelectItem>
                <SelectItem
                  value="SUCCESS"
                  className="font-mono text-xs text-(--arch-fg) focus:bg-(--arch-fg) focus:text-(--arch-bg)"
                >
                  Success
                </SelectItem>
                <SelectItem
                  value="ERROR"
                  className="font-mono text-xs text-(--arch-fg) focus:bg-(--arch-fg) focus:text-(--arch-bg)"
                >
                  Failed
                </SelectItem>
                <SelectItem
                  value="RUNNING"
                  className="font-mono text-xs text-(--arch-fg) focus:bg-(--arch-fg) focus:text-(--arch-bg)"
                >
                  Running
                </SelectItem>
                <SelectItem
                  value="PENDING"
                  className="font-mono text-xs text-(--arch-fg) focus:bg-(--arch-fg) focus:text-(--arch-bg)"
                >
                  Pending
                </SelectItem>
                <SelectItem
                  value="CANCELLED"
                  className="font-mono text-xs text-(--arch-fg) focus:bg-(--arch-fg) focus:text-(--arch-bg)"
                >
                  Cancelled
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {/* biome-ignore lint/suspicious/noArrayIndexKey: Skeleton loader needs index key */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="p-6 border border-(--arch-border) rounded-none flex items-center gap-4 bg-(--arch-bg)"
                >
                  <Skeleton className="h-10 w-10 rounded-none bg-[rgba(var(--arch-muted-rgb)/0.2)]" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48 bg-[rgba(var(--arch-muted-rgb)/0.2)]" />
                    <Skeleton className="h-3 w-32 bg-[rgba(var(--arch-muted-rgb)/0.2)]" />
                  </div>
                  <Skeleton className="h-6 w-20 bg-[rgba(var(--arch-muted-rgb)/0.2)]" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && executions.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 border border-(--arch-border) border-dashed bg-(--arch-bg)">
              <div className="flex items-center justify-center w-20 h-20 bg-[rgba(var(--arch-fg-rgb)/0.05)] mb-6">
                <History className="w-10 h-10 text-(--arch-fg)" />
              </div>
              <h3 className="text-xl font-bold font-mono uppercase text-(--arch-fg) tracking-widest text-center">
                System Idle
              </h3>
              <p className="max-w-md mx-auto mt-2 text-center text-(--arch-muted) font-mono text-xs">
                {statusFilter !== "all"
                  ? `No ${statusFilter.toLowerCase()} executions found in recent logs.`
                  : "No execution history details available."}
              </p>
              <div className="mt-8 flex justify-center">
                <Button
                  asChild
                  size="lg"
                  className="gap-2 bg-(--arch-fg) text-(--arch-bg) hover:bg-[rgba(var(--arch-fg-rgb)/0.9)] rounded-none font-mono uppercase text-xs"
                >
                  <Link href="/workflows">
                    <Play className="w-4 h-4" />
                    Execute Workflow
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Executions List */}
          {!isLoading && executions.length > 0 && (
            <div className="space-y-4 animate-fadeIn">
              {(executions as any[]).map((execution) => (
                <ExecutionCard
                  key={execution.id}
                  execution={execution}
                  retryExecution={retryExecution}
                  deleteExecution={deleteExecution}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Extracted Component to fix "Type instantiation is excessively deep"
const ExecutionCard = ({
  execution,
  retryExecution,
  deleteExecution,
}: {
  execution: any; // Using any to break the deep type inference chain if necessary, or proper type if possible
  retryExecution: any;
  deleteExecution: any;
}) => {
  const status = statusConfig[execution.status as ExecutionStatus];
  const StatusIcon = status.icon;

  return (
    <Card className="group border-(--arch-border) bg-(--arch-bg) shadow-none rounded-none hover:border-(--arch-fg) transition-all duration-300">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <StatusIconWrapper
              status={execution.status as ExecutionStatus}
              Icon={StatusIcon}
            />
            <div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/workflows/${execution.workflowId}`}
                  className="text-lg font-bold font-mono uppercase text-(--arch-fg) hover:underline"
                >
                  {execution.workflow.name}
                </Link>
                <StatusBadge
                  status={execution.status as ExecutionStatus}
                  classes={status.classes}
                />
              </div>
              <div className="flex items-center gap-4 mt-1.5 text-xs text-(--arch-muted) font-mono">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDistanceToNow(new Date(execution.startedAt), {
                    addSuffix: true,
                  })}
                </span>
                <span>|</span>
                <span>{execution.mode}</span>
                {execution.duration && (
                  <>
                    <span>|</span>
                    <span>{formatDurationMs(execution.duration)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(execution.status === "ERROR" ||
              execution.status === "CANCELLED") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => retryExecution.mutate({ id: execution.id })}
                disabled={retryExecution.isPending}
                className="border-(--arch-border) text-(--arch-fg) hover:bg-(--arch-fg) hover:text-(--arch-bg) rounded-none font-mono uppercase text-xs h-8"
              >
                <RefreshCw className="h-3 w-3 mr-1.5" />
                Retry
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-(--arch-muted) hover:text-(--arch-fg) hover:bg-[rgba(var(--arch-fg-rgb)/0.1)] rounded-none"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-(--arch-bg) border-(--arch-border) rounded-none"
              >
                <DropdownMenuItem
                  asChild
                  className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs uppercase"
                >
                  <Link href={`/executions/${execution.id}`}>View Details</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500 focus:bg-red-500 focus:text-white cursor-pointer font-mono text-xs uppercase"
                  onClick={() => deleteExecution.mutate({ id: execution.id })}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
