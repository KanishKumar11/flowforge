import {
  Svg,
  G,
  Rect,
  Text as SvgText,
  Circle,
  Line,
} from "@react-pdf/renderer";

/**
 * Feasibility Scorecard — Visual summary with progress bars and status indicators
 * Used in Section 4.8 Feasibility Summary
 */
export default function FeasibilityScorecard() {
  const width = 460;
  const height = 220;
  const startX = 40;
  const barMaxWidth = 280;
  const barHeight = 18;
  const rowGap = 30;
  const startY = 50;

  const dimensions = [
    { label: "Technical", score: 90, color: "#3b82f6", status: "APPROVED" },
    { label: "Economic", score: 85, color: "#8b5cf6", status: "APPROVED" },
    { label: "Operational", score: 88, color: "#06b6d4", status: "APPROVED" },
    { label: "Schedule", score: 82, color: "#10b981", status: "APPROVED" },
    { label: "Legal", score: 95, color: "#f59e0b", status: "APPROVED" },
  ];

  const avgScore = Math.round(
    dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length,
  );

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={width / 2}
        y={16}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Feasibility Assessment Scorecard
      </SvgText>

      {/* Column headers */}
      <SvgText
        x={startX}
        y={38}
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#666" }}
      >
        Dimension
      </SvgText>
      <SvgText
        x={startX + 80}
        y={38}
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#666" }}
      >
        Score
      </SvgText>
      <SvgText
        x={startX + 80 + barMaxWidth + 10}
        y={38}
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#666" }}
      >
        Status
      </SvgText>

      <Line
        x1={startX}
        y1={41}
        x2={width - 30}
        y2={41}
        stroke="#e5e7eb"
        strokeWidth={0.8}
      />

      {/* Rows */}
      {dimensions.map((dim, i) => {
        const y = startY + i * rowGap;
        const fillW = (dim.score / 100) * barMaxWidth;
        return (
          <G key={`dim-${i}`}>
            {/* Dimension label */}
            <SvgText
              x={startX}
              y={y + barHeight / 2 + 3}
              style={{ fontSize: 8, fontFamily: "Times-Bold", fill: "#333" }}
            >
              {dim.label}
            </SvgText>

            {/* Background bar */}
            <Rect
              x={startX + 80}
              y={y}
              width={barMaxWidth}
              height={barHeight}
              rx={4}
              fill="#f3f4f6"
            />

            {/* Fill bar */}
            <Rect
              x={startX + 80}
              y={y}
              width={fillW}
              height={barHeight}
              rx={4}
              fill={dim.color}
              opacity={0.75}
            />

            {/* Score text on bar */}
            <SvgText
              x={startX + 80 + fillW - 5}
              y={y + barHeight / 2 + 3}
              textAnchor="end"
              style={{
                fontSize: 7,
                fontFamily: "Times-Bold",
                fill: "#ffffff",
              }}
            >
              {dim.score}%
            </SvgText>

            {/* Status indicator */}
            <Circle
              cx={startX + 80 + barMaxWidth + 14}
              cy={y + barHeight / 2}
              r={4}
              fill="#059669"
            />
            <SvgText
              x={startX + 80 + barMaxWidth + 22}
              y={y + barHeight / 2 + 3}
              style={{
                fontSize: 7,
                fontFamily: "Times-Bold",
                fill: "#059669",
              }}
            >
              {dim.status}
            </SvgText>
          </G>
        );
      })}

      {/* Overall score */}
      <Line
        x1={startX}
        y1={height - 22}
        x2={width - 30}
        y2={height - 22}
        stroke="#333"
        strokeWidth={0.8}
      />
      <SvgText
        x={startX}
        y={height - 8}
        style={{ fontSize: 9, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Overall Feasibility Score: {avgScore}% — PROJECT APPROVED
      </SvgText>
    </Svg>
  );
}
