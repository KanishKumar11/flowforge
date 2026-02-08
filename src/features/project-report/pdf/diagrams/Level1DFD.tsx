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
 * Level 1 DFD - 5 processes, 4 data stores, 3 external entities
 * Fixed: No overlapping labels, proper spacing
 */
export default function Level1DFD() {
  const width = 495;
  const height = 460;
  const cx = width / 2;

  const processes = [
    {
      id: "1.0",
      label: "Authentication\n& User Mgmt",
      x: 80,
      y: 60,
      color: "#2563eb",
    },
    {
      id: "2.0",
      label: "Workflow\nManagement",
      x: 250,
      y: 60,
      color: "#7c3aed",
    },
    { id: "3.0", label: "Execution\nEngine", x: 400, y: 145, color: "#059669" },
    {
      id: "4.0",
      label: "Integration\nLayer",
      x: 400,
      y: 280,
      color: "#d97706",
    },
    {
      id: "5.0",
      label: "Team & Cred\nManagement",
      x: 80,
      y: 280,
      color: "#dc2626",
    },
  ];

  const pRx = 50;
  const pRy = 25;

  const stores = [
    { id: "D1", label: "Users", x: 15, y: 165, w: 100 },
    { id: "D2", label: "Workflows", x: 185, y: 165, w: 100 },
    { id: "D3", label: "Executions", x: 185, y: 375, w: 100 },
    { id: "D4", label: "Credentials", x: 15, y: 375, w: 100 },
  ];

  const storeH = 24;

  const extEntities = [
    { label: "User", x: 55, y: 5, w: 55, h: 20 },
    { label: "AI Provider", x: 355, y: 370, w: 80, h: 20 },
    { label: "Ext. Services", x: 355, y: 410, w: 85, h: 20 },
  ];

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Processes */}
      {processes.map((p, i) => (
        <G key={`p-${i}`}>
          <Ellipse
            cx={p.x}
            cy={p.y}
            rx={pRx}
            ry={pRy}
            fill={p.color}
            stroke={p.color}
            strokeWidth={1.5}
          />
          <SvgText
            x={p.x}
            y={p.y - 8}
            textAnchor="middle"
            style={{ fontSize: 7.5, fontFamily: "Times-Bold", fill: "white" }}
          >
            {p.id}
          </SvgText>
          <SvgText
            x={p.x}
            y={p.y + 4}
            textAnchor="middle"
            style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "white" }}
          >
            {p.label.split("\n")[0]}
          </SvgText>
          <SvgText
            x={p.x}
            y={p.y + 13}
            textAnchor="middle"
            style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "white" }}
          >
            {p.label.split("\n")[1]}
          </SvgText>
        </G>
      ))}

      {/* Data stores */}
      {stores.map((s, i) => (
        <G key={`s-${i}`}>
          <Rect
            x={s.x}
            y={s.y}
            width={s.w}
            height={storeH}
            fill="#f8f9fa"
            opacity={0.8}
          />
          <Line
            x1={s.x}
            y1={s.y}
            x2={s.x + s.w}
            y2={s.y}
            stroke="#333"
            strokeWidth={1.2}
          />
          <Line
            x1={s.x}
            y1={s.y + storeH}
            x2={s.x + s.w}
            y2={s.y + storeH}
            stroke="#333"
            strokeWidth={1.2}
          />
          <Line
            x1={s.x + 25}
            y1={s.y}
            x2={s.x + 25}
            y2={s.y + storeH}
            stroke="#333"
            strokeWidth={0.8}
          />
          <SvgText
            x={s.x + 12}
            y={s.y + 15}
            textAnchor="middle"
            style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#333" }}
          >
            {s.id}
          </SvgText>
          <SvgText
            x={s.x + 25 + (s.w - 25) / 2}
            y={s.y + 15}
            textAnchor="middle"
            style={{ fontSize: 7.5, fontFamily: "Times-Roman", fill: "#333" }}
          >
            {s.label}
          </SvgText>
        </G>
      ))}

      {/* External entities */}
      {extEntities.map((e, i) => (
        <G key={`ext-${i}`}>
          <Rect
            x={e.x}
            y={e.y}
            width={e.w}
            height={e.h}
            fill="white"
            stroke="#333"
            strokeWidth={1}
          />
          <SvgText
            x={e.x + e.w / 2}
            y={e.y + 14}
            textAnchor="middle"
            style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#333" }}
          >
            {e.label}
          </SvgText>
        </G>
      ))}

      {/* ---- Data Flows ---- */}

      {/* User → P1 */}
      <Line x1={82} y1={25} x2={80} y2={35} stroke="#666" strokeWidth={1} />
      <Polygon points="80,35 76,29 84,29" fill="#666" />
      <SvgText
        x={100}
        y={32}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Login/Register
      </SvgText>

      {/* P1 → P2 */}
      <Line x1={130} y1={55} x2={200} y2={55} stroke="#666" strokeWidth={1} />
      <Polygon points="200,55 194,51 194,59" fill="#666" />
      <SvgText
        x={165}
        y={48}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Auth token
      </SvgText>

      {/* P1 → D1 */}
      <Line x1={65} y1={85} x2={60} y2={165} stroke="#666" strokeWidth={1} />
      <Polygon points="60,165 56,158 64,158" fill="#666" />
      <SvgText
        x={40}
        y={125}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        User data
      </SvgText>

      {/* P2 → D2 */}
      <Line x1={240} y1={85} x2={235} y2={165} stroke="#666" strokeWidth={1} />
      <Polygon points="235,165 231,158 239,158" fill="#666" />
      <SvgText
        x={255}
        y={122}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Workflow defs
      </SvgText>

      {/* P2 → P3 */}
      <Line x1={300} y1={65} x2={355} y2={130} stroke="#666" strokeWidth={1} />
      <Polygon points="355,130 348,128 351,122" fill="#666" />
      <SvgText
        x={340}
        y={90}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Trigger
      </SvgText>

      {/* P3 → P4 */}
      <Line x1={400} y1={170} x2={400} y2={255} stroke="#666" strokeWidth={1} />
      <Polygon points="400,255 396,248 404,248" fill="#666" />
      <SvgText
        x={420}
        y={215}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        API calls
      </SvgText>

      {/* P3 → D3 */}
      <Line x1={360} y1={165} x2={285} y2={378} stroke="#666" strokeWidth={1} />
      <Polygon points="285,378 287,370 293,374" fill="#666" />
      <SvgText
        x={340}
        y={280}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Exec logs
      </SvgText>

      {/* P4 → AI Provider */}
      <Line x1={410} y1={305} x2={410} y2={370} stroke="#666" strokeWidth={1} />
      <Polygon points="410,370 406,363 414,363" fill="#666" />

      {/* P4 → Ext Services */}
      <Line x1={420} y1={305} x2={420} y2={410} stroke="#666" strokeWidth={1} />
      <Polygon points="420,410 416,403 424,403" fill="#666" />

      {/* P5 → D4 */}
      <Line x1={70} y1={305} x2={65} y2={375} stroke="#666" strokeWidth={1} />
      <Polygon points="65,375 61,368 69,368" fill="#666" />
      <SvgText
        x={40}
        y={345}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Encrypted creds
      </SvgText>

      {/* P5 → D1 */}
      <Line x1={70} y1={255} x2={65} y2={189} stroke="#666" strokeWidth={1} />
      <Polygon points="65,189 61,196 69,196" fill="#666" />
      <SvgText
        x={40}
        y={225}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Team data
      </SvgText>

      {/* P3 → P5 (dashed - fetch creds) */}
      <Line
        x1={350}
        y1={155}
        x2={130}
        y2={270}
        stroke="#666"
        strokeWidth={1}
        strokeDasharray="3,2"
      />
      <SvgText
        x={245}
        y={225}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Fetch credentials
      </SvgText>

      {/* Caption */}
      <SvgText
        x={cx}
        y={height - 10}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Figure: Level 1 Data Flow Diagram — Flowgent System
      </SvgText>
    </Svg>
  );
}
