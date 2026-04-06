"use client";

import { useTRPC, useVanillaClient } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, RotateCcw, Clock, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface VersionHistoryPanelProps {
  workflowId: string;
  currentVersion: number;
}

interface VersionUser {
  id: string;
  name: string | null;
  email: string;
}

interface WorkflowVersion {
  id: string;
  versionNum: number;
  createdAt: string | Date;
  changeMessage: string | null;
  createdBy: VersionUser | null;
}

export function VersionHistoryPanel({
  workflowId,
  currentVersion,
}: VersionHistoryPanelProps) {
  const trpc = useTRPC();
  const client = useVanillaClient();
  const queryClient = useQueryClient();

  const { data: versions, isLoading } = useQuery(
    trpc.workflows.listVersions.queryOptions({ workflowId }),
  );

  const rollback = useMutation({
    mutationFn: (data: { workflowId: string; versionNum: number }) =>
      client.workflows.rollback.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      toast.success("Timeline Reversed", {
        className: "bg-black border-emerald-500/20 text-emerald-400 font-mono tracking-wide text-xs",
      });
    },
    onError: (error: Error) => {
      toast.error(error.message, {
        className: "bg-black border-red-500/20 text-red-500 font-mono tracking-wide text-xs",
      });
    },
  });

  const typedVersions = versions as WorkflowVersion[] | undefined;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center gap-3 pb-2 border-b border-white/5">
        <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-inner">
          <History className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-mono uppercase tracking-widest text-white text-sm font-bold flex items-center gap-2">
            Timeline
            <span className="text-emerald-400/50 font-normal text-[10px]">
              (V.{currentVersion})
            </span>
          </h3>
          <p className="text-white/40 text-[9px] uppercase tracking-widest font-mono mt-0.5">Matrix Revision History</p>
        </div>
      </div>

      <ScrollArea className="h-72 pr-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-panel p-4 rounded-2xl flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite_0.1s]" />
                  <div className="h-2 w-1/2 rounded bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite_0.2s]" />
                </div>
              </div>
            ))}
          </div>
        ) : typedVersions && typedVersions.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-3 relative before:absolute before:inset-y-0 before:left-[1.35rem] before:w-px before:bg-gradient-to-b before:from-emerald-500/50 before:to-transparent"
          >
            <AnimatePresence>
              {typedVersions.map((version) => {
                const isCurrent = version.versionNum === currentVersion;
                return (
                  <motion.div
                    key={version.id}
                    variants={itemVariants}
                    className={`relative pl-12 py-2 group transition-all`}
                  >
                    {/* Timeline Node */}
                    <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 bg-[var(--background)] z-10 transition-colors duration-300 ${isCurrent ? "border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "border-white/20 group-hover:border-emerald-400"}`} />
                    
                    <div className={`glass-panel p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                      isCurrent 
                        ? "border-emerald-500/20 bg-emerald-500/[0.02]" 
                        : "border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                    }`}>
                      {isCurrent && (
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
                      )}
                      
                      <div className="flex items-start justify-between relative z-10 gap-4">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-white text-sm tracking-tight font-bold uppercase truncate">
                              V.{version.versionNum}
                            </span>
                            {isCurrent && (
                              <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-widest shrink-0">
                                Active State
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-white/40 uppercase tracking-widest pt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                            </span>
                            {version.createdBy && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span className="flex items-center gap-1 truncate max-w-[120px]">
                                  <User className="h-3 w-3" />
                                  {version.createdBy.name || version.createdBy.email?.split('@')[0]}
                                </span>
                              </>
                            )}
                          </div>

                          {version.changeMessage && (
                            <p className="text-[10px] text-white/60 font-mono mt-2 italic border-l-2 border-white/10 pl-2">
                              {version.changeMessage}
                            </p>
                          )}
                        </div>

                        {!isCurrent && (
                          <Button
                            variant="outline"
                            onClick={() =>
                              rollback.mutate({
                                workflowId,
                                versionNum: version.versionNum,
                              })
                            }
                            disabled={rollback.isPending}
                            className={`shrink-0 rounded-xl border border-emerald-500/20 bg-transparent text-emerald-400 hover:bg-emerald-500 hover:text-black font-mono text-[9px] uppercase tracking-widest transition-all h-8 ${rollback.isPending ? "opacity-50" : "opacity-0 group-hover:opacity-100"}`}
                          >
                            {rollback.isPending && rollback.variables?.versionNum === version.versionNum ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <RotateCcw className="h-3 w-3 mr-1.5" />
                                Restore
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center h-full">
            <div className="p-4 bg-white/5 rounded-full mb-4 border border-white/10 shadow-inner">
              <History className="h-6 w-6 text-white/30" />
            </div>
            <p className="font-mono text-white uppercase text-xs tracking-widest font-bold">Unmapped Timeline</p>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-2 max-w-[200px]">
              No revision history captured. Versions populate automatically.
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
