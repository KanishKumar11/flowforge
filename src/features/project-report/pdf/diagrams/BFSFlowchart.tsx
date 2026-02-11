/**
 * BFS Execution Flowchart
 * Algorithm flowchart showing the queue-based BFS workflow execution
 * For Chapter 8 (Implementation)
 */
import {
  Svg,
  G,
  Rect,
  Text as SvgText,
  Line,
  Polygon,
  Circle,
} from "@react-pdf/renderer";

export default function BFSFlowchart() {
  const width = 495;
  const height = 480;

  const colors = {
    text: "#1a1a1a",
    label: "#555555",
    process: "#E3F2FD",
    processBorder: "#1565C0",
    decision: "#FFF3E0",
    decisionBorder: "#E65100",
    io: "#E8F5E9",
    ioBorder: "#2E7D32",
    start: "#2E7D32",
    end: "#C62828",
    arrow: "#444444",
    note: "#FFFDE7",
    noteBorder: "#F57F17",
  };

  const cx = width / 2;

  // Process box
  const Process = ({
    x,
    y,
    w,
    h,
    lines,
  }: {
    x: number;
    y: number;
    w: number;
    h: number;
    lines: string[];
  }) => (
    <G>
      <Rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        fill={colors.process}
        stroke={colors.processBorder}
        strokeWidth={1.2}
      />
      {lines.map((line, i) => (
        <SvgText
          key={i}
          x={x + w / 2}
          y={y + h / 2 - (lines.length - 1) * 6 + i * 12 + 3}
          textAnchor="middle"
          style={{
            fontSize: 8,
            fontFamily: i === 0 ? "Times-Bold" : "Times-Roman",
            fill: colors.text,
          }}
        >
          {line}
        </SvgText>
      ))}
    </G>
  );

  // Decision diamond
  const Decision = ({
    x,
    y,
    size,
    label,
  }: {
    x: number;
    y: number;
    size: number;
    label: string;
  }) => {
    const half = size / 2;
    return (
      <G>
        <Polygon
          points={`${x},${y - half} ${x + half},${y} ${x},${y + half} ${x - half},${y}`}
          fill={colors.decision}
          stroke={colors.decisionBorder}
          strokeWidth={1.2}
        />
        <SvgText
          x={x}
          y={y + 3}
          textAnchor="middle"
          style={{
            fontSize: 8,
            fontFamily: "Times-Bold",
            fill: colors.text,
          }}
        >
          {label}
        </SvgText>
      </G>
    );
  };

  // Arrow
  const Arrow = ({
    x1,
    y1,
    x2,
    y2,
    label,
    labelDx,
    labelDy,
  }: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    label?: string;
    labelDx?: number;
    labelDy?: number;
  }) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len;
    const uy = dy / len;
    const px = -uy;
    const py = ux;

    return (
      <G>
        <Line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={colors.arrow}
          strokeWidth={1}
        />
        <Polygon
          points={`${x2},${y2} ${x2 - ux * 6 + px * 3},${y2 - uy * 6 + py * 3} ${x2 - ux * 6 - px * 3},${y2 - uy * 6 - py * 3}`}
          fill={colors.arrow}
        />
        {label && (
          <SvgText
            x={(x1 + x2) / 2 + (labelDx || 0)}
            y={(y1 + y2) / 2 + (labelDy || -4)}
            textAnchor="middle"
            style={{
              fontSize: 7,
              fontFamily: "Times-Bold",
              fill: "#555555",
            }}
          >
            {label}
          </SvgText>
        )}
      </G>
    );
  };

  // Note box
  const Note = ({
    x,
    y,
    w,
    h,
    text,
  }: {
    x: number;
    y: number;
    w: number;
    h: number;
    text: string;
  }) => (
    <G>
      <Rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={3}
        fill={colors.note}
        stroke={colors.noteBorder}
        strokeWidth={0.8}
      />
      <SvgText
        x={x + w / 2}
        y={y + h / 2 + 3}
        textAnchor="middle"
        style={{
          fontSize: 7,
          fontFamily: "Times-Italic",
          fill: "#555555",
        }}
      >
        {text}
      </SvgText>
    </G>
  );

  const boxW = 170;
  const boxH = 32;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={width / 2}
        y={18}
        textAnchor="middle"
        style={{
          fontSize: 11,
          fontFamily: "Times-Bold",
          fill: colors.text,
        }}
      >
        BFS Workflow Execution Algorithm
      </SvgText>

      {/* Start */}
      <Circle cx={cx} cy={42} r={10} fill={colors.start} />
      <SvgText
        x={cx}
        y={46}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#FFFFFF" }}
      >
        Start
      </SvgText>

      {/* Step 1: Load workflow */}
      <Arrow x1={cx} y1={52} x2={cx} y2={68} />
      <Process
        x={cx - boxW / 2}
        y={68}
        w={boxW}
        h={boxH}
        lines={["Load Workflow", "Definition from DB"]}
      />
      <Note
        x={cx + boxW / 2 + 12}
        y={100}
        w={120}
        h={22}
        text="Prisma ORM query"
      />

      {/* Step 2: Find trigger node */}
      <Arrow x1={cx} y1={100} x2={cx} y2={116} />
      <Process
        x={cx - boxW / 2}
        y={116}
        w={boxW}
        h={boxH}
        lines={["Find Trigger Node", "Initialize Queue"]}
      />
      <Note
        x={cx + boxW / 2 + 12}
        y={120}
        w={120}
        h={22}
        text="queue = [triggerNode]"
      />

      {/* Step 3: Create visited set */}
      <Arrow x1={cx} y1={148} x2={cx} y2={164} />
      <Process
        x={cx - boxW / 2}
        y={164}
        w={boxW}
        h={boxH}
        lines={["Create Visited Set", "Mark Trigger as Visited"]}
      />
      <Note
        x={cx + boxW / 2 + 12}
        y={168}
        w={120}
        h={22}
        text="visited = new Set()"
      />

      {/* Decision: Queue empty? */}
      <Arrow x1={cx} y1={196} x2={cx} y2={218} />
      <Decision x={cx} y={236} size={34} label="Queue Empty?" />

      {/* Yes → End */}
      <Line
        x1={cx + 17}
        y1={236}
        x2={cx + 90}
        y2={236}
        stroke={colors.arrow}
        strokeWidth={1}
      />
      <SvgText
        x={cx + 50}
        y={222}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#2E7D32" }}
      >
        Yes
      </SvgText>
      <Arrow x1={cx + 90} y1={236} x2={cx + 90} y2={450} />
      {/* End node at bottom connected later */}

      {/* No → Dequeue */}
      <SvgText
        x={cx + 8}
        y={256}
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#C62828" }}
      >
        No
      </SvgText>
      <Arrow x1={cx} y1={253} x2={cx} y2={274} />

      {/* Step 4: Dequeue node */}
      <Process
        x={cx - boxW / 2}
        y={274}
        w={boxW}
        h={boxH}
        lines={["Dequeue Node", "from Front of Queue"]}
      />

      {/* Decision: Already visited? */}
      <Arrow x1={cx} y1={306} x2={cx} y2={326} />
      <Decision x={cx} y={342} size={34} label="Visited?" />

      {/* Yes → skip, loop back */}
      <Line
        x1={cx - 17}
        y1={342}
        x2={cx - 100}
        y2={342}
        stroke={colors.arrow}
        strokeWidth={1}
      />
      <SvgText
        x={cx - 56}
        y={336}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#2E7D32" }}
      >
        Yes (Skip)
      </SvgText>
      <Line
        x1={cx - 100}
        y1={342}
        x2={cx - 100}
        y2={236}
        stroke={colors.arrow}
        strokeWidth={1}
      />
      <Arrow x1={cx - 100} y1={236} x2={cx - 17} y2={236} />

      {/* No → Execute */}
      <SvgText
        x={cx + 8}
        y={362}
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#C62828" }}
      >
        No
      </SvgText>
      <Arrow x1={cx} y1={359} x2={cx} y2={376} />

      {/* Step 5: Execute node */}
      <Process
        x={cx - boxW / 2}
        y={376}
        w={boxW}
        h={boxH}
        lines={["Execute Node as", "Inngest Durable Step"]}
      />
      <Note
        x={cx - boxW / 2 - 132}
        y={380}
        w={120}
        h={22}
        text="step.run(nodeId, fn)"
      />

      {/* Decision: Conditional? */}
      <Arrow x1={cx} y1={408} x2={cx} y2={424} />

      {/* Step 6: Enqueue children */}
      <Process
        x={cx - boxW / 2}
        y={424}
        w={boxW}
        h={32}
        lines={["Enqueue Child Nodes", "(Filter if Conditional)"]}
      />
      <Note
        x={cx + boxW / 2 + 12}
        y={428}
        w={125}
        h={22}
        text="if/switch: match only"
      />

      {/* Loop back to Queue Empty? */}
      <Arrow x1={cx} y1={456} x2={cx} y2={468} />
      <Line
        x1={cx}
        y1={468}
        x2={cx - 140}
        y2={468}
        stroke={colors.arrow}
        strokeWidth={1}
      />
      <Line
        x1={cx - 140}
        y1={468}
        x2={cx - 140}
        y2={236}
        stroke={colors.arrow}
        strokeWidth={1}
      />
      <Arrow x1={cx - 140} y1={236} x2={cx - 100} y2={236} />

      {/* End node */}
      <Circle
        cx={cx + 90}
        cy={460}
        r={10}
        fill="none"
        stroke={colors.end}
        strokeWidth={1.5}
      />
      <Circle cx={cx + 90} cy={460} r={6} fill={colors.end} />
      <SvgText
        x={cx + 90}
        y={476}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: colors.label }}
      >
        Complete
      </SvgText>
    </Svg>
  );
}
