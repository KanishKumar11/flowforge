"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  MoreVertical,
  Pause,
  Play,
  Settings,
  Trash2,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

interface WorkflowCardProps {
  workflow: {
    id: string;
    name: string;
    description?: string | null;
    isActive: boolean;
    updatedAt: Date | string;
    lastExecutedAt?: Date | string | null;
    _count?: {
      executions: number;
    };
  };
  onActivate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export function WorkflowCard({
  workflow,
  onActivate,
  onDelete,
  onDuplicate,
}: WorkflowCardProps) {
  return (
    <div className="glass-panel group relative overflow-hidden rounded-[2rem] p-6 hover:bg-white/[0.03] transition-all duration-500 h-[190px] flex flex-col justify-between border-white/5 hover:border-white/10">
      {/* Background ambient glow effect when active */}
      {workflow.isActive && (
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-(--arch-accent) opacity-[0.05] blur-3xl rounded-full group-hover:opacity-[0.1] transition-opacity duration-700" />
      )}

      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors">
            <Workflow className={`h-6 w-6 ${workflow.isActive ? "text-(--arch-accent)" : "text-white/50"}`} />
          </div>
          <div className="min-w-0 pr-2">
            <Link
              href={`/workflows/${workflow.id}`}
              className="block group-hover:text-(--arch-accent) transition-colors"
            >
              <h3 className="text-lg font-bold tracking-tight truncate leading-tight font-mono uppercase text-white">
                {workflow.name}
              </h3>
            </Link>
            {workflow.description ? (
              <p className="mt-1 line-clamp-1 text-[10px] font-mono text-white/50 uppercase tracking-widest max-w-[200px]">
                {workflow.description}
              </p>
            ) : (
              <p className="mt-1 line-clamp-1 text-[10px] font-mono text-white/30 uppercase tracking-widest italic">
                NO_DESCRIPTION
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Badge
            variant="outline"
            className={
              workflow.isActive
                ? "bg-[rgba(var(--arch-accent-rgb)/0.1)] text-(--arch-accent) border-[rgba(var(--arch-accent-rgb)/0.2)] px-2.5 py-0.5 rounded-full font-mono uppercase text-[9px] tracking-widest"
                : "bg-white/5 text-white/50 border-white/10 px-2.5 py-0.5 rounded-full font-mono uppercase text-[9px] tracking-widest"
            }
          >
            <span
              className={`w-1.5 h-1.5 mr-2 rounded-full ${
                workflow.isActive
                  ? "bg-(--arch-accent) animate-[pulse_2s_ease-in-out_infinite]"
                  : "bg-white/40"
              }`}
            />
            {workflow.isActive ? "Engaged" : "Dormant"}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-white/10 text-white/50 hover:text-white rounded-full transition-colors"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-[rgba(15,17,21,0.95)] backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl"
            >
              <DropdownMenuItem
                asChild
                className="focus:bg-white/5 focus:text-white cursor-pointer font-mono uppercase text-[10px] tracking-widest text-white/70 rounded-xl"
              >
                <Link href={`/workflows/${workflow.id}`}>
                  <Settings className="mr-2 h-3.5 w-3.5" />
                  Configure
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDuplicate?.(workflow.id)}
                className="focus:bg-white/5 focus:text-white cursor-pointer font-mono uppercase text-[10px] tracking-widest text-white/70 rounded-xl mt-1"
              >
                <Copy className="mr-2 h-3.5 w-3.5" />
                Clone Matrix
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onActivate?.(workflow.id)}
                className="focus:bg-white/5 focus:text-white cursor-pointer font-mono uppercase text-[10px] tracking-widest text-white/70 rounded-xl mt-1"
              >
                {workflow.isActive ? (
                  <>
                    <Pause className="mr-2 h-3.5 w-3.5 text-amber-400" />
                    Suspend
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-3.5 w-3.5 text-emerald-400" />
                    Engage
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10 my-2" />
              <DropdownMenuItem
                className="text-red-400 focus:bg-red-400/10 focus:text-red-400 cursor-pointer font-mono uppercase text-[10px] tracking-widest rounded-xl"
                onClick={() => onDelete?.(workflow.id)}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Terminate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-white/5 relative z-10 group-hover:border-white/10 transition-colors flex items-center justify-between">
        <div className="flex items-center gap-4 text-[9px] font-mono text-white/40 uppercase tracking-widest">
            <span>
              SYNC: {formatDistanceToNow(new Date(workflow.updatedAt))} AGO
            </span>
        </div>
        <div className="flex items-center gap-2">
            {workflow.lastExecutedAt && (
              <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest hidden sm:inline">
                L: {formatDistanceToNow(new Date(workflow.lastExecutedAt))} AGO
              </span>
            )}
            {workflow._count && (
            <Badge
                variant="secondary"
                className="bg-white/[0.03] text-white/60 border border-white/10 rounded-full px-2 text-[9px] uppercase font-mono tracking-widest"
            >
                {workflow._count.executions} Cycles
            </Badge>
            )}
        </div>
      </div>
    </div>
  );
}
