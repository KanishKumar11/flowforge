import { requireAuth } from "@/lib/auth-utils";
import { WorkflowEditorClient } from "./client";

interface PageProps {
  params: Promise<{ workflowId: string }>;
}

export default async function WorkflowPage({ params }: PageProps) {
  const { workflowId } = await params;
  await requireAuth();
  return <WorkflowEditorClient workflowId={workflowId} />;
}
