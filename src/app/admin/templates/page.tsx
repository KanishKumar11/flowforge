export const metadata = { title: "Templates | Admin – FlowGent" };

export default function AdminTemplatesPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/50 bg-card px-5 py-4">
        <h1 className="text-xl font-bold tracking-tight">Templates</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage public workflow templates available to all users.
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        Template management will be implemented in a future update.
      </p>
    </div>
  );
}
