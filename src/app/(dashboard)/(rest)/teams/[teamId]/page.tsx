"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  UserPlus,
  Trash2,
  Shield,
  Users,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/DashboardHeader";

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const teamId = params.teamId as string;

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER" | "VIEWER">(
    "MEMBER",
  );
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const { data: team, isLoading } = useQuery(
    trpc.teams.get.queryOptions({ id: teamId }),
  );

  const inviteMember = useMutation(
    trpc.teams.invite.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["teams", "get"] });
        toast.success("Member invited successfully");
        setIsInviteOpen(false);
        setInviteEmail("");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const removeMember = useMutation(
    trpc.teams.removeMember.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["teams", "get"] });
        toast.success("Member removed");
      },
    }),
  );

  const updateRole = useMutation(
    trpc.teams.updateMemberRole.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["teams", "get"] });
        toast.success("Role updated");
      },
    }),
  );

  const deleteTeam = useMutation(
    trpc.teams.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Team deleted");
        router.push("/teams");
      },
    }),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">
          Loading team...
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Team not found</p>
        <Button asChild>
          <Link href="/teams">Back to Teams</Link>
        </Button>
      </div>
    );
  }

  const isOwner = team.currentUserRole === "OWNER";
  const isAdmin = team.currentUserRole === "ADMIN" || isOwner;

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title={team.name}
        description={team.description || "Manage team members and settings"}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/teams">Back</Link>
            </Button>
            {isOwner && (
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm("Are you sure? This cannot be undone.")) {
                    deleteTeam.mutate({ id: teamId });
                  }
                }}
              >
                Delete Team
              </Button>
            )}
          </div>
        }
      />

      <div className="flex-1 p-6 overflow-auto space-y-6 max-w-5xl mx-auto w-full">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-(--arch-bg) border-(--arch-border) shadow-none rounded-none group">
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[rgba(var(--arch-fg-rgb)/0.1)] border border-[rgba(var(--arch-fg-rgb)/0.2)] rounded-none">
                  <Users className="h-8 w-8 text-(--arch-fg)" />
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tight text-(--arch-fg) font-mono">
                    {team.members.length}
                  </p>
                  <p className="text-xs text-(--arch-muted) font-mono uppercase tracking-wider">
                    Members
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-(--arch-bg) border-(--arch-border) shadow-none rounded-none group">
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[rgba(var(--arch-fg-rgb)/0.1)] border border-[rgba(var(--arch-fg-rgb)/0.2)] rounded-none">
                  <Workflow className="h-8 w-8 text-(--arch-fg)" />
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tight text-(--arch-fg) font-mono">
                    {team._count.workflows}
                  </p>
                  <p className="text-xs text-(--arch-muted) font-mono uppercase tracking-wider">
                    Workflows
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Members */}
        <Card className="bg-(--arch-bg) border-(--arch-border) shadow-none rounded-none">
          <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-(--arch-border)">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold flex items-center gap-2 font-mono uppercase text-(--arch-fg)">
                <Shield className="h-5 w-5 text-(--arch-fg)" />
                Team Members
              </CardTitle>
              <p className="text-xs text-(--arch-muted) font-mono">
                Manage access and roles for your team
              </p>
            </div>
            {isAdmin && (
              <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="shadow-none bg-(--arch-fg) text-(--arch-bg) hover:bg-[rgba(var(--arch-fg-rgb)/0.9)] rounded-none font-mono uppercase text-xs h-8 border border-(--arch-fg)"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-(--arch-bg) border-(--arch-border) rounded-none sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="font-mono uppercase text-(--arch-fg)">Invite Team Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label className="text-(--arch-fg) font-mono uppercase text-xs">Email Address</Label>
                      <Input
                        type="email"
                        placeholder="member@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-(--arch-fg) font-mono uppercase text-xs">Role</Label>
                      <Select
                        value={inviteRole}
                        onValueChange={(v) =>
                          setInviteRole(v as typeof inviteRole)
                        }
                      >
                        <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-(--arch-bg) border-(--arch-border) rounded-none">
                          <SelectItem value="ADMIN" className="font-mono text-xs focus:bg-(--arch-fg) focus:text-(--arch-bg)">ADMIN</SelectItem>
                          <SelectItem value="MEMBER" className="font-mono text-xs focus:bg-(--arch-fg) focus:text-(--arch-bg)">MEMBER</SelectItem>
                          <SelectItem value="VIEWER" className="font-mono text-xs focus:bg-(--arch-fg) focus:text-(--arch-bg)">VIEWER</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      className="w-full bg-(--arch-fg) text-(--arch-bg) hover:bg-[rgba(var(--arch-fg-rgb)/0.9)] rounded-none font-mono uppercase text-xs"
                      onClick={() =>
                        inviteMember.mutate({
                          teamId,
                          email: inviteEmail,
                          role: inviteRole,
                        })
                      }
                      disabled={!inviteEmail || inviteMember.isPending}
                    >
                      {inviteMember.isPending ? "Inviting..." : "Send Invite"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {team.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border border-(--arch-border) bg-[rgba(var(--arch-bg-secondary-rgb)/0.2)] hover:border-(--arch-fg) transition-colors group rounded-none"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 ring-1 ring-(--arch-border) rounded-none">
                      <AvatarImage src={member.user.image || undefined} className="rounded-none" />
                      <AvatarFallback className="bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-fg) font-mono rounded-none">
                        {member.user.name?.[0] || member.user.email[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-sm text-(--arch-fg) font-mono">
                        {member.user.name || member.user.email}
                      </p>
                      <p className="text-xs text-(--arch-muted) font-mono opacity-80">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isOwner && member.role !== "OWNER" ? (
                      <Select
                        value={member.role}
                        onValueChange={(role) =>
                          updateRole.mutate({
                            teamId,
                            userId: member.user.id,
                            role: role as "ADMIN" | "MEMBER" | "VIEWER",
                          })
                        }
                      >
                        <SelectTrigger className="w-28 h-8 bg-transparent border-(--arch-border) focus:ring-0 hover:border-(--arch-fg) rounded-none font-mono text-xs text-(--arch-fg)">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-(--arch-bg) border-(--arch-border) rounded-none">
                          <SelectItem value="ADMIN" className="font-mono text-xs focus:bg-(--arch-fg) focus:text-(--arch-bg)">ADMIN</SelectItem>
                          <SelectItem value="MEMBER" className="font-mono text-xs focus:bg-(--arch-fg) focus:text-(--arch-bg)">MEMBER</SelectItem>
                          <SelectItem value="VIEWER" className="font-mono text-xs focus:bg-(--arch-fg) focus:text-(--arch-bg)">VIEWER</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="font-mono text-[10px] px-2.5 py-0.5 bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-fg) border border-[rgba(var(--arch-fg-rgb)/0.2)] rounded-none uppercase"
                      >
                        {member.role}
                      </Badge>
                    )}
                    {isAdmin && member.role !== "OWNER" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-(--arch-muted) hover:text-red-500 hover:bg-red-500/10 transition-colors rounded-none"
                        onClick={() =>
                          removeMember.mutate({
                            teamId,
                            userId: member.user.id,
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        {isOwner && (
          <Card className="border-destructive/50 bg-destructive/5 shadow-none rounded-none">
            <CardHeader className="border-b border-destructive/20">
              <CardTitle className="text-destructive font-mono uppercase">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Button
                variant="destructive"
                className="rounded-none font-mono uppercase text-xs"
                onClick={() => {
                  if (confirm("Are you sure? This cannot be undone.")) {
                    deleteTeam.mutate({ id: teamId });
                  }
                }}
              >
                Delete Team
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
