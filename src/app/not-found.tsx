
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-(--arch-bg) text-(--arch-fg) font-mono overflow-hidden relative">

      {/* Background Grid */}
      <div className="absolute inset-0 z-0 bg-grid opacity-[0.2]" />
      <div className="absolute inset-0 z-0 bg-linear-to-b from-(--arch-bg)/0 via-(--arch-bg)/0 to-(--arch-bg)/90" />

      {/* Content */}
      <div className="z-10 text-center space-y-8 p-8 border border-(--arch-border) bg-(--arch-bg-secondary)/80 backdrop-blur-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-lg w-full relative">

        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-(--arch-fg) opacity-50" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-(--arch-fg) opacity-50" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-(--arch-fg) opacity-50" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-(--arch-fg) opacity-50" />

        <div className="space-y-4">
          <div className="relative inline-block">
            <h1 className={`text-9xl font-bold tracking-tighter ${glitch ? 'translate-x-1 opacity-80' : ''} transition-all duration-75`}>
              404
            </h1>
            {glitch && (
              <div className="absolute top-0 left-0 text-9xl font-bold tracking-tighter text-(--arch-accent) opacity-50 -translate-x-2">
                404
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-xl uppercase tracking-widest text-(--arch-accent)">
              ERR_PATH_NOT_FOUND
            </h2>
            <p className="text-sm text-(--arch-muted)">
              // THE REQUESTED RESOURCE COULD NOT BE LOCATED.<br />
              // PLEASE VERIFY SECTOR COORDINATES.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-(--arch-border) border-dashed">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-10 px-8 text-xs uppercase tracking-widest bg-(--arch-fg) text-(--arch-bg) hover:bg-(--arch-muted) hover:text-white transition-all font-bold"
          >
            RETURN_TO_DASHBOARD
          </Link>
        </div>

        <div className="absolute bottom-2 right-4 text-[10px] text-(--arch-muted) opacity-50">
          SYS.ERR: 0x404
        </div>
      </div>
    </div>
  );
}
