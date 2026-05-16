"use client";

import { useTRPC, useVanillaClient } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * useWorkflow — common logic for workflow data access and mutations.
 * Wraps tRPC workflow procedures with query caching and toast notifications.
 */
export function useWorkflow(workflowId?: string) {
  const trpc = useTRPC();
  const client = useVanillaClient();
  const queryClient = useQueryClient();

  // List all workflows for the active team
  const {
    data: workflows,
    isLoading: isLoadingList,
    refetch: refetchList,
  } = useQuery(trpc.workflows.list.queryOptions());

  // Fetch a single workflow by ID (only runs when workflowId is provided)
  const {
    data: workflow,
    isLoading: isLoadingOne,
    refetch: refetchOne,
  } = useQuery({
    ...trpc.workflows.get.queryOptions({ id: workflowId! }),
    enabled: !!workflowId,
  });

  const createWorkflow = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      client.workflows.create.mutate(data),
    onSuccess: () => {
      refetchList();
      toast.success("Workflow created");
    },
    onError: (error: Error) => {
      toast.error("Failed to create workflow", { description: error.message });
    },
  });

  const updateWorkflow = useMutation({
    mutationFn: (data: {
      id: string;
      name?: string;
      description?: string;
      nodes?: unknown;
      edges?: unknown;
      viewport?: unknown;
      isActive?: boolean;
    }) => client.workflows.update.mutate(data),
    onSuccess: () => {
      refetchList();
      if (workflowId) refetchOne();
    },
    onError: (error: Error) => {
      toast.error("Failed to update workflow", { description: error.message });
    },
  });

  const deleteWorkflow = useMutation({
    mutationFn: (data: { id: string }) =>
      client.workflows.delete.mutate(data),
    onSuccess: () => {
      refetchList();
      toast.success("Workflow deleted");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete workflow", { description: error.message });
    },
  });

  const duplicateWorkflow = useMutation({
    mutationFn: (data: { id: string }) =>
      client.workflows.duplicate.mutate(data),
    onSuccess: () => {
      refetchList();
      toast.success("Workflow duplicated");
    },
    onError: (error: Error) => {
      toast.error("Failed to duplicate workflow", {
        description: error.message,
      });
    },
  });

  const executeWorkflow = useMutation({
    mutationFn: (data: { id: string; inputData?: Record<string, unknown> }) =>
      client.workflows.execute.mutate(data),
    onSuccess: () => {
      toast.success("Workflow execution started");
    },
    onError: (error: Error) => {
      toast.error("Execution failed", { description: error.message });
    },
  });

  const toggleActive = useMutation({
    mutationFn: (data: { id: string; isActive: boolean }) =>
      client.workflows.toggleActive.mutate(data),
    onSuccess: (_, variables) => {
      refetchList();
      if (workflowId) refetchOne();
      toast.success(variables.isActive ? "Workflow activated" : "Workflow deactivated");
    },
    onError: (error: Error) => {
      toast.error("Failed to update workflow", { description: error.message });
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["workflows"] });
  };

  return {
    // Data
    workflow,
    workflows,
    // Loading states
    isLoading: isLoadingList || isLoadingOne,
    isLoadingList,
    isLoadingOne,
    // Mutations
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    duplicateWorkflow,
    executeWorkflow,
    toggleActive,
    // Utilities
    refetch: refetchList,
    refetchOne,
    invalidate,
  };
}
