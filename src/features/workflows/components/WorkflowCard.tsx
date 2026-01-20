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
    <Card className="group glass border-white/20 dark:border-white/10 shadow-lg backdrop-blur-xl hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link
              href={`/workflows/${workflow.id}`}
              className="block group-hover:text-primary transition-colors"
            >
              <CardTitle className="text-lg font-bold tracking-tight truncate leading-tight">
                {workflow.name}
              </CardTitle>
            </Link>
            {workflow.description && (
              <CardDescription className="mt-2 line-clamp-2 text-sm">
                {workflow.description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                workflow.isActive
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2.5 py-0.5"
                  : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20 px-2.5 py-0.5"
              }
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-2 shadow-sm ${workflow.isActive ? "bg-emerald-500" : "bg-zinc-500"
                  }`}
              />
              {workflow.isActive ? "Active" : "Draft"}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-background/50 data-[state=open]:bg-background/50"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 glass border-white/20 dark:border-white/10">
                <DropdownMenuItem asChild>
                  <Link href={`/workflows/${workflow.id}`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Workflow
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate?.(workflow.id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onActivate?.(workflow.id)}>
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
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
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
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground/80 bg-background/30 p-3 rounded-lg border border-white/5">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              Updated {formatDistanceToNow(new Date(workflow.updatedAt), { addSuffix: true })}
            </span>
          </div>
          {workflow._count && (
            <Badge variant="secondary" className="bg-background/50 hover:bg-background/80 text-xs">
              {workflow._count.executions} runs
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
