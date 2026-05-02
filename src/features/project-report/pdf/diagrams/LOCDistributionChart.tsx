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
    text: "#0f172a",
    label: "#334155",
    grid: "#cbd5e1",
    panel: "#f8fafc",
    accent: "#1d4ed8",
    accentSoft: "#c7d9f8",
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

  const totalLOC = 18000;
  const averageLOC = totalLOC / modules.length;
  const maxLOC = 5000;
  const chartLeft = 160;
  const chartRight = width - 30;
  const chartTop = 58;
  const barH = 26;
  const barGap = 10;
  const chartW = chartRight - chartLeft;
  const gridSteps = [0, 1000, 2000, 3000, 4000, 5000];

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <SvgText
        x={width / 2}
        y={18}
        textAnchor="middle"
        style={{ fontSize: 11, fontFamily: "Times-Bold", fill: colors.text }}
      >
        Lines of Code Distribution by Module
      </SvgText>
      <SvgText
        x={width / 2}
        y={30}
        textAnchor="middle"
        style={{ fontSize: 8, fontFamily: "Times-Italic", fill: "#475569" }}
      >
        Total: 18,000 LOC across seven core project modules
      </SvgText>

      <Rect
        x={chartLeft - 12}
        y={chartTop - 10}
        width={chartW + 24}
        height={modules.length * (barH + barGap) - barGap + 20}
        rx={14}
        fill={colors.panel}
        stroke={colors.grid}
        strokeWidth={0.8}
      />

      <Rect
        x={chartLeft - 128}
        y={chartTop - 34}
        width={116}
        height={30}
        rx={10}
        fill="#ffffff"
        stroke={colors.grid}
        strokeWidth={0.8}
      />
      <SvgText
        x={chartLeft - 70}
        y={chartTop - 20}
        textAnchor="middle"
        style={{ fontSize: 7.5, fontFamily: "Times-Bold", fill: colors.text }}
      >
        Snapshot
      </SvgText>
      <SvgText
        x={chartLeft - 70}
        y={chartTop - 10}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Roman", fill: "#475569" }}
      >
        Avg. 2.6K LOC per module
      </SvgText>

      {gridSteps.map((val, i) => {
        const x = chartLeft + (val / maxLOC) * chartW;
        return (
          <G key={`grid-${i}`}>
            <Line
              x1={x}
              y1={chartTop}
              x2={x}
              y2={chartTop + modules.length * (barH + barGap) - barGap + 4}
              stroke={colors.grid}
              strokeWidth={0.8}
            />
            <SvgText
              x={x}
              y={chartTop - 8}
              textAnchor="middle"
              style={{
                fontSize: 7,
                fontFamily: "Times-Roman",
                fill: "#64748b",
              }}
            >
              {val.toLocaleString()}
            </SvgText>
          </G>
        );
      })}

      <Line
        x1={chartLeft + (averageLOC / maxLOC) * chartW}
        y1={chartTop}
        x2={chartLeft + (averageLOC / maxLOC) * chartW}
        y2={chartTop + modules.length * (barH + barGap) - barGap + 4}
        stroke="#64748b"
        strokeWidth={0.8}
        strokeDasharray="3,2"
      />
      <SvgText
        x={chartLeft + (averageLOC / maxLOC) * chartW + 18}
        y={chartTop + 12}
        style={{ fontSize: 7, fontFamily: "Times-Italic", fill: "#475569" }}
      >
        Avg
      </SvgText>

      {modules.map((mod, i) => {
        const y = chartTop + i * (barH + barGap);
        const barW = (mod.loc / maxLOC) * chartW;
        const opacity = 1 - i * 0.06;
        return (
          <G key={`bar-${i}`}>
            <SvgText
              x={chartLeft - 14}
              y={y + barH / 2 + 3}
              textAnchor="end"
              style={{
                fontSize: 8,
                fontFamily: "Times-Bold",
                fill: colors.label,
              }}
            >
              {mod.name}
            </SvgText>
            <Rect
              x={chartLeft}
              y={y}
              width={chartW}
              height={barH}
              rx={10}
              fill="#ffffff"
            />
            <Rect
              x={chartLeft}
              y={y}
              width={barW}
              height={barH}
              rx={10}
              fill={colors.accent}
              opacity={opacity}
            />
            <Rect
              x={chartLeft + barW - 4}
              y={y + 4}
              width={8}
              height={barH - 8}
              rx={4}
              fill={colors.accentSoft}
              opacity={0.75}
            />
            <SvgText
              x={chartLeft + barW + 8}
              y={y + barH / 2 + 3}
              textAnchor="start"
              style={{
                fontSize: 7.5,
                fontFamily: "Times-Bold",
                fill: colors.text,
              }}
            >
              {mod.loc.toLocaleString()}
            </SvgText>
            <SvgText
              x={chartLeft + barW + 8}
              y={y + barH / 2 + 12}
              textAnchor="start"
              style={{
                fontSize: 6.5,
                fontFamily: "Times-Italic",
                fill: "#64748b",
              }}
            >
              {((mod.loc / totalLOC) * 100).toFixed(1)}%
            </SvgText>
          </G>
        );
      })}

      <SvgText
        x={chartLeft + chartW / 2}
        y={height - 18}
        textAnchor="middle"
        style={{ fontSize: 8, fontFamily: "Times-Italic", fill: "#475569" }}
      >
        Lines of Code
      </SvgText>
    </Svg>
  );
}
