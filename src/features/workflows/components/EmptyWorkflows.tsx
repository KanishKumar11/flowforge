"use client";

import { Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyWorkflowsProps {
  onCreateClick: () => void;
}

export function EmptyWorkflows({ onCreateClick }: EmptyWorkflowsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative group cursor-pointer" onClick={onCreateClick}>
        <div className="absolute inset-0 bg-(--arch-fg) blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-full" />
        <div className="relative border border-(--arch-border) bg-(--arch-bg) p-8 group-hover:border-(--arch-fg) transition-all duration-300">
          <Workflow className="w-12 h-12 text-(--arch-fg) stroke-[1.5]" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-(--arch-fg) opacity-50" />
          <div className="absolute -top-2 -left-2 w-4 h-4 border-l border-t border-(--arch-fg) opacity-50" />
        </div>
      </div>

      <h3 className="mt-8 text-xl font-bold font-mono uppercase tracking-widest text-(--arch-fg)">
        System Offline
      </h3>

      <p className="mt-4 text-center text-sm font-mono text-(--arch-muted) max-w-sm leading-relaxed">
        No active workflows detected in the neural network. Initialize a new
        sequence to begin automation protocols.
      </p>

      <div className="mt-8">
        <Button
          onClick={onCreateClick}
          className="h-10 px-6 bg-(--arch-fg) text-(--arch-bg) hover:bg-[rgba(var(--arch-fg-rgb)/0.9)] rounded-none font-mono uppercase text-xs tracking-wider transition-all hover:scale-105"
        >
          Initialize Workflow
        </Button>
      </div>
    </div>
  );
}
