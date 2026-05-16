"use client";

import { useTRPC, useVanillaClient } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CredentialType = "apiKey" | "oauth2" | "basic" | "bearer" | "custom";

/**
 * useCredentials — common logic for credential data access and mutations.
 * Wraps tRPC credential procedures with query caching and toast notifications.
 * All sensitive values are encrypted server-side via AES-256-GCM.
 */
export function useCredentials(provider?: string) {
  const trpc = useTRPC();
  const client = useVanillaClient();
  const queryClient = useQueryClient();

  const {
    data: credentials,
    isLoading,
    refetch,
  } = useQuery(trpc.credentials.list.queryOptions());

  // Optionally filter by provider (e.g. "github", "slack", "openai")
  const filtered = provider
    ? (credentials ?? []).filter(
        (c) => (c as { provider: string }).provider === provider,
      )
    : credentials ?? [];

  const createCredential = useMutation({
    mutationFn: (data: {
      name: string;
      type: CredentialType;
      provider: string;
      data: Record<string, unknown>;
    }) => client.credentials.create.mutate(data),
    onSuccess: () => {
      refetch();
      toast.success("Credential created");
    },
    onError: (error: Error) => {
      toast.error("Failed to create credential", { description: error.message });
    },
  });

  const updateCredential = useMutation({
    mutationFn: (data: {
      id: string;
      name?: string;
      data?: Record<string, unknown>;
    }) => client.credentials.update.mutate(data),
    onSuccess: () => {
      refetch();
      toast.success("Credential updated");
    },
    onError: (error: Error) => {
      toast.error("Failed to update credential", { description: error.message });
    },
  });

  const deleteCredential = useMutation({
    mutationFn: (data: { id: string }) =>
      client.credentials.delete.mutate(data),
    onSuccess: () => {
      refetch();
      toast.success("Credential deleted");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete credential", { description: error.message });
    },
  });

  const decryptCredential = useMutation({
    mutationFn: (data: { id: string }) =>
      client.credentials.decrypt.mutate(data),
    onError: (error: Error) => {
      toast.error("Failed to decrypt credential", { description: error.message });
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["credentials"] });
  };

  return {
    // Data
    credentials: filtered,
    allCredentials: credentials ?? [],
    // Loading states
    isLoading,
    // Mutations
    createCredential,
    updateCredential,
    deleteCredential,
    decryptCredential,
    // Utilities
    refetch,
    invalidate,
  };
}
