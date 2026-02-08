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
 * Fixed: Removed "0.0" label, better spacing, no overlapping labels
 */
export default function ContextDFD() {
  const width = 495;
  const height = 380;
  const cx = width / 2;
  const cy = 175;

  const processRx = 70;
  const processRy = 32;

  // External entities positioned symmetrically
  const entities = [
    { label: "User / Admin", x: 30, y: 30, w: 100, h: 32 },
    { label: "AI Providers", x: 365, y: 30, w: 100, h: 32 },
    { label: "Third-Party APIs", x: 370, y: 180, w: 100, h: 32 },
    { label: "Database (PostgreSQL)", x: 340, y: 300, w: 130, h: 32 },
    { label: "Notification Services", x: 25, y: 300, w: 120, h: 32 },
  ];

  // Data flows with carefully positioned labels avoiding overlaps
  const flows: {
    from: number;
    to: number;
    label: string;
    lx: number;
    ly: number;
  }[] = [
    {
      from: 0,
      to: -1,
      label: "Workflow definitions, Commands",
      lx: 125,
      ly: 85,
    },
    { from: -1, to: 0, label: "Dashboard data, Results", lx: 68, ly: 150 },
    { from: -1, to: 1, label: "AI prompts, Parameters", lx: 380, ly: 90 },
    { from: 1, to: -1, label: "AI responses, Completions", lx: 400, ly: 130 },
    { from: -1, to: 2, label: "Integration requests", lx: 410, ly: 210 },
    { from: -1, to: 3, label: "CRUD operations, Logs", lx: 375, ly: 265 },
    { from: 3, to: -1, label: "Stored data, Query results", lx: 290, ly: 310 },
    { from: -1, to: 4, label: "Email, Slack alerts", lx: 85, ly: 265 },
  ];

  function getEntityCenter(idx: number) {
    const e = entities[idx];
    return { x: e.x + e.w / 2, y: e.y + e.h / 2 };
  }

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Central process */}
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
        y={cy - 4}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "white" }}
      >
        Flowgent
      </SvgText>
      <SvgText
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        style={{ fontSize: 9, fontFamily: "Times-Bold", fill: "white" }}
      >
        System
      </SvgText>

      {/* External entities */}
      {entities.map((entity, i) => (
        <G key={i}>
          <Rect
            x={entity.x}
            y={entity.y}
            width={entity.w}
            height={entity.h}
            fill="white"
            stroke="#333"
            strokeWidth={1.5}
          />
          <Line
            x1={entity.x}
            y1={entity.y + 3}
            x2={entity.x + entity.w}
            y2={entity.y + 3}
            stroke="#333"
            strokeWidth={0.5}
          />
          <SvgText
            x={entity.x + entity.w / 2}
            y={entity.y + entity.h / 2 + 5}
            textAnchor="middle"
            style={{
              fontSize: 8,
              fontFamily: "Times-Bold",
              fill: "#333",
            }}
          >
            {entity.label}
          </SvgText>
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
          startX = cx + Math.cos(angle) * processRx;
          startY = cy + Math.sin(angle) * processRy;
          endX = toPt.x - Math.cos(angle) * (entities[flow.to].w / 2 + 4);
          endY = toPt.y - Math.sin(angle) * (entities[flow.to].h / 2 + 4);
        } else if (flow.to === -1) {
          startX = fromPt.x + Math.cos(angle) * (entities[flow.from].w / 2 + 2);
          startY = fromPt.y + Math.sin(angle) * (entities[flow.from].h / 2 + 2);
          endX = cx - Math.cos(angle) * (processRx + 4);
          endY = cy - Math.sin(angle) * (processRy + 4);
        } else {
          startX = fromPt.x;
          startY = fromPt.y;
          endX = toPt.x;
          endY = toPt.y;
        }

        const as = 5;
        const aAngle = Math.atan2(endY - startY, endX - startX);
        const ax1 = endX - as * Math.cos(aAngle - 0.4);
        const ay1 = endY - as * Math.sin(aAngle - 0.4);
        const ax2 = endX - as * Math.cos(aAngle + 0.4);
        const ay2 = endY - as * Math.sin(aAngle + 0.4);

        return (
          <G key={`flow-${i}`}>
            <Line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="#666"
              strokeWidth={1.2}
            />
            <Polygon
              points={`${endX},${endY} ${ax1},${ay1} ${ax2},${ay2}`}
              fill="#666"
            />
            <SvgText
              x={flow.lx}
              y={flow.ly}
              textAnchor="middle"
              style={{
                fontSize: 6.5,
                fontFamily: "Times-Italic",
                fill: "#555",
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
