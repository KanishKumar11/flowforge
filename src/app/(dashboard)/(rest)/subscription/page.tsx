"use client";

import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useHasActiveSubscription } from "@/features/hooks/useSubscription";
import { Check, Loader2, Diamond, ShieldCheck, Activity, ExternalLink } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const springTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
} as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: springTransition },
};

function GlassContainer({
  children,
  className,
  recommended,
}: {
  children: React.ReactNode;
  className?: string;
  recommended?: boolean;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "relative rounded-[2rem] p-8 md:p-10 z-10 transition-all",
        "bg-background border border-border/50",
        "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]",
        "before:absolute before:inset-0 before:rounded-[2rem] before:border before:border-white/10 before:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] before:pointer-events-none",
        recommended &&
          "border-primary/40 shadow-xl shadow-primary/5 dark:bg-primary/5",
        className,
      )}
    >
      {recommended && (
        <div className="absolute top-0 right-0 p-3 bg-primary text-primary-foreground rounded-bl-2xl rounded-tr-[2rem] text-xs font-mono uppercase tracking-widest font-bold shadow-lg">
          RECOMMENDED
        </div>
      )}
      {children}
    </motion.div>
  );
}

export default function SubscriptionPage() {
  const { hasActiveSubscription, isLoading } = useHasActiveSubscription();
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  const handleUpgrade = () => {
    authClient.checkout({ slug: "pro" });
  };

  const handleManage = async () => {
    setIsPortalLoading(true);
    try {
      const res = await fetch("/api/auth/customer/portal", { method: "POST" });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch {
      // fall through
    } finally {
      setIsPortalLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background selection:bg-foreground selection:text-background">
      <DashboardHeader
        title="Subscription"
        description="Manage your Flowgent subscription"
      />

      <div className="flex-1 px-8 pb-16 overflow-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[1400px] mx-auto space-y-12 pt-8"
        >
          <div className="text-center space-y-4 mb-16">
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-6xl font-medium tracking-tighter text-foreground font-sans"
            >
              Simple, transparent pricing
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground max-w-2xl mx-auto font-sans leading-relaxed"
            >
              Choose the plan that's right for you and start building powerful
              automations today. No complex math, just clean capacity.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
            {/* Free Plan */}
            <GlassContainer className="flex flex-col h-full hover:-translate-y-[2px] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)]">
              <div className="mb-8">
                <h3 className="text-2xl font-bold tracking-tight font-sans text-foreground">
                  Free
                </h3>
                <p className="text-sm tracking-wide text-muted-foreground mt-1">
                  Perfect for hobbyists and side projects
                </p>
              </div>

              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-5xl font-mono tracking-tighter font-semibold text-foreground">
                  $0
                </span>
                <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
                  /mo
                </span>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                <div className="flex items-center gap-4 text-foreground/80">
                  <Activity className="w-5 h-5 text-muted-foreground stroke-[1.5]" />
                  <span className="font-sans">500 executions per month</span>
                </div>
                <div className="flex items-center gap-4 text-foreground/80">
                  <ShieldCheck className="w-5 h-5 text-muted-foreground stroke-[1.5]" />
                  <span className="font-sans">5 active workflows</span>
                </div>
                <div className="flex items-center gap-4 text-foreground/80">
                  <Check className="w-5 h-5 text-muted-foreground stroke-[1.5]" />
                  <span className="font-sans">Basic integrations</span>
                </div>
                <div className="flex items-center gap-4 text-foreground/80">
                  <Check className="w-5 h-5 text-muted-foreground stroke-[1.5]" />
                  <span className="font-sans">Community support</span>
                </div>
                <div className="flex items-center gap-4 text-foreground/80">
                  <Check className="w-5 h-5 text-muted-foreground stroke-[1.5]" />
                  <span className="font-sans">7-day history retention</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 rounded-xl font-mono uppercase tracking-widest text-xs shadow-sm"
                disabled
              >
                {hasActiveSubscription ? "Free Tier" : "Current Plan"}
              </Button>
            </GlassContainer>

            {/* Pro Plan */}
            <GlassContainer
              recommended
              className="flex flex-col h-full hover:-translate-y-[2px] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)]"
            >
              <div className="mb-8">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold tracking-tight font-sans text-primary">
                    Pro
                  </h3>
                  {hasActiveSubscription && !isLoading && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm tracking-wide text-muted-foreground mt-1">
                  For professionals and growing teams
                </p>
              </div>

              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-5xl font-mono tracking-tighter font-semibold text-foreground">
                  $29
                </span>
                <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
                  /mo
                </span>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                <div className="flex items-center gap-4 text-foreground">
                  <div className="p-1 rounded-sm bg-primary/10 text-primary">
                    <Diamond className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className="font-sans font-medium">
                    Unlimited executions
                  </span>
                </div>
                <div className="flex items-center gap-4 text-foreground">
                  <div className="p-1 rounded-sm bg-primary/10 text-primary">
                    <Diamond className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className="font-sans font-medium">
                    Unlimited workflows
                  </span>
                </div>
                <div className="flex items-center gap-4 text-foreground">
                  <div className="p-1 rounded-sm bg-primary/10 text-primary">
                    <Diamond className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className="font-sans font-medium">
                    Premium integrations (Stripe, etc.)
                  </span>
                </div>
                <div className="flex items-center gap-4 text-foreground">
                  <div className="p-1 rounded-sm bg-primary/10 text-primary">
                    <Diamond className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className="font-sans font-medium">
                    Priority email support
                  </span>
                </div>
                <div className="flex items-center gap-4 text-foreground">
                  <div className="p-1 rounded-sm bg-primary/10 text-primary">
                    <Diamond className="w-4 h-4 stroke-[2]" />
                  </div>
                  <span className="font-sans font-medium">
                    30-day history retention
                  </span>
                </div>
              </div>

              {hasActiveSubscription ? (
                <motion.button
                  whileHover={{ scale: 0.98 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleManage}
                  disabled={isPortalLoading}
                  className="w-full h-12 rounded-xl font-mono uppercase tracking-widest text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isPortalLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4" />
                  )}
                  Manage Subscription
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 0.98 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl font-mono uppercase tracking-widest text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Upgrade to Pro
                </motion.button>
              )}
            </GlassContainer>
          </div>

          <motion.div
            variants={itemVariants}
            className="mt-24 pt-16 border-t border-border/40"
          >
            <h3 className="text-2xl font-medium tracking-tight mb-12 text-center">
              Frequently Asked Questions
            </h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <h4 className="font-semibold font-sans mb-3 text-foreground">
                  Can I cancel anytime?
                </h4>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Yes, you can cancel your subscription at any time directly
                  from this dashboard. Your access will continue until the end
                  of your current billing period.
                </p>
              </div>
              <div>
                <h4 className="font-semibold font-sans mb-3 text-foreground">
                  What happens if I hit the limit?
                </h4>
                <p className="text-base text-muted-foreground leading-relaxed">
                  On the free plan, executions will be paused until the next
                  calendar month resets your allocation. You can upgrade to Pro
                  for unlimited access continuously.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
