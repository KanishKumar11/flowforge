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
  Settings,
  Sparkles,
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
    href: "/dashboard",
    icon: FolderKanban,
  },
  {
    label: "Workflows",
    href: "/workflows",
    icon: Workflow,
  },
  {
    label: "Executions",
    href: "/executions",
    icon: History,
  },
  {
    label: "Credentials",
    href: "/credentials",
    icon: KeyRound,
  },
  {
    label: "Teams",
    href: "/teams",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { hasActiveSubscription, isLoading } = useHasActiveSubscription();
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
    <Sidebar
      collapsible="icon"
      className="border-r border-(--arch-border) bg-(--arch-bg) text-(--arch-fg) transition-colors duration-500 no-print"
    >
      {/* Logo Header */}
      <SidebarHeader className="border-b border-(--arch-border) p-4">
        <SidebarMenuItem className="list-none">
          <SidebarMenuButton
            asChild
            className="h-10 px-0 gap-3 hover:bg-transparent group"
          >
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 border border-(--arch-fg) bg-(--arch-bg) transition-all group-hover:bg-(--arch-fg) group-hover:text-(--arch-bg)">
                <Zap className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="font-heading text-lg tracking-tight uppercase leading-none">
                    FLOWGENT
                  </span>
                  <span className="font-mono text-[10px] text-(--arch-muted) tracking-widest">
                    V2.0.4
                  </span>
                </div>
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="px-2 py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainMenuItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === item.href
                    : pathname.startsWith(item.href) && item.href !== "/";

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      isActive={isActive}
                      asChild
                      className={`h-10 px-3 gap-3 rounded-none transition-all duration-200 font-mono text-xs uppercase tracking-wider border-l-2 ${isActive
                        ? "bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-fg) font-bold border-(--arch-fg)"
                        : "text-(--arch-muted) border-transparent hover:text-(--arch-fg) hover:bg-[rgba(var(--arch-fg-rgb)/0.05)]"
                        }`}
                    >
                      <Link href={item.href} prefetch>
                        <item.icon
                          className={`w-4 h-4 ${isActive ? "text-(--arch-fg)" : "text-(--arch-muted) group-hover:text-(--arch-fg)"}`}
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
      <SidebarFooter className="border-t border-(--arch-border) p-4 bg-(--arch-bg)">
        <SidebarMenu>
          {/* User Menu */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip={user?.name || "Access"}
                  className="h-12 px-2 gap-3 rounded-none hover:bg-[rgba(var(--arch-fg-rgb)/0.1)] border border-transparent hover:border-(--arch-border) transition-all"
                >
                  <Avatar className="w-8 h-8 rounded-none border border-(--arch-fg)">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="bg-(--arch-bg) text-(--arch-fg) font-mono text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex flex-col items-start text-left overflow-hidden">
                      <span className="font-mono text-xs font-bold uppercase truncate max-w-[120px] text-(--arch-fg)">
                        {user?.name || "OPERATOR"}
                      </span>
                      <span className="font-mono text-[10px] text-(--arch-muted) truncate max-w-[120px]">
                        {user?.email}
                      </span>
                    </div>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="top"
                className="w-56 rounded-none border border-(--arch-border) bg-(--arch-bg) text-(--arch-fg) font-mono"
              >
                <DropdownMenuLabel className="font-normal border-b border-(--arch-border) pb-2 mb-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs font-bold uppercase">{user?.name}</p>
                    <p className="text-[10px] text-(--arch-muted)">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                {!isLoading && !hasActiveSubscription && (
                  <>
                    <DropdownMenuItem
                      className="focus:bg-(--arch-accent) focus:text-(--arch-bg) cursor-pointer text-xs uppercase text-(--arch-accent) font-bold"
                      onClick={() => {
                        authClient.checkout({
                          slug: "pro",
                        });
                      }}
                    >
                      <Sparkles className="mr-2 h-3 w-3" />
                      UPGRADE_SYS
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-(--arch-border)" />
                  </>
                )}

                <DropdownMenuItem className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs uppercase">
                  <User className="mr-2 h-3 w-3" />
                  ID_CARD
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs uppercase">
                  <Settings className="mr-2 h-3 w-3" />
                  CONFIG
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs uppercase">
                  <CreditCard className="mr-2 h-3 w-3" />
                  CREDITS
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-(--arch-border)" />

                <DropdownMenuLabel className="text-[10px] text-(--arch-muted) uppercase tracking-wider">
                  Theme_Mode
                </DropdownMenuLabel>
                <div className="flex items-center justify-between px-2 py-1.5">
                  <ThemeToggle />
                </div>

                <DropdownMenuSeparator className="bg-(--arch-border)" />

                <DropdownMenuItem
                  className="text-red-500 focus:bg-red-500 focus:text-white cursor-pointer text-xs uppercase"
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
                  <LogOut className="mr-2 h-3 w-3" />
                  TERMINATE
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex gap-1 w-full border border-(--arch-border) p-0.5 bg-(--arch-bg-secondary)">
      {['light', 'dark', 'system'].map((mode) => (
        <button
          key={mode}
          onClick={() => setTheme(mode)}
          className={`flex-1 flex items-center justify-center p-1.5 transition-all text-[10px] uppercase font-mono ${theme === mode
            ? 'bg-(--arch-fg) text-(--arch-bg) font-bold'
            : 'text-(--arch-muted) hover:text-(--arch-fg)'
            }`}
          title={`Switch to ${mode} mode`}
        >
          {mode === 'light' && "LGT"}
          {mode === 'dark' && "DRK"}
          {mode === 'system' && "SYS"}
        </button>
      ))}
    </div>
  )
}
