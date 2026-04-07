import { ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";

export default function PrivacyProtocolPage() {
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
            Privacy Policy
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
            Your privacy matters. This policy explains how Flowgent collects,
            uses, and protects your data when you use our platform.
          </p>
          <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground font-medium">
            <span>Version X</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Classification: Public</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-10 text-sm leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-secondary border border-border/50 text-xs font-bold text-muted-foreground">
                1
              </span>
              Data Collection
            </h2>
            <div className="pl-9 space-y-4 text-muted-foreground">
              <p>
                Flowgent automatically collects operational data including IP
                addresses, browser information, and interaction timestamps to
                provide and improve the service.
              </p>
              <p>
                Account data (name, email address) is encrypted at rest. Only
                authorized personnel with a legitimate operational need may
                access personal records.
              </p>
            </div>
          </section>

          <div className="border-t border-border/40" />

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-secondary border border-border/50 text-xs font-bold text-muted-foreground">
                2
              </span>
              How We Use Your Data
            </h2>
            <div className="pl-9 space-y-4 text-muted-foreground">
              <p>
                Collected data is used exclusively for platform operation,
                security auditing, performance monitoring, and authentication.
                We do not sell personal data to third parties.
              </p>
              <p>
                We do not transmit data to unaffiliated third parties without
                your explicit consent, except where required by law.
              </p>
            </div>
          </section>

          <div className="border-t border-border/40" />

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-secondary border border-border/50 text-xs font-bold text-muted-foreground">
                3
              </span>
              Data Deletion
            </h2>
            <div className="pl-9 space-y-4 text-muted-foreground">
              <p>
                You may request a complete deletion of your account and
                associated data at any time via the Settings page. Upon
                confirmation, all records are permanently purged from our
                systems within 30 days.
              </p>
            </div>
          </section>

          <div className="border-t border-border/40" />

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-secondary border border-border/50 text-xs font-bold text-muted-foreground">
                4
              </span>
              Cookies &amp; Session Data
            </h2>
            <div className="pl-9 space-y-4 text-muted-foreground">
              <p>
                Flowgent uses session tokens (cookies) for secure state
                management and authentication. Disabling cookies will prevent
                you from signing in or maintaining an active session.
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
              href="/terms-of-use"
              className="hover:text-foreground transition-colors font-medium"
            >
              Terms of Use
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
