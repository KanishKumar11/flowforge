import { requireAuth } from "@/lib/auth-utils";
import { ExecutionsPageClient } from "@/features/executions/components/ExecutionsPageClient";

export default async function ExecutionsPage() {
    await requireAuth();
    return <ExecutionsPageClient />;
}
