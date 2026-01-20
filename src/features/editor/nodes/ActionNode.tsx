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
  const colors = colorMap[data.type] || "bg-primary/10 text-primary border-primary/30";
  const description = descriptionMap[data.type] || "Configure this action";

  return (
    <div
      id="base-node"
      className={`workflow-node min-w-[200px] ${selected ? "selected" : ""}`}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="node-handle !top-[-6px]"
      />

      <div className={`px-4 py-3 rounded-t-xl border-b ${colors}`}>
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wide">
            Action
          </span>
        </div>
      </div>
      <div className="px-4 py-3">
        <p className="font-medium text-sm">{data.label}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="node-handle !bottom-[-6px]"
      />
    </div>
  );
});
