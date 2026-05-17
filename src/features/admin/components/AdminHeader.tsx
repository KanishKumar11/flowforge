"use client";

import { cn } from "@/lib/utils";
import {
  Bell,
  ChevronRight,
  Command,
  ExternalLink,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/features/admin/components/ThemeToggle";

interface Breadcrumb {
  label: string;
  href?: string;
}

function buildBreadcrumbs(pathname: string): Breadcrumb[] {
  const segments = pathname.replace("/admin", "").split("/").filter(Boolean);
  const crumbs: Breadcrumb[] = [{ label: "Admin", href: "/admin" }];

  const LABELS: Record<string, string> = {
    users: "Users",
    workflows: "Workflows",
    analytics: "Analytics",
    "ai-usage": "AI Usage",
    subscriptions: "Subscriptions",
    payments: "Payments",
    logs: "Logs",
    "feature-flags": "Feature Flags",
    announcements: "Announcements",
    support: "Support",
    settings: "Settings",
    templates: "Templates",
    activity: "Activity",
  };

  let path = "/admin";
  for (const seg of segments) {
    path += `/${seg}`;
    crumbs.push({ label: LABELS[seg] ?? seg, href: path });
  }

  return crumbs;
}

export function AdminHeader() {
  const pathname = usePathname();
  const crumbs = buildBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border/40 bg-background/80 px-4 backdrop-blur-xl lg:px-6">
      <nav aria-label="Breadcrumb" className="flex flex-1 items-center gap-1 text-sm">
        {crumbs.map((crumb, i) => (
          <span key={crumb.href ?? crumb.label} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />}
            {crumb.href && i < crumbs.length - 1 ? (
              <Link
                href={crumb.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className={cn(i === crumbs.length - 1 ? "font-semibold text-foreground" : "text-muted-foreground")}>
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        {/* Quick search hint */}
        <Button
          variant="outline"
          size="sm"
          className="hidden h-8 gap-2 text-xs text-muted-foreground md:flex"
          asChild
        >
          <span>
            <Search className="h-3.5 w-3.5" />
            Search...
            <kbd className="ml-1 rounded border px-1 font-mono text-[10px]">
              ⌘K
            </kbd>
          </span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8"
          asChild
        >
          <Link href="/admin/support">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 rounded-full p-0 text-[10px]">
              3
            </Badge>
          </Link>
        </Button>

        <ThemeToggle />

        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs" asChild>
          <Link href="/dashboard" target="_blank">
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden md:inline">App</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
