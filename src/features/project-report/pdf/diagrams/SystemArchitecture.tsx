import {
  Svg,
  G,
  Rect,
  Text as SvgText,
  Line,
  Polygon,
  Circle,
  Ellipse,
} from "@react-pdf/renderer";

/**
 * System Architecture Overview — Conceptual data flow
 * Shows how users interact with Flowgent's three core subsystems
 * and external service integrations
 */
export default function SystemArchitecture() {
  const width = 495;
  const height = 400;

  const colors = {
    text: "#1a1a1a",
    label: "#555555",
    user: "#1565C0",
    userBg: "#E3F2FD",
    design: "#2E7D32",
    designBg: "#E8F5E9",
    execute: "#E65100",
    executeBg: "#FFF3E0",
    monitor: "#6A1B9A",
    monitorBg: "#F3E5F5",
    integrate: "#00695C",
    integrateBg: "#E0F2F1",
    arrow: "#888888",
    core: "#1565C0",
    coreBg: "#F0F7FF",
  };

  const arrow = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
  ) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len;
    const uy = dy / len;
    const px = -uy;
    const py = ux;
    const tipX = x2;
    const tipY = y2;
    const baseX = x2 - ux * 6;
    const baseY = y2 - uy * 6;
    return (
      <G>
        <Line
          x1={x1}
          y1={y1}
          x2={x2 - ux * 3}
          y2={y2 - uy * 3}
          stroke={color}
          strokeWidth={1.2}
        />
        <Polygon
          points={`${tipX},${tipY} ${baseX + px * 3},${baseY + py * 3} ${baseX - px * 3},${baseY - py * 3}`}
          fill={color}
        />
      </G>
    );
  };

  // Core platform box
  const coreX = 130;
  const coreY = 110;
  const coreW = 235;
  const coreH = 200;

  // Three subsystem boxes inside core
  const subW = 195;
  const subH = 50;
  const subX = coreX + 20;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={width / 2}
        y={18}
        textAnchor="middle"
        style={{ fontSize: 11, fontFamily: "Times-Bold", fill: colors.text }}
      >
        System Architecture Overview
      </SvgText>
      <SvgText
        x={width / 2}
        y={32}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Italic", fill: colors.label }}
      >
        Conceptual data flow between users, platform subsystems, and external
        services
      </SvgText>

      {/* User actor (left) */}
      <Circle
        cx={55}
        cy={85}
        r={12}
        fill={colors.userBg}
        stroke={colors.user}
        strokeWidth={1.2}
      />
      <SvgText
        x={55}
        y={89}
        textAnchor="middle"
        style={{ fontSize: 8, fontFamily: "Times-Bold", fill: colors.user }}
      >
        U
      </SvgText>
      <SvgText
        x={55}
        y={108}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: colors.user }}
      >
        User
      </SvgText>
      <SvgText
        x={55}
        y={118}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
      >
        Developer /
      </SvgText>
      <SvgText
        x={55}
        y={126}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
      >
        Citizen Dev
      </SvgText>

      {/* Arrow: User → Core */}
      {arrow(78, 90, coreX - 2, 145, colors.user)}
      <SvgText
        x={100}
        y={108}
        style={{ fontSize: 7, fontFamily: "Times-Italic", fill: colors.label }}
      >
        Build &
      </SvgText>
      <SvgText
        x={100}
        y={116}
        style={{ fontSize: 7, fontFamily: "Times-Italic", fill: colors.label }}
      >
        Trigger
      </SvgText>

      {/* Core platform boundary */}
      <Rect
        x={coreX}
        y={coreY}
        width={coreW}
        height={coreH}
        rx={8}
        fill={colors.coreBg}
        stroke={colors.core}
        strokeWidth={1.5}
        strokeDasharray="6,3"
      />
      <SvgText
        x={coreX + coreW / 2}
        y={coreY + 14}
        textAnchor="middle"
        style={{ fontSize: 9, fontFamily: "Times-Bold", fill: colors.core }}
      >
        Flowgent Platform (Next.js + tRPC)
      </SvgText>

      {/* Subsystem 1: Visual Editor */}
      <Rect
        x={subX}
        y={coreY + 22}
        width={subW}
        height={subH}
        rx={5}
        fill={colors.designBg}
        stroke={colors.design}
        strokeWidth={1}
      />
      <SvgText
        x={subX + subW / 2}
        y={coreY + 38}
        textAnchor="middle"
        style={{ fontSize: 8, fontFamily: "Times-Bold", fill: colors.design }}
      >
        Visual Workflow Editor
      </SvgText>
      <SvgText
        x={subX + subW / 2}
        y={coreY + 50}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
      >
        React Flow canvas, drag-drop nodes, edge connections
      </SvgText>
      <SvgText
        x={subX + subW / 2}
        y={coreY + 62}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
      >
        Real-time validation, auto-save, version history
      </SvgText>

      {/* Down arrow */}
      {arrow(
        subX + subW / 2,
        coreY + 72,
        subX + subW / 2,
        coreY + 80,
        colors.arrow,
      )}

      {/* Subsystem 2: Execution Engine */}
      <Rect
        x={subX}
        y={coreY + 82}
        width={subW}
        height={subH}
        rx={5}
        fill={colors.executeBg}
        stroke={colors.execute}
        strokeWidth={1}
      />
      <SvgText
        x={subX + subW / 2}
        y={coreY + 98}
        textAnchor="middle"
        style={{ fontSize: 8, fontFamily: "Times-Bold", fill: colors.execute }}
      >
        Durable Execution Engine
      </SvgText>
      <SvgText
        x={subX + subW / 2}
        y={coreY + 110}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
      >
        BFS node traversal, Inngest step functions
      </SvgText>
      <SvgText
        x={subX + subW / 2}
        y={coreY + 122}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
      >
        Auto-retry, error handling, credential injection
      </SvgText>

      {/* Down arrow */}
      {arrow(
        subX + subW / 2,
        coreY + 132,
        subX + subW / 2,
        coreY + 140,
        colors.arrow,
      )}

      {/* Subsystem 3: Monitoring */}
      <Rect
        x={subX}
        y={coreY + 142}
        width={subW}
        height={subH}
        rx={5}
        fill={colors.monitorBg}
        stroke={colors.monitor}
        strokeWidth={1}
      />
      <SvgText
        x={subX + subW / 2}
        y={coreY + 158}
        textAnchor="middle"
        style={{ fontSize: 8, fontFamily: "Times-Bold", fill: colors.monitor }}
      >
        Monitoring & Observability
      </SvgText>
      <SvgText
        x={subX + subW / 2}
        y={coreY + 170}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
      >
        Execution logs, step-level results, Sentry integration
      </SvgText>
      <SvgText
        x={subX + subW / 2}
        y={coreY + 182}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
      >
        Real-time notifications, performance metrics
      </SvgText>

      {/* Arrow: Core → User (feedback) */}
      {arrow(coreX - 2, 250, 78, 95, colors.monitor)}
      <SvgText
        x={88}
        y={195}
        style={{ fontSize: 7, fontFamily: "Times-Italic", fill: colors.label }}
      >
        Results &
      </SvgText>
      <SvgText
        x={88}
        y={203}
        style={{ fontSize: 7, fontFamily: "Times-Italic", fill: colors.label }}
      >
        Alerts
      </SvgText>

      {/* External Services (right side) */}
      <SvgText
        x={width - 55}
        y={coreY + 5}
        textAnchor="middle"
        style={{
          fontSize: 8,
          fontFamily: "Times-Bold",
          fill: colors.integrate,
        }}
      >
        External Services
      </SvgText>

      {[
        { name: "OpenAI / Gemini", y: coreY + 30 },
        { name: "Slack / GitHub", y: coreY + 62 },
        { name: "PostgreSQL", y: coreY + 94 },
        { name: "Inngest Cloud", y: coreY + 126 },
        { name: "Resend Email", y: coreY + 158 },
      ].map((svc, i) => (
        <G key={i}>
          <Rect
            x={width - 108}
            y={svc.y}
            width={106}
            height={26}
            rx={4}
            fill={colors.integrateBg}
            stroke={colors.integrate}
            strokeWidth={0.8}
          />
          <SvgText
            x={width - 55}
            y={svc.y + 16}
            textAnchor="middle"
            style={{
              fontSize: 7,
              fontFamily: "Times-Bold",
              fill: colors.integrate,
            }}
          >
            {svc.name}
          </SvgText>
        </G>
      ))}

      {/* Arrows: Core ↔ External */}
      {[coreY + 43, coreY + 75, coreY + 107, coreY + 139, coreY + 171].map(
        (y, i) => (
          <G key={`ext-arrow-${i}`}>
            <Line
              x1={coreX + coreW}
              y1={y}
              x2={width - 110}
              y2={y}
              stroke={colors.integrate}
              strokeWidth={0.8}
              strokeDasharray="3,2"
            />
            <Polygon
              points={`${width - 110},${y} ${width - 116},${y - 3} ${width - 116},${y + 3}`}
              fill={colors.integrate}
            />
          </G>
        ),
      )}

      {/* Data Store (bottom) */}
      <Rect
        x={coreX + 30}
        y={coreY + coreH + 15}
        width={175}
        height={30}
        rx={5}
        fill="#FFF8E1"
        stroke="#F9A825"
        strokeWidth={1}
      />
      <SvgText
        x={coreX + 30 + 87}
        y={coreY + coreH + 34}
        textAnchor="middle"
        style={{ fontSize: 8, fontFamily: "Times-Bold", fill: "#F57F17" }}
      >
        PostgreSQL + Prisma ORM
      </SvgText>
      {arrow(
        coreX + coreW / 2,
        coreY + coreH,
        coreX + coreW / 2,
        coreY + coreH + 14,
        "#F9A825",
      )}
      <SvgText
        x={coreX + coreW / 2 + 12}
        y={coreY + coreH + 8}
        style={{ fontSize: 7, fontFamily: "Times-Italic", fill: colors.label }}
      >
        Read/Write
      </SvgText>

      {/* Auth (bottom-right) */}
      <Rect
        x={coreX + coreW - 45}
        y={coreY + coreH + 15}
        width={80}
        height={30}
        rx={5}
        fill="#FCE4EC"
        stroke="#C62828"
        strokeWidth={1}
      />
      <SvgText
        x={coreX + coreW - 5}
        y={coreY + coreH + 34}
        textAnchor="middle"
        style={{ fontSize: 8, fontFamily: "Times-Bold", fill: "#C62828" }}
      >
        Better Auth
      </SvgText>

      {/* Legend */}
      <G>
        <Rect
          x={15}
          y={height - 28}
          width={465}
          height={22}
          rx={4}
          fill="#FAFAFA"
          stroke="#E0E0E0"
          strokeWidth={0.8}
        />
        {[
          { label: "Editor", color: colors.design, x: 30 },
          { label: "Execution", color: colors.execute, x: 100 },
          { label: "Monitoring", color: colors.monitor, x: 185 },
          { label: "External API", color: colors.integrate, x: 280 },
          { label: "Data Store", color: "#F9A825", x: 375 },
        ].map((item) => (
          <G key={item.label}>
            <Rect
              x={item.x}
              y={height - 23}
              width={10}
              height={10}
              rx={2}
              fill="none"
              stroke={item.color}
              strokeWidth={1}
            />
            <SvgText
              x={item.x + 14}
              y={height - 14}
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
