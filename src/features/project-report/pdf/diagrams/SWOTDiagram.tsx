import { Svg, G, Rect, Text as SvgText, Line } from "@react-pdf/renderer";

/**
 * SWOT Analysis Diagram - 2x2 matrix with clear headers
 * Fixed: No center overlap, proper INTERNAL/EXTERNAL column headers
 */
export default function SWOTDiagram() {
  const width = 495;
  const height = 370;
  const cx = width / 2;

  const quadW = 225;
  const quadH = 140;
  const gap = 4;
  const startX = (width - 2 * quadW - gap) / 2;
  const startY = 50;

  const quadrants = [
    {
      title: "STRENGTHS",
      color: "#059669",
      bgColor: "#f0fdf4",
      x: startX,
      y: startY,
      items: [
        "Modern technology stack (Next.js 16, React 19)",
        "Visual-first drag-and-drop design",
        "Native AI integration (3 providers)",
        "Open-source model, MIT license",
        "Cloud-native serverless architecture",
        "Type-safe end-to-end (TypeScript + tRPC)",
      ],
    },
    {
      title: "WEAKNESSES",
      color: "#d97706",
      bgColor: "#fffbeb",
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
      bgColor: "#eff6ff",
      x: startX,
      y: startY + quadH + gap,
      items: [
        "Growing automation market ($46B by 2030)",
        "AI adoption rapidly accelerating",
        "Open-source community contribution",
        "SaaS business model potential",
        "API economy growth",
      ],
    },
    {
      title: "THREATS",
      color: "#dc2626",
      bgColor: "#fef2f2",
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
        x={startX - 5}
        y={startY + quadH / 2}
        textAnchor="end"
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#059669" }}
      >
        POSITIVE
      </SvgText>
      <SvgText
        x={startX - 5}
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
        strokeWidth={0.5}
      />

      {/* Quadrants */}
      {quadrants.map((q, i) => (
        <G key={i}>
          {/* Background */}
          <Rect
            x={q.x}
            y={q.y}
            width={quadW}
            height={quadH}
            rx={5}
            fill={q.bgColor}
            stroke={q.color}
            strokeWidth={1.5}
          />
          {/* Title */}
          <SvgText
            x={q.x + 10}
            y={q.y + 16}
            style={{
              fontSize: 9,
              fontFamily: "Times-Bold",
              fill: q.color,
            }}
          >
            {q.title}
          </SvgText>
          {/* Divider */}
          <Line
            x1={q.x + 8}
            y1={q.y + 22}
            x2={q.x + quadW - 8}
            y2={q.y + 22}
            stroke={q.color}
            strokeWidth={0.5}
            opacity={0.4}
          />
          {/* Items */}
          {q.items.map((item, j) => (
            <G key={`item-${j}`}>
              <Rect
                x={q.x + 12}
                y={q.y + 29 + j * 17}
                width={5}
                height={5}
                rx={1}
                fill={q.color}
              />
              <SvgText
                x={q.x + 22}
                y={q.y + 34 + j * 17}
                style={{
                  fontSize: 7,
                  fontFamily: "Times-Roman",
                  fill: "#333",
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
