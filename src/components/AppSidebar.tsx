"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useHasActiveSubscription } from "@/features/hooks/useSubscription";
import { authClient } from "@/lib/auth-client";
import {
  CreditCard,
  FolderKanban,
  History,
  KeyRound,
  LogOut,
  MoreVertical,
  Moon,
  Palette,
  Settings,
  Sparkles,
  Sun,
  User,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const mainMenuItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: FolderKanban,
    description: "Overview & quick actions",
  },
  {
    label: "Workflows",
    href: "/workflows",
    icon: Workflow,
    description: "Manage your automations",
  },
  {
    label: "Executions",
    href: "/executions",
    icon: History,
    description: "View execution history",
  },
  {
    label: "Credentials",
    href: "/credentials",
    icon: KeyRound,
    description: "Manage API keys & tokens",
  },
  {
    label: "Teams",
    href: "/teams",
    icon: Users,
    description: "Collaborate with others",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account & preferences",
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { hasActiveSubscription, isLoading } = useHasActiveSubscription();
  const { theme, setTheme } = useTheme();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const session = authClient.useSession();
  const user = session.data?.user;

  const initials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "U";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Logo Header */}
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenuItem className="list-none">
          <SidebarMenuButton
            asChild
            className="h-14 px-4 gap-3 hover:bg-sidebar-accent"
          >
            <Link href="/workflows" className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-primary">
                <Zap className="w-4 h-4 text-white" />
              </div>
              {!isCollapsed && (
                <span className="font-bold text-lg tracking-tight">
                  FlowForge
                </span>
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainMenuItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      isActive={isActive}
                      asChild
                      className={`h-11 px-3 gap-3 rounded-lg transition-all duration-200 ${isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                        }`}
                    >
                      <Link href={item.href} prefetch>
                        <item.icon
                          className={`w-5 h-5 ${isActive ? "text-primary" : ""}`}
                        />
                        {!isCollapsed && <span>{item.label}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with User & Actions */}
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu className="space-y-1">
          {/* Upgrade Button */}
          {!isLoading && !hasActiveSubscription && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Upgrade to Pro"
                className="h-11 px-3 gap-3 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 hover:from-primary/20 hover:to-purple-500/20 text-primary border border-primary/20"
                onClick={() => {
                  authClient.checkout({
                    slug: "pro",
                  });
                }}
              >
                <Sparkles className="w-5 h-5" />
                {!isCollapsed && (
                  <span className="font-medium">Upgrade to Pro</span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* Theme Toggle */}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={theme === "dark" ? "Light Mode" : "Dark Mode"}
              className="h-11 px-3 gap-3 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              {!isCollapsed && (
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* User Menu */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip={user?.name || "Account"}
                  className="h-12 px-3 gap-3 rounded-lg hover:bg-sidebar-accent/50"
                >
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex flex-col items-start text-left overflow-hidden">
                      <span className="text-sm font-medium truncate max-w-[140px]">
                        {user?.name || "User"}
                      </span>
                      <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                        {user?.email}
                      </span>
                    </div>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="top"
                className="w-56 glass"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => {
                    authClient.signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          router.push("/login");
                        },
                      },
                    });
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}