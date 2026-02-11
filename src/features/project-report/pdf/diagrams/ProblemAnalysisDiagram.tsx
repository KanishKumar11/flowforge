/**
 * Problem Analysis Diagram
 * Shows key problems, their impact, and how Flowgent addresses them
 * For Chapter 2 (Problem Statement)
 */
import {
  Svg,
  G,
  Rect,
  Text as SvgText,
  Line,
  Circle,
  Polygon,
} from "@react-pdf/renderer";

export default function ProblemAnalysisDiagram() {
  const width = 495;
  const height = 420;

  const colors = {
    text: "#1a1a1a",
    label: "#555555",
    problem: "#C62828",
    problemBg: "#FFEBEE",
    impact: "#E65100",
    impactBg: "#FFF3E0",
    solution: "#1565C0",
    solutionBg: "#E3F2FD",
    center: "#2E7D32",
    centerBg: "#E8F5E9",
    arrow: "#888888",
    connector: "#BDBDBD",
  };

  const problems = [
    {
      title: "High Technical Barrier",
      impact: "90% non-dev users excluded",
      solution: "Visual Drag & Drop Editor",
    },
    {
      title: "Vendor Lock-in",
      impact: "Proprietary APIs, no control",
      solution: "Open-Source, Self-Hostable",
    },
    {
      title: "Integration Complexity",
      impact: "Custom code for each API",
      solution: "Pre-built Node Library",
    },
    {
      title: "Poor Reliability",
      impact: "Silent failures, no retry",
      solution: "Durable Execution Engine",
    },
  ];

  const centerX = width / 2;
  const centerY = height / 2 + 5;

  // Problem cards on left, solution cards on right
  const colProblemX = 15;
  const colImpactX = 155;
  const colSolutionX = 345;
  const cardW = 135;
  const cardH = 58;
  const cardGap = 16;
  const cardsStartY = 72;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={centerX}
        y={18}
        textAnchor="middle"
        style={{ fontSize: 11, fontFamily: "Times-Bold", fill: colors.text }}
      >
        Problem Analysis — Challenges & Solutions
      </SvgText>

      {/* Column headers */}
      <Rect
        x={colProblemX}
        y={40}
        width={cardW}
        height={20}
        rx={4}
        fill={colors.problem}
      />
      <SvgText
        x={colProblemX + cardW / 2}
        y={54}
        textAnchor="middle"
        style={{ fontSize: 8, fontFamily: "Times-Bold", fill: "#FFFFFF" }}
      >
        PROBLEMS
      </SvgText>

      <Rect
        x={colImpactX}
        y={40}
        width={cardW}
        height={20}
        rx={4}
        fill={colors.impact}
      />
      <SvgText
        x={colImpactX + cardW / 2}
        y={54}
        textAnchor="middle"
        style={{ fontSize: 8, fontFamily: "Times-Bold", fill: "#FFFFFF" }}
      >
        IMPACT
      </SvgText>

      <Rect
        x={colSolutionX}
        y={40}
        width={cardW}
        height={20}
        rx={4}
        fill={colors.solution}
      />
      <SvgText
        x={colSolutionX + cardW / 2}
        y={54}
        textAnchor="middle"
        style={{ fontSize: 8, fontFamily: "Times-Bold", fill: "#FFFFFF" }}
      >
        FLOWGENT SOLUTION
      </SvgText>

      {/* Problem → Impact → Solution rows */}
      {problems.map((item, i) => {
        const y = cardsStartY + i * (cardH + cardGap);
        const midY = y + cardH / 2;

        return (
          <G key={`row-${i}`}>
            {/* Problem card */}
            <Rect
              x={colProblemX}
              y={y}
              width={cardW}
              height={cardH}
              rx={5}
              fill={colors.problemBg}
              stroke={colors.problem}
              strokeWidth={1}
            />
            <Circle
              cx={colProblemX + 16}
              cy={y + 16}
              r={9}
              fill={colors.problem}
            />
            <SvgText
              x={colProblemX + 16}
              y={y + 20}
              textAnchor="middle"
              style={{ fontSize: 8, fontFamily: "Times-Bold", fill: "#FFFFFF" }}
            >
              {i + 1}
            </SvgText>
            <SvgText
              x={colProblemX + 32}
              y={y + 18}
              style={{
                fontSize: 8,
                fontFamily: "Times-Bold",
                fill: colors.text,
              }}
            >
              {item.title}
            </SvgText>
            <Line
              x1={colProblemX + 8}
              y1={y + 30}
              x2={colProblemX + cardW - 8}
              y2={y + 30}
              stroke={colors.problem}
              strokeWidth={0.5}
              opacity={0.3}
            />
            <SvgText
              x={colProblemX + 10}
              y={y + 44}
              style={{
                fontSize: 7,
                fontFamily: "Times-Roman",
                fill: colors.label,
              }}
            >
              {i === 0
                ? "Requires programming expertise"
                : i === 1
                  ? "Costly migration, data loss risk"
                  : i === 2
                    ? "Hours of boilerplate per service"
                    : "Undetected failures, data loss"}
            </SvgText>

            {/* Arrow: Problem → Impact */}
            <Line
              x1={colProblemX + cardW + 2}
              y1={midY}
              x2={colImpactX - 4}
              y2={midY}
              stroke={colors.arrow}
              strokeWidth={1}
            />
            <Polygon
              points={`${colImpactX - 1},${midY} ${colImpactX - 7},${midY - 3} ${colImpactX - 7},${midY + 3}`}
              fill={colors.arrow}
            />

            {/* Impact card */}
            <Rect
              x={colImpactX}
              y={y}
              width={cardW}
              height={cardH}
              rx={5}
              fill={colors.impactBg}
              stroke={colors.impact}
              strokeWidth={1}
            />
            <SvgText
              x={colImpactX + cardW / 2}
              y={y + 20}
              textAnchor="middle"
              style={{
                fontSize: 8,
                fontFamily: "Times-Bold",
                fill: colors.impact,
              }}
            >
              {item.impact}
            </SvgText>
            <Line
              x1={colImpactX + 8}
              y1={y + 30}
              x2={colImpactX + cardW - 8}
              y2={y + 30}
              stroke={colors.impact}
              strokeWidth={0.5}
              opacity={0.3}
            />
            <SvgText
              x={colImpactX + cardW / 2}
              y={y + 44}
              textAnchor="middle"
              style={{
                fontSize: 7,
                fontFamily: "Times-Roman",
                fill: colors.label,
              }}
            >
              {i === 0
                ? "Limits automation adoption"
                : i === 1
                  ? "Blocks growth & flexibility"
                  : i === 2
                    ? "Slows development cycles"
                    : "Creates business risk"}
            </SvgText>

            {/* Arrow: Impact → Solution */}
            <Line
              x1={colImpactX + cardW + 2}
              y1={midY}
              x2={colSolutionX - 4}
              y2={midY}
              stroke={colors.arrow}
              strokeWidth={1}
            />
            <Polygon
              points={`${colSolutionX - 1},${midY} ${colSolutionX - 7},${midY - 3} ${colSolutionX - 7},${midY + 3}`}
              fill={colors.arrow}
            />

            {/* Solution card */}
            <Rect
              x={colSolutionX}
              y={y}
              width={cardW}
              height={cardH}
              rx={5}
              fill={colors.solutionBg}
              stroke={colors.solution}
              strokeWidth={1}
            />
            <SvgText
              x={colSolutionX + cardW / 2}
              y={y + 20}
              textAnchor="middle"
              style={{
                fontSize: 8.5,
                fontFamily: "Times-Bold",
                fill: colors.solution,
              }}
            >
              {item.solution}
            </SvgText>
            <Line
              x1={colSolutionX + 8}
              y1={y + 30}
              x2={colSolutionX + cardW - 8}
              y2={y + 30}
              stroke={colors.solution}
              strokeWidth={0.5}
              opacity={0.3}
            />
            <SvgText
              x={colSolutionX + cardW / 2}
              y={y + 44}
              textAnchor="middle"
              style={{
                fontSize: 7,
                fontFamily: "Times-Roman",
                fill: colors.label,
              }}
            >
              {i === 0
                ? "No-code visual programming"
                : i === 1
                  ? "MIT license, full ownership"
                  : i === 2
                    ? "20+ connectors out-of-box"
                    : "Auto-retry with observability"}
            </SvgText>
          </G>
        );
      })}

      {/* Bottom summary bar */}
      <G>
        <Rect
          x={15}
          y={height - 38}
          width={465}
          height={28}
          rx={5}
          fill={colors.centerBg}
          stroke={colors.center}
          strokeWidth={1}
        />
        <SvgText
          x={centerX}
          y={height - 23}
          textAnchor="middle"
          style={{ fontSize: 9, fontFamily: "Times-Bold", fill: colors.center }}
        >
          Flowgent addresses all four critical gaps with a unified, open-source
          platform
        </SvgText>
      </G>
    </Svg>
  );
}
