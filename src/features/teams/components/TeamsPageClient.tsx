"use client";

import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC, useVanillaClient } from "@/trpc/client";
import { Loader2, Plus, Settings, Users, Workflow } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";

export function TeamsPageClient() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: "", description: "" });

  const trpc = useTRPC();
  const client = useVanillaClient();
  const {
    data: teams,
    isLoading,
    refetch,
  } = useQuery(trpc.teams.list.queryOptions());

  const createTeam = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      client.teams.create.mutate(data),
    onSuccess: () => {
      refetch();
      setShowCreateModal(false);
      setNewTeam({ name: "", description: "" });
      toast.success("Team created successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to create team", { description: error.message });
    },
  });

  const handleCreate = async () => {
    if (!newTeam.name.trim()) return;
    await createTeam.mutateAsync(newTeam);
  };

  return (
    <div className="flex flex-col h-full space-y-8 animate-fadeIn">
      <DashboardHeader
        title={<span className="text-(--arch-fg) font-mono uppercase tracking-widest">Teams</span>}
        description="Collaborate with your organization members."
        action={
          <Button
            onClick={() => setShowCreateModal(true)}
            className="gap-2 bg-(--arch-fg) text-(--arch-bg) hover:bg-[rgba(var(--arch-fg-rgb)/0.9)] rounded-none font-mono uppercase text-xs h-10 border border-(--arch-fg) shadow-none transition-all"
          >
            <Plus className="h-4 w-4" />
            New Team
          </Button>
        }
      />

      <div className="flex-1 p-6 overflow-auto">
        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-8 border border-(--arch-border) bg-(--arch-bg) rounded-none space-y-4">
                <Skeleton className="h-8 w-48 bg-(--arch-border)" />
                <Skeleton className="h-4 w-64 bg-(--arch-border)" />
                <div className="flex gap-4 pt-4">
                  <Skeleton className="h-10 w-full bg-(--arch-border)" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && teams?.length === 0 && (
          <div className="empty-state border border-(--arch-border) bg-(--arch-bg) rounded-none p-12 text-center animate-fadeIn shadow-none">
            <div className="flex items-center justify-center w-24 h-24 rounded-none bg-[rgba(var(--arch-fg-rgb)/0.05)] mb-8 mx-auto border border-[rgba(var(--arch-fg-rgb)/0.2)]">
              <Users className="w-12 h-12 text-(--arch-fg)" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-3 font-mono uppercase text-(--arch-fg)">
              No teams yet
            </h3>
            <p className="text-(--arch-muted) mb-8 max-w-md mx-auto text-sm font-mono leading-relaxed">
              Create a team to start collaborating on workflows with your
              organization.
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              size="lg"
              className="gap-2 bg-(--arch-fg) text-(--arch-bg) hover:bg-[rgba(var(--arch-fg-rgb)/0.9)] rounded-none font-mono uppercase text-xs h-12 px-8"
            >
              <Plus className="w-5 h-5" />
              Create Your First Team
            </Button>
          </div>
        )}

        {/* Teams Grid */}
        {!isLoading && teams && teams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Card
                key={team.id}
                className="group bg-(--arch-bg) border-(--arch-border) shadow-none rounded-none hover:border-(--arch-fg) transition-all duration-300"
              >
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-bold font-mono uppercase text-(--arch-fg) group-hover:underline">
                      {team.name}
                    </CardTitle>
                    <span
                      className={`text-[10px] uppercase font-bold font-mono tracking-wider px-2.5 py-1 rounded-none border ${team.role === "OWNER"
                          ? "bg-(--arch-fg) text-(--arch-bg) border-(--arch-fg)"
                          : team.role === "ADMIN"
                            ? "bg-[rgba(var(--arch-fg-rgb)/0.1)] text-(--arch-fg) border-(--arch-fg)"
                            : "bg-[rgba(var(--arch-muted-rgb)/0.1)] text-(--arch-muted) border-(--arch-muted)"
                        }`}
                    >
                      {team.role}
                    </span>
                  </div>
                  <CardDescription className="line-clamp-2 min-h-[40px] text-xs font-mono text-(--arch-muted) mt-2">
                    {team.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-center gap-6 text-xs font-mono text-(--arch-muted) mb-6 bg-[rgba(var(--arch-bg-secondary-rgb)/0.5)] p-3 rounded-none border border-(--arch-border)">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-(--arch-fg)" />
                      <span className="font-bold text-(--arch-fg)">
                        {team.memberCount}
                      </span>{" "}
                      MEMBERS
                    </div>
                    <div className="flex items-center gap-2">
                      <Workflow className="h-4 w-4 text-(--arch-fg)" />
                      <span className="font-bold text-(--arch-fg)">
                        {team.workflowCount}
                      </span>{" "}
                      FLOWS
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="default"
                      className="w-full gap-2 rounded-none font-mono uppercase text-xs h-10 bg-(--arch-fg) text-(--arch-bg) hover:bg-[rgba(var(--arch-fg-rgb)/0.9)]"
                      asChild
                    >
                      <Link href={`/teams/${team.id}`}>
                        <Settings className="h-4 w-4" />
                        Manage Team
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-(--arch-bg) border-(--arch-border) rounded-none max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-mono uppercase text-(--arch-fg)">Create New Team</DialogTitle>
            <DialogDescription className="font-mono text-xs text-(--arch-muted)">
              Create a team to collaborate on workflows with others.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-(--arch-fg) font-mono uppercase text-xs">Team Name</Label>
              <Input
                id="name"
                placeholder="MY_TEAM"
                value={newTeam.name}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, name: e.target.value })
                }
                className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-(--arch-fg) font-mono uppercase text-xs">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="What does this team work on?"
                value={newTeam.description}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, description: e.target.value })
                }
                className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              className="border-(--arch-border) text-(--arch-fg) hover:bg-(--arch-fg) hover:text-(--arch-bg) rounded-none font-mono uppercase text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newTeam.name.trim() || createTeam.isPending}
              className="bg-(--arch-fg) text-(--arch-bg) hover:bg-[rgba(var(--arch-fg-rgb)/0.9)] rounded-none font-mono uppercase text-xs"
            >
              {createTeam.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Create Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
