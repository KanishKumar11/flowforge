/**
 * Sequence Diagram - Workflow Execution Flow
 * Shows the step-by-step interaction between components during workflow execution
 * For Chapter 7 (System Design)
 */
import {
  Svg,
  Rect,
  Text as SvgText,
  Line,
  G,
} from "@react-pdf/renderer";

export default function SequenceDiagram() {
  const width = 495;
  const height = 582;

  const colors = {
    text: "#1a1a1a",
    label: "#475569",
    lifeline: "#cbd5e1",
    actor: "#eff6ff",
    actorBorder: "#1565c0",
    message: "#334155",
    ret: "#64748b",
    actBar: "#dcfce7",
    actBarBorder: "#15803d",
    note: "#fefce8",
    noteBorder: "#d97706",
    phase: "#6d28d9",
    loop: "#6a1b9a",
    loopFill: "#f5f3ff",
  };

  // 6 participants with evenly spread columns
  const parts = [
    { x: 44,  label: "User" },
    { x: 122, label: "React UI" },
    { x: 208, label: "tRPC API" },
    { x: 294, label: "Database" },
    { x: 378, label: "Inngest" },
    { x: 455, label: "Node\nExecutor" },
  ];

  const topY = 55;
  const bottomY = 574;

  // ── Sub-components ─────────────────────────────────────────────────────────

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
        {lines.map((line, j) => (
          <SvgText
            key={j}
            x={x}
            y={topY - boxH + 11 + j * 10}
            textAnchor="middle"
            style={{ fontSize: 7, fontFamily: "Times-Bold", fill: colors.text }}
          >
            {line}
          </SvgText>
        ))}
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

  // Solid arrow with white label background
  const SolidArrow = ({
    from,
    to,
    y,
    label,
    lw = 80,
  }: {
    from: number;
    to: number;
    y: number;
    label: string;
    lw?: number;
  }) => {
    const x1 = parts[from].x;
    const x2 = parts[to].x;
    const dir = x2 > x1 ? 1 : -1;
    const midX = (x1 + x2) / 2;
    return (
      <G>
        <Line x1={x1} y1={y} x2={x2} y2={y} stroke={colors.message} strokeWidth={1} />
        <Line x1={x2 - dir * 6} y1={y - 3} x2={x2} y2={y} stroke={colors.message} strokeWidth={1} />
        <Line x1={x2 - dir * 6} y1={y + 3} x2={x2} y2={y} stroke={colors.message} strokeWidth={1} />
        <Rect x={midX - lw / 2} y={y - 12} width={lw} height={9} rx={1} fill="white" opacity={0.92} />
        <SvgText
          x={midX}
          y={y - 5}
          textAnchor="middle"
          style={{ fontSize: 6.5, fontFamily: "Times-Roman", fill: colors.text }}
        >
          {label}
        </SvgText>
      </G>
    );
  };

  // Dashed arrow (return) with white label background
  const DashedArrow = ({
    from,
    to,
    y,
    label,
    lw = 68,
  }: {
    from: number;
    to: number;
    y: number;
    label: string;
    lw?: number;
  }) => {
    const x1 = parts[from].x;
    const x2 = parts[to].x;
    const dir = x2 > x1 ? 1 : -1;
    const midX = (x1 + x2) / 2;
    return (
      <G>
        <Line
          x1={x1}
          y1={y}
          x2={x2}
          y2={y}
          stroke={colors.ret}
          strokeWidth={0.8}
          strokeDasharray="4,2"
        />
        <Line x1={x2 - dir * 6} y1={y - 3} x2={x2} y2={y} stroke={colors.ret} strokeWidth={0.8} />
        <Line x1={x2 - dir * 6} y1={y + 3} x2={x2} y2={y} stroke={colors.ret} strokeWidth={0.8} />
        <Rect x={midX - lw / 2} y={y - 11} width={lw} height={9} rx={1} fill="white" opacity={0.92} />
        <SvgText
          x={midX}
          y={y - 4}
          textAnchor="middle"
          style={{ fontSize: 6, fontFamily: "Times-Italic", fill: colors.ret }}
        >
          {label}
        </SvgText>
      </G>
    );
  };

  // Activation bar
  const Act = ({ i, y1, y2 }: { i: number; y1: number; y2: number }) => (
    <Rect
      x={parts[i].x - 4}
      y={y1}
      width={8}
      height={y2 - y1}
      fill={colors.actBar}
      stroke={colors.actBarBorder}
      strokeWidth={0.8}
    />
  );

  // Phase label (left margin)
  const PhaseLabel = ({ label, y }: { label: string; y: number }) => (
    <SvgText
      x={8}
      y={y}
      style={{ fontSize: 7, fontFamily: "Times-Bold", fill: colors.phase }}
    >
      {label}
    </SvgText>
  );

  // Note box
  const Note = ({ x, y, w, text }: { x: number; y: number; w: number; text: string }) => (
    <G>
      <Rect x={x} y={y} width={w} height={14} rx={2} fill={colors.note} stroke={colors.noteBorder} strokeWidth={0.8} />
      <SvgText
        x={x + w / 2}
        y={y + 9}
        textAnchor="middle"
        style={{ fontSize: 6.5, fontFamily: "Times-Italic", fill: colors.label }}
      >
        {text}
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

      {/* ── Participants ───────────────────────────────────────────────────── */}
      {parts.map((p, i) => (
        <Participant key={i} x={p.x} label={p.label} />
      ))}

      {/* ── Activation bars ────────────────────────────────────────────────── */}
      {/* Phase 1 */}
      <Act i={1} y1={73} y2={127} />
      <Act i={2} y1={85} y2={121} />
      <Act i={3} y1={97} y2={113} />
      {/* Phase 2 */}
      <Act i={1} y1={151} y2={201} />
      <Act i={2} y1={163} y2={197} />
      <Act i={3} y1={175} y2={185} />
      {/* Phase 3 */}
      <Act i={2} y1={225} y2={247} />
      <Act i={4} y1={233} y2={245} />
      {/* Loop – Inngest holds activation for entire loop */}
      <Act i={4} y1={279} y2={441} />
      {/* Loop iteration 1 */}
      <Act i={5} y1={299} y2={351} />
      <Act i={3} y1={313} y2={339} />
      {/* Loop iteration 2 */}
      <Act i={5} y1={375} y2={427} />
      <Act i={3} y1={389} y2={415} />
      {/* Phase 5 */}
      <Act i={2} y1={503} y2={553} />
      <Act i={3} y1={515} y2={529} />
      <Act i={1} y1={539} y2={557} />

      {/* ── LOOP fragment ──────────────────────────────────────────────────── */}
      <Rect
        x={346}
        y={281}
        width={141}
        height={158}
        fill="none"
        stroke={colors.loop}
        strokeWidth={0.8}
        strokeDasharray="6,3"
      />
      {/* Fragment keyword tab */}
      <Rect x={346} y={281} width={36} height={12} fill={colors.loopFill} stroke={colors.loop} strokeWidth={0.8} />
      <SvgText
        x={364}
        y={290}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: colors.loop }}
      >
        LOOP
      </SvgText>
      {/* Guard condition */}
      <SvgText
        x={350}
        y={302}
        style={{ fontSize: 6, fontFamily: "Times-Italic", fill: colors.loop }}
      >
        For each node (BFS order)
      </SvgText>

      {/* ── Phase labels ────────────────────────────────────────────────────── */}
      <PhaseLabel label="1. TRIGGER"  y={65} />
      <PhaseLabel label="2. INIT"     y={143} />
      <PhaseLabel label="3. QUEUE"    y={217} />
      <PhaseLabel label="5. COMPLETE" y={497} />

      {/* ── Phase 1: TRIGGER ─────────────────────────────────────────────────── */}
      <SolidArrow  from={0} to={1} y={79}  label="Click 'Execute Workflow'" lw={96} />
      <SolidArrow  from={1} to={2} y={93}  label="executeWorkflow(id)"      lw={82} />
      <SolidArrow  from={2} to={3} y={107} label="Load workflow + nodes"    lw={86} />
      <DashedArrow from={3} to={2} y={119} label="Workflow data"            lw={66} />
      <DashedArrow from={2} to={1} y={131} label="Execution started"        lw={72} />

      {/* ── Phase 2: INIT ────────────────────────────────────────────────────── */}
      <SolidArrow  from={0} to={1} y={157} label="Show loading state"         lw={80} />
      <SolidArrow  from={1} to={2} y={171} label="createExecution()"          lw={78} />
      <SolidArrow  from={2} to={3} y={185} label="INSERT execution record"    lw={94} />
      <DashedArrow from={3} to={2} y={197} label="Execution ID"               lw={60} />
      <DashedArrow from={2} to={1} y={211} label="executionId"                lw={55} />

      {/* ── Phase 3: QUEUE ───────────────────────────────────────────────────── */}
      <SolidArrow  from={2} to={4} y={237} label="inngest.send('workflow/execute')" lw={132} />
      <DashedArrow from={4} to={2} y={251} label="Event acknowledged"               lw={90} />

      {/* Note: async boundary */}
      <Note x={10} y={261} w={94} text="Async processing begins" />

      {/* ── Loop iteration 1 ─────────────────────────────────────────────────── */}
      <SolidArrow  from={4} to={5} y={311} label="executeNode(node)"  lw={82} />
      <SolidArrow  from={5} to={3} y={325} label="Fetch credentials"  lw={78} />
      <DashedArrow from={3} to={5} y={339} label="Decrypted creds"    lw={72} />
      <DashedArrow from={5} to={4} y={353} label="Node result"        lw={56} />

      {/* Note: loop continues */}
      <Note x={349} y={363} w={90} text="Next node in BFS queue" />

      {/* ── Loop iteration 2 ─────────────────────────────────────────────────── */}
      <SolidArrow  from={4} to={5} y={387} label="executeNode(nextNode)" lw={94} />
      <SolidArrow  from={5} to={3} y={401} label="Call external API"    lw={78} />
      <DashedArrow from={3} to={5} y={415} label="API response"         lw={62} />
      <DashedArrow from={5} to={4} y={429} label="Node result"          lw={56} />

      {/* ── Phase 5: COMPLETE ────────────────────────────────────────────────── */}
      <SolidArrow  from={4} to={2} y={509} label="Execution complete event"      lw={108} />
      <SolidArrow  from={2} to={3} y={523} label="UPDATE status = 'completed'"  lw={106} />
      <DashedArrow from={3} to={2} y={537} label="Updated"                       lw={50} />
      <SolidArrow  from={2} to={1} y={551} label="Push notification"             lw={78} />
      <DashedArrow from={1} to={0} y={563} label="Show results"                  lw={62} />
    </Svg>
  );
}
