"use client";

import { useVanillaClient } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Mail, MessageSquare, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

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
  }, [enabled, email, slackWebhook, initialEnabled, initialEmail, initialSlack]);

  const updateAlerts = useMutation({
    mutationFn: (data: {
      id: string;
      errorAlertEnabled: boolean;
      errorAlertEmail: string | null;
      errorAlertSlack: string | null;
    }) => client.workflows.updateErrorAlerts.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      toast.success("Alert settings saved");
      setHasChanges(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          Error Alerts
        </CardTitle>
        <CardDescription>
          Get notified when this workflow fails
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Enable Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Error Alerts</Label>
            <p className="text-xs text-muted-foreground">
              Send notifications on workflow failure
            </p>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address
          </Label>
          <Input
            type="email"
            placeholder="alerts@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!enabled}
          />
        </div>

        {/* Slack Webhook */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Slack Webhook URL
          </Label>
          <Input
            type="url"
            placeholder="https://hooks.slack.com/services/..."
            value={slackWebhook}
            onChange={(e) => setSlackWebhook(e.target.value)}
            disabled={!enabled}
          />
          <p className="text-xs text-muted-foreground">
            Create an incoming webhook in your Slack workspace
          </p>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!hasChanges || updateAlerts.isPending}
          className="w-full gap-2"
        >
          <Save className="h-4 w-4" />
          {updateAlerts.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
}
