"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Info, Zap } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      <div className="flex p-1 rounded-2xl bg-white/[0.02] border border-white/5 w-fit">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setMode("preset")}
          className={`rounded-xl px-6 h-8 text-[10px] font-mono uppercase tracking-widest transition-all ${
            mode === "preset"
              ? "bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20"
              : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
          }`}
        >
          Templates
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setMode("custom")}
          className={`rounded-xl px-6 h-8 text-[10px] font-mono uppercase tracking-widest transition-all ${
            mode === "custom"
              ? "bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20"
              : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
          }`}
        >
          Manual
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "preset" ? (
          <motion.div
            key="preset"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger className="bg-black/50 border-white/10 text-white font-mono text-xs rounded-xl h-11 px-4 placeholder:text-white/20 focus:ring-1 focus:ring-emerald-400/50 hover:bg-white/5 transition-colors">
                <SelectValue placeholder="Select Temporal Vector..." />
              </SelectTrigger>
              <SelectContent className="bg-[rgba(15,17,21,0.95)] backdrop-blur-2xl border-white/10 text-white rounded-2xl shadow-2xl p-1">
                {presets?.map((preset) => (
                  <SelectItem 
                    key={preset.expression} 
                    value={preset.expression}
                    className="focus:bg-white/5 focus:text-emerald-400 cursor-pointer rounded-xl my-0.5 p-3 flex"
                  >
                    <div className="flex flex-col gap-1 w-full text-left">
                      <span className="font-mono text-xs uppercase tracking-tight">{preset.label}</span>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                        {preset.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        ) : (
          <motion.div
            key="custom"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <Label htmlFor="cron" className="text-emerald-400 font-mono uppercase text-[10px] tracking-widest ml-1 flex items-center gap-2">
              <Zap className="h-3 w-3" />
              Cron Vector
            </Label>
            <Input
              id="cron"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="* * * * *"
              className="bg-black/50 border-white/10 text-emerald-400 font-mono text-base rounded-xl h-12 px-4 placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-emerald-400/50 hover:bg-white/5 transition-colors"
            />
            <p className="text-[9px] font-mono tracking-widest uppercase text-white/30 ml-2">
              Format: min hr day-of-month mo day-of-week
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Description Feedback */}
      <AnimatePresence>
        {value && description && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 flex items-start gap-3 rounded-2xl border backdrop-blur-sm ${
                description.valid 
                ? "bg-emerald-500/5 border-emerald-500/20" 
                : "bg-red-500/5 border-red-500/20"
            }`}
          >
            {description.valid ? (
              <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shrink-0">
                <Clock className="h-4 w-4 text-emerald-400" />
              </div>
            ) : (
              <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20 shrink-0">
                <Info className="h-4 w-4 text-red-400" />
              </div>
            )}
            <div className="pt-0.5">
              <p className={`text-[10px] font-mono uppercase tracking-widest font-bold ${
                  description.valid ? "text-emerald-400" : "text-red-400"
              }`}>
                {description.valid ? "Temporal Sequence:" : "Syntax Error"}
              </p>
              <p className={`text-xs font-mono mt-1 ${
                  description.valid ? "text-white/70" : "text-white/50"
              }`}>
                {description.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
