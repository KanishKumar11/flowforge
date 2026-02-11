/**
 * Performance Metrics Chart
 * Target vs Actual comparison for key performance metrics
 * For Chapter 9 (Testing)
 */
import {
  Svg,
  G,
  Rect,
  Text as SvgText,
  Line,
  Circle,
} from "@react-pdf/renderer";

export default function PerformanceMetricsChart() {
  const width = 495;
  const height = 360;

  const colors = {
    text: "#1a1a1a",
    label: "#333333",
    sublabel: "#555555",
    target: "#C62828",
    targetLine: "#EF5350",
    actual: "#2E7D32",
    actualBar: "#4CAF50",
    pass: "#E8F5E9",
    grid: "#E0E0E0",
  };

  const metrics = [
    { name: "LCP", unit: "sec", target: 2.5, actual: 1.8, max: 3 },
    { name: "FID", unit: "ms", target: 100, actual: 45, max: 120 },
    { name: "CLS", unit: "score", target: 0.1, actual: 0.05, max: 0.12 },
    { name: "API Resp.", unit: "ms", target: 500, actual: 180, max: 600 },
    { name: "Exec Start", unit: "sec", target: 2, actual: 0.8, max: 2.5 },
    { name: "Canvas 50", unit: "sec", target: 1, actual: 0.4, max: 1.2 },
    { name: "DB Query", unit: "ms", target: 100, actual: 35, max: 120 },
  ];

  const chartLeft = 80;
  const chartRight = width - 40;
  const chartTop = 60;
  const chartBottom = height - 90;
  const chartW = chartRight - chartLeft;
  const chartH = chartBottom - chartTop;

  const groupW = chartW / metrics.length;
  const barW = 28;

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
        Performance Testing — Target vs Actual
      </SvgText>
      <SvgText
        x={width / 2}
        y={32}
        textAnchor="middle"
        style={{
          fontSize: 8,
          fontFamily: "Times-Italic",
          fill: colors.sublabel,
        }}
      >
        All 7 metrics beaten — actual values well within target thresholds
      </SvgText>

      {/* Y-axis label */}
      <SvgText
        x={25}
        y={chartTop + chartH / 2}
        textAnchor="middle"
        style={{
          fontSize: 7,
          fontFamily: "Times-Italic",
          fill: colors.sublabel,
        }}
      >
        Normalized %
      </SvgText>

      {/* Baseline */}
      <Line
        x1={chartLeft}
        y1={chartBottom}
        x2={chartRight}
        y2={chartBottom}
        stroke="#333333"
        strokeWidth={1}
      />
      <Line
        x1={chartLeft}
        y1={chartTop}
        x2={chartLeft}
        y2={chartBottom}
        stroke="#333333"
        strokeWidth={0.8}
      />

      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((pct, i) => {
        const y = chartBottom - (pct / 100) * chartH;
        return (
          <G key={`grid-${i}`}>
            <Line
              x1={chartLeft}
              y1={y}
              x2={chartRight}
              y2={y}
              stroke={colors.grid}
              strokeWidth={0.8}
            />
            <SvgText
              x={chartLeft - 8}
              y={y + 3}
              textAnchor="end"
              style={{
                fontSize: 7,
                fontFamily: "Times-Roman",
                fill: colors.sublabel,
              }}
            >
              {pct}%
            </SvgText>
          </G>
        );
      })}

      {/* Metric bars */}
      {metrics.map((m, i) => {
        const groupX = chartLeft + i * groupW;
        const centerX = groupX + groupW / 2;

        // Normalize: target as % of max
        const targetPct = (m.target / m.max) * 100;
        const actualPct = (m.actual / m.max) * 100;

        const targetBarH = (targetPct / 100) * chartH;
        const actualBarH = (actualPct / 100) * chartH;

        const barX = centerX - barW / 2;

        return (
          <G key={`metric-${i}`}>
            {/* Target threshold line */}
            <Line
              x1={barX - 6}
              y1={chartBottom - targetBarH}
              x2={barX + barW + 6}
              y2={chartBottom - targetBarH}
              stroke={colors.targetLine}
              strokeWidth={2}
              strokeDasharray="4,2"
            />

            {/* Actual value bar */}
            <Rect
              x={barX}
              y={chartBottom - actualBarH}
              width={barW}
              height={actualBarH}
              rx={3}
              fill={colors.actualBar}
            />

            {/* Actual value label */}
            <SvgText
              x={centerX}
              y={chartBottom - actualBarH - 5}
              textAnchor="middle"
              style={{
                fontSize: 7,
                fontFamily: "Times-Bold",
                fill: colors.actual,
              }}
            >
              {m.actual}
            </SvgText>

            {/* Target value label — placed above the dashed line */}
            <SvgText
              x={centerX}
              y={chartBottom - targetBarH - 3}
              textAnchor="middle"
              style={{
                fontSize: 7,
                fontFamily: "Times-Bold",
                fill: colors.target,
              }}
            >
              {m.target}
            </SvgText>

            {/* Metric name */}
            <SvgText
              x={centerX}
              y={chartBottom + 12}
              textAnchor="middle"
              style={{
                fontSize: 8,
                fontFamily: "Times-Bold",
                fill: colors.text,
              }}
            >
              {m.name}
            </SvgText>
            <SvgText
              x={centerX}
              y={chartBottom + 22}
              textAnchor="middle"
              style={{
                fontSize: 7,
                fontFamily: "Times-Italic",
                fill: colors.sublabel,
              }}
            >
              {m.unit}
            </SvgText>

            {/* Pass indicator */}
            <Circle
              cx={centerX}
              cy={chartBottom + 34}
              r={5}
              fill={colors.pass}
              stroke={colors.actual}
              strokeWidth={0.8}
            />
            <SvgText
              x={centerX}
              y={chartBottom + 37}
              textAnchor="middle"
              style={{
                fontSize: 7,
                fontFamily: "Times-Bold",
                fill: colors.actual,
              }}
            >
              ✓
            </SvgText>
          </G>
        );
      })}

      {/* Legend */}
      <G>
        <Rect
          x={chartLeft}
          y={height - 22}
          width={chartW}
          height={18}
          rx={3}
          fill="#FAFAFA"
          stroke="#E0E0E0"
          strokeWidth={0.8}
        />
        <Rect
          x={chartLeft + 15}
          y={height - 17}
          width={12}
          height={8}
          rx={2}
          fill={colors.actualBar}
        />
        <SvgText
          x={chartLeft + 32}
          y={height - 10}
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
        >
          Actual Value
        </SvgText>
        <Line
          x1={chartLeft + 130}
          y1={height - 13}
          x2={chartLeft + 150}
          y2={height - 13}
          stroke={colors.targetLine}
          strokeWidth={2}
          strokeDasharray="4,2"
        />
        <SvgText
          x={chartLeft + 155}
          y={height - 10}
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
        >
          Target Threshold (must not exceed)
        </SvgText>
      </G>
    </Svg>
  );
}
