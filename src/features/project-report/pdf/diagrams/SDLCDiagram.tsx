import {
  Svg,
  G,
  Rect,
  Text as SvgText,
  Line,
  Polygon,
} from "@react-pdf/renderer";

/**
 * SDLC Lifecycle Diagram - Linear flow with 6 phases connected by arrows
 * Shows: Requirements → Feasibility → Design → Development → Testing → Deployment
 */
export default function SDLCDiagram() {
  const width = 495;
  const height = 320;

  const phases = [
    { label: "Requirements\nGathering", color: "#2563eb", icon: "1" },
    { label: "Feasibility\nStudy", color: "#7c3aed", icon: "2" },
    { label: "System\nDesign", color: "#0891b2", icon: "3" },
    { label: "Development\n& Coding", color: "#059669", icon: "4" },
    { label: "Testing &\nQA", color: "#d97706", icon: "5" },
    { label: "Deployment\n& Maintenance", color: "#dc2626", icon: "6" },
  ];

  const boxW = 130;
  const boxH = 50;
  const gapX = 25;
  const gapY = 70;
  const startX = 30;
  const startY = 30;

  // 2 rows x 3 columns layout
  const positions = [
    { x: startX, y: startY },
    { x: startX + boxW + gapX, y: startY },
    { x: startX + 2 * (boxW + gapX), y: startY },
    { x: startX + 2 * (boxW + gapX), y: startY + boxH + gapY },
    { x: startX + boxW + gapX, y: startY + boxH + gapY },
    { x: startX, y: startY + boxH + gapY },
  ];

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={width / 2}
        y={height - 15}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333333" }}
      >
        Figure: SDLC Phase Flow — Iterative Model with Feedback Loops
      </SvgText>

      {/* Phase boxes */}
      {phases.map((phase, i) => {
        const pos = positions[i];
        return (
          <G key={i}>
            {/* Shadow */}
            <Rect
              x={pos.x + 2}
              y={pos.y + 2}
              width={boxW}
              height={boxH}
              rx={6}
              fill="#e0e0e0"
            />
            {/* Box */}
            <Rect
              x={pos.x}
              y={pos.y}
              width={boxW}
              height={boxH}
              rx={6}
              fill={phase.color}
              stroke={phase.color}
              strokeWidth={1.5}
            />
            {/* Phase number circle */}
            <Rect
              x={pos.x + 5}
              y={pos.y + 5}
              width={18}
              height={18}
              rx={9}
              fill="white"
              opacity={0.3}
            />
            <SvgText
              x={pos.x + 14}
              y={pos.y + 17}
              textAnchor="middle"
              style={{
                fontSize: 9,
                fontFamily: "Times-Bold",
                fill: "white",
              }}
            >
              {phase.icon}
            </SvgText>
            {/* Label - first line */}
            <SvgText
              x={pos.x + boxW / 2}
              y={pos.y + boxH / 2 - 3}
              textAnchor="middle"
              style={{
                fontSize: 9,
                fontFamily: "Times-Bold",
                fill: "white",
              }}
            >
              {phase.label.split("\n")[0]}
            </SvgText>
            {/* Label - second line */}
            <SvgText
              x={pos.x + boxW / 2}
              y={pos.y + boxH / 2 + 10}
              textAnchor="middle"
              style={{
                fontSize: 9,
                fontFamily: "Times-Bold",
                fill: "white",
              }}
            >
              {phase.label.split("\n")[1]}
            </SvgText>
          </G>
        );
      })}

      {/* Arrows connecting phases */}
      {/* 1→2 (right) */}
      <Line
        x1={positions[0].x + boxW}
        y1={positions[0].y + boxH / 2}
        x2={positions[1].x - 5}
        y2={positions[1].y + boxH / 2}
        stroke="#666666"
        strokeWidth={1.5}
      />
      <Polygon
        points={`${positions[1].x - 5},${positions[1].y + boxH / 2 - 4} ${positions[1].x},${positions[1].y + boxH / 2} ${positions[1].x - 5},${positions[1].y + boxH / 2 + 4}`}
        fill="#666666"
      />

      {/* 2→3 (right) */}
      <Line
        x1={positions[1].x + boxW}
        y1={positions[1].y + boxH / 2}
        x2={positions[2].x - 5}
        y2={positions[2].y + boxH / 2}
        stroke="#666666"
        strokeWidth={1.5}
      />
      <Polygon
        points={`${positions[2].x - 5},${positions[2].y + boxH / 2 - 4} ${positions[2].x},${positions[2].y + boxH / 2} ${positions[2].x - 5},${positions[2].y + boxH / 2 + 4}`}
        fill="#666666"
      />

      {/* 3→4 (down) */}
      <Line
        x1={positions[2].x + boxW / 2}
        y1={positions[2].y + boxH}
        x2={positions[3].x + boxW / 2}
        y2={positions[3].y - 5}
        stroke="#666666"
        strokeWidth={1.5}
      />
      <Polygon
        points={`${positions[3].x + boxW / 2 - 4},${positions[3].y - 5} ${positions[3].x + boxW / 2},${positions[3].y} ${positions[3].x + boxW / 2 + 4},${positions[3].y - 5}`}
        fill="#666666"
      />

      {/* 4→5 (left) */}
      <Line
        x1={positions[3].x}
        y1={positions[3].y + boxH / 2}
        x2={positions[4].x + boxW + 5}
        y2={positions[4].y + boxH / 2}
        stroke="#666666"
        strokeWidth={1.5}
      />
      <Polygon
        points={`${positions[4].x + boxW + 5},${positions[4].y + boxH / 2 - 4} ${positions[4].x + boxW},${positions[4].y + boxH / 2} ${positions[4].x + boxW + 5},${positions[4].y + boxH / 2 + 4}`}
        fill="#666666"
      />

      {/* 5→6 (left) */}
      <Line
        x1={positions[4].x}
        y1={positions[4].y + boxH / 2}
        x2={positions[5].x + boxW + 5}
        y2={positions[5].y + boxH / 2}
        stroke="#666666"
        strokeWidth={1.5}
      />
      <Polygon
        points={`${positions[5].x + boxW + 5},${positions[5].y + boxH / 2 - 4} ${positions[5].x + boxW},${positions[5].y + boxH / 2} ${positions[5].x + boxW + 5},${positions[5].y + boxH / 2 + 4}`}
        fill="#666666"
      />

      {/* Feedback loop arrow (6 back to 1) — curved via dashed line */}
      <Line
        x1={positions[5].x + boxW / 2}
        y1={positions[5].y + boxH}
        x2={positions[5].x + boxW / 2}
        y2={height - 45}
        stroke="#999999"
        strokeWidth={1}
        strokeDasharray="4,3"
      />
      <Line
        x1={positions[5].x + boxW / 2}
        y1={height - 45}
        x2={positions[0].x + boxW / 2}
        y2={height - 45}
        stroke="#999999"
        strokeWidth={1}
        strokeDasharray="4,3"
      />
      <SvgText
        x={width / 2}
        y={height - 48}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Italic", fill: "#999999" }}
      >
        Feedback & Iteration Loop
      </SvgText>

      {/* Deliverables labels under each phase */}
      {[
        "SRS Document",
        "Feasibility Report",
        "DFDs, ER Diagram",
        "Source Code",
        "Test Reports",
        "Live System",
      ].map((label, i) => (
        <SvgText
          key={`del-${i}`}
          x={positions[i].x + boxW / 2}
          y={positions[i].y + boxH + 14}
          textAnchor="middle"
          style={{
            fontSize: 7,
            fontFamily: "Times-Italic",
            fill: "#888888",
          }}
        >
          {label}
        </SvgText>
      ))}
    </Svg>
  );
}
