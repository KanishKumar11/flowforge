/**
 * Technology Stack Layered Diagram
 * Shows the full-stack architecture layers with technologies
 * For Chapter 1 (Introduction)
 */
import {
  Svg,
  G,
  Rect,
  Text as SvgText,
  Line,
  Polygon,
} from "@react-pdf/renderer";

export default function TechStackDiagram() {
  const width = 495;
  const height = 400;

  const colors = {
    text: "#1a1a1a",
    label: "#555555",
    // Layer colors
    frontend: "#1565C0",
    frontendBg: "#E3F2FD",
    backend: "#2E7D32",
    backendBg: "#E8F5E9",
    database: "#6A1B9A",
    databaseBg: "#F3E5F5",
    infra: "#E65100",
    infraBg: "#FFF3E0",
    devtools: "#00695C",
    devtoolsBg: "#E0F2F1",
    arrow: "#888888",
  };

  const layerX = 30;
  const layerW = 435;
  const layerH = 52;
  const layerGap = 12;
  const startY = 45;

  const layers = [
    {
      name: "Presentation Layer",
      color: colors.frontend,
      bg: colors.frontendBg,
      techs: [
        { name: "Next.js 16", desc: "App Router" },
        { name: "React 19", desc: "UI Library" },
        { name: "React Flow", desc: "Node Editor" },
        { name: "Tailwind CSS", desc: "Styling" },
        { name: "Shadcn/ui", desc: "Components" },
      ],
    },
    {
      name: "Application Layer",
      color: colors.backend,
      bg: colors.backendBg,
      techs: [
        { name: "tRPC v11", desc: "Type-safe API" },
        { name: "Better Auth", desc: "Authentication" },
        { name: "Inngest", desc: "Background Jobs" },
        { name: "Zod", desc: "Validation" },
      ],
    },
    {
      name: "Data Layer",
      color: colors.database,
      bg: colors.databaseBg,
      techs: [
        { name: "PostgreSQL", desc: "Primary DB" },
        { name: "Prisma ORM", desc: "Data Access" },
        { name: "Prisma Pulse", desc: "Real-time" },
      ],
    },
    {
      name: "Infrastructure Layer",
      color: colors.infra,
      bg: colors.infraBg,
      techs: [
        { name: "Vercel", desc: "Hosting" },
        { name: "Sentry", desc: "Monitoring" },
        { name: "GitHub", desc: "Version Control" },
        { name: "Netlify", desc: "Alt Deploy" },
      ],
    },
    {
      name: "Development Tools",
      color: colors.devtools,
      bg: colors.devtoolsBg,
      techs: [
        { name: "TypeScript", desc: "Language" },
        { name: "Vitest", desc: "Testing" },
        { name: "Biome", desc: "Lint & Format" },
        { name: "VS Code", desc: "IDE" },
      ],
    },
  ];

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={width / 2}
        y={18}
        textAnchor="middle"
        style={{ fontSize: 11, fontFamily: "Times-Bold", fill: colors.text }}
      >
        Technology Stack — Layered Architecture
      </SvgText>

      {/* Subtitle */}
      <SvgText
        x={width / 2}
        y={32}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Italic", fill: colors.label }}
      >
        Full-stack architecture with modern open-source technologies
      </SvgText>

      {/* Layers */}
      {layers.map((layer, i) => {
        const y = startY + i * (layerH + layerGap);
        const techW = (layerW - 90) / layer.techs.length;

        return (
          <G key={`layer-${i}`}>
            {/* Layer background */}
            <Rect
              x={layerX}
              y={y}
              width={layerW}
              height={layerH}
              rx={5}
              fill={layer.bg}
              stroke={layer.color}
              strokeWidth={1.2}
            />

            {/* Layer label (left side) */}
            <Rect
              x={layerX}
              y={y}
              width={80}
              height={layerH}
              rx={5}
              fill={layer.color}
            />
            {/* Cover right corners */}
            <Rect
              x={layerX + 70}
              y={y}
              width={10}
              height={layerH}
              fill={layer.color}
            />

            <SvgText
              x={layerX + 40}
              y={y + layerH / 2 - 5}
              textAnchor="middle"
              style={{
                fontSize: 7.5,
                fontFamily: "Times-Bold",
                fill: "#FFFFFF",
              }}
            >
              {layer.name.split(" ")[0]}
            </SvgText>
            <SvgText
              x={layerX + 40}
              y={y + layerH / 2 + 6}
              textAnchor="middle"
              style={{
                fontSize: 7.5,
                fontFamily: "Times-Bold",
                fill: "#FFFFFF",
              }}
            >
              {layer.name.split(" ")[1]}
            </SvgText>

            {/* Technology items */}
            {layer.techs.map((tech, j) => {
              const tx = layerX + 90 + j * techW;
              const tw = techW - 6;
              return (
                <G key={`tech-${i}-${j}`}>
                  <Rect
                    x={tx}
                    y={y + 6}
                    width={tw}
                    height={layerH - 12}
                    rx={4}
                    fill="#FFFFFF"
                    stroke={layer.color}
                    strokeWidth={0.8}
                    opacity={0.9}
                  />
                  <SvgText
                    x={tx + tw / 2}
                    y={y + 23}
                    textAnchor="middle"
                    style={{
                      fontSize: 8,
                      fontFamily: "Times-Bold",
                      fill: colors.text,
                    }}
                  >
                    {tech.name}
                  </SvgText>
                  <SvgText
                    x={tx + tw / 2}
                    y={y + 35}
                    textAnchor="middle"
                    style={{
                      fontSize: 7,
                      fontFamily: "Times-Roman",
                      fill: colors.label,
                    }}
                  >
                    {tech.desc}
                  </SvgText>
                </G>
              );
            })}

            {/* Down arrow between layers */}
            {i < layers.length - 1 && (
              <G>
                <Line
                  x1={width / 2}
                  y1={y + layerH}
                  x2={width / 2}
                  y2={y + layerH + layerGap - 2}
                  stroke={colors.arrow}
                  strokeWidth={1}
                />
                <Polygon
                  points={`${width / 2},${y + layerH + layerGap} ${width / 2 - 3},${y + layerH + layerGap - 5} ${width / 2 + 3},${y + layerH + layerGap - 5}`}
                  fill={colors.arrow}
                />
              </G>
            )}
          </G>
        );
      })}

      {/* Bottom legend */}
      <G>
        <Rect
          x={30}
          y={height - 30}
          width={435}
          height={22}
          rx={4}
          fill="#FAFAFA"
          stroke="#E0E0E0"
          strokeWidth={0.8}
        />
        {[
          { label: "Frontend", color: colors.frontend, x: 50 },
          { label: "Backend", color: colors.backend, x: 140 },
          { label: "Database", color: colors.database, x: 220 },
          { label: "Infrastructure", color: colors.infra, x: 310 },
          { label: "Dev Tools", color: colors.devtools, x: 418 },
        ].map((item) => (
          <G key={item.label}>
            <Rect
              x={item.x - 12}
              y={height - 24}
              width={10}
              height={10}
              rx={2}
              fill={item.color}
            />
            <SvgText
              x={item.x + 2}
              y={height - 15}
              style={{
                fontSize: 7,
                fontFamily: "Times-Roman",
                fill: colors.label,
              }}
            >
              {item.label}
            </SvgText>
          </G>
        ))}
      </G>
    </Svg>
  );
}
