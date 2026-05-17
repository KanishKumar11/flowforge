/**
 * Deployment Architecture Diagram
 * Shows cloud infrastructure and deployment topology
 * For Chapter 8 (Implementation) - Deployment section
 */
import {
  Svg,
  Rect,
  Text as SvgText,
  Line,
  G,
  Circle,
} from "@react-pdf/renderer";

export default function DeploymentDiagram() {
  const width = 520;
  const height = 514;

  // Colors
  const colors = {
    client: "#E3F2FD",
    clientBorder: "#1565C0",
    cdn: "#FFF3E0",
    cdnBorder: "#E65100",
    server: "#E8F5E9",
    serverBorder: "#2E7D32",
    db: "#F3E5F5",
    dbBorder: "#6A1B9A",
    queue: "#FFF8E1",
    queueBorder: "#F57F17",
    text: "#1a1a1a",
    label: "#475569",
    arrow: "#475569",
  };

  // Helper: draw a deployment node box
  const Node = ({
    x,
    y,
    w,
    h,
    fill,
    stroke,
    title,
    items,
  }: {
    x: number;
    y: number;
    w: number;
    h: number;
    fill: string;
    stroke: string;
    title: string;
    items: string[];
  }) => (
    <G>
      <Rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.5}
      />
      <Rect x={x} y={y} width={w} height={18} rx={4} fill={stroke} />
      <SvgText
        x={x + w / 2}
        y={y + 12}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#ffffff" }}
      >
        {title}
      </SvgText>
      {items.map((item, i) => (
        <SvgText
          key={i}
          x={x + w / 2}
          y={y + 32 + i * 11}
          textAnchor="middle"
          style={{
            fontSize: 7.5,
            fontFamily: "Times-Roman",
            fill: colors.text,
          }}
        >
          {item}
        </SvgText>
      ))}
    </G>
  );

  // Arrow helper
  const Arrow = ({
    x1,
    y1,
    x2,
    y2,
    label,
    labelX,
    labelY,
  }: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    label?: string;
    labelX?: number;
    labelY?: number;
  }) => (
    <G>
      <Line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={colors.arrow}
        strokeWidth={1}
        strokeDasharray="3,2"
      />
      {/* Arrowhead */}
      <Circle cx={x2} cy={y2} r={2} fill={colors.arrow} />
      {label && (
        <SvgText
          x={labelX || (x1 + x2) / 2}
          y={labelY || (y1 + y2) / 2 - 4}
          textAnchor="middle"
          style={{
            fontSize: 7,
            fontFamily: "Times-Italic",
            fill: colors.label,
          }}
        >
          {label}
        </SvgText>
      )}
    </G>
  );

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={width / 2}
        y={16}
        textAnchor="middle"
        style={{ fontSize: 11, fontFamily: "Times-Bold", fill: colors.text }}
      >
        Deployment Architecture
      </SvgText>
      <SvgText
        x={width / 2}
        y={30}
        textAnchor="middle"
        style={{ fontSize: 8, fontFamily: "Times-Italic", fill: colors.label }}
      >
        4-tier topology — Client → Edge → Application → Data
      </SvgText>

      {/* ── Tier background panels ─────────────────────────────── */}
      {/* CLIENT: y=40, h=102 */}
      <Rect
        x={5}
        y={40}
        width={width - 10}
        height={102}
        fill="#f1f5f9"
        rx={4}
      />
      {/* EDGE/CDN: y=158, h=100 */}
      <Rect
        x={5}
        y={158}
        width={width - 10}
        height={100}
        fill="#fff7ed"
        rx={4}
      />
      {/* APPLICATION: y=274, h=116 */}
      <Rect
        x={5}
        y={274}
        width={width - 10}
        height={116}
        fill="#f0fdf4"
        rx={4}
      />
      {/* DATA: y=406, h=104 */}
      <Rect
        x={5}
        y={406}
        width={width - 10}
        height={104}
        fill="#faf5ff"
        rx={4}
      />

      {/* ── Tier label pills — placed at top of each band ─────── */}
      {/* CLIENT TIER label: y=46 (6px from band top) */}
      <G>
        <Rect
          x={12}
          y={46}
          width={120}
          height={16}
          rx={4}
          fill="#ffffff"
          stroke={colors.clientBorder}
          strokeWidth={0.9}
        />
        <SvgText
          x={72}
          y={58}
          textAnchor="middle"
          style={{
            fontSize: 8,
            fontFamily: "Times-Bold",
            fill: colors.clientBorder,
            letterSpacing: 1,
          }}
        >
          CLIENT TIER
        </SvgText>
      </G>
      {/* EDGE / CDN label: y=164 */}
      <G>
        <Rect
          x={12}
          y={164}
          width={120}
          height={16}
          rx={4}
          fill="#ffffff"
          stroke={colors.cdnBorder}
          strokeWidth={0.9}
        />
        <SvgText
          x={72}
          y={176}
          textAnchor="middle"
          style={{
            fontSize: 8,
            fontFamily: "Times-Bold",
            fill: colors.cdnBorder,
            letterSpacing: 1,
          }}
        >
          EDGE / CDN
        </SvgText>
      </G>
      {/* APPLICATION TIER label: y=280 */}
      <G>
        <Rect
          x={12}
          y={280}
          width={140}
          height={16}
          rx={4}
          fill="#ffffff"
          stroke={colors.serverBorder}
          strokeWidth={0.9}
        />
        <SvgText
          x={82}
          y={292}
          textAnchor="middle"
          style={{
            fontSize: 8,
            fontFamily: "Times-Bold",
            fill: colors.serverBorder,
            letterSpacing: 1,
          }}
        >
          APPLICATION TIER
        </SvgText>
      </G>
      {/* DATA / SERVICES TIER label: y=412 */}
      <G>
        <Rect
          x={12}
          y={412}
          width={150}
          height={16}
          rx={4}
          fill="#ffffff"
          stroke={colors.dbBorder}
          strokeWidth={0.9}
        />
        <SvgText
          x={87}
          y={424}
          textAnchor="middle"
          style={{
            fontSize: 8,
            fontFamily: "Times-Bold",
            fill: colors.dbBorder,
            letterSpacing: 1,
          }}
        >
          DATA / SERVICES TIER
        </SvgText>
      </G>

      {/* ── CLIENT TIER — nodes start at y=68 (6px below label bottom) */}
      <Node
        x={50}
        y={68}
        w={110}
        h={70}
        fill={colors.client}
        stroke={colors.clientBorder}
        title="Web Browser"
        items={["React 19 SPA", "Next.js 16 Client", "React Flow Editor"]}
      />
      <Node
        x={205}
        y={68}
        w={110}
        h={70}
        fill={colors.client}
        stroke={colors.clientBorder}
        title="Mobile Browser"
        items={["Responsive PWA", "Touch-optimized UI"]}
      />
      <Node
        x={360}
        y={68}
        w={110}
        h={70}
        fill={colors.client}
        stroke={colors.clientBorder}
        title="External Systems"
        items={["Webhook Callers", "API Consumers", "OAuth2 Providers"]}
      />

      {/* ── EDGE / CDN TIER — nodes start at y=186 */}
      <Node
        x={68}
        y={186}
        w={160}
        h={68}
        fill={colors.cdn}
        stroke={colors.cdnBorder}
        title="Netlify Edge Network"
        items={["Global CDN", "Edge Middleware", "SSL/TLS Termination"]}
      />
      <Node
        x={291}
        y={186}
        w={160}
        h={68}
        fill={colors.cdn}
        stroke={colors.cdnBorder}
        title="DNS & Routing"
        items={["Custom Domain", "Geo-routing", "Load Balancing"]}
      />

      {/* ── APPLICATION TIER — nodes start at y=302 */}
      <Node
        x={23}
        y={302}
        w={145}
        h={84}
        fill={colors.server}
        stroke={colors.serverBorder}
        title="Next.js App Server"
        items={[
          "Server Components",
          "tRPC API Layer",
          "Auth (Better Auth)",
          "API Routes",
        ]}
      />
      <Node
        x={186}
        y={302}
        w={145}
        h={84}
        fill={colors.server}
        stroke={colors.serverBorder}
        title="Inngest Worker"
        items={[
          "Workflow Executor",
          "BFS Graph Traversal",
          "Scheduled Jobs",
          "Event-driven Tasks",
        ]}
      />
      <Node
        x={349}
        y={302}
        w={145}
        h={84}
        fill={colors.server}
        stroke={colors.serverBorder}
        title="Serverless Functions"
        items={[
          "Webhook Handlers",
          "OAuth2 Callbacks",
          "Cron Triggers",
          "Sentry Error Tracking",
        ]}
      />

      {/* ── DATA TIER — nodes start at y=434 */}
      <Node
        x={19}
        y={434}
        w={118}
        h={68}
        fill={colors.db}
        stroke={colors.dbBorder}
        title="Neon PostgreSQL"
        items={["Primary Database", "Prisma ORM", "Connection Pooling"]}
      />
      <Node
        x={151}
        y={434}
        w={118}
        h={68}
        fill={colors.db}
        stroke={colors.dbBorder}
        title="Blob Storage"
        items={["Workflow Exports", "User Avatars", "Report Outputs"]}
      />
      <Node
        x={283}
        y={434}
        w={110}
        h={68}
        fill={colors.queue}
        stroke={colors.queueBorder}
        title="Inngest Cloud"
        items={["Event Queue", "Job Scheduling", "Retry Logic"]}
      />
      <Node
        x={407}
        y={434}
        w={90}
        h={68}
        fill={colors.db}
        stroke={colors.dbBorder}
        title="External APIs"
        items={["OpenAI", "Google", "Slack"]}
      />

      {/* ── Arrows: Client → Edge (node bottoms y=138, edge tops y=186) ── */}
      <Arrow
        x1={105}
        y1={138}
        x2={148}
        y2={186}
        label="HTTPS"
        labelX={124}
        labelY={159}
      />
      <Arrow
        x1={260}
        y1={138}
        x2={260}
        y2={186}
        label="HTTPS"
        labelX={260}
        labelY={159}
      />
      <Arrow
        x1={415}
        y1={138}
        x2={371}
        y2={186}
        label="Webhooks"
        labelX={395}
        labelY={159}
      />

      {/* ── Arrows: Edge → App (edge bottoms y=254, app tops y=302) ─── */}
      <Arrow
        x1={148}
        y1={254}
        x2={96}
        y2={302}
        label="SSR/ISR"
        labelX={118}
        labelY={275}
      />
      <Arrow
        x1={148}
        y1={254}
        x2={259}
        y2={302}
        label="Events"
        labelX={198}
        labelY={275}
      />
      <Arrow
        x1={371}
        y1={254}
        x2={422}
        y2={302}
        label="Routes"
        labelX={397}
        labelY={275}
      />

      {/* ── Arrows: App → Data (app bottoms y=386, data tops y=434) ─── */}
      <Arrow
        x1={96}
        y1={386}
        x2={78}
        y2={434}
        label="Prisma"
        labelX={84}
        labelY={408}
      />
      <Arrow
        x1={259}
        y1={386}
        x2={210}
        y2={434}
        label="Files"
        labelX={232}
        labelY={408}
      />
      <Arrow
        x1={259}
        y1={386}
        x2={338}
        y2={434}
        label="Events"
        labelX={300}
        labelY={408}
      />
      <Arrow
        x1={422}
        y1={386}
        x2={452}
        y2={434}
        label="REST"
        labelX={439}
        labelY={408}
      />
    </Svg>
  );
}
