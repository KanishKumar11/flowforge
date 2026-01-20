"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  Code,
  CreditCard,
  Database,
  FileText,
  Filter,
  GripVertical,
  GitBranch,
  Globe,
  Mail,
  MessageSquare,
  MousePointer,
  Search,
  Timer,
  Webhook,
  Workflow,
} from "lucide-react";
import { useState } from "react";

interface NodePaletteProps {
  onAddNode: (type: string, nodeType: "trigger" | "action") => void;
}

const triggerNodes = [
  { type: "manual", label: "Manual Trigger", icon: MousePointer, color: "text-blue-500" },
  { type: "webhook", label: "Webhook", icon: Webhook, color: "text-orange-500" },
  { type: "schedule", label: "Schedule", icon: Calendar, color: "text-purple-500" },
];

const actionNodes = [
  { type: "http-request", label: "HTTP Request", icon: Globe, color: "text-green-500" },
  { type: "code", label: "Code", icon: Code, color: "text-yellow-500" },
  { type: "email", label: "Send Email", icon: Mail, color: "text-red-500" },
  { type: "slack", label: "Slack", icon: MessageSquare, color: "text-pink-500" },
  { type: "database", label: "Database", icon: Database, color: "text-cyan-500" },
  { type: "if", label: "IF Condition", icon: GitBranch, color: "text-indigo-500" },
  { type: "switch", label: "Switch", icon: GitBranch, color: "text-violet-500" },
  { type: "loop", label: "Loop", icon: Timer, color: "text-blue-600" },
  { type: "filter", label: "Filter", icon: Filter, color: "text-violet-500" },
  { type: "set", label: "Set", icon: Database, color: "text-blue-500" },
  { type: "sort", label: "Sort", icon: Timer, color: "text-orange-500" },
  { type: "openai", label: "OpenAI", icon: MessageSquare, color: "text-emerald-500" },
  { type: "google_sheets", label: "Google Sheets", icon: Database, color: "text-green-600" },
  { type: "github", label: "GitHub", icon: GitBranch, color: "text-gray-700" },
  { type: "notion", label: "Notion", icon: FileText, color: "text-neutral-800" },
  { type: "wait", label: "Wait", icon: Timer, color: "text-amber-500" },
  { type: "stripe", label: "Stripe", icon: CreditCard, color: "text-purple-600" },
  { type: "twilio", label: "Twilio SMS", icon: MessageSquare, color: "text-red-600" },
  { type: "sub-workflow", label: "Sub-Workflow", icon: Workflow, color: "text-indigo-600" },
  { type: "merge", label: "Merge", icon: GitBranch, color: "text-teal-500" },
  { type: "comment", label: "Comment", icon: MessageSquare, color: "text-slate-500" },
];

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const [search, setSearch] = useState("");

  const filteredTriggers = triggerNodes.filter((node) =>
    node.label.toLowerCase().includes(search.toLowerCase())
  );

  const filteredActions = actionNodes.filter((node) =>
    node.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleDragStart = (
    e: React.DragEvent,
    nodeType: string,
    category: "trigger" | "action"
  ) => {
    e.dataTransfer.setData("application/reactflow", JSON.stringify({ nodeType, category }));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 h-full glass border-r border-border/50 flex flex-col bg-background/50 backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-sm mb-3 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Add Nodes</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-8 bg-background/50 border-input/50 focus:bg-background transition-all text-xs"
          />
        </div>
      </div>

      {/* Node List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Triggers */}
          {filteredTriggers.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                Triggers
              </h4>
              <div className="space-y-2">
                {filteredTriggers.map((node) => (
                  <button
                    key={node.type}
                    onClick={() => onAddNode(node.type, "trigger")}
                    draggable
                    onDragStart={(e) => handleDragStart(e, node.type, "trigger")}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-border/50 bg-card/30 hover:bg-primary/5 hover:border-primary/30 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 text-left group cursor-grab active:cursor-grabbing"
                  >
                    <div className={`p-2 rounded-lg bg-background shadow-sm ${node.color} group-hover:scale-110 transition-transform`}>
                      <node.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">{node.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {filteredActions.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                Actions
              </h4>
              <div className="space-y-2">
                {filteredActions.map((node) => (
                  <button
                    key={node.type}
                    onClick={() => onAddNode(node.type, "action")}
                    draggable
                    onDragStart={(e) => handleDragStart(e, node.type, "action")}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-border/50 bg-card/30 hover:bg-primary/5 hover:border-primary/30 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 text-left group cursor-grab active:cursor-grabbing"
                  >
                    <div className={`p-2 rounded-lg bg-background shadow-sm ${node.color} group-hover:scale-110 transition-transform`}>
                      <node.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">{node.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {filteredTriggers.length === 0 && filteredActions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No nodes found</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Drag hint */}
      <div className="p-3 border-t border-border/50 bg-muted/20">
        <p className="text-[10px] text-muted-foreground text-center font-medium">
          Drag nodes to canvas or click to add
        </p>
      </div>
    </div>
  );
}
