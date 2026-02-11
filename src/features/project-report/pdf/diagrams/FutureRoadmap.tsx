/**
 * Future Roadmap — Clean two-column layout
 * Short-term features (left) and Long-term vision (right)
 * For Chapter 12 (Conclusions & Future Scope)
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

export default function FutureRoadmap() {
  const width = 495;
  const height = 440;

  const colors = {
    text: "#1a1a1a",
    label: "#555555",
    timeline: "#333333",
    shortTerm: "#1565C0",
    shortTermLight: "#E3F2FD",
    longTerm: "#6A1B9A",
    longTermLight: "#F3E5F5",
    high: "#C62828",
    medium: "#E65100",
  };

  const shortTermFeatures = [
    {
      version: "v1.1",
      name: "Database Nodes",
      desc: "PostgreSQL, MySQL, MongoDB connectors",
      priority: "High",
    },
    {
      version: "v1.2",
      name: "Custom Node SDK",
      desc: "Create & publish custom nodes",
      priority: "High",
    },
    {
      version: "v1.3",
      name: "Advanced Analytics",
      desc: "Execution metrics & cost tracking",
      priority: "Medium",
    },
    {
      version: "v1.4",
      name: "Workflow Sharing",
      desc: "Public template marketplace",
      priority: "Medium",
    },
    {
      version: "v1.5",
      name: "Multi-language Code",
      desc: "Python & TypeScript code nodes",
      priority: "Medium",
    },
  ];

  const longTermFeatures = [
    {
      name: "AI Workflow Builder",
      desc: "Natural language to workflow generation",
    },
    {
      name: "Node Marketplace",
      desc: "Community nodes with reviews & ratings",
    },
    { name: "Mobile Applications", desc: "iOS & Android workflow monitoring" },
    { name: "Enterprise Features", desc: "SSO, SOC 2, GDPR compliance" },
    { name: "On-Premise Deploy", desc: "Self-hosted deployment option" },
  ];

  const timelineY = 60;
  const timelineLeft = 30;
  const timelineRight = width - 30;
  const midX = width / 2;

  const colLeftX = 20;
  const colRightX = midX + 10;
  const cardW = midX - 40;
  const cardH = 52;
  const cardGap = 10;
  const cardsStartY = 100;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={width / 2}
        y={18}
        textAnchor="middle"
        style={{ fontSize: 11, fontFamily: "Times-Bold", fill: colors.text }}
      >
        Future Development Roadmap
      </SvgText>

      {/* Timeline bar */}
      <Rect
        x={timelineLeft}
        y={timelineY - 3}
        width={midX - timelineLeft - 5}
        height={6}
        rx={3}
        fill={colors.shortTerm}
      />
      <Rect
        x={midX + 5}
        y={timelineY - 3}
        width={timelineRight - midX - 5}
        height={6}
        rx={3}
        fill={colors.longTerm}
      />
      <Polygon
        points={`${timelineRight + 6},${timelineY} ${timelineRight - 2},${timelineY - 5} ${timelineRight - 2},${timelineY + 5}`}
        fill={colors.longTerm}
      />

      {/* Phase headings */}
      <SvgText
        x={(timelineLeft + midX) / 2}
        y={timelineY - 12}
        textAnchor="middle"
        style={{
          fontSize: 9,
          fontFamily: "Times-Bold",
          fill: colors.shortTerm,
        }}
      >
        Short-Term (v1.1 – v1.5)
      </SvgText>
      <SvgText
        x={(midX + timelineRight) / 2}
        y={timelineY - 12}
        textAnchor="middle"
        style={{ fontSize: 9, fontFamily: "Times-Bold", fill: colors.longTerm }}
      >
        Long-Term (v2.0+)
      </SvgText>

      {/* Subtitles */}
      <SvgText
        x={(timelineLeft + midX) / 2}
        y={timelineY + 16}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Italic", fill: colors.label }}
      >
        1–6 months post-launch
      </SvgText>
      <SvgText
        x={(midX + timelineRight) / 2}
        y={timelineY + 16}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Italic", fill: colors.label }}
      >
        6–18 months vision
      </SvgText>

      {/* Divider */}
      <Line
        x1={midX}
        y1={timelineY + 25}
        x2={midX}
        y2={cardsStartY + 5 * (cardH + cardGap)}
        stroke="#E0E0E0"
        strokeWidth={1}
        strokeDasharray="4,3"
      />

      {/* Short-term feature cards */}
      {shortTermFeatures.map((feat, i) => {
        const y = cardsStartY + i * (cardH + cardGap);
        const isHigh = feat.priority === "High";
        return (
          <G key={`short-${i}`}>
            <Rect
              x={colLeftX}
              y={y}
              width={cardW}
              height={cardH}
              rx={4}
              fill={colors.shortTermLight}
              stroke={colors.shortTerm}
              strokeWidth={1}
            />
            <Rect
              x={colLeftX + 6}
              y={y + 6}
              width={36}
              height={16}
              rx={8}
              fill={colors.shortTerm}
            />
            <SvgText
              x={colLeftX + 24}
              y={y + 17}
              textAnchor="middle"
              style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#FFFFFF" }}
            >
              {feat.version}
            </SvgText>
            <SvgText
              x={colLeftX + 50}
              y={y + 17}
              style={{
                fontSize: 9,
                fontFamily: "Times-Bold",
                fill: colors.text,
              }}
            >
              {feat.name}
            </SvgText>
            <Rect
              x={colLeftX + cardW - 54}
              y={y + 5}
              width={46}
              height={16}
              rx={3}
              fill={isHigh ? "#FFEBEE" : "#FFF3E0"}
              stroke={isHigh ? colors.high : colors.medium}
              strokeWidth={0.8}
            />
            <SvgText
              x={colLeftX + cardW - 31}
              y={y + 16}
              textAnchor="middle"
              style={{
                fontSize: 7,
                fontFamily: "Times-Bold",
                fill: isHigh ? colors.high : colors.medium,
              }}
            >
              {feat.priority}
            </SvgText>
            <SvgText
              x={colLeftX + 12}
              y={y + 38}
              style={{
                fontSize: 7,
                fontFamily: "Times-Roman",
                fill: colors.label,
              }}
            >
              {feat.desc}
            </SvgText>
          </G>
        );
      })}

      {/* Long-term feature cards */}
      {longTermFeatures.map((feat, i) => {
        const y = cardsStartY + i * (cardH + cardGap);
        return (
          <G key={`long-${i}`}>
            <Rect
              x={colRightX}
              y={y}
              width={cardW}
              height={cardH}
              rx={4}
              fill={colors.longTermLight}
              stroke={colors.longTerm}
              strokeWidth={1}
            />
            <Circle
              cx={colRightX + 18}
              cy={y + 16}
              r={10}
              fill={colors.longTerm}
            />
            <SvgText
              x={colRightX + 18}
              y={y + 20}
              textAnchor="middle"
              style={{ fontSize: 8, fontFamily: "Times-Bold", fill: "#FFFFFF" }}
            >
              {i + 1}
            </SvgText>
            <SvgText
              x={colRightX + 34}
              y={y + 17}
              style={{
                fontSize: 9,
                fontFamily: "Times-Bold",
                fill: colors.text,
              }}
            >
              {feat.name}
            </SvgText>
            <SvgText
              x={colRightX + 12}
              y={y + 38}
              style={{
                fontSize: 7,
                fontFamily: "Times-Roman",
                fill: colors.label,
              }}
            >
              {feat.desc}
            </SvgText>
          </G>
        );
      })}

      {/* Legend */}
      <G>
        <Rect
          x={20}
          y={height - 30}
          width={455}
          height={22}
          rx={4}
          fill="#FAFAFA"
          stroke="#E0E0E0"
          strokeWidth={0.8}
        />
        <Circle cx={40} cy={height - 19} r={4} fill={colors.shortTerm} />
        <SvgText
          x={50}
          y={height - 15}
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
        >
          Short-Term Releases
        </SvgText>
        <Circle cx={165} cy={height - 19} r={4} fill={colors.longTerm} />
        <SvgText
          x={175}
          y={height - 15}
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
        >
          Long-Term Vision
        </SvgText>
        <Rect
          x={290}
          y={height - 25}
          width={26}
          height={12}
          rx={3}
          fill="#FFEBEE"
          stroke={colors.high}
          strokeWidth={0.8}
        />
        <SvgText
          x={320}
          y={height - 16}
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
        >
          High Priority
        </SvgText>
        <Rect
          x={390}
          y={height - 25}
          width={26}
          height={12}
          rx={3}
          fill="#FFF3E0"
          stroke={colors.medium}
          strokeWidth={0.8}
        />
        <SvgText
          x={420}
          y={height - 16}
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
        >
          Medium
        </SvgText>
      </G>
    </Svg>
  );
}
