"use client";

import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Play,
  Plus,
  Workflow,
  Zap,
} from "lucide-react";
import Link from "next/link";

export function DashboardHomeClient() {
  const trpc = useTRPC();

  const { data: workflows, isLoading: workflowsLoading } = useQuery(
    trpc.workflows.list.queryOptions()
  );

  const { data: stats, isLoading: statsLoading } = useQuery(
    trpc.executions.stats.queryOptions({ days: 7 })
  );

  const activeWorkflows = workflows?.filter((w) => w.isActive).length || 0;
  const totalWorkflows = workflows?.length || 0;

  return (
    <div className="flex flex-col h-full space-y-8 animate-fadeIn">
      <DashboardHeader
        title={<span className="gradient-text">Dashboard</span>}
        description="Welcome back! Here's an overview of your automation empire."
        action={
          <Button asChild className="gap-2 shadow-lg hover:shadow-primary/25 transition-all">
            <Link href="/workflows">
              <Plus className="h-4 w-4" />
              New Workflow
            </Link>
          </Button>
        }
      />

      <div className="flex-1 p-6 overflow-auto space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-subtle border-primary/20 hover-lift">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 font-medium">
                <Workflow className="h-4 w-4 text-primary" />
                Total Workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              {workflowsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <p className="text-4xl font-bold tracking-tight">{totalWorkflows}</p>
              )}
            </CardContent>
          </Card>

          <Card className="glass-subtle border-emerald-500/20 hover-lift">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                <Play className="h-4 w-4" />
                Active Workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              {workflowsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <p className="text-4xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                  {activeWorkflows}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="glass-subtle border-blue-500/20 hover-lift">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400">
                <Zap className="h-4 w-4" />
                Executions (7d)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <p className="text-4xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                  {stats?.total || 0}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="glass-subtle border-amber-500/20 hover-lift">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 font-medium text-amber-600 dark:text-amber-400">
                <CheckCircle2 className="h-4 w-4" />
                Success Rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="flex items-baseline gap-1">
                  <p className="text-4xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                    {stats?.successRate.toFixed(0) || 0}
                  </p>
                  <span className="text-lg text-amber-600/80">%</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card className="glass card-interactive">
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
              <CardDescription>Common tasks to jumpstart your productivity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-between h-12 hover:border-primary/50 group" asChild>
                <Link href="/workflows">
                  <span className="flex items-center gap-3">
                    <div className="p-1 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Plus className="h-4 w-4" />
                    </div>
                    Create new workflow
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between h-12 hover:border-primary/50 group" asChild>
                <Link href="/credentials">
                  <span className="flex items-center gap-3">
                    <div className="p-1 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Plus className="h-4 w-4" />
                    </div>
                    Add credentials
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between h-12 hover:border-primary/50 group" asChild>
                <Link href="/executions">
                  <span className="flex items-center gap-3">
                    <div className="p-1 rounded-md bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <Clock className="h-4 w-4" />
                    </div>
                    View execution history
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Workflows */}
          <Card className="glass card-interactive">
            <CardHeader>
              <CardTitle className="text-xl">Recent Workflows</CardTitle>
              <CardDescription>Your latest automation activity</CardDescription>
            </CardHeader>
            <CardContent>
              {workflowsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : workflows && workflows.length > 0 ? (
                <div className="space-y-2">
                  {workflows.slice(0, 5).map((workflow) => (
                    <Link
                      key={workflow.id}
                      href={`/workflows/${workflow.id}`}
                      className="flex items-center justify-between p-3 -mx-2 rounded-xl hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl transition-colors ${workflow.isActive
                            ? "bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white"
                            : "bg-muted text-muted-foreground group-hover:bg-foreground/10"
                          }`}>
                          <Workflow className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{workflow.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] uppercase font-bold tracking-wider ${workflow.isActive ? "text-emerald-500" : "text-muted-foreground"
                              }`}>
                              {workflow.isActive ? "Active" : "Draft"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-primary/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Workflow className="h-8 w-8 text-primary/50" />
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">No workflows yet</p>
                  <Button size="sm" asChild>
                    <Link href="/workflows">Create your first workflow</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Execution Stats */}
        {stats && stats.error > 0 && (
          <Card className="mt-6 border-red-500/20 bg-red-500/5 hover-lift">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                Attention Required
              </CardTitle>
              <CardDescription className="text-red-600/80 dark:text-red-400/80">
                {stats.error} execution{stats.error !== 1 ? 's' : ''} failed in the last 7 days. Check the logs to resolve issues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="border-red-500/20 hover:bg-red-500/10 hover:text-red-600 text-red-600" asChild>
                <Link href="/executions?status=ERROR">
                  View Failed Executions
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
