import { Suspense } from "react";
import AdminDashboardClient from "./AdminDashboardClient";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Admin Dashboard | FlowGent",
};

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      }
    >
      <AdminDashboardClient />
    </Suspense>
  );
}
