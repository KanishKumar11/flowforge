"use client";

import { useVanillaClient } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Layers, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ExecutionSettingsProps {
  workflowId: string;
  initialTimeoutMs: number | null;
  initialMaxConcurrency: number;
  onClose: () => void;
}

export function ExecutionSettings({
  workflowId,
  initialTimeoutMs,
  initialMaxConcurrency,
  onClose,
}: ExecutionSettingsProps) {
  const client = useVanillaClient();
  const queryClient = useQueryClient();

  // Convert ms to seconds for display
  const [timeoutSec, setTimeoutSec] = useState(
    initialTimeoutMs ? Math.round(initialTimeoutMs / 1000).toString() : "",
  );
  const [maxConcurrency, setMaxConcurrency] = useState(
    initialMaxConcurrency.toString(),
  );

  useEffect(() => {
    setTimeoutSec(
      initialTimeoutMs ? Math.round(initialTimeoutMs / 1000).toString() : "",
    );
    setMaxConcurrency(initialMaxConcurrency.toString());
  }, [initialTimeoutMs, initialMaxConcurrency]);

  const save = useMutation({
    mutationFn: () =>
      client.workflows.updateExecutionSettings.mutate({
        id: workflowId,
        timeoutMs: timeoutSec ? parseInt(timeoutSec, 10) * 1000 : null,
        maxConcurrency: parseInt(maxConcurrency, 10) || 0,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      toast.success("Execution settings saved");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="w-72 h-full bg-(--arch-bg) border-l border-(--arch-border) flex flex-col font-mono">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-(--arch-border)">
        <span className="text-xs font-bold uppercase tracking-widest text-(--arch-fg)">
          Execution Settings
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6 hover:bg-(--arch-fg) hover:text-(--arch-bg) rounded-none text-(--arch-muted)"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Timeout */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest text-(--arch-fg) flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            Timeout (seconds)
          </Label>
          <Input
            type="number"
            min={0}
            placeholder="No limit"
            value={timeoutSec}
            onChange={(e) => setTimeoutSec(e.target.value)}
            className="rounded-none border-(--arch-border) bg-(--arch-bg) text-(--arch-fg) text-xs font-mono h-8"
          />
          <p className="text-[11px] text-(--arch-muted)">
            Max time before execution is cancelled. 0 or empty = no limit.
          </p>
        </div>

        {/* Max Concurrency */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest text-(--arch-fg) flex items-center gap-2">
            <Layers className="h-3.5 w-3.5" />
            Max Concurrency
          </Label>
          <Input
            type="number"
            min={0}
            max={100}
            placeholder="0 = unlimited"
            value={maxConcurrency}
            onChange={(e) => setMaxConcurrency(e.target.value)}
            className="rounded-none border-(--arch-border) bg-(--arch-bg) text-(--arch-fg) text-xs font-mono h-8"
          />
          <p className="text-[11px] text-(--arch-muted)">
            Max simultaneous runs. 0 = unlimited. 1 = one at a time.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-(--arch-border)">
        <Button
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="w-full h-8 rounded-none bg-(--arch-fg) text-(--arch-bg) hover:bg-[rgba(var(--arch-fg-rgb)/0.9)] font-mono uppercase text-xs"
        >
          <Save className="h-3.5 w-3.5 mr-2" />
          {save.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
