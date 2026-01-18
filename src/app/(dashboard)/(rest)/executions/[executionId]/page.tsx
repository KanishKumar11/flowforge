import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
  params: Promise<{ executionId: string }>;
}
export default async function ExecutionPage({ params }: PageProps) {
  const { executionId } = await params;
  await requireAuth()
  return <div>Execution {executionId}</div>;
}