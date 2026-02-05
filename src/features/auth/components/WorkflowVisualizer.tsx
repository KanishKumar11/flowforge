"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const WorkflowVisualizer = ({ className }: { className?: string }) => {
  const [ticks, setTicks] = useState(0);

  // Digital clock tick for the schematic
  useEffect(() => {
    const interval = setInterval(() => {
      setTicks((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("relative w-full h-full flex items-center justify-center pointer-events-none", className)}>
      {/* SVG Layer */}
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full"
      >
        <defs>
          <pattern id="small-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--arch-grid)" strokeWidth="0.5" />
          </pattern>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="var(--arch-muted)" />
          </marker>
        </defs>

        {/* Background Grid for Blueprint feel */}
        <rect width="100%" height="100%" fill="url(#small-grid)" opacity="0.4" />

        {/* --- Schematic Lines (Rectilinear / Manhattan) --- */}

        {/* Main Trunk: Left to Center (Shifted DOWN to Y=450 to avoid text) */}
        <path
          d="M100,450 L300,450"
          stroke="var(--arch-fg)"
          strokeWidth="2"
          fill="none"
        />

        {/* Branch 1: Center to Top-ish */}
        <path
          d="M300,450 L300,350 L500,350"
          stroke="var(--arch-fg)"
          strokeWidth="2"
          fill="none"
        />

        {/* Branch 2: Center to Bottom */}
        <path
          d="M300,450 L300,550 L500,550"
          stroke="var(--arch-fg)"
          strokeWidth="2"
          fill="none"
        />

        {/* --- Active Data Flow (Square Packets) --- */}
        <rect width="6" height="6" fill="var(--arch-accent)" className="opacity-100">
          <animateMotion
            dur="5s"
            repeatCount="indefinite"
            path="M300,450 L300,350 L500,350"
            calcMode="discrete"
            keyPoints="0;0.5;1"
            keyTimes="0;0.5;1"
          />
        </rect>

        <rect width="6" height="6" fill="var(--arch-accent)" className="opacity-100">
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            path="M300,450 L300,550 L500,550"
            calcMode="linear"
          />
        </rect>

        {/* --- Technical Nodes (Square/Diamond) --- */}

        {/* Source Node */}
        <g transform="translate(100, 450)">
          <rect x="-10" y="-10" width="20" height="20" fill="var(--arch-bg-secondary)" stroke="var(--arch-fg)" strokeWidth="2" />
          <text x="-15" y="-20" fill="var(--arch-fg)" fontSize="10" fontFamily="monospace">IN_01</text>
        </g>

        {/* Router Node */}
        <g transform="translate(300, 450)">
          <circle r="15" fill="var(--arch-bg-secondary)" stroke="var(--arch-fg)" strokeWidth="2" />
          <circle r="2" fill="var(--arch-accent)" className="animate-pulse" />
          <text x="20" y="-10" fill="var(--arch-fg)" fontSize="10" fontFamily="monospace">ROUTER_X</text>
        </g>

        {/* End Node 1 */}
        <g transform="translate(500, 350)">
          <rect x="-15" y="-15" width="30" height="30" fill="var(--arch-bg-secondary)" stroke="var(--arch-fg)" strokeWidth="2" />
          <path d="M-5 -5 L5 5 M-5 5 L5 -5" stroke="var(--arch-fg)" strokeWidth="2" />
          <text x="20" y="5" fill="var(--arch-fg)" fontSize="10" fontFamily="monospace">PROC_A</text>
        </g>

        {/* End Node 2 */}
        <g transform="translate(500, 550)">
          <rect x="-15" y="-15" width="30" height="30" fill="var(--arch-bg-secondary)" stroke="var(--arch-fg)" strokeWidth="2" />
          <circle r="5" fill="var(--arch-fg)" />
          <text x="20" y="5" fill="var(--arch-fg)" fontSize="10" fontFamily="monospace">PROC_B</text>
        </g>

      </svg>

      {/* Floating DOM Overlay */}
      <div className="absolute top-8 right-8 text-right font-mono text-[10px] text-[var(--arch-muted)] tracking-widest opacity-70">
        <div>SYS.TIME: {ticks}</div>
        <div>MODE: ARCHITECT</div>
        <div>STATUS: NOMINAL</div>
      </div>
    </div>
  );
};
