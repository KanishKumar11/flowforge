import { Svg, G, Text as SvgText, Line, Circle } from "@react-pdf/renderer";

/**
 * Technical Feasibility Radar — Spider/Radar chart showing assessment across dimensions
 * Used in Section 4.2 Technical Feasibility
 */
export default function TechFeasibilityRadar() {
  const width = 420;
  const height = 340;
  const cx = width / 2;
  const cy = 170;
  const maxR = 110;

  const dimensions = [
    { label: "Technology\nMaturity", score: 9 },
    { label: "Developer\nExperience", score: 8 },
    { label: "Scalability", score: 9 },
    { label: "Community\nSupport", score: 9 },
    { label: "Integration\nCapability", score: 7 },
    { label: "Security", score: 8 },
  ];

  const n = dimensions.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2; // Start from top

  const getPoint = (index: number, value: number) => {
    const angle = startAngle + index * angleStep;
    const r = (value / 10) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  // Grid rings (levels 2, 4, 6, 8, 10)
  const rings = [2, 4, 6, 8, 10];

  // Data points for the polygon
  const dataPoints = dimensions.map((d, i) => getPoint(i, d.score));

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={cx}
        y={16}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Technical Feasibility Assessment Radar
      </SvgText>

      {/* Grid rings (hexagons) */}
      {rings.map((level) => {
        const pts = Array.from({ length: n }, (_, i) => getPoint(i, level));
        return (
          <G key={`ring-${level}`}>
            {pts.map((p, i) => {
              const next = pts[(i + 1) % n];
              return (
                <Line
                  key={`ring-line-${level}-${i}`}
                  x1={p.x}
                  y1={p.y}
                  x2={next.x}
                  y2={next.y}
                  stroke={level === 10 ? "#cbd5e1" : "#e2e8f0"}
                  strokeWidth={level === 10 ? 1 : 0.5}
                />
              );
            })}
            {/* Level label */}
            <SvgText
              x={cx + 3}
              y={cy - (level / 10) * maxR + 3}
              style={{ fontSize: 5, fill: "#aaa" }}
            >
              {level}
            </SvgText>
          </G>
        );
      })}

      {/* Axis lines */}
      {dimensions.map((_, i) => {
        const outer = getPoint(i, 10);
        return (
          <Line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={outer.x}
            y2={outer.y}
            stroke="#cbd5e1"
            strokeWidth={0.5}
          />
        );
      })}

      {/* Data polygon edges */}
      {dataPoints.map((p, i) => {
        const next = dataPoints[(i + 1) % n];
        return (
          <Line
            key={`edge-${i}`}
            x1={p.x}
            y1={p.y}
            x2={next.x}
            y2={next.y}
            stroke="#3b82f6"
            strokeWidth={1.5}
          />
        );
      })}

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <G key={`point-${i}`}>
          <Circle cx={p.x} cy={p.y} r={4} fill="#3b82f6" />
          <Circle cx={p.x} cy={p.y} r={2.5} fill="#ffffff" />
          {/* Score label */}
          <SvgText
            x={p.x}
            y={p.y - 7}
            textAnchor="middle"
            style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#3b82f6" }}
          >
            {dimensions[i].score}/10
          </SvgText>
        </G>
      ))}

      {/* Dimension labels — pushed further out */}
      {dimensions.map((d, i) => {
        const labelPt = getPoint(i, 13.5);
        const lines = d.label.split("\n");
        return (
          <G key={`label-${i}`}>
            {lines.map((line, li) => (
              <SvgText
                key={`label-${i}-${li}`}
                x={labelPt.x}
                y={labelPt.y + li * 9}
                textAnchor="middle"
                style={{
                  fontSize: 7,
                  fontFamily: "Times-Bold",
                  fill: "#374151",
                }}
              >
                {line}
              </SvgText>
            ))}
          </G>
        );
      })}

      {/* Legend */}
      <SvgText
        x={cx}
        y={height - 10}
        textAnchor="middle"
        style={{ fontSize: 7, fill: "#666" }}
      >
        Scale: 1 (Poor) — 10 (Excellent) | Average Score:{" "}
        {(dimensions.reduce((s, d) => s + d.score, 0) / n).toFixed(1)}/10
      </SvgText>
    </Svg>
  );
}
