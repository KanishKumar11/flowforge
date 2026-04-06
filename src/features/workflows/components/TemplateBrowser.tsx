"use client";

import { useTRPC, useVanillaClient } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BookTemplate,
  Workflow,
  Zap,
  Database,
  MessageSquare,
  Clock,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";

const categoryIcons: Record<string, React.ReactNode> = {
  Notifications: <MessageSquare className="h-4 w-4" />,
  Scheduled: <Clock className="h-4 w-4" />,
  AI: <Zap className="h-4 w-4" />,
  Data: <Database className="h-4 w-4" />,
  Developer: <Workflow className="h-4 w-4" />,
};

export function TemplateBrowser() {
  const trpc = useTRPC();
  const client = useVanillaClient();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const { data, isLoading } = useQuery(trpc.workflows.templates.queryOptions());

  const createFromTemplate = useMutation({
    mutationFn: (data: { templateId: string; name: string }) =>
      client.workflows.createFromTemplate.mutate(data),
    onSuccess: (workflow) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      toast.success("Matrix Synchronized", {
        className: "bg-black border-emerald-500/20 text-emerald-400 font-mono tracking-wide text-xs",
      });
      setIsOpen(false);
      router.push(`/workflows/${workflow.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message, {
        className: "bg-black border-red-500/20 text-red-400 font-mono tracking-wide text-xs",
      });
    },
  });

  const templates = data?.templates || [];
  const categories = data?.categories || [];
  const filteredTemplates = selectedCategory
    ? templates.filter((t) => t.category === selectedCategory)
    : templates;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="rounded-full bg-(--arch-fg) text-[var(--background)] hover:bg-white h-11 px-6 font-mono text-[10px] uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(var(--arch-accent-rgb)/0.2)] hover:shadow-[0_0_30px_rgba(var(--arch-accent-rgb)/0.4)] transition-all gap-2"
        >
          <BookTemplate className="h-4 w-4" />
          Template Library
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[85vh] bg-[rgba(15,17,21,0.95)] backdrop-blur-2xl border-white/10 text-white rounded-[2rem] shadow-2xl p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
          <DialogTitle className="font-mono uppercase text-lg tracking-widest text-emerald-400 flex items-center gap-3">
            <BookTemplate className="h-5 w-5" />
            Architect Blueprints
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-8 space-y-6 flex flex-col">
          {/* Category Filters */}
          <div className="flex gap-3 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full h-9 px-5 font-mono text-[10px] uppercase tracking-widest font-bold transition-all border-transparent ${
                selectedCategory === null 
                  ? "bg-(--arch-accent) text-black shadow-[0_0_20px_rgba(var(--arch-accent-rgb)/0.3)] hover:bg-emerald-400" 
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              All Matrices
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full h-9 px-5 font-mono text-[10px] uppercase tracking-widest font-bold transition-all gap-2 border-transparent ${
                  selectedCategory === cat
                    ? "bg-(--arch-accent) text-black shadow-[0_0_20px_rgba(var(--arch-accent-rgb)/0.3)] hover:bg-emerald-400" 
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                }`}
              >
                {categoryIcons[cat] || <Workflow className="h-3 w-3" />}
                {cat}
              </Button>
            ))}
          </div>

          {/* Templates Grid */}
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-4">
               {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-panel h-[160px] rounded-3xl p-6 flex flex-col justify-between">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
                      <div className="space-y-3 flex-1">
                        <div className="h-4 w-2/3 rounded bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite_0.1s]" />
                        <div className="h-2 w-1/3 rounded bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite_0.2s]" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-4 pb-12 flex-1"
            >
              <AnimatePresence>
                {filteredTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    variants={itemVariants}
                    layout
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setWorkflowName(template.name);
                    }}
                    className={`glass-panel cursor-pointer rounded-3xl p-6 h-[160px] flex flex-col relative overflow-hidden transition-all duration-300 ${
                      selectedTemplate === template.id
                        ? "bg-[rgba(var(--arch-accent-rgb)/0.08)] border-(--arch-accent) shadow-[0_0_30px_rgba(var(--arch-accent-rgb)/0.15)]"
                        : "hover:bg-white/[0.03] border-white/5 hover:border-white/20"
                    }`}
                  >
                    {selectedTemplate === template.id && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-(--arch-accent) opacity-10 blur-3xl rounded-full" />
                    )}
                    
                    <div className="flex items-start justify-between relative z-10">
                      <div>
                        <h4 className="text-sm font-bold font-mono text-white tracking-widest uppercase truncate max-w-[180px]">
                          {template.name}
                        </h4>
                        <p className="text-[9px] font-mono text-white/50 uppercase tracking-widest mt-1 mb-3 line-clamp-2 min-h-[28px]">
                          {template.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between relative z-10 pt-3 border-t border-white/5">
                      <div className="flex flex-wrap gap-1.5 overflow-hidden h-5">
                         {template.tags.map((tag) => (
                            <span key={tag} className="text-[8px] font-mono text-white/40 uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                              {tag}
                            </span>
                          ))}
                      </div>
                      <span className="text-[9px] font-mono text-(--arch-accent) uppercase tracking-widest px-2 py-0.5 rounded-full bg-[rgba(var(--arch-accent-rgb)/0.1)] border border-[rgba(var(--arch-accent-rgb)/0.2)] shrink-0">
                        {template.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Create Button Section */}
          {selectedTemplate && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-auto p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-end gap-4 shadow-inner"
            >
              <div className="flex-1 space-y-3 w-full">
                <label className="text-emerald-400 font-mono uppercase text-[10px] tracking-widest ml-1">
                  Matrix Instantiation Identifier
                </label>
                <Input
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="My Configured Matrix"
                  className="bg-black/50 border-white/10 text-white font-mono text-xs rounded-xl h-11 px-4 placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-emerald-400/50"
                />
              </div>
              <Button
                onClick={() =>
                  createFromTemplate.mutate({
                    templateId: selectedTemplate,
                    name: workflowName,
                  })
                }
                disabled={createFromTemplate.isPending || !workflowName}
                className="w-full md:w-auto h-11 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black border border-transparent shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all font-mono text-[10px] uppercase tracking-widest font-bold"
              >
                {createFromTemplate.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Compile Blueprint"
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
