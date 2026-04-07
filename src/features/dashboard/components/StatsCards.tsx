import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Play, Workflow, Zap, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface StatsCardsProps {
  workflows: any[] | undefined;
  stats: any | undefined;
  workflowsLoading: boolean;
  statsLoading: boolean;
}

export function StatsCards({
  workflows,
  stats,
  workflowsLoading,
  statsLoading,
}: StatsCardsProps) {
  const activeWorkflows = workflows?.filter((w) => w.isActive).length || 0;
  const totalWorkflows = workflows?.length || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-(--arch-bg-secondary) border-(--arch-border) text-(--arch-fg) shadow-none rounded-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-(--arch-muted)">
              <Workflow className="h-4 w-4 text-(--arch-accent)" />
              Total_Flows
            </CardDescription>
          </CardHeader>
          <CardContent>
            {workflowsLoading ? (
              <Skeleton className="h-8 w-20 bg-(--arch-border)" />
            ) : (
              <p className="text-4xl font-bold tracking-tight text-(--arch-fg) font-mono">
                {totalWorkflows}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-(--arch-bg-secondary) border-(--arch-border) text-(--arch-fg) shadow-none rounded-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-(--arch-muted)">
              <Play className="h-4 w-4 text-(--arch-accent)" />
              Active_Flows
            </CardDescription>
          </CardHeader>
          <CardContent>
            {workflowsLoading ? (
              <Skeleton className="h-8 w-20 bg-(--arch-border)" />
            ) : (
              <p className="text-4xl font-bold tracking-tight text-(--arch-fg) font-mono">
                {activeWorkflows}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-(--arch-bg-secondary) border-(--arch-border) text-(--arch-fg) shadow-none rounded-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-(--arch-muted)">
              <Zap className="h-4 w-4 text-(--arch-accent)" />
              Executions_7d
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20 bg-(--arch-border)" />
            ) : (
              <p className="text-4xl font-bold tracking-tight text-(--arch-fg) font-mono">
                {stats?.total || 0}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-(--arch-bg-secondary) border-(--arch-border) text-(--arch-fg) shadow-none rounded-none">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-(--arch-muted)">
              <CheckCircle2 className="h-4 w-4 text-(--arch-accent)" />
              Success_Rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20 bg-(--arch-border)" />
            ) : (
              <div className="flex items-baseline gap-1">
                <p className="text-4xl font-bold tracking-tight text-(--arch-fg) font-mono">
                  {stats?.successRate.toFixed(0) || 0}
                </p>
                <span className="text-lg text-(--arch-muted) font-mono">%</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Execution Stats Logic - Extracted into this component to keep parent clean */}
      {stats && stats.error > 0 && (
        <Card className="border-[rgba(var(--arch-accent-rgb)/0.5)] bg-[rgba(var(--arch-accent-rgb)/0.05)] text-(--arch-fg) rounded-none">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-(--arch-accent) font-mono uppercase tracking-tight">
              <AlertCircle className="h-5 w-5" />
              SYSTEM_ALERT: ERRORS_DETECTED
            </CardTitle>
            <CardDescription className="text-(--arch-muted) font-mono text-xs">
              {stats.error} execution{stats.error !== 1 ? "s" : ""} failed in
              the last 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/executions?status=ERROR"
              className="inline-flex items-center text-xs font-mono uppercase text-(--arch-fg) hover:text-(--arch-accent) hover:underline underline-offset-4"
            >
              VIEW_ERROR_LOGS
              <Play className="h-3 w-3 ml-2" />
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
