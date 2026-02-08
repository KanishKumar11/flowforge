import { Svg, G, Rect, Text as SvgText, Line } from "@react-pdf/renderer";

/**
 * Entity-Relationship Diagram with proper data types
 * Shows 8 entities with attributes, data types, PK/FK indicators
 */
export default function ERDiagram() {
  const width = 495;
  const height = 560;
  const cx = width / 2;

  const headerH = 22;
  const attrLineH = 13;

  // Entity definitions with data types
  const entities = [
    {
      name: "User",
      x: 10,
      y: 20,
      w: 130,
      attrs: [
        { name: "id", type: "String (cuid)", pk: true },
        { name: "email", type: "String", pk: false },
        { name: "name", type: "String", pk: false },
        { name: "image", type: "String?", pk: false },
        { name: "role", type: "Enum", pk: false },
        { name: "createdAt", type: "DateTime", pk: false },
      ],
      color: "#2563eb",
    },
    {
      name: "Team",
      x: 185,
      y: 20,
      w: 125,
      attrs: [
        { name: "id", type: "String (cuid)", pk: true },
        { name: "name", type: "String", pk: false },
        { name: "plan", type: "Enum", pk: false },
        { name: "createdAt", type: "DateTime", pk: false },
      ],
      color: "#7c3aed",
    },
    {
      name: "TeamMember",
      x: 90,
      y: 180,
      w: 130,
      attrs: [
        { name: "userId", type: "String (FK)", pk: false, fk: true },
        { name: "teamId", type: "String (FK)", pk: false, fk: true },
        { name: "role", type: "Enum", pk: false },
        { name: "joinedAt", type: "DateTime", pk: false },
      ],
      color: "#6366f1",
    },
    {
      name: "Workflow",
      x: 360,
      y: 20,
      w: 130,
      attrs: [
        { name: "id", type: "String (cuid)", pk: true },
        { name: "name", type: "String", pk: false },
        { name: "status", type: "Enum", pk: false },
        { name: "teamId", type: "String (FK)", pk: false, fk: true },
        { name: "creatorId", type: "String (FK)", pk: false, fk: true },
        { name: "createdAt", type: "DateTime", pk: false },
      ],
      color: "#059669",
    },
    {
      name: "WorkflowVersion",
      x: 350,
      y: 195,
      w: 140,
      attrs: [
        { name: "id", type: "String (cuid)", pk: true },
        { name: "version", type: "Int", pk: false },
        { name: "definition", type: "JSON", pk: false },
        { name: "workflowId", type: "String (FK)", pk: false, fk: true },
        { name: "createdAt", type: "DateTime", pk: false },
      ],
      color: "#0891b2",
    },
    {
      name: "Execution",
      x: 185,
      y: 335,
      w: 135,
      attrs: [
        { name: "id", type: "String (cuid)", pk: true },
        { name: "status", type: "Enum", pk: false },
        { name: "startedAt", type: "DateTime", pk: false },
        { name: "completedAt", type: "DateTime?", pk: false },
        { name: "workflowId", type: "String (FK)", pk: false, fk: true },
        { name: "trigger", type: "Enum", pk: false },
      ],
      color: "#d97706",
    },
    {
      name: "Credential",
      x: 10,
      y: 335,
      w: 135,
      attrs: [
        { name: "id", type: "String (cuid)", pk: true },
        { name: "name", type: "String", pk: false },
        { name: "type", type: "String", pk: false },
        { name: "encryptedValue", type: "String", pk: false },
        { name: "teamId", type: "String (FK)", pk: false, fk: true },
      ],
      color: "#dc2626",
    },
    {
      name: "Schedule",
      x: 360,
      y: 370,
      w: 130,
      attrs: [
        { name: "id", type: "String (cuid)", pk: true },
        { name: "cron", type: "String", pk: false },
        { name: "timezone", type: "String", pk: false },
        { name: "enabled", type: "Boolean", pk: false },
        { name: "workflowId", type: "String (FK)", pk: false, fk: true },
      ],
      color: "#be185d",
    },
  ];

  function getEntityH(entity: (typeof entities)[number]) {
    return headerH + entity.attrs.length * attrLineH + 4;
  }

  // Relationships
  const relationships: {
    from: number;
    to: number;
    label: string;
    fromCard: string;
    toCard: string;
  }[] = [
    { from: 0, to: 2, label: "joins", fromCard: "1", toCard: "N" },
    { from: 1, to: 2, label: "has", fromCard: "1", toCard: "N" },
    { from: 1, to: 3, label: "owns", fromCard: "1", toCard: "N" },
    { from: 3, to: 4, label: "versions", fromCard: "1", toCard: "N" },
    { from: 3, to: 5, label: "runs", fromCard: "1", toCard: "N" },
    { from: 1, to: 6, label: "stores", fromCard: "1", toCard: "N" },
    { from: 3, to: 7, label: "scheduled", fromCard: "1", toCard: "0..1" },
    { from: 0, to: 3, label: "creates", fromCard: "1", toCard: "N" },
  ];

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Entity boxes */}
      {entities.map((entity, i) => {
        const h = getEntityH(entity);
        return (
          <G key={i}>
            {/* Header */}
            <Rect
              x={entity.x}
              y={entity.y}
              width={entity.w}
              height={headerH}
              fill={entity.color}
              rx={3}
            />
            <Rect
              x={entity.x}
              y={entity.y + headerH - 3}
              width={entity.w}
              height={3}
              fill={entity.color}
            />
            <SvgText
              x={entity.x + entity.w / 2}
              y={entity.y + 15}
              textAnchor="middle"
              style={{
                fontSize: 8,
                fontFamily: "Times-Bold",
                fill: "white",
              }}
            >
              {entity.name}
            </SvgText>
            {/* Body */}
            <Rect
              x={entity.x}
              y={entity.y + headerH}
              width={entity.w}
              height={h - headerH}
              fill="white"
              stroke={entity.color}
              strokeWidth={1}
            />
            {/* Column headers */}
            <SvgText
              x={entity.x + 5}
              y={entity.y + headerH + 10}
              style={{
                fontSize: 5,
                fontFamily: "Times-Bold",
                fill: "#999",
              }}
            >
              Field
            </SvgText>
            <SvgText
              x={entity.x + entity.w - 5}
              y={entity.y + headerH + 10}
              textAnchor="end"
              style={{
                fontSize: 5,
                fontFamily: "Times-Bold",
                fill: "#999",
              }}
            >
              Type
            </SvgText>
            <Line
              x1={entity.x + 3}
              y1={entity.y + headerH + 13}
              x2={entity.x + entity.w - 3}
              y2={entity.y + headerH + 13}
              stroke="#eee"
              strokeWidth={0.5}
            />
            {/* Attributes */}
            {entity.attrs.map((attr, j) => (
              <G key={`attr-${j}`}>
                <SvgText
                  x={entity.x + 5}
                  y={entity.y + headerH + 23 + j * attrLineH}
                  style={{
                    fontSize: 6,
                    fontFamily: attr.pk
                      ? "Times-Bold"
                      : "fk" in attr && attr.fk
                        ? "Times-Italic"
                        : "Times-Roman",
                    fill: attr.pk
                      ? entity.color
                      : "fk" in attr && attr.fk
                        ? "#666"
                        : "#333",
                  }}
                >
                  {attr.pk ? "PK " : "fk" in attr && attr.fk ? "FK " : ""}
                  {attr.name}
                </SvgText>
                <SvgText
                  x={entity.x + entity.w - 5}
                  y={entity.y + headerH + 23 + j * attrLineH}
                  textAnchor="end"
                  style={{
                    fontSize: 5.5,
                    fontFamily: "Times-Italic",
                    fill: "#888",
                  }}
                >
                  {attr.type}
                </SvgText>
              </G>
            ))}
          </G>
        );
      })}

      {/* Relationships */}
      {relationships.map((rel, i) => {
        const fe = entities[rel.from];
        const te = entities[rel.to];
        const fh = getEntityH(fe);
        const th = getEntityH(te);
        const fx = fe.x + fe.w / 2;
        const fy = fe.y + fh / 2;
        const tx = te.x + te.w / 2;
        const ty = te.y + th / 2;

        const angle = Math.atan2(ty - fy, tx - fx);
        const sx = fe.x + fe.w / 2 + Math.cos(angle) * (fe.w / 2);
        const sy = fe.y + fh / 2 + Math.sin(angle) * (fh / 2);
        const ex = te.x + te.w / 2 - Math.cos(angle) * (te.w / 2);
        const ey = te.y + th / 2 - Math.sin(angle) * (th / 2);

        const midX = (sx + ex) / 2;
        const midY = (sy + ey) / 2;

        return (
          <G key={`rel-${i}`}>
            <Line
              x1={sx}
              y1={sy}
              x2={ex}
              y2={ey}
              stroke="#888"
              strokeWidth={1}
            />
            {/* Label */}
            <Rect
              x={midX - 20}
              y={midY - 6}
              width={40}
              height={11}
              rx={2}
              fill="white"
              stroke="#ddd"
              strokeWidth={0.5}
            />
            <SvgText
              x={midX}
              y={midY + 2}
              textAnchor="middle"
              style={{
                fontSize: 5.5,
                fontFamily: "Times-Italic",
                fill: "#666",
              }}
            >
              {rel.label}
            </SvgText>
            {/* Cardinality */}
            <SvgText
              x={sx + Math.cos(angle) * 12}
              y={sy + Math.sin(angle) * 12 - 3}
              textAnchor="middle"
              style={{
                fontSize: 6,
                fontFamily: "Times-Bold",
                fill: "#333",
              }}
            >
              {rel.fromCard}
            </SvgText>
            <SvgText
              x={ex - Math.cos(angle) * 12}
              y={ey - Math.sin(angle) * 12 - 3}
              textAnchor="middle"
              style={{
                fontSize: 6,
                fontFamily: "Times-Bold",
                fill: "#333",
              }}
            >
              {rel.toCard}
            </SvgText>
          </G>
        );
      })}

      {/* Legend */}
      <Rect
        x={10}
        y={height - 48}
        width={170}
        height={36}
        rx={3}
        fill="#f9f9f9"
        stroke="#ddd"
        strokeWidth={0.5}
      />
      <SvgText
        x={18}
        y={height - 34}
        style={{ fontSize: 6, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Legend:
      </SvgText>
      <SvgText
        x={50}
        y={height - 34}
        style={{ fontSize: 6, fontFamily: "Times-Roman", fill: "#333" }}
      >
        PK = Primary Key | FK = Foreign Key
      </SvgText>
      <Line
        x1={18}
        y1={height - 22}
        x2={50}
        y2={height - 22}
        stroke="#888"
        strokeWidth={1}
      />
      <SvgText
        x={55}
        y={height - 19}
        style={{ fontSize: 6, fontFamily: "Times-Roman", fill: "#333" }}
      >
        1 — N Relationship
      </SvgText>
      <SvgText
        x={120}
        y={height - 19}
        style={{ fontSize: 6, fontFamily: "Times-Italic", fill: "#888" }}
      >
        ? = Nullable
      </SvgText>

      {/* Caption */}
      <SvgText
        x={cx}
        y={height - 5}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Figure: Entity-Relationship Diagram — Flowgent Database
      </SvgText>
    </Svg>
  );
}
