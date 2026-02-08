import { Svg, G, Rect, Text as SvgText, Line } from "@react-pdf/renderer";

/**
 * AI Node Execution Flow — Shows how an AI node processes data through the pipeline
 * Used in Chapter 8 Implementation (AI Nodes section)
 */
export default function AINodeFlowDiagram() {
  const width = 460;
  const height = 200;
  const cx = width / 2;

  const boxes = [
    { label: "Input\nData", x: 20, color: "#3b82f6", w: 60 },
    { label: "Prompt\nTemplate", x: 100, color: "#6366f1", w: 65 },
    { label: "Provider\nRouter", x: 185, color: "#8b5cf6", w: 65 },
    { label: "API Call\n(HTTP POST)", x: 270, color: "#f59e0b", w: 70 },
    { label: "Response\nParsing", x: 360, color: "#06b6d4", w: 65 },
  ];

  const boxH = 42;
  const boxY = 55;

  const providers = [
    { label: "OpenAI", y: 120 },
    { label: "Anthropic", y: 145 },
    { label: "Google", y: 170 },
  ];

  const limitations = [
    "Rate Limits",
    "Token Limits",
    "Latency",
    "Cost/Token",
    "Non-deterministic",
  ];

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={cx}
        y={16}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: "#333" }}
      >
        AI Node Execution Pipeline
      </SvgText>

      {/* Flow direction */}
      <SvgText
        x={cx}
        y={32}
        textAnchor="middle"
        style={{ fontSize: 6.5, fill: "#999" }}
      >
        Data Flow Direction →
      </SvgText>

      {/* Main flow boxes */}
      {boxes.map((box, i) => {
        const lines = box.label.split("\n");
        return (
          <G key={`box-${i}`}>
            <Rect
              x={box.x}
              y={boxY}
              width={box.w}
              height={boxH}
              rx={5}
              fill={box.color}
              opacity={0.15}
              stroke={box.color}
              strokeWidth={1.5}
            />
            {lines.map((line, li) => (
              <SvgText
                key={`bl-${i}-${li}`}
                x={box.x + box.w / 2}
                y={boxY + 18 + li * 11}
                textAnchor="middle"
                style={{
                  fontSize: 7,
                  fontFamily: "Times-Bold",
                  fill: "#333",
                }}
              >
                {line}
              </SvgText>
            ))}

            {/* Arrow to next box */}
            {i < boxes.length - 1 && (
              <G>
                <Line
                  x1={box.x + box.w}
                  y1={boxY + boxH / 2}
                  x2={boxes[i + 1].x}
                  y2={boxY + boxH / 2}
                  stroke="#cbd5e1"
                  strokeWidth={1}
                />
                <Line
                  x1={boxes[i + 1].x - 4}
                  y1={boxY + boxH / 2 - 3}
                  x2={boxes[i + 1].x}
                  y2={boxY + boxH / 2}
                  stroke="#cbd5e1"
                  strokeWidth={1}
                />
                <Line
                  x1={boxes[i + 1].x - 4}
                  y1={boxY + boxH / 2 + 3}
                  x2={boxes[i + 1].x}
                  y2={boxY + boxH / 2}
                  stroke="#cbd5e1"
                  strokeWidth={1}
                />
              </G>
            )}
          </G>
        );
      })}

      {/* Provider branches from "Provider Router" */}
      {providers.map((prov, i) => (
        <G key={`prov-${i}`}>
          <Line
            x1={boxes[2].x + boxes[2].w / 2}
            y1={boxY + boxH}
            x2={boxes[2].x + boxes[2].w / 2}
            y2={prov.y + 5}
            stroke="#8b5cf6"
            strokeWidth={0.5}
            strokeDasharray="2,2"
          />
          <SvgText
            x={boxes[2].x + boxes[2].w / 2 + 5}
            y={prov.y + 8}
            style={{ fontSize: 6.5, fill: "#8b5cf6" }}
          >
            {prov.label}
          </SvgText>
        </G>
      ))}

      {/* Limitation indicators at API Call box */}
      {limitations.map((lim, i) => (
        <SvgText
          key={`lim-${i}`}
          x={boxes[3].x + boxes[3].w / 2}
          y={boxY + boxH + 14 + i * 12}
          textAnchor="middle"
          style={{ fontSize: 5.5, fill: "#dc2626" }}
        >
          ⚠ {lim}
        </SvgText>
      ))}
    </Svg>
  );
}
