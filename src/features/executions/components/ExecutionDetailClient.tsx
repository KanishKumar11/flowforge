"use client";

import { DashboardHeader } from "@/components/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC, useVanillaClient } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
  format,
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
          <Card className="glass border-white/20 dark:border-white/10 shadow-lg backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div
                    className={`p-4 rounded-2xl ${status.bg} ring-1 ring-inset ring-white/10 shadow-inner`}
                  >
                    <StatusIcon
                      className={`h-8 w-8 ${status.color} ${execution.status === "RUNNING" ? "animate-spin" : ""}`}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                      {execution.workflow.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-sm text-muted-foreground font-medium">
                        Started{" "}
                        {formatDistanceToNow(new Date(execution.startedAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`${status.color} border-current px-4 py-1.5 text-sm font-semibold rounded-full`}
                >
                  {status.label}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass border-white/20 dark:border-white/10 shadow-lg backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Execution Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-background/30 border border-border/30">
                  <span className="text-muted-foreground text-sm font-medium">
                    Execution ID
                  </span>
                  <code className="text-xs bg-background/50 px-2.5 py-1 rounded-md border border-border/50 font-mono text-primary">
                    {execution.id}
                  </code>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-background/30 border border-border/30">
                  <span className="text-muted-foreground text-sm font-medium">
                    Mode
                  </span>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {execution.mode}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-background/30 border border-border/30">
                  <span className="text-muted-foreground text-sm font-medium">
                    Started
                  </span>
                  <span className="text-sm font-mono">
                    {format(new Date(execution.startedAt), "PPpp")}
                  </span>
                </div>
                {execution.finishedAt && (
                  <div className="flex justify-between items-center p-3 rounded-lg bg-background/30 border border-border/30">
                    <span className="text-muted-foreground text-sm font-medium">
                      Finished
                    </span>
                    <span className="text-sm font-mono">
                      {format(new Date(execution.finishedAt), "PPpp")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center p-3 rounded-lg bg-background/30 border border-border/30">
                  <span className="text-muted-foreground text-sm font-medium">
                    Duration
                  </span>
                  <span className="text-sm font-mono font-bold text-foreground">
                    {formatDurationMs(execution.duration)}
                  </span>
                </div>
                {execution.retryCount > 0 && (
                  <div className="flex justify-between items-center p-3 rounded-lg bg-background/30 border border-border/30">
                    <span className="text-muted-foreground text-sm font-medium">
                      Retry Count
                    </span>
                    <Badge variant="outline">{execution.retryCount}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass border-white/20 dark:border-white/10 shadow-lg backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-primary" />
                  Workflow Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-background/30 border border-border/30">
                  <div>
                    <p className="font-semibold text-lg">
                      {execution.workflow.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono opacity-70">
                      {execution.workflow.id}
                    </p>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
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
              <Card className="glass border-white/20 dark:border-white/10 shadow-lg backdrop-blur-xl h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Input Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-zinc-950/50 backdrop-blur-sm p-4 rounded-xl border border-white/5 overflow-auto max-h-[400px]">
                    <pre className="text-xs font-mono text-zinc-300">
                      {JSON.stringify(execution.inputData, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {execution.outputData && (
              <Card className="glass border-white/20 dark:border-white/10 shadow-lg backdrop-blur-xl h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Output Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-zinc-950/50 backdrop-blur-sm p-4 rounded-xl border border-white/5 overflow-auto max-h-[400px]">
                    <pre className="text-xs font-mono text-zinc-300">
                      {JSON.stringify(execution.outputData, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Error Message */}
          {execution.error && (
            <Card className="border-red-500/30 bg-red-500/5 backdrop-blur-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Error Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-red-950/20 p-6 rounded-xl border border-red-500/20 overflow-auto">
                  <pre className="text-sm font-mono text-red-200 whitespace-pre-wrap">
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
