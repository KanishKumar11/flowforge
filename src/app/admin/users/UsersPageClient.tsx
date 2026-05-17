"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { AdminDataTable } from "@/features/admin/components/AdminDataTable";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Ban,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Shield,
  ShieldOff,
  Trash2,
  UserCheck,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type User = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  adminUser: { role: string; isActive: boolean } | null;
  _count: { workflows: number; executions: number; teamMembers: number };
};

export default function UsersPageClient() {
  const trpc = useTRPC();
  const qc = useQueryClient();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "email" | "name" | "executionCount">("createdAt");
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [banTarget, setBanTarget] = useState<User | null>(null);

  const { data, isLoading } = useQuery(
    trpc.admin.users.list.queryOptions({
      page,
      limit: 20,
      search: search || undefined,
      sortBy,
      sortOrder: "desc",
    }),
  );

  const deleteMutation = useMutation(
    trpc.admin.users.deleteUser.mutationOptions({
      onSuccess: () => {
        toast.success("User deleted successfully");
        qc.invalidateQueries(trpc.admin.users.list.pathFilter());
        setDeleteTarget(null);
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  const banMutation = useMutation(
    trpc.admin.users.banUser.mutationOptions({
      onSuccess: () => {
        toast.success("User sessions revoked");
        qc.invalidateQueries(trpc.admin.users.list.pathFilter());
        setBanTarget(null);
      },
      onError: (e) => toast.error(e.message),
    }),
  );

  const columns: ColumnDef<User>[] = [
    {
      id: "user",
      header: "User",
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8">
              <AvatarImage src={u.image ?? undefined} />
              <AvatarFallback className="text-xs">
                {(u.name ?? u.email).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium leading-none">{u.name ?? "—"}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{u.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex gap-1.5">
          <Badge
            variant={row.original.emailVerified ? "default" : "outline"}
            className={cn(
              "text-xs",
              row.original.emailVerified
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                : "",
            )}
          >
            {row.original.emailVerified ? "Verified" : "Unverified"}
          </Badge>
          {row.original.adminUser && (
            <Badge className="bg-violet-100 text-xs text-violet-700 dark:bg-violet-950 dark:text-violet-400">
              <Shield className="mr-1 h-2.5 w-2.5" />
              {row.original.adminUser.role.replace("_", " ")}
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: "workflows",
      header: "Workflows",
      cell: ({ row }) => (
        <span className="tabular-nums">{row.original._count.workflows}</span>
      ),
    },
    {
      id: "executions",
      header: "Executions",
      cell: ({ row }) => (
        <span className="tabular-nums">{row.original._count.executions}</span>
      ),
    },
    {
      id: "joined",
      header: "Joined",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const u = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push(`/admin/users/${u.id}`)}>
                <Eye className="mr-2 h-3.5 w-3.5" />
                View profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-amber-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setBanTarget(u);
                }}
              >
                <Ban className="mr-2 h-3.5 w-3.5" />
                Revoke sessions
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTarget(u);
                }}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card px-5 py-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Users</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage all {data?.total ?? "…"} registered users
          </p>
        </div>
      </div>

      <AdminDataTable
        columns={columns}
        data={(data?.users as unknown as User[]) ?? []}
        loading={isLoading}
        emptyState={
          <div className="py-8 text-center">
            <UserCheck className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No users found</p>
          </div>
        }
        toolbar={
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search users..."
              className="h-8 w-52 text-sm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <Select
              value={sortBy}
              onValueChange={(v) =>
                setSortBy(v as "createdAt" | "email" | "name" | "executionCount")
              }
            >
              <SelectTrigger className="h-8 w-40 text-xs">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Newest first</SelectItem>
                <SelectItem value="executionCount">Most executions</SelectItem>
                <SelectItem value="email">Email A–Z</SelectItem>
                <SelectItem value="name">Name A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        onRowClick={(u) => router.push(`/admin/users/${u.id}`)}
      />

      {/* Server-side pagination controls */}
      {data && data.pages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground">
            Page {page} of {data.pages} · {data.total} total
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-3 w-3" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              disabled={page >= data.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Confirm dialogs */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete user permanently?"
        description={`This will permanently delete ${deleteTarget?.email} and all their data. This action cannot be undone.`}
        confirmLabel="Delete user"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate({ userId: deleteTarget!.id })}
      />
      <ConfirmDialog
        open={!!banTarget}
        onOpenChange={(o) => !o && setBanTarget(null)}
        title="Revoke all sessions?"
        description={`This will sign out ${banTarget?.email} from all devices immediately.`}
        confirmLabel="Revoke sessions"
        variant="destructive"
        loading={banMutation.isPending}
        onConfirm={() => banMutation.mutate({ userId: banTarget!.id })}
      />
    </div>
  );
}
