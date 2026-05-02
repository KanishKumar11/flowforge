import { Svg, G, Rect, Text as SvgText, Line, Polygon } from "@react-pdf/renderer";

/**
 * Entity-Relationship Diagram — clean 3-column grid layout.
 *
 * Layout:
 *   Col1 (x=8):   User  | TeamMember | Credential
 *   Col2 (x=178): Team  |     —      | Execution
 *   Col3 (x=348): Workflow | WorkflowVersion | Schedule
 *
 * All relationship lines use explicit orthogonal (right-angle) routing
 * through three designated alleys to eliminate all crossings:
 *   Alley A (x=163): col1–col2 gap  — routes: "has", "stores"
 *   Alley B (x=325): col2–col3 gap  — routes: "owns", "runs"
 *   Alley C (x=493): right margin   — route:  "scheduled"
 *   Top margin (y=10)               — route:  "creates"
 */
export default function ERDiagram() {
  const width = 495;
  const height = 490;
  const cx = width / 2;
  const headerH = 22;
  const attrLineH = 13;

  const entities: {
    name: string;
    x: number;
    y: number;
    w: number;
    color: string;
    attrs: { name: string; type: string; pk?: boolean; fk?: boolean }[];
  }[] = [
    // 0: User — col1, row1
    {
      name: "User", x: 8, y: 22, w: 140, color: "#2563eb",
      attrs: [
        { name: "id", type: "String (cuid)", pk: true },
        { name: "email", type: "String" },
        { name: "name", type: "String" },
        { name: "image", type: "String?" },
        { name: "role", type: "Enum" },
        { name: "createdAt", type: "DateTime" },
      ],
    },
    // 1: Team — col2, row1
    {
      name: "Team", x: 178, y: 22, w: 140, color: "#7c3aed",
      attrs: [
        { name: "id", type: "String (cuid)", pk: true },
        { name: "name", type: "String" },
        { name: "plan", type: "Enum" },
        { name: "createdAt", type: "DateTime" },
      ],
    },
    // 2: TeamMember — col1, row2
    {
      name: "TeamMember", x: 8, y: 175, w: 140, color: "#6366f1",
      attrs: [
        { name: "userId", type: "String (FK)", fk: true },
        { name: "teamId", type: "String (FK)", fk: true },
        { name: "role", type: "Enum" },
        { name: "joinedAt", type: "DateTime" },
      ],
    },
    // 3: Workflow — col3, row1
    {
      name: "Workflow", x: 348, y: 22, w: 140, color: "#059669",
      attrs: [
        { name: "id", type: "String (cuid)", pk: true },
        { name: "name", type: "String" },
        { name: "status", type: "Enum" },
        { name: "teamId", type: "String (FK)", fk: true },
        { name: "creatorId", type: "String (FK)", fk: true },
        { name: "createdAt", type: "DateTime" },
      ],
    },
    // 4: WorkflowVersion — col3, row2
    {
      name: "WorkflowVersion", x: 348, y: 175, w: 140, color: "#0891b2",
      attrs: [
        { name: "id", type: "String (cuid)", pk: true },
        { name: "version", type: "Int" },
        { name: "definition", type: "JSON" },
        { name: "workflowId", type: "String (FK)", fk: true },
        { name: "createdAt", type: "DateTime" },
      ],
    },
    // 5: Execution — col2, row3
    {
      name: "Execution", x: 178, y: 330, w: 140, color: "#d97706",
      attrs: [
        { name: "id", type: "String (cuid)", pk: true },
        { name: "status", type: "Enum" },
        { name: "startedAt", type: "DateTime" },
        { name: "completedAt", type: "DateTime?" },
        { name: "workflowId", type: "String (FK)", fk: true },
        { name: "trigger", type: "Enum" },
      ],
    },
    // 6: Credential — col1, row3
    {
      name: "Credential", x: 8, y: 330, w: 140, color: "#dc2626",
      attrs: [
        { name: "id", type: "String (cuid)", pk: true },
        { name: "name", type: "String" },
        { name: "type", type: "String" },
        { name: "encryptedValue", type: "String" },
        { name: "teamId", type: "String (FK)", fk: true },
      ],
    },
    // 7: Schedule — col3, row3
    {
      name: "Schedule", x: 348, y: 330, w: 140, color: "#be185d",
      attrs: [
        { name: "id", type: "String (cuid)", pk: true },
        { name: "cron", type: "String" },
        { name: "timezone", type: "String" },
        { name: "enabled", type: "Boolean" },
        { name: "workflowId", type: "String (FK)", fk: true },
      ],
    },
  ];

  function getEntityH(entity: (typeof entities)[number]) {
    return headerH + entity.attrs.length * attrLineH + 4;
  }

  // Compute arrowhead polygon string for last segment (x1,y1)→(x2,y2)
  function arrowPts(x1: number, y1: number, x2: number, y2: number, sz = 5) {
    const a = Math.atan2(y2 - y1, x2 - x1);
    const p1x = x2 - sz * Math.cos(a - 0.4);
    const p1y = y2 - sz * Math.sin(a - 0.4);
    const p2x = x2 - sz * Math.cos(a + 0.4);
    const p2y = y2 - sz * Math.sin(a + 0.4);
    return `${x2},${y2} ${p1x},${p1y} ${p2x},${p2y}`;
  }

  /**
   * Explicit orthogonal routes.
   * Each route uses one of three routing alleys to stay fully clear of entity boxes.
   *
   * Entity bottoms:  User=126, Team=100, TM=253, Workflow=126, WV=266, Exec=434, Cred=421, Sched=421
   * Row gaps:        row1–row2: y=126..175  row2–row3: y=266..330
   * Alleys:          A (x=163), B (x=325), C (x=493)
   */
  const routes: {
    id: string;
    pts: [number, number][];
    label: string;
    lx: number; ly: number; labelW: number;
    fromCard: string; fcx: number; fcy: number;
    toCard: string; tcx: number; tcy: number;
  }[] = [
    {
      // User → TeamMember (joins): straight vertical in col1 (row1–row2 gap y=126..175)
      id: "joins",
      pts: [[78, 126], [78, 175]],
      label: "joins", lx: 90, ly: 153, labelW: 28,
      fromCard: "1", fcx: 88, fcy: 130,
      toCard: "N", tcx: 88, tcy: 170,
    },
    {
      // Team → TeamMember (has): via Alley A (x=163), entering TM right edge
      id: "has",
      pts: [[178, 61], [163, 61], [163, 214], [148, 214]],
      label: "has", lx: 148, ly: 138, labelW: 22,
      fromCard: "1", fcx: 174, fcy: 57,
      toCard: "N", tcx: 153, tcy: 210,
    },
    {
      // Team → Workflow (owns): via Alley B L-turn (x=333), entering Workflow left
      id: "owns",
      pts: [[318, 61], [333, 61], [333, 74], [348, 74]],
      label: "owns", lx: 331, ly: 57, labelW: 26,
      fromCard: "1", fcx: 321, fcy: 57,
      toCard: "N", tcx: 345, tcy: 71,
    },
    {
      // Workflow → WorkflowVersion (versions): straight vertical in col3 (row1–row2 gap)
      id: "versions",
      pts: [[418, 126], [418, 175]],
      label: "versions", lx: 432, ly: 153, labelW: 44,
      fromCard: "1", fcx: 430, fcy: 130,
      toCard: "N", tcx: 430, tcy: 169,
    },
    {
      // Workflow → Execution (runs): via Alley B (x=325) down to row2–row3 gap (y=308)
      id: "runs",
      pts: [[348, 90], [325, 90], [325, 308], [248, 308], [248, 330]],
      label: "runs", lx: 287, ly: 305, labelW: 26,
      fromCard: "1", fcx: 342, fcy: 86,
      toCard: "N", tcx: 255, tcy: 325,
    },
    {
      // Team → Credential (stores): col2 bottom → row2–row3 gap (y=262) → col1 down
      id: "stores",
      pts: [[248, 100], [248, 262], [78, 262], [78, 330]],
      label: "stores", lx: 166, ly: 258, labelW: 34,
      fromCard: "1", fcx: 256, fcy: 106,
      toCard: "N", tcx: 85, tcy: 325,
    },
    {
      // Workflow → Schedule (scheduled): via Alley C (x=493, right margin)
      id: "scheduled",
      pts: [[488, 74], [493, 74], [493, 376], [488, 376]],
      label: "scheduled", lx: 452, ly: 305, labelW: 52,
      fromCard: "1", fcx: 487, fcy: 80,
      toCard: "0..1", tcx: 485, tcy: 371,
    },
    {
      // User → Workflow (creates): via top margin (y=10) — above all entities
      id: "creates",
      pts: [[78, 22], [78, 10], [418, 10], [418, 22]],
      label: "creates", lx: 248, ly: 13, labelW: 38,
      fromCard: "1", fcx: 86, fcy: 17,
      toCard: "N", tcx: 410, tcy: 17,
    },
  ];

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* White canvas */}
      <Rect x={0} y={0} width={width} height={height} fill="white" />

      {/* ── 1. Routes drawn first so entity boxes sit cleanly on top ── */}
      {routes.map((r) => {
        const pts = r.pts;
        const n = pts.length;
        const ah = arrowPts(pts[n - 2][0], pts[n - 2][1], pts[n - 1][0], pts[n - 1][1]);
        return (
          <G key={r.id}>
            {/* Multi-segment orthogonal path */}
            {pts.map((pt, i) =>
              i < n - 1 ? (
                <Line
                  key={i}
                  x1={pt[0]} y1={pt[1]}
                  x2={pts[i + 1][0]} y2={pts[i + 1][1]}
                  stroke="#999" strokeWidth={1}
                />
              ) : null
            )}
            {/* Arrowhead at destination */}
            <Polygon points={ah} fill="#999" />
            {/* Label pill with white background */}
            <Rect
              x={r.lx - r.labelW / 2} y={r.ly - 6}
              width={r.labelW} height={12}
              rx={2} fill="white" stroke="#ccc" strokeWidth={0.8}
            />
            <SvgText x={r.lx} y={r.ly + 3} textAnchor="middle"
              style={{ fontSize: 7, fontFamily: "Times-Italic", fill: "#555" }}>
              {r.label}
            </SvgText>
            {/* Cardinality markers — placed outside entity boundary */}
            <SvgText x={r.fcx} y={r.fcy} textAnchor="middle"
              style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#333" }}>
              {r.fromCard}
            </SvgText>
            <SvgText x={r.tcx} y={r.tcy} textAnchor="middle"
              style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#333" }}>
              {r.toCard}
            </SvgText>
          </G>
        );
      })}

      {/* ── 2. Entity boxes drawn over route lines ── */}
      {entities.map((entity, i) => {
        const h = getEntityH(entity);
        return (
          <G key={i}>
            {/* Colored header */}
            <Rect
              x={entity.x} y={entity.y}
              width={entity.w} height={headerH}
              fill={entity.color} rx={3}
            />
            <Rect
              x={entity.x} y={entity.y + headerH - 3}
              width={entity.w} height={3}
              fill={entity.color}
            />
            <SvgText
              x={entity.x + entity.w / 2} y={entity.y + 15}
              textAnchor="middle"
              style={{ fontSize: 8, fontFamily: "Times-Bold", fill: "white" }}
            >
              {entity.name}
            </SvgText>
            {/* Body */}
            <Rect
              x={entity.x} y={entity.y + headerH}
              width={entity.w} height={h - headerH}
              fill="white" stroke={entity.color} strokeWidth={1}
            />
            {/* Column headers */}
            <SvgText
              x={entity.x + 5} y={entity.y + headerH + 10}
              style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#475569" }}
            >
              Field
            </SvgText>
            <SvgText
              x={entity.x + entity.w - 5} y={entity.y + headerH + 10}
              textAnchor="end"
              style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#475569" }}
            >
              Type
            </SvgText>
            <Line
              x1={entity.x + 3} y1={entity.y + headerH + 13}
              x2={entity.x + entity.w - 3} y2={entity.y + headerH + 13}
              stroke="#eee" strokeWidth={0.8}
            />
            {/* Attributes */}
            {entity.attrs.map((attr, j) => (
              <G key={j}>
                <SvgText
                  x={entity.x + 5}
                  y={entity.y + headerH + 23 + j * attrLineH}
                  style={{
                    fontSize: 7,
                    fontFamily: attr.pk ? "Times-Bold" : attr.fk ? "Times-Italic" : "Times-Roman",
                    fill: attr.pk ? entity.color : attr.fk ? "#666" : "#333",
                  }}
                >
                  {attr.pk ? "PK " : attr.fk ? "FK " : ""}{attr.name}
                </SvgText>
                <SvgText
                  x={entity.x + entity.w - 5}
                  y={entity.y + headerH + 23 + j * attrLineH}
                  textAnchor="end"
                  style={{ fontSize: 7, fontFamily: "Times-Italic", fill: "#475569" }}
                >
                  {attr.type}
                </SvgText>
              </G>
            ))}
          </G>
        );
      })}

      {/* ── 3. Legend ── */}
      <Rect x={10} y={height - 44} width={172} height={32} rx={3}
        fill="#f9f9f9" stroke="#ddd" strokeWidth={0.8} />
      <SvgText x={18} y={height - 30}
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#333" }}>
        Legend:
      </SvgText>
      <SvgText x={50} y={height - 30}
        style={{ fontSize: 7, fontFamily: "Times-Roman", fill: "#333" }}>
        PK = Primary Key | FK = Foreign Key
      </SvgText>
      <Line x1={18} y1={height - 18} x2={50} y2={height - 18}
        stroke="#888" strokeWidth={1} />
      <SvgText x={55} y={height - 15}
        style={{ fontSize: 7, fontFamily: "Times-Roman", fill: "#333" }}>
        1 — N Relationship
      </SvgText>
      <SvgText x={122} y={height - 15}
        style={{ fontSize: 7, fontFamily: "Times-Italic", fill: "#475569" }}>
        ? = Nullable
      </SvgText>

      {/* ── 4. Caption ── */}
      <SvgText x={cx} y={height - 4} textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333" }}>
        Figure: Entity-Relationship Diagram — Flowgent Database
      </SvgText>
    </Svg>
  );
}

