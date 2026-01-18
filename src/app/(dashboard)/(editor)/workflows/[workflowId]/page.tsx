import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
  params: Promise<{ workflowId: string }>;
}
export default async function WorkflowPage({ params }: PageProps) {
  const { workflowId } = await params;
  await requireAuth()
  return <div>Workflow {workflowId}</div>;
}