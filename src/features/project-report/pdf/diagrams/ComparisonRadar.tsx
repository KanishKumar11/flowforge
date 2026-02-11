import {
  Svg,
  G,
  Rect,
  Text as SvgText,
  Line,
  Circle,
} from "@react-pdf/renderer";

/**
 * Flowgent vs n8n Comparison Radar — Side-by-side radar showing each platform's strengths
 * Used in Chapter 2 Problem Statement
 */
export default function ComparisonRadar() {
  const width = 460;
  const height = 310;
  const cx = width / 2;
  const cy = 155;
  const maxR = 100;

  const dimensions = [
    { label: "Ease of Use", flowgent: 8, n8n: 5 },
    { label: "AI Integration", flowgent: 9, n8n: 5 },
    { label: "Self-Hosting", flowgent: 8, n8n: 9 },
    { label: "Integrations", flowgent: 4, n8n: 9 },
    { label: "Team Features", flowgent: 8, n8n: 4 },
    { label: "Type Safety", flowgent: 9, n8n: 6 },
    { label: "Community", flowgent: 2, n8n: 8 },
    { label: "Modern Stack", flowgent: 9, n8n: 6 },
  ];

  const n = dimensions.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const getPoint = (index: number, value: number) => {
    const angle = startAngle + index * angleStep;
    const r = (value / 10) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const rings = [2, 4, 6, 8, 10];

  const flowgentPoints = dimensions.map((d, i) => getPoint(i, d.flowgent));
  const n8nPoints = dimensions.map((d, i) => getPoint(i, d.n8n));

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={cx}
        y={16}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Feature Comparison Radar: Flowgent vs n8n
      </SvgText>

      {/* Grid rings */}
      {rings.map((level) => {
        const pts = Array.from({ length: n }, (_, i) => getPoint(i, level));
        return (
          <G key={`ring-${level}`}>
            {pts.map((p, i) => {
              const next = pts[(i + 1) % n];
              return (
                <Line
                  key={`rline-${level}-${i}`}
                  x1={p.x}
                  y1={p.y}
                  x2={next.x}
                  y2={next.y}
                  stroke={level === 10 ? "#cbd5e1" : "#e2e8f0"}
                  strokeWidth={level === 10 ? 1 : 0.8}
                />
              );
            })}
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
            strokeWidth={0.8}
          />
        );
      })}

      {/* n8n polygon (draw first so Flowgent overlays) */}
      {n8nPoints.map((p, i) => {
        const next = n8nPoints[(i + 1) % n];
        return (
          <Line
            key={`n8n-line-${i}`}
            x1={p.x}
            y1={p.y}
            x2={next.x}
            y2={next.y}
            stroke="#f59e0b"
            strokeWidth={1.5}
            strokeDasharray="4,3"
          />
        );
      })}

      {/* Flowgent polygon */}
      {flowgentPoints.map((p, i) => {
        const next = flowgentPoints[(i + 1) % n];
        return (
          <Line
            key={`fg-line-${i}`}
            x1={p.x}
            y1={p.y}
            x2={next.x}
            y2={next.y}
            stroke="#3b82f6"
            strokeWidth={1.5}
          />
        );
      })}

      {/* Data points — n8n */}
      {n8nPoints.map((p, i) => (
        <G key={`n8n-pt-${i}`}>
          <Circle cx={p.x} cy={p.y} r={3} fill="#f59e0b" />
        </G>
      ))}

      {/* Data points — Flowgent */}
      {flowgentPoints.map((p, i) => (
        <G key={`fg-pt-${i}`}>
          <Circle cx={p.x} cy={p.y} r={3.5} fill="#3b82f6" />
          <Circle cx={p.x} cy={p.y} r={2} fill="#ffffff" />
        </G>
      ))}

      {/* Dimension labels */}
      {dimensions.map((d, i) => {
        const labelPt = getPoint(i, 12);
        return (
          <SvgText
            key={`lbl-${i}`}
            x={labelPt.x}
            y={labelPt.y + 3}
            textAnchor="middle"
            style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#374151" }}
          >
            {d.label}
          </SvgText>
        );
      })}

      {/* Legend */}
      <Rect x={cx - 80} y={height - 25} width={10} height={3} fill="#3b82f6" />
      <SvgText
        x={cx - 66}
        y={height - 20}
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#3b82f6" }}
      >
        Flowgent
      </SvgText>
      <Line
        x1={cx + 10}
        y1={height - 23}
        x2={cx + 20}
        y2={height - 23}
        stroke="#f59e0b"
        strokeWidth={1.5}
        strokeDasharray="4,3"
      />
      <SvgText
        x={cx + 24}
        y={height - 20}
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#f59e0b" }}
      >
        n8n
      </SvgText>
      <SvgText
        x={cx}
        y={height - 8}
        textAnchor="middle"
        style={{ fontSize: 7, fill: "#555555" }}
      >
        Scale: 1 (Poor) — 10 (Excellent)
      </SvgText>
    </Svg>
  );
}
