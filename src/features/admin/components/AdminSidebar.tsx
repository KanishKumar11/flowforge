"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Flag,
  HeadphonesIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shield,
  Terminal,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import type { User } from "better-auth";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/workflows", label: "Workflows", icon: Workflow },
      { href: "/admin/templates", label: "Templates", icon: Zap },
      { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
    ],
  },
  {
    label: "Monitoring",
    items: [
      { href: "/admin/ai-usage", label: "AI Usage", icon: Bot },
      { href: "/admin/logs", label: "Logs", icon: Terminal },
      { href: "/admin/activity", label: "Activity", icon: Activity },
    ],
  },
  {
    label: "Platform",
    items: [
      { href: "/admin/support", label: "Support", icon: HeadphonesIcon },
      {
        href: "/admin/announcements",
        label: "Announcements",
        icon: Bell,
      },
      { href: "/admin/feature-flags", label: "Feature Flags", icon: Flag },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  user: User;
  adminRole: string;
}

export function AdminSidebar({ user, adminRole }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
  }

  const sidebarContent = (
    <div
      className={cn(
        "flex h-full flex-col border-r border-border/40 bg-card/80 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[240px]",
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-border/40 px-3">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Admin Panel</span>
          </motion.div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setCollapsed(true)}
          >
            <ChevronDown className="h-3.5 w-3.5 rotate-90" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-4 px-3">
            {!collapsed && (
              <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href, "exact" in item ? item.exact : false);
                const Icon = item.icon;
                const link = (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground",
                      collapsed && "justify-center",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground",
                      )}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
                if (collapsed) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  );
                }
                return link;
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border/40 p-3">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 rounded-lg p-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback className="text-xs">
                {user.name?.charAt(0) ?? "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-xs font-semibold">{user.name}</p>
              <Badge variant="outline" className="mt-0.5 h-4 rounded px-1 text-[9px]">
                {adminRole.replace("_", " ")}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setCollapsed(false)}
                className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Expand sidebar</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden h-screen lg:flex">{sidebarContent}</aside>

      {/* Mobile overlay */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-3.5 z-50 h-8 w-8"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: mobileOpen ? 0 : "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed left-0 top-0 z-50 h-screen"
        >
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-3.5 z-10 h-7 w-7"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            {sidebarContent}
          </div>
        </motion.aside>
      </div>
    </>
  );
}
