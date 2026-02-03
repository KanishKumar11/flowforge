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
import {
  Loader2,
  Plus,
  Settings,
  Users,
  Workflow,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";

export function TeamsPageClient() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: "", description: "" });

  const trpc = useTRPC();
  const client = useVanillaClient();
  const { data: teams, isLoading, refetch } = useQuery(trpc.teams.list.queryOptions());

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
        title={<span className="gradient-text">Teams</span>}
        description="Collaborate with your organization members."
        action={
          <Button onClick={() => setShowCreateModal(true)} className="gap-2 shadow-lg hover:shadow-primary/25 transition-all">
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
              <div key={i} className="p-8 border rounded-2xl space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
                <div className="flex gap-4 pt-4">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && teams?.length === 0 && (
          <div className="empty-state glass border border-white/20 dark:border-white/10 rounded-2xl p-12 text-center animate-fadeIn shadow-lg">
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-8 mx-auto ring-1 ring-primary/20 shadow-inner">
              <Users className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-3">No teams yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg leading-relaxed">
              Create a team to start collaborating on workflows with your organization.
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              size="lg"
              className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5 text-base px-8 h-12"
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
              <Card key={team.id} className="glass border-white/20 dark:border-white/10 shadow-lg backdrop-blur-xl hover-lift group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-20 bg-linear-to-bl from-primary/5 to-transparent rounded-bl-full -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {team.name}
                    </CardTitle>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${team.role === 'OWNER' ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' :
                      team.role === 'ADMIN' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                        'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                      }`}>
                      {team.role}
                    </span>
                  </div>
                  <CardDescription className="line-clamp-2 min-h-[40px] text-sm mt-2">
                    {team.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6 bg-background/30 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary/70" />
                      <span className="font-semibold text-foreground">{team.memberCount}</span> members
                    </div>
                    <div className="flex items-center gap-2">
                      <Workflow className="h-4 w-4 text-primary/70" />
                      <span className="font-semibold text-foreground">{team.workflowCount}</span> workflows
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="default" className="w-full gap-2 shadow-md hover:shadow-lg transition-all" asChild>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>
              Create a team to collaborate on workflows with others.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team Name</Label>
              <Input
                id="name"
                placeholder="My Team"
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="What does this team work on?"
                value={newTeam.description}
                onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newTeam.name.trim() || createTeam.isPending}
            >
              {createTeam.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
