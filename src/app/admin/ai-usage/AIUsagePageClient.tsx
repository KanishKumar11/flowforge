// @ts-nocheck
"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { StatsCard } from "@/features/admin/components/StatsCard";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, Bot, DollarSign, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const RANGE_OPTIONS = [7, 30, 90];

export default function AIUsagePageClient() {
  const trpc = useTRPC();
  const [days, setDays] = useState(30);

  const { data: overview, isLoading: ovLoading } = useQuery(
    trpc.admin.aiUsage.overview.queryOptions(),
  );
  const { data: trend, isLoading: trendLoading } = useQuery(
    trpc.admin.aiUsage.trend.queryOptions({ days }),
  );
  const { data: topUsers, isLoading: topLoading } = useQuery(
    trpc.admin.aiUsage.topUsers.queryOptions({ limit: 10 }),
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
      <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card px-5 py-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">AI Usage</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Monitor AI token consumption and cost</p>
        </div>
        <div className="flex gap-1 rounded-lg border bg-muted/30 p-0.5">
          {RANGE_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                days === d ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Tokens"
          value={`${((overview?.aggregate.totalTokens ?? 0) / 1_000_000).toFixed(2)}M`}
          icon={Bot}
          iconColor="text-violet-600"
          loading={ovLoading}
          index={0}
        />
        <StatsCard
          title="Total Cost"
          value={`$${(overview?.aggregate.totalCost ?? 0).toFixed(2)}`}
          icon={DollarSign}
          iconColor="text-emerald-600"
          loading={ovLoading}
          index={1}
        />
        <StatsCard
          title="Total Requests"
          value={overview?.aggregate.totalRequests ?? 0}
          icon={TrendingUp}
          iconColor="text-blue-600"
          loading={ovLoading}
          index={2}
        />
        <StatsCard
          title="Failures"
          value={overview?.aggregate.failedRequests ?? 0}
          icon={AlertCircle}
          iconColor="text-red-600"
          loading={ovLoading}
          index={3}
        />
      </div>

      {/* Provider breakdown + model breakdown */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">By Provider</CardTitle>
          </CardHeader>
          <CardContent>
            {ovLoading ? <Skeleton className="h-52 w-full" /> : (
              <ResponsiveContainer width="100%" height={208}>
                <PieChart>
                  <Pie
                    data={overview?.byProvider ?? []}
                    dataKey="tokens"
                    nameKey="provider"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ provider, percent }) => `${provider} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {(overview?.byProvider ?? []).map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...chartStyle} formatter={(v: number) => [v.toLocaleString(), "Tokens"]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">By Model (cost)</CardTitle>
          </CardHeader>
          <CardContent>
            {ovLoading ? <Skeleton className="h-52 w-full" /> : (
              <ResponsiveContainer width="100%" height={208}>
                <BarChart
                  data={overview?.byModel.slice(0, 8) ?? []}
                  layout="vertical"
                >
                  <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v.toFixed(2)}`} />
                  <YAxis type="category" dataKey="model" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={120} />
                  <Tooltip {...chartStyle} formatter={(v: number) => [`$${v.toFixed(4)}`, "Cost"]} />
                  <Bar dataKey="cost" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Token trend */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Daily Token Usage ({days}d)</CardTitle>
        </CardHeader>
        <CardContent>
          {trendLoading ? <Skeleton className="h-56 w-full" /> : (
            <ResponsiveContainer width="100%" height={224}>
              <AreaChart data={trend ?? []}>
                <defs>
                  <linearGradient id="at" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : `${(v / 1000).toFixed(0)}K`} />
                <Tooltip {...chartStyle} formatter={(v: number) => [v.toLocaleString(), "Tokens"]} />
                <Area type="monotone" dataKey="tokens" stroke="#8b5cf6" strokeWidth={2} fill="url(#at)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Top users */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Top Token Consumers</CardTitle>
        </CardHeader>
        <CardContent>
          {topLoading ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : (
            <div className="space-y-2">
              {(topUsers ?? []).map((u, i) => (
                <div key={u.userId ?? i} className="flex items-center justify-between rounded-lg bg-muted/30 p-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-muted text-xs font-semibold text-muted-foreground">
                      {i + 1}
                    </span>
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={u.user?.image ?? undefined} />
                      <AvatarFallback className="text-xs">
                        {(u.user?.name ?? u.user?.email ?? "?").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{u.user?.name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{u.user?.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">
                      {((u.totalTokens ?? 0) / 1000).toFixed(1)}K tokens
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${(u.totalCost ?? 0).toFixed(3)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent failures */}
      {overview?.recentFailures && overview.recentFailures.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-red-600">Recent AI Failures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overview.recentFailures.map((f, i) => (
                <div key={i} className="rounded-lg bg-red-50 p-2.5 text-sm dark:bg-red-950/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                      <span className="font-semibold capitalize">{f.provider}</span>
                      <Badge variant="outline" className="text-[10px]">{f.model}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(f.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  {f.error && (
                    <p className="mt-1 text-xs text-red-600 line-clamp-1">{f.error}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
