"use client";

import { Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyWorkflowsProps {
  onCreateClick: () => void;
}

export function EmptyWorkflows({ onCreateClick }: EmptyWorkflowsProps) {
  return (
    <div className="empty-state glass border border-white/20 dark:border-white/10 rounded-2xl p-12 text-center animate-fadeIn shadow-lg">
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-8 mx-auto ring-1 ring-primary/20 shadow-inner">
        <Workflow className="w-12 h-12 text-primary" />
      </div>
      <h3 className="text-2xl font-bold tracking-tight mb-3">
        No workflows yet
      </h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg leading-relaxed">
        Create your first workflow to start automating tasks. Connect your apps
        and build powerful automations with our visual editor.
      </p>
      <Button
        onClick={onCreateClick}
        size="lg"
        className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5 text-base px-8 h-12"
      >
        <Workflow className="w-5 h-5" />
        Create Your First Workflow
      </Button>
    </div>
  );
}
