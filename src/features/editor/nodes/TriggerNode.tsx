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
      className={`px-4 py-3 rounded-none bg-(--arch-bg) border border-(--arch-border) shadow-sm min-w-[180px] group transition-all duration-300 ${selected
          ? "ring-1 ring-(--arch-fg) border-(--arch-fg)"
          : "hover:border-(--arch-fg) hover:ring-1 hover:ring-(--arch-fg)/10"
        }`}
    >
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-none bg-emerald-500/10 text-emerald-500 border border-(--arch-border) transition-colors duration-300 group-hover:border-(--arch-fg)">
          <Play className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-(--arch-fg) font-mono tracking-wide uppercase">{data.label}</div>
          <div className="text-[10px] text-(--arch-muted) font-mono uppercase tracking-wider mt-0.5">TRIGGER</div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5! h-2.5! rounded-none! bg-[#0A160A]! border! border-(--arch-fg)! bottom-[-6px]! transition-all duration-300 group-hover:border-(--arch-fg)! group-hover:bg-(--arch-fg)!"
      />
    </div>
  );
});
