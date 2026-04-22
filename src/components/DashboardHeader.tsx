"use client";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationCenter } from "@/components/NotificationCenter";
import {
  FolderKanban,
  History,
  KeyRound,
  Plus,
  Search,
  Workflow,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DashboardHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export function DashboardHeader({
  title,
  description,
  action,
}: DashboardHeaderProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-2xl">
        <div className="flex items-center justify-between px-6 lg:px-10 py-4">
          <div className="flex items-center gap-6">
            {/* Sidebar Toggle */}
            <SidebarTrigger className="-ml-2 transition-transform hover:scale-105 active:scale-95 text-muted-foreground hover:text-foreground" />

            {/* Title Section - Upgraded to Premium Aesthetic */}
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-semibold tracking-tight text-foreground leading-none">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-muted-foreground/80 mt-2 font-medium tracking-wide">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Button */}
            <Button
              variant="outline"
              className="relative h-10 w-10 p-0 xl:h-10 xl:w-64 xl:justify-start xl:px-4 bg-background/50 hover:bg-background border-border/60 text-muted-foreground hover:text-foreground transition-all duration-300 rounded-xl text-sm font-medium shadow-sm hover:shadow-md"
              onClick={() => setOpen(true)}
            >
              <Search className="h-[18px] w-[18px] xl:mr-3 opacity-70" />
              <span className="hidden xl:inline-flex">Search...</span>
              <kbd className="pointer-events-none absolute right-2 hidden h-6 select-none items-center gap-1 rounded-md border border-border/50 bg-muted/50 px-2 font-sans text-[11px] font-semibold text-muted-foreground opacity-100 xl:flex shadow-sm">
                <span className="text-[10px]">⌘</span>K
              </kbd>
            </Button>

            {/* Notifications */}
            <div className="hidden sm:block">
              <NotificationCenter />
            </div>

            {/* Action Button */}
            {action && (
              <div className="ml-2 pl-4 border-l border-border/50 hidden sm:flex">
                {action}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Command Palette */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search workflows, commands..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            <CommandItem
              onSelect={() => {
                setOpen(false);
                router.push("/workflows/new");
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Workflow
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => {
                setOpen(false);
                router.push("/workflows");
              }}
            >
              <Workflow className="mr-2 h-4 w-4" />
              Workflows
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                router.push("/executions");
              }}
            >
              <History className="mr-2 h-4 w-4" />
              Executions
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                router.push("/credentials");
              }}
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Credentials
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
