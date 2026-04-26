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
  Play,
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
import { BallLoader } from "@/components/ui/ball-loader";
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
        <div className="flex-1 flex items-center justify-center">
          <BallLoader />
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

  // Cast to a simple shape once to avoid Prisma JsonValue deep type instantiation errors
  const exec = execution as unknown as {
    id: string;
    status: string;
    mode: string;
    startedAt: Date | string;
    finishedAt: Date | string | null;
    duration: number | null;
    retryCount: number;
    error: string | Record<string, unknown> | null;
    inputData: Record<string, unknown> | null;
    outputData: Record<string, unknown> | null;
    nodeResults: Record<string, unknown> | null;
    workflow: {
      id: string;
      name: string;
      nodes: Array<{
        id: string;
        data: { type: string; label: string };
      }> | null;
    };
  };

  // Build per-node progress from nodeResults + workflow nodes
  type NodeStep = {
    id: string;
    label: string;
    type: string;
    status: "completed" | "running" | "pending" | "error";
    result: unknown;
  };
  const nodeSteps: NodeStep[] = (() => {
    const workflowNodes = exec.workflow.nodes ?? [];
    const results = (exec.nodeResults ?? {}) as Record<string, unknown>;
    // Filter out trigger nodes from display
    const actionNodes = workflowNodes.filter(
      (n) =>
        n.data.type !== "manual" &&
        n.data.type !== "webhook" &&
        n.data.type !== "schedule",
    );
    let foundRunning = false;
    return actionNodes.map((n) => {
      const hasResult = n.id in results;
      let nodeStatus: NodeStep["status"] = "pending";
      if (hasResult) {
        const r = results[n.id] as Record<string, unknown> | undefined;
        nodeStatus =
          r && typeof r === "object" && "error" in r ? "error" : "completed";
      } else if (exec.status === "RUNNING" && !foundRunning) {
        // Only mark the first unexecuted node as "running"; the rest are "pending"
        nodeStatus = "running";
        foundRunning = true;
      }
      return {
        id: n.id,
        label: n.data.label || n.data.type,
        type: n.data.type,
        status: nodeStatus,
        result: results[n.id] ?? null,
      };
    });
  })();

  const status = statusConfig[exec.status as ExecutionStatus];
  const StatusIcon = status.icon;

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Execution Details"
        action={
          <div className="flex items-center gap-2">
            {(exec.status === "ERROR" || exec.status === "CANCELLED") && (
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
                      exec.status === "SUCCESS"
                        ? "bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-fg) border-(--arch-fg)"
                        : exec.status === "ERROR"
                          ? "bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-fg) border-(--arch-fg)"
                          : exec.status === "RUNNING"
                            ? "bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-fg) border-(--arch-fg)"
                            : "bg-[rgba(var(--arch-muted-rgb)/0.1)] text-(--arch-muted) border-(--arch-muted)"
                    }`}
                  >
                    <StatusIcon
                      className={`h-8 w-8 ${exec.status === "RUNNING" ? "animate-spin" : ""}`}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold tracking-tight font-mono uppercase text-(--arch-fg)">
                      {exec.workflow.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-xs text-(--arch-muted) font-mono">
                        STARTED:{" "}
                        <span className="text-(--arch-fg)">
                          {formatDistanceToNow(new Date(exec.startedAt), {
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
                    {exec.id}
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
                    {exec.mode}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 border border-(--arch-border) bg-(--arch-bg)">
                  <span className="text-(--arch-muted) text-xs font-mono uppercase">
                    Started
                  </span>
                  <span className="text-xs font-mono text-(--arch-fg)">
                    {format(new Date(exec.startedAt), "yyyy-MM-dd HH:mm:ss")}
                  </span>
                </div>
                {exec.finishedAt && (
                  <div className="flex justify-between items-center p-3 border border-(--arch-border) bg-(--arch-bg)">
                    <span className="text-(--arch-muted) text-xs font-mono uppercase">
                      Finished
                    </span>
                    <span className="text-xs font-mono text-(--arch-fg)">
                      {format(new Date(exec.finishedAt), "yyyy-MM-dd HH:mm:ss")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center p-3 border border-(--arch-border) bg-(--arch-bg)">
                  <span className="text-(--arch-muted) text-xs font-mono uppercase">
                    Duration
                  </span>
                  <span className="text-xs font-mono text-(--arch-fg)">
                    {formatDurationMs(exec.duration)}
                  </span>
                </div>
                {exec.retryCount > 0 && (
                  <div className="flex justify-between items-center p-3 border border-(--arch-border) bg-(--arch-bg)">
                    <span className="text-(--arch-muted) text-xs font-mono uppercase">
                      Retry Count
                    </span>
                    <Badge
                      variant="outline"
                      className="rounded-none border-(--arch-border) text-(--arch-fg)"
                    >
                      {exec.retryCount}
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
                      {exec.workflow.name}
                    </p>
                    <p className="text-[10px] text-(--arch-muted) mt-1 font-mono">
                      ID: {exec.workflow.id}
                    </p>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="bg-(--arch-fg) text-(--arch-bg) hover:bg-[rgba(var(--arch-fg-rgb)/0.8)] rounded-none font-mono uppercase text-xs h-8"
                  >
                    <Link href={`/workflows/${exec.workflow.id}`}>
                      Open Workflow
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Node Progress */}
          {nodeSteps.length > 0 && (
            <Card className="bg-(--arch-bg) border-(--arch-border) shadow-none rounded-none">
              <CardHeader>
                <CardTitle className="text-sm font-mono uppercase tracking-wider text-(--arch-fg) flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Node Progress
                  <span className="ml-auto text-xs text-(--arch-muted) font-mono">
                    {nodeSteps.filter((s) => s.status === "completed").length}/
                    {nodeSteps.length} COMPLETED
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {nodeSteps.map((step, i) => (
                  <div
                    key={step.id}
                    className={`flex items-start gap-4 px-6 py-4 border-t border-(--arch-border) first:border-t-0 ${
                      step.status === "running"
                        ? "bg-[rgba(var(--arch-fg-rgb)/0.04)]"
                        : ""
                    }`}
                  >
                    {/* Step number / icon */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div
                        className={`h-7 w-7 flex items-center justify-center border font-mono text-xs font-bold ${
                          step.status === "completed"
                            ? "bg-(--arch-fg) text-(--arch-bg) border-(--arch-fg)"
                            : step.status === "error"
                              ? "bg-red-500 text-white border-red-500"
                              : step.status === "running"
                                ? "border-(--arch-fg) text-(--arch-fg)"
                                : "border-(--arch-border) text-(--arch-muted)"
                        }`}
                      >
                        {step.status === "completed" ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : step.status === "error" ? (
                          <AlertCircle className="h-3.5 w-3.5" />
                        ) : step.status === "running" ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <span>{i + 1}</span>
                        )}
                      </div>
                      {i < nodeSteps.length - 1 && (
                        <div
                          className={`w-px h-4 ${
                            step.status === "completed"
                              ? "bg-(--arch-fg)"
                              : "bg-(--arch-border)"
                          }`}
                        />
                      )}
                    </div>
                    {/* Label + status */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm font-mono font-semibold uppercase ${
                            step.status === "pending"
                              ? "text-(--arch-muted)"
                              : "text-(--arch-fg)"
                          }`}
                        >
                          {step.label}
                        </span>
                        <Badge
                          variant="outline"
                          className={`rounded-none text-[10px] font-mono uppercase px-2 py-0 ${
                            step.status === "completed"
                              ? "border-(--arch-fg) text-(--arch-fg)"
                              : step.status === "error"
                                ? "border-red-500 text-red-500"
                                : step.status === "running"
                                  ? "border-(--arch-fg) text-(--arch-fg) animate-pulse"
                                  : "border-(--arch-border) text-(--arch-muted)"
                          }`}
                        >
                          {step.status}
                        </Badge>
                        <span className="text-[10px] font-mono text-(--arch-muted) uppercase">
                          {step.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Input/Output Data */}
          <div className="grid md:grid-cols-2 gap-6">
            {!!exec.inputData && (
              <Card className="bg-(--arch-bg) border-(--arch-border) shadow-none rounded-none h-full">
                <CardHeader>
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-(--arch-fg)">
                    Input Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-(--arch-bg) p-4 border border-(--arch-border) overflow-auto max-h-100">
                    <pre className="text-xs font-mono text-(--arch-fg)">
                      {JSON.stringify(exec.inputData, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {!!exec.outputData && (
              <Card className="bg-(--arch-bg) border-(--arch-border) shadow-none rounded-none h-full">
                <CardHeader>
                  <CardTitle className="text-sm font-mono uppercase tracking-wider text-(--arch-fg)">
                    Output Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-(--arch-bg) p-4 border border-(--arch-border) overflow-auto max-h-100">
                    <pre className="text-xs font-mono text-(--arch-fg)">
                      {JSON.stringify(exec.outputData, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Error Message */}
          {!!exec.error && (
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
                    {typeof exec.error === "string"
                      ? exec.error
                      : JSON.stringify(exec.error, null, 2)}
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
