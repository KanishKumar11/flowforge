"use client";

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
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { formatDistanceToNow, formatDuration, intervalToDuration } from "date-fns";
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

type ExecutionStatus = "PENDING" | "RUNNING" | "SUCCESS" | "ERROR" | "CANCELLED" | "WAITING";

const statusConfig: Record<ExecutionStatus, { icon: React.ComponentType<{ className?: string }>; label: string; classes: string }> = {
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
  return formatDuration(duration, { format: ["minutes", "seconds"] }) || `${Math.round(ms / 1000)}s`;
}

export function ExecutionsPageClient() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const trpc = useTRPC();
  const { data: executionsData, isLoading, refetch } = useQuery(
    trpc.executions.list.queryOptions({
      status: statusFilter !== "all" ? (statusFilter as ExecutionStatus) : undefined,
      limit: 50,
    })
  );
  const { data: stats } = useQuery(trpc.executions.stats.queryOptions({ days: 7 }));

  const retryExecution = useMutation(trpc.executions.retry.mutationOptions({
    onSuccess: () => {
      refetch();
      toast.success("Execution queued for retry");
    },
    onError: () => {
      toast.error("Failed to retry execution");
    },
  }));

  const deleteExecution = useMutation(trpc.executions.delete.mutationOptions({
    onSuccess: () => {
      refetch();
      toast.success("Execution deleted");
    },
    onError: () => {
      toast.error("Failed to delete execution");
    },
  }));

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
              <div className="glass p-6 rounded-xl border border-white/20 dark:border-white/10 shadow-lg backdrop-blur-xl hover-lift transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <History className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-muted-foreground font-medium">Total (7 days)</p>
                  </div>
                </div>
              </div>
              <div className="glass p-6 rounded-xl border border-white/20 dark:border-white/10 shadow-lg backdrop-blur-xl hover-lift transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.success}</p>
                    <p className="text-sm text-muted-foreground font-medium">Successful</p>
                  </div>
                </div>
              </div>
              <div className="glass p-6 rounded-xl border border-white/20 dark:border-white/10 shadow-lg backdrop-blur-xl hover-lift transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-red-500/10 ring-1 ring-red-500/20">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.error}</p>
                    <p className="text-sm text-muted-foreground font-medium">Failed</p>
                  </div>
                </div>
              </div>
              <div className="glass p-6 rounded-xl border border-white/20 dark:border-white/10 shadow-lg backdrop-blur-xl hover-lift transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.successRate.toFixed(0)}%</p>
                    <p className="text-sm text-muted-foreground font-medium">Success Rate</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex items-center gap-4 p-1 glass rounded-2xl border border-white/10 w-fit">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-transparent border-none focus:ring-0">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="ERROR">Failed</SelectItem>
                <SelectItem value="RUNNING">Running</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-6 border rounded-xl flex items-center gap-4 bg-muted/20">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && executions.length === 0 && (
            <div className="empty-state animate-fadeIn glass border border-white/20 dark:border-white/10 p-12 rounded-2xl">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6 mx-auto ring-1 ring-primary/20">
                <History className="w-10 h-10 text-primary" />
              </div>
              <h3 className="empty-state-title text-xl font-bold text-center">No executions yet</h3>
              <p className="empty-state-description max-w-md mx-auto mt-2 text-center text-muted-foreground">
                {statusFilter !== "all"
                  ? `No ${statusFilter.toLowerCase()} executions found. Try a different filter.`
                  : "Execute a workflow to see its history here. All execution details and logs will be recorded."}
              </p>
              <div className="mt-8 flex justify-center">
                <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30">
                  <Link href="/workflows">
                    <Play className="w-4 h-4" />
                    Go to Workflows
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Executions List */}
          {!isLoading && executions.length > 0 && (
            <div className="space-y-4 animate-fadeIn">
              {executions.map((execution) => {
                const status = statusConfig[execution.status as ExecutionStatus];
                const StatusIcon = status.icon;

                return (
                  <Card key={execution.id} className="card-interactive glass border-white/20 dark:border-white/10 hover:border-primary/30 transition-all duration-300">
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className={`p-3 rounded-xl ${execution.status === "SUCCESS" ? "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20" :
                            execution.status === "ERROR" ? "bg-red-500/10 text-red-500 ring-1 ring-red-500/20" :
                              execution.status === "RUNNING" ? "bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20" :
                                "bg-muted text-muted-foreground ring-1 ring-white/10"
                            }`}>
                            <StatusIcon className={`h-5 w-5 ${execution.status === "RUNNING" ? "animate-spin" : ""}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <Link
                                href={`/workflows/${execution.workflowId}`}
                                className="text-lg font-semibold hover:text-primary transition-colors"
                              >
                                {execution.workflow.name}
                              </Link>
                              <Badge variant="outline" className={`${status.classes} border px-2.5 py-0.5 text-xs font-semibold`}>
                                {status.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground font-medium">
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {formatDistanceToNow(new Date(execution.startedAt), { addSuffix: true })}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                              <span>{execution.mode}</span>
                              {execution.duration && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                  <span className="font-mono">{formatDurationMs(execution.duration)}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {(execution.status === "ERROR" || execution.status === "CANCELLED") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => retryExecution.mutate({ id: execution.id })}
                              disabled={retryExecution.isPending}
                              className="hover:bg-primary/5 hover:text-primary hover:border-primary/20"
                            >
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Retry
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background/50">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass border-white/20 dark:border-white/10">
                              <DropdownMenuItem asChild>
                                <Link href={`/executions/${execution.id}`}>
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
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
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
