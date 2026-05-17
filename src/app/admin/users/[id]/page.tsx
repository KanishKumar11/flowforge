import UserDetailClient from "./UserDetailClient";

export const metadata = { title: "User Detail | Admin – FlowGent" };

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <UserDetailClient params={params} />;
}
