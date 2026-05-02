import {
  Svg,
  G,
  Rect,
  Text as SvgText,
  Line,
  Polygon,
  Circle,
} from "@react-pdf/renderer";

const phaseNodes = [
  { label: "Requirements", detail: "Gathering", color: "#1d4ed8", icon: "1" },
  { label: "Feasibility", detail: "Study", color: "#0f766e", icon: "2" },
  { label: "Design", detail: "System", color: "#0ea5e9", icon: "3" },
  { label: "Develop", detail: "& Coding", color: "#475569", icon: "4" },
  { label: "Testing", detail: "& QA", color: "#f59e0b", icon: "5" },
  { label: "Deploy", detail: "& Maintain", color: "#ef4444", icon: "6" },
];

function PhaseFlowDiagram() {
  const width = 495;
  const height = 220;
  const boxW = 150;
  const boxH = 48;
  const gapX = 18;
  const gapY = 70;
  const startX = 24;
  const startY = 42;

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
      <SvgText
        x={width / 2}
        y={18}
        textAnchor="middle"
        style={{ fontSize: 10.5, fontFamily: "Times-Bold", fill: "#0f172a" }}
      >
        SDLC Phase Flow
      </SvgText>
      <SvgText
        x={width / 2}
        y={30}
        textAnchor="middle"
        style={{ fontSize: 7.5, fontFamily: "Times-Italic", fill: "#475569" }}
      >
        Six phases arranged as a directional iteration path
      </SvgText>

      {phaseNodes.map((phase, index) => {
        const pos = positions[index];
        return (
          <G key={phase.label}>
            <Rect
              x={pos.x + 2}
              y={pos.y + 2}
              width={boxW}
              height={boxH}
              rx={10}
              fill="#e2e8f0"
            />
            <Rect
              x={pos.x}
              y={pos.y}
              width={boxW}
              height={boxH}
              rx={10}
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth={1}
            />
            <Rect
              x={pos.x}
              y={pos.y}
              width={boxW}
              height={12}
              rx={10}
              fill={phase.color}
            />
            <Rect
              x={pos.x + 10}
              y={pos.y + 16}
              width={24}
              height={24}
              rx={12}
              fill={phase.color}
            />
            <SvgText
              x={pos.x + 22}
              y={pos.y + 32}
              textAnchor="middle"
              style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "white" }}
            >
              {phase.icon}
            </SvgText>
            <SvgText
              x={pos.x + boxW / 2}
              y={pos.y + 34}
              textAnchor="middle"
              style={{
                fontSize: 8.5,
                fontFamily: "Times-Bold",
                fill: "#0f172a",
              }}
            >
              {phase.label}
            </SvgText>
            <SvgText
              x={pos.x + boxW / 2}
              y={pos.y + 44}
              textAnchor="middle"
              style={{
                fontSize: 7.5,
                fontFamily: "Times-Italic",
                fill: "#475569",
              }}
            >
              {phase.detail}
            </SvgText>
          </G>
        );
      })}

      <Line
        x1={positions[0].x + boxW}
        y1={positions[0].y + boxH / 2}
        x2={positions[1].x - 6}
        y2={positions[1].y + boxH / 2}
        stroke="#475569"
        strokeWidth={1.4}
      />
      <Polygon
        points={`${positions[1].x - 6},${positions[1].y + boxH / 2 - 4} ${positions[1].x - 1},${positions[1].y + boxH / 2} ${positions[1].x - 6},${positions[1].y + boxH / 2 + 4}`}
        fill="#475569"
      />
      <Line
        x1={positions[1].x + boxW}
        y1={positions[1].y + boxH / 2}
        x2={positions[2].x - 6}
        y2={positions[2].y + boxH / 2}
        stroke="#475569"
        strokeWidth={1.4}
      />
      <Polygon
        points={`${positions[2].x - 6},${positions[2].y + boxH / 2 - 4} ${positions[2].x - 1},${positions[2].y + boxH / 2} ${positions[2].x - 6},${positions[2].y + boxH / 2 + 4}`}
        fill="#475569"
      />
      <Line
        x1={positions[2].x + boxW / 2}
        y1={positions[2].y + boxH}
        x2={positions[3].x + boxW / 2}
        y2={positions[3].y - 6}
        stroke="#475569"
        strokeWidth={1.4}
      />
      <Polygon
        points={`${positions[3].x + boxW / 2 - 4},${positions[3].y - 6} ${positions[3].x + boxW / 2},${positions[3].y - 1} ${positions[3].x + boxW / 2 + 4},${positions[3].y - 6}`}
        fill="#475569"
      />
      <Line
        x1={positions[3].x}
        y1={positions[3].y + boxH / 2}
        x2={positions[4].x + boxW + 5}
        y2={positions[4].y + boxH / 2}
        stroke="#475569"
        strokeWidth={1.4}
      />
      <Polygon
        points={`${positions[4].x + boxW + 5},${positions[4].y + boxH / 2 - 4} ${positions[4].x + boxW + 1},${positions[4].y + boxH / 2} ${positions[4].x + boxW + 5},${positions[4].y + boxH / 2 + 4}`}
        fill="#475569"
      />
      <Line
        x1={positions[4].x}
        y1={positions[4].y + boxH / 2}
        x2={positions[5].x + boxW + 5}
        y2={positions[5].y + boxH / 2}
        stroke="#475569"
        strokeWidth={1.4}
      />
      <Polygon
        points={`${positions[5].x + boxW + 5},${positions[5].y + boxH / 2 - 4} ${positions[5].x + boxW + 1},${positions[5].y + boxH / 2} ${positions[5].x + boxW + 5},${positions[5].y + boxH / 2 + 4}`}
        fill="#475569"
      />
    </Svg>
  );
}

