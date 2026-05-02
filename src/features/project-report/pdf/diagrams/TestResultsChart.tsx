/**
 * Test Results Chart - Stacked summary of test results by category
 * Horizontal bar chart with all-pass indicators
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

export default function TestResultsChart() {
  const width = 495;
  const height = 320;

  const colors = {
    text: "#1a1a1a",
    label: "#333333",
    pass: "#2E7D32",
    passLight: "#C8E6C9",
    grid: "#E0E0E0",
    accent: "#1565C0",
  };

  const categories = [
    { name: "Unit Tests", total: 69, passed: 69 },
    { name: "Integration Tests", total: 29, passed: 29 },
    { name: "UI/UX Tests", total: 29, passed: 29 },
    { name: "System Tests", total: 6, passed: 6 },
    { name: "Security Tests", total: 5, passed: 5 },
    { name: "Performance Tests", total: 4, passed: 4 },
  ];

  const maxVal = 80;
  const chartLeft = 140;
  const chartRight = width - 60;
  const chartTop = 55;
  const barH = 28;
  const barGap = 10;
  const chartW = chartRight - chartLeft;

  const gridSteps = [0, 20, 40, 60, 80];

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
        Test Results Summary — 142 Tests, 100% Pass Rate
      </SvgText>

      {/* Subtitle */}
      <SvgText
        x={width / 2}
        y={32}
        textAnchor="middle"
        style={{
          fontSize: 8,
          fontFamily: "Times-Italic",
          fill: "#475569",
        }}
      >
        All 142 test cases passed across 6 testing levels
      </SvgText>

      {/* Grid lines */}
      {gridSteps.map((val, i) => {
        const x = chartLeft + (val / maxVal) * chartW;
        return (
          <G key={`grid-${i}`}>
            <Line
              x1={x}
              y1={chartTop - 2}
              x2={x}
              y2={chartTop + categories.length * (barH + barGap)}
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
                fill: "#475569",
              }}
            >
              {val}
            </SvgText>
          </G>
        );
      })}

      {/* Bars */}
      {categories.map((cat, i) => {
        const y = chartTop + i * (barH + barGap);
        const barW = (cat.total / maxVal) * chartW;
        const countText = `${cat.passed} / ${cat.total}`;
        const placeOutside = barW < 44;

        return (
          <G key={`bar-${i}`}>
            {/* Category label */}
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
              {cat.name}
            </SvgText>

            {/* Bar */}
            <Rect
              x={chartLeft}
              y={y}
              width={barW}
              height={barH}
              rx={3}
              fill={colors.pass}
            />

            {/* Count label */}
            {placeOutside ? (
              <SvgText
                x={chartLeft + barW + 32}
                y={y + barH / 2 + 3}
                textAnchor="start"
                style={{
                  fontSize: 8,
                  fontFamily: "Times-Bold",
                  fill: colors.text,
                }}
              >
                {countText}
              </SvgText>
            ) : (
              <SvgText
                x={chartLeft + barW / 2}
                y={y + barH / 2 + 3}
                textAnchor="middle"
                style={{
                  fontSize: 9,
                  fontFamily: "Times-Bold",
                  fill: "#FFFFFF",
                }}
              >
                {countText}
              </SvgText>
            )}

            {/* Checkmark */}
            <Circle
              cx={chartLeft + barW + 16}
              cy={y + barH / 2}
              r={8}
              fill={colors.passLight}
              stroke={colors.pass}
              strokeWidth={1}
            />
            <SvgText
              x={chartLeft + barW + 16}
              y={y + barH / 2 + 4}
              textAnchor="middle"
              style={{
                fontSize: 9,
                fontFamily: "Times-Bold",
                fill: colors.pass,
              }}
            >
              ✓
            </SvgText>
          </G>
        );
      })}

      {/* Total summary box */}
      <G>
        <Rect
          x={chartLeft}
          y={height - 52}
          width={chartW + 30}
          height={36}
          rx={4}
          fill="#E8F5E9"
          stroke={colors.pass}
          strokeWidth={1}
        />
        <SvgText
          x={chartLeft + (chartW + 30) / 2}
          y={height - 38}
          textAnchor="middle"
          style={{
            fontSize: 10,
            fontFamily: "Times-Bold",
            fill: colors.pass,
          }}
        >
          Overall: 142 / 142 Tests Passed — 100% Pass Rate
        </SvgText>
        <SvgText
          x={chartLeft + (chartW + 30) / 2}
          y={height - 24}
          textAnchor="middle"
          style={{
            fontSize: 8,
            fontFamily: "Times-Italic",
            fill: "#475569",
          }}
        >
          Zero defects remaining — all 5 discovered defects resolved during
          development
        </SvgText>
      </G>
    </Svg>
  );
}
