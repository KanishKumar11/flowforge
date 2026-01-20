import { requireAuth } from "@/lib/auth-utils";
import { ExecutionDetailClient } from "@/features/executions/components/ExecutionDetailClient";

interface PageProps {
  params: Promise<{ executionId: string }>;
}

export default async function ExecutionDetailPage({ params }: PageProps) {
  await requireAuth();
  const { executionId } = await params;
  return <ExecutionDetailClient executionId={executionId} />;
}