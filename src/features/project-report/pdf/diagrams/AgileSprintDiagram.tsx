import {
  Svg,
  G,
  Rect,
  Text as SvgText,
  Line,
  Polygon,
  Circle,
} from "@react-pdf/renderer";

/**
 * Agile Sprint Cycle Diagram — Circular wheel layout
 * 6 phase nodes on a ring, consistent phase colors, clean arrowheads
 */
export default function AgileSprintDiagram() {
  const width = 495;
  const height = 340;
  const cx = width / 2;
  const cy = height / 2 + 8;
  const ringR = 120;
  const nodeW = 84;
  const nodeH = 38;

  const phases = [
    {
      label: "Product",
      sub: "Backlog",
      color: "#1d4ed8",
      note: "Prioritised items",
    },
    {
      label: "Sprint",
      sub: "Planning",
      color: "#0f766e",
      note: "Selected stories",
    },
    {
      label: "Sprint",
      sub: "2-Week Run",
      color: "#0369a1",
      note: "Working increment",
    },
    { label: "Daily", sub: "Standup", color: "#0891b2", note: "15-min sync" },
    {
      label: "Sprint",
      sub: "Review",
      color: "#d97706",
      note: "Demo & feedback",
    },
    { label: "Sprint", sub: "Retro", color: "#dc2626", note: "Improvements" },
  ];

  // Evenly space 6 nodes on ring; start at top-left (210 deg) so flow is clockwise
  const startAngleDeg = 210;
  const nodePositions = phases.map((_, i) => {
    const deg = startAngleDeg + i * 60;
    const rad = (deg * Math.PI) / 180;
    return {
      cx: cx + ringR * Math.cos(rad),
      cy: cy + ringR * Math.sin(rad),
      angle: deg,
    };
  });

  // Arrow between consecutive nodes (chord, offset by node half-size)
  function arrowBetween(fromIdx: number, toIdx: number) {
    const from = nodePositions[fromIdx];
    const to = nodePositions[toIdx];
    const dx = to.cx - from.cx;
    const dy = to.cy - from.cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / dist;
    const uy = dy / dist;
    const x1 = from.cx + ux * 46;
    const y1 = from.cy + uy * 22;
    const x2 = to.cx - ux * 46;
    const y2 = to.cy - uy * 22;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const as = 5;
    const ax1 = x2 - as * Math.cos(angle - 0.4);
    const ay1 = y2 - as * Math.sin(angle - 0.4);
    const ax2 = x2 - as * Math.cos(angle + 0.4);
    const ay2 = y2 - as * Math.sin(angle + 0.4);
    return { x1, y1, x2, y2, ax1, ay1, ax2, ay2 };
  }

  const arrows = phases.map((_, i) => arrowBetween(i, (i + 1) % phases.length));

  // Note label position: pushed radially outward from node centre
  const notePositions = nodePositions.map((pos) => {
    const rad = (pos.angle * Math.PI) / 180;
    return {
      x: cx + (ringR + 54) * Math.cos(rad),
      y: cy + (ringR + 54) * Math.sin(rad),
    };
  });

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={cx}
        y={14}
        textAnchor="middle"
        style={{ fontSize: 10.5, fontFamily: "Times-Bold", fill: "#0f172a" }}
      >
        Agile Scrum Sprint Cycle
      </SvgText>
      <SvgText
        x={cx}
        y={26}
        textAnchor="middle"
        style={{ fontSize: 7.5, fontFamily: "Times-Italic", fill: "#475569" }}
      >
        Six ceremonies arranged as a continuous clockwise iteration loop
      </SvgText>

      {/* Ring guide — subtle track */}
      <Circle
        cx={cx}
        cy={cy}
        r={ringR}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={1.5}
        strokeDasharray="4,3"
      />

      {/* Hub */}
      <Circle
        cx={cx}
        cy={cy}
        r={38}
        fill="#f8fafc"
        stroke="#e2e8f0"
        strokeWidth={1.5}
      />
      <Circle cx={cx} cy={cy} r={34} fill="#1d4ed8" />
      <SvgText
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#ffffff" }}
      >
        SCRUM
      </SvgText>
      <SvgText
        x={cx}
        y={cy + 7}
        textAnchor="middle"
        style={{ fontSize: 7.5, fontFamily: "Times-Italic", fill: "#bfdbfe" }}
      >
        Framework
      </SvgText>

      {/* Arrows (rendered before nodes so nodes overlap arrow tips cleanly) */}
      {arrows.map((a, i) => (
        <G key={`arrow-${i}`}>
          <Line
            x1={a.x1}
            y1={a.y1}
            x2={a.x2}
            y2={a.y2}
            stroke="#94a3b8"
            strokeWidth={1.4}
          />
          <Polygon
            points={`${a.x2},${a.y2} ${a.ax1},${a.ay1} ${a.ax2},${a.ay2}`}
            fill="#94a3b8"
          />
        </G>
      ))}

      {/* Phase nodes */}
      {phases.map((phase, i) => {
        const pos = nodePositions[i];
        const nx = pos.cx - nodeW / 2;
        const ny = pos.cy - nodeH / 2;
        return (
          <G key={`node-${i}`}>
            {/* Drop shadow */}
            <Rect
              x={nx + 2}
              y={ny + 2}
              width={nodeW}
              height={nodeH}
              rx={8}
              fill="#e2e8f0"
            />
            {/* Card */}
            <Rect
              x={nx}
              y={ny}
              width={nodeW}
              height={nodeH}
              rx={8}
              fill="#ffffff"
              stroke="#e2e8f0"
              strokeWidth={1}
            />
            {/* Colour top bar */}
            <Rect
              x={nx}
              y={ny}
              width={nodeW}
              height={10}
              rx={8}
              fill={phase.color}
            />
            <Rect
              x={nx}
              y={ny + 5}
              width={nodeW}
              height={5}
              fill={phase.color}
            />
            {/* Step number badge */}
            <Circle cx={nx + 11} cy={ny + 24} r={8} fill={phase.color} />
            <SvgText
              x={nx + 11}
              y={ny + 27}
              textAnchor="middle"
              style={{
                fontSize: 7.5,
                fontFamily: "Times-Bold",
                fill: "#ffffff",
              }}
            >
              {String(i + 1)}
            </SvgText>
            {/* Labels */}
            <SvgText
              x={nx + nodeW / 2 + 4}
              y={ny + 22}
              textAnchor="middle"
              style={{ fontSize: 8, fontFamily: "Times-Bold", fill: "#0f172a" }}
            >
              {phase.label}
            </SvgText>
            <SvgText
              x={nx + nodeW / 2 + 4}
              y={ny + 32}
              textAnchor="middle"
              style={{
                fontSize: 7,
                fontFamily: "Times-Italic",
                fill: "#475569",
              }}
            >
              {phase.sub}
            </SvgText>
          </G>
        );
      })}

      {/* Outer note labels */}
      {phases.map((phase, i) => (
        <SvgText
          key={`note-${i}`}
          x={notePositions[i].x}
          y={notePositions[i].y}
          textAnchor="middle"
          style={{ fontSize: 6.5, fontFamily: "Times-Italic", fill: "#64748b" }}
        >
          {phase.note}
        </SvgText>
      ))}
    </Svg>
  );
}
