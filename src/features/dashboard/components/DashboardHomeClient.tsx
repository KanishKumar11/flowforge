"use client";

import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { StatsCards } from "./StatsCards";
import { QuickActions } from "./QuickActions";
import { RecentWorkflows } from "./RecentWorkflows";

export function DashboardHomeClient() {
  const trpc = useTRPC();

  const { data: workflows, isLoading: workflowsLoading } = useQuery(
    trpc.workflows.list.queryOptions(),
  );

  const { data: stats, isLoading: statsLoading } = useQuery(
    trpc.executions.stats.queryOptions({ days: 7 }),
  );

  return (
    <div className="flex flex-col h-full space-y-8 animate-fadeIn bg-(--arch-bg) text-(--arch-fg)">
      <DashboardHeader
        title={
          <span className="font-heading uppercase tracking-tight text-(--arch-fg) text-3xl">
            SYS.DASHBOARD
          </span>
        }
        description={
          <span className="font-mono text-xs text-(--arch-muted) tracking-widest">
            // SYSTEM_OVERVIEW_MODE: ACTIVE
          </span>
        }
        action={
          <Button
            asChild
            className="gap-2 rounded-none bg-(--arch-fg) text-(--arch-bg) hover:bg-(--arch-muted) hover:text-white transition-all font-mono text-xs uppercase tracking-wider h-10 px-6"
          >
            <Link href="/workflows">
              <Plus className="h-4 w-4" />
              NEW_FLOW
            </Link>
          </Button>
        }
      />

      <div className="flex-1 p-6 overflow-auto space-y-8">
        {/* Metric Cards - Abstracted */}
        <StatsCards
          workflows={workflows}
          stats={stats}
          workflowsLoading={workflowsLoading}
          statsLoading={statsLoading}
        />

        {/* Quick Actions & Recent - Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          <QuickActions />
          <RecentWorkflows workflows={workflows} isLoading={workflowsLoading} />
        </div>
      </div>
    </div>
  );
}
