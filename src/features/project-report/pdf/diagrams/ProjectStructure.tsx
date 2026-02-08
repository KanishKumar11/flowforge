import { Svg, G, Rect, Text as SvgText, Line } from "@react-pdf/renderer";

/**
 * Project Module Structure (Bond/Tree diagram)
 * Shows hierarchical decomposition of the Flowgent system
 */
export default function ProjectStructure() {
  const width = 495;
  const height = 380;
  const cx = width / 2;

  // Tree node helper
  const nodeW = 85;
  const nodeH = 28;

  // Root
  const root = {
    label: "Flowgent 1.0",
    x: cx - nodeW / 2,
    y: 20,
    color: "#1e293b",
  };

  // Level 1 modules
  const l1 = [
    { label: "Frontend", x: 15, y: 85, color: "#2563eb" },
    { label: "API Layer", x: 120, y: 85, color: "#0891b2" },
    { label: "Business\nLogic", x: 225, y: 85, color: "#059669" },
    { label: "Execution\nEngine", x: 330, y: 85, color: "#7c3aed" },
    { label: "Data\nLayer", x: 420, y: 85, color: "#d97706" },
  ];

  // Level 2 sub-modules
  const l2: {
    label: string;
    x: number;
    y: number;
    parentIdx: number;
    color: string;
  }[] = [
    // Frontend children
    {
      label: "React Flow\nCanvas",
      x: 0,
      y: 170,
      parentIdx: 0,
      color: "#3b82f6",
    },
    { label: "Dashboard\nUI", x: 0, y: 220, parentIdx: 0, color: "#3b82f6" },
    { label: "Auth\nPages", x: 0, y: 270, parentIdx: 0, color: "#3b82f6" },
    // API children
    { label: "tRPC\nRouters", x: 105, y: 170, parentIdx: 1, color: "#06b6d4" },
    {
      label: "REST\nEndpoints",
      x: 105,
      y: 220,
      parentIdx: 1,
      color: "#06b6d4",
    },
    {
      label: "Auth\nMiddleware",
      x: 105,
      y: 270,
      parentIdx: 1,
      color: "#06b6d4",
    },
    // Business children
    {
      label: "Workflow\nManager",
      x: 210,
      y: 170,
      parentIdx: 2,
      color: "#10b981",
    },
    { label: "Team\nManager", x: 210, y: 220, parentIdx: 2, color: "#10b981" },
    {
      label: "Credential\nVault",
      x: 210,
      y: 270,
      parentIdx: 2,
      color: "#10b981",
    },
    // Execution children
    {
      label: "Inngest\nFunctions",
      x: 315,
      y: 170,
      parentIdx: 3,
      color: "#8b5cf6",
    },
    { label: "Node\nExecutor", x: 315, y: 220, parentIdx: 3, color: "#8b5cf6" },
    { label: "AI\nProvider", x: 315, y: 270, parentIdx: 3, color: "#8b5cf6" },
    // Data children
    { label: "Prisma\nORM", x: 420, y: 170, parentIdx: 4, color: "#f59e0b" },
    {
      label: "PostgreSQL\n(Neon)",
      x: 420,
      y: 220,
      parentIdx: 4,
      color: "#f59e0b",
    },
  ];

  function renderNode(
    label: string,
    x: number,
    y: number,
    color: string,
    w = 75,
    h = 28,
  ) {
    const lines = label.split("\n");
    return (
      <G>
        <Rect x={x} y={y} width={w} height={h} rx={4} fill={color} />
        {lines.length === 1 ? (
          <SvgText
            x={x + w / 2}
            y={y + h / 2 + 3}
            textAnchor="middle"
            style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "white" }}
          >
            {label}
          </SvgText>
        ) : (
          <>
            <SvgText
              x={x + w / 2}
              y={y + h / 2 - 3}
              textAnchor="middle"
              style={{ fontSize: 6.5, fontFamily: "Times-Bold", fill: "white" }}
            >
              {lines[0]}
            </SvgText>
            <SvgText
              x={x + w / 2}
              y={y + h / 2 + 8}
              textAnchor="middle"
              style={{ fontSize: 6.5, fontFamily: "Times-Bold", fill: "white" }}
            >
              {lines[1]}
            </SvgText>
          </>
        )}
      </G>
    );
  }

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Root node */}
      {renderNode(root.label, root.x, root.y, root.color, nodeW + 15, 30)}

      {/* Root to L1 connections */}
      {l1.map((node, i) => (
        <G key={`l1-conn-${i}`}>
          <Line
            x1={root.x + (nodeW + 15) / 2}
            y1={root.y + 30}
            x2={node.x + 75 / 2}
            y2={node.y}
            stroke="#999"
            strokeWidth={1}
          />
        </G>
      ))}

      {/* Level 1 nodes */}
      {l1.map((node, i) => (
        <G key={`l1-${i}`}>
          {renderNode(node.label, node.x, node.y, node.color)}
        </G>
      ))}

      {/* L1 to L2 connections */}
      {l2.map((node, i) => {
        const parent = l1[node.parentIdx];
        return (
          <Line
            key={`l2-conn-${i}`}
            x1={parent.x + 75 / 2}
            y1={parent.y + nodeH}
            x2={node.x + 75 / 2}
            y2={node.y}
            stroke="#ccc"
            strokeWidth={0.8}
          />
        );
      })}

      {/* Level 2 nodes */}
      {l2.map((node, i) => (
        <G key={`l2-${i}`}>
          {renderNode(node.label, node.x, node.y, node.color, 75, 32)}
        </G>
      ))}

      {/* Module count summary */}
      <Rect
        x={15}
        y={height - 55}
        width={width - 30}
        height={22}
        rx={4}
        fill="#f1f5f9"
        stroke="#cbd5e1"
        strokeWidth={0.5}
      />
      <SvgText
        x={cx}
        y={height - 40}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Roman", fill: "#555" }}
      >
        5 Core Modules | 14 Sub-modules | 24 Node Types | 59 tRPC Procedures |
        14 Database Models
      </SvgText>

      {/* Caption */}
      <SvgText
        x={cx}
        y={height - 10}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Figure: Project Module Structure — Hierarchical Decomposition
      </SvgText>
    </Svg>
  );
}
