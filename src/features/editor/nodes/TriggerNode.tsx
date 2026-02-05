"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Calendar, MousePointer, Play, Webhook } from "lucide-react";
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

  return (
    <div
      id="base-node"
      className={`min-w-[200px] bg-[#0A160A] border shadow-none rounded-none transition-all duration-200 ${
        selected
          ? "border-[var(--arch-fg)] ring-1 ring-[var(--arch-fg)]"
          : "border-[var(--arch-border)]"
      }`}
    >
      <div className="bg-[#0A160A] border-b border-[var(--arch-border)] px-3 py-2 flex items-center gap-2">
        <Icon className="h-3 w-3 text-[var(--arch-fg)]" />
        <span className="text-[10px] font-bold text-[var(--arch-fg)] font-mono uppercase tracking-wider">
          Trigger
        </span>
      </div>
      <div className="px-3 py-2 bg-[#0A160A]">
        <p className="font-bold text-xs text-[var(--arch-fg)] font-mono uppercase truncate">
          {data.label}
        </p>
        <p className="text-[10px] text-[var(--arch-muted)] mt-1 font-mono truncate">
          {data.type === "manual" && "CLICK_TO_START"}
          {data.type === "webhook" && "Creates HTTP EP"}
          {data.type === "schedule" && "CRON_SCHEDULE"}
        </p>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-[#0A160A] !border-[var(--arch-fg)] !border-[1px] !rounded-none !w-2.5 !h-2.5 !bottom-[-6px]"
      />
    </div>
  );
});
