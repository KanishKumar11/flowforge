/**
 * Actual vs Estimated Comparison Chart
 * Grouped bar chart comparing COCOMO estimates against actual project values
 * For Chapter 5 (Project Estimation & Planning)
 */
import { Svg, G, Rect, Text as SvgText, Line } from "@react-pdf/renderer";

export default function ActualVsEstimatedChart() {
  const width = 495;
  const height = 300;

  const colors = {
    text: "#1a1a1a",
    label: "#333333",
    estimated: "#1565C0",
    actual: "#2E7D32",
    grid: "#E0E0E0",
    variance: "#C62828",
  };

  const metrics = [
    {
      name: "Effort",
      unit: "Person-Months",
      estimated: 28.7,
      actual: 3,
      max: 35,
    },
    {
      name: "Duration",
      unit: "Months",
      estimated: 11.0,
      actual: 2.5,
      max: 14,
    },
    {
      name: "Team Size",
      unit: "Persons",
      estimated: 5,
      actual: 1,
      max: 6,
    },
    {
      name: "Cost",
      unit: "INR Lakhs",
      estimated: 10.79,
      actual: 2.35,
      max: 13,
    },
  ];

  const chartLeft = 90;
  const chartRight = width - 40;
  const chartTop = 55;
  const chartBottom = height - 80;
  const chartW = chartRight - chartLeft;
  const chartH = chartBottom - chartTop;

  const groupW = chartW / metrics.length;
  const barW = 32;
  const barGap = 8;

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
        COCOMO Estimated vs Actual Comparison
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
        Demonstrates significant over-estimation by COCOMO I for agile
        solo-developer projects
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

      {/* Bars per metric */}
      {metrics.map((m, i) => {
        const groupX = chartLeft + i * groupW;
        const centerX = groupX + groupW / 2;

        const estBarH = (m.estimated / m.max) * chartH;
        const actBarH = (m.actual / m.max) * chartH;

        const estX = centerX - barW - barGap / 2;
        const actX = centerX + barGap / 2;

        const variance = (
          ((m.estimated - m.actual) / m.estimated) *
          100
        ).toFixed(0);

        return (
          <G key={`metric-${i}`}>
            {/* Estimated bar */}
            <Rect
              x={estX}
              y={chartBottom - estBarH}
              width={barW}
              height={estBarH}
              rx={3}
              fill={colors.estimated}
            />
            <SvgText
              x={estX + barW / 2}
              y={chartBottom - estBarH - 5}
              textAnchor="middle"
              style={{
                fontSize: 8,
                fontFamily: "Times-Bold",
                fill: colors.estimated,
              }}
            >
              {m.estimated}
            </SvgText>

            {/* Actual bar */}
            <Rect
              x={actX}
              y={chartBottom - actBarH}
              width={barW}
              height={actBarH}
              rx={3}
              fill={colors.actual}
            />
            <SvgText
              x={actX + barW / 2}
              y={chartBottom - actBarH - 5}
              textAnchor="middle"
              style={{
                fontSize: 8,
                fontFamily: "Times-Bold",
                fill: colors.actual,
              }}
            >
              {m.actual}
            </SvgText>

            {/* Metric name */}
            <SvgText
              x={centerX}
              y={chartBottom + 14}
              textAnchor="middle"
              style={{
                fontSize: 9,
                fontFamily: "Times-Bold",
                fill: colors.text,
              }}
            >
              {m.name}
            </SvgText>
            <SvgText
              x={centerX}
              y={chartBottom + 24}
              textAnchor="middle"
              style={{
                fontSize: 7,
                fontFamily: "Times-Italic",
                fill: "#555555",
              }}
            >
              {m.unit}
            </SvgText>

            {/* Variance label */}
            <SvgText
              x={centerX}
              y={chartBottom + 40}
              textAnchor="middle"
              style={{
                fontSize: 7,
                fontFamily: "Times-Bold",
                fill: colors.variance,
              }}
            >
              {`-${variance}%`}
            </SvgText>
          </G>
        );
      })}

      {/* Legend */}
      <G>
        <Rect
          x={chartRight - 140}
          y={42}
          width={12}
          height={12}
          rx={2}
          fill={colors.estimated}
        />
        <SvgText
          x={chartRight - 124}
          y={52}
          style={{
            fontSize: 8,
            fontFamily: "Times-Roman",
            fill: colors.label,
          }}
        >
          COCOMO Estimated
        </SvgText>
        <Rect
          x={chartRight - 140}
          y={58}
          width={12}
          height={12}
          rx={2}
          fill={colors.actual}
        />
        <SvgText
          x={chartRight - 124}
          y={68}
          style={{
            fontSize: 8,
            fontFamily: "Times-Roman",
            fill: colors.label,
          }}
        >
          Actual
        </SvgText>
      </G>
    </Svg>
  );
}
