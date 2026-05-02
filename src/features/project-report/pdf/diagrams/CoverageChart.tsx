"use client";

/**
 * Coverage Chart — SVG horizontal bar chart of overall + top files coverage.
 * Reads from /coverage/coverage-final.json (runtime fetch) or initialData prop.
 * For Chapter 9 (Testing).
 */

import { useEffect, useState } from "react";
import {
  Svg,
  G,
  Rect,
  Text as SvgText,
  Line,
  Circle,
} from "@react-pdf/renderer";

function useCoverage() {
  const [data, setData] = useState<Record<string, any> | null | undefined>(
    undefined,
  );
  useEffect(() => {
    let mounted = true;
    fetch("/coverage/coverage-final.json")
      .then((r) => (r.ok ? r.json() : Promise.reject("not found")))
      .then((j) => mounted && setData(j))
      .catch(() => mounted && setData(null));
    return () => {
      mounted = false;
    };
  }, []);
  return data;
}

const colors = {
  text: "#1a1a1a",
  label: "#333333",
  muted: "#475569",
  grid: "#E0E0E0",
  high: "#16a34a", // ≥80%
  med: "#d97706", // 60–80%
  low: "#dc2626", // <60%
  highBg: "#dcfce7",
  medBg: "#fef3c7",
  lowBg: "#fee2e2",
  border: "#cbd5e1",
};

function bandFor(pct: number) {
  if (pct >= 80) return { fg: colors.high, bg: colors.highBg };
  if (pct >= 60) return { fg: colors.med, bg: colors.medBg };
  return { fg: colors.low, bg: colors.lowBg };
}

