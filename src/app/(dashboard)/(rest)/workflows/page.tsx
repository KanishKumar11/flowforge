import { requireAuth } from "@/lib/auth-utils";
import { WorkflowsPageClient } from "@/features/workflows/components/WorkflowsPageClient";

export default async function WorkflowsPage() {
  await requireAuth();
  return <WorkflowsPageClient />;
}
