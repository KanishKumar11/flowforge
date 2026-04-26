"use client";

import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTRPC, useVanillaClient } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Copy,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function ApiKeysPage() {
  const trpc = useTRPC();
  const client = useVanillaClient();
  const queryClient = useQueryClient();

  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyWorkflowId, setNewKeyWorkflowId] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [showCreatedKey, setShowCreatedKey] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: apiKeys, isLoading } = useQuery(
    trpc.apiKeys.list.queryOptions(),
  );

  const { data: workflowsData } = useQuery(
    trpc.workflows.list.queryOptions(),
  );
  const workflows = workflowsData as
    | { id: string; name: string }[]
    | undefined;

  const createKey = useMutation({
    mutationFn: () =>
      client.apiKeys.create.mutate({
        name: newKeyName,
        workflowId: newKeyWorkflowId || undefined,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
      setCreatedKey(data.rawKey);
      setShowCreatedKey(true);
      setNewKeyName("");
      setNewKeyWorkflowId("");
      setShowCreate(false);
      toast.success("API key created");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const revokeKey = useMutation({
    mutationFn: (id: string) => client.apiKeys.revoke.mutate({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
      toast.success("API key revoked");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteKey = useMutation({
    mutationFn: (id: string) => client.apiKeys.delete.mutate({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
      setDeleteId(null);
      toast.success("API key deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const rotateKey = useMutation({
    mutationFn: (id: string) => client.apiKeys.rotate.mutate({ id }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
      setCreatedKey(data.rawKey);
      setShowCreatedKey(true);
      toast.success("API key rotated — copy your new key");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="flex flex-col h-full bg-(--arch-bg) min-h-screen">
      <DashboardHeader
        title="API Keys"
        description="Trigger workflows programmatically via HTTP"
        action={
          <Button
            onClick={() => setShowCreate(true)}
            className="gap-2 bg-(--arch-fg) text-(--arch-bg) hover:bg-[rgba(var(--arch-fg-rgb)/0.9)] rounded-none font-mono uppercase text-xs h-9 px-4"
          >
            <Plus className="h-3.5 w-3.5" />
            New API Key
          </Button>
        }
      />

      <div className="flex-1 p-8 overflow-auto max-w-4xl">
        {/* Usage hint */}
        <div className="mb-6 p-4 border border-(--arch-border) bg-[rgba(var(--arch-fg-rgb)/0.03)] font-mono text-xs space-y-1">
          <p className="font-bold uppercase text-(--arch-fg) tracking-wider">
            Usage
          </p>
          <p className="text-(--arch-muted)">
            Trigger a workflow via POST request:
          </p>
          <code className="block bg-[rgba(var(--arch-fg-rgb)/0.08)] px-3 py-2 text-(--arch-fg) break-all">
            {`curl -X POST "${baseUrl}/api/run/{YOUR_API_KEY}" \\`}
            <br />
            {`  -H "Content-Type: application/json" \\`}
            <br />
            {`  -d '{"key": "value"}'`}
          </code>
        </div>

        {/* Keys list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-(--arch-muted)" />
          </div>
        ) : !apiKeys || apiKeys.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-(--arch-border)">
            <Key className="h-10 w-10 mx-auto text-(--arch-muted) mb-4 opacity-30" />
            <p className="text-sm font-mono text-(--arch-muted) uppercase tracking-wider">
              No API keys yet
            </p>
            <p className="text-xs text-(--arch-muted) mt-1">
              Create a key to trigger workflows via HTTP
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className={`border border-(--arch-border) p-4 flex items-center justify-between gap-4 ${
                  !key.isActive ? "opacity-50" : ""
                }`}
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-(--arch-fg) uppercase tracking-tight">
                      {key.name}
                    </span>
                    {!key.isActive && (
                      <Badge
                        variant="outline"
                        className="text-[10px] rounded-none border-(--arch-border) text-(--arch-muted) uppercase font-mono"
                      >
                        Revoked
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-(--arch-muted)">
                    <span className="bg-[rgba(var(--arch-fg-rgb)/0.08)] px-2 py-0.5 text-(--arch-fg)">
                      {key.keyPrefix}…
                    </span>
                    {key.lastUsedAt && (
                      <span>
                        Last used{" "}
                        {formatDistanceToNow(new Date(key.lastUsedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                    <span>
                      Created{" "}
                      {formatDistanceToNow(new Date(key.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {key.isActive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => rotateKey.mutate(key.id)}
                      disabled={rotateKey.isPending}
                      className="h-8 rounded-none text-(--arch-muted) hover:text-(--arch-fg) hover:bg-[rgba(var(--arch-fg-rgb)/0.08)] font-mono uppercase text-xs"
                      title="Rotate key"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                      Rotate
                    </Button>
                  )}
                  {key.isActive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => revokeKey.mutate(key.id)}
                      disabled={revokeKey.isPending}
                      className="h-8 rounded-none text-(--arch-muted) hover:text-amber-500 hover:bg-amber-500/10 font-mono uppercase text-xs"
                    >
                      Revoke
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(key.id)}
                    className="h-8 w-8 rounded-none text-(--arch-muted) hover:text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="font-mono rounded-none border-(--arch-border) bg-(--arch-bg) text-(--arch-fg)">
          <DialogHeader>
            <DialogTitle className="font-mono uppercase text-sm tracking-wider">
              New API Key
            </DialogTitle>
            <DialogDescription className="text-xs font-mono text-(--arch-muted)">
              The full key is shown only once after creation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-(--arch-fg)">
                Name
              </Label>
              <Input
                placeholder="Production trigger"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="rounded-none border-(--arch-border) bg-(--arch-bg) text-(--arch-fg) text-xs font-mono h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-(--arch-fg)">
                Bound Workflow (optional)
              </Label>
              <select
                value={newKeyWorkflowId}
                onChange={(e) => setNewKeyWorkflowId(e.target.value)}
                className="w-full h-9 border border-(--arch-border) bg-(--arch-bg) text-(--arch-fg) text-xs font-mono px-3 rounded-none focus:outline-none focus:border-(--arch-fg)"
              >
                <option value="">Any workflow (pass workflowId in body)</option>
                {workflows?.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreate(false)}
              className="rounded-none font-mono uppercase text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => createKey.mutate()}
              disabled={!newKeyName || createKey.isPending}
              className="rounded-none bg-(--arch-fg) text-(--arch-bg) font-mono uppercase text-xs"
            >
              {createKey.isPending ? (
                <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
              ) : (
                <Key className="h-3.5 w-3.5 mr-2" />
              )}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reveal new key */}
      <Dialog
        open={showCreatedKey}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreatedKey(false);
            setCreatedKey(null);
          }
        }}
      >
        <DialogContent className="font-mono rounded-none border-(--arch-border) bg-(--arch-bg) text-(--arch-fg)">
          <DialogHeader>
            <DialogTitle className="font-mono uppercase text-sm tracking-wider text-green-500">
              API Key Created
            </DialogTitle>
            <DialogDescription className="text-xs font-mono text-(--arch-muted)">
              Copy this key now — it will not be shown again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-[rgba(var(--arch-fg-rgb)/0.08)] border border-(--arch-border) px-3 py-2">
              <code className="flex-1 text-xs text-(--arch-fg) break-all select-all">
                {showCreatedKey && createdKey ? createdKey : "••••••••••••••••••"}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 rounded-none"
                onClick={() => setShowCreatedKey((v) => !v)}
              >
                {showCreatedKey ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 rounded-none"
                onClick={() => {
                  if (createdKey) {
                    navigator.clipboard.writeText(createdKey);
                    toast.success("Copied to clipboard");
                  }
                }}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              size="sm"
              onClick={() => {
                setShowCreatedKey(false);
                setCreatedKey(null);
              }}
              className="rounded-none bg-(--arch-fg) text-(--arch-bg) font-mono uppercase text-xs"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="font-mono rounded-none border-(--arch-border) bg-(--arch-bg) text-(--arch-fg)">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono uppercase text-sm">
              Delete API Key?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-mono text-(--arch-muted)">
              This is permanent and cannot be undone. Any integrations using
              this key will stop working immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-none font-mono uppercase text-xs border-(--arch-border)">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteKey.mutate(deleteId)}
              className="rounded-none bg-red-500 text-white hover:bg-red-600 font-mono uppercase text-xs"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
