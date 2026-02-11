import { Svg, G, Rect, Text as SvgText, Line } from "@react-pdf/renderer";

/**
 * Cost Breakdown Chart — Stacked horizontal bar showing Development vs Infrastructure costs
 * Used in Section 4.3 Economic Feasibility
 */
export default function CostBreakdownChart() {
  const width = 495;
  const height = 290;
  const chartLeft = 120;
  const chartRight = width - 80;
  const chartWidth = chartRight - chartLeft;
  const barHeight = 22;
  const barGap = 14;
  const chartTop = 40;

  const categories = [
    {
      label: "Development Labor",
      value: 150000,
      color: "#3b82f6",
      note: "(imputed)",
    },
    {
      label: "Hardware (Laptop)",
      value: 45000,
      color: "#8b5cf6",
      note: "(amortized)",
    },
    {
      label: "Cloud & Hosting",
      value: 10000,
      color: "#06b6d4",
      note: "/year",
    },
    {
      label: "Internet & Utilities",
      value: 15000,
      color: "#f59e0b",
      note: "/year",
    },
    {
      label: "Domain & Services",
      value: 5000,
      color: "#14b8a6",
      note: "",
    },
    {
      label: "Misc & Contingency",
      value: 10000,
      color: "#a855f7",
      note: "",
    },
    {
      label: "Dev & Design Tools",
      value: 0,
      color: "#10b981",
      note: "(free/OSS)",
    },
  ];

  const maxValue = 150000;
  const scale = (v: number) => (v / maxValue) * chartWidth;

  const gridLines = [0, 60000, 120000, 180000, 240000];

  const barsEndY = chartTop + categories.length * (barHeight + barGap) - barGap;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={width / 2}
        y={16}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Project Cost Breakdown (INR)
      </SvgText>

      {/* Grid lines */}
      {gridLines.map((v, i) => (
        <G key={`grid-${i}`}>
          <Line
            x1={chartLeft + scale(v)}
            y1={chartTop - 5}
            x2={chartLeft + scale(v)}
            y2={barsEndY + 5}
            stroke="#e5e7eb"
            strokeWidth={0.8}
            strokeDasharray="3,3"
          />
          <SvgText
            x={chartLeft + scale(v)}
            y={chartTop - 8}
            textAnchor="middle"
            style={{ fontSize: 7, fill: "#555555" }}
          >
            {v === 0 ? "0" : `${(v / 1000).toFixed(0)}K`}
          </SvgText>
        </G>
      ))}

      {/* Bars */}
      {categories.map((cat, i) => {
        const y = chartTop + i * (barHeight + barGap);
        const barW = Math.max(scale(cat.value), 0);
        return (
          <G key={`bar-${i}`}>
            {/* Label */}
            <SvgText
              x={chartLeft - 6}
              y={y + barHeight / 2 + 3}
              textAnchor="end"
              style={{ fontSize: 7, fontFamily: "Times-Roman", fill: "#333" }}
            >
              {cat.label}
            </SvgText>

            {/* Background track */}
            <Rect
              x={chartLeft}
              y={y}
              width={chartWidth}
              height={barHeight}
              rx={3}
              fill="#f3f4f6"
            />

            {/* Bar */}
            {barW > 0 && (
              <Rect
                x={chartLeft}
                y={y}
                width={barW}
                height={barHeight}
                rx={3}
                fill={cat.color}
                opacity={0.85}
              />
            )}

            {/* Value label */}
            <SvgText
              x={chartLeft + Math.max(barW, 0) + 4}
              y={y + barHeight / 2 + 3}
              style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#555" }}
            >
              {cat.value === 0
                ? `INR 0 ${cat.note}`
                : `INR ${(cat.value / 1000).toFixed(1)}K ${cat.note}`}
            </SvgText>
          </G>
        );
      })}

      {/* Total line */}
      <Line
        x1={chartLeft}
        y1={barsEndY + 18}
        x2={chartRight}
        y2={barsEndY + 18}
        stroke="#333"
        strokeWidth={0.8}
      />
      <SvgText
        x={chartLeft}
        y={barsEndY + 30}
        style={{ fontSize: 8, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Total Project Cost: INR 2,35,000 (incl. labor, hardware, deployment)
      </SvgText>
    </Svg>
  );
}
