"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number; // percentage change, positive = growth
  changeLabel?: string; // e.g. "vs last 30 days"
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
  loading?: boolean;
  className?: string;
  index?: number;
}

const ICON_BG_MAP: Record<string, string> = {
  "text-blue-600": "bg-blue-50 dark:bg-blue-950/60",
  "text-violet-600": "bg-violet-50 dark:bg-violet-950/60",
  "text-emerald-600": "bg-emerald-50 dark:bg-emerald-950/60",
  "text-red-600": "bg-red-50 dark:bg-red-950/60",
  "text-amber-600": "bg-amber-50 dark:bg-amber-950/60",
  "text-cyan-600": "bg-cyan-50 dark:bg-cyan-950/60",
  "text-pink-600": "bg-pink-50 dark:bg-pink-950/60",
  "text-indigo-600": "bg-indigo-50 dark:bg-indigo-950/60",
  "text-orange-600": "bg-orange-50 dark:bg-orange-950/60",
};

export function StatsCard({
  title,
  value,
  change,
  changeLabel = "vs last period",
  icon: Icon,
  iconColor = "text-primary",
  description,
  loading = false,
  className,
  index = 0,
}: StatsCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const iconBg = ICON_BG_MAP[iconColor] ?? "bg-muted/60";

  if (loading) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border/50 bg-card p-5",
          className,
        )}
      >
        <div className="flex items-start justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
        <Skeleton className="mt-3 h-8 w-32" />
        <Skeleton className="mt-2 h-4 w-20" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-border",
        className,
      )}
    >
      {/* Subtle gradient glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-primary/3 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            iconBg,
            iconColor,
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="relative mt-3">
        <p className="text-2xl font-bold tracking-tight">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>

        {change !== undefined && (
          <div className="mt-1.5 flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
            )}
            <span
              className={cn(
                "text-xs font-semibold",
                isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400",
              )}
            >
              {isPositive ? "+" : ""}
              {change.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">{changeLabel}</span>
          </div>
        )}

        {description && !change && (
          <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
