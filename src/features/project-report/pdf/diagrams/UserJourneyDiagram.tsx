import {
  Svg,
  G,
  Rect,
  Text as SvgText,
  Line,
  Circle,
} from "@react-pdf/renderer";

/**
 * User Workflow Journey — Step-by-step flow diagram showing user journey through Flowgent
 * Used in User Manual chapter
 */
export default function UserJourneyDiagram() {
  const width = 495;
  const height = 320;

  const steps = [
    { label: "Sign Up /\nLog In", icon: "1", color: "#3b82f6" },
    { label: "Create\nWorkflow", icon: "2", color: "#6366f1" },
    { label: "Add &\nConnect Nodes", icon: "3", color: "#8b5cf6" },
    { label: "Configure\nCredentials", icon: "4", color: "#a855f7" },
    { label: "Test &\nExecute", icon: "5", color: "#06b6d4" },
    { label: "Monitor\nResults", icon: "6", color: "#10b981" },
  ];

  const stepW = 68;
  const stepH = 60;
  const gap = 12;
  const totalW = steps.length * stepW + (steps.length - 1) * gap;
  const startX = (width - totalW) / 2;
  const rowY = 80;

  // Bottom row: additional features
  const features = [
    { label: "Schedule\nAutomation", color: "#f59e0b" },
    { label: "Team\nCollaboration", color: "#ef4444" },
    { label: "Version\nHistory", color: "#14b8a6" },
    { label: "Dashboard\nAnalytics", color: "#6366f1" },
  ];
  const featW = 90;
  const featH = 40;
  const featGap = 16;
  const featTotalW = features.length * featW + (features.length - 1) * featGap;
  const featStartX = (width - featTotalW) / 2;
  const featY = 220;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={width / 2}
        y={18}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333" }}
      >
        User Workflow Journey — From Sign-up to Automation
      </SvgText>

      {/* Subtitle */}
      <SvgText
        x={width / 2}
        y={34}
        textAnchor="middle"
        style={{ fontSize: 7, fill: "#888" }}
      >
        Primary Flow (top) and Advanced Features (bottom)
      </SvgText>

      {/* Step boxes */}
      {steps.map((step, i) => {
        const x = startX + i * (stepW + gap);
        const lines = step.label.split("\n");

        return (
          <G key={`step-${i}`}>
            {/* Box */}
            <Rect
              x={x}
              y={rowY}
              width={stepW}
              height={stepH}
              rx={6}
              fill={step.color}
              opacity={0.12}
              stroke={step.color}
              strokeWidth={1.5}
            />

            {/* Step number circle */}
            <Circle cx={x + stepW / 2} cy={rowY + 16} r={9} fill={step.color} />
            <SvgText
              x={x + stepW / 2}
              y={rowY + 19}
              textAnchor="middle"
              style={{
                fontSize: 8,
                fontFamily: "Times-Bold",
                fill: "#ffffff",
              }}
            >
              {step.icon}
            </SvgText>

            {/* Label */}
            {lines.map((line, li) => (
              <SvgText
                key={`lbl-${i}-${li}`}
                x={x + stepW / 2}
                y={rowY + 34 + li * 10}
                textAnchor="middle"
                style={{
                  fontSize: 7,
                  fontFamily: "Times-Bold",
                  fill: "#333",
                }}
              >
                {line}
              </SvgText>
            ))}

            {/* Arrow to next */}
            {i < steps.length - 1 && (
              <G>
                <Line
                  x1={x + stepW + 1}
                  y1={rowY + stepH / 2}
                  x2={x + stepW + gap - 1}
                  y2={rowY + stepH / 2}
                  stroke="#cbd5e1"
                  strokeWidth={1.5}
                />
                {/* Arrowhead */}
                <Line
                  x1={x + stepW + gap - 5}
                  y1={rowY + stepH / 2 - 3}
                  x2={x + stepW + gap - 1}
                  y2={rowY + stepH / 2}
                  stroke="#cbd5e1"
                  strokeWidth={1.5}
                />
                <Line
                  x1={x + stepW + gap - 5}
                  y1={rowY + stepH / 2 + 3}
                  x2={x + stepW + gap - 1}
                  y2={rowY + stepH / 2}
                  stroke="#cbd5e1"
                  strokeWidth={1.5}
                />
              </G>
            )}
          </G>
        );
      })}

      {/* Divider line */}
      <SvgText
        x={width / 2}
        y={175}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#999" }}
      >
        — ADVANCED FEATURES —
      </SvgText>
      <Line
        x1={60}
        y1={180}
        x2={width - 60}
        y2={180}
        stroke="#e5e7eb"
        strokeWidth={0.5}
      />

      {/* Connector lines from primary flow to features */}
      <Line
        x1={width / 2}
        y1={rowY + stepH}
        x2={width / 2}
        y2={featY}
        stroke="#e5e7eb"
        strokeWidth={0.5}
        strokeDasharray="3,3"
      />

      {/* Feature boxes */}
      {features.map((feat, i) => {
        const x = featStartX + i * (featW + featGap);
        const lines = feat.label.split("\n");

        return (
          <G key={`feat-${i}`}>
            <Rect
              x={x}
              y={featY}
              width={featW}
              height={featH}
              rx={5}
              fill={feat.color}
              opacity={0.1}
              stroke={feat.color}
              strokeWidth={1}
              strokeDasharray="4,3"
            />
            {lines.map((line, li) => (
              <SvgText
                key={`flbl-${i}-${li}`}
                x={x + featW / 2}
                y={featY + 16 + li * 10}
                textAnchor="middle"
                style={{
                  fontSize: 7,
                  fontFamily: "Times-Bold",
                  fill: feat.color,
                }}
              >
                {line}
              </SvgText>
            ))}
          </G>
        );
      })}

      {/* Bottom note */}
      <SvgText
        x={width / 2}
        y={height - 20}
        textAnchor="middle"
        style={{ fontSize: 7, fill: "#999" }}
      >
        All features accessible via the web browser — no installation required
      </SvgText>
    </Svg>
  );
}
