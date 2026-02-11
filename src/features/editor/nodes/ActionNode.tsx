"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  ArrowUpDown,
  BookOpen,
  Brain,
  Code,
  CreditCard,
  Database,
  Filter,
  GitBranch,
  GitFork,
  Globe,
  Mail,
  Merge,
  MessageCircle,
  MessageSquare,
  Phone,
  Repeat,
  Sheet,
  SquarePen,
  Timer,
  Workflow,
  Zap,
  Github,
} from "lucide-react";
import { memo } from "react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "http-request": Globe,
  code: Code,
  email: Mail,
  slack: MessageSquare,
  database: Database,
  if: GitBranch,
  filter: Filter,
  wait: Timer,
  switch: GitFork,
  loop: Repeat,
  set: SquarePen,
  sort: ArrowUpDown,
  openai: Brain,
  google_sheets: Sheet,
  github: Github,
  notion: BookOpen,
  stripe: CreditCard,
  twilio: Phone,
  "sub-workflow": Workflow,
  merge: Merge,
  comment: MessageCircle,
};

const colorMap: Record<string, string> = {
  "http-request": "bg-green-500/10 text-green-500 border-green-500/30",
  code: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  email: "bg-red-500/10 text-red-500 border-red-500/30",
  slack: "bg-pink-500/10 text-pink-500 border-pink-500/30",
  database: "bg-cyan-500/10 text-cyan-500 border-cyan-500/30",
  if: "bg-indigo-500/10 text-indigo-500 border-indigo-500/30",
  filter: "bg-violet-500/10 text-violet-500 border-violet-500/30",
  wait: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  switch: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  loop: "bg-blue-600/10 text-blue-600 border-blue-600/30",
  set: "bg-sky-500/10 text-sky-500 border-sky-500/30",
  sort: "bg-orange-500/10 text-orange-500 border-orange-500/30",
  openai: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  google_sheets: "bg-green-600/10 text-green-600 border-green-600/30",
  github: "bg-gray-600/10 text-gray-600 border-gray-600/30",
  notion: "bg-neutral-600/10 text-neutral-600 border-neutral-600/30",
  stripe: "bg-purple-600/10 text-purple-600 border-purple-600/30",
  twilio: "bg-red-600/10 text-red-600 border-red-600/30",
  "sub-workflow": "bg-indigo-600/10 text-indigo-600 border-indigo-600/30",
  merge: "bg-teal-500/10 text-teal-500 border-teal-500/30",
  comment: "bg-slate-500/10 text-slate-500 border-slate-500/30",
};

interface ActionNodeData {
  type: string;
  label: string;
  config?: Record<string, unknown>;
}

export const ActionNode = memo(function ActionNode({
  data,
  selected,
}: NodeProps & { data: ActionNodeData }) {
  const Icon = iconMap[data.type] || Zap;

  return (
    <div
      className={`px-4 py-3 rounded-none bg-(--arch-bg) border border-(--arch-border) shadow-sm min-w-[180px] group transition-all duration-300 ${
        selected
          ? "ring-1 ring-(--arch-fg) border-(--arch-fg)"
          : "hover:border-(--arch-fg) hover:ring-1 hover:ring-[rgba(var(--arch-fg-rgb)/0.1)]"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5! h-2.5! rounded-none! bg-(--arch-fg)! border! border-(--arch-fg)! top-[-6px]! transition-all duration-300 group-hover:border-(--arch-fg)! group-hover:bg-(--arch-fg)!"
      />

      <div className="flex items-center gap-3">
        <div
          className={`p-1.5 rounded-none border border-(--arch-border) ${colorMap[data.type] || "bg-blue-500/10 text-blue-500"} transition-colors duration-300 group-hover:border-(--arch-fg)`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-(--arch-fg) font-mono tracking-wide uppercase">
            {data.label}
          </div>
          <div className="text-[10px] text-(--arch-muted) font-mono uppercase tracking-wider mt-0.5">
            ACTION
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5! h-2.5! rounded-none! bg-(--arch-fg)! border! border-(--arch-fg)! bottom-[-6px]! transition-all duration-300 group-hover:border-(--arch-fg)! group-hover:bg-(--arch-fg)!"
      />
    </div>
  );
});
