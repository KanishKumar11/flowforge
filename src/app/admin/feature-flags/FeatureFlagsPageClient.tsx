// @ts-nocheck
"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Flag, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type FF = {
  id: string;
  key: string;
  name: string;
  enabled: boolean;
  rolloutPct: number;
  updatedAt: Date;
};

function FFDialog({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial?: FF;
}) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const [key, setKey] = useState(initial?.key ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [pct, setPct] = useState(String(initial?.rolloutPct ?? 100));

  const upsert = useMutation(
    trpc.admin.featureFlags.upsert.mutationOptions({
      onSuccess: () => {
        toast.success(initial ? "Flag updated" : "Flag created");
        qc.invalidateQueries(trpc.admin.featureFlags.list.pathFilter());
        onClose();
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {initial ? "Edit Feature Flag" : "New Feature Flag"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Key</Label>
            <Input
              value={key}
              onChange={(e) =>
                setKey(e.target.value.toLowerCase().replace(/\s+/g, "_"))
              }
              placeholder="my_feature_flag"
              className="mt-1 h-8 font-mono text-sm"
              disabled={!!initial}
            />
          </div>
          <div>
            <Label className="text-xs">Display name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Feature"
              className="mt-1 h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Rollout % (0–100)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={pct}
              onChange={(e) => setPct(e.target.value)}
              className="mt-1 h-8 text-sm"
            />
          </div>
        </div>
        <DialogFooter className="mt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!key || !name || upsert.isPending}
            onClick={() =>
              upsert.mutate({ key, name, rolloutPct: Number(pct) })
            }
          >
            {initial ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function FeatureFlagsPageClient() {
  const trpc = useTRPC();
  const qc = useQueryClient();

  const [newOpen, setNewOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<FF | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FF | null>(null);

  const { data, isLoading } = useQuery(
    trpc.admin.featureFlags.list.queryOptions(),
  );

  const toggleMutation = useMutation(
    trpc.admin.featureFlags.toggle.mutationOptions({
      onSuccess: () =>
        qc.invalidateQueries(trpc.admin.featureFlags.list.pathFilter()),
      onError: (e) => toast.error(e.message),
    }),
  );

  const deleteMutation = useMutation(
    trpc.admin.featureFlags.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Flag deleted");
        qc.invalidateQueries(trpc.admin.featureFlags.list.pathFilter());
        setDeleteTarget(null);
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card px-5 py-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Feature Flags</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Control feature rollouts platform-wide
          </p>
        </div>
        <Button
          size="sm"
          className="h-8 gap-1.5"
          onClick={() => setNewOpen(true)}
        >
          <Plus className="h-3.5 w-3.5" /> New flag
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : (data ?? []).length === 0 ? (
        <div className="py-12 text-center">
          <Flag className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No feature flags yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {(data ?? []).map((flag) => (
            <Card
              key={flag.id}
              className={cn("border-border/50", !flag.enabled && "opacity-60")}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={flag.enabled}
                    onCheckedChange={() =>
                      toggleMutation.mutate({ key: flag.key })
                    }
                  />
                  <div>
                    <p className="font-medium">{flag.name}</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-muted-foreground">
                        {flag.key}
                      </code>
                      {flag.rolloutPct < 100 && (
                        <Badge variant="outline" className="text-[10px]">
                          {flag.rolloutPct}% rollout
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditTarget(flag)}>
                      <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => setDeleteTarget(flag)}
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <FFDialog open={newOpen} onClose={() => setNewOpen(false)} />
      {editTarget && (
        <FFDialog
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          initial={editTarget}
        />
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete feature flag?"
        description={`Delete "${deleteTarget?.key}"? This will disable it for all users.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate({ key: deleteTarget!.key })}
      />
    </div>
  );
}
