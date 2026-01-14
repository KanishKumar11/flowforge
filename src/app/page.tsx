
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { LogoutButton } from "./logout";

export default async function HomePage() {
  await requireAuth();
  const data = await caller.getUsers(); 
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      {JSON.stringify(data, null, 2)}
      <LogoutButton/>
    </div>
  );
}
