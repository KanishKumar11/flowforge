"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
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

type NotificationType = "info" | "success" | "warning" | "error";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Mock notifications - in production these would come from an API/store
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "error",
    title: "Workflow Failed",
    message: "Customer Sync workflow failed with error: API rate limit exceeded",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
  },
  {
    id: "2",
    type: "success",
    title: "Execution Complete",
    message: "Daily Report workflow completed successfully",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "New Feature",
    message: "Drag and drop nodes now available in the workflow editor",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
  },
  {
    id: "4",
    type: "warning",
    title: "Credential Expiring",
    message: "Your Slack OAuth token expires in 7 days",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
];

const typeIcons: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
};

const typeColors: Record<NotificationType, string> = {
  info: "text-[var(--arch-fg)]",
  success: "text-[var(--arch-accent)]",
  warning: "text-yellow-500",
  error: "text-red-500",
};

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-[var(--arch-muted)] hover:text-[var(--arch-fg)] hover:bg-transparent">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[var(--arch-focus)] text-[var(--arch-bg)] text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-[var(--arch-bg)] border-[var(--arch-border)] text-[var(--arch-fg)]">
        <DropdownMenuLabel className="flex items-center justify-between text-[var(--arch-fg)] font-mono uppercase tracking-widest text-xs">
          <span>Sys_Notifications</span>
          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto py-0 px-1 text-[10px] text-[var(--arch-muted)] hover:text-[var(--arch-fg)] font-mono uppercase hover:bg-transparent"
                  onClick={markAllAsRead}
                >
                  Mark_Read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto py-0 px-1 text-[10px] text-[var(--arch-muted)] hover:text-[var(--arch-fg)] font-mono uppercase hover:bg-transparent"
                onClick={clearAll}
              >
                Clear
              </Button>
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[var(--arch-border)]" />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-xs text-[var(--arch-muted)] font-mono uppercase tracking-widest">
            NO_NOTIFICATIONS_FOUND
          </div>
        ) : (
          <ScrollArea className="max-h-[320px]">
            {notifications.map((notification) => {
              const Icon = typeIcons[notification.type];
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex items-start gap-3 p-3 cursor-pointer focus:bg-[var(--arch-bg-secondary)] focus:text-[var(--arch-fg)]"
                  onClick={() => markAsRead(notification.id)}
                >
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${typeColors[notification.type]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-mono font-bold uppercase tracking-wider truncate ${!notification.read ? "text-[var(--arch-fg)]" : "text-[var(--arch-muted)]"}`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--arch-focus)] shrink-0 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--arch-muted)] line-clamp-2 mt-0.5 font-mono">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-[var(--arch-muted)] mt-1 font-mono opacity-60">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 hover:text-[var(--arch-fg)] text-[var(--arch-muted)] hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </DropdownMenuItem>
              );
            })}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
