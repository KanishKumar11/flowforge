import { Svg, G, Rect, Text as SvgText, Line } from "@react-pdf/renderer";

/**
 * Market Growth Bar Chart - Workflow automation market 2022-2030
 * Fixed: CAGR text visible, proper spacing, no overlaps
 */
export default function MarketGrowthChart() {
  const width = 495;
  const height = 320;
  const cx = width / 2;

  const chartX = 60;
  const chartY = 50;
  const chartW = 400;
  const chartH = 210;
  const legendW = 140;
  const legendX = chartX - chartW - legendW - 24;

  const data = [
    { year: "2022", value: 9.4, projected: false },
    { year: "2023", value: 11.5, projected: false },
    { year: "2024", value: 13.6, projected: false },
    { year: "2025", value: 16.8, projected: true },
    { year: "2026", value: 20.6, projected: true },
    { year: "2027", value: 25.3, projected: true },
    { year: "2028", value: 31.0, projected: true },
    { year: "2029", value: 38.0, projected: true },
    { year: "2030", value: 46.2, projected: true },
  ];

  const maxVal = 50;
  const barW = 34;
  const barGap = (chartW - data.length * barW) / (data.length + 1);
  const projectionLineX = chartX + 3 * barW + 3.5 * barGap;
  const yGridValues = [0, 10, 20, 30, 40, 50];

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={cx}
        y={22}
        textAnchor="middle"
        style={{ fontSize: 11, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Global Workflow Automation Market Size (USD Billions)
      </SvgText>

      {/* CAGR annotation */}
      <SvgText
        x={cx}
        y={42}
        textAnchor="middle"
        style={{ fontSize: 9, fontFamily: "Times-Bold", fill: "#dc2626" }}
      >
        CAGR: 22.5% (2022-2030)
      </SvgText>

      {/* Y-axis gridlines */}
      {yGridValues.map((val) => {
        const y = chartY + chartH - (val / maxVal) * chartH;
        return (
          <G key={`grid-${val}`}>
            <Line
              x1={chartX}
              y1={y}
              x2={chartX + chartW}
              y2={y}
              stroke="#eee"
              strokeWidth={0.8}
            />
            <SvgText
              x={chartX - 6}
              y={y + 3}
              textAnchor="end"
              style={{
                fontSize: 7,
                fontFamily: "Times-Roman",
                fill: "#475569",
              }}
            >
              {`$${val}B`}
            </SvgText>
          </G>
        );
      })}

      {/* Axes */}
      <Line
        x1={chartX}
        y1={chartY}
        x2={chartX}
        y2={chartY + chartH}
        stroke="#475569"
        strokeWidth={0.8}
      />
      <Line
        x1={chartX}
        y1={chartY + chartH}
        x2={chartX + chartW}
        y2={chartY + chartH}
        stroke="#475569"
        strokeWidth={0.8}
      />

      {/* Projection boundary */}
      <Line
        x1={projectionLineX}
        y1={chartY}
        x2={projectionLineX}
        y2={chartY + chartH}
        stroke="#cbd5e1"
        strokeWidth={0.5}
        strokeDasharray="2,2"
      />
      <SvgText
        x={projectionLineX + 6}
        y={chartY + 10}
        style={{ fontSize: 6.5, fontFamily: "Times-Italic", fill: "#475569" }}
      >
        Projection begins
      </SvgText>

      {/* Trend line (dashed) */}
      <Line
        x1={chartX + barGap + barW / 2}
        y1={chartY + chartH - (9.4 / maxVal) * chartH}
        x2={chartX + barGap + 8 * (barW + barGap) + barW / 2}
        y2={chartY + chartH - (46.2 / maxVal) * chartH}
        stroke="#dc2626"
        strokeWidth={1}
        strokeDasharray="4,3"
      />

      {/* Bars */}
      {data.map((d, i) => {
        const barH = (d.value / maxVal) * chartH;
        const x = chartX + barGap + i * (barW + barGap);
        const y = chartY + chartH - barH;

        return (
          <G key={`bar-${i}`}>
            <Rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx={2}
              fill={d.projected ? "#93c5fd" : "#2563eb"}
              stroke={d.projected ? "#60a5fa" : "#1d4ed8"}
              strokeWidth={0.8}
            />
            {/* Value label */}
            <SvgText
              x={x + barW / 2}
              y={y - 4}
              textAnchor="middle"
              style={{
                fontSize: 7,
                fontFamily: "Times-Bold",
                fill: "#333",
              }}
            >
              {`$${d.value}B`}
            </SvgText>
            {/* Year label */}
            <SvgText
              x={x + barW / 2}
              y={chartY + chartH + 14}
              textAnchor="middle"
              style={{
                fontSize: 7,
                fontFamily: "Times-Roman",
                fill: "#555",
              }}
            >
              {d.year}
            </SvgText>
          </G>
        );
      })}

      {/* Legend */}
      <G>
        <Rect
          x={legendX}
          y={chartY + 5}
          width={legendW}
          height={36}
          rx={4}
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth={0.8}
        />
        <Rect
          x={legendX + 8}
          y={chartY + 14}
          width={12}
          height={8}
          rx={1}
          fill="#2563eb"
        />
        <SvgText
          x={legendX + 32}
          y={chartY + 21}
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: "#334155" }}
        >
          Actual
        </SvgText>
        <Rect
          x={legendX + 84}
          y={chartY + 14}
          width={12}
          height={8}
          rx={1}
          fill="#93c5fd"
        />
        <SvgText
          x={legendX + 108}
          y={chartY + 21}
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: "#334155" }}
        >
          Projected
        </SvgText>
        <SvgText
          x={legendX + 8}
          y={chartY + 35}
          style={{
            fontSize: 6.5,
            fontFamily: "Times-Italic",
            fill: "#475569",
          }}
        >
          Source: Grand View Research, 2024
        </SvgText>
      </G>

      {/* Caption */}
      <SvgText
        x={cx}
        y={height - 10}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333" }}
      >
        Figure: Workflow Automation Market Growth Projection
      </SvgText>
    </Svg>
  );
}
