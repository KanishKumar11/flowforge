import { Svg, G, Rect, Text as SvgText, Line } from "@react-pdf/renderer";

/**
 * Gantt Chart - Project Timeline across 12 weeks
 * Phases: Requirements, Feasibility, Design, Development, Testing, Deployment
 */
export default function GanttChart() {
  const width = 495;
  const height = 280;
  const cx = width / 2;

  const chartX = 120;
  const chartY = 40;
  const chartW = 350;
  const chartH = 195;
  const weeks = 12;
  const weekW = chartW / weeks;

  const phases = [
    { name: "Requirements", start: 0, duration: 1, color: "#2563eb" },
    { name: "Feasibility Study", start: 1, duration: 1, color: "#7c3aed" },
    { name: "System Design", start: 2, duration: 2, color: "#0891b2" },
    { name: "Development", start: 3, duration: 6, color: "#059669" },
    { name: "Testing & QA", start: 8, duration: 2, color: "#d97706" },
    { name: "Deployment", start: 10, duration: 2, color: "#dc2626" },
  ];

  const barH = 22;
  const barGap = 8;
  const barStartY = chartY + 25;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={cx}
        y={20}
        textAnchor="middle"
        style={{ fontSize: 11, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Project Timeline — Gantt Chart
      </SvgText>

      {/* Week header */}
      {Array.from({ length: weeks }).map((_, i) => (
        <G key={`wk-${i}`}>
          {/* Column lines */}
          <Line
            x1={chartX + i * weekW}
            y1={chartY}
            x2={chartX + i * weekW}
            y2={chartY + chartH}
            stroke="#e5e5e5"
            strokeWidth={0.5}
          />
          {/* Week label */}
          <SvgText
            x={chartX + i * weekW + weekW / 2}
            y={chartY + 12}
            textAnchor="middle"
            style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#555" }}
          >
            W{i + 1}
          </SvgText>
        </G>
      ))}

      {/* Right border */}
      <Line
        x1={chartX + chartW}
        y1={chartY}
        x2={chartX + chartW}
        y2={chartY + chartH}
        stroke="#e5e5e5"
        strokeWidth={0.5}
      />

      {/* Header separator */}
      <Line
        x1={chartX}
        y1={chartY + 18}
        x2={chartX + chartW}
        y2={chartY + 18}
        stroke="#999"
        strokeWidth={1}
      />

      {/* Phase bars */}
      {phases.map((phase, i) => {
        const y = barStartY + i * (barH + barGap);
        const x = chartX + phase.start * weekW;
        const w = phase.duration * weekW;

        return (
          <G key={`phase-${i}`}>
            {/* Row background */}
            {i % 2 === 0 && (
              <Rect
                x={chartX}
                y={y - 3}
                width={chartW}
                height={barH + 6}
                fill="#fafafa"
              />
            )}

            {/* Phase label */}
            <SvgText
              x={chartX - 8}
              y={y + barH / 2 + 3}
              textAnchor="end"
              style={{ fontSize: 8, fontFamily: "Times-Roman", fill: "#333" }}
            >
              {phase.name}
            </SvgText>

            {/* Bar shadow */}
            <Rect
              x={x + 1}
              y={y + 1}
              width={w - 2}
              height={barH}
              rx={4}
              fill="#e5e5e5"
            />

            {/* Bar */}
            <Rect
              x={x}
              y={y}
              width={w - 2}
              height={barH}
              rx={4}
              fill={phase.color}
            />

            {/* Duration label on bar */}
            <SvgText
              x={x + (w - 2) / 2}
              y={y + barH / 2 + 3}
              textAnchor="middle"
              style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "white" }}
            >
              {phase.duration === 1 ? "1 week" : `${phase.duration} weeks`}
            </SvgText>

            {/* Milestone diamond at end */}
            {(i === 0 || i === 2 || i === 5) && (
              <G>
                <Rect
                  x={x + w - 6}
                  y={y + barH / 2 - 4}
                  width={8}
                  height={8}
                  fill="white"
                  stroke={phase.color}
                  strokeWidth={1}
                  style={{ transform: "rotate(45deg)" }}
                />
              </G>
            )}
          </G>
        );
      })}

      {/* Bottom border */}
      <Line
        x1={chartX}
        y1={chartY + chartH}
        x2={chartX + chartW}
        y2={chartY + chartH}
        stroke="#999"
        strokeWidth={1}
      />

      {/* Month labels */}
      <SvgText
        x={chartX + 2 * weekW}
        y={chartY + chartH + 15}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Month 1
      </SvgText>
      <SvgText
        x={chartX + 6 * weekW}
        y={chartY + chartH + 15}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Month 2
      </SvgText>
      <SvgText
        x={chartX + 10 * weekW}
        y={chartY + chartH + 15}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Month 3
      </SvgText>

      {/* Caption */}
      <SvgText
        x={cx}
        y={height - 10}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Figure: Gantt Chart — 12-Week Project Timeline
      </SvgText>
    </Svg>
  );
}
