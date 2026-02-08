import { Svg, G, Rect, Text as SvgText, Ellipse } from "@react-pdf/renderer";

/**
 * Risk Matrix Diagram - 5x5 heatmap (Likelihood vs Impact)
 * Plots project-specific risks as labeled dots
 */
export default function RiskMatrix() {
  const width = 495;
  const height = 340;
  const cx = width / 2;

  const gridX = 100;
  const gridY = 40;
  const cellW = 70;
  const cellH = 45;
  const cols = 5; // Impact: Very Low, Low, Medium, High, Very High
  const rows = 5; // Likelihood: Very Low, Low, Medium, High, Very High

  const impactLabels = ["Very Low", "Low", "Medium", "High", "Very High"];
  const likelihoodLabels = ["Very High", "High", "Medium", "Low", "Very Low"];

  // Color mapping based on risk level (row + col index)
  function getCellColor(row: number, col: number) {
    const level = 4 - row + col; // Higher = more risky
    if (level <= 2) return "#dcfce7"; // Green - low risk
    if (level <= 4) return "#fef9c3"; // Yellow - medium risk
    if (level <= 6) return "#fed7aa"; // Orange - high risk
    return "#fecaca"; // Red - critical risk
  }

  // Risk items plotted on the matrix [row, col, label]
  const risks: [number, number, string][] = [
    [2, 2, "API Rate Limits"],
    [3, 1, "React Flow\nLimits"],
    [3, 0, "Inngest\nOutage"],
    [3, 1, "DB Scale"],
    [2, 2, "Security\nVulnerabilities"],
    [3, 2, "Schedule\nOverrun"],
  ];

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={cx}
        y={22}
        textAnchor="middle"
        style={{ fontSize: 11, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Risk Assessment Matrix
      </SvgText>

      {/* Grid cells */}
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((_, col) => (
          <Rect
            key={`cell-${row}-${col}`}
            x={gridX + col * cellW}
            y={gridY + row * cellH}
            width={cellW}
            height={cellH}
            fill={getCellColor(row, col)}
            stroke="#ccc"
            strokeWidth={0.5}
          />
        )),
      )}

      {/* Impact labels (X axis) */}
      {impactLabels.map((label, i) => (
        <SvgText
          key={`imp-${i}`}
          x={gridX + i * cellW + cellW / 2}
          y={gridY + rows * cellH + 15}
          textAnchor="middle"
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: "#555" }}
        >
          {label}
        </SvgText>
      ))}
      <SvgText
        x={gridX + (cols * cellW) / 2}
        y={gridY + rows * cellH + 30}
        textAnchor="middle"
        style={{ fontSize: 9, fontFamily: "Times-Bold", fill: "#333" }}
      >
        IMPACT
      </SvgText>

      {/* Likelihood labels (Y axis) */}
      {likelihoodLabels.map((label, i) => (
        <SvgText
          key={`lik-${i}`}
          x={gridX - 8}
          y={gridY + i * cellH + cellH / 2 + 3}
          textAnchor="end"
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: "#555" }}
        >
          {label}
        </SvgText>
      ))}
      {/* Y axis label (vertical text - simulated with individual chars) */}
      <SvgText
        x={20}
        y={gridY + (rows * cellH) / 2 - 30}
        style={{ fontSize: 9, fontFamily: "Times-Bold", fill: "#333" }}
      >
        L
      </SvgText>
      <SvgText
        x={20}
        y={gridY + (rows * cellH) / 2 - 18}
        style={{ fontSize: 9, fontFamily: "Times-Bold", fill: "#333" }}
      >
        I
      </SvgText>
      <SvgText
        x={20}
        y={gridY + (rows * cellH) / 2 - 6}
        style={{ fontSize: 9, fontFamily: "Times-Bold", fill: "#333" }}
      >
        K
      </SvgText>
      <SvgText
        x={20}
        y={gridY + (rows * cellH) / 2 + 6}
        style={{ fontSize: 9, fontFamily: "Times-Bold", fill: "#333" }}
      >
        E
      </SvgText>
      <SvgText
        x={20}
        y={gridY + (rows * cellH) / 2 + 18}
        style={{ fontSize: 9, fontFamily: "Times-Bold", fill: "#333" }}
      >
        L
      </SvgText>
      <SvgText
        x={20}
        y={gridY + (rows * cellH) / 2 + 30}
        style={{ fontSize: 9, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Y
      </SvgText>

      {/* Risk items plotted */}
      {risks.map(([row, col, label], i) => {
        const rx = gridX + col * cellW + cellW / 2 + (i % 2 === 0 ? -8 : 12);
        const ry = gridY + row * cellH + cellH / 2 + (i % 3 === 0 ? -5 : 5);
        return (
          <G key={`risk-${i}`}>
            <Ellipse
              cx={rx}
              cy={ry}
              rx={4}
              ry={4}
              fill="#dc2626"
              stroke="white"
              strokeWidth={1}
            />
            {label.includes("\n") ? (
              <>
                <SvgText
                  x={rx + 8}
                  y={ry - 2}
                  style={{
                    fontSize: 5.5,
                    fontFamily: "Times-Bold",
                    fill: "#333",
                  }}
                >
                  {label.split("\n")[0]}
                </SvgText>
                <SvgText
                  x={rx + 8}
                  y={ry + 7}
                  style={{
                    fontSize: 5.5,
                    fontFamily: "Times-Bold",
                    fill: "#333",
                  }}
                >
                  {label.split("\n")[1]}
                </SvgText>
              </>
            ) : (
              <SvgText
                x={rx + 8}
                y={ry + 3}
                style={{
                  fontSize: 5.5,
                  fontFamily: "Times-Bold",
                  fill: "#333",
                }}
              >
                {label}
              </SvgText>
            )}
          </G>
        );
      })}

      {/* Legend */}
      <G>
        <Rect
          x={gridX + cols * cellW + 15}
          y={gridY}
          width={12}
          height={12}
          fill="#dcfce7"
          stroke="#ccc"
          strokeWidth={0.5}
        />
        <SvgText
          x={gridX + cols * cellW + 32}
          y={gridY + 10}
          style={{ fontSize: 6, fontFamily: "Times-Roman", fill: "#555" }}
        >
          Low Risk
        </SvgText>
        <Rect
          x={gridX + cols * cellW + 15}
          y={gridY + 18}
          width={12}
          height={12}
          fill="#fef9c3"
          stroke="#ccc"
          strokeWidth={0.5}
        />
        <SvgText
          x={gridX + cols * cellW + 32}
          y={gridY + 28}
          style={{ fontSize: 6, fontFamily: "Times-Roman", fill: "#555" }}
        >
          Medium
        </SvgText>
        <Rect
          x={gridX + cols * cellW + 15}
          y={gridY + 36}
          width={12}
          height={12}
          fill="#fed7aa"
          stroke="#ccc"
          strokeWidth={0.5}
        />
        <SvgText
          x={gridX + cols * cellW + 32}
          y={gridY + 46}
          style={{ fontSize: 6, fontFamily: "Times-Roman", fill: "#555" }}
        >
          High Risk
        </SvgText>
        <Rect
          x={gridX + cols * cellW + 15}
          y={gridY + 54}
          width={12}
          height={12}
          fill="#fecaca"
          stroke="#ccc"
          strokeWidth={0.5}
        />
        <SvgText
          x={gridX + cols * cellW + 32}
          y={gridY + 64}
          style={{ fontSize: 6, fontFamily: "Times-Roman", fill: "#555" }}
        >
          Critical
        </SvgText>
      </G>

      {/* Caption */}
      <SvgText
        x={cx}
        y={height - 10}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Figure: Risk Assessment Matrix — Flowgent Project
      </SvgText>
    </Svg>
  );
}
