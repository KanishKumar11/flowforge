import {
  Svg,
  G,
  Rect,
  Text as SvgText,
  Line,
  Ellipse,
} from "@react-pdf/renderer";

/**
 * UML Use Case Diagram
 * Fixed: Proper spacing, no overlapping labels, clear grouping
 */
export default function UseCaseDiagram() {
  const width = 495;
  const height = 520;

  function renderActor(x: number, y: number, label: string) {
    return (
      <G>
        <Ellipse
          cx={x}
          cy={y}
          rx={7}
          ry={7}
          fill="none"
          stroke="#333"
          strokeWidth={1.2}
        />
        <Line
          x1={x}
          y1={y + 7}
          x2={x}
          y2={y + 26}
          stroke="#333"
          strokeWidth={1.2}
        />
        <Line
          x1={x - 11}
          y1={y + 15}
          x2={x + 11}
          y2={y + 15}
          stroke="#333"
          strokeWidth={1.2}
        />
        <Line
          x1={x}
          y1={y + 26}
          x2={x - 9}
          y2={y + 38}
          stroke="#333"
          strokeWidth={1.2}
        />
        <Line
          x1={x}
          y1={y + 26}
          x2={x + 9}
          y2={y + 38}
          stroke="#333"
          strokeWidth={1.2}
        />
        <SvgText
          x={x}
          y={y + 52}
          textAnchor="middle"
          style={{ fontSize: 8, fontFamily: "Times-Bold", fill: "#333" }}
        >
          {label}
        </SvgText>
      </G>
    );
  }

  // Use cases organized by group with proper vertical spacing
  const useCases = [
    // Auth (y: 55-90)
    { label: "Login", x: 230, y: 55 },
    { label: "Manage Profile", x: 230, y: 90 },
    // Workflows (y: 135-255)
    { label: "Create Workflow", x: 260, y: 135 },
    { label: "Edit Workflow (Canvas)", x: 260, y: 170 },
    { label: "Delete Workflow", x: 260, y: 205 },
    { label: "Version Control", x: 260, y: 240 },
    // Execution (y: 285-355)
    { label: "Run Workflow", x: 280, y: 285 },
    { label: "View Execution Logs", x: 280, y: 320 },
    { label: "Schedule Execution", x: 280, y: 355 },
    // Teams (y: 400-470)
    { label: "Manage Team", x: 230, y: 400 },
    { label: "Assign Roles (RBAC)", x: 230, y: 435 },
    { label: "Manage Credentials", x: 260, y: 470 },
  ];

  const ucRx = 72;
  const ucRy = 13;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* System boundary */}
      <Rect
        x={145}
        y={20}
        width={240}
        height={480}
        rx={8}
        fill="#f8faff"
        stroke="#2563eb"
        strokeWidth={1.5}
        strokeDasharray="6,3"
      />
      <SvgText
        x={265}
        y={36}
        textAnchor="middle"
        style={{ fontSize: 9, fontFamily: "Times-Bold", fill: "#2563eb" }}
      >
        Flowgent System
      </SvgText>

      {/* Actors */}
      {renderActor(55, 130, "User")}
      {renderActor(55, 360, "Team Admin")}
      {renderActor(440, 300, "System")}

      {/* Use case ovals */}
      {useCases.map((uc, i) => (
        <G key={i}>
          <Ellipse
            cx={uc.x}
            cy={uc.y}
            rx={ucRx}
            ry={ucRy}
            fill="white"
            stroke="#333"
            strokeWidth={1}
          />
          <SvgText
            x={uc.x}
            y={uc.y + 4}
            textAnchor="middle"
            style={{ fontSize: 7, fontFamily: "Times-Roman", fill: "#333" }}
          >
            {uc.label}
          </SvgText>
        </G>
      ))}

      {/* User connections (lines to left edge of use cases) */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 11].map((idx) => (
        <Line
          key={`u-${idx}`}
          x1={75}
          y1={160}
          x2={useCases[idx].x - ucRx}
          y2={useCases[idx].y}
          stroke="#aaa"
          strokeWidth={0.6}
        />
      ))}

      {/* Team Admin connections */}
      {[9, 10, 2, 3, 4, 6, 7, 8, 11].map((idx) => (
        <Line
          key={`a-${idx}`}
          x1={75}
          y1={390}
          x2={useCases[idx].x - ucRx}
          y2={useCases[idx].y}
          stroke="#aaa"
          strokeWidth={0.6}
        />
      ))}

      {/* System connections */}
      {[6, 7, 8].map((idx) => (
        <Line
          key={`s-${idx}`}
          x1={425}
          y1={330}
          x2={useCases[idx].x + ucRx}
          y2={useCases[idx].y}
          stroke="#aaa"
          strokeWidth={0.6}
        />
      ))}

      {/* Stereotypes */}
      <Line
        x1={260}
        y1={148}
        x2={260}
        y2={157}
        stroke="#666"
        strokeWidth={0.8}
        strokeDasharray="3,2"
      />
      <SvgText
        x={305}
        y={155}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#666" }}
      >
        {"<<include>>"}
      </SvgText>

      <Line
        x1={280}
        y1={298}
        x2={280}
        y2={307}
        stroke="#666"
        strokeWidth={0.8}
        strokeDasharray="3,2"
      />
      <SvgText
        x={325}
        y={305}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#666" }}
      >
        {"<<include>>"}
      </SvgText>

      <Line
        x1={230}
        y1={413}
        x2={230}
        y2={422}
        stroke="#666"
        strokeWidth={0.8}
        strokeDasharray="3,2"
      />
      <SvgText
        x={275}
        y={420}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#666" }}
      >
        {"<<extend>>"}
      </SvgText>

      {/* Group labels - positioned in top-left corner of each group */}
      <Rect x={150} y={42} width={65} height={13} rx={2} fill="#e0f2fe" />
      <SvgText
        x={182}
        y={52}
        textAnchor="middle"
        style={{ fontSize: 6, fontFamily: "Times-Bold", fill: "#0369a1" }}
      >
        Authentication
      </SvgText>

      <Rect x={150} y={122} width={55} height={13} rx={2} fill="#f0fdf4" />
      <SvgText
        x={177}
        y={132}
        textAnchor="middle"
        style={{ fontSize: 6, fontFamily: "Times-Bold", fill: "#059669" }}
      >
        Workflows
      </SvgText>

      <Rect x={150} y={272} width={50} height={13} rx={2} fill="#fef9c3" />
      <SvgText
        x={175}
        y={282}
        textAnchor="middle"
        style={{ fontSize: 6, fontFamily: "Times-Bold", fill: "#a16207" }}
      >
        Execution
      </SvgText>

      <Rect x={150} y={388} width={48} height={13} rx={2} fill="#fef2f2" />
      <SvgText
        x={174}
        y={398}
        textAnchor="middle"
        style={{ fontSize: 6, fontFamily: "Times-Bold", fill: "#dc2626" }}
      >
        Teams
      </SvgText>
    </Svg>
  );
}
