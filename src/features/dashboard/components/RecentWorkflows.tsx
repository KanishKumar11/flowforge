
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, Workflow } from "lucide-react";
import Link from "next/link";

interface RecentWorkflowsProps {
  workflows: any[] | undefined;
  isLoading: boolean;
}

export function RecentWorkflows({ workflows, isLoading }: RecentWorkflowsProps) {
  return (
    <Card className="bg-[var(--arch-bg-secondary)] border-[var(--arch-border)] text-[var(--arch-fg)] shadow-none rounded-none h-full">
      <CardHeader>
        <CardTitle className="text-xl font-heading font-light tracking-tight text-[var(--arch-fg)] uppercase">Recent_Workflows</CardTitle>
        <CardDescription className="font-mono text-xs text-[var(--arch-muted)]">LATEST_ACTIVITY //</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 bg-[var(--arch-border)]" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4 bg-[var(--arch-border)]" />
                  <Skeleton className="h-3 w-1/2 bg-[var(--arch-border)]" />
                </div>
              </div>
            ))}
          </div>
        ) : workflows && workflows.length > 0 ? (
          <div className="space-y-2">
            {workflows.slice(0, 5).map((workflow) => (
              <Link
                key={workflow.id}
                href={`/workflows/${workflow.id}`}
                className="flex items-center justify-between p-3 -mx-2 hover:bg-[var(--arch-bg)] border border-transparent hover:border-[var(--arch-border)] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 transition-colors border ${workflow.isActive
                    ? "bg-[var(--arch-fg)] text-[var(--arch-bg)] border-[var(--arch-fg)]"
                    : "bg-[var(--arch-bg)] text-[var(--arch-muted)] border-[var(--arch-border)]"
                    }`}>
                    <Workflow className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-mono text-sm font-medium text-[var(--arch-fg)]">{workflow.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-mono uppercase tracking-widest ${workflow.isActive ? "text-[var(--arch-accent)]" : "text-[var(--arch-muted)]"
                        }`}>
                        {workflow.isActive ? "STS:ACTIVE" : "STS:DRAFT"}
                      </span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-[var(--arch-fg)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 border border-[var(--arch-border)] flex items-center justify-center mx-auto mb-4 bg-[var(--arch-bg)]">
              <Workflow className="h-8 w-8 text-[var(--arch-muted)]" />
            </div>
            <p className="text-[var(--arch-muted)] font-mono text-xs mb-4">NO_DATA_FOUND</p>
            <Button size="sm" asChild className="rounded-none bg-[var(--arch-fg)] text-[var(--arch-bg)] hover:bg-[var(--arch-muted)] text-xs font-mono uppercase">
              <Link href="/workflows">INIT_WORKFLOW</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
