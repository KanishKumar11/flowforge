"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Node } from "@xyflow/react";
import Editor from "@monaco-editor/react";
import { X, Plus, Copy, RefreshCw, Loader2 } from "lucide-react";
import { useTRPC, useVanillaClient } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface NodeConfigPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
  workflowId: string;
}

type CredentialProvider = string;

export function NodeConfigPanel({
  node,
  onClose,
  onUpdate,
  workflowId,
}: NodeConfigPanelProps) {
  const trpc = useTRPC();
  const client = useVanillaClient();
  const queryClient = useQueryClient();

  // Fetch credentials for integration nodes
  const { data: credentials, refetch: refetchCredentials } = useQuery(
    trpc.credentials.list.queryOptions(),
  );

  // Fetch webhook endpoints for this workflow (used in webhook node section)
  const { data: webhookEndpoints, refetch: refetchWebhooks } = useQuery(
    trpc.webhooks.list.queryOptions({ workflowId }),
  );

  // Inline create-credential dialog state
  const [credentialDialog, setCredentialDialog] = useState<{
    open: boolean;
    provider: CredentialProvider;
  }>({ open: false, provider: "custom" });
  const [newCred, setNewCred] = useState({
    name: "",
    type: "apiKey" as "apiKey" | "oauth2" | "basic" | "bearer" | "custom",
    provider: "custom",
    apiKey: "",
    smtpHost: "",
    smtpPort: "587",
    smtpSecure: false,
    smtpUser: "",
    smtpPass: "",
    smtpFrom: "",
  });

  const createCredentialMutation = useMutation({
    mutationFn: (data: {
      name: string;
      type: "apiKey" | "oauth2" | "basic" | "bearer" | "custom";
      provider: string;
      data: Record<string, unknown>;
    }) => client.credentials.create.mutate(data),
    onSuccess: () => {
      refetchCredentials();
      setCredentialDialog({ open: false, provider: "custom" });
      setNewCred({
        name: "",
        type: "apiKey",
        provider: "custom",
        apiKey: "",
        smtpHost: "",
        smtpPort: "587",
        smtpSecure: false,
        smtpUser: "",
        smtpPass: "",
        smtpFrom: "",
      });
      toast.success("Credential saved");
    },
    onError: (err: Error) =>
      toast.error("Failed to create credential", { description: err.message }),
  });

  const createWebhookMutation = useMutation({
    mutationFn: () =>
      client.webhooks.create.mutate({
        workflowId,
        method: "POST",
        isActive: true,
      }),
    onSuccess: () => refetchWebhooks(),
    onError: (err: Error) =>
      toast.error("Failed to create webhook endpoint", {
        description: err.message,
      }),
  });

  const regenerateWebhookMutation = useMutation({
    mutationFn: (id: string) => client.webhooks.regenerate.mutate({ id }),
    onSuccess: () => {
      refetchWebhooks();
      toast.success("Webhook URL regenerated");
    },
    onError: (err: Error) =>
      toast.error("Failed to regenerate", { description: err.message }),
  });

  const openCredentialDialog = (provider: CredentialProvider) => {
    setNewCred((prev) => ({
      ...prev,
      provider,
      name:
        provider.charAt(0).toUpperCase() + provider.slice(1) + " Credential",
    }));
    setCredentialDialog({ open: true, provider });
  };

  const handleCreateCredential = async () => {
    if (!newCred.name.trim()) return;
    const isSmtp = newCred.provider === "smtp";
    let credData: Record<string, unknown>;
    if (isSmtp) {
      credData = {
        host: newCred.smtpHost || "smtp.gmail.com",
        port: newCred.smtpPort || "587",
        secure: newCred.smtpSecure,
        user: newCred.smtpUser,
        pass: newCred.smtpPass,
        ...(newCred.smtpFrom && { from: newCred.smtpFrom }),
      };
    } else {
      credData = { apiKey: newCred.apiKey };
    }
    await createCredentialMutation.mutateAsync({
      name: newCred.name,
      type: newCred.type,
      provider: newCred.provider,
      data: credData,
    });
  };

  if (!node) return null;

  const updateConfig = (updates: Record<string, unknown>) => {
    onUpdate(node.id, {
      ...node.data,
      config: {
        ...(node.data.config as Record<string, unknown>),
        ...updates,
      },
    });
  };

  const handleConfigChange = (key: string, value: unknown) => {
    updateConfig({ [key]: value });
  };

  return (
    <>
      <div className="w-80 h-full bg-(--arch-bg) border-l border-(--arch-border) flex flex-col shadow-none z-50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-(--arch-border)">
          <div>
            <h3 className="font-bold text-sm text-(--arch-fg) font-mono uppercase tracking-wider">
              Configure Node
            </h3>
            <p className="text-xs text-(--arch-muted) font-mono">
              {node.data.label as string}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-fg) rounded-none"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Config Form */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {/* Common Fields */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block"
              >
                Node Name
              </Label>
              <Input
                id="name"
                value={(node.data.label as string) || ""}
                onChange={(e) =>
                  onUpdate(node.id, { ...node.data, label: e.target.value })
                }
                className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs h-9 focus-visible:ring-0"
              />
            </div>

            {/* Type-specific configuration */}
            {node.data.type === "http-request" && (
              <>
                <div className="space-y-2">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
                    Method
                  </Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)?.method ||
                      "GET"
                    }
                    onValueChange={(value) =>
                      handleConfigChange("method", value)
                    }
                  >
                    <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono">
                      <SelectItem
                        value="GET"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer"
                      >
                        GET
                      </SelectItem>
                      <SelectItem
                        value="POST"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer"
                      >
                        POST
                      </SelectItem>
                      <SelectItem
                        value="PUT"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer"
                      >
                        PUT
                      </SelectItem>
                      <SelectItem
                        value="PATCH"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer"
                      >
                        PATCH
                      </SelectItem>
                      <SelectItem
                        value="DELETE"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer"
                      >
                        DELETE
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="url"
                    className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider"
                  >
                    URL
                  </Label>
                  <Input
                    id="url"
                    placeholder="https://api.example.com/endpoint"
                    value={
                      (node.data.config as Record<string, string>)?.url || ""
                    }
                    onChange={(e) => handleConfigChange("url", e.target.value)}
                    className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted)"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
                    Auth Credential (Optional)
                  </Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)
                        ?.credentialId || ""
                    }
                    onValueChange={(value) =>
                      handleConfigChange(
                        "credentialId",
                        value === "__none__" ? "" : value,
                      )
                    }
                  >
                    <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono text-xs h-9">
                      <SelectValue placeholder="No auth (public endpoint)" />
                    </SelectTrigger>
                    <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono">
                      <SelectItem
                        value="__none__"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs"
                      >
                        No auth
                      </SelectItem>
                      {credentials?.map((cred) => (
                        <SelectItem
                          key={cred.id}
                          value={cred.id}
                          className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs"
                        >
                          {cred.name} ({cred.provider})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-(--arch-muted) font-mono">
                    If set, injects the credential as a Bearer Authorization
                    header.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="headers"
                    className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider"
                  >
                    Headers (JSON)
                  </Label>
                  <Textarea
                    id="headers"
                    placeholder='{"Content-Type": "application/json"}'
                    rows={3}
                    value={
                      (node.data.config as Record<string, string>)?.headers ||
                      ""
                    }
                    onChange={(e) =>
                      handleConfigChange("headers", e.target.value)
                    }
                    className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs"
                  />
                </div>
              </>
            )}

            {node.data.type === "code" && (
              <div className="space-y-2 h-[400px]">
                <Label htmlFor="code">JavaScript Code</Label>
                <div className="border border-border rounded-md overflow-hidden h-[360px]">
                  <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    value={
                      (node.data.config as Record<string, string>)?.code || ""
                    }
                    onChange={(value) =>
                      handleConfigChange("code", value || "")
                    }
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                </div>
              </div>
            )}

            {node.data.type === "schedule" && (
              <CronSchedulePicker
                key={node.id}
                value={(node.data.config as Record<string, string>)?.cron || ""}
                onChange={(cron) => handleConfigChange("cron", cron)}
              />
            )}

            {node.data.type === "email-inbox" && (
              <ImapTriggerConfig
                key={node.id}
                config={(node.data.config as Record<string, unknown>) || {}}
                credentials={credentials ?? []}
                onChange={handleConfigChange}
                onOpenCredentialDialog={openCredentialDialog}
              />
            )}

            {node.data.type === "transform" && (
              <div className="space-y-2">
                <Label htmlFor="expression">
                  Transform Expression (JavaScript)
                </Label>
                <Textarea
                  id="expression"
                  placeholder="({ result: input.someField * 2 })"
                  rows={5}
                  value={
                    (node.data.config as Record<string, string>)?.expression ||
                    ""
                  }
                  onChange={(e) =>
                    handleConfigChange("expression", e.target.value)
                  }
                  className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Write a JavaScript expression that evaluates to the
                  transformed output. The previous node's output is available as
                  `input`.
                </p>
              </div>
            )}

            {node.data.type === "webhook" &&
              (() => {
                // Webhook endpoints are stored in DB with a nanoid path, not the node id.
                // A workflow can have multiple webhook nodes; each node stores its own
                // webhookEndpointId in its config so the correct URL is always shown.
                const storedEndpointId = (
                  node.data.config as Record<string, string>
                )?.webhookEndpointId;
                const endpoint = webhookEndpoints?.find(
                  (w) => w.id === storedEndpointId,
                );
                const webhookUrl = endpoint
                  ? `${typeof window !== "undefined" ? window.location.origin : ""}/api/webhooks/${endpoint.path}`
                  : null;

                return (
                  <div className="space-y-3">
                    <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
                      Webhook URL
                    </Label>

                    {endpoint ? (
                      <>
                        <div className="p-3 bg-(--arch-bg-secondary) border border-(--arch-border) space-y-2">
                          <p className="text-[10px] text-(--arch-muted) font-mono uppercase tracking-wider">
                            Your webhook endpoint:
                          </p>
                          <code className="text-xs break-all text-(--arch-fg) font-mono block">
                            {webhookUrl}
                          </code>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="flex-1 h-8 text-xs font-mono rounded-none border-(--arch-border) text-(--arch-fg) hover:bg-(--arch-fg) hover:text-(--arch-bg) transition-colors"
                            onClick={() => {
                              if (webhookUrl) {
                                navigator.clipboard.writeText(webhookUrl);
                                toast.success("Webhook URL copied");
                              }
                            }}
                          >
                            <Copy className="w-3 h-3 mr-1.5" />
                            Copy URL
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="flex-1 h-8 text-xs font-mono rounded-none border-(--arch-border) text-(--arch-muted) hover:border-red-500/50 hover:text-red-400 transition-colors"
                            disabled={regenerateWebhookMutation.isPending}
                            onClick={() =>
                              regenerateWebhookMutation.mutate(endpoint.id)
                            }
                          >
                            {regenerateWebhookMutation.isPending ? (
                              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                            ) : (
                              <RefreshCw className="w-3 h-3 mr-1.5" />
                            )}
                            Regenerate
                          </Button>
                        </div>
                        <p className="text-[10px] text-(--arch-muted) font-mono">
                          Regenerating will invalidate the current URL. Update
                          any external services that use it.
                        </p>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <div className="p-3 border border-dashed border-(--arch-border) text-center">
                          <p className="text-xs text-(--arch-muted) font-mono mb-3">
                            No webhook endpoint provisioned yet.
                          </p>
                          <Button
                            type="button"
                            size="sm"
                            disabled={createWebhookMutation.isPending}
                            className="h-8 text-xs font-mono rounded-none bg-(--arch-fg) text-(--arch-bg) hover:bg-[rgba(var(--arch-fg-rgb)/0.9)]"
                            onClick={async () => {
                              const created =
                                await createWebhookMutation.mutateAsync();
                              // Store the endpoint id in the node config so this node
                              // always maps to its own unique webhook URL.
                              handleConfigChange(
                                "webhookEndpointId",
                                created.id,
                              );
                            }}
                          >
                            {createWebhookMutation.isPending ? (
                              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                            ) : (
                              <Plus className="w-3 h-3 mr-1.5" />
                            )}
                            Provision Webhook URL
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

            {node.data.type === "if" && (
              <ConditionBuilder
                key={node.id}
                value={
                  (node.data.config as Record<string, unknown>)?.conditions
                }
                rawCondition={
                  (node.data.config as Record<string, string>)?.condition || ""
                }
                onChange={(conditions, rawExpr) => {
                  handleConfigChange("conditions", conditions);
                  handleConfigChange("condition", rawExpr);
                }}
                label="Condition (IF)"
              />
            )}

            {(node.data.type === "wait" || node.data.type === "delay") && (
              <WaitDurationPicker
                key={node.id}
                value={
                  (node.data.config as Record<string, string>)?.duration || ""
                }
                onChange={(ms) => handleConfigChange("duration", ms)}
              />
            )}

            {node.data.type === "email" && (
              <>
                <div className="space-y-2">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
                    SMTP Credential
                  </Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)
                        ?.credentialId || ""
                    }
                    onValueChange={(value) =>
                      handleConfigChange("credentialId", value)
                    }
                  >
                    <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono text-xs h-9">
                      <SelectValue placeholder="Select an SMTP credential" />
                    </SelectTrigger>
                    <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono">
                      {credentials && credentials.length > 0 ? (
                        credentials.map((cred) => (
                          <SelectItem
                            key={cred.id}
                            value={cred.id}
                            className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs"
                          >
                            {cred.name}
                            {(cred.provider === "smtp" ||
                              cred.provider === "email") && (
                              <span className="ml-1 opacity-50">(SMTP)</span>
                            )}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="__no_credentials__" disabled>
                          No credentials — create one first
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={() => openCredentialDialog("smtp")}
                    className="flex items-center gap-1 text-[11px] font-mono text-(--arch-muted) hover:text-(--arch-fg) transition-colors mt-1"
                  >
                    <Plus className="w-3 h-3" />
                    Create new SMTP credential
                  </button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    placeholder="recipient@example.com or {{trigger.body.email}}"
                    value={
                      (node.data.config as Record<string, string>)?.to || ""
                    }
                    onChange={(e) => handleConfigChange("to", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Email subject"
                    value={
                      (node.data.config as Record<string, string>)?.subject ||
                      ""
                    }
                    onChange={(e) =>
                      handleConfigChange("subject", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailBody">Body</Label>
                  <Textarea
                    id="emailBody"
                    placeholder="Email content..."
                    rows={5}
                    value={
                      (node.data.config as Record<string, string>)?.emailBody ||
                      ""
                    }
                    onChange={(e) =>
                      handleConfigChange("emailBody", e.target.value)
                    }
                  />
                </div>
              </>
            )}

            {node.data.type === "set" && (
              <>
                <div className="space-y-2">
                  <Label>Mode</Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)?.mode ||
                      "overwrite"
                    }
                    onValueChange={(value) => handleConfigChange("mode", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overwrite">Overwrite</SelectItem>
                      <SelectItem value="append">Append</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <KeyValueBuilder
                  key={node.id}
                  value={(node.data.config as Record<string, unknown>)?.fields}
                  onChange={(fields) => handleConfigChange("fields", fields)}
                />
              </>
            )}

            {node.data.type === "filter" && (
              <ConditionBuilder
                key={node.id}
                value={
                  (node.data.config as Record<string, unknown>)?.conditions
                }
                rawCondition={
                  (node.data.config as Record<string, string>)?.condition || ""
                }
                onChange={(conditions, rawExpr) => {
                  handleConfigChange("conditions", conditions);
                  handleConfigChange("condition", rawExpr);
                }}
                label="Filter Condition"
                itemVar="item"
              />
            )}

            {node.data.type === "sort" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="sortField">Field</Label>
                  <Input
                    id="sortField"
                    placeholder="created_at"
                    value={
                      (node.data.config as Record<string, string>)?.field || ""
                    }
                    onChange={(e) =>
                      handleConfigChange("field", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Order</Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)?.order ||
                      "asc"
                    }
                    onValueChange={(value) =>
                      handleConfigChange("order", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {node.data.type === "slack" && (
              <>
                <div className="space-y-2">
                  <Label>Credential</Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)
                        ?.credentialId || ""
                    }
                    onValueChange={(value) =>
                      handleConfigChange("credentialId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Slack credential" />
                    </SelectTrigger>
                    <SelectContent>
                      {credentials
                        ?.filter((c) => c.provider === "slack")
                        .map((cred) => (
                          <SelectItem key={cred.id} value={cred.id}>
                            {cred.name}
                          </SelectItem>
                        ))}
                      {(!credentials ||
                        credentials.filter((c) => c.provider === "slack")
                          .length === 0) && (
                        <SelectItem value="__no_credentials__" disabled>
                          No Slack credentials found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={() => openCredentialDialog("slack")}
                    className="flex items-center gap-1 text-[11px] font-mono text-(--arch-muted) hover:text-(--arch-fg) transition-colors mt-1"
                  >
                    <Plus className="w-3 h-3" />
                    Create new Slack credential
                  </button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="channel">Channel</Label>
                  <Input
                    id="channel"
                    placeholder="#general"
                    value={
                      (node.data.config as Record<string, string>)?.channel ||
                      ""
                    }
                    onChange={(e) =>
                      handleConfigChange("channel", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Hello world!"
                    rows={4}
                    value={
                      (node.data.config as Record<string, string>)?.message ||
                      ""
                    }
                    onChange={(e) =>
                      handleConfigChange("message", e.target.value)
                    }
                  />
                </div>
              </>
            )}

            {node.data.type === "google_sheets" && (
              <>
                <div className="space-y-2">
                  <Label>Credential</Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)
                        ?.credentialId || ""
                    }
                    onValueChange={(value) =>
                      handleConfigChange("credentialId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Google credential" />
                    </SelectTrigger>
                    <SelectContent>
                      {credentials
                        ?.filter((c) => c.provider === "google")
                        .map((cred) => (
                          <SelectItem key={cred.id} value={cred.id}>
                            {cred.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Operation</Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)?.operation ||
                      "append_row"
                    }
                    onValueChange={(value) =>
                      handleConfigChange("operation", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="append_row">Append Row</SelectItem>
                      <SelectItem value="read_rows">Read Rows</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spreadsheetId">Spreadsheet ID</Label>
                  <Input
                    id="spreadsheetId"
                    placeholder="1BxiMVs0XRA5nFMdKbBdB_..."
                    value={
                      (node.data.config as Record<string, string>)
                        ?.spreadsheetId || ""
                    }
                    onChange={(e) =>
                      handleConfigChange("spreadsheetId", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="range">Range / Sheet Name</Label>
                  <Input
                    id="range"
                    placeholder="Sheet1!A1:B10"
                    value={
                      (node.data.config as Record<string, string>)?.range || ""
                    }
                    onChange={(e) =>
                      handleConfigChange("range", e.target.value)
                    }
                  />
                </div>
                {(node.data.config as Record<string, string>)?.operation ===
                  "append_row" && (
                  <div className="space-y-2">
                    <Label htmlFor="values">Values (JSON Array)</Label>
                    <Textarea
                      id="values"
                      placeholder='["Value 1", "Value 2"]'
                      rows={3}
                      value={JSON.stringify(
                        (node.data.config as Record<string, unknown>)?.values ||
                          [],
                        null,
                        2,
                      )}
                      onChange={(e) => {
                        try {
                          const values = JSON.parse(e.target.value);
                          handleConfigChange("values", values);
                        } catch (err) {
                          // Allow typing
                        }
                      }}
                    />
                  </div>
                )}
              </>
            )}

            {node.data.type === "github" && (
              <>
                <div className="space-y-2">
                  <Label>Credential</Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)
                        ?.credentialId || ""
                    }
                    onValueChange={(value) =>
                      handleConfigChange("credentialId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a GitHub credential" />
                    </SelectTrigger>
                    <SelectContent>
                      {credentials
                        ?.filter((c) => c.provider === "github")
                        .map((cred) => (
                          <SelectItem key={cred.id} value={cred.id}>
                            {cred.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Operation</Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)?.operation ||
                      "list_issues"
                    }
                    onValueChange={(value) =>
                      handleConfigChange("operation", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="list_issues">List Issues</SelectItem>
                      <SelectItem value="create_issue">Create Issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner">Owner</Label>
                  <Input
                    id="owner"
                    placeholder="facebook"
                    value={
                      (node.data.config as Record<string, string>)?.owner || ""
                    }
                    onChange={(e) =>
                      handleConfigChange("owner", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repo">Repo</Label>
                  <Input
                    id="repo"
                    placeholder="react"
                    value={
                      (node.data.config as Record<string, string>)?.repo || ""
                    }
                    onChange={(e) => handleConfigChange("repo", e.target.value)}
                  />
                </div>
              </>
            )}

            {node.data.type === "notion" && (
              <>
                <div className="space-y-2">
                  <Label>Credential</Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)
                        ?.credentialId || ""
                    }
                    onValueChange={(value) =>
                      handleConfigChange("credentialId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Notion credential" />
                    </SelectTrigger>
                    <SelectContent>
                      {credentials
                        ?.filter((c) => c.provider === "notion")
                        .map((cred) => (
                          <SelectItem key={cred.id} value={cred.id}>
                            {cred.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Operation</Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)?.operation ||
                      "create_page"
                    }
                    onValueChange={(value) =>
                      handleConfigChange("operation", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="create_page">Create Page</SelectItem>
                      <SelectItem value="query_database">
                        Query Database
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="databaseId">Database ID</Label>
                  <Input
                    id="databaseId"
                    placeholder="db_id"
                    value={
                      (node.data.config as Record<string, string>)
                        ?.databaseId || ""
                    }
                    onChange={(e) =>
                      handleConfigChange("databaseId", e.target.value)
                    }
                  />
                </div>
              </>
            )}

            {node.data.type === "loop" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="expression">
                    Transform Expression (Optional)
                  </Label>
                  <Input
                    id="expression"
                    placeholder="item.name"
                    value={
                      (node.data.config as Record<string, string>)
                        ?.expression || ""
                    }
                    onChange={(e) =>
                      handleConfigChange("expression", e.target.value)
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Apply a transformation to each item. Use &quot;item&quot;
                    and &quot;index&quot;.
                  </p>
                </div>
              </>
            )}

            {node.data.type === "switch" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="value">Switch Value</Label>
                  <Input
                    id="value"
                    placeholder="{{trigger.status}}"
                    value={
                      (node.data.config as Record<string, string>)?.value || ""
                    }
                    onChange={(e) =>
                      handleConfigChange("value", e.target.value)
                    }
                  />
                </div>
                <SwitchCasesBuilder
                  key={node.id}
                  value={
                    (node.data.config as Record<string, string>)?.cases || "[]"
                  }
                  onChange={(json) => handleConfigChange("cases", json)}
                />
                <div className="space-y-2">
                  <Label htmlFor="default">Default Output</Label>
                  <Input
                    id="default"
                    placeholder="unknown"
                    value={
                      (node.data.config as Record<string, string>)?.default ||
                      ""
                    }
                    onChange={(e) =>
                      handleConfigChange("default", e.target.value)
                    }
                  />
                </div>
              </>
            )}

            {node.data.type === "openai" && (
              <>
                <div className="space-y-2">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
                    Provider
                  </Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)?.provider ||
                      "openai"
                    }
                    onValueChange={(value) => {
                      // Reset model when provider changes to a default relevant to that provider
                      const defaultModels: Record<string, string> = {
                        openai: "gpt-5.2-pro",
                        anthropic: "claude-sonnet-4-5",
                        google: "gemini-3-flash-preview",
                      };
                      updateConfig({
                        provider: value,
                        model: defaultModels[value] || "gpt-5.2-pro",
                      });
                    }}
                  >
                    <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono text-xs h-9 focus:ring-1 focus:ring-(--arch-fg) hover:border-(--arch-fg) transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono z-50">
                      <SelectItem
                        value="openai"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                      >
                        OpenAI
                      </SelectItem>
                      <SelectItem
                        value="anthropic"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                      >
                        Anthropic
                      </SelectItem>
                      <SelectItem
                        value="google"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                      >
                        Google Gemini
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Credential (optional)</Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)
                        ?.credentialId || ""
                    }
                    onValueChange={(value) =>
                      handleConfigChange("credentialId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an API credential" />
                    </SelectTrigger>
                    <SelectContent>
                      {credentials
                        ?.filter((c) => {
                          const selectedProvider =
                            (node.data.config as Record<string, string>)
                              ?.provider || "openai";
                          // Show credentials matching the selected AI provider, plus custom
                          return (
                            c.provider === selectedProvider ||
                            c.provider === "custom"
                          );
                        })
                        .map((cred) => (
                          <SelectItem key={cred.id} value={cred.id}>
                            {cred.name} ({cred.provider})
                          </SelectItem>
                        ))}
                      {(!credentials ||
                        credentials.filter((c) => {
                          const selectedProvider =
                            (node.data.config as Record<string, string>)
                              ?.provider || "openai";
                          return (
                            c.provider === selectedProvider ||
                            c.provider === "custom"
                          );
                        }).length === 0) && (
                        <SelectItem value="__no_credentials__" disabled>
                          No{" "}
                          {(
                            (node.data.config as Record<string, string>)
                              ?.provider || "openai"
                          ).toUpperCase()}{" "}
                          credentials found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={() => {
                      const provider =
                        (node.data.config as Record<string, string>)
                          ?.provider || "openai";
                      openCredentialDialog(provider);
                    }}
                    className="flex items-center gap-1 text-[11px] font-mono text-(--arch-muted) hover:text-(--arch-fg) transition-colors mt-1"
                  >
                    <Plus className="w-3 h-3" />
                    Create new{" "}
                    {(
                      (node?.data?.config as Record<string, string>)
                        ?.provider || "openai"
                    ).toUpperCase()}{" "}
                    credential
                  </button>
                  <p className="text-xs text-muted-foreground">
                    Select a credential matching your chosen provider. Otherwise
                    env vars will be used.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
                    Model
                  </Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)?.model ||
                      "gpt-5.2-pro"
                    }
                    onValueChange={(value) => updateConfig({ model: value })}
                  >
                    <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono text-xs h-9 focus:ring-1 focus:ring-(--arch-fg) hover:border-(--arch-fg) transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono z-50">
                      {(node.data.config as Record<string, string>)
                        ?.provider === "anthropic" ? (
                        <>
                          <SelectItem
                            value="claude-sonnet-4-5"
                            className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                          >
                            Claude 4.5 Sonnet
                          </SelectItem>
                          <SelectItem
                            value="claude-haiku-4-5"
                            className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                          >
                            Claude 4.5 Haiku
                          </SelectItem>
                          <SelectItem
                            value="claude-opus-4-5"
                            className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                          >
                            Claude 4.5 Opus
                          </SelectItem>
                        </>
                      ) : (node.data.config as Record<string, string>)
                          ?.provider === "google" ? (
                        <>
                          <SelectItem
                            value="gemini-3-pro-preview"
                            className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                          >
                            Gemini 3 Pro (Preview)
                          </SelectItem>
                          <SelectItem
                            value="gemini-3-flash-preview"
                            className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                          >
                            Gemini 3 Flash (Preview)
                          </SelectItem>
                          <SelectItem
                            value="gemini-2.5-pro"
                            className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                          >
                            Gemini 2.5 Pro
                          </SelectItem>
                          <SelectItem
                            value="gemini-2.5-flash"
                            className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                          >
                            Gemini 2.5 Flash
                          </SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem
                            value="gpt-5.2-pro"
                            className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                          >
                            GPT-5.2 Pro
                          </SelectItem>
                          <SelectItem
                            value="gpt-5.2-instant"
                            className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                          >
                            GPT-5.2 Instant
                          </SelectItem>
                          <SelectItem
                            value="gpt-5.2-thinking"
                            className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                          >
                            GPT-5.2 Thinking
                          </SelectItem>
                          <SelectItem
                            value="o3-deep-research"
                            className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                          >
                            o3 Deep Research
                          </SelectItem>
                          <SelectItem
                            value="gpt-4o"
                            className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                          >
                            GPT-4o (Legacy)
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="systemPrompt"
                    className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block"
                  >
                    System Prompt (Optional)
                  </Label>
                  <Textarea
                    id="systemPrompt"
                    placeholder="You are a helpful assistant..."
                    rows={2}
                    value={
                      (node.data.config as Record<string, string>)
                        ?.systemPrompt || ""
                    }
                    onChange={(e) =>
                      updateConfig({ systemPrompt: e.target.value })
                    }
                    className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs min-h-[60px] focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="prompt"
                    className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block"
                  >
                    Prompt
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="Summarize: {{trigger.text}}"
                    rows={4}
                    value={
                      (node.data.config as Record<string, string>)?.prompt || ""
                    }
                    onChange={(e) => updateConfig({ prompt: e.target.value })}
                    className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs min-h-[100px] focus-visible:ring-0"
                  />
                </div>
              </>
            )}

            {node.data.type === "comment" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="content">Note Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Add your notes here..."
                    rows={6}
                    value={
                      (node.data.config as Record<string, string>)?.content ||
                      ""
                    }
                    onChange={(e) =>
                      handleConfigChange("content", e.target.value)
                    }
                    className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs min-h-[100px] focus-visible:ring-0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Comments are for documentation only and do not affect
                    execution.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Background Color</Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)?.color ||
                      "yellow"
                    }
                    onValueChange={(value) =>
                      handleConfigChange("color", value)
                    }
                  >
                    <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono text-xs h-9 focus:ring-1 focus:ring-(--arch-fg) hover:border-(--arch-fg) transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono z-50">
                      <SelectItem
                        value="yellow"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                      >
                        Yellow
                      </SelectItem>
                      <SelectItem
                        value="blue"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                      >
                        Blue
                      </SelectItem>
                      <SelectItem
                        value="green"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                      >
                        Green
                      </SelectItem>
                      <SelectItem
                        value="pink"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                      >
                        Pink
                      </SelectItem>
                      <SelectItem
                        value="purple"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                      >
                        Purple
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {node.data.type === "sub-workflow" && (
              <>
                <SubWorkflowPicker
                  value={
                    (node.data.config as Record<string, string>)?.workflowId ||
                    ""
                  }
                  onChange={(id) => handleConfigChange("workflowId", id)}
                />
                <div className="space-y-2">
                  <Label>Wait for Completion</Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)?.waitMode ||
                      "async"
                    }
                    onValueChange={(value) =>
                      handleConfigChange("waitMode", value)
                    }
                  >
                    <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono text-xs h-9 focus:ring-1 focus:ring-(--arch-fg) hover:border-(--arch-fg) transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono z-50">
                      <SelectItem
                        value="async"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                      >
                        Async (fire and forget)
                      </SelectItem>
                      <SelectItem
                        value="sync"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                      >
                        Sync (wait for result)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {node.data.type === "merge" && (
              <>
                <div className="space-y-2">
                  <Label>Merge Mode</Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)?.mode ||
                      "combine"
                    }
                    onValueChange={(value) => handleConfigChange("mode", value)}
                  >
                    <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono text-xs h-9 focus:ring-1 focus:ring-(--arch-fg) hover:border-(--arch-fg) transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono z-50">
                      <SelectItem
                        value="combine"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                      >
                        Combine (all inputs as array)
                      </SelectItem>
                      <SelectItem
                        value="append"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                      >
                        Append (flatten arrays)
                      </SelectItem>
                      <SelectItem
                        value="multiplex"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                      >
                        Multiplex (output each)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    How to combine inputs from multiple branches.
                  </p>
                </div>
              </>
            )}

            {node.data.type === "stripe" && (
              <>
                <div className="space-y-2">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
                    Credential
                  </Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)
                        ?.credentialId || ""
                    }
                    onValueChange={(value) =>
                      handleConfigChange("credentialId", value)
                    }
                  >
                    <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono text-xs h-9 focus:ring-1 focus:ring-(--arch-fg)">
                      <SelectValue placeholder="Select a Stripe credential" />
                    </SelectTrigger>
                    <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono z-50">
                      {credentials
                        ?.filter(
                          (c) =>
                            c.provider === "stripe" || c.provider === "custom",
                        )
                        .map((cred) => (
                          <SelectItem
                            key={cred.id}
                            value={cred.id}
                            className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                          >
                            {cred.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Operation</Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)?.operation ||
                      "create_payment_intent"
                    }
                    onValueChange={(value) =>
                      handleConfigChange("operation", value)
                    }
                  >
                    <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono text-xs h-9 focus:ring-1 focus:ring-(--arch-fg) hover:border-(--arch-fg) transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono z-50">
                      <SelectItem
                        value="create_payment_intent"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                      >
                        Create Payment Intent
                      </SelectItem>
                      <SelectItem
                        value="list_customers"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                      >
                        List Customers
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <StripeAmountInput
                  key={node.id}
                  amount={
                    (node.data.config as Record<string, string>)?.amount || ""
                  }
                  currency={
                    (node.data.config as Record<string, string>)?.currency ||
                    "usd"
                  }
                  onAmountChange={(v) => handleConfigChange("amount", v)}
                  onCurrencyChange={(v) => handleConfigChange("currency", v)}
                />
              </>
            )}

            {node.data.type === "twilio" && (
              <>
                <div className="space-y-2">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
                    Credential
                  </Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)
                        ?.credentialId || ""
                    }
                    onValueChange={(value) =>
                      handleConfigChange("credentialId", value)
                    }
                  >
                    <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono text-xs h-9 focus:ring-1 focus:ring-(--arch-fg)">
                      <SelectValue placeholder="Select a Twilio credential" />
                    </SelectTrigger>
                    <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono z-50">
                      {credentials
                        ?.filter(
                          (c) =>
                            c.provider === "twilio" || c.provider === "custom",
                        )
                        .map((cred) => (
                          <SelectItem
                            key={cred.id}
                            value={cred.id}
                            className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                          >
                            {cred.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">To Phone Number</Label>
                  <Input
                    id="to"
                    placeholder="+1234567890"
                    value={
                      (node.data.config as Record<string, string>)?.to || ""
                    }
                    onChange={(e) => handleConfigChange("to", e.target.value)}
                    className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs h-9 focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from">From Phone Number (optional)</Label>
                  <Input
                    id="from"
                    placeholder="+1234567890"
                    value={
                      (node.data.config as Record<string, string>)?.from || ""
                    }
                    onChange={(e) => handleConfigChange("from", e.target.value)}
                    className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs h-9 focus-visible:ring-0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use TWILIO_PHONE_NUMBER from env.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Message Body</Label>
                  <Textarea
                    id="body"
                    placeholder="Your message here..."
                    rows={4}
                    value={
                      (node.data.config as Record<string, string>)?.body || ""
                    }
                    onChange={(e) => handleConfigChange("body", e.target.value)}
                    className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs min-h-[80px] focus-visible:ring-0"
                  />
                </div>
              </>
            )}

            {/* ─── Discord ───────────────────────────────────────────── */}
            {node.data.type === "discord" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="discord-webhook">Webhook URL</Label>
                  <Input
                    id="discord-webhook"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={
                      (node.data.config as Record<string, string>)
                        ?.webhookUrl || ""
                    }
                    onChange={(e) =>
                      handleConfigChange("webhookUrl", e.target.value)
                    }
                    className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs h-9 focus-visible:ring-0"
                  />
                  <p className="text-[11px] text-(--arch-muted) font-mono">
                    Discord server → Edit Channel → Integrations → Webhooks
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discord-message">Message</Label>
                  <Textarea
                    id="discord-message"
                    placeholder="Hello from Flowgent! {{trigger.body.name}}"
                    rows={4}
                    value={
                      (node.data.config as Record<string, string>)?.message ||
                      ""
                    }
                    onChange={(e) =>
                      handleConfigChange("message", e.target.value)
                    }
                    className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs min-h-[80px] focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discord-username">
                    Bot Username (optional)
                  </Label>
                  <Input
                    id="discord-username"
                    placeholder="Flowgent Bot"
                    value={
                      (node.data.config as Record<string, string>)?.username ||
                      ""
                    }
                    onChange={(e) =>
                      handleConfigChange("username", e.target.value)
                    }
                    className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs h-9 focus-visible:ring-0"
                  />
                </div>
              </>
            )}

            {/* ─── Telegram ──────────────────────────────────────────── */}
            {node.data.type === "telegram" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="tg-token">Bot Token</Label>
                  <Input
                    id="tg-token"
                    type="password"
                    placeholder="123456:ABC-DEF..."
                    value={
                      (node.data.config as Record<string, string>)?.botToken ||
                      ""
                    }
                    onChange={(e) =>
                      handleConfigChange("botToken", e.target.value)
                    }
                    className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs h-9 focus-visible:ring-0"
                  />
                  <p className="text-[11px] text-(--arch-muted) font-mono">
                    Get from @BotFather on Telegram
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tg-chatid">Chat ID</Label>
                  <Input
                    id="tg-chatid"
                    placeholder="-1001234567890"
                    value={
                      (node.data.config as Record<string, string>)?.chatId || ""
                    }
                    onChange={(e) =>
                      handleConfigChange("chatId", e.target.value)
                    }
                    className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs h-9 focus-visible:ring-0"
                  />
                  <p className="text-[11px] text-(--arch-muted) font-mono">
                    Group/channel ID (negative) or user ID
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tg-text">Message Text</Label>
                  <Textarea
                    id="tg-text"
                    placeholder="Hello <b>{{trigger.body.name}}</b>!"
                    rows={4}
                    value={
                      (node.data.config as Record<string, string>)?.text || ""
                    }
                    onChange={(e) => handleConfigChange("text", e.target.value)}
                    className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs min-h-[80px] focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Parse Mode</Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)?.parseMode ||
                      "HTML"
                    }
                    onValueChange={(v) => handleConfigChange("parseMode", v)}
                  >
                    <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono z-50">
                      <SelectItem
                        value="HTML"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                      >
                        HTML
                      </SelectItem>
                      <SelectItem
                        value="Markdown"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                      >
                        Markdown
                      </SelectItem>
                      <SelectItem
                        value="MarkdownV2"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                      >
                        MarkdownV2
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* ─── Database (PostgreSQL) ─────────────────────────────── */}
            {node.data.type === "database" && (
              <>
                <div className="space-y-2">
                  <Label>PostgreSQL Credential</Label>
                  <Select
                    value={
                      (node.data.config as Record<string, string>)
                        ?.credentialId || ""
                    }
                    onValueChange={(value) =>
                      handleConfigChange("credentialId", value)
                    }
                  >
                    <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono text-xs h-9 focus:ring-1 focus:ring-(--arch-fg)">
                      <SelectValue placeholder="Select a credential" />
                    </SelectTrigger>
                    <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono z-50">
                      {credentials
                        ?.filter(
                          (c) =>
                            c.provider === "postgres" ||
                            c.provider === "postgresql" ||
                            c.provider === "database" ||
                            c.provider === "custom",
                        )
                        .map((cred) => (
                          <SelectItem
                            key={cred.id}
                            value={cred.id}
                            className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
                          >
                            {cred.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-(--arch-muted) font-mono">
                    Credential must contain a{" "}
                    <code className="bg-[rgba(var(--arch-fg-rgb)/0.1)] px-1">
                      connectionString
                    </code>{" "}
                    field.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-query">SQL Query</Label>
                  <Textarea
                    id="db-query"
                    placeholder="SELECT * FROM users WHERE email = '{{trigger.body.email}}'"
                    rows={6}
                    value={
                      (node.data.config as Record<string, string>)?.query || ""
                    }
                    onChange={(e) =>
                      handleConfigChange("query", e.target.value)
                    }
                    className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs min-h-[100px] focus-visible:ring-0"
                  />
                  <p className="text-[11px] text-(--arch-muted) font-mono">
                    Use{" "}
                    <code className="bg-[rgba(var(--arch-fg-rgb)/0.1)] px-1">
                      {"{{nodeId.field}}"}
                    </code>{" "}
                    to inject values from previous nodes.
                  </p>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* ── Inline Create Credential Dialog ──────────────────────────────── */}
      <Dialog
        open={credentialDialog.open}
        onOpenChange={(open) => setCredentialDialog((p) => ({ ...p, open }))}
      >
        <DialogContent className="sm:max-w-[460px] bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-5 border-b border-(--arch-border) bg-(--arch-bg-secondary)">
            <DialogTitle className="font-mono uppercase text-sm tracking-widest text-(--arch-fg)">
              New{" "}
              {credentialDialog.provider.charAt(0).toUpperCase() +
                credentialDialog.provider.slice(1)}{" "}
              Credential
            </DialogTitle>
            <DialogDescription className="font-mono text-xs text-(--arch-muted) mt-1">
              Saved credentials are encrypted at rest and scoped to your team.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 p-5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
                Name
              </Label>
              <Input
                placeholder="MY_SMTP_01"
                value={newCred.name}
                onChange={(e) =>
                  setNewCred({ ...newCred, name: e.target.value })
                }
                className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-9 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
              />
            </div>

            {/* SMTP fields */}
            {newCred.provider === "smtp" ? (
              <>
                {/* Provider presets */}
                <div className="space-y-1.5">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
                    Email Provider
                  </Label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(
                      [
                        {
                          label: "Gmail",
                          host: "smtp.gmail.com",
                          port: "587",
                          secure: false,
                        },
                        {
                          label: "Outlook",
                          host: "smtp-mail.outlook.com",
                          port: "587",
                          secure: false,
                        },
                        {
                          label: "Yahoo",
                          host: "smtp.mail.yahoo.com",
                          port: "465",
                          secure: true,
                        },
                        {
                          label: "Custom",
                          host: "",
                          port: "587",
                          secure: false,
                        },
                      ] as const
                    ).map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() =>
                          setNewCred({
                            ...newCred,
                            smtpHost: preset.host,
                            smtpPort: preset.port,
                            smtpSecure: preset.secure,
                          })
                        }
                        className={`py-1.5 text-xs font-mono border transition-colors ${
                          newCred.smtpHost === preset.host
                            ? "border-(--arch-fg) bg-(--arch-fg) text-(--arch-bg)"
                            : "border-(--arch-border) text-(--arch-muted) hover:border-(--arch-fg) hover:text-(--arch-fg)"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
                      SMTP Host
                    </Label>
                    <Input
                      placeholder="smtp.gmail.com"
                      value={newCred.smtpHost}
                      onChange={(e) =>
                        setNewCred({ ...newCred, smtpHost: e.target.value })
                      }
                      className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-9 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
                      Port
                    </Label>
                    <Input
                      placeholder="587"
                      value={newCred.smtpPort}
                      onChange={(e) =>
                        setNewCred({ ...newCred, smtpPort: e.target.value })
                      }
                      className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-9 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
                    Email Address
                  </Label>
                  <Input
                    placeholder="you@gmail.com"
                    value={newCred.smtpUser}
                    onChange={(e) =>
                      setNewCred({ ...newCred, smtpUser: e.target.value })
                    }
                    className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-9 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
                    Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="App password or account password"
                    value={newCred.smtpPass}
                    onChange={(e) =>
                      setNewCred({ ...newCred, smtpPass: e.target.value })
                    }
                    className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-9 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
                    From{" "}
                    <span className="normal-case text-(--arch-muted)">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    placeholder='"My App" <noreply@yourdomain.com>'
                    value={newCred.smtpFrom}
                    onChange={(e) =>
                      setNewCred({ ...newCred, smtpFrom: e.target.value })
                    }
                    className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-9 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
                  />
                </div>
                {newCred.smtpHost === "smtp.gmail.com" && (
                  <div className="p-3 border border-yellow-500/30 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400 text-xs font-mono">
                    Gmail requires an <strong>App Password</strong> — your
                    regular password won&apos;t work. Create one at{" "}
                    <span className="underline">
                      myaccount.google.com/apppasswords
                    </span>
                    .
                  </div>
                )}
              </>
            ) : (
              /* Generic API key / bearer token field */
              <div className="space-y-1.5">
                <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
                  Secret / Token
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••••••••••••••"
                  value={newCred.apiKey}
                  onChange={(e) =>
                    setNewCred({ ...newCred, apiKey: e.target.value })
                  }
                  className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-9 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
                />
              </div>
            )}
          </div>

          <DialogFooter className="p-5 border-t border-(--arch-border) bg-(--arch-bg-secondary) flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() =>
                setCredentialDialog({ open: false, provider: "custom" })
              }
              className="text-(--arch-muted) hover:text-(--arch-fg) hover:bg-[rgba(var(--arch-fg-rgb)/0.1)] font-mono uppercase text-xs rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCredential}
              disabled={
                !newCred.name.trim() || createCredentialMutation.isPending
              }
              className="bg-(--arch-fg) text-(--arch-bg) hover:bg-[rgba(var(--arch-fg-rgb)/0.9)] rounded-none font-mono uppercase text-xs px-5"
            >
              {createCredentialMutation.isPending && (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              )}
              Save Credential
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Wait Duration Picker ────────────────────────────────────────────────────

type TimeUnit = "s" | "m" | "h" | "d" | "w";

const UNIT_MS: Record<TimeUnit, number> = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
  w: 604_800_000,
};

const UNIT_LABELS: Record<TimeUnit, string> = {
  s: "Seconds",
  m: "Minutes",
  h: "Hours",
  d: "Days",
  w: "Weeks",
};

const PRESETS: { label: string; ms: number }[] = [
  { label: "30s", ms: 30_000 },
  { label: "5m", ms: 300_000 },
  { label: "30m", ms: 1_800_000 },
  { label: "1h", ms: 3_600_000 },
  { label: "6h", ms: 21_600_000 },
  { label: "1d", ms: 86_400_000 },
  { label: "3d", ms: 259_200_000 },
  { label: "1w", ms: 604_800_000 },
];

function detectBestUnit(ms: number): TimeUnit {
  if (ms >= 604_800_000 && ms % 604_800_000 === 0) return "w";
  if (ms >= 86_400_000 && ms % 86_400_000 === 0) return "d";
  if (ms >= 3_600_000 && ms % 3_600_000 === 0) return "h";
  if (ms >= 60_000 && ms % 60_000 === 0) return "m";
  return "s";
}

function humanizeDuration(ms: number): string {
  if (!ms || ms <= 0) return "—";
  const w = Math.floor(ms / 604_800_000);
  const d = Math.floor((ms % 604_800_000) / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1_000);
  const parts: string[] = [];
  if (w) parts.push(`${w} week${w !== 1 ? "s" : ""}`);
  if (d) parts.push(`${d} day${d !== 1 ? "s" : ""}`);
  if (h) parts.push(`${h} hour${h !== 1 ? "s" : ""}`);
  if (m) parts.push(`${m} min`);
  if (s) parts.push(`${s} sec`);
  return parts.join(", ") || "< 1 sec";
}

function WaitDurationPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (ms: string) => void;
}) {
  const initialMs = parseInt(value, 10) || 0;
  const initialUnit = initialMs > 0 ? detectBestUnit(initialMs) : "m";
  const initialAmount =
    initialMs > 0 ? String(initialMs / UNIT_MS[initialUnit]) : "1";

  const [unit, setUnit] = useState<TimeUnit>(initialUnit);
  const [amount, setAmount] = useState<string>(initialAmount);

  const currentMs = Math.round((parseFloat(amount) || 0) * UNIT_MS[unit]);

  const applyChange = (newAmount: string, newUnit: TimeUnit) => {
    const num = parseFloat(newAmount);
    if (!isNaN(num) && num > 0) {
      onChange(String(Math.round(num * UNIT_MS[newUnit])));
    }
  };

  const handleAmountChange = (val: string) => {
    setAmount(val);
    applyChange(val, unit);
  };

  const handleUnitChange = (newUnit: TimeUnit) => {
    setUnit(newUnit);
    applyChange(amount, newUnit);
  };

  const handlePreset = (presetMs: number) => {
    const u = detectBestUnit(presetMs);
    const a = String(presetMs / UNIT_MS[u]);
    setUnit(u);
    setAmount(a);
    onChange(String(presetMs));
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
        Wait Duration
      </Label>

      {/* Amount + Unit row */}
      <div className="flex">
        <Input
          type="number"
          min="1"
          step="1"
          placeholder="1"
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          className="bg-(--arch-bg) border-(--arch-border) border-r-0 focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs h-9 focus-visible:ring-0 w-20 shrink-0"
        />
        <Select
          value={unit}
          onValueChange={(v) => handleUnitChange(v as TimeUnit)}
        >
          <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono text-xs h-9 flex-1 focus:ring-0 focus:border-(--arch-fg)">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono">
            {(Object.keys(UNIT_LABELS) as TimeUnit[]).map((u) => (
              <SelectItem
                key={u}
                value={u}
                className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs"
              >
                {UNIT_LABELS[u]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap gap-1">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => handlePreset(p.ms)}
            className={`px-2 py-0.5 text-[10px] font-mono uppercase border transition-all ${
              currentMs === p.ms
                ? "bg-(--arch-fg) text-(--arch-bg) border-(--arch-fg)"
                : "bg-(--arch-bg) text-(--arch-muted) border-(--arch-border) hover:text-(--arch-fg) hover:border-(--arch-fg)"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Human summary */}
      {currentMs > 0 && (
        <p className="text-[10px] font-mono text-(--arch-muted) border-l-2 border-(--arch-border) pl-2">
          {humanizeDuration(currentMs)}
          <span className="ml-2 opacity-50">
            ({currentMs.toLocaleString()} ms)
          </span>
        </p>
      )}
    </div>
  );
}

// ─── Cron Schedule Picker ────────────────────────────────────────────────────

const CRON_PRESETS: { label: string; cron: string; description: string }[] = [
  { label: "1m", cron: "* * * * *", description: "Every minute" },
  { label: "5m", cron: "*/5 * * * *", description: "Every 5 minutes" },
  { label: "15m", cron: "*/15 * * * *", description: "Every 15 minutes" },
  { label: "30m", cron: "*/30 * * * *", description: "Every 30 minutes" },
  { label: "1h", cron: "0 * * * *", description: "Every hour" },
  { label: "2h", cron: "0 */2 * * *", description: "Every 2 hours" },
  { label: "9am", cron: "0 9 * * *", description: "Daily at 9:00 AM" },
  { label: "midnight", cron: "0 0 * * *", description: "Daily at midnight" },
  { label: "weekly", cron: "0 9 * * 1", description: "Every Monday at 9 AM" },
  { label: "monthly", cron: "0 0 1 * *", description: "1st of each month" },
];

function describeCron(cron: string): string {
  const preset = CRON_PRESETS.find((p) => p.cron === cron.trim());
  if (preset) return preset.description;
  if (!cron.trim()) return "—";
  return `Custom expression`;
}

function CronSchedulePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (cron: string) => void;
}) {
  const isPreset = CRON_PRESETS.some((p) => p.cron === value);
  const [showCustom, setShowCustom] = useState(!isPreset && !!value);

  return (
    <div className="space-y-3">
      <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
        Schedule
      </Label>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-1">
        {CRON_PRESETS.map((p) => (
          <button
            key={p.cron}
            type="button"
            onClick={() => {
              setShowCustom(false);
              onChange(p.cron);
            }}
            className={`px-2 py-0.5 text-[10px] font-mono uppercase border transition-all ${
              value === p.cron && !showCustom
                ? "bg-(--arch-fg) text-(--arch-bg) border-(--arch-fg)"
                : "bg-(--arch-bg) text-(--arch-muted) border-(--arch-border) hover:text-(--arch-fg) hover:border-(--arch-fg)"
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowCustom(true)}
          className={`px-2 py-0.5 text-[10px] font-mono uppercase border transition-all ${
            showCustom || (!isPreset && value)
              ? "bg-(--arch-fg) text-(--arch-bg) border-(--arch-fg)"
              : "bg-(--arch-bg) text-(--arch-muted) border-(--arch-border) hover:text-(--arch-fg) hover:border-(--arch-fg)"
          }`}
        >
          custom
        </button>
      </div>

      {/* Custom cron input */}
      {(showCustom || (!isPreset && value)) && (
        <Input
          placeholder="*/5 * * * *"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs h-9 focus-visible:ring-0"
        />
      )}

      {/* Human summary */}
      {value && (
        <p className="text-[10px] font-mono text-(--arch-muted) border-l-2 border-(--arch-border) pl-2">
          {describeCron(value)}
          {(!isPreset || showCustom) && value && (
            <span className="ml-2 opacity-50">{value}</span>
          )}
        </p>
      )}
    </div>
  );
}

// ─── IMAP Trigger Config ─────────────────────────────────────────────────────

interface Credential {
  id: string;
  name: string;
  provider: string;
}

function ImapTriggerConfig({
  config,
  credentials,
  onChange,
  onOpenCredentialDialog,
}: {
  config: Record<string, unknown>;
  credentials: Credential[];
  onChange: (key: string, value: unknown) => void;
  onOpenCredentialDialog: (provider: string) => void;
}) {
  const imapCredentials = credentials.filter((c) => c.provider === "imap");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
          IMAP Credential
        </Label>
        <Select
          value={(config.credentialId as string) || ""}
          onValueChange={(v) => onChange("credentialId", v)}
        >
          <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono text-xs h-9 focus:ring-1 focus:ring-(--arch-fg) hover:border-(--arch-fg) transition-colors">
            <SelectValue placeholder="Select IMAP credential" />
          </SelectTrigger>
          <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono z-50">
            {imapCredentials.length === 0 && (
              <div className="px-3 py-2 text-xs text-(--arch-muted) font-mono">
                No IMAP credentials found
              </div>
            )}
            {imapCredentials.map((c) => (
              <SelectItem
                key={c.id}
                value={c.id}
                className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
              >
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          type="button"
          onClick={() => onOpenCredentialDialog("imap")}
          className="text-[10px] font-mono uppercase text-(--arch-muted) hover:text-(--arch-fg) transition-colors"
        >
          + Add IMAP credential
        </button>
      </div>

      <div className="space-y-2">
        <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
          Mailbox / Folder
        </Label>
        <Input
          placeholder="INBOX"
          value={(config.mailbox as string) || ""}
          onChange={(e) => onChange("mailbox", e.target.value)}
          className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs h-9 focus-visible:ring-0"
        />
        <p className="text-[10px] font-mono text-(--arch-muted)">
          The mailbox to monitor. Defaults to INBOX.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
          Filter: From Address (optional)
        </Label>
        <Input
          placeholder="alerts@example.com"
          value={(config.filterFrom as string) || ""}
          onChange={(e) => onChange("filterFrom", e.target.value)}
          className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs h-9 focus-visible:ring-0"
        />
        <p className="text-[10px] font-mono text-(--arch-muted)">
          Only trigger for emails from this address.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
          Filter: Subject Contains (optional)
        </Label>
        <Input
          placeholder="support ticket"
          value={(config.filterSubject as string) || ""}
          onChange={(e) => onChange("filterSubject", e.target.value)}
          className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs h-9 focus-visible:ring-0"
        />
        <p className="text-[10px] font-mono text-(--arch-muted)">
          Only trigger when subject contains this text.
        </p>
      </div>

      <div className="p-2 border border-(--arch-border) bg-(--arch-bg-secondary)">
        <p className="text-[10px] font-mono text-(--arch-muted) leading-relaxed">
          <span className="text-(--arch-fg) font-bold">Trigger data:</span>{" "}
          <code>{"{{trigger.from}}"}</code>,{" "}
          <code>{"{{trigger.subject}}"}</code>,{" "}
          <code>{"{{trigger.body}}"}</code>,{" "}
          <code>{"{{trigger.date}}"}</code>,{" "}
          <code>{"{{trigger.messageId}}"}</code>
        </p>
      </div>
    </div>
  );
}

// ─── Sub-Workflow Picker ─────────────────────────────────────────────────────

function SubWorkflowPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const trpc = useTRPC();
  const { data: rawWorkflows, isLoading } = useQuery(
    trpc.workflows.list.queryOptions(),
  );
  const workflows = rawWorkflows as
    | Array<{ id: string; name: string }>
    | undefined;

  return (
    <div className="space-y-2">
      <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
        Workflow
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono text-xs h-9 focus:ring-1 focus:ring-(--arch-fg) hover:border-(--arch-fg) transition-colors">
          <SelectValue
            placeholder={isLoading ? "Loading..." : "Select a workflow"}
          />
        </SelectTrigger>
        <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono z-50">
          {workflows && workflows.length > 0 ? (
            workflows.map((wf) => (
              <SelectItem
                key={wf.id}
                value={wf.id}
                className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
              >
                {wf.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="__none__" disabled className="text-xs">
              {isLoading ? "Loading workflows..." : "No workflows found"}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      {value && !workflows?.find((w) => w.id === value) && !isLoading && (
        <p className="text-[10px] font-mono text-(--arch-muted)">ID: {value}</p>
      )}
    </div>
  );
}

// ─── Switch Cases Builder ────────────────────────────────────────────────────

type SwitchCase = { value: string; output: string };

function parseSwitchCases(raw: string): SwitchCase[] {
  try {
    const parsed = JSON.parse(raw || "[]");
    if (Array.isArray(parsed)) return parsed as SwitchCase[];
  } catch {
    // ignore parse errors
  }
  return [];
}

function SwitchCasesBuilder({
  value,
  onChange,
}: {
  value: string;
  onChange: (json: string) => void;
}) {
  const initial = parseSwitchCases(value);
  const [cases, setCases] = useState<SwitchCase[]>(
    initial.length ? initial : [{ value: "", output: "" }],
  );

  const commit = (updated: SwitchCase[]) => {
    setCases(updated);
    onChange(JSON.stringify(updated));
  };

  const updateRow = (i: number, field: keyof SwitchCase, val: string) =>
    commit(cases.map((c, idx) => (idx === i ? { ...c, [field]: val } : c)));
  const addRow = () => commit([...cases, { value: "", output: "" }]);
  const removeRow = (i: number) => commit(cases.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
        Cases
      </Label>
      <div className="grid grid-cols-[1fr_8px_1fr_16px] gap-x-1 items-center mb-1">
        <span className="text-[9px] font-mono text-(--arch-muted) uppercase">
          when
        </span>
        <span />
        <span className="text-[9px] font-mono text-(--arch-muted) uppercase">
          route to
        </span>
        <span />
      </div>
      <div className="space-y-1.5">
        {cases.map((c, i) => (
          <div key={i} className="flex gap-1 items-center">
            <Input
              placeholder="active"
              value={c.value}
              onChange={(e) => updateRow(i, "value", e.target.value)}
              className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none text-xs h-8 focus-visible:ring-0 flex-1"
            />
            <span className="text-[10px] text-(--arch-muted) font-mono shrink-0">
              →
            </span>
            <Input
              placeholder="output"
              value={c.output}
              onChange={(e) => updateRow(i, "output", e.target.value)}
              className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none text-xs h-8 focus-visible:ring-0 flex-1"
            />
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="shrink-0 text-(--arch-muted) hover:text-(--arch-fg) transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-1 text-[11px] font-mono text-(--arch-muted) hover:text-(--arch-fg) transition-colors mt-1"
      >
        <Plus className="w-3 h-3" />
        Add case
      </button>
    </div>
  );
}

// ─── Key-Value Builder (Set node) ────────────────────────────────────────────

type KVPair = { key: string; value: string };

function parseKVPairs(fields: unknown): KVPair[] {
  if (typeof fields === "object" && fields !== null && !Array.isArray(fields)) {
    return Object.entries(fields as Record<string, unknown>).map(([k, v]) => ({
      key: k,
      value: String(v),
    }));
  }
  return [];
}

function KeyValueBuilder({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (fields: Record<string, string>) => void;
}) {
  const initial = parseKVPairs(value);
  const [pairs, setPairs] = useState<KVPair[]>(
    initial.length ? initial : [{ key: "", value: "" }],
  );

  const commit = (updated: KVPair[]) => {
    setPairs(updated);
    const obj = Object.fromEntries(
      updated.filter((p) => p.key).map((p) => [p.key, p.value]),
    );
    onChange(obj);
  };

  const updateRow = (i: number, field: keyof KVPair, val: string) =>
    commit(pairs.map((p, idx) => (idx === i ? { ...p, [field]: val } : p)));
  const addRow = () => commit([...pairs, { key: "", value: "" }]);
  const removeRow = (i: number) => commit(pairs.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
        Fields
      </Label>
      <div className="space-y-1.5">
        {pairs.map((p, i) => (
          <div key={i} className="flex gap-1 items-center">
            <Input
              placeholder="key"
              value={p.key}
              onChange={(e) => updateRow(i, "key", e.target.value)}
              className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none text-xs h-8 focus-visible:ring-0 flex-1"
            />
            <span className="text-[10px] text-(--arch-muted) font-mono shrink-0">
              =
            </span>
            <Input
              placeholder="value"
              value={p.value}
              onChange={(e) => updateRow(i, "value", e.target.value)}
              className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none text-xs h-8 focus-visible:ring-0 flex-1"
            />
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="shrink-0 text-(--arch-muted) hover:text-(--arch-fg) transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-1 text-[11px] font-mono text-(--arch-muted) hover:text-(--arch-fg) transition-colors mt-1"
      >
        <Plus className="w-3 h-3" />
        Add field
      </button>
    </div>
  );
}

// ─── Condition Builder (IF / Filter) ─────────────────────────────────────────

type ConditionOperator =
  | "==="
  | "!=="
  | ">"
  | "<"
  | ">="
  | "<="
  | "includes"
  | "startsWith"
  | "endsWith"
  | "exists"
  | "!exists";

interface ConditionRow {
  field: string;
  operator: ConditionOperator;
  value: string;
  combinator: "AND" | "OR";
}

const OPERATOR_LABELS: Record<ConditionOperator, string> = {
  "===": "equals",
  "!==": "not equals",
  ">": "greater than",
  "<": "less than",
  ">=": "≥",
  "<=": "≤",
  includes: "contains",
  startsWith: "starts with",
  endsWith: "ends with",
  exists: "exists",
  "!exists": "not exists",
};

function buildExpression(rows: ConditionRow[], itemVar = "$input"): string {
  if (rows.length === 0) return "";
  const parts = rows.map((r) => {
    const lhs = r.field.startsWith("{{")
      ? r.field
      : `{{${itemVar}.${r.field}}}`;
    switch (r.operator) {
      case "===":
      case "!==":
      case ">":
      case "<":
      case ">=":
      case "<=": {
        const rhs = isNaN(Number(r.value)) ? `'${r.value}'` : r.value;
        return `${lhs} ${r.operator} ${rhs}`;
      }
      case "includes":
        return `String(${lhs}).includes('${r.value}')`;
      case "startsWith":
        return `String(${lhs}).startsWith('${r.value}')`;
      case "endsWith":
        return `String(${lhs}).endsWith('${r.value}')`;
      case "exists":
        return `${lhs} != null`;
      case "!exists":
        return `${lhs} == null`;
      default:
        return "";
    }
  });

  let result = parts[0] ?? "";
  for (let i = 1; i < rows.length; i++) {
    const combinator = rows[i]?.combinator === "OR" ? " || " : " && ";
    result += combinator + (parts[i] ?? "");
  }
  return result;
}

function ConditionBuilder({
  value,
  rawCondition,
  onChange,
  label = "Conditions",
  itemVar = "$input",
}: {
  value: unknown;
  rawCondition: string;
  onChange: (rows: ConditionRow[], expr: string) => void;
  label?: string;
  itemVar?: string;
}) {
  const initialRows: ConditionRow[] =
    Array.isArray(value) && value.length > 0
      ? (value as ConditionRow[])
      : [{ field: "", operator: "===", value: "", combinator: "AND" }];

  const [rows, setRows] = useState<ConditionRow[]>(initialRows);
  const [showRaw, setShowRaw] = useState(false);
  const [rawExpr, setRawExpr] = useState(rawCondition);

  const update = (newRows: ConditionRow[]) => {
    setRows(newRows);
    const expr = buildExpression(newRows, itemVar);
    setRawExpr(expr);
    onChange(newRows, expr);
  };

  const addRow = () => {
    update([
      ...rows,
      { field: "", operator: "===", value: "", combinator: "AND" },
    ]);
  };

  const removeRow = (i: number) => {
    const next = rows.filter((_, idx) => idx !== i);
    if (next.length === 0) {
      next.push({ field: "", operator: "===", value: "", combinator: "AND" });
    }
    update(next);
  };

  const updateRow = <K extends keyof ConditionRow>(
    i: number,
    key: K,
    val: ConditionRow[K],
  ) => {
    const next = rows.map((r, idx) => (idx === i ? { ...r, [key]: val } : r));
    update(next);
  };

  const noValueOps: ConditionOperator[] = ["exists", "!exists"];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
          {label}
        </Label>
        <button
          type="button"
          onClick={() => setShowRaw((v) => !v)}
          className="text-[10px] font-mono text-(--arch-muted) hover:text-(--arch-fg) uppercase transition-colors"
        >
          {showRaw ? "↑ Visual" : "{ } Raw"}
        </button>
      </div>

      {showRaw ? (
        <div className="space-y-1">
          <Textarea
            value={rawExpr}
            onChange={(e) => {
              setRawExpr(e.target.value);
              onChange(rows, e.target.value);
            }}
            placeholder={`{{${itemVar}.status}} === 'active'`}
            rows={3}
            className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs min-h-[60px] focus-visible:ring-0"
          />
          <p className="text-[10px] text-(--arch-muted) font-mono">
            JavaScript expression. Use{" "}
            <code className="bg-[rgba(var(--arch-fg-rgb)/0.1)] px-1">
              {"{{field}}"}
            </code>{" "}
            for values.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((row, i) => (
            <div key={i} className="space-y-1">
              {i > 0 && (
                <div className="flex items-center gap-1 py-0.5">
                  <div className="flex-1 h-px bg-(--arch-border)" />
                  <button
                    type="button"
                    onClick={() =>
                      updateRow(
                        i,
                        "combinator",
                        row.combinator === "AND" ? "OR" : "AND",
                      )
                    }
                    className="text-[10px] font-mono font-bold px-2 py-0.5 border border-(--arch-border) text-(--arch-muted) hover:text-(--arch-fg) hover:border-(--arch-fg) transition-all uppercase"
                  >
                    {row.combinator}
                  </button>
                  <div className="flex-1 h-px bg-(--arch-border)" />
                </div>
              )}
              <div className="grid grid-cols-[1fr_auto_1fr_auto] gap-1 items-center">
                {/* Field */}
                <Input
                  placeholder="field.path"
                  value={row.field}
                  onChange={(e) => updateRow(i, "field", e.target.value)}
                  className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs h-8 focus-visible:ring-0"
                />
                {/* Operator */}
                <Select
                  value={row.operator}
                  onValueChange={(v) =>
                    updateRow(i, "operator", v as ConditionOperator)
                  }
                >
                  <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono text-xs h-8 w-28 focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono z-50">
                    {(Object.keys(OPERATOR_LABELS) as ConditionOperator[]).map(
                      (op) => (
                        <SelectItem
                          key={op}
                          value={op}
                          className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs font-mono"
                        >
                          {OPERATOR_LABELS[op]}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                {/* Value */}
                <Input
                  placeholder="value"
                  value={row.value}
                  disabled={noValueOps.includes(row.operator)}
                  onChange={(e) => updateRow(i, "value", e.target.value)}
                  className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs h-8 focus-visible:ring-0 disabled:opacity-40"
                />
                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="h-8 w-8 flex items-center justify-center text-(--arch-muted) hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addRow}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 border border-dashed border-(--arch-border) text-[10px] font-mono text-(--arch-muted) hover:text-(--arch-fg) hover:border-(--arch-fg) uppercase transition-colors"
          >
            <Plus className="h-3 w-3" />
            Add condition
          </button>

          {rawExpr && (
            <p className="text-[10px] font-mono text-(--arch-muted) border-l-2 border-(--arch-border) pl-2 break-all">
              {rawExpr}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Stripe Amount Input ─────────────────────────────────────────────────────

const CURRENCIES = ["usd", "eur", "gbp", "cad", "aud", "jpy", "inr", "sgd"];
const CURRENCY_SYMBOLS: Record<string, string> = {
  usd: "$",
  eur: "€",
  gbp: "£",
  cad: "CA$",
  aud: "A$",
  jpy: "¥",
  inr: "₹",
  sgd: "S$",
};

function StripeAmountInput({
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
}: {
  amount: string;
  currency: string;
  onAmountChange: (cents: string) => void;
  onCurrencyChange: (currency: string) => void;
}) {
  // JPY and similar have no minor unit
  const isZeroDecimal = ["jpy"].includes(currency.toLowerCase());
  const cents = parseInt(amount, 10) || 0;
  const dollars = isZeroDecimal ? cents : cents / 100;
  const symbol =
    CURRENCY_SYMBOLS[currency.toLowerCase()] ?? currency.toUpperCase();

  const [dollarInput, setDollarInput] = useState<string>(
    dollars > 0 ? String(dollars) : "",
  );

  const handleDollarChange = (val: string) => {
    setDollarInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      const c = isZeroDecimal ? Math.round(num) : Math.round(num * 100);
      onAmountChange(String(c));
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
          Amount
        </Label>
        <div className="flex">
          <span className="inline-flex items-center px-2 border border-r-0 border-(--arch-border) bg-(--arch-bg) text-(--arch-muted) font-mono text-xs">
            {symbol}
          </span>
          <Input
            type="number"
            min="0"
            step={isZeroDecimal ? "1" : "0.01"}
            placeholder={isZeroDecimal ? "100" : "10.00"}
            value={dollarInput}
            onChange={(e) => handleDollarChange(e.target.value)}
            className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs h-9 focus-visible:ring-0 flex-1"
          />
        </div>
        {cents > 0 && (
          <p className="text-[10px] font-mono text-(--arch-muted) border-l-2 border-(--arch-border) pl-2">
            {cents.toLocaleString()} {isZeroDecimal ? "units" : "cents"} stored
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider">
          Currency
        </Label>
        <Select value={currency.toLowerCase()} onValueChange={onCurrencyChange}>
          <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono text-xs h-9 focus:ring-1 focus:ring-(--arch-fg) hover:border-(--arch-fg) transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono z-50">
            {CURRENCIES.map((c) => (
              <SelectItem
                key={c}
                value={c}
                className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer font-mono text-xs"
              >
                {c.toUpperCase()} {CURRENCY_SYMBOLS[c] ?? ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
