"use client";

import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
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
import { useTRPC, useVanillaClient } from "@/trpc/client";
import { Loader2, Plus, Settings, Users, Workflow } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";

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
      toast.success("Organization Node Provisioned", {
        className: "bg-black border-emerald-500/20 text-emerald-400 font-mono tracking-wide text-xs uppercase"
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to provision team", {
        className: "bg-black border-red-500/20 text-red-500 font-mono tracking-wide text-xs uppercase"
      });
    },
  });

  const handleCreate = async () => {
    if (!newTeam.name.trim()) return;
    await createTeam.mutateAsync(newTeam);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[var(--background)]">
      <div className="px-8 py-2">
        <DashboardHeader
          title="Organizations"
          action={
            <Button
              onClick={() => setShowCreateModal(true)}
              className="rounded-full bg-(--arch-fg) text-[var(--background)] hover:bg-white h-11 px-6 font-mono text-[10px] uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(var(--arch-accent-rgb)/0.2)] hover:shadow-[0_0_30px_rgba(var(--arch-accent-rgb)/0.4)] transition-all gap-2"
            >
              <Plus className="h-4 w-4" />
              Provision Node
            </Button>
          }
        />
      </div>

      <div className="flex-1 px-8 pb-12 overflow-auto">
        <div className="max-w-[1400px] mx-auto pt-6">
            {/* Loading */}
            {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-panel h-[220px] rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
                </div>
                ))}
            </div>
            )}

            {/* Empty State */}
            {!isLoading && teams?.length === 0 && (
            <div className="glass-panel rounded-[2rem] p-16 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl pointer-events-none" />
                
                <div className="p-6 bg-white/5 rounded-full mb-6 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] group-hover:border-emerald-500/20 transition-all duration-500 relative z-10">
                    <Users className="w-12 h-12 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold tracking-tighter mb-3 font-mono uppercase text-white relative z-10">
                    No Organizations Found
                </h3>
                <p className="text-white/40 mb-8 max-w-sm mx-auto text-[10px] uppercase tracking-widest font-mono leading-relaxed relative z-10">
                    Provision a team node to federate multi-user matrix architectures.
                </p>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-full bg-(--arch-fg) text-[var(--background)] hover:bg-white h-12 px-8 font-mono text-[10px] uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(var(--arch-accent-rgb)/0.2)] hover:shadow-[0_0_30px_rgba(var(--arch-accent-rgb)/0.4)] transition-all relative z-10"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Initialize Root Node
                </Button>
            </div>
            )}

            {/* Teams Grid */}
            {!isLoading && teams && teams.length > 0 && (
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence>
                {teams.map((team) => (
                    <motion.div variants={itemVariants} key={team.id}>
                        <div className="glass-panel group relative overflow-hidden rounded-[2rem] p-6 hover:bg-white/[0.03] transition-all duration-500 h-[240px] flex flex-col justify-between border-white/5 hover:border-white/10">
                        {/* Background Ambient Glow Effect */}
                        {team.role === "OWNER" && (
                            <div className="absolute -top-16 -right-16 w-32 h-32 bg-emerald-500 opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" />
                        )}

                        <div className="flex flex-col relative z-10 gap-3">
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="text-xl font-bold tracking-tighter truncate font-mono uppercase text-white group-hover:text-emerald-400 transition-colors">
                                    {team.name}
                                </h3>
                                <span
                                    className={`shrink-0 text-[9px] uppercase font-bold font-mono tracking-widest px-3 py-1 rounded-full border ${
                                    team.role === "OWNER"
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        : team.role === "ADMIN"
                                        ? "bg-white/10 text-white border-white/20"
                                        : "bg-white/5 text-white/50 border-white/10"
                                    }`}
                                >
                                    {team.role}
                                </span>
                            </div>
                            
                            {team.description ? (
                            <p className="line-clamp-2 text-[10px] font-mono tracking-widest uppercase text-white/40 h-[36px]">
                                {team.description}
                            </p>
                            ) : (
                            <p className="line-clamp-2 text-[10px] italic font-mono tracking-widest uppercase text-white/20 h-[36px]">
                                NO_DESCRIPTION_PROVIDED
                            </p>
                            )}
                        </div>
                        
                        <div className="flex flex-col gap-4 relative z-10 pt-4 border-t border-white/5 mt-auto">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5">
                                    <Users className="h-3 w-3 text-white/50" />
                                    <span className="font-bold text-white text-xs font-mono">{team.memberCount}</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5">
                                    <Workflow className="h-3 w-3 text-white/50" />
                                    <span className="font-bold text-white text-xs font-mono">{team.workflowCount}</span>
                                </div>
                            </div>
                            <Button
                                variant="default"
                                className="w-full gap-2 rounded-xl border border-transparent hover:border-emerald-500/30 transition-all font-mono uppercase text-[10px] tracking-widest font-bold h-10 bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                                asChild
                            >
                                <Link href={`/teams/${team.id}`}>
                                    <Settings className="h-4 w-4" />
                                    Administer
                                </Link>
                            </Button>
                        </div>
                        </div>
                    </motion.div>
                ))}
                </AnimatePresence>
            </motion.div>
            )}
        </div>
      </div>

      {/* Create Team Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogContent className="bg-[rgba(15,17,21,0.95)] backdrop-blur-2xl border-white/10 rounded-[2rem] max-w-lg p-0 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <DialogHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
                <DialogTitle className="font-mono uppercase text-lg tracking-widest text-emerald-400 flex items-center gap-3">
                  <Users className="h-5 w-5" />
                  Provision Org Node
                </DialogTitle>
                <DialogDescription className="font-mono text-[10px] tracking-widest uppercase text-white/40 mt-2">
                  Create an isolated tenant namespace for collaborative architecture.
                </DialogDescription>
              </DialogHeader>
              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="name"
                    className="text-emerald-400 font-mono uppercase text-[10px] tracking-widest ml-1"
                  >
                    Namespace Index
                  </Label>
                  <Input
                    id="name"
                    placeholder="ENTER_TEAM_ALIAS..."
                    value={newTeam.name}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, name: e.target.value })
                    }
                    className="bg-black/50 border-white/10 text-white font-mono text-xs rounded-xl h-12 px-4 placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-emerald-400/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="description"
                    className="text-white/60 font-mono uppercase text-[10px] tracking-widest ml-1"
                  >
                    Context Metadata
                  </Label>
                  <Input
                    id="description"
                    placeholder="OPTIONAL_DESCRIPTION_PAYLOAD..."
                    value={newTeam.description}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, description: e.target.value })
                    }
                    className="bg-black/50 border-white/10 text-white font-mono text-xs rounded-xl h-12 px-4 placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-emerald-400/50"
                  />
                </div>
              </div>
              <DialogFooter className="p-6 bg-black/40 border-t border-white/5 sm:justify-end gap-3 rounded-b-[2rem]">
                <Button
                  variant="ghost"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl font-mono uppercase text-[10px] tracking-widest text-white/50 hover:text-white hover:bg-white/5 h-10 px-6 transition-colors"
                >
                  Abort
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!newTeam.name.trim() || createTeam.isPending}
                  className="rounded-xl font-mono uppercase text-[10px] tracking-widest text-black bg-emerald-500 hover:bg-emerald-400 h-10 px-8 transition-all disabled:opacity-50 font-bold border border-transparent shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  {createTeam.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {createTeam.isPending ? "Allocating..." : "Provision"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
