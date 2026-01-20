"use client";

import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { useHasActiveSubscription } from "@/features/hooks/useSubscription";
import { Check, Sparkles, Zap, Loader2 } from "lucide-react";

export default function SubscriptionPage() {
  const { hasActiveSubscription, isLoading } = useHasActiveSubscription();

  const handleUpgrade = () => {
    authClient.checkout({ slug: "pro" });
  };

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Subscription"
        description="Manage your FlowForge subscription"
      />

      <div className="flex-1 px-8 pb-8 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 sm:text-5xl">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that's right for you and start building powerful automations today.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <Card className="glass border-white/20 dark:border-white/10 shadow-lg backdrop-blur-xl flex flex-col hover-lift transition-all">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Free</CardTitle>
                <CardDescription className="text-base">
                  Perfect for hobbyists and side projects
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                <div className="text-4xl font-bold">
                  $0<span className="text-lg font-normal text-muted-foreground">/mo</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>500 executions per month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>5 active workflows</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Basic integrations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Community support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>7-day history retention</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" disabled={true}>
                  Current Plan
                </Button>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="glass border-primary/50 shadow-2xl shadow-primary/10 relative overflow-hidden flex flex-col hover-lift transition-all">
              <div className="absolute top-0 right-0 p-3 bg-gradient-to-bl from-primary to-purple-600 rounded-bl-2xl text-white text-xs font-bold shadow-lg">
                RECOMMENDED
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 pointer-events-none" />

              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Pro</CardTitle>
                <CardDescription className="text-base">
                  For professionals and growing teams
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-6 relative">
                <div className="text-4xl font-bold">
                  $29<span className="text-lg font-normal text-muted-foreground">/mo</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-primary/20 text-primary">
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-medium">Unlimited executions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-primary/20 text-primary">
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-medium">Unlimited workflows</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-primary/20 text-primary">
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-medium">Premium integrations (Stripe, etc.)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-primary/20 text-primary">
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-medium">Priority email support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-primary/20 text-primary">
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-medium">30-day history retention</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="relative">
                <Button
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25 border-0"
                  onClick={handleUpgrade}
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Upgrade to Pro
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
              <div className="p-6 rounded-2xl glass border border-white/10">
                <h4 className="font-semibold mb-2">Can I cancel anytime?</h4>
                <p className="text-sm text-muted-foreground">Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
              </div>
              <div className="p-6 rounded-2xl glass border border-white/10">
                <h4 className="font-semibold mb-2">What happens if I hit the limit?</h4>
                <p className="text-sm text-muted-foreground">On the free plan, executions will be paused until the next month. You can upgrade to Pro for unlimited access.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}