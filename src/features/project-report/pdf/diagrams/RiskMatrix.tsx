import { Svg, G, Rect, Text as SvgText, Circle, Line } from "@react-pdf/renderer";

/**
 * Risk Matrix Diagram - 5x5 heatmap (Likelihood vs Impact).
 * Risks rendered as numbered dots; legend on the right maps numbers to names.
 */
export default function RiskMatrix() {
  const width = 495;
  const height = 340;
  const cx = width / 2;

  const gridX = 70;
  const gridY = 50;
  const cellW = 52;
  const cellH = 42;
  const cols = 5;
  const rows = 5;

  const impactLabels = ["Very Low", "Low", "Medium", "High", "Very High"];
  const likelihoodLabels = ["Very High", "High", "Medium", "Low", "Very Low"];

  // Map (row, col) → risk band (saturated colors)
  function getCellColor(row: number, col: number) {
    const level = 4 - row + col; // 0..8
    if (level <= 2) return { bg: "#bbf7d0", border: "#16a34a" };
    if (level <= 4) return { bg: "#fde68a", border: "#d97706" };
    if (level <= 6) return { bg: "#fdba74", border: "#ea580c" };
    return { bg: "#fca5a5", border: "#dc2626" };
  }

  // [row, col, name, mitigation]
  const risks: { row: number; col: number; name: string; mitigation: string }[] = [
    { row: 2, col: 2, name: "API Rate Limits", mitigation: "Retry + backoff" },
    { row: 3, col: 1, name: "React Flow Limits", mitigation: "Virtualize nodes" },
    { row: 3, col: 0, name: "Inngest Outage", mitigation: "Fallback queue" },
    { row: 2, col: 3, name: "DB Scale", mitigation: "Connection pooling" },
    { row: 1, col: 4, name: "Security Vulnerabilities", mitigation: "Audits + Sentry" },
    { row: 3, col: 2, name: "Schedule Overrun", mitigation: "Sprint buffers" },
  ];

  // Group risks by cell so we can offset overlapping dots
  const cellMap = new Map<string, number[]>();
  risks.forEach((r, i) => {
    const key = `${r.row}-${r.col}`;
    if (!cellMap.has(key)) cellMap.set(key, []);
    cellMap.get(key)!.push(i);
  });

  const gridRight = gridX + cols * cellW;
  const gridBottom = gridY + rows * cellH;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={cx}
        y={20}
        textAnchor="middle"
        style={{ fontSize: 11, fontFamily: "Times-Bold", fill: "#1a1a1a" }}
      >
        Risk Assessment Matrix
      </SvgText>
      <SvgText
        x={cx}
        y={34}
        textAnchor="middle"
        style={{ fontSize: 8, fontFamily: "Times-Italic", fill: "#475569" }}
      >
        Project risks plotted by likelihood × impact
      </SvgText>

      {/* Grid cells */}
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((_, col) => {
          const c = getCellColor(row, col);
          return (
            <Rect
              key={`cell-${row}-${col}`}
              x={gridX + col * cellW}
              y={gridY + row * cellH}
              width={cellW}
              height={cellH}
              fill={c.bg}
              stroke="#ffffff"
              strokeWidth={1.2}
            />
          );
        }),
      )}

      {/* Outer grid border */}
      <Rect
        x={gridX}
        y={gridY}
        width={cols * cellW}
        height={rows * cellH}
        fill="none"
        stroke="#475569"
        strokeWidth={1.2}
      />

      {/* Impact labels (X axis) */}
      {impactLabels.map((label, i) => (
        <SvgText
          key={`imp-${i}`}
          x={gridX + i * cellW + cellW / 2}
          y={gridBottom + 14}
          textAnchor="middle"
          style={{ fontSize: 7.5, fontFamily: "Times-Roman", fill: "#475569" }}
        >
          {label}
        </SvgText>
      ))}
      <SvgText
        x={gridX + (cols * cellW) / 2}
        y={gridBottom + 30}
        textAnchor="middle"
        style={{
          fontSize: 9,
          fontFamily: "Times-Bold",
          fill: "#1a1a1a",
          letterSpacing: 1.5,
        }}
      >
        IMPACT →
      </SvgText>

      {/* Likelihood labels (Y axis) */}
      {likelihoodLabels.map((label, i) => (
        <SvgText
          key={`lik-${i}`}
          x={gridX - 6}
          y={gridY + i * cellH + cellH / 2 + 3}
          textAnchor="end"
          style={{ fontSize: 7.5, fontFamily: "Times-Roman", fill: "#475569" }}
        >
          {label}
        </SvgText>
      ))}
      {/* Vertical Y axis title using transform rotate */}
      <SvgText
        x={20}
        y={gridY + (rows * cellH) / 2}
        textAnchor="middle"
        transform={`rotate(-90, 20, ${gridY + (rows * cellH) / 2})`}
        style={{
          fontSize: 9,
          fontFamily: "Times-Bold",
          fill: "#1a1a1a",
          letterSpacing: 1.5,
        }}
      >
        ↑ LIKELIHOOD
      </SvgText>

      {/* Risk dots — numbered, offset within shared cells */}
      {Array.from(cellMap.entries()).map(([key, indices]) => {
        const [row, col] = key.split("-").map(Number);
        const cellCenterX = gridX + col * cellW + cellW / 2;
        const cellCenterY = gridY + row * cellH + cellH / 2;
        return indices.map((idx, j) => {
          // Distribute multiple dots horizontally within a cell
          const total = indices.length;
          const spacing = 14;
          const offsetX = (j - (total - 1) / 2) * spacing;
          const dotX = cellCenterX + offsetX;
          const dotY = cellCenterY;
          return (
            <G key={`risk-${idx}`}>
              <Circle
                cx={dotX}
                cy={dotY}
                r={8}
                fill="#1e293b"
                stroke="#ffffff"
                strokeWidth={1.5}
              />
              <SvgText
                x={dotX}
                y={dotY + 3}
                textAnchor="middle"
                style={{ fontSize: 8, fontFamily: "Times-Bold", fill: "#ffffff" }}
              >
                {idx + 1}
              </SvgText>
            </G>
          );
        });
      })}

      {/* ── Right-side legend (risk numbers → names) ── */}
      <G>
        {(() => {
          const legX = gridRight + 18;
          const legY = gridY;
          const lineH = 14;
          return (
            <>
              <SvgText
                x={legX}
                y={legY - 2}
                style={{
                  fontSize: 8,
                  fontFamily: "Times-Bold",
                  fill: "#1a1a1a",
                  letterSpacing: 1,
                }}
              >
                RISK REGISTER
              </SvgText>
              {risks.map((r, i) => (
                <G key={`leg-${i}`}>
                  <Circle
                    cx={legX + 6}
                    cy={legY + 12 + i * lineH}
                    r={5}
                    fill="#1e293b"
                  />
                  <SvgText
                    x={legX + 6}
                    y={legY + 14 + i * lineH}
                    textAnchor="middle"
                    style={{
                      fontSize: 7,
                      fontFamily: "Times-Bold",
                      fill: "#ffffff",
                    }}
                  >
                    {i + 1}
                  </SvgText>
                  <SvgText
                    x={legX + 16}
                    y={legY + 11 + i * lineH}
                    style={{
                      fontSize: 7.5,
                      fontFamily: "Times-Bold",
                      fill: "#1a1a1a",
                    }}
                  >
                    {r.name}
                  </SvgText>
                  <SvgText
                    x={legX + 16}
                    y={legY + 19 + i * lineH}
                    style={{
                      fontSize: 6.5,
                      fontFamily: "Times-Italic",
                      fill: "#64748b",
                    }}
                  >
                    {r.mitigation}
                  </SvgText>
                </G>
              ))}
            </>
          );
        })()}
      </G>

      {/* Risk-band legend (bottom) */}
      {(() => {
        const bands = [
          { label: "Low", bg: "#bbf7d0" },
          { label: "Medium", bg: "#fde68a" },
          { label: "High", bg: "#fdba74" },
          { label: "Critical", bg: "#fca5a5" },
        ];
        const startX = gridX + 4;
        const y = gridBottom + 46;
        const itemW = 60;
        return (
          <G>
            {bands.map((b, i) => (
              <G key={`band-${i}`}>
                <Rect
                  x={startX + i * itemW}
                  y={y}
                  width={12}
                  height={10}
                  fill={b.bg}
                  stroke="#475569"
                  strokeWidth={0.6}
                />
                <SvgText
                  x={startX + i * itemW + 16}
                  y={y + 9}
                  style={{
                    fontSize: 7.5,
                    fontFamily: "Times-Roman",
                    fill: "#1a1a1a",
                  }}
                >
                  {b.label}
                </SvgText>
              </G>
            ))}
          </G>
        );
      })()}
    </Svg>
  );
}
