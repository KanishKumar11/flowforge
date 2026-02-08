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
 * Level 2 DFD - Process 3.0 Execution Engine decomposed
 * Fixed: Proper spacing, no overlapping labels or arrows
 */
export default function Level2DFD() {
  const width = 495;
  const height = 420;
  const cx = width / 2;

  const processes = [
    {
      id: "3.1",
      label: "Parse Workflow\nDefinition",
      x: 110,
      y: 55,
      color: "#059669",
    },
    {
      id: "3.2",
      label: "Resolve Node\nDependencies",
      x: 290,
      y: 55,
      color: "#0891b2",
    },
    { id: "3.3", label: "Execute\nNode", x: 390, y: 165, color: "#2563eb" },
    {
      id: "3.4",
      label: "Handle AI\nProcessing",
      x: 390,
      y: 290,
      color: "#7c3aed",
    },
    { id: "3.5", label: "Log\nResults", x: 110, y: 290, color: "#d97706" },
    {
      id: "3.6",
      label: "Error Handling\n& Retry",
      x: 240,
      y: 210,
      color: "#dc2626",
    },
  ];

  const pRx = 48;
  const pRy = 24;

  const stores = [
    { id: "D2", label: "Workflows", x: 10, y: 135, w: 90 },
    { id: "D3", label: "Executions", x: 10, y: 340, w: 90 },
    { id: "D4", label: "Credentials", x: 10, y: 240, w: 90 },
  ];

  const storeH = 22;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Boundary */}
      <Rect
        x={5}
        y={10}
        width={width - 10}
        height={height - 40}
        rx={8}
        fill="none"
        stroke="#059669"
        strokeWidth={1}
        strokeDasharray="5,3"
      />
      <SvgText
        x={15}
        y={25}
        style={{ fontSize: 8, fontFamily: "Times-Bold", fill: "#059669" }}
      >
        Process 3.0: Execution Engine
      </SvgText>

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
            y={p.y - 7}
            textAnchor="middle"
            style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "white" }}
          >
            {p.id}
          </SvgText>
          <SvgText
            x={p.x}
            y={p.y + 4}
            textAnchor="middle"
            style={{ fontSize: 6.5, fontFamily: "Times-Bold", fill: "white" }}
          >
            {p.label.split("\n")[0]}
          </SvgText>
          <SvgText
            x={p.x}
            y={p.y + 13}
            textAnchor="middle"
            style={{ fontSize: 6.5, fontFamily: "Times-Bold", fill: "white" }}
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
            strokeWidth={1}
          />
          <Line
            x1={s.x}
            y1={s.y + storeH}
            x2={s.x + s.w}
            y2={s.y + storeH}
            stroke="#333"
            strokeWidth={1}
          />
          <Line
            x1={s.x + 22}
            y1={s.y}
            x2={s.x + 22}
            y2={s.y + storeH}
            stroke="#333"
            strokeWidth={0.6}
          />
          <SvgText
            x={s.x + 11}
            y={s.y + 14}
            textAnchor="middle"
            style={{ fontSize: 6, fontFamily: "Times-Bold", fill: "#333" }}
          >
            {s.id}
          </SvgText>
          <SvgText
            x={s.x + 22 + (s.w - 22) / 2}
            y={s.y + 14}
            textAnchor="middle"
            style={{ fontSize: 7, fontFamily: "Times-Roman", fill: "#333" }}
          >
            {s.label}
          </SvgText>
        </G>
      ))}

      {/* External entity */}
      <Rect
        x={430}
        y={355}
        width={50}
        height={18}
        fill="white"
        stroke="#333"
        strokeWidth={1}
      />
      <SvgText
        x={455}
        y={367}
        textAnchor="middle"
        style={{ fontSize: 6.5, fontFamily: "Times-Bold", fill: "#333" }}
      >
        AI Provider
      </SvgText>

      {/* Inngest label */}
      <Rect
        x={320}
        y={105}
        width={60}
        height={15}
        rx={3}
        fill="#f0fdf4"
        stroke="#059669"
        strokeWidth={0.5}
      />
      <SvgText
        x={350}
        y={116}
        textAnchor="middle"
        style={{ fontSize: 6, fontFamily: "Times-Bold", fill: "#059669" }}
      >
        via Inngest
      </SvgText>

      {/* ---- Data flows ---- */}

      {/* D2 → 3.1 */}
      <Line x1={70} y1={135} x2={85} y2={79} stroke="#666" strokeWidth={1} />
      <Polygon points="85,79 79,85 86,85" fill="#666" />
      <SvgText
        x={50}
        y={108}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Workflow JSON
      </SvgText>

      {/* 3.1 → 3.2 */}
      <Line x1={158} y1={50} x2={242} y2={50} stroke="#666" strokeWidth={1} />
      <Polygon points="242,50 236,46 236,54" fill="#666" />
      <SvgText
        x={200}
        y={43}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Parsed nodes
      </SvgText>

      {/* 3.2 → 3.3 */}
      <Line x1={330} y1={70} x2={352} y2={145} stroke="#666" strokeWidth={1} />
      <Polygon points="352,145 346,140 353,137" fill="#666" />
      <SvgText
        x={355}
        y={105}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Ordered queue
      </SvgText>

      {/* 3.3 → 3.4 */}
      <Line x1={390} y1={189} x2={390} y2={266} stroke="#666" strokeWidth={1} />
      <Polygon points="390,266 386,259 394,259" fill="#666" />
      <SvgText
        x={415}
        y={230}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        AI nodes
      </SvgText>

      {/* 3.4 → AI Provider */}
      <Line x1={420} y1={310} x2={450} y2={355} stroke="#666" strokeWidth={1} />
      <Polygon points="450,355 444,350 450,347" fill="#666" />

      {/* 3.3 → 3.5 (results) */}
      <Line x1={342} y1={175} x2={158} y2={280} stroke="#666" strokeWidth={1} />
      <Polygon points="158,280 162,272 167,278" fill="#666" />
      <SvgText
        x={260}
        y={245}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Node results
      </SvgText>

      {/* 3.5 → D3 */}
      <Line x1={85} y1={310} x2={60} y2={340} stroke="#666" strokeWidth={1} />
      <Polygon points="60,340 62,332 67,337" fill="#666" />
      <SvgText
        x={100}
        y={332}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Exec logs
      </SvgText>

      {/* 3.3 → 3.6 (error) */}
      <Line
        x1={345}
        y1={178}
        x2={288}
        y2={200}
        stroke="#dc2626"
        strokeWidth={1}
        strokeDasharray="3,2"
      />
      <Polygon points="288,200 294,195 293,202" fill="#dc2626" />
      <SvgText
        x={330}
        y={198}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#dc2626" }}
      >
        On error
      </SvgText>

      {/* 3.6 → 3.3 (retry) */}
      <Line
        x1={275}
        y1={198}
        x2={350}
        y2={170}
        stroke="#dc2626"
        strokeWidth={1}
        strokeDasharray="3,2"
      />
      <Polygon points="350,170 344,173 345,167" fill="#dc2626" />
      <SvgText
        x={310}
        y={180}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#dc2626" }}
      >
        Retry
      </SvgText>

      {/* D4 → 3.3 (creds) */}
      <Line
        x1={100}
        y1={248}
        x2={342}
        y2={175}
        stroke="#666"
        strokeWidth={1}
        strokeDasharray="3,2"
      />
      <SvgText
        x={210}
        y={200}
        style={{ fontSize: 5.5, fontFamily: "Times-Italic", fill: "#888" }}
      >
        Decrypted credentials
      </SvgText>

      {/* Caption */}
      <SvgText
        x={cx}
        y={height - 10}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Figure: Level 2 DFD — Workflow Execution Subsystem
      </SvgText>
    </Svg>
  );
}
