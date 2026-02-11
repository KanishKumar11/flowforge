/**
 * SDLC Effort Pie Chart
 * Pie chart showing percentage effort allocation across SDLC phases
 * For Chapter 6 (Software Development Life Cycle)
 */
import {
  Svg,
  G,
  Rect,
  Text as SvgText,
  Path,
  Circle,
} from "@react-pdf/renderer";

export default function SDLCEffortPieChart() {
  const width = 495;
  const height = 300;

  const colors = {
    text: "#1a1a1a",
    label: "#333333",
  };

  const phases = [
    { name: "Requirements", pct: 8, weeks: 1, color: "#1565C0" },
    { name: "Feasibility", pct: 8, weeks: 1, color: "#1976D2" },
    { name: "Design", pct: 17, weeks: 2, color: "#2196F3" },
    { name: "Development", pct: 50, weeks: 6, color: "#0D47A1" },
    { name: "Testing", pct: 8, weeks: 1, color: "#42A5F5" },
    { name: "Deployment", pct: 9, weeks: 1, color: "#64B5F6" },
  ];

  const centerX = 200;
  const centerY = 165;
  const radius = 110;
  const innerRadius = 50; // Donut hole

  // Convert percentages to SVG arc paths
  const createArcPath = (
    startAngle: number,
    endAngle: number,
    r: number,
    ir: number,
  ) => {
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    const x1 = centerX + r * Math.cos(startRad);
    const y1 = centerY + r * Math.sin(startRad);
    const x2 = centerX + r * Math.cos(endRad);
    const y2 = centerY + r * Math.sin(endRad);

    const ix1 = centerX + ir * Math.cos(endRad);
    const iy1 = centerY + ir * Math.sin(endRad);
    const ix2 = centerX + ir * Math.cos(startRad);
    const iy2 = centerY + ir * Math.sin(startRad);

    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${ir} ${ir} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;
  };

  let currentAngle = 0;

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
        SDLC Phase Effort Allocation
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
        Total Duration: 12 Weeks (Jan 6 – Mar 15, 2026)
      </SvgText>

      {/* Pie segments */}
      {phases.map((phase, i) => {
        const startAngle = currentAngle;
        const sliceAngle = (phase.pct / 100) * 360;
        currentAngle += sliceAngle;
        const endAngle = currentAngle;

        const midAngle = ((startAngle + endAngle) / 2 - 90) * (Math.PI / 180);
        const labelR = radius + 20;
        const labelX = centerX + labelR * Math.cos(midAngle);
        const labelY = centerY + labelR * Math.sin(midAngle);

        return (
          <G key={`slice-${i}`}>
            <Path
              d={createArcPath(startAngle, endAngle, radius, innerRadius)}
              fill={phase.color}
              stroke="#FFFFFF"
              strokeWidth={2}
            />
            {/* Percentage on large slice */}
            {phase.pct >= 10 && (
              <SvgText
                x={centerX + ((radius + innerRadius) / 2) * Math.cos(midAngle)}
                y={
                  centerY +
                  ((radius + innerRadius) / 2) * Math.sin(midAngle) +
                  3
                }
                textAnchor="middle"
                style={{
                  fontSize: 9,
                  fontFamily: "Times-Bold",
                  fill: "#FFFFFF",
                }}
              >
                {phase.pct}%
              </SvgText>
            )}
          </G>
        );
      })}

      {/* Center label */}
      <Circle cx={centerX} cy={centerY} r={innerRadius - 2} fill="#FFFFFF" />
      <SvgText
        x={centerX}
        y={centerY - 4}
        textAnchor="middle"
        style={{
          fontSize: 10,
          fontFamily: "Times-Bold",
          fill: colors.text,
        }}
      >
        12
      </SvgText>
      <SvgText
        x={centerX}
        y={centerY + 10}
        textAnchor="middle"
        style={{
          fontSize: 8,
          fontFamily: "Times-Roman",
          fill: "#555555",
        }}
      >
        Weeks
      </SvgText>

      {/* Legend */}
      {phases.map((phase, i) => {
        const lx = 360;
        const ly = 60 + i * 36;
        return (
          <G key={`legend-${i}`}>
            <Rect
              x={lx}
              y={ly}
              width={14}
              height={14}
              rx={2}
              fill={phase.color}
            />
            <SvgText
              x={lx + 20}
              y={ly + 10}
              style={{
                fontSize: 8,
                fontFamily: "Times-Bold",
                fill: colors.text,
              }}
            >
              {phase.name}
            </SvgText>
            <SvgText
              x={lx + 20}
              y={ly + 22}
              style={{
                fontSize: 7,
                fontFamily: "Times-Roman",
                fill: "#555555",
              }}
            >
              {phase.weeks} week{phase.weeks > 1 ? "s" : ""} ({phase.pct}%)
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}
