"use client";

import Link from "next/link";

import { Quote, Palette } from "lucide-react";
import { WorkflowVisualizer } from "./WorkflowVisualizer";

import { cn } from "@/lib/utils";

type Theme = "obsidian" | "midnight" | "terminal" | "crimson";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-(--arch-bg) font-sans selection:bg-primary/30 text-(--arch-fg) transition-colors duration-500"
      data-theme="terminal"
    >
      {/* --- LAYER 0: The Grid --- */}
      <div className="absolute inset-0 z-0 bg-grid opacity-[0.2]" />
      <div className="absolute inset-0 z-0 bg-linear-to-b from-(--arch-bg)/0 via-(--arch-bg)/0 to-(--arch-bg)/90" />
      {/* Vignette at bottom to fade grid */}

      {/* --- LAYER 1: The Schematic --- */}
      <div className="absolute inset-0 z-[1] w-[60%] border-r border-(--arch-border) transition-colors duration-500 pointer-events-none">
        <WorkflowVisualizer />
        {/* Decorative Data Lines */}
        <div className="absolute bottom-32 left-12 w-32 h-[1px] bg-(--arch-border)" />
        <div className="absolute bottom-32 left-12 w-[1px] h-8 bg-(--arch-border)" />
        <div className="absolute bottom-28 left-16 font-mono text-[10px] text-(--arch-muted) tracking-widest opacity-50">
          FIG. 01 — SYSTEM OVERVIEW
        </div>
      </div>

      {/* --- LAYER 2: The Interface --- */}
      <div className="relative z-10 h-screen w-full flex">
        {/* Left Side: Brand (Ghosted) */}
        <div className="hidden lg:flex w-[60%] flex-col justify-between p-8 pointer-events-none">
          <header>
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 border border-(--arch-border) flex items-center justify-center bg-(--arch-bg) transition-colors duration-500">
                <div className="h-2 w-2 bg-(--arch-accent) transition-colors duration-500" />
              </div>
              <span className="font-mono text-sm tracking-[0.2em] text-(--arch-muted)">
                FLOWFORGE
              </span>
            </div>
          </header>

          <div className="max-w-xl pl-2">
            <h1 className="text-6xl font-heading font-medium tracking-tighter leading-none mb-6 text-(--arch-fg) mix-blend-difference transition-colors duration-500">
              BUILD <br />
              WITHOUT <br />
              LIMITS.
            </h1>
            <p className="font-mono text-xs text-(--arch-muted) max-w-sm border-l border-(--arch-border) pl-4 py-1 transition-colors duration-500">
              PRECISION TOOLS FOR WORKFLOW ORCHESTRATION. <br />
              VERSION 2.0.4 [STABLE]
            </p>
          </div>

          <footer className="font-mono text-[10px] text-(--arch-muted)">
            COORD: 34.0522° N, 118.2437° W
          </footer>
        </div>

        {/* Right Side: Control Panel (The Form) */}
        <div className="w-full lg:w-[40%] bg-(--arch-bg-secondary)/90 backdrop-blur-sm border-l border-(--arch-border) flex flex-col items-center justify-center p-8 relative transition-colors duration-500">
          {/* Tech Decoration */}
          <div className="absolute top-0 right-0 p-4">
            <div className="w-4 h-4 border-t border-r border-(--arch-border) transition-colors duration-500" />
          </div>
          <div className="absolute bottom-0 right-0 p-4">
            <div className="w-4 h-4 border-b border-r border-(--arch-border) transition-colors duration-500" />
          </div>

          <div className="w-full max-w-[400px]">{children}</div>

          {/* Footer Links (Technical) */}
          <div className="absolute bottom-8 w-full text-center">
            <div className="flex justify-center gap-6 font-mono text-[10px] text-(--arch-muted) uppercase tracking-widest">
              <Link
                href="/privacy-protocol"
                className="hover:text-(--arch-fg) cursor-pointer transition-colors"
              >
                Privacy_Protocol
              </Link>
              <Link
                href="/terms-of-use"
                className="hover:text-(--arch-fg) cursor-pointer transition-colors"
              >
                Terms_Of_Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
