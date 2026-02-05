"use client";

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
import { X } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

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
          className="h-8 w-8 hover:bg-(--arch-fg)/10 text-(--arch-fg) rounded-none"
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
            <div className="space-y-2">
              <Label htmlFor="cron">Cron Expression</Label>
              <Input
                id="cron"
                placeholder="0 * * * *"
                value={(node.data.config as Record<string, string>)?.cron || ""}
                onChange={(e) => handleConfigChange("cron", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Examples: "0 * * * *" (hourly), "0 0 * * *" (daily)
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

          {node.data.type === "wait" && (
            <div className="space-y-2">
              <Label htmlFor="duration">Wait Duration (seconds)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                placeholder="60"
                value={
                  (node.data.config as Record<string, string>)?.duration || ""
                }
                onChange={(e) => handleConfigChange("duration", e.target.value)}
              />
            </div>
          )}

          {node.data.type === "email" && (
            <>
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
              <div className="space-y-2">
                <Label htmlFor="fields">Fields (JSON)</Label>
                <Textarea
                  id="fields"
                  placeholder='{"key": "value"}'
                  rows={5}
                  value={JSON.stringify(
                    (node.data.config as Record<string, unknown>)?.fields || {},
                    null,
                    2,
                  )}
                  onChange={(e) => {
                    try {
                      const fields = JSON.parse(e.target.value);
                      handleConfigChange("fields", fields);
                    } catch (err) {
                      // Allow typing invalid JSON temporarily
                      // handleConfigChange("fields_raw", e.target.value);
                    }
                  }}
                />
              </div>
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
                        <SelectItem value="" disabled>
                          No Slack credentials found
                        </SelectItem>
                      )}
                  </SelectContent>
                </Select>
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
              <div className="space-y-2">
                <Label htmlFor="cases">Cases (JSON)</Label>
                <Textarea
                  id="cases"
                  placeholder='[{"value": "active", "output": "go"}, {"value": "inactive", "output": "stop"}]'
                  rows={4}
                  value={
                    (node.data.config as Record<string, string>)?.cases || "[]"
                  }
                  onChange={(e) => handleConfigChange("cases", e.target.value)}
                />
              </div>
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
              <div className="space-y-2">
                <Label htmlFor="workflowId">Workflow ID</Label>
                <Input
                  id="workflowId"
                  placeholder="Workflow ID to execute"
                  value={
                    (node.data.config as Record<string, string>)?.workflowId ||
                    ""
                  }
                  onChange={(e) =>
                    handleConfigChange("workflowId", e.target.value)
                  }
                  className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs h-9 focus-visible:ring-0"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the ID of the workflow to execute as a sub-workflow.
                </p>
              </div>
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
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (cents)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="1000"
                  value={
                    (node.data.config as Record<string, string>)?.amount || ""
                  }
                  onChange={(e) => handleConfigChange("amount", e.target.value)}
                  className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs h-9 focus-visible:ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  placeholder="usd"
                  value={
                    (node.data.config as Record<string, string>)?.currency ||
                    "usd"
                  }
                  onChange={(e) =>
                    handleConfigChange("currency", e.target.value)
                  }
                  className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs h-9 focus-visible:ring-0"
                />
              </div>
            </>
          )}

          {node.data.type === "twilio" && (
            <>
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
