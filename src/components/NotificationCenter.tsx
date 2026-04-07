"use client";

import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Info,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

type NotificationType = "info" | "success" | "warning" | "error";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

function mapExecutionsToNotifications(
  items: Array<{
    id: string;
    status: string;
    startedAt: Date | string;
    completedAt: Date | string | null;
    errorMessage: string | null;
    workflow: { id: string; name: string };
  }>,
): Notification[] {
  return items.map((exec) => {
    const isError = exec.status === "ERROR";
    const isCancelled = exec.status === "CANCELLED";
    return {
      id: exec.id,
      type: isError ? "error" : isCancelled ? "warning" : "success",
      title: isError
        ? "Workflow Failed"
        : isCancelled
          ? "Execution Cancelled"
          : "Execution Complete",
      message: isError
        ? `${exec.workflow.name}: ${exec.errorMessage || "Unknown error"}`
        : `${exec.workflow.name} completed successfully`,
      timestamp: new Date(exec.completedAt || exec.startedAt),
      read: false,
    };
  });
}

const typeIcons: Record<
  NotificationType,
  React.ComponentType<{ className?: string }>
> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
};

const typeColors: Record<NotificationType, string> = {
  info: "text-foreground",
  success: "text-primary",
  warning: "text-yellow-500",
  error: "text-red-500",
};

export function NotificationCenter() {
  const trpc = useTRPC();
  const { data: recentExecutions } = useQuery(
    trpc.executions.list.queryOptions({ limit: 10 }),
  );

  const executionNotifications = recentExecutions
    ? mapExecutionsToNotifications(
        recentExecutions.items.filter(
          (e) =>
            e.status === "ERROR" ||
            e.status === "CANCELLED" ||
            e.status === "SUCCESS",
        ),
      )
    : [];

  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const notifications = executionNotifications
    .filter((n) => !dismissedIds.has(n.id))
    .map((n) => ({ ...n, read: readIds.has(n.id) }));

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setReadIds((prev) => new Set(prev).add(id));
  };

  const markAllAsRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  const deleteNotification = (id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
  };

  const clearAll = () => {
    setDismissedIds(new Set(notifications.map((n) => n.id)));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground hover:bg-transparent"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-[18px] w-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 rounded-2xl border border-border/50 bg-background shadow-xl text-foreground p-0 overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <span className="text-sm font-semibold text-foreground">
            Notifications
          </span>
          {notifications.length > 0 && (
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground font-medium hover:bg-secondary rounded-lg"
                  onClick={markAllAsRead}
                >
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground font-medium hover:bg-secondary rounded-lg"
                onClick={clearAll}
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-6 gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-secondary border border-border/50">
              <Bell className="h-5 w-5 text-muted-foreground/50" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                All caught up
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                No new notifications
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className="max-h-[320px]">
            <div className="py-1">
              {notifications.map((notification) => {
                const Icon = typeIcons[notification.type];
                return (
                  <button
                    key={notification.id}
                    type="button"
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-secondary/60 transition-colors cursor-pointer text-left group"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Icon
                      className={`h-4 w-4 mt-0.5 shrink-0 ${typeColors[notification.type]}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm font-semibold truncate ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-[11px] text-muted-foreground/60 mt-1">
                        {formatDistanceToNow(notification.timestamp, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 hover:text-foreground text-muted-foreground flex items-center justify-center rounded-md hover:bg-secondary transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
