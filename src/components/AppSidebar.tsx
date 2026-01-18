"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { useHasActiveSubscription } from "@/features/hooks/useSubscription";
import { authClient } from "@/lib/auth-client";
import { CreditCardIcon, FolderOpen, HistoryIcon, LogOutIcon, StarIcon, KeyIcon } from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const menuItems = [
  {
    label: "Workflows",
    items: [
      {
        label: "Workflows",
        href: "/workflows",
        icon: FolderOpen,
      },
    ]
  },
  {
    label: "Credentials",
    items: [
      {
        label: "Credentials",
        href: "/credentials",
        icon: KeyIcon,
      },
    ]
  },
  {
    label: "Executions",
    items: [
      {
        label: "Executions",
        href: "/executions",
        icon: HistoryIcon,
      },
    ]
  },

]
export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { hasActiveSubscription, isLoading } = useHasActiveSubscription()
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>

          <SidebarMenuButton tooltip="Workflows" isActive={false} asChild className="gap-x-4 h-10 px-4">
            <Link href="/workflows" prefetch>
              {/* USE LOGO HERE */}
              {/* <Image src="/logo.svg" alt="Flowgent" width={30} height={30} /> */}
              <FolderOpen className="size-4" />
              <span className="font-semibold" >Flowgent</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent >
        {menuItems.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupContent>
              <SidebarMenu>

                {group.items.map((item) => (
                  <SidebarMenuItem key={item.label} >
                    <SidebarMenuButton tooltip={item.label} isActive={item.href === "/" ? pathname === item.href : pathname.startsWith(item.href)} asChild className="gap-x-4 h-10 px-4">
                      <Link href={item.href} prefetch>
                        <item.icon className="size-4" />
                        <span >{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>

          </SidebarGroup>
        ))}

        <SidebarFooter>
          {!isLoading && !hasActiveSubscription && (
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Upgrade to Pro" isActive={false} className="gap-x-4 h-10 px-4" onClick={() => {
                authClient.checkout({
                  slug: "pro",
                })
              }}>
                <StarIcon className="h-4 w-4" />
                <span>Upgrade to Pro</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Billing Portal" isActive={false} className="gap-x-4 h-10 px-4" onClick={() => { }}>
              <CreditCardIcon className="h-4 w-4" />
              <span>Billing Portal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Logout" isActive={false} className="gap-x-4 h-10 px-4" onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push('/login')
                  }
                }
              })
            }}>
              <LogOutIcon className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}