"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  Code,
  Database,
  Filter,
  GitBranch,
  Globe,
  Mail,
  MessageSquare,
  Timer,
  Zap,
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
};

const descriptionMap: Record<string, string> = {
  "http-request": "Make API calls",
  code: "Run custom code",
  email: "Send an email",
  slack: "Post to Slack",
  database: "Query database",
  if: "Conditional logic",
  filter: "Filter items",
  wait: "Pause execution",
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
  const description = descriptionMap[data.type] || "CONFIGURE_ACTION";

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
        className="w-2.5! h-2.5! rounded-none! bg-[#0A160A]! border! border-(--arch-fg)! top-[-6px]! transition-all duration-300 group-hover:border-(--arch-fg)! group-hover:bg-(--arch-fg)!"
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
        className="w-2.5! h-2.5! rounded-none! bg-(--arch-bg)! border! border-(--arch-fg)! bottom-[-6px]! transition-all duration-300 group-hover:border-(--arch-fg)! group-hover:bg-(--arch-fg)!"
      />
    </div>
  );
});
