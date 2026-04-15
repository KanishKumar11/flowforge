import { requireAuth } from "@/lib/auth-utils";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const ExecutionDetailClient = dynamic(
  () =>
    import(
      "@/features/executions/components/ExecutionDetailClient"
    ).then((m) => m.ExecutionDetailClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col h-full p-6 gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    ),
  },
);

interface PageProps {
  params: Promise<{ executionId: string }>;
}

export default async function ExecutionDetailPage({ params }: PageProps) {
  await requireAuth();
  const { executionId } = await params;
  return <ExecutionDetailClient executionId={executionId} />;
}
