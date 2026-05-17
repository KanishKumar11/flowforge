import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  const adminUser = await prisma.adminUser.findUnique({
    where: { userId: session.user.id },
  });

  if (!adminUser || !adminUser.isActive) {
    redirect("/dashboard?error=unauthorized");
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-screen overflow-hidden bg-muted/30 dark:bg-background">
        <AdminSidebar user={session.user} adminRole={adminUser.role} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
