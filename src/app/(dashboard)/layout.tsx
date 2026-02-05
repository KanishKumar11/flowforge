import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
