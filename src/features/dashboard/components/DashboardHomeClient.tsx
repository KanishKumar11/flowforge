"use client";

import { DashboardHeader } from "@/components/DashboardHeader";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { StatsCards } from "./StatsCards";
import { QuickActions } from "./QuickActions";
import { RecentWorkflows } from "./RecentWorkflows";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

// Magnetic Button Component for Platinum Standard
function MagneticButton({ children, href }: { children: React.ReactNode, href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Magnetic pull distance (e.g. 20px)
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div style={{ x: mouseXSpring, y: mouseYSpring }}>
      <Link 
        ref={ref}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative inline-flex items-center justify-center gap-2 rounded-full bg-(--arch-fg) text-[var(--background)] hover:bg-white transition-all font-mono text-xs uppercase tracking-wider h-11 px-8 border border-transparent shadow-[0_0_20px_rgba(var(--arch-accent-rgb)/0.2)] hover:shadow-[0_0_30px_rgba(var(--arch-accent-rgb)/0.4)] overflow-hidden group"
      >
        <span className="relative z-10 flex items-center gap-2 font-bold font-mono">
          <Plus className="h-4 w-4" />
          NEW_FLOW
        </span>
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
      </Link>
    </motion.div>
  );
}

export function DashboardHomeClient() {
  const trpc = useTRPC();

  const { data: workflows, isLoading: workflowsLoading } = useQuery(
    trpc.workflows.list.queryOptions(),
  );

  const { data: stats, isLoading: statsLoading } = useQuery(
    trpc.executions.stats.queryOptions({ days: 7 }),
  );

  return (
    <div className="flex flex-col h-full bg-[var(--background)] text-(--arch-fg) min-h-[100dvh]">
      <div className="px-8 py-2">
        <DashboardHeader
          title="SYS.DASHBOARD"
          description="// SYSTEM_OVERVIEW_MODE: ACTIVE"
          action={
            <MagneticButton href="/workflows">
              NEW_FLOW
            </MagneticButton>
          }
        />
      </div>

      <div className="flex-1 px-8 pb-12 pt-4 overflow-x-hidden space-y-10 max-w-[1600px] w-full mx-auto">
        {/* Metric Cards - 4 Column Top Bento */}
        <StatsCards
          workflows={workflows}
          stats={stats}
          workflowsLoading={workflowsLoading}
          statsLoading={statsLoading}
        />

        {/* Asymmetrical Split Bottom Bento */}
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 h-[500px]">
             <QuickActions />
          </div>
          <div className="lg:col-span-7 h-[500px]">
             <RecentWorkflows workflows={workflows} isLoading={workflowsLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
