import Link from "next/link";

export default function PrivacyProtocolPage() {
  return (
    <div className="min-h-screen w-full bg-(--arch-bg) text-(--arch-fg) font-mono p-8 md:p-12 overflow-y-auto selection:bg-(--arch-accent) selection:text-(--arch-bg)">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <header className="border-b border-(--arch-border) pb-8 space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold uppercase tracking-tight text-(--arch-fg)">
              SYS.PROTOCOL: <span className="text-(--arch-muted)">PRIVACY</span>
            </h1>
            <div className="text-right text-xs text-(--arch-muted) space-y-1">
              <p>DOC_ID: PP-2024-X</p>
              <p>CLASS: PUBLIC</p>
            </div>
          </div>
          <p className="text-sm text-(--arch-muted) max-w-xl">
            // PROTOCOL FOR DATA COLLECTION, USAGE, AND RETENTION. // EXECUTE
            COMPLIANCE CHECKS.
          </p>
        </header>

        {/* Content */}
        <main className="space-y-10 text-sm leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--arch-accent) flex items-center gap-2">
              <span className="w-2 h-2 bg-(--arch-accent)"></span>
              01_DATA_INGESTION
            </h2>
            <div className="pl-4 border-l border-(--arch-border) space-y-4 text-(--arch-fg) opacity-90">
              <p>
                SYSTEM AUTOMATICALLY LOGS TELEMETRY DATA INCLUDING BUT NOT
                LIMITED TO: IP ADDRESSES, BROWSER FINGERPRINTS, AND INTERACTION
                TIMESTAMPS.
              </p>
              <p>
                OPERATOR IDENTIFICATION DATA (NAME, EMAIL) IS ENCRYPTED AT REST.
                NO UNAUTHORIZED PERSONNEL MAY ACCESS OPERATOR RECORDS.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--arch-accent) flex items-center gap-2">
              <span className="w-2 h-2 bg-(--arch-accent)"></span>
              02_USAGE_PARAMETERS
            </h2>
            <div className="pl-4 border-l border-(--arch-border) space-y-4 text-(--arch-fg) opacity-90">
              <p>
                COLLECTED DATA IS UTILIZED SOLELY FOR SYSTEM OPTIMIZATION,
                SECURITY AUDITING, AND AUTHENTICATION VERIFICATION.
              </p>
              <p>
                WE DO NOT TRANSMIT DATA TO OFF-WORLD ENTITIES OR UNAFFILIATED
                THIRD PARTIES WITHOUT EXPLICIT ADMINISTRATIVE OVERRIDE.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--arch-accent) flex items-center gap-2">
              <span className="w-2 h-2 bg-(--arch-accent)"></span>
              03_DATA_PURGE
            </h2>
            <div className="pl-4 border-l border-(--arch-border) space-y-4 text-(--arch-fg) opacity-90">
              <p>
                OPERATORS MAY REQUEST A COMPLETE DATA PURGE VIA THE SETTINGS
                CONSOLE. UPON EXECUTION, ALL ASSOCIATED RECORDS ARE PERMANENTLY
                ERASED FROM THE MAINFRAME.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--arch-accent) flex items-center gap-2">
              <span className="w-2 h-2 bg-(--arch-accent)"></span>
              04_COOKIE_PROTOCOL
            </h2>
            <div className="pl-4 border-l border-(--arch-border) space-y-4 text-(--arch-fg) opacity-90">
              <p>
                SESSION TOKENS (COOKIES) ARE DEPLOYED FOR STATE MANAGEMENT.
                DISABLING COOKIES MAY RESULT IN CRITICAL SYSTEM FAILURE OR
                LOCKOUT.
              </p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="pt-12 border-t border-(--arch-border) flex justify-between items-center">
          <Link
            href="/register"
            className="text-xs font-bold uppercase tracking-widest hover:text-(--arch-accent) transition-colors flex items-center gap-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              {"<-"}
            </span>
            RETURN_TO_BASE
          </Link>
          <div className="text-xs text-(--arch-muted)">END_OF_FILE</div>
        </footer>
      </div>
    </div>
  );
}
