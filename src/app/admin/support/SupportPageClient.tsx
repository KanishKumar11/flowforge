// @ts-nocheck
"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { StatsCard } from "@/features/admin/components/StatsCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  AlertCircle, CheckCircle2, Clock, Headphones, MessageSquare, Send, User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Ticket = {
  id: string;
  ticketNumber: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: Date;
  user: { email: string; name: string | null; image: string | null } | null;
  _count: { messages: number };
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  WAITING_FOR_USER: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
  RESOLVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  CLOSED: "bg-muted text-muted-foreground",
};

const PRIORITY_COLORS: Record<string, string> = {
  CRITICAL: "border-red-400 text-red-600",
  HIGH: "border-amber-400 text-amber-600",
  MEDIUM: "border-blue-300 text-blue-600",
  LOW: "border-muted text-muted-foreground",
};

export default function SupportPageClient() {
  const trpc = useTRPC();
  const qc = useQueryClient();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [replyText, setReplyText] = useState("");

  const { data: stats } = useQuery(trpc.admin.support.ticketStats.queryOptions());
  const { data: tickets, isLoading } = useQuery(
    trpc.admin.support.listTickets.queryOptions({
      status: statusFilter !== "all" ? (statusFilter as "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "WAITING_FOR_USER") : undefined,
    }),
  );
  const { data: ticketDetail } = useQuery(
    trpc.admin.support.getTicket.queryOptions(
      { ticketId: selectedId! },
      { enabled: !!selectedId },
    ),
  );

  const replyMutation = useMutation(
    trpc.admin.support.replyToTicket.mutationOptions({
      onSuccess: () => {
        toast.success("Reply sent");
        setReplyText("");
        qc.invalidateQueries(trpc.admin.support.getTicket.pathFilter());
        qc.invalidateQueries(trpc.admin.support.listTickets.pathFilter());
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  const updateMutation = useMutation(
    trpc.admin.support.updateTicket.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries(trpc.admin.support.listTickets.pathFilter());
        qc.invalidateQueries(trpc.admin.support.getTicket.pathFilter());
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Support Tickets</h1>
        <p className="text-sm text-muted-foreground">Manage user support requests</p>
      </div>

      {stats && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Open" value={stats.open} icon={AlertCircle} iconColor="text-amber-600" index={0} />
          <StatsCard title="In Progress" value={stats.inProgress} icon={Clock} iconColor="text-blue-600" index={1} />
          <StatsCard title="Critical" value={stats.critical} icon={AlertCircle} iconColor="text-red-600" index={2} />
          <StatsCard title="Resolved" value={stats.resolved} icon={CheckCircle2} iconColor="text-emerald-600" index={3} />
        </div>
      )}

      <div className="flex items-center gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 w-44 text-xs">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="WAITING_FOR_USER">Waiting for user</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-1 p-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
            </div>
          ) : (tickets ?? []).length === 0 ? (
            <div className="py-12 text-center">
              <Headphones className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No tickets found.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {(tickets ?? []).map((t) => (
                <button
                  key={t.id}
                  className="w-full px-4 py-3 text-left transition-colors hover:bg-muted/30"
                  onClick={() => setSelectedId(t.id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarImage src={t.user?.image ?? undefined} />
                        <AvatarFallback className="text-xs">
                          {(t.user?.name ?? t.user?.email ?? "?").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{t.subject}</p>
                        <p className="text-xs text-muted-foreground">{t.user?.email} · #{t.ticketNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className={cn("text-[10px]", PRIORITY_COLORS[t.priority])}>
                        {t.priority}
                      </Badge>
                      <Badge className={cn("text-[10px]", STATUS_COLORS[t.status])}>
                        {t.status.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(t.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ticket detail sheet */}
      <Sheet open={!!selectedId} onOpenChange={(o) => !o && setSelectedId(null)}>
        <SheetContent className="w-full max-w-lg p-0 sm:max-w-xl">
          {ticketDetail ? (
            <div className="flex h-full flex-col">
              <SheetHeader className="border-b px-6 py-4">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-base">{ticketDetail.subject}</SheetTitle>
                  <Select
                    value={ticketDetail.status}
                    onValueChange={(v) =>
                      updateMutation.mutate({ ticketId: ticketDetail.id, status: v as "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "WAITING_FOR_USER" })
                    }
                  >
                    <SelectTrigger className="h-7 w-36 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="WAITING_FOR_USER">Waiting</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">
                  #{ticketDetail.ticketNumber} · {ticketDetail.user?.email}
                </p>
              </SheetHeader>

              <ScrollArea className="flex-1 px-6 py-4">
                <div className="space-y-3">
                  {ticketDetail.messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "rounded-lg p-3 text-sm",
                        m.isAdmin
                          ? "ml-6 bg-primary/10"
                          : "mr-6 bg-muted/50",
                      )}
                    >
                      <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        {m.isAdmin ? (
                          <><Headphones className="h-3 w-3 text-primary" /> Support</>
                        ) : (
                          <><User className="h-3 w-3" /> {ticketDetail.user?.name ?? "User"}</>
                        )}
                        <span className="ml-auto">
                          {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t px-6 py-4">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="min-h-20 text-sm"
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    className="gap-1.5"
                    disabled={!replyText.trim() || replyMutation.isPending}
                    onClick={() =>
                      replyMutation.mutate({ ticketId: ticketDetail.id, content: replyText })
                    }
                  >
                    <Send className="h-3.5 w-3.5" />
                    {replyMutation.isPending ? "Sending…" : "Send reply"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <Skeleton className="h-8 w-48" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
