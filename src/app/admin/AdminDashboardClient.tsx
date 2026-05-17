"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/features/admin/components/StatsCard";
import {
  Activity,
  AlertCircle,
  Bot,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Users,
  Workflow,
  Zap,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

const STATUS_COLORS: Record<string, string> = {
  healthy: "bg-emerald-500",
  warning: "bg-amber-500",
  degraded: "bg-red-500",
};

function SystemStatusDot({ status }: { status: string }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span
        className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
          STATUS_COLORS[status] ?? "bg-gray-400",
        )}
      />
      <span
        className={cn(
          "relative inline-flex h-2.5 w-2.5 rounded-full",
          STATUS_COLORS[status] ?? "bg-gray-400",
        )}
      />
    </span>
  );
}

export default function AdminDashboardClient() {
  const trpc = useTRPC();

  const { data: overview, isLoading: overviewLoading } = useQuery(
    trpc.admin.analytics.overview.queryOptions(),
  );
  const { data: userGrowth, isLoading: growthLoading } = useQuery(
    trpc.admin.analytics.userGrowth.queryOptions({ days: 30 }),
  );
  const { data: execTrend, isLoading: execLoading } = useQuery(
    trpc.admin.analytics.executionTrend.queryOptions({ days: 30 }),
  );
  const { data: aiTrend, isLoading: aiLoading } = useQuery(
    trpc.admin.analytics.aiUsageTrend.queryOptions({ days: 30 }),
  );
  const { data: recentSignups, isLoading: signupsLoading } = useQuery(
    trpc.admin.analytics.recentSignups.queryOptions({ limit: 5 }),
  );
  const { data: topWorkflows } = useQuery(
    trpc.admin.analytics.topWorkflows.queryOptions({ limit: 5 }),
  );
  const { data: systemStatus } = useQuery(
    trpc.admin.analytics.systemStatus.queryOptions(),
  );
  const { data: supportStats } = useQuery(
    trpc.admin.support.ticketStats.queryOptions(),
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-primary/5 p-5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--primary)/0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Platform overview and real-time metrics
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border/50 bg-background/80 px-3 py-1.5">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-muted-foreground">
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={overview?.users.total ?? 0}
          change={
            overview
              ? (overview.users.newLast7d /
                  Math.max(
                    overview.users.total - overview.users.newLast7d,
                    1,
                  )) *
                100
              : undefined
          }
          icon={Users}
          iconColor="text-blue-600"
          loading={overviewLoading}
          index={0}
        />
        <StatsCard
          title="New (30d)"
          value={overview?.users.newLast30d ?? 0}
          description="New signups this month"
          icon={TrendingUp}
          iconColor="text-emerald-600"
          loading={overviewLoading}
          index={1}
        />
        <StatsCard
          title="Executions (30d)"
          value={overview?.executions.last30d ?? 0}
          description={`${overview?.executions.successRate ?? 0}% success rate`}
          icon={Workflow}
          iconColor="text-violet-600"
          loading={overviewLoading}
          index={2}
        />
        <StatsCard
          title="AI Spend (Total)"
          value={`$${(overview?.ai.totalCostUsd ?? 0).toFixed(2)}`}
          description={`${((overview?.ai.totalTokens ?? 0) / 1_000_000).toFixed(2)}M tokens used`}
          icon={Bot}
          iconColor="text-amber-600"
          loading={overviewLoading}
          index={3}
        />
        <StatsCard
          title="Workflows"
          value={overview?.workflows.total ?? 0}
          description={`${overview?.workflows.active ?? 0} active`}
          icon={Zap}
          iconColor="text-cyan-600"
          loading={overviewLoading}
          index={4}
        />
        <StatsCard
          title="Failed Executions (30d)"
          value={overview?.executions.failed ?? 0}
          icon={AlertCircle}
          iconColor="text-red-600"
          loading={overviewLoading}
          index={5}
        />
        <StatsCard
          title="Teams"
          value={overview?.teams.total ?? 0}
          icon={Users}
          iconColor="text-pink-600"
          loading={overviewLoading}
          index={6}
        />
        <StatsCard
          title="Last 24h Executions"
          value={overview?.executions.last24h ?? 0}
          icon={Activity}
          iconColor="text-indigo-600"
          loading={overviewLoading}
          index={7}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* User Growth */}
        <Card className="col-span-2 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              User Growth (30d)
            </CardTitle>
            <CardDescription className="text-xs">
              Daily new signups
            </CardDescription>
          </CardHeader>
          <CardContent>
            {growthLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={192}>
                <AreaChart data={userGrowth ?? []}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#10b981"
                        stopOpacity={0.25}
                      />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.4}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{
                      fontSize: 10,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => v.slice(5)}
                  />
                  <YAxis
                    tick={{
                      fontSize: 10,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#userGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              System Status
            </CardTitle>
            <CardDescription className="text-xs">
              Last 5 minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemStatus ? (
              <>
                <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                  <div className="flex items-center gap-2.5">
                    <SystemStatusDot status={systemStatus.status} />
                    <span className="text-sm font-medium capitalize">
                      {systemStatus.status}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      systemStatus.status === "healthy"
                        ? "border-emerald-300 text-emerald-700 dark:text-emerald-400"
                        : "border-amber-300 text-amber-700 dark:text-amber-400",
                    )}
                  >
                    {systemStatus.errorRate}% error
                  </Badge>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      label: "Executions",
                      value: systemStatus.recentExecutions,
                      icon: Workflow,
                      color: "text-violet-500",
                    },
                    {
                      label: "Errors",
                      value: systemStatus.recentErrors,
                      icon: AlertCircle,
                      color: "text-red-500",
                    },
                    {
                      label: "AI Failures",
                      value: systemStatus.recentAiFailures,
                      icon: Bot,
                      color: "text-amber-500",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <item.icon className={cn("h-3.5 w-3.5", item.color)} />
                        {item.label}
                      </div>
                      <span className="text-sm font-semibold">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Support tickets quick view */}
                {supportStats && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Support Queue
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          label: "Open",
                          value: supportStats.open,
                          color: "bg-amber-500/15 text-amber-700",
                        },
                        {
                          label: "Critical",
                          value: supportStats.critical,
                          color: "bg-red-500/15 text-red-700",
                        },
                        {
                          label: "In Progress",
                          value: supportStats.inProgress,
                          color: "bg-blue-500/15 text-blue-700",
                        },
                        {
                          label: "Resolved",
                          value: supportStats.resolved,
                          color: "bg-emerald-500/15 text-emerald-700",
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className={cn("rounded-lg p-2 text-center", s.color)}
                        >
                          <p className="text-lg font-bold">{s.value}</p>
                          <p className="text-[10px] font-medium">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Execution trend */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Workflow Executions (30d)
            </CardTitle>
            <CardDescription className="text-xs">
              Success vs failures per day
            </CardDescription>
          </CardHeader>
          <CardContent>
            {execLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={192}>
                <BarChart data={execTrend ?? []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.4}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{
                      fontSize: 10,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => v.slice(5)}
                  />
                  <YAxis
                    tick={{
                      fontSize: 10,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="success"
                    stackId="a"
                    fill="#10b981"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="error"
                    stackId="a"
                    fill="#ef4444"
                    radius={[3, 3, 0, 0]}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* AI Usage trend */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              AI Token Usage (30d)
            </CardTitle>
            <CardDescription className="text-xs">
              Daily token consumption
            </CardDescription>
          </CardHeader>
          <CardContent>
            {aiLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={192}>
                <AreaChart data={aiTrend ?? []}>
                  <defs>
                    <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#8b5cf6"
                        stopOpacity={0.25}
                      />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.4}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{
                      fontSize: 10,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => v.slice(5)}
                  />
                  <YAxis
                    tick={{
                      fontSize: 10,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) =>
                      v >= 1_000_000
                        ? `${(v / 1_000_000).toFixed(1)}M`
                        : v >= 1000
                          ? `${(v / 1000).toFixed(0)}K`
                          : String(v)
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [v.toLocaleString(), "Tokens"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="tokens"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#aiGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Recent Signups + Top Workflows */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent signups */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Recent Signups
            </CardTitle>
          </CardHeader>
          <CardContent>
            {signupsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-3.5 w-32" />
                      <Skeleton className="mt-1 h-3 w-24" />
                    </div>
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {(recentSignups ?? []).map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image ?? undefined} />
                      <AvatarFallback className="text-xs">
                        {user.name?.charAt(0) ??
                          user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium">
                        {user.name ?? "—"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(user.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </motion.div>
                ))}
                {!recentSignups?.length && (
                  <p className="text-sm text-muted-foreground">
                    No recent signups.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Workflows */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Most Executed Workflows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(topWorkflows ?? []).map((wf, i) => (
                <div key={wf.id} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                    {i + 1}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium">{wf.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {wf.user?.email}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {wf._count.executions} runs
                  </Badge>
                </div>
              ))}
              {!topWorkflows?.length && (
                <p className="text-sm text-muted-foreground">
                  No workflow data yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
