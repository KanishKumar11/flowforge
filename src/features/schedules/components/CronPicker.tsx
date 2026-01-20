"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Info } from "lucide-react";
import { useState } from "react";

interface CronPickerProps {
  value: string;
  onChange: (expression: string) => void;
}

export function CronPicker({ value, onChange }: CronPickerProps) {
  const trpc = useTRPC();
  const [mode, setMode] = useState<"preset" | "custom">("preset");

  const { data: presets } = useQuery(trpc.schedules.presets.queryOptions());
  const { data: description } = useQuery({
    ...trpc.schedules.describe.queryOptions({ expression: value }),
    enabled: value.length > 0,
  });

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === "preset" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("preset")}
        >
          Presets
        </Button>
        <Button
          type="button"
          variant={mode === "custom" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("custom")}
        >
          Custom
        </Button>
      </div>

      {mode === "preset" ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a schedule" />
          </SelectTrigger>
          <SelectContent>
            {presets?.map((preset) => (
              <SelectItem key={preset.expression} value={preset.expression}>
                <div className="flex flex-col">
                  <span>{preset.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {preset.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="cron">Cron Expression</Label>
          <Input
            id="cron"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="* * * * *"
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            Format: minute hour day-of-month month day-of-week
          </p>
        </div>
      )}

      {/* Description */}
      {value && description && (
        <Card className={description.valid ? "bg-accent/50" : "bg-destructive/10"}>
          <CardContent className="p-3 flex items-start gap-2">
            {description.valid ? (
              <Clock className="h-4 w-4 text-green-500 mt-0.5" />
            ) : (
              <Info className="h-4 w-4 text-destructive mt-0.5" />
            )}
            <div>
              <p className="text-sm font-medium">
                {description.valid ? "Runs:" : "Invalid"}
              </p>
              <p className="text-sm text-muted-foreground">
                {description.description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
