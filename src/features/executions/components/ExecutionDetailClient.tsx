"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  format,
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
} from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    color: string;
    bg: string;
  }
> = {
  PENDING: {
    icon: Clock,
    label: "Pending",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  RUNNING: {
    icon: Loader2,
    label: "Running",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  SUCCESS: {
    icon: CheckCircle2,
    label: "Success",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  ERROR: {
    icon: AlertCircle,
    label: "Failed",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  CANCELLED: {
    icon: XCircle,
    label: "Cancelled",
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
  WAITING: {
    icon: Clock,
    label: "Waiting",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
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

interface ExecutionDetailClientProps {
  executionId: string;
}

export function ExecutionDetailClient({
  executionId,
}: ExecutionDetailClientProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const client = useVanillaClient();

  const { data: execution, isLoading } = useQuery(
    trpc.executions.get.queryOptions({ id: executionId }),
  );

  const retryExecution = useMutation({
    mutationFn: (data: { id: string }) => client.executions.retry.mutate(data),
    onSuccess: () => {
      toast.success("Execution queued for retry");
      router.push("/executions");
    },
    onError: () => {
      toast.error("Failed to retry execution");
    },
  });

  const deleteExecution = useMutation({
    mutationFn: (data: { id: string }) => client.executions.delete.mutate(data),
    onSuccess: () => {
      toast.success("Execution deleted");
      router.push("/executions");
    },
    onError: () => {
      toast.error("Failed to delete execution");
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader title="Execution Details" />
        <div className="flex-1 p-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!execution) {
    return (
      <div className="flex flex-col h-full">
        <DashboardHeader title="Execution Details" />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Execution not found</p>
            <Button asChild>
              <Link href="/executions">Back to Executions</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const status = statusConfig[execution.status as ExecutionStatus];
  const StatusIcon = status.icon;

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Execution Details"
        action={
          <div className="flex items-center gap-2">
            {(execution.status === "ERROR" ||
              execution.status === "CANCELLED") && (
              <Button
                variant="outline"
                onClick={() => retryExecution.mutate({ id: executionId })}
                disabled={retryExecution.isPending}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => deleteExecution.mutate({ id: executionId })}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="flex-1 px-8 pb-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Link */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-2 pl-0 hover:bg-transparent hover:text-primary transition-colors"
          >
            <Link href="/executions" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Executions
            </Link>
          </Button>

          {/* Status Overview */}
          <Card className="bg-(--arch-bg) border-(--arch-border) shadow-none rounded-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div
                    className={`p-4 rounded-none border ${
                      execution.status === "SUCCESS"
                        ? "bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-fg) border-(--arch-fg)"
                        : execution.status === "ERROR"
                          ? "bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-fg) border-(--arch-fg)"
                          : execution.status === "RUNNING"
                            ? "bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-fg) border-(--arch-fg)"
                            : "bg-[rgba(var(--arch-muted-rgb)/0.1)] text-(--arch-muted) border-(--arch-muted)"
                    }`}
                  >
                    <StatusIcon
                      className={`h-8 w-8 ${execution.status === "RUNNING" ? "animate-spin" : ""}`}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold tracking-tight font-mono uppercase text-(--arch-fg)">
                      {execution.workflow.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-xs text-(--arch-muted) font-mono">
                        STARTED:{" "}
                        <span className="text-(--arch-fg)">
                          {formatDistanceToNow(new Date(execution.startedAt), {
                            addSuffix: true,
                          }).toUpperCase()}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`border-(--arch-border) text-(--arch-fg) px-4 py-1.5 text-xs font-mono uppercase rounded-none`}
                >
                  {status.label}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-(--arch-bg) border-(--arch-border) shadow-none rounded-none">
              <CardHeader>
                <CardTitle className="text-sm font-mono uppercase tracking-wider text-(--arch-fg) flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Execution Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 border border-(--arch-border) bg-(--arch-bg)">
                  <span className="text-(--arch-muted) text-xs font-mono uppercase">
                    Execution ID
                  </span>
                  <code className="text-xs text-(--arch-fg) font-mono">
                    {execution.id}
                  </code>
                </div>
                <div className="flex justify-between items-center p-3 border border-(--arch-border) bg-(--arch-bg)">
                  <span className="text-(--arch-muted) text-xs font-mono uppercase">
                    Mode
                  </span>
                  <Badge
                    variant="secondary"
                    className="font-mono text-[10px] uppercase rounded-none bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-fg)"
                  >
                    {execution.mode}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 border border-(--arch-border) bg-(--arch-bg)">
                  <span className="text-(--arch-muted) text-xs font-mono uppercase">
                    Started
                  </span>
                  <span className="text-xs font-mono text-(--arch-fg)">
                    {format(
                      new Date(execution.startedAt),
                      "yyyy-MM-dd HH:mm:ss",
                    )}
                  </span>
                </div>
                {execution.finishedAt && (
                  <div className="flex justify-between items-center p-3 border border-(--arch-border) bg-(--arch-bg)">
                    <span className="text-(--arch-muted) text-xs font-mono uppercase">
                      Finished
                    </span>
                    <span className="text-xs font-mono text-(--arch-fg)">
                      {format(
                        new Date(execution.finishedAt),
                        "yyyy-MM-dd HH:mm:ss",
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center p-3 border border-(--arch-border) bg-(--arch-bg)">
                  <span className="text-(--arch-muted) text-xs font-mono uppercase">
                    Duration
                  </span>
                  <span className="text-xs font-mono text-(--arch-fg)">
                    {formatDurationMs(execution.duration)}
                  </span>
                </div>
                {execution.retryCount > 0 && (
                  <div className="flex justify-between items-center p-3 border border-(--arch-border) bg-(--arch-bg)">
                    <span className="text-(--arch-muted) text-xs font-mono uppercase">
                      Retry Count
                    </span>
                    <Badge
                      variant="outline"
                      className="rounded-none border-(--arch-border) text-(--arch-fg)"
                    >
                      {execution.retryCount}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-(--arch-bg) border-(--arch-border) shadow-none rounded-none">
              <CardHeader>
                <CardTitle className="text-sm font-mono uppercase tracking-wider text-(--arch-fg) flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Workflow Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border border-(--arch-border) bg-(--arch-bg)">
                  <div>
                    <p className="font-mono text-(--arch-fg) text-sm font-bold uppercase">
                      {execution.workflow.name}
                    </p>
                    <p className="text-[10px] text-(--arch-muted) mt-1 font-mono">
                      ID: {execution.workflow.id}
                    </p>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="bg-(--arch-fg) text-(--arch-bg) hover:bg-[rgba(var(--arch-fg-rgb)/0.8)] rounded-none font-mono uppercase text-xs h-8"
                  >
                    <Link href={`/workflows/${execution.workflow.id}`}>
                      Open Workflow
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Input/Output Data */}
          <div className="grid md:grid-cols-2 gap-6">
            {execution.inputData && (
              <Card className="bg-(--arch-bg) border-(--arch-border) shadow-none rounded-none h-full">
                <CardHeader>
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-(--arch-fg)">
                    Input Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-(--arch-bg) p-4 border border-(--arch-border) overflow-auto max-h-[400px]">
                    <pre className="text-xs font-mono text-(--arch-fg)">
                      {JSON.stringify(execution.inputData, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {execution.outputData && (
              <Card className="bg-(--arch-bg) border-(--arch-border) shadow-none rounded-none h-full">
                <CardHeader>
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-(--arch-fg)">
                    Output Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-(--arch-bg) p-4 border border-(--arch-border) overflow-auto max-h-[400px]">
                    <pre className="text-xs font-mono text-(--arch-fg)">
                      {JSON.stringify(execution.outputData, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Error Message */}
          {execution.error && (
            <Card className="border-(--arch-border) bg-(--arch-bg) shadow-none rounded-none">
              <CardHeader>
                <CardTitle className="text-sm font-mono uppercase tracking-wider text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Error Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-red-500/10 p-6 border border-red-500/20 overflow-auto">
                  <pre className="text-sm font-mono text-red-500 whitespace-pre-wrap">
                    {typeof execution.error === "string"
                      ? execution.error
                      : JSON.stringify(execution.error, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
