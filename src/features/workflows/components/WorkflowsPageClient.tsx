"use client";

import { DashboardHeader } from "@/components/DashboardHeader";
import { WorkflowCard } from "./WorkflowCard";
import { CreateWorkflowModal } from "./CreateWorkflowModal";
import { EmptyWorkflows } from "./EmptyWorkflows";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC, useVanillaClient } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Workflow } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { TemplateBrowser } from "@/features/workflows/components/TemplateBrowser";
import { WorkflowSearch } from "@/features/workflows/components/WorkflowSearch";

// Explicit type to avoid deep type inference
interface WorkflowItem {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  folder: string | null;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  lastExecutedAt: Date | string | null;
  _count: {
    executions: number;
  };
}

export function WorkflowsPageClient() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const trpc = useTRPC();
  const client = useVanillaClient();
  const {
    data: workflowsData,
    isLoading,
    refetch,
  } = useQuery(trpc.workflows.list.queryOptions());

  // Cast to explicit type to avoid deep type inference
  const workflows = workflowsData as WorkflowItem[] | undefined;

  const createWorkflow = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      client.workflows.create.mutate(data),
    onSuccess: (workflow) => {
      refetch();
      toast.success("Workflow created successfully");
      router.push(`/workflows/${workflow.id}`);
    },
    onError: (error: Error) => {
      toast.error("Failed to create workflow", {
        description: error.message,
      });
    },
  });

  const toggleWorkflow = useMutation({
    mutationFn: (data: { id: string }) =>
      client.workflows.toggleActive.mutate(data),
    onSuccess: () => {
      refetch();
      toast.success("Workflow status updated");
    },
    onError: () => {
      toast.error("Failed to update workflow");
    },
  });

  const duplicateWorkflow = useMutation({
    mutationFn: (data: { id: string }) =>
      client.workflows.duplicate.mutate(data),
    onSuccess: () => {
      refetch();
      toast.success("Workflow duplicated");
    },
    onError: () => {
      toast.error("Failed to duplicate workflow");
    },
  });

  const deleteWorkflow = useMutation({
    mutationFn: (data: { id: string }) => client.workflows.delete.mutate(data),
    onSuccess: () => {
      refetch();
      toast.success("Workflow deleted");
    },
    onError: () => {
      toast.error("Failed to delete workflow");
    },
  });

  const filteredWorkflows = workflows?.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreateWorkflow = async (data: {
    name: string;
    description: string;
  }) => {
    await createWorkflow.mutateAsync(data);
  };

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Workflows"
        description="Create and manage your automation workflows"
        action={
          <div className="flex items-center gap-2">
            <TemplateBrowser />
            <Button onClick={() => setShowCreateModal(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Workflow
            </Button>
          </div>
        }
      />

      <div className="flex-1 p-6 overflow-auto">
        {/* Stats Overview */}
        {!isLoading && workflows && workflows.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 border border-[var(--arch-border)] bg-[var(--arch-bg)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Workflow className="w-24 h-24 text-[var(--arch-fg)] transform rotate-12" />
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 border border-[var(--arch-fg)] bg-[var(--arch-fg)]/10 text-[var(--arch-fg)]">
                  <Workflow className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tight font-mono text-[var(--arch-fg)]">
                    {workflows.length}
                  </p>
                  <p className="text-xs text-[var(--arch-muted)] font-mono uppercase tracking-wider">
                    Total Workflows
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border border-[var(--arch-border)] bg-[var(--arch-bg)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <div className="w-24 h-24 bg-[var(--arch-fg)] rounded-full blur-2xl" />
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 border border-[var(--arch-fg)] bg-[var(--arch-fg)]/10 text-[var(--arch-fg)]">
                  <div className="h-6 w-6 flex items-center justify-center">
                    <span className="w-3 h-3 rounded-full bg-[var(--arch-fg)] animate-pulse" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tight font-mono text-[var(--arch-fg)]">
                    {workflows.filter((w) => w.isActive).length}
                  </p>
                  <p className="text-xs text-[var(--arch-muted)] font-mono uppercase tracking-wider">
                    Active Systems
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border border-[var(--arch-border)] bg-[var(--arch-bg)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <div className="w-24 h-24 bg-[var(--arch-muted)] rounded-full blur-2xl" />
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 border border-[var(--arch-muted)] bg-[var(--arch-muted)]/10 text-[var(--arch-muted)]">
                  <div className="h-6 w-6 flex items-center justify-center">
                    <span className="w-3 h-3 rounded-full bg-[var(--arch-muted)]" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tight font-mono text-[var(--arch-muted)]">
                    {workflows.filter((w) => !w.isActive).length}
                  </p>
                  <p className="text-xs text-[var(--arch-muted)] font-mono uppercase tracking-wider">
                    Draft Mode
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        {!isLoading && workflows && workflows.length > 0 && (
          <div className="mb-6">
            <WorkflowSearch />
          </div>
        )}

        {/* Workflow List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
            ))}
          </div>
        ) : filteredWorkflows && filteredWorkflows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onActivate={() => toggleWorkflow.mutate({ id: workflow.id })}
                onDuplicate={() =>
                  duplicateWorkflow.mutate({ id: workflow.id })
                }
                onDelete={() => deleteWorkflow.mutate({ id: workflow.id })}
              />
            ))}
          </div>
        ) : (
          <EmptyWorkflows onCreateClick={() => setShowCreateModal(true)} />
        )}
      </div>

      <CreateWorkflowModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreateWorkflow}
        isLoading={createWorkflow.isPending}
      />
    </div>
  );
}
