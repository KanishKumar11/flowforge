"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { StatsCard } from "@/features/admin/components/StatsCard";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Activity, Bot, TrendingUp, Users, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";

const RANGES = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

function RangePicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (d: number) => void;
}) {
  return (
    <div className="flex gap-1 rounded-lg border bg-muted/30 p-0.5">
      {RANGES.map((r) => (
        <button
          key={r.days}
          onClick={() => onChange(r.days)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
            value === r.days
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

export default function AnalyticsPageClient() {
  const trpc = useTRPC();
  const [days, setDays] = useState(30);

  const { data: overview, isLoading: overviewLoading } = useQuery(
    trpc.admin.analytics.overview.queryOptions(),
  );
  const { data: userGrowth, isLoading: ugLoading } = useQuery(
    trpc.admin.analytics.userGrowth.queryOptions({ days }),
  );
  const { data: execTrend, isLoading: etLoading } = useQuery(
    trpc.admin.analytics.executionTrend.queryOptions({ days }),
  );
  const { data: aiTrend, isLoading: aiLoading } = useQuery(
    trpc.admin.analytics.aiUsageTrend.queryOptions({ days }),
  );

  const chartStyle = {
    contentStyle: {
      background: "hsl(var(--card))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "8px",
      fontSize: 12,
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">Platform-wide usage metrics</p>
        </div>
        <RangePicker value={days} onChange={setDays} />
      </div>

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={overview?.users.total ?? 0}
          icon={Users}
          iconColor="text-blue-600"
          loading={overviewLoading}
          index={0}
        />
        <StatsCard
          title="Total Workflows"
          value={overview?.workflows.total ?? 0}
          icon={Workflow}
          iconColor="text-violet-600"
          loading={overviewLoading}
          index={1}
        />
        <StatsCard
          title={`Executions (${days}d)`}
          value={overview?.executions.last30d ?? 0}
          description={`${overview?.executions.successRate ?? 0}% success`}
          icon={Activity}
          iconColor="text-emerald-600"
          loading={overviewLoading}
          index={2}
        />
        <StatsCard
          title="AI Total Cost"
          value={`$${(overview?.ai.totalCostUsd ?? 0).toFixed(2)}`}
          icon={Bot}
          iconColor="text-amber-600"
          loading={overviewLoading}
          index={3}
        />
      </div>

      {/* User growth */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">User Growth</CardTitle>
          <CardDescription className="text-xs">Daily new registrations over {days} days</CardDescription>
        </CardHeader>
        <CardContent>
          {ugLoading ? <Skeleton className="h-64 w-full" /> : (
            <ResponsiveContainer width="100%" height={256}>
              <AreaChart data={userGrowth ?? []}>
                <defs>
                  <linearGradient id="ug" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip {...chartStyle} />
                <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} fill="url(#ug)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Executions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Execution Trend</CardTitle>
            <CardDescription className="text-xs">Success vs failures</CardDescription>
          </CardHeader>
          <CardContent>
            {etLoading ? <Skeleton className="h-52 w-full" /> : (
              <ResponsiveContainer width="100%" height={208}>
                <BarChart data={execTrend ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <Tooltip {...chartStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="success" stackId="a" fill="#10b981" />
                  <Bar dataKey="error" stackId="a" fill="#ef4444" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* AI spend */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">AI Spend ($)</CardTitle>
            <CardDescription className="text-xs">Daily AI cost in USD</CardDescription>
          </CardHeader>
          <CardContent>
            {aiLoading ? <Skeleton className="h-52 w-full" /> : (
              <ResponsiveContainer width="100%" height={208}>
                <AreaChart data={aiTrend ?? []}>
                  <defs>
                    <linearGradient id="ais" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v.toFixed(2)}`} />
                  <Tooltip {...chartStyle} formatter={(v: number) => [`$${v.toFixed(4)}`, "Cost"]} />
                  <Area type="monotone" dataKey="cost" stroke="#f59e0b" strokeWidth={2} fill="url(#ais)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
