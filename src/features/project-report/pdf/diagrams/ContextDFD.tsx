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
 * Context Diagram (Level 0 DFD) — Flowgent System
 * Clean star layout. Arrows drawn first, entities on top, labels last.
 * All label positions are explicit to prevent any overlap.
 */
export default function ContextDFD() {
  const width = 495;
  const height = 430;
  const cx = 247;
  const cy = 210;
  const processRx = 68;
  const processRy = 32;

  const entities: {
    label: string;
    sublabel?: string;
    x: number;
    y: number;
    w: number;
    h: number;
    fill: string;
    stroke: string;
  }[] = [
    { label: "User / Admin",     x: 22,  y: 52,  w: 120, h: 40, fill: "#eff6ff", stroke: "#3b82f6" },
    { label: "AI Providers",     x: 353, y: 52,  w: 120, h: 40, fill: "#fef3c7", stroke: "#f59e0b" },
    { label: "Third-Party APIs", x: 368, y: 193, w: 118, h: 38, fill: "#f0fdf4", stroke: "#22c55e" },
    { label: "Database", sublabel: "(PostgreSQL)", x: 325, y: 342, w: 130, h: 44, fill: "#faf5ff", stroke: "#8b5cf6" },
    { label: "Notification", sublabel: "Services",   x: 28,  y: 342, w: 130, h: 44, fill: "#fff1f2", stroke: "#f43f5e" },
  ];

  // Explicit label positions prevent all overlaps.
  // line1/line2 splits long labels across two short lines.
  // arrowOffset: perpendicular shift to separate bidirectional parallel arrows.
  // labelW: width of the white background rect behind the label.
  const flows: {
    from: number;
    to: number;
    line1: string;
    line2: string;
    arrowOffset: number;
    labelX: number;
    labelY: number;
    labelW: number;
  }[] = [
    { from: 0,  to: -1, line1: "Workflow definitions,", line2: "Commands",      arrowOffset: -7, labelX: 182, labelY: 108, labelW: 88 },
    { from: -1, to: 0,  line1: "Dashboard data,",       line2: "Results",       arrowOffset:  7, labelX: 138, labelY: 150, labelW: 74 },
    { from: -1, to: 1,  line1: "AI prompts,",           line2: "Parameters",    arrowOffset: -7, labelX: 313, labelY: 108, labelW: 66 },
    { from: 1,  to: -1, line1: "AI responses,",         line2: "Completions",   arrowOffset:  7, labelX: 358, labelY: 150, labelW: 74 },
    { from: -1, to: 2,  line1: "Integration",           line2: "requests",      arrowOffset:  0, labelX: 330, labelY: 181, labelW: 62 },
    { from: -1, to: 3,  line1: "CRUD operations,",      line2: "Logs",          arrowOffset: -7, labelX: 365, labelY: 281, labelW: 82 },
    { from: 3,  to: -1, line1: "Stored data,",          line2: "Query results", arrowOffset:  7, labelX: 290, labelY: 309, labelW: 74 },
    { from: -1, to: 4,  line1: "Email,",                line2: "Slack alerts",  arrowOffset:  0, labelX: 118, labelY: 293, labelW: 60 },
  ];

  function getEntityCenter(idx: number) {
    const e = entities[idx];
    return { x: e.x + e.w / 2, y: e.y + e.h / 2 };
  }

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* White background */}
      <Rect x={0} y={0} width={width} height={height} fill="white" />

      {/* Title */}
      <SvgText x={cx} y={18} textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#1e293b" }}>
        Context Diagram (Level 0 DFD) — Flowgent System
      </SvgText>

      {/* ── 1. Flow arrows (drawn first so entities cover endpoints cleanly) ── */}
      {flows.map((flow, i) => {
        const fromPt = flow.from === -1 ? { x: cx, y: cy } : getEntityCenter(flow.from);
        const toPt   = flow.to   === -1 ? { x: cx, y: cy } : getEntityCenter(flow.to);
        const angle  = Math.atan2(toPt.y - fromPt.y, toPt.x - fromPt.x);

        let startX: number, startY: number, endX: number, endY: number;
        if (flow.from === -1) {
          startX = cx + Math.cos(angle) * (processRx + 5);
          startY = cy + Math.sin(angle) * (processRy + 5);
          const ent = entities[flow.to];
          endX = toPt.x - Math.cos(angle) * (ent.w / 2 + 5);
          endY = toPt.y - Math.sin(angle) * (ent.h / 2 + 5);
        } else {
          const ent = entities[flow.from];
          startX = fromPt.x + Math.cos(angle) * (ent.w / 2 + 4);
          startY = fromPt.y + Math.sin(angle) * (ent.h / 2 + 4);
          endX = cx - Math.cos(angle) * (processRx + 5);
          endY = cy - Math.sin(angle) * (processRy + 5);
        }

        const perpAngle = angle + Math.PI / 2;
        startX += Math.cos(perpAngle) * flow.arrowOffset;
        startY += Math.sin(perpAngle) * flow.arrowOffset;
        endX   += Math.cos(perpAngle) * flow.arrowOffset;
        endY   += Math.sin(perpAngle) * flow.arrowOffset;

        const as = 5;
        const aAngle = Math.atan2(endY - startY, endX - startX);
        const ax1 = endX - as * Math.cos(aAngle - 0.4);
        const ay1 = endY - as * Math.sin(aAngle - 0.4);
        const ax2 = endX - as * Math.cos(aAngle + 0.4);
        const ay2 = endY - as * Math.sin(aAngle + 0.4);

        return (
          <G key={`flow-${i}`}>
            <Line x1={startX} y1={startY} x2={endX} y2={endY}
              stroke="#64748b" strokeWidth={1.2} />
            <Polygon points={`${endX},${endY} ${ax1},${ay1} ${ax2},${ay2}`}
              fill="#64748b" />
          </G>
        );
      })}

      {/* ── 2. External entities (drawn over arrow lines) ── */}
      {entities.map((entity, i) => (
        <G key={`entity-${i}`}>
          {/* Outer double-border (DFD convention) */}
          <Rect
            x={entity.x - 3} y={entity.y - 3}
            width={entity.w + 6} height={entity.h + 6}
            rx={4} fill="none" stroke={entity.stroke} strokeWidth={0.8} opacity={0.5}
          />
          {/* Main box */}
          <Rect
            x={entity.x} y={entity.y}
            width={entity.w} height={entity.h}
            rx={3} fill={entity.fill} stroke={entity.stroke} strokeWidth={1.5}
          />
          {/* Color accent bar */}
          <Rect x={entity.x} y={entity.y} width={entity.w} height={4} rx={3} fill={entity.stroke} />
          {/* Primary label */}
          <SvgText
            x={entity.x + entity.w / 2}
            y={entity.y + (entity.sublabel ? entity.h / 2 + 2 : entity.h / 2 + 5)}
            textAnchor="middle"
            style={{ fontSize: 8.5, fontFamily: "Times-Bold", fill: "#1f2937" }}
          >
            {entity.label}
          </SvgText>
          {/* Sub-label if present */}
          {entity.sublabel && (
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

      {/* ── 3. Central process — drawn after entities so it sits on top ── */}
      <Ellipse cx={cx} cy={cy} rx={processRx + 4} ry={processRy + 4}
        fill="none" stroke="#1e40af" strokeWidth={0.8} />
      <Ellipse cx={cx} cy={cy} rx={processRx} ry={processRy}
        fill="#2563eb" stroke="#1d4ed8" strokeWidth={2} />
      <SvgText x={cx} y={cy - 4} textAnchor="middle"
        style={{ fontSize: 11, fontFamily: "Times-Bold", fill: "white" }}>
        Flowgent
      </SvgText>
      <SvgText x={cx} y={cy + 11} textAnchor="middle"
        style={{ fontSize: 9, fontFamily: "Times-Roman", fill: "#dbeafe" }}>
        System
      </SvgText>

      {/* ── 4. Flow labels with white background rects — drawn last ── */}
      {flows.map((flow, i) => (
        <G key={`label-${i}`}>
          {/* White pill behind label for crisp readability over any background */}
          <Rect
            x={flow.labelX - flow.labelW / 2}
            y={flow.labelY - 10}
            width={flow.labelW}
            height={22}
            rx={2}
            fill="white"
            opacity={0.92}
          />
          <SvgText x={flow.labelX} y={flow.labelY} textAnchor="middle"
            style={{ fontSize: 6.5, fontFamily: "Times-Italic", fill: "#475569" }}>
            {flow.line1}
          </SvgText>
          <SvgText x={flow.labelX} y={flow.labelY + 10} textAnchor="middle"
            style={{ fontSize: 6.5, fontFamily: "Times-Italic", fill: "#475569" }}>
            {flow.line2}
          </SvgText>
        </G>
      ))}

      {/* Bottom caption */}
      <SvgText x={cx} y={height - 10} textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333" }}>
        Figure: Context Diagram (Level 0 DFD) — Flowgent System
      </SvgText>
    </Svg>
  );
}
