"use client";

import { ArrowRight, Clock, Plus, Zap } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

export function QuickActions() {
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
    <div className="glass-panel p-8 rounded-[2rem] flex flex-col h-full relative overflow-hidden group">
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-(--arch-accent) opacity-[0.03] blur-[100px] pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-1000" />
      
      <div className="mb-8 relative z-10">
        <h2 className="text-2xl font-light tracking-tight text-(--arch-fg) uppercase font-mono">
          Quick_Actions
        </h2>
        <p className="font-mono text-xs text-(--arch-muted) mt-1 flex items-center gap-2">
          <Zap className="h-3 w-3" />
          INITIATE_TASKS //
        </p>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4 relative z-10"
      >
        <motion.div variants={itemVariants}>
          <Link href="/workflows" className="block">
            <div className="relative overflow-hidden p-5 rounded-2xl border border-white/5 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(16,185,129,0.05)] hover:border-[rgba(16,185,129,0.2)] transition-all duration-300 group/btn">
              <div className="flex items-center justify-between relative z-10">
                <span className="flex items-center gap-4 font-mono text-sm uppercase tracking-wider text-(--arch-fg)">
                  <div className="p-2 rounded-xl bg-white/5 group-hover/btn:bg-(--arch-fg) group-hover/btn:text-[var(--background)] transition-all duration-300">
                    <Plus className="h-4 w-4" />
                  </div>
                  New_Workflow
                </span>
                <ArrowRight className="h-5 w-5 text-(--arch-muted) group-hover/btn:text-(--arch-fg) group-hover/btn:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link href="/credentials" className="block">
            <div className="relative overflow-hidden p-5 rounded-2xl border border-white/5 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(16,185,129,0.05)] hover:border-[rgba(16,185,129,0.2)] transition-all duration-300 group/btn">
              <div className="flex items-center justify-between relative z-10">
                <span className="flex items-center gap-4 font-mono text-sm uppercase tracking-wider text-(--arch-fg)">
                  <div className="p-2 rounded-xl bg-white/5 group-hover/btn:bg-(--arch-fg) group-hover/btn:text-[var(--background)] transition-all duration-300">
                    <Plus className="h-4 w-4" />
                  </div>
                  Add_Credentials
                </span>
                <ArrowRight className="h-5 w-5 text-(--arch-muted) group-hover/btn:text-(--arch-fg) group-hover/btn:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link href="/executions" className="block">
            <div className="relative overflow-hidden p-5 rounded-2xl border border-white/5 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(16,185,129,0.05)] hover:border-[rgba(16,185,129,0.2)] transition-all duration-300 group/btn">
              <div className="flex items-center justify-between relative z-10">
                <span className="flex items-center gap-4 font-mono text-sm uppercase tracking-wider text-(--arch-fg)">
                  <div className="p-2 rounded-xl bg-white/5 group-hover/btn:bg-[var(--chart-4)] group-hover/btn:text-[var(--background)] transition-all duration-300">
                    <Clock className="h-4 w-4" />
                  </div>
                  Execution_Log
                </span>
                <ArrowRight className="h-5 w-5 text-(--arch-muted) group-hover/btn:text-(--arch-fg) group-hover/btn:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
