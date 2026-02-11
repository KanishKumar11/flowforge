/**
 * LOC Distribution Chart - Lines of Code by Module
 * Horizontal bar chart showing code distribution across 7 modules
 * For Chapter 5 (Project Estimation & Planning)
 */
import { Svg, G, Rect, Text as SvgText, Line } from "@react-pdf/renderer";

export default function LOCDistributionChart() {
  const width = 495;
  const height = 300;

  const colors = {
    text: "#1a1a1a",
    label: "#333333",
    grid: "#E0E0E0",
    bar: [
      "#1565C0",
      "#1976D2",
      "#1E88E5",
      "#2196F3",
      "#42A5F5",
      "#64B5F6",
      "#90CAF9",
    ],
  };

  const modules = [
    { name: "UI Components & Pages", loc: 4300 },
    { name: "Visual Workflow Editor", loc: 4200 },
    { name: "Node Executors", loc: 2800 },
    { name: "Execution Engine", loc: 2400 },
    { name: "tRPC API Layer", loc: 2100 },
    { name: "Database (Prisma)", loc: 1100 },
    { name: "Authentication", loc: 1100 },
  ];

  const maxLOC = 5000;
  const chartLeft = 160;
  const chartRight = width - 30;
  const chartTop = 45;
  const barH = 26;
  const barGap = 8;
  const chartW = chartRight - chartLeft;

  const gridSteps = [0, 1000, 2000, 3000, 4000, 5000];

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={width / 2}
        y={18}
        textAnchor="middle"
        style={{
          fontSize: 11,
          fontFamily: "Times-Bold",
          fill: colors.text,
        }}
      >
        Lines of Code Distribution by Module
      </SvgText>

      {/* Subtitle */}
      <SvgText
        x={width / 2}
        y={32}
        textAnchor="middle"
        style={{
          fontSize: 8,
          fontFamily: "Times-Italic",
          fill: "#555555",
        }}
      >
        Total: 18,000 LOC (18.0 KLOC)
      </SvgText>

      {/* Grid lines */}
      {gridSteps.map((val, i) => {
        const x = chartLeft + (val / maxLOC) * chartW;
        return (
          <G key={`grid-${i}`}>
            <Line
              x1={x}
              y1={chartTop}
              x2={x}
              y2={chartTop + modules.length * (barH + barGap) - barGap + 5}
              stroke={colors.grid}
              strokeWidth={0.8}
            />
            <SvgText
              x={x}
              y={chartTop - 5}
              textAnchor="middle"
              style={{
                fontSize: 7,
                fontFamily: "Times-Roman",
                fill: "#555555",
              }}
            >
              {val.toLocaleString()}
            </SvgText>
          </G>
        );
      })}

      {/* Bars */}
      {modules.map((mod, i) => {
        const y = chartTop + i * (barH + barGap);
        const barW = (mod.loc / maxLOC) * chartW;
        return (
          <G key={`bar-${i}`}>
            {/* Module label */}
            <SvgText
              x={chartLeft - 8}
              y={y + barH / 2 + 3}
              textAnchor="end"
              style={{
                fontSize: 8,
                fontFamily: "Times-Roman",
                fill: colors.label,
              }}
            >
              {mod.name}
            </SvgText>

            {/* Bar */}
            <Rect
              x={chartLeft}
              y={y}
              width={barW}
              height={barH}
              rx={3}
              fill={colors.bar[i]}
            />

            {/* Value label */}
            <SvgText
              x={chartLeft + barW + 6}
              y={y + barH / 2 + 3}
              style={{
                fontSize: 8,
                fontFamily: "Times-Bold",
                fill: colors.text,
              }}
            >
              {mod.loc.toLocaleString()}
            </SvgText>

            {/* Percentage */}
            <SvgText
              x={chartLeft + barW + 40}
              y={y + barH / 2 + 3}
              style={{
                fontSize: 7,
                fontFamily: "Times-Italic",
                fill: "#555555",
              }}
            >
              ({((mod.loc / 18000) * 100).toFixed(1)}%)
            </SvgText>
          </G>
        );
      })}

      {/* X-axis label */}
      <SvgText
        x={chartLeft + chartW / 2}
        y={height - 18}
        textAnchor="middle"
        style={{
          fontSize: 8,
          fontFamily: "Times-Italic",
          fill: "#555555",
        }}
      >
        Lines of Code
      </SvgText>
    </Svg>
  );
}
