
import Link from "next/link";

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen w-full bg-(--arch-bg) text-(--arch-fg) font-mono p-8 md:p-12 overflow-y-auto selection:bg-(--arch-accent) selection:text-(--arch-bg)">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <header className="border-b border-(--arch-border) pb-8 space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold uppercase tracking-tight text-(--arch-fg)">
              USER_AGREEMENT: <span className="text-(--arch-muted)">TERMS</span>
            </h1>
            <div className="text-right text-xs text-(--arch-muted) space-y-1">
              <p>DOC_ID: TOU-2024-V2</p>
              <p>STATUS: BINDING</p>
            </div>
          </div>
          <p className="text-sm text-(--arch-muted) max-w-xl">
            // CONDITIONS FOR SYSTEM ACCESS AND USAGE.
          // FAILURE TO COMPLY WILL RESULT IN IMMEDIATE TERMINATION.
          </p>
        </header>

        {/* Content */}
        <main className="space-y-10 text-sm leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--arch-accent) flex items-center gap-2">
              <span className="w-2 h-2 bg-(--arch-accent)"></span>
              SEC_01: ACCESS_RIGHTS
            </h2>
            <div className="pl-4 border-l border-(--arch-border) space-y-4 text-(--arch-fg) opacity-90">
              <p>
                ACCESS TO THE FLOWFORGE INFRASTRUCTURE IS A PRIVILEGE, NOT A RIGHT. ADMINISTRATION RESERVES THE RIGHT TO REVOKE ACCESS KEYS AT ANY MOMENT WITHOUT PRIOR WARNING.
              </p>
              <p>
                YOU AGREE NOT TO ATTEMPT TO BYPASS SECURITY PROTOCOLS, REVERSE ENGINEER CORE SYSTEMS, OR INJECT MALICIOUS CODE INTO THE WORKFLOW ENGINE.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--arch-accent) flex items-center gap-2">
              <span className="w-2 h-2 bg-(--arch-accent)"></span>
              SEC_02: USER_RESPONSIBILITY
            </h2>
            <div className="pl-4 border-l border-(--arch-border) space-y-4 text-(--arch-fg) opacity-90">
              <p>
                OPERATORS ARE SOLELY RESPONSIBLE FOR THE INTEGRITY OF THEIR CREDENTIALS. ANY ACTION PERFORMED UNDER YOUR IDENTIFIER WILL BE ATTRIBUTED TO YOU.
              </p>
              <p>
                DO NOT SHARE ACCESS KEYS. SECURITY BREACHES MUST BE REPORTED IMMEDIATELY VIA THE EMERGENCY CHANNEL.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--arch-accent) flex items-center gap-2">
              <span className="w-2 h-2 bg-(--arch-accent)"></span>
              SEC_03: LIABILITY
            </h2>
            <div className="pl-4 border-l border-(--arch-border) space-y-4 text-(--arch-fg) opacity-90">
              <p>
                THE SYSTEM IS PROVIDED "AS IS". WE ARE NOT LIABLE FOR DATA LOSS, WORKFLOW INTERRUPTIONS, OR UNFORESEEN CASCADING FAILURES RESULTING FROM USER CONFIGURATIONS.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-widest text-(--arch-accent) flex items-center gap-2">
              <span className="w-2 h-2 bg-(--arch-accent)"></span>
              SEC_04: MODIFICATIONS
            </h2>
            <div className="pl-4 border-l border-(--arch-border) space-y-4 text-(--arch-fg) opacity-90">
              <p>
                TERMS MAY BE UPDATED VIA OVER-THE-AIR PATCHES. CONTINUED USAGE OF THE SYSTEM IMPLIES ACCEPTANCE OF THE NEW PROTOCOLS.
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
            <span className="group-hover:-translate-x-1 transition-transform">{"<-"}</span>
            ACKNOWLEDGE_&_RETURN
          </Link>
          <div className="text-xs text-(--arch-muted)">
            FIRMWARE: V2.0.4
          </div>
        </footer>
      </div>
    </div>
  );
}
