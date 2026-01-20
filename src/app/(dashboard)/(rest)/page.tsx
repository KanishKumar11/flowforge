import { requireAuth } from "@/lib/auth-utils";
import { DashboardHomeClient } from "@/features/dashboard/components/DashboardHomeClient";

export default async function DashboardPage() {
  await requireAuth();
  return <DashboardHomeClient />;
}
