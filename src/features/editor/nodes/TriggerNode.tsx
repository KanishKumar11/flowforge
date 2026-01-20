"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  Calendar,
  MousePointer,
  Play,
  Webhook,
} from "lucide-react";
import { memo } from "react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  manual: MousePointer,
  webhook: Webhook,
  schedule: Calendar,
};

const colorMap: Record<string, string> = {
  manual: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  webhook: "bg-orange-500/10 text-orange-500 border-orange-500/30",
  schedule: "bg-purple-500/10 text-purple-500 border-purple-500/30",
};

interface TriggerNodeData {
  type: string;
  label: string;
  config?: Record<string, unknown>;
}

export const TriggerNode = memo(function TriggerNode({
  data,
  selected,
}: NodeProps & { data: TriggerNodeData }) {
  const Icon = iconMap[data.type] || Play;
  const colors = colorMap[data.type] || "bg-primary/10 text-primary border-primary/30";

  return (
    <div
      id="base-node"
      className={`workflow-node min-w-[200px] ${selected ? "selected" : ""}`}
    >
      <div className={`px-4 py-3 rounded-t-xl border-b ${colors}`}>
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wide">
            Trigger
          </span>
        </div>
      </div>
      <div className="px-4 py-3">
        <p className="font-medium text-sm">{data.label}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {data.type === "manual" && "Click to start"}
          {data.type === "webhook" && "Listens for HTTP requests"}
          {data.type === "schedule" && "Runs on a schedule"}
        </p>
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
