import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
  params: Promise<{ credentialId: string }>;
}
export default async function CredentialPage({ params }: PageProps) {
  const { credentialId } = await params;
  await requireAuth();
  return <div>Credential {credentialId}</div>;
}
