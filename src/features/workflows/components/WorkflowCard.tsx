"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

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
    <Card className="group bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) shadow-none rounded-none border hover:border-(--arch-fg) transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-20 bg-[rgba(var(--arch-fg-rgb)/0.05)] rounded-bl-full -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link
              href={`/workflows/${workflow.id}`}
              className="block group-hover:text-(--arch-fg) transition-colors"
            >
              <CardTitle className="text-lg font-bold tracking-tight truncate leading-tight font-mono uppercase">
                {workflow.name}
              </CardTitle>
            </Link>
            {workflow.description && (
              <CardDescription className="mt-2 line-clamp-2 text-xs font-mono text-(--arch-muted)">
                {workflow.description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                workflow.isActive
                  ? "bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-fg) border-(--arch-fg) px-2.5 py-0.5 rounded-none font-mono uppercase text-xs"
                  : "bg-[rgba(var(--arch-muted-rgb)/0.1)] text-(--arch-muted) border-(--arch-muted) px-2.5 py-0.5 rounded-none font-mono uppercase text-xs"
              }
            >
              <span
                className={`w-1.5 h-1.5 mr-2 ${
                  workflow.isActive
                    ? "bg-(--arch-fg) animate-pulse"
                    : "bg-(--arch-muted)"
                }`}
              />
              {workflow.isActive ? "Active" : "Draft"}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-muted) hover:text-(--arch-fg) rounded-none"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono uppercase text-xs"
              >
                <DropdownMenuItem
                  asChild
                  className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer"
                >
                  <Link href={`/workflows/${workflow.id}`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDuplicate?.(workflow.id)}
                  className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Clone
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onActivate?.(workflow.id)}
                  className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer"
                >
                  {workflow.isActive ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-(--arch-border)" />
                <DropdownMenuItem
                  className="text-red-500 focus:text-white focus:bg-red-500 cursor-pointer"
                  onClick={() => onDelete?.(workflow.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        <div className="flex items-center justify-between text-xs font-mono text-(--arch-muted) bg-[rgba(var(--arch-fg-rgb)/0.05)] p-3 border-t border-(--arch-border)">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 uppercase">
              UPDATED{" "}
              {formatDistanceToNow(new Date(workflow.updatedAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          {workflow._count && (
            <Badge
              variant="secondary"
              className="bg-(--arch-bg) text-(--arch-fg) border border-(--arch-border) rounded-none text-[10px] uppercase"
            >
              {workflow._count.executions} runs
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
