// @ts-nocheck
"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle, CheckCircle2, Info, Megaphone, MoreHorizontal, Plus, Trash2, Wrench,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Announcement = {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "WARNING" | "SUCCESS" | "MAINTENANCE";
  targetAudience: string;
  isActive: boolean;
  isDismissable: boolean;
  scheduledAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
};

const TYPE_CONFIG = {
  INFO: { icon: Info, color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400", label: "Info" },
  WARNING: { icon: AlertCircle, color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400", label: "Warning" },
  SUCCESS: { icon: CheckCircle2, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400", label: "Success" },
  MAINTENANCE: { icon: Wrench, color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400", label: "Maintenance" },
};

function AnnouncementDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<Announcement["type"]>("INFO");
  const [audience, setAudience] = useState("all");

  const create = useMutation(
    trpc.admin.announcements.create.mutationOptions({
      onSuccess: () => {
        toast.success("Announcement created");
        qc.invalidateQueries(trpc.admin.announcements.list.pathFilter());
        onClose();
        setTitle(""); setMessage("");
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Announcement</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 h-8" placeholder="System maintenance scheduled" />
          </div>
          <div>
            <Label className="text-xs">Message</Label>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1 min-h-20 text-sm" placeholder="We will be performing scheduled maintenance..." />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as Announcement["type"])}>
                <SelectTrigger className="mt-1 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INFO">Info</SelectItem>
                  <SelectItem value="WARNING">Warning</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger className="mt-1 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All users</SelectItem>
                  <SelectItem value="free">Free tier</SelectItem>
                  <SelectItem value="pro">Pro tier</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            disabled={!title || !message || create.isPending}
            onClick={() => create.mutate({ title, message, type, targetAudience: audience })}
          >
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AnnouncementsPageClient() {
  const trpc = useTRPC();
  const qc = useQueryClient();

  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);

  const { data, isLoading } = useQuery(trpc.admin.announcements.list.queryOptions());

  const deleteMutation = useMutation(
    trpc.admin.announcements.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Announcement deleted");
        qc.invalidateQueries(trpc.admin.announcements.list.pathFilter());
        setDeleteTarget(null);
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Announcements</h1>
          <p className="text-sm text-muted-foreground">Broadcast messages to users</p>
        </div>
        <Button size="sm" className="h-8 gap-1.5" onClick={() => setCreateOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> New announcement
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}</div>
      ) : (data ?? []).length === 0 ? (
        <div className="py-12 text-center">
          <Megaphone className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {(data ?? []).map((a) => {
            const cfg = TYPE_CONFIG[a.type];
            const IconComp = cfg.icon;
            return (
              <Card key={a.id} className={cn("border-border/50", !a.isActive && "opacity-60")}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={cn("mt-0.5 rounded-md p-1.5", cfg.color.split(" ").slice(0, 2).join(" "))}>
                        <IconComp className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{a.title}</p>
                          <Badge className={cn("text-[10px]", cfg.color)}>{cfg.label}</Badge>
                          {!a.isActive && <Badge variant="outline" className="text-[10px]">Inactive</Badge>}
                          {a.isDismissable && <Badge variant="outline" className="text-[10px]">Dismissable</Badge>}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{a.message}</p>
                        <div className="mt-1.5 flex gap-3 text-xs text-muted-foreground">
                          <span>Audience: {a.targetAudience}</span>
                          <span>Created {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</span>
                          {a.expiresAt && <span>Expires {format(new Date(a.expiresAt), "MMM d")}</span>}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-red-600" onClick={() => setDeleteTarget(a)}>
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AnnouncementDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete announcement?"
        description="This will remove the announcement for all users."
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate({ id: deleteTarget!.id })}
      />
    </div>
  );
}
