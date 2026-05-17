"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { use } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Ban,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Cpu,
  Globe,
  Key,
  LayoutGrid,
  Mail,
  Shield,
  Terminal,
  Trash2,
  TrendingUp,
  Users,
  Workflow,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ADMIN_ROLE_COLORS, ADMIN_ROLE_LABELS } from "@/lib/admin-constants";

function StatPill({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Shield;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/40 px-4 py-3">
      <Icon className={cn("h-5 w-5", color ?? "text-muted-foreground")} />
      <span className="text-lg font-bold tabular-nums">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export default function UserDetailClient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: userId } = use(params);
  const trpc = useTRPC();
  const qc = useQueryClient();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [banOpen, setBanOpen] = useState(false);

  const { data, isLoading } = useQuery(
    trpc.admin.users.getById.queryOptions({ userId }),
  );

  const deleteMutation = useMutation(
    trpc.admin.users.deleteUser.mutationOptions({
      onSuccess: () => {
        toast.success("User deleted");
        window.location.href = "/admin/users";
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  const banMutation = useMutation(
    trpc.admin.users.banUser.mutationOptions({
      onSuccess: () => {
        toast.success("Sessions revoked");
        qc.invalidateQueries(trpc.admin.users.getById.pathFilter());
        setBanOpen(false);
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  const roleMutation = useMutation(
    trpc.admin.users.updateRole.mutationOptions({
      onSuccess: () => {
        toast.success("Role updated");
        qc.invalidateQueries(trpc.admin.users.getById.pathFilter());
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!data) return <p className="text-muted-foreground">User not found.</p>;

  const { user, aiStats } = data;

  return (
    <div className="space-y-5">
      {/* Back */}
      <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" asChild>
        <Link href="/admin/users">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to users
        </Link>
      </Button>

      {/* Profile card */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback className="text-lg">
                  {(user.name ?? user.email).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-bold">{user.name ?? "—"}</h1>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <Badge
                    className={cn(
                      "text-xs",
                      user.emailVerified
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-700",
                    )}
                  >
                    {user.emailVerified ? (
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                    ) : (
                      <XCircle className="mr-1 h-3 w-3" />
                    )}
                    {user.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                  {user.adminUser && (
                    <Badge
                      className={cn(
                        "text-xs",
                        ADMIN_ROLE_COLORS[user.adminUser.role] ?? "",
                      )}
                    >
                      <Shield className="mr-1 h-3 w-3" />
                      {ADMIN_ROLE_LABELS[user.adminUser.role]}
                    </Badge>
                  )}
                  {user.accounts.map((acc) => (
                    <Badge key={acc.providerId} variant="outline" className="text-xs capitalize">
                      {acc.providerId}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Admin actions */}
            <div className="flex flex-wrap gap-2">
              <Select
                value={user.adminUser?.role ?? "none"}
                onValueChange={(v) =>
                  roleMutation.mutate({
                    userId,
                    role:
                      v === "none"
                        ? null
                        : (v as "SUPER_ADMIN" | "ADMIN" | "MODERATOR" | "SUPPORT_AGENT"),
                  })
                }
              >
                <SelectTrigger className="h-8 w-44 text-xs">
                  <Shield className="mr-1.5 h-3.5 w-3.5" />
                  <SelectValue placeholder="Set admin role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No admin role</SelectItem>
                  <SelectItem value="SUPPORT_AGENT">Support Agent</SelectItem>
                  <SelectItem value="MODERATOR">Moderator</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs text-amber-600 border-amber-200 hover:bg-amber-50"
                onClick={() => setBanOpen(true)}
              >
                <Ban className="h-3.5 w-3.5" /> Revoke sessions
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Stats pills */}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            <StatPill
              icon={Workflow}
              label="Workflows"
              value={user._count.workflows}
              color="text-violet-500"
            />
            <StatPill
              icon={TrendingUp}
              label="Executions"
              value={user._count.executions}
              color="text-emerald-500"
            />
            <StatPill
              icon={Users}
              label="Teams"
              value={user._count.teamMembers}
              color="text-blue-500"
            />
            <StatPill
              icon={Key}
              label="API Keys"
              value={user._count.apiKeys}
              color="text-amber-500"
            />
            <StatPill
              icon={Bot}
              label="AI Tokens"
              value={((aiStats._sum.totalTokens ?? 0) / 1000).toFixed(0) + "K"}
              color="text-indigo-500"
            />
            <StatPill
              icon={Cpu}
              label="AI Cost"
              value={`$${(aiStats._sum.costUsd ?? 0).toFixed(3)}`}
              color="text-pink-500"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Joined {format(new Date(user.createdAt), "MMM d, yyyy")}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Updated {formatDistanceToNow(new Date(user.updatedAt), { addSuffix: true })}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" /> ID: {user.id}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="sessions">
        <TabsList className="h-9">
          <TabsTrigger value="sessions" className="text-xs">Sessions</TabsTrigger>
          <TabsTrigger value="activity" className="text-xs">Activity Log</TabsTrigger>
          <TabsTrigger value="ai" className="text-xs">AI Usage</TabsTrigger>
          <TabsTrigger value="tickets" className="text-xs">Support</TabsTrigger>
        </TabsList>

        {/* Sessions */}
        <TabsContent value="sessions" className="mt-3">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user.sessions.length === 0 && (
                  <p className="text-sm text-muted-foreground">No active sessions.</p>
                )}
                {user.sessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg bg-muted/30 p-3 text-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-mono text-xs">{s.ipAddress ?? "—"}</p>
                        <p className="truncate text-xs text-muted-foreground max-w-xs">
                          {s.userAgent ?? "Unknown agent"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>Created {formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })}</p>
                      <p>Expires {format(new Date(s.expiresAt), "MMM d")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity log */}
        <TabsContent value="activity" className="mt-3">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user.auditLogs.length === 0 && (
                  <p className="text-sm text-muted-foreground">No activity yet.</p>
                )}
                {user.auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-lg bg-muted/30 p-2.5 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-mono text-xs font-semibold">{log.action}</span>
                      {log.entity && (
                        <Badge variant="outline" className="text-[10px]">{log.entity}</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI usage */}
        <TabsContent value="ai" className="mt-3">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recent AI Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user.aiUsageLogs.length === 0 && (
                  <p className="text-sm text-muted-foreground">No AI usage yet.</p>
                )}
                {user.aiUsageLogs.map((log, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-muted/30 p-2.5 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Bot className="h-3.5 w-3.5 text-indigo-500" />
                      <span className="font-semibold capitalize">{log.provider}</span>
                      <Badge variant="outline" className="text-[10px]">{log.model}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{log.totalTokens.toLocaleString()} tokens</span>
                      <span className="text-emerald-600">${log.costUsd.toFixed(4)}</span>
                      <span>{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support tickets */}
        <TabsContent value="tickets" className="mt-3">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user.supportTickets.length === 0 && (
                  <p className="text-sm text-muted-foreground">No tickets.</p>
                )}
                {user.supportTickets.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-lg bg-muted/30 p-2.5 text-sm"
                  >
                    <div>
                      <p className="font-medium">{t.subject}</p>
                      <p className="text-xs text-muted-foreground">#{t.ticketNumber}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          t.priority === "CRITICAL" && "border-red-300 text-red-600",
                          t.priority === "HIGH" && "border-amber-300 text-amber-600",
                        )}
                      >
                        {t.priority}
                      </Badge>
                      <Badge
                        className={cn(
                          "text-xs",
                          t.status === "OPEN" && "bg-amber-100 text-amber-700",
                          t.status === "RESOLVED" && "bg-emerald-100 text-emerald-700",
                        )}
                      >
                        {t.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete user?"
        description={`Permanently delete ${user.email} and all associated data.`}
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate({ userId })}
      />
      <ConfirmDialog
        open={banOpen}
        onOpenChange={setBanOpen}
        title="Revoke all sessions?"
        description={`Sign ${user.email} out from all devices immediately.`}
        confirmLabel="Revoke"
        variant="destructive"
        loading={banMutation.isPending}
        onConfirm={() => banMutation.mutate({ userId })}
      />
    </div>
  );
}
