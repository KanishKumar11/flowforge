import {
  Svg,
  G,
  Rect,
  Text as SvgText,
  Line,
  Circle,
  Path,
} from "@react-pdf/renderer";

/**
 * Node Execution State Machine
 * PENDING → RUNNING → SUCCESS / FAILED / RETRY
 */
export default function NodeExecutionStateMachine() {
  const width = 495;
  const height = 320;
  const cx = width / 2;

  // State definitions
  const states = [
    {
      id: "pending",
      label: "PENDING",
      x: 80,
      y: 130,
      fill: "#f1f5f9",
      stroke: "#475569",
      desc: "queued",
    },
    {
      id: "running",
      label: "RUNNING",
      x: 245,
      y: 130,
      fill: "#dbeafe",
      stroke: "#2563eb",
      desc: "executing",
    },
    {
      id: "success",
      label: "SUCCESS",
      x: 410,
      y: 70,
      fill: "#dcfce7",
      stroke: "#16a34a",
      desc: "terminal",
    },
    {
      id: "failed",
      label: "FAILED",
      x: 410,
      y: 190,
      fill: "#fee2e2",
      stroke: "#dc2626",
      desc: "terminal",
    },
    {
      id: "retry",
      label: "RETRY",
      x: 245,
      y: 245,
      fill: "#fef3c7",
      stroke: "#d97706",
      desc: "back-off",
    },
  ];

  const stateW = 80;
  const stateH = 40;

  function getState(id: string) {
    return states.find((s) => s.id === id)!;
  }

  // Arrow with optional label
  function arrow(
    fromId: string,
    toId: string,
    label: string,
    labelOffset: { x: number; y: number } = { x: 0, y: -4 },
    color = "#475569",
  ) {
    const f = getState(fromId);
    const t = getState(toId);

    // Compute attachment points (from right edge of from-state to left edge of to-state, simplified)
    const x1 = f.x + stateW / 2;
    const y1 = f.y + stateH / 2;
    const x2 = t.x + stateW / 2;
    const y2 = t.y + stateH / 2;

    // Compute edge intersection (clip to rect edges)
    function clipToRect(cx0: number, cy0: number, x: number, y: number) {
      const dx = x - cx0;
      const dy = y - cy0;
      const halfW = stateW / 2;
      const halfH = stateH / 2;
      const tx = dx === 0 ? Infinity : Math.abs(halfW / dx);
      const ty = dy === 0 ? Infinity : Math.abs(halfH / dy);
      const tt = Math.min(tx, ty);
      return { x: cx0 + dx * tt, y: cy0 + dy * tt };
    }
    const start = clipToRect(x1, y1, x2, y2);
    const end = clipToRect(x2, y2, x1, y1);

    // Arrowhead
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const ah = 6;
    const ax1 = end.x - ah * Math.cos(angle - Math.PI / 6);
    const ay1 = end.y - ah * Math.sin(angle - Math.PI / 6);
    const ax2 = end.x - ah * Math.cos(angle + Math.PI / 6);
    const ay2 = end.y - ah * Math.sin(angle + Math.PI / 6);

    const midX = (start.x + end.x) / 2 + labelOffset.x;
    const midY = (start.y + end.y) / 2 + labelOffset.y;

    return (
      <G>
        <Line
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke={color}
          strokeWidth={1.4}
        />
        <Path
          d={`M ${end.x} ${end.y} L ${ax1} ${ay1} L ${ax2} ${ay2} Z`}
          fill={color}
        />
        <SvgText
          x={midX}
          y={midY}
          textAnchor="middle"
          style={{ fontSize: 7.5, fontFamily: "Times-Bold", fill: color }}
        >
          {label}
        </SvgText>
      </G>
    );
  }

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={cx}
        y={20}
        textAnchor="middle"
        style={{ fontSize: 11, fontFamily: "Times-Bold", fill: "#1a1a1a" }}
      >
        Node Execution State Machine
      </SvgText>
      <SvgText
        x={cx}
        y={34}
        textAnchor="middle"
        style={{ fontSize: 8, fontFamily: "Times-Italic", fill: "#475569" }}
      >
        Lifecycle of a single node within a workflow execution
      </SvgText>

      {/* Initial state marker */}
      <Circle cx={50} cy={150} r={5} fill="#1a1a1a" />
      <Line
        x1={55}
        y1={150}
        x2={80}
        y2={150}
        stroke="#1a1a1a"
        strokeWidth={1.2}
      />
      <Path d="M 80 150 L 74 147 L 74 153 Z" fill="#1a1a1a" />

      {/* State boxes */}
      {states.map((s) => (
        <G key={s.id}>
          <Rect
            x={s.x}
            y={s.y}
            width={stateW}
            height={stateH}
            rx={6}
            fill={s.fill}
            stroke={s.stroke}
            strokeWidth={1.5}
          />
          <SvgText
            x={s.x + stateW / 2}
            y={s.y + stateH / 2 - 1}
            textAnchor="middle"
            style={{ fontSize: 9, fontFamily: "Times-Bold", fill: s.stroke }}
          >
            {s.label}
          </SvgText>
          <SvgText
            x={s.x + stateW / 2}
            y={s.y + stateH / 2 + 10}
            textAnchor="middle"
            style={{
              fontSize: 6.5,
              fontFamily: "Times-Italic",
              fill: "#64748b",
            }}
          >
            {s.desc}
          </SvgText>
        </G>
      ))}

      {/* Terminal markers (double border) */}
      <Rect
        x={408}
        y={68}
        width={84}
        height={44}
        rx={7}
        fill="none"
        stroke="#16a34a"
        strokeWidth={0.8}
      />
      <Rect
        x={408}
        y={188}
        width={84}
        height={44}
        rx={7}
        fill="none"
        stroke="#dc2626"
        strokeWidth={0.8}
      />

      {/* Transitions */}
      {arrow(
        "pending",
        "running",
        "executor picks up",
        { x: 0, y: -8 },
        "#475569",
      )}
      {arrow("running", "success", "exit code 0", { x: 0, y: -8 }, "#16a34a")}
      {arrow("running", "failed", "max retries", { x: 18, y: -2 }, "#dc2626")}
      {/* RUNNING→RETRY and RETRY→RUNNING share the same vertical; offset labels to opposite sides */}
      {arrow("running", "retry", "transient err", { x: -44, y: 0 }, "#d97706")}
      {arrow("retry", "running", "after backoff", { x: +44, y: 0 }, "#d97706")}

      {/* Bottom legend */}
      <G>
        <Rect
          x={20}
          y={290}
          width={width - 40}
          height={22}
          rx={3}
          fill="#fafafa"
          stroke="#e2e8f0"
          strokeWidth={0.6}
        />
        <SvgText
          x={30}
          y={304}
          style={{
            fontSize: 7,
            fontFamily: "Times-Bold",
            fill: "#1a1a1a",
            letterSpacing: 0.5,
          }}
        >
          GUARDS:
        </SvgText>
        <SvgText
          x={75}
          y={304}
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: "#475569" }}
        >
          timeout = 30s · max retries = 3 · backoff = exponential (1s, 2s, 4s)
        </SvgText>
      </G>
    </Svg>
  );
}
