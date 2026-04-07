import { requireAuth } from "@/lib/auth-utils";
import { CredentialDetailClient } from "@/features/credentials/components/CredentialDetailClient";

interface PageProps {
  params: Promise<{ credentialId: string }>;
}
export default async function CredentialPage({ params }: PageProps) {
  const { credentialId } = await params;
  await requireAuth();
  return <CredentialDetailClient credentialId={credentialId} />;
}