function DeliverablesDiagram() {
  const width = 495;
  const height = 210;
  const cardW = 118;
  const cardH = 46;
  const startX = 22;
  const startY = 44;
  const gapX = 16;
  const gapY = 16;

  const phaseColors = [
    "#1d4ed8",
    "#0f766e",
    "#0ea5e9",
    "#475569",
    "#f59e0b",
    "#ef4444",
  ];

  const deliverables = [
    "SRS Document",
    "Feasibility Report",
    "DFDs & ER Diagram",
    "Source Code",
    "Test Reports",
    "Production System",
  ];

  const positions = deliverables.map((_, i) => ({
    x: startX + (i % 3) * (cardW + gapX),
    y: startY + Math.floor(i / 3) * (cardH + gapY),
    color: phaseColors[i],
  }));

  const srcCX = positions[0].x + cardW / 2;
  const dstCX = positions[5].x + cardW / 2;
  const row1Bottom = startY + cardH;
  const row2Bottom = startY + cardH + gapY + cardH;
  const arcY = row2Bottom + 18;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <SvgText
        x={width / 2}
        y={18}
        textAnchor="middle"
        style={{ fontSize: 10.5, fontFamily: "Times-Bold", fill: "#0f172a" }}
      >
        Deliverables & Iteration Loop
      </SvgText>
      <SvgText
        x={width / 2}
        y={30}
        textAnchor="middle"
        style={{ fontSize: 7.5, fontFamily: "Times-Italic", fill: "#475569" }}
      >
        Output artifacts mapped to each development phase
      </SvgText>

      {/* Feedback arc rendered first — cards overlap it on top */}
      <Line
        x1={dstCX}
        y1={row2Bottom}
        x2={dstCX}
        y2={arcY}
        stroke="#94a3b8"
        strokeWidth={1.2}
        strokeDasharray="3,2"
      />
      <Line
        x1={srcCX}
        y1={arcY}
        x2={dstCX}
        y2={arcY}
        stroke="#94a3b8"
        strokeWidth={1.2}
        strokeDasharray="3,2"
      />
      <Line
        x1={srcCX}
        y1={arcY}
        x2={srcCX}
        y2={row1Bottom + 8}
        stroke="#94a3b8"
        strokeWidth={1.2}
        strokeDasharray="3,2"
      />
      <Polygon
        points={`${srcCX},${row1Bottom - 1} ${srcCX - 4},${row1Bottom + 7} ${srcCX + 4},${row1Bottom + 7}`}
        fill="#94a3b8"
      />

      {/* Deliverable cards */}
      {deliverables.map((label, i) => {
        const pos = positions[i];
        return (
          <G key={label}>
            <Rect
              x={pos.x + 2}
              y={pos.y + 2}
              width={cardW}
              height={cardH}
              rx={8}
              fill="#e2e8f0"
            />
            <Rect
              x={pos.x}
              y={pos.y}
              width={cardW}
              height={cardH}
              rx={8}
              fill="#ffffff"
              stroke="#e2e8f0"
              strokeWidth={1}
            />
            <Rect
              x={pos.x}
              y={pos.y}
              width={5}
              height={cardH}
              rx={3}
              fill={pos.color}
            />
            <Circle
              cx={pos.x + 18}
              cy={pos.y + cardH / 2}
              r={9}
              fill={pos.color}
            />
            <SvgText
              x={pos.x + 18}
              y={pos.y + cardH / 2 + 3.5}
              textAnchor="middle"
              style={{ fontSize: 8, fontFamily: "Times-Bold", fill: "#ffffff" }}
            >
              {String(i + 1)}
            </SvgText>
            <SvgText
              x={pos.x + 34}
              y={pos.y + cardH / 2 + 4}
              textAnchor="start"
              style={{
                fontSize: 8.5,
                fontFamily: "Times-Bold",
                fill: "#0f172a",
              }}
            >
              {label}
            </SvgText>
          </G>
        );
      })}

      <SvgText
        x={width / 2}
        y={arcY + 15}
        textAnchor="middle"
        style={{ fontSize: 7.5, fontFamily: "Times-Italic", fill: "#64748b" }}
      >
        Delivered outputs cycle back as inputs for future planning
      </SvgText>
    </Svg>
  );
}

export default PhaseFlowDiagram;
export {
  PhaseFlowDiagram as SDLCDiagramPhaseFlow,
  DeliverablesDiagram as SDLCDiagramDeliverables,
};
