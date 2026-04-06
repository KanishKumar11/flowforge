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
import { useTRPC, useVanillaClient } from "@/trpc/client";
import { motion, AnimatePresence } from "framer-motion";

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
  PENDING: { icon: Clock, label: "Pending", classes: "text-slate-400 border-slate-400/20 bg-slate-400/10" },
  RUNNING: { icon: Loader2, label: "Running", classes: "text-blue-400 border-blue-400/20 bg-blue-400/10" },
  SUCCESS: { icon: CheckCircle2, label: "Success", classes: "text-emerald-400 border-emerald-400/20 bg-emerald-400/10" },
  ERROR: { icon: AlertCircle, label: "Failed", classes: "text-red-400 border-red-400/20 bg-red-400/10" },
  CANCELLED: { icon: XCircle, label: "Cancelled", classes: "text-zinc-400 border-zinc-400/20 bg-zinc-400/10" },
  WAITING: { icon: Clock, label: "Waiting", classes: "text-amber-400 border-amber-400/20 bg-amber-400/10" },
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

const ExecTableRow = ({
  execution,
  retryExecution,
  deleteExecution,
}: {
  execution: any;
  retryExecution: any;
  deleteExecution: any;
}) => {
  const status = statusConfig[execution.status as ExecutionStatus];
  const StatusIcon = status.icon;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.005 }}
      className="group relative flex items-center justify-between p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-transparent hover:border-white/10 transition-colors rounded-2xl"
    >
      <div className="flex items-center gap-6 relative z-10 w-full pl-2">
        <div className={`p-3 rounded-xl flex items-center justify-center shrink-0 ${status.classes}`}>
          <StatusIcon className={`h-5 w-5 ${execution.status === "RUNNING" ? "animate-spin" : ""}`} />
        </div>
        
        <div className="flex-1 pr-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/workflows/${execution.workflowId}`}
              className="text-lg font-bold font-mono tracking-tight text-white hover:text-(--arch-accent) transition-colors"
            >
              {execution.workflow.name}
            </Link>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase border ${status.classes}`}>
              {status.label}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-2 text-[11px] text-(--arch-muted) font-mono">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {formatDistanceToNow(new Date(execution.startedAt), { addSuffix: true })}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="uppercase">{execution.mode}</span>
            {execution.duration && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{formatDurationMs(execution.duration)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity pr-2 shrink-0">
        {(execution.status === "ERROR" || execution.status === "CANCELLED") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => retryExecution.mutate({ id: execution.id })}
            disabled={retryExecution.isPending}
            className="text-(--arch-fg) hover:bg-(--arch-fg) hover:text-[var(--background)] rounded-full font-mono uppercase text-[10px] h-8 tracking-widest transition-colors"
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
              className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10 rounded-full"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-[rgba(15,17,21,0.95)] backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl"
          >
            <DropdownMenuItem asChild className="rounded-xl focus:bg-white/5 focus:text-white cursor-pointer font-mono text-[10px] uppercase tracking-widest text-white/70">
              <Link href={`/executions/${execution.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-xl mt-1 text-red-400 focus:bg-red-400/10 focus:text-red-400 cursor-pointer font-mono text-[10px] uppercase tracking-widest"
              onClick={() => deleteExecution.mutate({ id: execution.id })}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete Log
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
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
      status: statusFilter !== "all" ? (statusFilter as ExecutionStatus) : undefined,
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
      toast.success("Retry Queued", {
        className: "bg-black border-white/10 text-white font-mono uppercase tracking-wider text-xs",
      });
    },
  });

  const deleteExecution = useMutation({
    mutationFn: (data: { id: string }) => client.executions.delete.mutate(data),
    onSuccess: () => {
      refetch();
      toast.success("Log Erased", {
        className: "bg-black border-white/10 text-white font-mono uppercase tracking-wider text-xs",
      });
    },
  });

  const executions = executionsData?.items || [];
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[var(--background)]">
      <div className="px-8 py-2">
        <DashboardHeader
          title="Executions"
          description="Monitor workflow execution history and dynamic routing performance"
        />
      </div>

      <div className="flex-1 px-8 pb-12 overflow-auto">
        <div className="max-w-[1400px] mx-auto space-y-8">
          
          {/* Glass Stat Grouping */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel p-6 rounded-[2rem] flex items-center gap-5 hover:bg-white/[0.03] transition-colors">
                <div className="p-4 bg-white/5 rounded-2xl shadow-inner border border-white/5">
                  <History className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-light font-mono text-white tracking-tighter">{stats.total}</p>
                  <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest mt-1">Total (7 Days)</p>
                </div>
              </div>
              <div className="glass-panel p-6 rounded-[2rem] flex items-center gap-5 hover:bg-white/[0.03] transition-colors">
                <div className="p-4 bg-emerald-500/10 rounded-2xl shadow-inner border border-emerald-500/20">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-3xl font-light font-mono text-white tracking-tighter">{stats.success}</p>
                  <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest mt-1">Successful</p>
                </div>
              </div>
              <div className="glass-panel p-6 rounded-[2rem] flex items-center gap-5 hover:bg-white/[0.03] transition-colors">
                <div className="p-4 bg-red-500/10 rounded-2xl shadow-inner border border-red-500/20">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <p className="text-3xl font-light font-mono text-white tracking-tighter">{stats.error}</p>
                  <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest mt-1">Failed</p>
                </div>
              </div>
              <div className="glass-panel p-6 rounded-[2rem] flex items-center gap-5 hover:bg-white/[0.03] transition-colors">
                <div className="p-4 bg-blue-500/10 rounded-2xl shadow-inner border border-blue-500/20">
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-light font-mono text-white tracking-tighter">{stats.successRate.toFixed(0)}</p>
                    <span className="text-white/50 font-mono">%</span>
                  </div>
                  <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest mt-1">Success Rate</p>
                </div>
              </div>
            </div>
          )}

          {/* Core Table View */}
          <div className="glass-panel rounded-[2rem] p-4 flex flex-col min-h-[500px]">
            {/* Table Header / Filters */}
            <div className="p-4 flex items-center justify-between border-b border-white/5 mb-4">
              <h3 className="font-mono text-sm tracking-widest uppercase text-white/70">Execution Pipeline</h3>
              <div className="relative">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] bg-white/5 border-white/10 rounded-full h-9 text-[10px] text-white font-mono uppercase tracking-widest focus:ring-0 focus:ring-offset-0 focus:border-white/20 transition-all hover:bg-white/10 shadow-inner">
                    <SelectValue placeholder="STATUS_FILTER" />
                  </SelectTrigger>
                  <SelectContent className="bg-[rgba(15,17,21,0.95)] backdrop-blur-xl border-white/10 rounded-xl shadow-2xl">
                    {["all", "SUCCESS", "ERROR", "RUNNING", "PENDING", "CANCELLED"].map((opt) => (
                      <SelectItem 
                        key={opt}
                        value={opt}
                        className="font-mono text-[10px] uppercase tracking-widest text-white/70 focus:bg-white/5 focus:text-white rounded-lg cursor-pointer my-1"
                      >
                        {opt === "all" ? "All Statuses" : opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading State: Liquid Shimmering rows */}
            <div className="flex-1 relative">
              {isLoading ? (
                <div className="space-y-4 px-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-6 p-4 rounded-2xl bg-white/[0.01]">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
                      <div className="flex-1 space-y-3">
                        <div className="h-5 w-48 rounded bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite_0.1s]" />
                        <div className="h-3 w-64 rounded bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite_0.2s]" />
                      </div>
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite_0.3s]" />
                    </div>
                  ))}
                </div>
              ) : executions.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-12"
                >
                  <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-white/5 border border-white/10 mb-6 shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5" />
                    <History className="w-10 h-10 text-white/30" />
                  </div>
                  <h3 className="text-lg font-bold font-mono uppercase text-white tracking-widest text-center">
                    System Idle
                  </h3>
                  <p className="max-w-md mx-auto mt-2 text-center text-white/50 font-mono text-xs tracking-wide">
                    {statusFilter !== "all"
                      ? `No ${statusFilter} logs found in history matrix.`
                      : "No execution trace details available."}
                  </p>
                  <div className="mt-8">
                    <Button
                      asChild
                      className="rounded-full bg-(--arch-fg) text-[var(--background)] hover:bg-white hover:shadow-[0_0_30px_rgba(var(--arch-accent-rgb)/0.4)] transition-all duration-500 font-mono uppercase text-[10px] tracking-widest px-8 h-10"
                    >
                      <Link href="/workflows">
                        <Play className="w-3.5 w-3.5 mr-2" />
                        Execute Sequence
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-1.5 px-2 pb-4"
                >
                  <AnimatePresence>
                    {executions.map((execution) => (
                      <ExecTableRow
                        key={execution.id}
                        execution={execution}
                        retryExecution={retryExecution}
                        deleteExecution={deleteExecution}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
