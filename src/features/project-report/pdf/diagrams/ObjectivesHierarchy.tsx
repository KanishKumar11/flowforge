/**
 * Objectives Hierarchy Diagram
 * Visual hierarchy showing the three-tier objective structure
 * (Primary → Secondary → Technical) with key sub-objectives
 * For Chapter 3 (Project Objectives)
 */
import { Svg, G, Rect, Text as SvgText, Line } from "@react-pdf/renderer";

export default function ObjectivesHierarchy() {
  const width = 495;
  const height = 420;

  const colors = {
    text: "#1a1a1a",
    label: "#555555",
    root: "#1565C0",
    rootText: "#FFFFFF",
    primary: "#E3F2FD",
    primaryBorder: "#1565C0",
    secondary: "#FFF3E0",
    secondaryBorder: "#E65100",
    technical: "#E8F5E9",
    technicalBorder: "#2E7D32",
    connector: "#999999",
  };

  // Root box
  const rootX = width / 2 - 80;
  const rootY = 15;
  const rootW = 160;
  const rootH = 32;

  // Category boxes
  const catY = 75;
  const catW = 140;
  const catH = 30;
  const catGap = 20;
  const totalCatW = 3 * catW + 2 * catGap;
  const catStartX = (width - totalCatW) / 2;

  const categories = [
    {
      label: "Primary Objectives",
      x: catStartX,
      fill: colors.primary,
      stroke: colors.primaryBorder,
      items: [
        "Visual Workflow\nDesign Interface",
        "Reliable Execution\nEngine",
        "Multi-Trigger\nSupport",
        "Service\nIntegrations",
        "AI Integration\nCapabilities",
      ],
    },
    {
      label: "Secondary Objectives",
      x: catStartX + catW + catGap,
      fill: colors.secondary,
      stroke: colors.secondaryBorder,
      items: [
        "Team Collaboration\n& RBAC",
        "Secure Credential\nManagement",
        "Execution Monitoring\n& Debugging",
        "Version Control\nfor Workflows",
        "Audit Trail &\nCompliance",
      ],
    },
    {
      label: "Technical Objectives",
      x: catStartX + 2 * (catW + catGap),
      fill: colors.technical,
      stroke: colors.technicalBorder,
      items: [
        "Modern Web\nTechnology Stack",
        "Type-Safe\nArchitecture",
        "Responsive &\nAccessible UI",
        "Security Best\nPractices",
      ],
    },
  ];

  // Sub-objective box dimensions
  const subW = 120;
  const subH = 36;
  const subGapY = 8;
  const subStartY = 135;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={width / 2}
        y={10}
        textAnchor="middle"
        style={{
          fontSize: 11,
          fontFamily: "Times-Bold",
          fill: colors.text,
        }}
      >
        Project Objectives Hierarchy
      </SvgText>

      {/* Root node */}
      <Rect
        x={rootX}
        y={rootY + 5}
        width={rootW}
        height={rootH}
        rx={6}
        fill={colors.root}
        stroke="#0D47A1"
        strokeWidth={1.5}
      />
      <SvgText
        x={width / 2}
        y={rootY + 5 + rootH / 2 + 4}
        textAnchor="middle"
        style={{
          fontSize: 10,
          fontFamily: "Times-Bold",
          fill: colors.rootText,
        }}
      >
        Flowgent Objectives
      </SvgText>

      {/* Connectors from root to categories */}
      {categories.map((cat, i) => (
        <G key={`conn-${i}`}>
          {/* Vertical from root bottom center */}
          <Line
            x1={width / 2}
            y1={rootY + 5 + rootH}
            x2={width / 2}
            y2={rootY + 5 + rootH + 10}
            stroke={colors.connector}
            strokeWidth={1}
          />
          {/* Horizontal spread line */}
          <Line
            x1={catStartX + catW / 2}
            y1={rootY + 5 + rootH + 10}
            x2={catStartX + 2 * (catW + catGap) + catW / 2}
            y2={rootY + 5 + rootH + 10}
            stroke={colors.connector}
            strokeWidth={1}
          />
          {/* Vertical to category */}
          <Line
            x1={cat.x + catW / 2}
            y1={rootY + 5 + rootH + 10}
            x2={cat.x + catW / 2}
            y2={catY}
            stroke={colors.connector}
            strokeWidth={1}
          />
        </G>
      ))}

      {/* Category boxes and sub-objectives */}
      {categories.map((cat, ci) => {
        const catCx = cat.x + catW / 2;
        return (
          <G key={`cat-${ci}`}>
            {/* Category box */}
            <Rect
              x={cat.x}
              y={catY}
              width={catW}
              height={catH}
              rx={5}
              fill={cat.fill}
              stroke={cat.stroke}
              strokeWidth={1.5}
            />
            <SvgText
              x={catCx}
              y={catY + catH / 2 + 4}
              textAnchor="middle"
              style={{
                fontSize: 8.5,
                fontFamily: "Times-Bold",
                fill: colors.text,
              }}
            >
              {cat.label}
            </SvgText>

            {/* Connector line from category to sub-objectives */}
            <Line
              x1={catCx}
              y1={catY + catH}
              x2={catCx}
              y2={subStartY}
              stroke={cat.stroke}
              strokeWidth={0.8}
              strokeDasharray="3,2"
            />

            {/* Sub-objective boxes */}
            {cat.items.map((item, si) => {
              const subX = catCx - subW / 2;
              const subY = subStartY + si * (subH + subGapY);
              const lines = item.split("\n");
              return (
                <G key={`sub-${ci}-${si}`}>
                  {/* Connector */}
                  {si > 0 && (
                    <Line
                      x1={catCx}
                      y1={subY - subGapY}
                      x2={catCx}
                      y2={subY}
                      stroke={cat.stroke}
                      strokeWidth={0.8}
                      strokeDasharray="2,2"
                    />
                  )}
                  {/* Box */}
                  <Rect
                    x={subX}
                    y={subY}
                    width={subW}
                    height={subH}
                    rx={4}
                    fill={cat.fill}
                    stroke={cat.stroke}
                    strokeWidth={0.8}
                  />
                  {/* Section number */}
                  <SvgText
                    x={subX + 6}
                    y={subY + 12}
                    style={{
                      fontSize: 7,
                      fontFamily: "Times-Bold",
                      fill: cat.stroke,
                    }}
                  >
                    {`3.${ci + 2}.${si + 1}`}
                  </SvgText>
                  {/* Label lines */}
                  {lines.map((line, li) => (
                    <SvgText
                      key={li}
                      x={catCx}
                      y={subY + 16 + li * 10}
                      textAnchor="middle"
                      style={{
                        fontSize: 7.5,
                        fontFamily: "Times-Roman",
                        fill: colors.text,
                      }}
                    >
                      {line}
                    </SvgText>
                  ))}
                </G>
              );
            })}
          </G>
        );
      })}
    </Svg>
  );
}
