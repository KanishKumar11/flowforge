"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Sparkles, Check } from "lucide-react";
import { PLANS } from "@/lib/plans";

interface UpgradePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  limitType?: "workflows" | "executionsPerMonth" | "teamMembers";
}

const LIMIT_LABELS: Record<string, string> = {
  workflows: "workflows",
  executionsPerMonth: "executions per month",
  teamMembers: "team members",
};

export function UpgradePlanDialog({
  open,
  onOpenChange,
  limitType = "workflows",
}: UpgradePlanDialogProps) {
  const freeLimit = PLANS.FREE.limits[limitType];
  const proLimit = PLANS.PRO.limits[limitType];
  const label = LIMIT_LABELS[limitType];

  const handleUpgrade = () => {
    authClient.checkout({ slug: "pro" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">Upgrade to Pro</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-1">
            You&apos;ve reached the{" "}
            <span className="font-semibold text-foreground">
              {freeLimit} {label}
            </span>{" "}
            limit on the Free plan. Upgrade to Pro to unlock more.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            What you get with Pro
          </p>
          <ul className="space-y-2">
            {[
              `Up to ${PLANS.PRO.limits.workflows} workflows`,
              `${PLANS.PRO.limits.executionsPerMonth.toLocaleString()} executions per month`,
              `Up to ${PLANS.PRO.limits.teamMembers} team members`,
              "API access",
              "Priority support",
              "Custom retention",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe later
          </Button>
          <Button onClick={handleUpgrade} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Upgrade to Pro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
