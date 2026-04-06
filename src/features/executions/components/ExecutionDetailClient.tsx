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
  Hash,
  Activity,
  Play
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { useTRPC, useVanillaClient } from "@/trpc/client";
import { motion, Variants } from "framer-motion";

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
    glow: string;
  }
> = {
  PENDING: {
    icon: Clock,
    label: "Pending",
    classes: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    glow: "bg-blue-500"
  },
  RUNNING: {
    icon: Loader2,
    label: "Running",
    classes: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    glow: "bg-amber-500"
  },
  SUCCESS: {
    icon: CheckCircle2,
    label: "Success",
    classes: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    glow: "bg-emerald-500"
  },
  ERROR: {
    icon: AlertCircle,
    label: "Failed",
    classes: "text-red-400 bg-red-500/10 border-red-500/20",
    glow: "bg-red-500"
  },
  CANCELLED: {
    icon: XCircle,
    label: "Cancelled",
    classes: "text-white/40 bg-white/5 border-white/10",
    glow: "bg-white"
  },
  WAITING: {
    icon: Clock,
    label: "Waiting",
    classes: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    glow: "bg-teal-500"
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
      toast.success("Retry Queued", {
        className: "bg-black border-emerald-500/20 text-emerald-400 font-mono tracking-wide text-xs uppercase",
      });
      router.push("/executions");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to retry execution");
    },
  });

  const deleteExecution = useMutation({
    mutationFn: (data: { id: string }) => client.executions.delete.mutate(data),
    onSuccess: () => {
      toast.success("Trace Terminated", {
        className: "bg-black border-red-500/20 text-red-500 font-mono tracking-wide text-xs uppercase",
      });
      router.push("/executions");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete execution");
    },
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-[100dvh] bg-[var(--background)]">
        <div className="px-8 py-2">
            <DashboardHeader title="Trace Inspection" />
        </div>
        <div className="flex-1 px-8 pb-12 overflow-auto">
            <div className="max-w-[1400px] mx-auto space-y-6">
                <div className="h-10 w-48 rounded bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
                <div className="glass-panel h-[150px] rounded-[2rem] w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-panel h-[300px] rounded-[2rem] w-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite_0.1s]" />
                    </div>
                    <div className="glass-panel h-[300px] rounded-[2rem] w-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite_0.2s]" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  if (!execution) {
    return (
      <div className="flex flex-col h-[100dvh] bg-[var(--background)]">
        <div className="px-8 py-2">
            <DashboardHeader title="Trace Inspection" />
        </div>
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
            <div className="p-4 bg-white/5 rounded-full mb-4 border border-white/10 shadow-inner">
              <Activity className="h-8 w-8 text-white/30" />
            </div>
            <p className="font-mono text-white uppercase text-base tracking-widest font-bold">Signal Lost</p>
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest mt-2 max-w-[250px] text-center mb-8">
              Execution trace was dropped from the matrix or purged.
            </p>
            <Button asChild className="rounded-full bg-(--arch-fg) text-[var(--background)] hover:bg-white h-11 px-8 font-mono text-[10px] uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(var(--arch-accent-rgb)/0.2)] hover:shadow-[0_0_30px_rgba(var(--arch-accent-rgb)/0.4)] transition-all">
                <Link href="/executions">Return to Index</Link>
            </Button>
        </div>
      </div>
    );
  }

  const status = statusConfig[execution.status as ExecutionStatus];
  const StatusIcon = status.icon;

  // Cast execution as any to prevent TS infinite recursion on deep Prisma.JSON types in JSX
  const payload: any = execution;

  return (
    <div className="flex flex-col h-[100dvh] bg-[var(--background)]">
      <div className="px-8 py-2">
      <DashboardHeader
        title="Trace Inspection"
        action={
          <div className="flex items-center gap-3">
            {(execution.status === "ERROR" || execution.status === "CANCELLED") && (
              <Button
                variant="outline"
                className="rounded-full bg-transparent border-white/10 text-white/70 hover:bg-white/5 hover:text-white font-mono uppercase text-[10px] tracking-widest transition-all h-10 px-6 gap-2"
                onClick={() => retryExecution.mutate({ id: executionId })}
                disabled={retryExecution.isPending}
              >
                {retryExecution.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Retry Trace
              </Button>
            )}
            <Button
              className="rounded-full bg-transparent border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-400 font-mono uppercase text-[10px] tracking-widest transition-all h-10 px-6 gap-2 shadow-inner"
              onClick={() => deleteExecution.mutate({ id: executionId })}
              disabled={deleteExecution.isPending}
            >
              {deleteExecution.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Purge
            </Button>
          </div>
        }
      />
      </div>

      <div className="flex-1 px-8 pb-12 overflow-auto">
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-[1400px] mx-auto space-y-6"
        >
          {/* Back Navigation */}
          <motion.div variants={itemVariants}>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-white/40 hover:text-emerald-400 hover:bg-white/5 rounded-full px-4 h-9 font-mono uppercase tracking-widest text-[10px] transition-colors mb-2"
              >
                <Link href="/executions" className="flex items-center gap-2">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Index
                </Link>
              </Button>
          </motion.div>

          {/* Core Overview Bento Block */}
          <motion.div variants={itemVariants} className="glass-panel rounded-[2rem] p-8 relative overflow-hidden group">
            {/* Ambient State Glow */}
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${status.glow} opacity-[0.02] blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:opacity-[0.04] transition-all duration-1000`} />
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 w-full">
                <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-2xl border shadow-inner ${status.classes}`}>
                      <StatusIcon className={`h-8 w-8 ${execution.status === "RUNNING" ? "animate-spin" : ""}`} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tighter font-mono uppercase text-white bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                      {execution.workflow.name}
                    </h2>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-white/40 font-mono tracking-widest uppercase">
                      <span>
                        INIT: <span className="text-white/70 ml-1">{formatDistanceToNow(new Date(execution.startedAt), { addSuffix: true })}</span>
                      </span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span>{execution.mode}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 border border-white/5 bg-white/[0.02] rounded-full p-1.5 pl-5 pr-2">
                   <span className="text-[10px] font-mono tracking-widest uppercase text-white/50">{status.label}</span>
                   <span className={`w-3 h-3 rounded-full ${status.glow} shadow-[0_0_15px_currentColor] ${execution.status === 'RUNNING' ? 'animate-pulse' : ''}`} />
                </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Telemetry Block */}
            <motion.div variants={itemVariants} className="glass-panel p-8 rounded-[2rem] h-full flex flex-col">
              <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                 <Hash className="w-4 h-4" /> Trace Telemetry
              </h3>
              
              <div className="space-y-4 flex-1">
                {[
                  { label: "Execution ID", value: <code className="text-white bg-white/5 px-2 py-1 rounded border border-white/10 break-all">{execution.id}</code> },
                  { label: "Trigger Mode", value: <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">{execution.mode}</span> },
                  { label: "Start Vector", value: <span className="text-white/80">{format(new Date(execution.startedAt), "yyyy-MM-dd HH:mm:ss.SSS")}</span> },
                  ...(execution.finishedAt ? [{ label: "End Vector", value: <span className="text-white/80">{format(new Date(execution.finishedAt), "yyyy-MM-dd HH:mm:ss.SSS")}</span> }] : []),
                  { label: "Compute Time", value: <span className="text-white/80">{formatDurationMs(execution.duration)}</span> },
                  ...(execution.retryCount > 0 ? [{ label: "Retry Cycles", value: <span className="text-amber-400">{execution.retryCount}</span> }] : []),
                ].map((item, idx) => (
                   <div key={idx} className="flex justify-between items-center p-3 rounded-xl hover:bg-white/[0.02] border border-transparent transition-colors">
                      <span className="text-white/40 text-[9px] font-mono uppercase tracking-widest">{item.label}</span>
                      <div className="text-[10px] font-mono uppercase tracking-widest">{item.value}</div>
                   </div>
                ))}
              </div>
            </motion.div>

            {/* Context/Matrix Block */}
            <motion.div variants={itemVariants} className="glass-panel p-8 rounded-[2rem] h-full flex flex-col">
               <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                 <ExternalLink className="w-4 h-4" /> Operational Context
              </h3>

              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white/[0.02] border border-white/5 rounded-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 
                 <Activity className="h-12 w-12 text-white/20 mb-6 group-hover:text-emerald-400 transition-colors duration-500 relative z-10" />
                 <p className="font-mono text-white text-lg font-bold uppercase tracking-widest text-center relative z-10 mb-2">
                    {execution.workflow.name}
                 </p>
                 <code className="text-[10px] text-white/30 font-mono bg-black px-3 py-1 rounded-full border border-white/10 relative z-10 mb-8 break-all text-center max-w-full">
                    ID: {execution.workflow.id}
                 </code>

                 <Button
                    asChild
                    className="rounded-full bg-(--arch-fg) text-[var(--background)] hover:bg-white h-11 px-8 font-mono text-[10px] uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(var(--arch-accent-rgb)/0.2)] hover:shadow-[0_0_30px_rgba(var(--arch-accent-rgb)/0.4)] transition-all relative z-10"
                  >
                    <Link href={`/workflows/${execution.workflow.id}`}>
                      Access Blueprint <ExternalLink className="h-3.5 w-3.5 ml-2" />
                    </Link>
                  </Button>
              </div>
            </motion.div>
          </div>

          {/* I/O Blocks */}
          {(payload.inputData || payload.outputData) && (
            <div className="grid lg:grid-cols-2 gap-6">
              {payload.inputData && (
                <motion.div variants={itemVariants} className="glass-panel overflow-hidden rounded-[2rem] flex flex-col border-white/5 group relative">
                   <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-white/70 flex items-center gap-3">
                         <span className="w-2 h-2 rounded-full bg-white/20" /> Input Payload
                      </h3>
                   </div>
                   <div className="p-6 bg-[#0c0d10] flex-1 overflow-auto max-h-[500px]">
                     <pre className="text-[10px] font-mono text-white/80 leading-relaxed whitespace-pre-wrap break-all">
                        {JSON.stringify(payload.inputData, null, 2)}
                     </pre>
                   </div>
                </motion.div>
              )}
              
              {payload.outputData && (
                <motion.div variants={itemVariants} className="glass-panel overflow-hidden rounded-[2rem] flex flex-col border-white/5 group relative">
                   <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-3">
                         <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> Output Result
                      </h3>
                   </div>
                   <div className="p-6 bg-[#0c0d10] flex-1 overflow-auto max-h-[500px]">
                     <pre className="text-[10px] font-mono text-emerald-400/80 leading-relaxed whitespace-pre-wrap break-all">
                        {JSON.stringify(payload.outputData, null, 2)}
                     </pre>
                   </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Fatal Error Block */}
          {payload.error && (
             <motion.div variants={itemVariants} className="glass-panel overflow-hidden rounded-[2rem] flex flex-col border-red-500/20 bg-red-500/[0.02]">
                <div className="p-6 border-b border-red-500/10 bg-red-500/[0.02]">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-red-500 flex items-center gap-3 font-bold">
                        <AlertCircle className="h-4 w-4" /> Fatal Stack Trace
                    </h3>
                </div>
                <div className="p-6 bg-[#0f0505] overflow-auto max-h-[500px]">
                    <pre className="text-xs font-mono text-red-400 leading-relaxed whitespace-pre-wrap break-all selection:bg-red-500/30">
                        {typeof payload.error === "string"
                        ? payload.error
                        : JSON.stringify(payload.error, null, 2)}
                    </pre>
                </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
