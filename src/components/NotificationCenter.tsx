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
  info: "text-blue-500",
  success: "text-emerald-500",
  warning: "text-amber-500",
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
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto py-0 px-1 text-xs text-muted-foreground"
                  onClick={markAllAsRead}
                >
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto py-0 px-1 text-xs text-muted-foreground"
                onClick={clearAll}
              >
                Clear all
              </Button>
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <ScrollArea className="max-h-[320px]">
            {notifications.map((notification) => {
              const Icon = typeIcons[notification.type];
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex items-start gap-3 p-3 cursor-pointer"
                  onClick={() => markAsRead(notification.id)}
                >
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${typeColors[notification.type]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium truncate ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100"
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
