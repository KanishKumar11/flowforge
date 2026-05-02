import { Svg, G, Rect, Text as SvgText, Line } from "@react-pdf/renderer";

/**
 * SWOT Analysis Diagram - 2x2 matrix with clear headers
 * Fixed: No center overlap, proper INTERNAL/EXTERNAL column headers
 */
export default function SWOTDiagram() {
  const width = 495;
  const height = 370;
  const cx = width / 2;

  const quadW = 210;
  const quadH = 140;
  const gap = 4;
  const startX = 55;
  const startY = 50;

  const quadrants = [
    {
      title: "STRENGTHS",
      color: "#059669",
      bgColor: "#d1fae5",
      x: startX,
      y: startY,
      items: [
        "Modern technology stack (Next.js 16, React 19)",
        "Visual-first drag-and-drop design",
        "Native AI integration (3 providers)",
        "Cloud-native serverless architecture",
        "Type-safe end-to-end (TypeScript + tRPC)",
        "Self-hosted deployment capability",
      ],
    },
    {
      title: "WEAKNESSES",
      color: "#d97706",
      bgColor: "#fde68a",
      x: startX + quadW + gap,
      y: startY,
      items: [
        "Limited integrations initially (5 services)",
        "No mobile application",
        "Single developer resources",
        "New entrant, no brand recognition",
        "No offline mode support",
      ],
    },
    {
      title: "OPPORTUNITIES",
      color: "#2563eb",
      bgColor: "#bfdbfe",
      x: startX,
      y: startY + quadH + gap,
      items: [
        "Growing automation market ($46B by 2030)",
        "AI adoption rapidly accelerating",
        "SaaS business model potential",
        "API economy growth",
        "Enterprise workflow digitization trend",
      ],
    },
    {
      title: "THREATS",
      color: "#dc2626",
      bgColor: "#fecaca",
      x: startX + quadW + gap,
      y: startY + quadH + gap,
      items: [
        "Established competitors (Zapier, Make, n8n)",
        "Rapid technology changes",
        "API provider pricing changes",
        "Enterprise security requirements",
        "Market saturation risk",
      ],
    },
  ];

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Column headers */}
      <SvgText
        x={startX + quadW / 2}
        y={20}
        textAnchor="middle"
        style={{ fontSize: 8, fontFamily: "Times-Bold", fill: "#666" }}
      >
        INTERNAL
      </SvgText>
      <SvgText
        x={startX + quadW + gap + quadW / 2}
        y={20}
        textAnchor="middle"
        style={{ fontSize: 8, fontFamily: "Times-Bold", fill: "#666" }}
      >
        EXTERNAL
      </SvgText>

      {/* Row labels */}
      <SvgText
        x={startX - 8}
        y={startY + quadH / 2}
        textAnchor="end"
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#059669" }}
      >
        POSITIVE
      </SvgText>
      <SvgText
        x={startX - 8}
        y={startY + quadH + gap + quadH / 2}
        textAnchor="end"
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#dc2626" }}
      >
        NEGATIVE
      </SvgText>

      {/* Separator lines */}
      <Line
        x1={startX}
        y1={30}
        x2={startX + 2 * quadW + gap}
        y2={30}
        stroke="#ddd"
        strokeWidth={0.8}
      />

      {/* Quadrants */}
      {quadrants.map((q, i) => (
        <G key={i}>
          {/* Background (body area below header band) */}
          <Rect
            x={q.x}
            y={q.y}
            width={quadW}
            height={quadH}
            rx={6}
            fill="#ffffff"
            stroke={q.color}
            strokeWidth={2}
          />
          {/* Solid header band */}
          <Rect
            x={q.x}
            y={q.y}
            width={quadW}
            height={24}
            rx={6}
            fill={q.color}
          />
          {/* Header band square-off bottom corners */}
          <Rect x={q.x} y={q.y + 12} width={quadW} height={12} fill={q.color} />
          {/* Title (white text on solid band) */}
          <SvgText
            x={q.x + quadW / 2}
            y={q.y + 16}
            textAnchor="middle"
            style={{
              fontSize: 9.5,
              fontFamily: "Times-Bold",
              fill: "#ffffff",
              letterSpacing: 0.8,
            }}
          >
            {q.title}
          </SvgText>
          {/* Items */}
          {q.items.map((item, j) => (
            <G key={`item-${j}`}>
              <Rect
                x={q.x + 10}
                y={q.y + 30 + j * 18}
                width={6}
                height={6}
                rx={1.5}
                fill={q.color}
              />
              <SvgText
                x={q.x + 22}
                y={q.y + 37 + j * 18}
                style={{
                  fontSize: 7.5,
                  fontFamily: "Times-Roman",
                  fill: "#1a1a1a",
                }}
              >
                {item}
              </SvgText>
            </G>
          ))}
        </G>
      ))}

      {/* Caption */}
      <SvgText
        x={cx}
        y={height - 10}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Figure: SWOT Analysis — Flowgent Project
      </SvgText>
    </Svg>
  );
}
