import { requireAuth } from "@/lib/auth-utils";
import { WorkflowTemplateLibrary } from "@/features/workflows/components/WorkflowTemplateLibrary";
import { DashboardHeader } from "@/components/DashboardHeader";

export default async function TemplatesPage() {
  await requireAuth();
  return (
    <div className="flex flex-col h-full bg-(--arch-bg) min-h-screen">
      <DashboardHeader
        title="Template Library"
        description="Start from a prebuilt workflow — search, filter, and deploy in seconds"
      />
      <div className="flex-1 p-8 overflow-auto">
        <WorkflowTemplateLibrary />
      </div>
    </div>
  );
}
