import { Svg, G, Rect, Text as SvgText, Line } from "@react-pdf/renderer";

/**
 * Schedule Timeline — Visual Gantt-style chart for 12-week project schedule
 * Used in Section 4.5 Schedule Feasibility
 */
export default function ScheduleTimeline() {
  const width = 460;
  const height = 230;
  const chartLeft = 100;
  const chartRight = width - 20;
  const chartWidth = chartRight - chartLeft;
  const chartTop = 40;
  const rowHeight = 24;
  const totalWeeks = 12;
  const weekWidth = chartWidth / totalWeeks;

  const phases = [
    { label: "Requirements", start: 0, duration: 1, color: "#8b5cf6" },
    { label: "Feasibility", start: 1, duration: 1, color: "#6366f1" },
    { label: "System Design", start: 2, duration: 2, color: "#3b82f6" },
    { label: "Development", start: 3, duration: 6, color: "#06b6d4" },
    { label: "Testing", start: 9, duration: 2, color: "#10b981" },
    { label: "Deployment", start: 11, duration: 1, color: "#f59e0b" },
  ];

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={width / 2}
        y={16}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333" }}
      >
        12-Week Project Schedule
      </SvgText>

      {/* Week headers */}
      {Array.from({ length: totalWeeks }, (_, i) => (
        <G key={`wk-${i}`}>
          <SvgText
            x={chartLeft + i * weekWidth + weekWidth / 2}
            y={chartTop - 5}
            textAnchor="middle"
            style={{ fontSize: 6, fill: "#666" }}
          >
            W{i + 1}
          </SvgText>
          {/* Vertical grid */}
          <Line
            x1={chartLeft + i * weekWidth}
            y1={chartTop}
            x2={chartLeft + i * weekWidth}
            y2={chartTop + phases.length * rowHeight}
            stroke="#e5e7eb"
            strokeWidth={0.5}
          />
        </G>
      ))}
      {/* Right edge */}
      <Line
        x1={chartRight}
        y1={chartTop}
        x2={chartRight}
        y2={chartTop + phases.length * rowHeight}
        stroke="#e5e7eb"
        strokeWidth={0.5}
      />

      {/* Horizontal grid lines */}
      {phases.map((_, i) => (
        <Line
          key={`hline-${i}`}
          x1={chartLeft}
          y1={chartTop + i * rowHeight}
          x2={chartRight}
          y2={chartTop + i * rowHeight}
          stroke="#e5e7eb"
          strokeWidth={0.5}
        />
      ))}
      <Line
        x1={chartLeft}
        y1={chartTop + phases.length * rowHeight}
        x2={chartRight}
        y2={chartTop + phases.length * rowHeight}
        stroke="#e5e7eb"
        strokeWidth={0.5}
      />

      {/* Phase bars */}
      {phases.map((phase, i) => {
        const y = chartTop + i * rowHeight;
        const barX = chartLeft + phase.start * weekWidth;
        const barW = phase.duration * weekWidth;
        return (
          <G key={`phase-${i}`}>
            {/* Row label */}
            <SvgText
              x={chartLeft - 6}
              y={y + rowHeight / 2 + 3}
              textAnchor="end"
              style={{ fontSize: 7, fontFamily: "Times-Roman", fill: "#333" }}
            >
              {phase.label}
            </SvgText>

            {/* Bar */}
            <Rect
              x={barX + 1}
              y={y + 4}
              width={barW - 2}
              height={rowHeight - 8}
              rx={4}
              fill={phase.color}
              opacity={0.8}
            />

            {/* Duration label on bar */}
            <SvgText
              x={barX + barW / 2}
              y={y + rowHeight / 2 + 3}
              textAnchor="middle"
              style={{
                fontSize: 6,
                fontFamily: "Times-Bold",
                fill: "#ffffff",
              }}
            >
              {phase.duration}w
            </SvgText>
          </G>
        );
      })}

      {/* Overlap indicator for Development & Testing */}
      <SvgText
        x={width / 2}
        y={height - 18}
        textAnchor="middle"
        style={{ fontSize: 6.5, fill: "#666" }}
      >
        Note: Testing overlaps with Development (continuous integration testing
        from Week 10)
      </SvgText>

      {/* Month markers */}
      <Line
        x1={chartLeft}
        y1={height - 30}
        x2={chartRight}
        y2={height - 30}
        stroke="#cbd5e1"
        strokeWidth={0.5}
      />
      <SvgText
        x={chartLeft + weekWidth * 2}
        y={height - 34}
        textAnchor="middle"
        style={{ fontSize: 6, fill: "#999" }}
      >
        Month 1
      </SvgText>
      <SvgText
        x={chartLeft + weekWidth * 6}
        y={height - 34}
        textAnchor="middle"
        style={{ fontSize: 6, fill: "#999" }}
      >
        Month 2
      </SvgText>
      <SvgText
        x={chartLeft + weekWidth * 10}
        y={height - 34}
        textAnchor="middle"
        style={{ fontSize: 6, fill: "#999" }}
      >
        Month 3
      </SvgText>
    </Svg>
  );
}
