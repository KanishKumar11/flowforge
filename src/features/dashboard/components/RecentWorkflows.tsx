"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, Workflow, Activity } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

interface RecentWorkflowsProps {
  workflows: any[] | undefined;
  isLoading: boolean;
}

export function RecentWorkflows({
  workflows,
  isLoading,
}: RecentWorkflowsProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    },
  };

  return (
    <div className="glass-panel p-8 rounded-[2rem] flex flex-col h-full relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--sidebar-primary)] opacity-5 blur-[100px] pointer-events-none group-hover:opacity-10 transition-opacity duration-1000" />
      
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div>
          <h2 className="text-2xl font-light tracking-tight text-(--arch-fg) uppercase font-mono">
            Recent_Workflows
          </h2>
          <p className="font-mono text-xs text-(--arch-muted) mt-1 flex items-center gap-2">
            <Activity className="h-3 w-3 animate-pulse" />
            LATEST_ACTIVITY //
          </p>
        </div>
      </div>

      <div className="flex-1 relative z-10">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-2xl">
                <div className="h-10 w-10 bg-white/5 rounded-xl animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-1/4 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : workflows && workflows.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {workflows.slice(0, 5).map((workflow) => (
              <motion.div key={workflow.id} variants={itemVariants}>
                <Link
                  href={`/workflows/${workflow.id}`}
                  className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.06)] border border-transparent hover:border-white/10 rounded-2xl transition-all duration-300 group/item"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl transition-all duration-500 ${workflow.isActive
                        ? "bg-[rgba(var(--arch-accent-rgb)/0.15)] text-(--arch-accent) shadow-[0_0_15px_rgba(var(--arch-accent-rgb)/0.2)]"
                        : "bg-[rgba(255,255,255,0.05)] text-(--arch-muted)"
                        }`}
                    >
                      <Workflow className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-medium text-(--arch-fg) tracking-tight">
                        {workflow.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full ${workflow.isActive
                            ? "bg-[rgba(var(--arch-accent-rgb)/0.1)] text-(--arch-accent)"
                            : "bg-white/5 text-(--arch-muted)"
                            }`}
                        >
                          {workflow.isActive ? "ACTIVE" : "DRAFT"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 -translate-x-4 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300">
                    <ArrowRight className="h-4 w-4 text-(--arch-fg)" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-12">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="w-20 h-20 rounded-3xl bg-[rgba(255,255,255,0.02)] border border-white/5 flex items-center justify-center mb-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5" />
              <Workflow className="h-8 w-8 text-(--arch-muted)" />
            </motion.div>
            <p className="text-(--arch-muted) font-mono text-sm mb-6 uppercase tracking-widest">
              No Workflows Found
            </p>
            <Button
              size="lg"
              asChild
              className="rounded-full bg-(--arch-fg) text-[var(--background)] hover:bg-white text-xs font-mono uppercase tracking-widest border border-transparent shadow-[0_0_20px_rgba(var(--arch-accent-rgb)/0.2)] hover:shadow-[0_0_30px_rgba(var(--arch-accent-rgb)/0.4)] transition-all duration-500"
            >
              <Link href="/workflows">Initialize First Flow</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
