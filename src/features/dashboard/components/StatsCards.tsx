"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Play, Workflow, Zap, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion, useAnimation, useInView, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface StatsCardsProps {
  workflows: any[] | undefined;
  stats: any | undefined;
  workflowsLoading: boolean;
  statsLoading: boolean;
}

// Rolling Counter Utility Component
function RollingCounter({ value, duration = 1.5, prefix = "", suffix = "" }: { value: number, duration?: number, prefix?: string, suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  
  useEffect(() => {
    if (!inView || !ref.current) return;
    
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.floor(easeProgress * value)}${suffix}`;
      }
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value, inView, duration, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export function StatsCards({
  workflows,
  stats,
  workflowsLoading,
  statsLoading,
}: StatsCardsProps) {
  const activeWorkflows = workflows?.filter((w) => w.isActive).length || 0;
  const totalWorkflows = workflows?.length || 0;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    },
  };

  return (
    <div className="space-y-6">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Metric 1 */}
        <motion.div variants={itemVariants} className="relative group">
          <div className="glass-panel rounded-[2rem] p-8 h-full flex flex-col justify-between overflow-hidden relative transition-all duration-500 hover:bg-white/[0.03]">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-(--arch-muted) mb-6">
              <Workflow className="h-4 w-4 text-(--arch-accent)" />
              <span>Total_Flows</span>
            </div>
            {workflowsLoading ? (
              <div className="h-10 w-24 bg-white/5 rounded-md animate-pulse" />
            ) : (
              <div className="text-5xl font-light tracking-tighter text-(--arch-fg) font-mono">
                <RollingCounter value={totalWorkflows} />
              </div>
            )}
            {/* Subtle bottom glare */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-(--arch-accent) opacity-[0.05] blur-3xl rounded-full group-hover:opacity-[0.1] transition-opacity duration-700" />
          </div>
        </motion.div>

        {/* Metric 2 */}
        <motion.div variants={itemVariants} className="relative group">
          <div className="glass-panel rounded-[2rem] p-8 h-full flex flex-col justify-between overflow-hidden relative transition-all duration-500 hover:bg-white/[0.03]">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-(--arch-muted) mb-6">
              <Play className="h-4 w-4 text-(--arch-accent)" />
              <span>Active_Flows</span>
            </div>
            {workflowsLoading ? (
              <div className="h-10 w-24 bg-white/5 rounded-md animate-pulse" />
            ) : (
              <div className="text-5xl font-light tracking-tighter text-(--arch-fg) font-mono">
                <RollingCounter value={activeWorkflows} />
              </div>
            )}
          </div>
        </motion.div>

        {/* Metric 3 */}
        <motion.div variants={itemVariants} className="relative group">
          <div className="glass-panel rounded-[2rem] p-8 h-full flex flex-col justify-between overflow-hidden relative transition-all duration-500 hover:bg-white/[0.03]">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-(--arch-muted) mb-6">
              <Zap className="h-4 w-4 text-(--arch-accent)" />
              <span>Executions_7d</span>
            </div>
            {statsLoading ? (
              <div className="h-10 w-24 bg-white/5 rounded-md animate-pulse" />
            ) : (
              <div className="text-5xl font-light tracking-tighter text-(--arch-fg) font-mono">
                <RollingCounter value={stats?.total || 0} />
              </div>
            )}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--chart-3)] opacity-[0.03] blur-3xl rounded-full group-hover:opacity-[0.08] transition-opacity duration-700" />
          </div>
        </motion.div>

        {/* Metric 4 */}
        <motion.div variants={itemVariants} className="relative group lg:col-span-1">
          <div className="glass-panel rounded-[2rem] p-8 h-full flex flex-col justify-between overflow-hidden relative transition-all duration-500 hover:bg-white/[0.03]">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-(--arch-muted) mb-6">
              <CheckCircle2 className="h-4 w-4 text-(--arch-accent)" />
              <span>Success_Rate</span>
            </div>
            {statsLoading ? (
              <div className="h-10 w-32 bg-white/5 rounded-md animate-pulse" />
            ) : (
              <div className="flex items-baseline gap-1 text-5xl font-light tracking-tighter text-(--arch-fg) font-mono">
                <RollingCounter value={stats?.successRate || 0} />
                <span className="text-2xl text-(--arch-muted) font-mono">%</span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Execution Stats Errors Logic - Floating Alert */}
      {stats && stats.error > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="relative mt-6"
        >
          <div className="glass-panel rounded-[1.5rem] p-6 border-[rgba(var(--arch-accent-rgb)/0.3)] bg-[rgba(var(--arch-accent-rgb)/0.02)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm flex items-center gap-2 text-(--arch-accent) font-mono uppercase tracking-tight mb-1">
                <AlertCircle className="h-4 w-4 animate-pulse" />
                SYSTEM_ALERT: ERRORS_DETECTED
              </h3>
              <p className="text-(--arch-muted) font-mono text-xs">
                {stats.error} execution{stats.error !== 1 ? "s" : ""} failed in
                the last 7 days.
              </p>
            </div>
            <Link
              href="/executions?status=ERROR"
              className="inline-flex items-center justify-center rounded-full bg-(--arch-fg) text-[var(--background)] px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-bold hover:bg-white transition-colors duration-300 gap-2 shrink-0"
            >
              INVESTIGATE_LOGS
              <Play className="h-3 w-3" />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
