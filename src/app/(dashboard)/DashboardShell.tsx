"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { TeamProvider } from "@/features/teams/components/TeamProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hide sidebar on the workflow editor pages (/workflows/[id])
  const isEditor = /^\/workflows\/[^/]+/.test(pathname);

  if (isEditor) {
    return <TeamProvider>{children}</TeamProvider>;
  }

  return (
    <SidebarProvider
      style={
        {
          "--background": "var(--arch-bg)",
          "--foreground": "var(--arch-fg)",
          "--sidebar": "var(--arch-bg)",
          "--sidebar-foreground": "var(--arch-fg)",
          "--sidebar-border": "var(--arch-border)",
          "--sidebar-accent": "var(--arch-bg-secondary)",
          "--sidebar-accent-foreground": "var(--arch-fg)",
          "--sidebar-primary": "var(--arch-accent)",
          "--sidebar-primary-foreground": "var(--arch-bg)",
          "--sidebar-ring": "var(--arch-focus)",
        } as React.CSSProperties
      }
    >
      <TeamProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </TeamProvider>
    </SidebarProvider>
  );
}
