import {
  Svg,
  G,
  Rect,
  Text as SvgText,
  Line,
  Polygon,
  Ellipse,
} from "@react-pdf/renderer";

/**
 * Agile Sprint Cycle Diagram - Circular process
 * Fixed: No overlapping arrows/labels, clear flow direction
 */
export default function AgileSprintDiagram() {
  const width = 495;
  const height = 340;
  const cx = width / 2;

  const stages = [
    { label: "Product\nBacklog", x: 40, y: 40, w: 85, h: 42, color: "#6366f1" },
    {
      label: "Sprint\nPlanning",
      x: 190,
      y: 30,
      w: 85,
      h: 42,
      color: "#2563eb",
    },
    {
      label: "Sprint\n(2 Weeks)",
      x: 360,
      y: 55,
      w: 95,
      h: 48,
      color: "#059669",
    },
    { label: "Daily\nStandup", x: 375, y: 160, w: 80, h: 40, color: "#0891b2" },
    { label: "Sprint\nReview", x: 260, y: 240, w: 85, h: 42, color: "#d97706" },
    { label: "Sprint\nRetro", x: 100, y: 240, w: 85, h: 42, color: "#dc2626" },
  ];

  // Manually define arrow start/end points to avoid overlap
  const arrows = [
    // Backlog → Planning
    { x1: 125, y1: 55, x2: 188, y2: 48 },
    // Planning → Sprint
    { x1: 275, y1: 48, x2: 358, y2: 72 },
    // Sprint → Standup
    { x1: 415, y1: 103, x2: 415, y2: 158 },
    // Standup → Review
    { x1: 375, y1: 195, x2: 345, y2: 245 },
    // Review → Retro
    { x1: 260, y1: 260, x2: 185, y2: 260 },
    // Retro → Backlog (loop back)
    { x1: 100, y1: 248, x2: 65, y2: 82 },
  ];

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Center SCRUM label */}
      <Ellipse
        cx={cx - 10}
        cy={155}
        rx={50}
        ry={26}
        fill="#f0f4ff"
        stroke="#6366f1"
        strokeWidth={1}
      />
      <SvgText
        x={cx - 10}
        y={151}
        textAnchor="middle"
        style={{ fontSize: 9, fontFamily: "Times-Bold", fill: "#6366f1" }}
      >
        SCRUM
      </SvgText>
      <SvgText
        x={cx - 10}
        y={163}
        textAnchor="middle"
        style={{ fontSize: 7.5, fontFamily: "Times-Roman", fill: "#6366f1" }}
      >
        Framework
      </SvgText>

      {/* Stage boxes */}
      {stages.map((stage, i) => (
        <G key={i}>
          <Rect
            x={stage.x + 2}
            y={stage.y + 2}
            width={stage.w}
            height={stage.h}
            rx={5}
            fill="#e0e0e0"
          />
          <Rect
            x={stage.x}
            y={stage.y}
            width={stage.w}
            height={stage.h}
            rx={5}
            fill={stage.color}
          />
          <SvgText
            x={stage.x + stage.w / 2}
            y={stage.y + stage.h / 2 - 4}
            textAnchor="middle"
            style={{ fontSize: 8.5, fontFamily: "Times-Bold", fill: "white" }}
          >
            {stage.label.split("\n")[0]}
          </SvgText>
          <SvgText
            x={stage.x + stage.w / 2}
            y={stage.y + stage.h / 2 + 8}
            textAnchor="middle"
            style={{ fontSize: 8.5, fontFamily: "Times-Bold", fill: "white" }}
          >
            {stage.label.split("\n")[1]}
          </SvgText>
        </G>
      ))}

      {/* Arrows */}
      {arrows.map((a, i) => {
        const angle = Math.atan2(a.y2 - a.y1, a.x2 - a.x1);
        const as = 5;
        const ax1 = a.x2 - as * Math.cos(angle - 0.4);
        const ay1 = a.y2 - as * Math.sin(angle - 0.4);
        const ax2 = a.x2 - as * Math.cos(angle + 0.4);
        const ay2 = a.y2 - as * Math.sin(angle + 0.4);
        return (
          <G key={`arrow-${i}`}>
            <Line
              x1={a.x1}
              y1={a.y1}
              x2={a.x2}
              y2={a.y2}
              stroke="#666"
              strokeWidth={1.5}
            />
            <Polygon
              points={`${a.x2},${a.y2} ${ax1},${ay1} ${ax2},${ay2}`}
              fill="#666"
            />
          </G>
        );
      })}

      {/* Increment output box */}
      <Rect
        x={365}
        y={118}
        width={68}
        height={20}
        rx={3}
        fill="#f0fdf4"
        stroke="#059669"
        strokeWidth={0.5}
      />
      <SvgText
        x={399}
        y={131}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#059669" }}
      >
        Increment
      </SvgText>

      {/* Artifact labels */}
      <SvgText
        x={82}
        y={95}
        textAnchor="middle"
        style={{ fontSize: 6.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Prioritized Items
      </SvgText>
      <SvgText
        x={410}
        y={148}
        textAnchor="middle"
        style={{ fontSize: 6.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Working Software
      </SvgText>
      <SvgText
        x={302}
        y={295}
        textAnchor="middle"
        style={{ fontSize: 6.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Feedback
      </SvgText>
      <SvgText
        x={142}
        y={295}
        textAnchor="middle"
        style={{ fontSize: 6.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Improvements
      </SvgText>

      {/* Caption */}
      <SvgText
        x={cx}
        y={height - 10}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Figure: Agile Scrum Sprint Cycle
      </SvgText>
    </Svg>
  );
}
