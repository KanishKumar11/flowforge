
"use client"
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { data } = useQuery(trpc.getWorkflows.queryOptions())
  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
    }
  }))
  const testAi = useMutation(trpc.testAi.mutationOptions())
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex flex-col gap-4">
      {JSON.stringify(data, null, 2)}
      <Button disabled={create.isPending} onClick={() => create.mutate()}>Create Workflow</Button>
      <p>{testAi.data?.message}</p>
      <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>Test AI</Button>
    </div>
  );
}
