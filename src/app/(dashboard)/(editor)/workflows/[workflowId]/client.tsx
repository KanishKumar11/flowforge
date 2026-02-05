"use client";

import { WorkflowEditor } from "@/features/editor/components/WorkflowEditor";

interface WorkflowEditorClientProps {
  workflowId: string;
}

export function WorkflowEditorClient({ workflowId }: WorkflowEditorClientProps) {
  return (
    <div className="h-[calc(100vh-4rem)] w-full overflow-hidden">
      <WorkflowEditor workflowId={workflowId} />
    </div>
  );
}
