/**
 * Sequence Diagram - Workflow Execution Flow
 * Shows the step-by-step interaction between components during workflow execution
 * For Chapter 6 (System Design)
 */
import {
  Svg,
  Rect,
  Text as SvgText,
  Line,
  G,
  Circle,
} from "@react-pdf/renderer";

export default function SequenceDiagram() {
  const width = 495;
  const height = 480;

  const colors = {
    text: "#1a1a1a",
    label: "#666666",
    lifeline: "#cccccc",
    actor: "#E3F2FD",
    actorBorder: "#1565C0",
    message: "#333333",
    return: "#888888",
    activation: "#E8F5E9",
    activationBorder: "#2E7D32",
    note: "#FFF8E1",
    noteBorder: "#F57F17",
    alt: "#F3E5F5",
    altBorder: "#6A1B9A",
  };

  // Participant positions (x centers)
  const parts = [
    { x: 50, label: "User" },
    { x: 135, label: "React UI" },
    { x: 220, label: "tRPC API" },
    { x: 305, label: "Database" },
    { x: 390, label: "Inngest" },
    { x: 460, label: "Node\nExecutor" },
  ];

  const topY = 50;
  const bottomY = 470;

  // Draw participant box
  const Participant = ({ x, label }: { x: number; label: string }) => {
    const lines = label.split("\n");
    const boxH = 14 + lines.length * 10;
    return (
      <G>
        <Rect
          x={x - 32}
          y={topY - boxH}
          width={64}
          height={boxH}
          rx={3}
          fill={colors.actor}
          stroke={colors.actorBorder}
          strokeWidth={1}
        />
        {lines.map((line, i) => (
          <SvgText
            key={i}
            x={x}
            y={topY - boxH + 10 + i * 10}
            textAnchor="middle"
            style={{
              fontSize: 7,
              fontFamily: "Times-Bold",
              fill: colors.text,
            }}
          >
            {line}
          </SvgText>
        ))}
        {/* Lifeline */}
        <Line
          x1={x}
          y1={topY}
          x2={x}
          y2={bottomY}
          stroke={colors.lifeline}
          strokeWidth={0.8}
          strokeDasharray="4,3"
        />
      </G>
    );
  };

  // Solid arrow (request)
  const SolidArrow = ({
    from,
    to,
    y,
    label,
  }: {
    from: number;
    to: number;
    y: number;
    label: string;
  }) => {
    const x1 = parts[from].x;
    const x2 = parts[to].x;
    const dir = x2 > x1 ? 1 : -1;
    return (
      <G>
        <Line
          x1={x1}
          y1={y}
          x2={x2}
          y2={y}
          stroke={colors.message}
          strokeWidth={1}
        />
        {/* Arrowhead */}
        <Line
          x1={x2 - dir * 6}
          y1={y - 3}
          x2={x2}
          y2={y}
          stroke={colors.message}
          strokeWidth={1}
        />
        <Line
          x1={x2 - dir * 6}
          y1={y + 3}
          x2={x2}
          y2={y}
          stroke={colors.message}
          strokeWidth={1}
        />
        <SvgText
          x={(x1 + x2) / 2}
          y={y - 4}
          textAnchor="middle"
          style={{
            fontSize: 7,
            fontFamily: "Times-Roman",
            fill: colors.text,
          }}
        >
          {label}
        </SvgText>
      </G>
    );
  };

  // Dashed arrow (response)
  const DashedArrow = ({
    from,
    to,
    y,
    label,
  }: {
    from: number;
    to: number;
    y: number;
    label: string;
  }) => {
    const x1 = parts[from].x;
    const x2 = parts[to].x;
    const dir = x2 > x1 ? 1 : -1;
    return (
      <G>
        <Line
          x1={x1}
          y1={y}
          x2={x2}
          y2={y}
          stroke={colors.return}
          strokeWidth={0.8}
          strokeDasharray="4,2"
        />
        <Line
          x1={x2 - dir * 6}
          y1={y - 3}
          x2={x2}
          y2={y}
          stroke={colors.return}
          strokeWidth={0.8}
        />
        <Line
          x1={x2 - dir * 6}
          y1={y + 3}
          x2={x2}
          y2={y}
          stroke={colors.return}
          strokeWidth={0.8}
        />
        <SvgText
          x={(x1 + x2) / 2}
          y={y - 4}
          textAnchor="middle"
          style={{
            fontSize: 7,
            fontFamily: "Times-Italic",
            fill: "#555555",
          }}
        >
          {label}
        </SvgText>
      </G>
    );
  };

  // Activation bar
  const Activation = ({
    partIdx,
    y1,
    y2,
  }: {
    partIdx: number;
    y1: number;
    y2: number;
  }) => (
    <Rect
      x={parts[partIdx].x - 4}
      y={y1}
      width={8}
      height={y2 - y1}
      fill={colors.activation}
      stroke={colors.activationBorder}
      strokeWidth={0.8}
    />
  );

  // Note box
  const Note = ({ x, y, text }: { x: number; y: number; text: string }) => (
    <G>
      <Rect
        x={x}
        y={y}
        width={70}
        height={16}
        rx={2}
        fill={colors.note}
        stroke={colors.noteBorder}
        strokeWidth={0.8}
      />
      <SvgText
        x={x + 35}
        y={y + 10}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Italic", fill: colors.label }}
      >
        {text}
      </SvgText>
    </G>
  );

  // Alt/loop fragment
  const Fragment = ({
    x,
    y,
    w,
    h,
    label,
  }: {
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
  }) => (
    <G>
      <Rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="none"
        stroke={colors.altBorder}
        strokeWidth={0.8}
        strokeDasharray="6,3"
      />
      <Rect
        x={x}
        y={y}
        width={40}
        height={12}
        fill={colors.alt}
        stroke={colors.altBorder}
        strokeWidth={0.8}
      />
      <SvgText
        x={x + 20}
        y={y + 8}
        textAnchor="middle"
        style={{
          fontSize: 7,
          fontFamily: "Times-Bold",
          fill: colors.altBorder,
        }}
      >
        {label}
      </SvgText>
    </G>
  );

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={width / 2}
        y={14}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: colors.text }}
      >
        Workflow Execution Sequence Diagram
      </SvgText>

      {/* Participants */}
      {parts.map((p, i) => (
        <Participant key={i} x={p.x} label={p.label} />
      ))}

      {/* Activation bars */}
      <Activation partIdx={1} y1={60} y2={105} />
      <Activation partIdx={2} y1={72} y2={100} />
      <Activation partIdx={3} y1={82} y2={95} />

      <Activation partIdx={1} y1={120} y2={165} />
      <Activation partIdx={2} y1={132} y2={160} />
      <Activation partIdx={3} y1={142} y2={155} />

      <Activation partIdx={2} y1={180} y2={215} />
      <Activation partIdx={4} y1={192} y2={210} />

      <Activation partIdx={4} y1={240} y2={405} />
      <Activation partIdx={5} y1={266} y2={316} />
      <Activation partIdx={3} y1={281} y2={311} />

      <Activation partIdx={5} y1={341} y2={391} />
      <Activation partIdx={3} y1={356} y2={386} />

      <Activation partIdx={2} y1={410} y2={460} />
      <Activation partIdx={3} y1={420} y2={440} />
      <Activation partIdx={1} y1={450} y2={465} />

      {/* Phase 1: Trigger Workflow */}
      <SvgText
        x={8}
        y={62}
        style={{
          fontSize: 7,
          fontFamily: "Times-Bold",
          fill: colors.altBorder,
        }}
      >
        1. TRIGGER
      </SvgText>
      <SolidArrow from={0} to={1} y={68} label="Click 'Execute Workflow'" />
      <SolidArrow from={1} to={2} y={78} label="executeWorkflow(id)" />
      <SolidArrow from={2} to={3} y={88} label="Load workflow + nodes" />
      <DashedArrow from={3} to={2} y={96} label="Workflow data" />
      <DashedArrow from={2} to={1} y={104} label="Execution started" />

      {/* Phase 2: Create Execution Record */}
      <SvgText
        x={8}
        y={122}
        style={{
          fontSize: 7,
          fontFamily: "Times-Bold",
          fill: colors.altBorder,
        }}
      >
        2. INIT
      </SvgText>
      <SolidArrow from={0} to={1} y={128} label="Show loading state" />
      <SolidArrow from={1} to={2} y={138} label="createExecution()" />
      <SolidArrow from={2} to={3} y={148} label="INSERT execution record" />
      <DashedArrow from={3} to={2} y={156} label="Execution ID" />
      <DashedArrow from={2} to={1} y={164} label="executionId" />

      {/* Phase 3: Queue to Inngest */}
      <SvgText
        x={8}
        y={182}
        style={{
          fontSize: 7,
          fontFamily: "Times-Bold",
          fill: colors.altBorder,
        }}
      >
        3. QUEUE
      </SvgText>
      <SolidArrow
        from={2}
        to={4}
        y={195}
        label="inngest.send('workflow/execute')"
      />
      <DashedArrow from={4} to={2} y={208} label="Event acknowledged" />

      <Note x={10} y={215} text="Async processing begins" />

      {/* Phase 4: BFS Execution Loop */}
      <Fragment x={355} y={232} w={130} h={180} label="LOOP" />
      <SvgText
        x={360}
        y={250}
        style={{
          fontSize: 7,
          fontFamily: "Times-Italic",
          fill: colors.altBorder,
        }}
      >
        For each node (BFS order)
      </SvgText>

      <SolidArrow from={4} to={5} y={271} label="executeNode(node)" />
      <SolidArrow from={5} to={3} y={286} label="Fetch credentials" />
      <DashedArrow from={3} to={5} y={299} label="Decrypted creds" />
      <DashedArrow from={5} to={4} y={314} label="Node result" />

      <Note x={330} y={325} text="Next node in BFS queue" />

      <SolidArrow from={4} to={5} y={346} label="executeNode(nextNode)" />
      <SolidArrow from={5} to={3} y={361} label="Call external API" />
      <DashedArrow from={3} to={5} y={374} label="API response" />
      <DashedArrow from={5} to={4} y={389} label="Node result" />

      {/* Phase 5: Complete */}
      <SvgText
        x={8}
        y={412}
        style={{
          fontSize: 7,
          fontFamily: "Times-Bold",
          fill: colors.altBorder,
        }}
      >
        5. COMPLETE
      </SvgText>
      <SolidArrow from={4} to={2} y={418} label="Execution complete event" />
      <SolidArrow from={2} to={3} y={428} label="UPDATE status = 'completed'" />
      <DashedArrow from={3} to={2} y={438} label="Updated" />
      <SolidArrow from={2} to={1} y={450} label="Push notification" />
      <SolidArrow from={1} to={0} y={462} label="Show results" />
    </Svg>
  );
}
