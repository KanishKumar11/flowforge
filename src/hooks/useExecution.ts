"use client";

import { useTRPC, useVanillaClient } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type ExecutionStatus =
  | "PENDING"
  | "RUNNING"
  | "SUCCESS"
  | "ERROR"
  | "CANCELLED"
  | "WAITING";

/**
 * useExecution — common logic for execution data access and mutations.
 * Wraps tRPC execution procedures with query caching and toast notifications.
 */
export function useExecution(workflowId?: string) {
  const trpc = useTRPC();
  const client = useVanillaClient();
  const queryClient = useQueryClient();

  // List executions, optionally filtered by workflowId
  const {
    data: executionsData,
    isLoading: isLoadingList,
    refetch,
  } = useQuery(
    trpc.executions.list.queryOptions({
      workflowId: workflowId,
      limit: 50,
    }),
  );

  const executions = ((executionsData?.items ?? []) as unknown[]) as { id: string; status: ExecutionStatus; [key: string]: unknown }[];

  // Aggregate execution stats (last 7 days by default)
  const { data: stats, isLoading: isLoadingStats } = useQuery(
    trpc.executions.stats.queryOptions({ days: 7 }),
  );

  const cancelExecution = useMutation({
    mutationFn: (data: { id: string }) => client.executions.cancel.mutate(data),
    onSuccess: () => {
      refetch();
      toast.success("Execution cancelled");
    },
    onError: (error: Error) => {
      toast.error("Failed to cancel execution", { description: error.message });
    },
  });

  const retryExecution = useMutation({
    mutationFn: (data: { id: string }) => client.executions.retry.mutate(data),
    onSuccess: () => {
      refetch();
      toast.success("Execution queued for retry");
    },
    onError: (error: Error) => {
      toast.error("Failed to retry execution", { description: error.message });
    },
  });

  const deleteExecution = useMutation({
    mutationFn: (data: { id: string }) => client.executions.delete.mutate(data),
    onSuccess: () => {
      refetch();
      toast.success("Execution deleted");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete execution", { description: error.message });
    },
  });

  // Fetch a single execution with timeline steps
  const getExecution = (id: string) =>
    useQuery(trpc.executions.get.queryOptions({ id }));

  const getTimeline = (id: string) =>
    useQuery(trpc.executions.timeline.queryOptions({ workflowId: id }));

  const filterByStatus = (status: ExecutionStatus) =>
    executions.filter((e) => e.status === status);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["executions"] });
  };

  return {
    // Data
    executions,
    stats,
    // Loading states
    isLoading: isLoadingList || isLoadingStats,
    isLoadingList,
    isLoadingStats,
    // Mutations
    cancelExecution,
    retryExecution,
    deleteExecution,
    // Utilities
    getExecution,
    getTimeline,
    filterByStatus,
    refetch,
    invalidate,
  };
}
