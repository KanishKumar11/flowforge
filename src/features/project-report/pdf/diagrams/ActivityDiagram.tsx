/**
 * Activity Diagram - Workflow Execution Flow
 * UML Activity Diagram showing the complete workflow execution lifecycle
 * with decision points, fork/join bars, and swim lanes
 * For Chapter 7 (System Design)
 */
import {
  Svg,
  G,
  Rect,
  Text as SvgText,
  Line,
  Circle,
  Polygon,
  Ellipse,
} from "@react-pdf/renderer";

export default function ActivityDiagram() {
  const width = 495;
  const height = 560;

  const colors = {
    text: "#1a1a1a",
    label: "#555555",
    activity: "#E3F2FD",
    activityBorder: "#1565C0",
    decision: "#FFF3E0",
    decisionBorder: "#E65100",
    forkJoin: "#333333",
    start: "#2E7D32",
    end: "#C62828",
    arrow: "#444444",
    swimlane: "#F5F5F5",
    swimlaneBorder: "#BDBDBD",
    note: "#FFFDE7",
    noteBorder: "#FBC02D",
  };

  // Swim lane boundaries
  const lane1X = 10; // User Interface
  const lane2X = 175; // Backend / API
  const lane3X = 340; // Execution Engine
  const laneW = 155;
  const laneHeaderH = 28;
  const laneTopY = 32;
  const laneBottomY = height - 10;

  // Activity box helper
  const Activity = ({
    x,
    y,
    w,
    h,
    label,
    lines,
  }: {
    x: number;
    y: number;
    w: number;
    h: number;
    label?: string;
    lines?: string[];
  }) => {
    const textLines = lines || [label];
    return (
      <G>
        <Rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={8}
          fill={colors.activity}
          stroke={colors.activityBorder}
          strokeWidth={1.2}
        />
        {textLines.map((line, i) => (
          <SvgText
            key={i}
            x={x + w / 2}
            y={y + h / 2 - (textLines.length - 1) * 6 + i * 12}
            textAnchor="middle"
            style={{
              fontSize: 8,
              fontFamily: "Times-Roman",
              fill: colors.text,
            }}
          >
            {line}
          </SvgText>
        ))}
      </G>
    );
  };

  // Diamond decision node
  const Decision = ({
    cx,
    cy,
    size,
    label,
  }: {
    cx: number;
    cy: number;
    size: number;
    label: string;
  }) => {
    const half = size / 2;
    return (
      <G>
        <Polygon
          points={`${cx},${cy - half} ${cx + half},${cy} ${cx},${cy + half} ${cx - half},${cy}`}
          fill={colors.decision}
          stroke={colors.decisionBorder}
          strokeWidth={1.2}
        />
        <SvgText
          x={cx}
          y={cy + 3}
          textAnchor="middle"
          style={{
            fontSize: 7,
            fontFamily: "Times-Bold",
            fill: colors.text,
          }}
        >
          {label}
        </SvgText>
      </G>
    );
  };

  // Arrow with head
  const Arrow = ({
    x1,
    y1,
    x2,
    y2,
    label,
    labelSide,
  }: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    label?: string;
    labelSide?: "left" | "right";
  }) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len;
    const uy = dy / len;
    const headLen = 6;
    const headW = 3;
    // Perpendicular
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
        {/* Arrowhead */}
        <Polygon
          points={`${x2},${y2} ${x2 - ux * headLen + px * headW},${y2 - uy * headLen + py * headW} ${x2 - ux * headLen - px * headW},${y2 - uy * headLen - py * headW}`}
          fill={colors.arrow}
        />
        {label && (
          <SvgText
            x={
              (x1 + x2) / 2 +
              (labelSide === "left" ? -8 : labelSide === "right" ? 8 : 0)
            }
            y={(y1 + y2) / 2 - 4}
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
  };

  // Fork/Join bar
  const Bar = ({ x, y, w }: { x: number; y: number; w: number }) => (
    <Rect x={x} y={y} width={w} height={4} rx={2} fill={colors.forkJoin} />
  );

  // Center of each lane
  const c1 = lane1X + laneW / 2;
  const c2 = lane2X + laneW / 2;
  const c3 = lane3X + laneW / 2;

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
        Workflow Execution Activity Diagram
      </SvgText>

      {/* Swim Lanes */}
      {[
        { x: lane1X, label: "User Interface" },
        { x: lane2X, label: "Backend / API" },
        { x: lane3X, label: "Execution Engine" },
      ].map((lane, i) => (
        <G key={i}>
          <Rect
            x={lane.x}
            y={laneTopY}
            width={laneW}
            height={laneBottomY - laneTopY}
            fill={i % 2 === 0 ? colors.swimlane : "#FFFFFF"}
            stroke={colors.swimlaneBorder}
            strokeWidth={0.8}
          />
          <Rect
            x={lane.x}
            y={laneTopY}
            width={laneW}
            height={laneHeaderH}
            fill="#E0E0E0"
            stroke={colors.swimlaneBorder}
            strokeWidth={0.8}
          />
          <SvgText
            x={lane.x + laneW / 2}
            y={laneTopY + laneHeaderH / 2 + 4}
            textAnchor="middle"
            style={{
              fontSize: 9,
              fontFamily: "Times-Bold",
              fill: colors.text,
            }}
          >
            {lane.label}
          </SvgText>
        </G>
      ))}

      {/* ── Flow ── */}

      {/* Start node */}
      <Circle cx={c1} cy={80} r={8} fill={colors.start} />

      {/* A1: User triggers workflow */}
      <Arrow x1={c1} y1={88} x2={c1} y2={100} />
      <Activity x={c1 - 60} y={100} w={120} h={28} label="Trigger Workflow" />

      {/* Arrow to API */}
      <Arrow x1={c1 + 60} y1={114} x2={c2 - 60} y2={114} label="HTTP Request" />

      {/* A2: Validate request */}
      <Activity x={c2 - 60} y={100} w={120} h={28} label="Validate Request" />

      {/* Arrow down to decision */}
      <Arrow x1={c2} y1={128} x2={c2} y2={145} />

      {/* D1: Valid? */}
      <Decision cx={c2} cy={162} size={30} label="Valid?" />

      {/* No branch - back to UI */}
      <Line
        x1={c2 - 15}
        y1={162}
        x2={c1 + 60}
        y2={162}
        stroke={colors.arrow}
        strokeWidth={1}
      />
      <Activity x={c1 - 60} y={149} w={120} h={26} label="Show Error" />
      <SvgText
        x={c1 + 65}
        y={158}
        style={{ fontSize: 7, fontFamily: "Times-Italic", fill: "#C62828" }}
      >
        [No]
      </SvgText>

      {/* Yes branch down */}
      <Arrow x1={c2} y1={177} x2={c2} y2={195} label="[Yes]" />

      {/* A3: Load workflow definition */}
      <Activity x={c2 - 60} y={195} w={120} h={28} label="Load Workflow" />

      {/* Arrow to execution engine */}
      <Arrow x1={c2 + 60} y1={209} x2={c3 - 60} y2={209} label="Dispatch" />

      {/* A4: Initialize execution */}
      <Activity
        x={c3 - 60}
        y={195}
        w={120}
        h={28}
        label="Initialize Execution"
      />

      {/* Arrow down to fork */}
      <Arrow x1={c3} y1={223} x2={c3} y2={240} />

      {/* Fork bar */}
      <Bar x={c3 - 50} y={240} w={100} />

      {/* Parallel: Resolve nodes + Load credentials */}
      <Arrow x1={c3 - 25} y1={244} x2={c3 - 25} y2={258} />
      <Arrow x1={c3 + 25} y1={244} x2={c3 + 25} y2={258} />

      <Activity x={c3 - 70} y={258} w={85} h={28} label="Resolve Nodes" />
      <Activity
        x={c3 - 5}
        y={258}
        w={85}
        h={28}
        lines={["Load", "Credentials"]}
      />

      {/* Join bar */}
      <Arrow x1={c3 - 25} y1={286} x2={c3 - 25} y2={300} />
      <Arrow x1={c3 + 25} y1={286} x2={c3 + 25} y2={300} />
      <Bar x={c3 - 50} y={300} w={100} />

      {/* A5: BFS Execute nodes */}
      <Arrow x1={c3} y1={304} x2={c3} y2={318} />
      <Activity
        x={c3 - 60}
        y={318}
        w={120}
        h={28}
        lines={["Execute Nodes", "(BFS Order)"]}
      />

      {/* Decision: More nodes? */}
      <Arrow x1={c3} y1={346} x2={c3} y2={365} />
      <Decision cx={c3} cy={380} size={28} label="More?" />

      {/* Loop back */}
      <Line
        x1={c3 + 14}
        y1={380}
        x2={c3 + 70}
        y2={380}
        stroke={colors.arrow}
        strokeWidth={1}
      />
      <Line
        x1={c3 + 70}
        y1={380}
        x2={c3 + 70}
        y2={332}
        stroke={colors.arrow}
        strokeWidth={1}
      />
      <Arrow
        x1={c3 + 70}
        y1={332}
        x2={c3 + 60}
        y2={332}
        label="[Yes]"
        labelSide="left"
      />

      {/* No - continue */}
      <Arrow x1={c3} y1={394} x2={c3} y2={415} label="[No]" />

      {/* A6: Collect results */}
      <Activity x={c3 - 60} y={415} w={120} h={28} label="Collect Results" />

      {/* Arrow back to API */}
      <Arrow x1={c3 - 60} y1={429} x2={c2 + 60} y2={429} label="Return" />

      {/* A7: Save execution log */}
      <Activity
        x={c2 - 60}
        y={415}
        w={120}
        h={28}
        lines={["Save Execution", "Record"]}
      />

      {/* Arrow back to UI */}
      <Arrow x1={c2 - 60} y1={429} x2={c1 + 60} y2={429} label="Notify" />

      {/* A8: Display results */}
      <Activity x={c1 - 60} y={415} w={120} h={28} label="Display Results" />

      {/* Arrow down to decision */}
      <Arrow x1={c1} y1={443} x2={c1} y2={462} />

      {/* D2: Success? */}
      <Decision cx={c1} cy={478} size={28} label="Success?" />

      {/* Yes to end */}
      <SvgText
        x={c1 + 18}
        y={472}
        style={{ fontSize: 7, fontFamily: "Times-Italic", fill: "#2E7D32" }}
      >
        [Yes]
      </SvgText>
      <Arrow x1={c1} y1={492} x2={c1} y2={512} />

      {/* No - show retry */}
      <Line
        x1={c1 - 14}
        y1={478}
        x2={c1 - 60}
        y2={478}
        stroke={colors.arrow}
        strokeWidth={1}
      />
      <SvgText
        x={c1 - 40}
        y={472}
        style={{ fontSize: 7, fontFamily: "Times-Italic", fill: "#C62828" }}
      >
        [No]
      </SvgText>
      <SvgText
        x={c1 - 70}
        y={484}
        textAnchor="end"
        style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
      >
        Retry / Debug
      </SvgText>

      {/* End node (bullseye) */}
      <Circle
        cx={c1}
        cy={522}
        r={9}
        fill="none"
        stroke={colors.end}
        strokeWidth={1.5}
      />
      <Circle cx={c1} cy={522} r={5} fill={colors.end} />

      {/* Legend */}
      <G>
        <Rect
          x={340}
          y={480}
          width={145}
          height={68}
          rx={4}
          fill="#FAFAFA"
          stroke="#E0E0E0"
          strokeWidth={0.8}
        />
        <SvgText
          x={412}
          y={494}
          textAnchor="middle"
          style={{ fontSize: 8, fontFamily: "Times-Bold", fill: colors.text }}
        >
          Legend
        </SvgText>

        {/* Start */}
        <Circle cx={355} cy={506} r={5} fill={colors.start} />
        <SvgText
          x={365}
          y={509}
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
        >
          Initial Node
        </SvgText>

        {/* End */}
        <Circle
          cx={430}
          cy={506}
          r={5}
          fill="none"
          stroke={colors.end}
          strokeWidth={1}
        />
        <Circle cx={430} cy={506} r={3} fill={colors.end} />
        <SvgText
          x={440}
          y={509}
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
        >
          Final Node
        </SvgText>

        {/* Activity */}
        <Rect
          x={348}
          y={517}
          width={14}
          height={10}
          rx={3}
          fill={colors.activity}
          stroke={colors.activityBorder}
          strokeWidth={0.8}
        />
        <SvgText
          x={365}
          y={525}
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
        >
          Activity
        </SvgText>

        {/* Decision */}
        <Polygon
          points="437,517 443,523 437,529 431,523"
          fill={colors.decision}
          stroke={colors.decisionBorder}
          strokeWidth={0.8}
        />
        <SvgText
          x={448}
          y={526}
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
        >
          Decision
        </SvgText>

        {/* Fork/Join */}
        <Rect
          x={348}
          y={535}
          width={14}
          height={3}
          rx={1}
          fill={colors.forkJoin}
        />
        <SvgText
          x={365}
          y={540}
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
        >
          Fork / Join
        </SvgText>
      </G>
    </Svg>
  );
}
