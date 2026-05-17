import { redirect } from "next/navigation";

// /admin/activity redirects to the logs page (admin audit log tab)
export default function AdminActivityPage() {
  redirect("/admin/logs");
}
