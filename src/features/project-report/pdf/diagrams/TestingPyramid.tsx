/**
 * Testing Pyramid Diagram
 * Shows the testing levels with counts and coverage
 * For Chapter 9 (Testing)
 */
import {
  Svg,
  Rect,
  Text as SvgText,
  Line,
  G,
  Polygon,
} from "@react-pdf/renderer";

export default function TestingPyramid() {
  const width = 495;
  const height = 360;

  const colors = {
    text: "#1a1a1a",
    label: "#666666",
    unit: "#4CAF50",
    unitLight: "#E8F5E9",
    integration: "#2196F3",
    integrationLight: "#E3F2FD",
    system: "#FF9800",
    systemLight: "#FFF3E0",
    uiux: "#9C27B0",
    uiuxLight: "#F3E5F5",
    security: "#F44336",
    securityLight: "#FFEBEE",
    performance: "#795548",
    performanceLight: "#EFEBE9",
  };

  // Pyramid layers (from bottom to top)
  const layers = [
    {
      label: "Unit Tests",
      count: "24 Test Cases",
      coverage: "85%",
      color: colors.unit,
      lightColor: colors.unitLight,
      tools: "Vitest + React Testing Library",
    },
    {
      label: "Integration Tests",
      count: "12 Test Cases",
      coverage: "78%",
      color: colors.integration,
      lightColor: colors.integrationLight,
      tools: "Vitest + tRPC Mock",
    },
    {
      label: "System Tests",
      count: "8 Test Cases",
      coverage: "92%",
      color: colors.system,
      lightColor: colors.systemLight,
      tools: "End-to-End Scenarios",
    },
    {
      label: "UI/UX Tests",
      count: "6 Test Cases",
      coverage: "100%",
      color: colors.uiux,
      lightColor: colors.uiuxLight,
      tools: "Manual + Responsive",
    },
    {
      label: "Security Tests",
      count: "5 Test Cases",
      coverage: "100%",
      color: colors.security,
      lightColor: colors.securityLight,
      tools: "Auth + XSS + CSRF",
    },
    {
      label: "Performance",
      count: "4 Test Cases",
      coverage: "100%",
      color: colors.performance,
      lightColor: colors.performanceLight,
      tools: "Load + Response Time",
    },
  ];

  const pyramidLeft = 120;
  const pyramidRight = 375;
  const pyramidTop = 60;
  const pyramidBottom = 310;
  const layerH = (pyramidBottom - pyramidTop) / layers.length;
  const cx = (pyramidLeft + pyramidRight) / 2;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={width / 2}
        y={16}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: colors.text }}
      >
        Testing Pyramid
      </SvgText>
      <SvgText
        x={width / 2}
        y={30}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Italic", fill: colors.label }}
      >
        59 Total Test Cases Across 6 Testing Levels
      </SvgText>

      {/* Draw pyramid layers from bottom to top */}
      {layers.map((layer, i) => {
        const idx = layers.length - 1 - i; // Reverse: bottom layer first
        const l = layers[idx];
        const y = pyramidTop + i * layerH;
        // Trapezoid: narrower at top
        const topInset =
          (i * (pyramidRight - pyramidLeft)) / (layers.length * 2);
        const bottomInset =
          ((i + 1) * (pyramidRight - pyramidLeft)) / (layers.length * 2);
        const x1Top = pyramidLeft + topInset;
        const x2Top = pyramidRight - topInset;
        const x1Bot = pyramidLeft + bottomInset;
        const x2Bot = pyramidRight - bottomInset;

        return (
          <G key={idx}>
            {/* Trapezoid shape */}
            <Polygon
              points={`${x1Top},${y} ${x2Top},${y} ${x2Bot},${y + layerH} ${x1Bot},${y + layerH}`}
              fill={l.lightColor}
              stroke={l.color}
              strokeWidth={1.5}
            />
            {/* Layer label (centered) */}
            <SvgText
              x={cx}
              y={y + layerH / 2 - 2}
              textAnchor="middle"
              style={{ fontSize: 8, fontFamily: "Times-Bold", fill: l.color }}
            >
              {l.label}
            </SvgText>
            <SvgText
              x={cx}
              y={y + layerH / 2 + 10}
              textAnchor="middle"
              style={{
                fontSize: 6,
                fontFamily: "Times-Roman",
                fill: colors.text,
              }}
            >
              {l.count}
            </SvgText>

            {/* Right side: tools label */}
            <Line
              x1={x2Top}
              y1={y + layerH / 2}
              x2={x2Top + 15}
              y2={y + layerH / 2}
              stroke={l.color}
              strokeWidth={0.5}
            />
            <SvgText
              x={x2Top + 18}
              y={y + layerH / 2 - 3}
              textAnchor="start"
              style={{ fontSize: 5.5, fontFamily: "Times-Bold", fill: l.color }}
            >
              {l.tools}
            </SvgText>
            <SvgText
              x={x2Top + 18}
              y={y + layerH / 2 + 6}
              textAnchor="start"
              style={{
                fontSize: 5.5,
                fontFamily: "Times-Roman",
                fill: colors.label,
              }}
            >
              Coverage: {l.coverage}
            </SvgText>

            {/* Left side: count indicator bar */}
            {(() => {
              const barMaxW = 60;
              const pct = parseInt(l.coverage) / 100;
              const barW = barMaxW * pct;
              const barY = y + layerH / 2 - 4;
              const barX = x1Top - barMaxW - 12;
              return (
                <G>
                  <Rect
                    x={barX}
                    y={barY}
                    width={barMaxW}
                    height={8}
                    rx={2}
                    fill="#f0f0f0"
                    stroke="#dddddd"
                    strokeWidth={0.5}
                  />
                  <Rect
                    x={barX}
                    y={barY}
                    width={barW}
                    height={8}
                    rx={2}
                    fill={l.color}
                    opacity={0.7}
                  />
                  <SvgText
                    x={barX + barMaxW / 2}
                    y={barY + 6}
                    textAnchor="middle"
                    style={{
                      fontSize: 5,
                      fontFamily: "Times-Bold",
                      fill: "#ffffff",
                    }}
                  >
                    {l.coverage}
                  </SvgText>
                </G>
              );
            })()}
          </G>
        );
      })}

      {/* Annotations */}
      <SvgText
        x={30}
        y={340}
        style={{ fontSize: 6, fontFamily: "Times-Bold", fill: colors.label }}
      >
        More Tests
      </SvgText>
      <Line
        x1={15}
        y1={310}
        x2={15}
        y2={70}
        stroke={colors.label}
        strokeWidth={0.8}
      />
      <Line
        x1={13}
        y1={75}
        x2={15}
        y2={70}
        stroke={colors.label}
        strokeWidth={0.8}
      />
      <Line
        x1={17}
        y1={75}
        x2={15}
        y2={70}
        stroke={colors.label}
        strokeWidth={0.8}
      />

      <SvgText
        x={30}
        y={352}
        style={{ fontSize: 6, fontFamily: "Times-Bold", fill: colors.label }}
      >
        Faster Execution
      </SvgText>

      <SvgText
        x={width - 30}
        y={340}
        textAnchor="end"
        style={{ fontSize: 6, fontFamily: "Times-Bold", fill: colors.label }}
      >
        Fewer Tests
      </SvgText>
      <SvgText
        x={width - 30}
        y={352}
        textAnchor="end"
        style={{ fontSize: 6, fontFamily: "Times-Bold", fill: colors.label }}
      >
        Higher Confidence
      </SvgText>
    </Svg>
  );
}
