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
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-4 px-6">
          {/* Sidebar Toggle */}
          <SidebarTrigger className="-ml-2" />

          {/* Title Section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold tracking-tight truncate">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground truncate">
                {description}
              </p>
            )}
          </div>

          {/* Search Button */}
          <Button
            variant="outline"
            className="relative h-9 w-9 p-0 xl:h-9 xl:w-60 xl:justify-start xl:px-3 xl:py-2 bg-(--arch-bg) border-(--arch-border) text-(--arch-muted) hover:text-(--arch-fg) hover:border-(--arch-fg) hover:bg-(--arch-bg-secondary) transition-all font-mono uppercase tracking-widest text-[10px]"
            onClick={() => setOpen(true)}
          >
            <Search className="h-4 w-4 xl:mr-2" />
            <span className="hidden xl:inline-flex">Search_Sys...</span>
            <kbd className="pointer-events-none absolute right-1.5 hidden h-6 select-none items-center gap-1 rounded border border-(--arch-border) bg-(--arch-bg) px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex text-(--arch-muted)">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          {/* Notifications */}
          <NotificationCenter />

          {/* Action Button */}
          {action}
        </div>
      </header>

      {/* Command Palette */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
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