export default function CoverageChart({
  initialData,
}: { initialData?: any } = {}) {
  const remoteData = useCoverage();
  const coverage = initialData !== undefined ? initialData : remoteData;

  const width = 495;
  const height = 320;

  // Loading / empty state — still render an SVG to stay visually consistent
  if (coverage === undefined || !coverage || Object.keys(coverage).length === 0) {
    const message =
      coverage === undefined
        ? "Loading coverage data..."
        : "Coverage data not available — run tests and copy coverage-final.json to /public/coverage/";
    return (
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="#f8fafc"
          stroke={colors.border}
          strokeWidth={0.8}
        />
        <SvgText
          x={width / 2}
          y={height / 2 - 6}
          textAnchor="middle"
          style={{ fontSize: 11, fontFamily: "Times-Bold", fill: colors.text }}
        >
          Test Coverage
        </SvgText>
        <SvgText
          x={width / 2}
          y={height / 2 + 12}
          textAnchor="middle"
          style={{ fontSize: 8, fontFamily: "Times-Italic", fill: colors.muted }}
        >
          {message}
        </SvgText>
      </Svg>
    );
  }

  // Compute summary
  let totalStatements = 0;
  let coveredStatements = 0;

  const fileEntries = Object.entries(coverage);
  const filesSummary = fileEntries.map(([file, data]: any) => {
    const s = data.s || {};
    const total = Object.keys(s).length;
    const covered = Object.values(s as Record<string, number>).filter(
      (v) => (v as number) > 0,
    ).length;
    totalStatements += total;
    coveredStatements += covered;
    const pct = total === 0 ? 100 : Math.round((covered / total) * 100);
    return { file, total, covered, pct };
  });

  const overallPct =
    totalStatements === 0
      ? 100
      : Math.round((coveredStatements / totalStatements) * 100);

  // Top 5 lowest-coverage files
  const topFiles = filesSummary
    .filter((f) => f.total > 0)
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 5)
    .map((f) => ({
      ...f,
      label: f.file
        .replace(/\\/g, "/")
        .replace(/^.*src\//, "src/")
        .replace(/^src\//, "")
        .slice(-44),
    }));

  // Geometry
  const chartLeft = 200;
  const chartRight = width - 60;
  const chartTop = 110;
  const chartW = chartRight - chartLeft;
  const barH = 22;
  const barGap = 10;
  const gridSteps = [0, 25, 50, 75, 100];

  const overallBand = bandFor(overallPct);

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={width / 2}
        y={18}
        textAnchor="middle"
        style={{ fontSize: 11, fontFamily: "Times-Bold", fill: colors.text }}
      >
        Test Coverage — Overall Summary
      </SvgText>
      <SvgText
        x={width / 2}
        y={32}
        textAnchor="middle"
        style={{ fontSize: 8, fontFamily: "Times-Italic", fill: colors.muted }}
      >
        Statement coverage across {fileEntries.length} source files
      </SvgText>

      {/* ── Overall summary card ── */}
      <Rect
        x={30}
        y={46}
        width={width - 60}
        height={48}
        fill="#f8fafc"
        stroke={colors.border}
        strokeWidth={0.8}
        rx={3}
      />

      {/* Big % */}
      <SvgText
        x={70}
        y={80}
        textAnchor="middle"
        style={{ fontSize: 22, fontFamily: "Times-Bold", fill: overallBand.fg }}
      >
        {overallPct}%
      </SvgText>
      <SvgText
        x={70}
        y={90}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.muted }}
      >
        OVERALL
      </SvgText>

      {/* Overall progress bar */}
      <Rect
        x={120}
        y={64}
        width={width - 60 - 110}
        height={14}
        fill="#ffffff"
        stroke={colors.border}
        strokeWidth={0.6}
        rx={2}
      />
      <Rect
        x={120}
        y={64}
        width={((width - 60 - 110) * overallPct) / 100}
        height={14}
        fill={overallBand.fg}
        rx={2}
      />
      <SvgText
        x={125}
        y={88}
        style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.muted }}
      >
        {coveredStatements} / {totalStatements} statements covered
      </SvgText>

      {/* ── Top files chart ── */}
      <SvgText
        x={30}
        y={chartTop - 14}
        style={{ fontSize: 9, fontFamily: "Times-Bold", fill: colors.label }}
      >
        Files with lowest coverage
      </SvgText>

      {/* Grid lines */}
      {gridSteps.map((val, i) => {
        const x = chartLeft + (val / 100) * chartW;
        return (
          <G key={`grid-${i}`}>
            <Line
              x1={x}
              y1={chartTop - 2}
              x2={x}
              y2={chartTop + topFiles.length * (barH + barGap)}
              stroke={colors.grid}
              strokeWidth={0.6}
            />
            <SvgText
              x={x}
              y={chartTop - 6}
              textAnchor="middle"
              style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.muted }}
            >
              {val}%
            </SvgText>
          </G>
        );
      })}

      {/* Bars */}
      {topFiles.map((f, i) => {
        const y = chartTop + i * (barH + barGap);
        const band = bandFor(f.pct);
        const barW = (chartW * f.pct) / 100;
        return (
          <G key={`bar-${i}`}>
            {/* Filename label */}
            <SvgText
              x={chartLeft - 6}
              y={y + barH / 2 + 3}
              textAnchor="end"
              style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
            >
              {f.label}
            </SvgText>
            {/* Track */}
            <Rect
              x={chartLeft}
              y={y}
              width={chartW}
              height={barH}
              fill="#ffffff"
              stroke={colors.border}
              strokeWidth={0.5}
              rx={2}
            />
            {/* Fill */}
            <Rect
              x={chartLeft}
              y={y}
              width={Math.max(barW, 1)}
              height={barH}
              fill={band.fg}
              rx={2}
            />
            {/* Percentage on bar */}
            <SvgText
              x={chartLeft + barW + 6}
              y={y + barH / 2 + 3}
              style={{ fontSize: 8, fontFamily: "Times-Bold", fill: band.fg }}
            >
              {f.pct}%
            </SvgText>
          </G>
        );
      })}

      {/* Legend */}
      <G>
        {[
          { label: "≥80% (high)", color: colors.high, x: 80 },
          { label: "60–80% (medium)", color: colors.med, x: 200 },
          { label: "<60% (low)", color: colors.low, x: 340 },
        ].map((item, i) => (
          <G key={`legend-${i}`}>
            <Circle cx={item.x} cy={height - 18} r={4} fill={item.color} />
            <SvgText
              x={item.x + 8}
              y={height - 15}
              style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.muted }}
            >
              {item.label}
            </SvgText>
          </G>
        ))}
      </G>
    </Svg>
  );
}
