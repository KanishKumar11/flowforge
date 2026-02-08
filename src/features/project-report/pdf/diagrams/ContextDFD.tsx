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
 * Context Diagram (Level 0 DFD) - Flowgent System
 * Redesigned with better visual hierarchy, colored entities, and clear flow labels
 */
export default function ContextDFD() {
  const width = 495;
  const height = 400;
  const cx = width / 2;
  const cy = 190;

  const processRx = 75;
  const processRy = 35;

  // External entities with colors and positioned in a star pattern around centre
  const entities = [
    {
      label: "User / Admin",
      x: 40,
      y: 40,
      w: 110,
      h: 36,
      fill: "#eff6ff",
      stroke: "#3b82f6",
    },
    {
      label: "AI Providers",
      x: 345,
      y: 40,
      w: 110,
      h: 36,
      fill: "#fef3c7",
      stroke: "#f59e0b",
    },
    {
      label: "Third-Party APIs",
      x: 370,
      y: 190,
      w: 110,
      h: 36,
      fill: "#f0fdf4",
      stroke: "#22c55e",
    },
    {
      label: "Database",
      sublabel: "(PostgreSQL)",
      x: 320,
      y: 320,
      w: 120,
      h: 42,
      fill: "#faf5ff",
      stroke: "#8b5cf6",
    },
    {
      label: "Notification",
      sublabel: "Services",
      x: 45,
      y: 320,
      w: 120,
      h: 42,
      fill: "#fff1f2",
      stroke: "#f43f5e",
    },
  ];

  // Data flows: from/to = entity index, -1 = central process
  const flows: {
    from: number;
    to: number;
    label: string;
    offset?: number;
  }[] = [
    { from: 0, to: -1, label: "Workflow definitions, Commands", offset: -8 },
    { from: -1, to: 0, label: "Dashboard data, Results", offset: 8 },
    { from: -1, to: 1, label: "AI prompts, Parameters", offset: -8 },
    { from: 1, to: -1, label: "AI responses, Completions", offset: 8 },
    { from: -1, to: 2, label: "Integration requests", offset: 0 },
    { from: -1, to: 3, label: "CRUD operations, Logs", offset: -8 },
    { from: 3, to: -1, label: "Stored data, Query results", offset: 8 },
    { from: -1, to: 4, label: "Email, Slack alerts", offset: 0 },
  ];

  function getEntityCenter(idx: number) {
    const e = entities[idx];
    return { x: e.x + e.w / 2, y: e.y + e.h / 2 };
  }

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={cx}
        y={16}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Context Diagram (Level 0 DFD) — Flowgent System
      </SvgText>

      {/* Central process — double ellipse per DFD convention */}
      <Ellipse
        cx={cx}
        cy={cy}
        rx={processRx + 4}
        ry={processRy + 4}
        fill="none"
        stroke="#1e40af"
        strokeWidth={1}
      />
      <Ellipse
        cx={cx}
        cy={cy}
        rx={processRx}
        ry={processRy}
        fill="#2563eb"
        stroke="#1d4ed8"
        strokeWidth={2}
      />
      <SvgText
        x={cx}
        y={cy - 5}
        textAnchor="middle"
        style={{ fontSize: 11, fontFamily: "Times-Bold", fill: "white" }}
      >
        Flowgent
      </SvgText>
      <SvgText
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        style={{ fontSize: 9, fontFamily: "Times-Roman", fill: "#dbeafe" }}
      >
        System
      </SvgText>

      {/* External entities — double-bordered rectangles with colored fills */}
      {entities.map((entity, i) => (
        <G key={`entity-${i}`}>
          {/* Outer border (DFD double-border convention) */}
          <Rect
            x={entity.x - 3}
            y={entity.y - 3}
            width={entity.w + 6}
            height={entity.h + 6}
            rx={4}
            fill="none"
            stroke={entity.stroke}
            strokeWidth={0.8}
            opacity={0.5}
          />
          {/* Inner box */}
          <Rect
            x={entity.x}
            y={entity.y}
            width={entity.w}
            height={entity.h}
            rx={3}
            fill={entity.fill}
            stroke={entity.stroke}
            strokeWidth={1.5}
          />
          {/* Color accent bar at top */}
          <Rect
            x={entity.x}
            y={entity.y}
            width={entity.w}
            height={4}
            rx={3}
            fill={entity.stroke}
          />
          {/* Main label */}
          <SvgText
            x={entity.x + entity.w / 2}
            y={
              entity.y +
              ("sublabel" in entity && entity.sublabel
                ? entity.h / 2 + 2
                : entity.h / 2 + 6)
            }
            textAnchor="middle"
            style={{
              fontSize: 8.5,
              fontFamily: "Times-Bold",
              fill: "#1f2937",
            }}
          >
            {entity.label}
          </SvgText>
          {/* Sub-label if present */}
          {"sublabel" in entity && entity.sublabel && (
            <SvgText
              x={entity.x + entity.w / 2}
              y={entity.y + entity.h / 2 + 14}
              textAnchor="middle"
              style={{
                fontSize: 7,
                fontFamily: "Times-Roman",
                fill: "#6b7280",
              }}
            >
              {entity.sublabel}
            </SvgText>
          )}
        </G>
      ))}

      {/* Data flow arrows */}
      {flows.map((flow, i) => {
        const fromPt =
          flow.from === -1 ? { x: cx, y: cy } : getEntityCenter(flow.from);
        const toPt =
          flow.to === -1 ? { x: cx, y: cy } : getEntityCenter(flow.to);

        const angle = Math.atan2(toPt.y - fromPt.y, toPt.x - fromPt.x);

        let startX: number, startY: number, endX: number, endY: number;

        if (flow.from === -1) {
          // From central process to entity
          startX = cx + Math.cos(angle) * (processRx + 6);
          startY = cy + Math.sin(angle) * (processRy + 6);
          endX = toPt.x - Math.cos(angle) * (entities[flow.to].w / 2 + 6);
          endY = toPt.y - Math.sin(angle) * (entities[flow.to].h / 2 + 6);
        } else {
          // From entity to central process
          startX = fromPt.x + Math.cos(angle) * (entities[flow.from].w / 2 + 4);
          startY = fromPt.y + Math.sin(angle) * (entities[flow.from].h / 2 + 4);
          endX = cx - Math.cos(angle) * (processRx + 6);
          endY = cy - Math.sin(angle) * (processRy + 6);
        }

        // Offset perpendicular to flow direction for parallel flows
        const perpAngle = angle + Math.PI / 2;
        const off = flow.offset || 0;
        startX += Math.cos(perpAngle) * off;
        startY += Math.sin(perpAngle) * off;
        endX += Math.cos(perpAngle) * off;
        endY += Math.sin(perpAngle) * off;

        // Arrowhead
        const as = 5;
        const aAngle = Math.atan2(endY - startY, endX - startX);
        const ax1 = endX - as * Math.cos(aAngle - 0.4);
        const ay1 = endY - as * Math.sin(aAngle - 0.4);
        const ax2 = endX - as * Math.cos(aAngle + 0.4);
        const ay2 = endY - as * Math.sin(aAngle + 0.4);

        // Label position at midpoint
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        // Offset label away from line
        const labelOff = 10;
        const labelX = midX + Math.cos(perpAngle) * labelOff;
        const labelY = midY + Math.sin(perpAngle) * labelOff;

        return (
          <G key={`flow-${i}`}>
            <Line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="#64748b"
              strokeWidth={1.2}
            />
            <Polygon
              points={`${endX},${endY} ${ax1},${ay1} ${ax2},${ay2}`}
              fill="#64748b"
            />
            <SvgText
              x={labelX}
              y={labelY}
              textAnchor="middle"
              style={{
                fontSize: 6,
                fontFamily: "Times-Italic",
                fill: "#475569",
              }}
            >
              {flow.label}
            </SvgText>
          </G>
        );
      })}

      {/* Caption */}
      <SvgText
        x={cx}
        y={height - 10}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Figure: Context Diagram (Level 0 DFD) — Flowgent System
      </SvgText>
    </Svg>
  );
}
