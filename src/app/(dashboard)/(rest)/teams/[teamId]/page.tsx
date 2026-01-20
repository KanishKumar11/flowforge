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
import { ArrowLeft, UserPlus, Trash2, Shield, Users, Workflow } from "lucide-react";
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
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER" | "VIEWER">("MEMBER");
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const { data: team, isLoading } = useQuery(
    trpc.teams.get.queryOptions({ id: teamId })
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
    })
  );

  const removeMember = useMutation(
    trpc.teams.removeMember.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["teams", "get"] });
        toast.success("Member removed");
      },
    })
  );

  const updateRole = useMutation(
    trpc.teams.updateMemberRole.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["teams", "get"] });
        toast.success("Role updated");
      },
    })
  );

  const deleteTeam = useMutation(
    trpc.teams.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Team deleted");
        router.push("/teams");
      },
    })
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading team...</div>
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
          <Card className="glass border-white/20 dark:border-white/10 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="h-24 w-24 text-blue-500 transform -rotate-12" />
            </div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20">
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tight">{team.members.length}</p>
                  <p className="text-sm text-muted-foreground font-medium">Members</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass border-white/20 dark:border-white/10 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Workflow className="h-24 w-24 text-green-500 transform rotate-12" />
            </div>
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500/10 ring-1 ring-green-500/20">
                  <Workflow className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tight">{team._count.workflows}</p>
                  <p className="text-sm text-muted-foreground font-medium">Workflows</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Members */}
        <Card className="glass border-white/20 dark:border-white/10 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-white/5">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Team Members
              </CardTitle>
              <p className="text-sm text-muted-foreground">Manage access and roles for your team</p>
            </div>
            {isAdmin && (
              <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="shadow-lg shadow-primary/20 hover:shadow-primary/30">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass border-white/20 dark:border-white/10 sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      {/* Input content same as before ... */}
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        placeholder="member@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="bg-background/50 border-input/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as typeof inviteRole)}>
                        <SelectTrigger className="bg-background/50 border-input/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="MEMBER">Member</SelectItem>
                          <SelectItem value="VIEWER">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => inviteMember.mutate({ teamId, email: inviteEmail, role: inviteRole })}
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
                  className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-background/40 hover:bg-background/60 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 ring-2 ring-white/10 group-hover:ring-primary/20 transition-all">
                      <AvatarImage src={member.user.image || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {member.user.name?.[0] || member.user.email[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{member.user.name || member.user.email}</p>
                      <p className="text-xs text-muted-foreground font-mono opacity-80">{member.user.email}</p>
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
                        <SelectTrigger className="w-28 h-8 bg-transparent border-white/10 focus:ring-0 hover:bg-white/5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="MEMBER">Member</SelectItem>
                          <SelectItem value="VIEWER">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="secondary" className="font-mono text-xs px-2.5 py-0.5 bg-secondary/50">
                        {member.role}
                      </Badge>
                    )}
                    {isAdmin && member.role !== "OWNER" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={() => removeMember.mutate({ teamId, userId: member.user.id })}
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
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
