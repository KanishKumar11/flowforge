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
      id="base-node"
      className={`min-w-[200px] bg-[#0A160A] border shadow-none rounded-none transition-all duration-200 ${selected ? "border-[var(--arch-fg)] ring-1 ring-[var(--arch-fg)]" : "border-[var(--arch-border)]"
        }`}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-[#0A160A] !border-[var(--arch-fg)] !border-[1px] !rounded-none !w-2.5 !h-2.5 !top-[-6px]"
      />

      <div className="bg-[#0A160A] border-b border-[var(--arch-border)] px-3 py-2 flex items-center gap-2">
        <Icon className="h-3 w-3 text-[var(--arch-fg)]" />
        <span className="text-[10px] font-bold text-[var(--arch-fg)] font-mono uppercase tracking-wider">
          Action
        </span>
      </div>
      <div className="px-3 py-2 bg-[#0A160A]">
        <p className="font-bold text-xs text-[var(--arch-fg)] font-mono uppercase truncate">{data.label}</p>
        <p className="text-[10px] text-[var(--arch-muted)] mt-1 font-mono truncate uppercase">
          {description.replace(/\s+/g, '_').toUpperCase()}
        </p>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-[var(--arch-bg)] !border-[var(--arch-fg)] !border-[1px] !rounded-none !w-2.5 !h-2.5 !bottom-[-6px]"
      />
    </div>
  );
});
