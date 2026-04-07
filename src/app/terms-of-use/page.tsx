import { ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";

export default function TermsOfUsePage() {
  return (
    <div className="min-h-dvh w-full bg-background text-foreground overflow-y-auto selection:bg-primary selection:text-primary-foreground">
      {/* Minimal page header */}
      <header className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-7 w-7 rounded-lg bg-foreground flex items-center justify-center transition-transform group-hover:scale-105">
              <Zap className="h-3.5 w-3.5 text-background fill-current" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Flowgent
            </span>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        {/* Page title */}
        <div className="space-y-3 border-b border-border/50 pb-10">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">
            Legal
          </p>
          <h1 className="text-4xl font-bold tracking-tighter text-foreground">
            Terms of Use
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
            By accessing or using Flowgent, you agree to the conditions outlined
            below. Please read them carefully before proceeding.
          </p>
          <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground font-medium">
            <span>Version 2.0</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Effective January 2024</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-10 text-sm leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-secondary border border-border/50 text-xs font-bold text-muted-foreground">
                1
              </span>
              Access Rights
            </h2>
            <div className="pl-9 space-y-4 text-muted-foreground">
              <p>
                Access to Flowgent's infrastructure is governed by your
                subscription plan and account status. We reserve the right to
                suspend or terminate access for violations of these terms at our
                discretion.
              </p>
              <p>
                You agree not to attempt to bypass security measures, reverse
                engineer core systems, or inject unauthorized code or payloads
                into the workflow engine.
              </p>
            </div>
          </section>

          <div className="border-t border-border/40" />

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-secondary border border-border/50 text-xs font-bold text-muted-foreground">
                2
              </span>
              User Responsibility
            </h2>
            <div className="pl-9 space-y-4 text-muted-foreground">
              <p>
                You are solely responsible for the integrity and security of
                your credentials. Any action performed under your account will
                be attributed to you.
              </p>
              <p>
                Do not share your access tokens or API keys. Security incidents
                must be reported promptly via our support channel.
              </p>
            </div>
          </section>

          <div className="border-t border-border/40" />

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-secondary border border-border/50 text-xs font-bold text-muted-foreground">
                3
              </span>
              Limitation of Liability
            </h2>
            <div className="pl-9 space-y-4 text-muted-foreground">
              <p>
                Flowgent is provided "as is" without warranty of any kind. We
                are not liable for data loss, workflow interruptions, or
                failures resulting from user configurations, third-party API
                changes, or infrastructure events outside our control.
              </p>
            </div>
          </section>

          <div className="border-t border-border/40" />

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-secondary border border-border/50 text-xs font-bold text-muted-foreground">
                4
              </span>
              Modifications to Terms
            </h2>
            <div className="pl-9 space-y-4 text-muted-foreground">
              <p>
                These terms may be updated from time to time. We will notify
                users of significant changes via email or in-product
                notification. Continued use of the platform after updates
                constitutes acceptance of the revised terms.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-10 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Flowgent. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link
              href="/privacy-protocol"
              className="hover:text-foreground transition-colors font-medium"
            >
              Privacy Policy
            </Link>
            <Link
              href="/login"
              className="hover:text-foreground transition-colors font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
