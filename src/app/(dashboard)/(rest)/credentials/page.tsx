import { requireAuth } from "@/lib/auth-utils";
import { CredentialsPageClient } from "@/features/credentials/components/CredentialsPageClient";

export default async function CredentialsPage() {
  await requireAuth();
  return <CredentialsPageClient />;
}
