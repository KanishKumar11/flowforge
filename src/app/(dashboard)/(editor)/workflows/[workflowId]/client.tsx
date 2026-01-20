"use client";

import { WorkflowEditor } from "@/features/editor/components/WorkflowEditor";

interface WorkflowEditorClientProps {
  workflowId: string;
}

export function WorkflowEditorClient({ workflowId }: WorkflowEditorClientProps) {
  return (
    <div className="h-screen w-full">
      <WorkflowEditor workflowId={workflowId} />
    </div>
  );
}
