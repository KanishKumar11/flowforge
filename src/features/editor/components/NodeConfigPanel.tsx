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
import { type Node } from "@xyflow/react";
import Editor from "@monaco-editor/react";
import { X, Plus } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface NodeConfigPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
}

export function NodeConfigPanel({
  node,
  onClose,
  onUpdate,
}: NodeConfigPanelProps) {
  const trpc = useTRPC();
  // Fetch credentials for integration nodes
  const { data: credentials } = useQuery(trpc.credentials.list.queryOptions());

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
                  onValueChange={(value) => handleConfigChange("method", value)}
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
                    (node.data.config as Record<string, string>)?.headers || ""
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
                  onChange={(value) => handleConfigChange("code", value || "")}
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
                  (node.data.config as Record<string, string>)?.expression || ""
                }
                onChange={(e) =>
                  handleConfigChange("expression", e.target.value)
                }
                className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Write a JavaScript expression that evaluates to the transformed
                output. The previous node's output is available as `input`.
              </p>
            </div>
          )}

          {node.data.type === "webhook" && (
            <div className="space-y-2">
              <Label>Webhook URL</Label>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  Your webhook endpoint:
                </p>
                <code className="text-xs break-all">
                  {`${typeof window !== "undefined" ? window.location.origin : ""}/api/webhooks/${node.id}`}
                </code>
              </div>
            </div>
          )}

          {node.data.type === "if" && (
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Input
                id="condition"
                placeholder="{{$input.data.status}} === 'success'"
                value={
                  (node.data.config as Record<string, string>)?.condition || ""
                }
                onChange={(e) =>
                  handleConfigChange("condition", e.target.value)
                }
              />
              <p className="text-xs text-muted-foreground">
                Use {`{{$input.data}}`} to reference previous node output
              </p>
            </div>
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
                  onClick={() =>
                    window.open("/credentials?create=smtp", "_blank")
                  }
                  className="flex items-center gap-1 text-[11px] font-mono text-(--arch-muted) hover:text-(--arch-fg) transition-colors mt-1"
                >
                  <Plus className="w-3 h-3" />
                  Create new SMTP credential
                </button>
                <p className="text-xs text-(--arch-muted) font-mono">
                  Create an SMTP credential in the Credentials page with: host,
                  port, user, pass fields.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  type="email"
                  placeholder="recipient@example.com"
                  value={(node.data.config as Record<string, string>)?.to || ""}
                  onChange={(e) => handleConfigChange("to", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Email subject"
                  value={
                    (node.data.config as Record<string, string>)?.subject || ""
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
            <div className="space-y-2">
              <Label htmlFor="filterCondition">Condition</Label>
              <Input
                id="filterCondition"
                placeholder="item.active === true"
                value={
                  (node.data.config as Record<string, string>)?.condition || ""
                }
                onChange={(e) =>
                  handleConfigChange("condition", e.target.value)
                }
              />
              <p className="text-xs text-muted-foreground">
                JavaScript expression using `item` and `index`.
              </p>
            </div>
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
                  onChange={(e) => handleConfigChange("field", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Order</Label>
                <Select
                  value={
                    (node.data.config as Record<string, string>)?.order || "asc"
                  }
                  onValueChange={(value) => handleConfigChange("order", value)}
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
                  onClick={() =>
                    window.open("/credentials?create=slack", "_blank")
                  }
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
                    (node.data.config as Record<string, string>)?.channel || ""
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
                    (node.data.config as Record<string, string>)?.message || ""
                  }
                  onChange={(e) =>
                    handleConfigChange("message", e.target.value)
                  }
                />
              </div>
            </>
          )}

          {node.data.type === "database" && (
            <>
              <div className="space-y-2">
                <Label>Operation</Label>
                <Select
                  value={
                    (node.data.config as Record<string, string>)?.operation ||
                    "find"
                  }
                  onValueChange={(value) =>
                    handleConfigChange("operation", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="find">Find / Select</SelectItem>
                    <SelectItem value="insert">Insert</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="collection">Collection / Table</Label>
                <Input
                  id="collection"
                  placeholder="users"
                  value={
                    (node.data.config as Record<string, string>)?.collection ||
                    ""
                  }
                  onChange={(e) =>
                    handleConfigChange("collection", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="query">Query / Data (JSON)</Label>
                <Textarea
                  id="query"
                  placeholder='{"id": 1}'
                  rows={5}
                  value={
                    (node.data.config as Record<string, string>)?.query || ""
                  }
                  onChange={(e) => handleConfigChange("query", e.target.value)}
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
                  onChange={(e) => handleConfigChange("range", e.target.value)}
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
                  onChange={(e) => handleConfigChange("owner", e.target.value)}
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
                    (node.data.config as Record<string, string>)?.databaseId ||
                    ""
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
                    (node.data.config as Record<string, string>)?.expression ||
                    ""
                  }
                  onChange={(e) =>
                    handleConfigChange("expression", e.target.value)
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Apply a transformation to each item. Use &quot;item&quot; and
                  &quot;index&quot;.
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
                  onChange={(e) => handleConfigChange("value", e.target.value)}
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
                    (node.data.config as Record<string, string>)?.default || ""
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
                      (node.data.config as Record<string, string>)?.provider ||
                      "openai";
                    window.open(`/credentials?create=${provider}`, "_blank");
                  }}
                  className="flex items-center gap-1 text-[11px] font-mono text-(--arch-muted) hover:text-(--arch-fg) transition-colors mt-1"
                >
                  <Plus className="w-3 h-3" />
                  Create new{" "}
                  {(
                    (node?.data?.config as Record<string, string>)?.provider ||
                    "openai"
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
                    {(node.data.config as Record<string, string>)?.provider ===
                    "anthropic" ? (
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
                    (node.data.config as Record<string, string>)?.content || ""
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
                  onValueChange={(value) => handleConfigChange("color", value)}
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
                  (node.data.config as Record<string, string>)?.workflowId || ""
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
                  value={(node.data.config as Record<string, string>)?.to || ""}
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
        </div>
      </ScrollArea>
    </div>
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

// ─── Sub-Workflow Picker ─────────────────────────────────────────────────────

function SubWorkflowPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const trpc = useTRPC();
  const { data: workflows, isLoading } = useQuery(
    trpc.workflows.list.queryOptions(),
  );

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
