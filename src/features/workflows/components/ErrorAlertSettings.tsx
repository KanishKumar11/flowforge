"use client";

import { useVanillaClient } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Mail, MessageSquare, Save, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ErrorAlertSettingsProps {
  workflowId: string;
  initialEnabled: boolean;
  initialEmail: string | null;
  initialSlack: string | null;
}

export function ErrorAlertSettings({
  workflowId,
  initialEnabled,
  initialEmail,
  initialSlack,
}: ErrorAlertSettingsProps) {
  const client = useVanillaClient();
  const queryClient = useQueryClient();

  const [enabled, setEnabled] = useState(initialEnabled);
  const [email, setEmail] = useState(initialEmail || "");
  const [slackWebhook, setSlackWebhook] = useState(initialSlack || "");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changed =
      enabled !== initialEnabled ||
      email !== (initialEmail || "") ||
      slackWebhook !== (initialSlack || "");
    setHasChanges(changed);
  }, [
    enabled,
    email,
    slackWebhook,
    initialEnabled,
    initialEmail,
    initialSlack,
  ]);

  const updateAlerts = useMutation({
    mutationFn: (data: {
      id: string;
      errorAlertEnabled: boolean;
      errorAlertEmail: string | null;
      errorAlertSlack: string | null;
    }) => client.workflows.updateErrorAlerts.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      toast.success("Security Parameters Updated", {
        className: "bg-black border-emerald-500/20 text-emerald-400 font-mono tracking-wide text-xs",
      });
      setHasChanges(false);
    },
    onError: (error: Error) => {
      toast.error(error.message, {
        className: "bg-black border-red-500/20 text-red-500 font-mono tracking-wide text-xs",
      });
    },
  });

  const handleSave = () => {
    updateAlerts.mutate({
      id: workflowId,
      errorAlertEnabled: enabled,
      errorAlertEmail: email || null,
      errorAlertSlack: slackWebhook || null,
    });
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-[2rem] border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
      {/* Background Warning Glow */}
      {enabled && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-emerald-500/10 transition-colors duration-700 pointer-events-none" />
      )}

      <div className="flex items-start gap-4 mb-8 relative z-10 w-full justify-between">
        <div className="flex gap-4 items-center">
            <div className={`p-3 rounded-2xl border shadow-inner transition-colors ${
            enabled 
                ? "bg-emerald-500/10 border-emerald-500/20" 
                : "bg-white/5 border-white/10"
            }`}>
            <AlertTriangle className={`h-6 w-6 ${enabled ? "text-emerald-400" : "text-white/40"}`} />
            </div>
            <div>
            <h3 className="text-sm font-mono tracking-widest uppercase text-white font-bold">
                Error Alarms
            </h3>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">
                Dispatch alerts upon matrix failure
            </p>
            </div>
        </div>
        
        <Switch 
            checked={enabled} 
            onCheckedChange={setEnabled} 
            className="data-[state=checked]:bg-emerald-500"
        />
      </div>

      <motion.div 
        animate={{ height: enabled ? "auto" : 0, opacity: enabled ? 1 : 0 }}
        className="overflow-hidden space-y-6 relative z-10"
      >
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-emerald-400 ml-1">
            <Mail className="h-3 w-3" />
            Terminal Broadcast (Email)
          </Label>
          <Input
            type="email"
            placeholder="sysadmin@network.local"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!enabled}
            className="bg-black/50 border-white/10 text-white font-mono text-xs rounded-xl h-11 px-4 placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-emerald-400/50"
          />
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-emerald-400 ml-1">
            <MessageSquare className="h-3 w-3" />
            Slack Webhook URI
          </Label>
          <Input
            type="url"
            placeholder="https://hooks.slack.com/services/..."
            value={slackWebhook}
            onChange={(e) => setSlackWebhook(e.target.value)}
            disabled={!enabled}
            className="bg-black/50 border-white/10 text-white font-mono text-xs rounded-xl h-11 px-4 placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-emerald-400/50"
          />
          <p className="text-[9px] font-mono uppercase tracking-widest text-white/30 ml-2">
            Incoming webhook required for channel dispatch
          </p>
        </div>
      </motion.div>

      <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || updateAlerts.isPending}
          className={`w-full rounded-xl font-mono text-[10px] uppercase tracking-widest font-bold h-11 transition-all flex border border-transparent shadow-[0_0_20px_rgba(16,185,129,0)] ${
            hasChanges 
             ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] cursor-pointer" 
             : "bg-white/5 text-white/30 cursor-not-allowed border-white/5"
          }`}
        >
          {updateAlerts.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {updateAlerts.isPending ? "Committing..." : "Commit Override"}
        </Button>
      </div>
    </div>
  );
}
