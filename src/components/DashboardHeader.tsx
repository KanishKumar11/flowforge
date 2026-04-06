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
  History,
  KeyRound,
  Plus,
  Search,
  Workflow,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="sticky top-0 z-40 w-full mb-4"
      >
        <div className="flex items-center gap-4 py-4 w-full">
          {/* Sidebar Toggle */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <SidebarTrigger className="-ml-2 hover:bg-white/10 text-(--arch-muted) hover:text-(--arch-fg) transition-colors h-10 w-10" />
          </motion.div>

          {/* Title Section */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="font-heading uppercase tracking-tight text-(--arch-fg) text-3xl truncate bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent w-fit"
            >
              {title}
            </motion.h1>
            {description && (
              <motion.p 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="font-mono text-[10px] text-(--arch-muted) tracking-widest truncate mt-1 w-fit uppercase"
              >
                {description}
              </motion.p>
            )}
          </div>

          <div className="flex items-center gap-4 justify-end">
            {/* Search Button */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="outline"
                className="relative h-10 w-10 p-0 xl:h-10 xl:w-64 xl:justify-start xl:px-4 xl:py-2 bg-white/[0.02] border-white/10 text-(--arch-muted) hover:text-(--arch-fg) hover:border-white/20 hover:bg-white/[0.05] transition-all font-mono uppercase tracking-widest text-[10px] rounded-full shadow-inner"
                onClick={() => setOpen(true)}
              >
                <Search className="h-4 w-4 xl:mr-3" />
                <span className="hidden xl:inline-flex">Search Matrix...</span>
                <kbd className="pointer-events-none absolute right-2 hidden h-6 select-none items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 font-mono text-[10px] font-medium opacity-100 xl:flex text-white/50">
                  <span className="text-[10px]">⌘</span>K
                </kbd>
              </Button>
            </motion.div>

            {/* Notifications */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <NotificationCenter />
            </motion.div>

            {/* Action Button */}
            {action && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                {action}
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>

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
