
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Plus } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <Card className="bg-[var(--arch-bg-secondary)] border-[var(--arch-border)] text-[var(--arch-fg)] shadow-none rounded-none h-full">
      <CardHeader>
        <CardTitle className="text-xl font-heading font-light tracking-tight text-[var(--arch-fg)] uppercase">Quick_Actions</CardTitle>
        <CardDescription className="font-mono text-xs text-[var(--arch-muted)]">INITIATE_TASKS //</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full justify-between h-12 bg-transparent border-[var(--arch-border)] text-[var(--arch-fg)] hover:bg-[var(--arch-fg)] hover:text-[var(--arch-bg)] hover:border-[var(--arch-fg)] transition-all rounded-none group" asChild>
          <Link href="/workflows">
            <span className="flex items-center gap-3 font-mono text-xs uppercase tracking-wide">
              <div className="p-1 border border-[var(--arch-fg)] group-hover:border-[var(--arch-bg)] transition-colors">
                <Plus className="h-3 w-3" />
              </div>
              New_Workflow
            </span>
            <ArrowRight className="h-4 w-4 text-[var(--arch-muted)] group-hover:text-[var(--arch-bg)] group-hover:translate-x-1 transition-all" />
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-between h-12 bg-transparent border-[var(--arch-border)] text-[var(--arch-fg)] hover:bg-[var(--arch-fg)] hover:text-[var(--arch-bg)] hover:border-[var(--arch-fg)] transition-all rounded-none group" asChild>
          <Link href="/credentials">
            <span className="flex items-center gap-3 font-mono text-xs uppercase tracking-wide">
              <div className="p-1 border border-[var(--arch-fg)] group-hover:border-[var(--arch-bg)] transition-colors">
                <Plus className="h-3 w-3" />
              </div>
              Add_Credentials
            </span>
            <ArrowRight className="h-4 w-4 text-[var(--arch-muted)] group-hover:text-[var(--arch-bg)] group-hover:translate-x-1 transition-all" />
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-between h-12 bg-transparent border-[var(--arch-border)] text-[var(--arch-fg)] hover:bg-[var(--arch-fg)] hover:text-[var(--arch-bg)] hover:border-[var(--arch-fg)] transition-all rounded-none group" asChild>
          <Link href="/executions">
            <span className="flex items-center gap-3 font-mono text-xs uppercase tracking-wide">
              <div className="p-1 border border-[var(--arch-fg)] group-hover:border-[var(--arch-bg)] transition-colors">
                <Clock className="h-3 w-3" />
              </div>
              Execution_Log
            </span>
            <ArrowRight className="h-4 w-4 text-[var(--arch-muted)] group-hover:text-[var(--arch-bg)] group-hover:translate-x-1 transition-all" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
