import { requireAuth } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function HomePage() {
  await requireAuth();
  return redirect("/dashboard");
}
