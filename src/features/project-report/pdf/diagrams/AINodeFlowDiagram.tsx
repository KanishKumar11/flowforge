import { Svg, G, Rect, Text as SvgText, Line, Path, Circle } from "@react-pdf/renderer";

/**
 * AI Node Execution Flow — Shows how an AI node processes data through the pipeline.
 * Used in Chapter 8 Implementation (AI Nodes section).
 */
export default function AINodeFlowDiagram() {
  const width = 495;
  const height = 280;
  const cx = width / 2;

  const boxes = [
    { label: "Input\nData", x: 22, color: "#2563eb", w: 78 },
    { label: "Prompt\nTemplate", x: 112, color: "#6366f1", w: 78 },
    { label: "Provider\nRouter", x: 202, color: "#8b5cf6", w: 78 },
    { label: "API Call\n(HTTP POST)", x: 292, color: "#d97706", w: 88 },
    { label: "Response\nParsing", x: 392, color: "#0891b2", w: 80 },
  ];

  const boxH = 50;
  const boxY = 60;

  const providers = [
    { label: "OpenAI (GPT-4)", color: "#10b981" },
    { label: "Anthropic (Claude)", color: "#a855f7" },
    { label: "Google (Gemini)", color: "#3b82f6" },
  ];

  const limitations = [
    { tag: "Rate Limits", desc: "RPM / TPM throttling" },
    { tag: "Token Limits", desc: "Context window cap" },
    { tag: "Latency", desc: "0.5–8s per call" },
    { tag: "Cost / Token", desc: "Variable pricing" },
    { tag: "Non-deterministic", desc: "Output drift" },
  ];

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={cx}
        y={18}
        textAnchor="middle"
        style={{ fontSize: 11, fontFamily: "Times-Bold", fill: "#1a1a1a" }}
      >
        AI Node Execution Pipeline
      </SvgText>
      <SvgText
        x={cx}
        y={34}
        textAnchor="middle"
        style={{ fontSize: 8, fontFamily: "Times-Italic", fill: "#475569" }}
      >
        Data flows left → right; provider routing branches downward
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
              rx={6}
              fill={box.color}
              fillOpacity={0.18}
              stroke={box.color}
              strokeWidth={1.5}
            />
            {lines.map((line, li) => (
              <SvgText
                key={`bl-${i}-${li}`}
                x={box.x + box.w / 2}
                y={boxY + 22 + li * 12}
                textAnchor="middle"
                style={{
                  fontSize: 8,
                  fontFamily: "Times-Bold",
                  fill: "#1a1a1a",
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
                  x2={boxes[i + 1].x - 2}
                  y2={boxY + boxH / 2}
                  stroke="#475569"
                  strokeWidth={1.4}
                />
                <Path
                  d={`M ${boxes[i + 1].x - 6} ${boxY + boxH / 2 - 4} L ${boxes[i + 1].x - 1} ${boxY + boxH / 2} L ${boxes[i + 1].x - 6} ${boxY + boxH / 2 + 4}`}
                  fill="none"
                  stroke="#475569"
                  strokeWidth={1.4}
                />
              </G>
            )}
          </G>
        );
      })}

      {/* ── Provider branch panel (below Provider Router) ── */}
      {(() => {
        const router = boxes[2];
        const panelX = router.x - 4;
        const panelY = 132;
        const panelW = router.w + 8;
        const panelH = 78;
        const startX = router.x + router.w / 2;
        return (
          <G>
            {/* Connector from router down */}
            <Line
              x1={startX}
              y1={boxY + boxH}
              x2={startX}
              y2={panelY}
              stroke="#8b5cf6"
              strokeWidth={1.2}
            />
            {/* Panel */}
            <Rect
              x={panelX}
              y={panelY}
              width={panelW}
              height={panelH}
              rx={4}
              fill="#faf5ff"
              stroke="#a855f7"
              strokeWidth={0.8}
              strokeDasharray="3,2"
            />
            <SvgText
              x={panelX + panelW / 2}
              y={panelY + 12}
              textAnchor="middle"
              style={{
                fontSize: 7,
                fontFamily: "Times-Bold",
                fill: "#7c3aed",
              }}
            >
              PROVIDERS
            </SvgText>
            {providers.map((p, i) => {
              const py = panelY + 26 + i * 14;
              return (
                <G key={`prov-${i}`}>
                  <Circle cx={panelX + 10} cy={py - 3} r={3} fill={p.color} />
                  <SvgText
                    x={panelX + 18}
                    y={py}
                    style={{
                      fontSize: 7.5,
                      fontFamily: "Times-Roman",
                      fill: "#1a1a1a",
                    }}
                  >
                    {p.label}
                  </SvgText>
                </G>
              );
            })}
          </G>
        );
      })()}

      {/* ── Success path indicator (under main flow) ── */}
      <G>
        <Line
          x1={boxes[3].x + boxes[3].w / 2}
          y1={boxY + boxH + 4}
          x2={boxes[4].x + boxes[4].w / 2}
          y2={boxY + boxH + 4}
          stroke="#16a34a"
          strokeWidth={1.2}
        />
        <SvgText
          x={(boxes[3].x + boxes[3].w / 2 + boxes[4].x + boxes[4].w / 2) / 2}
          y={boxY + boxH + 16}
          textAnchor="middle"
          style={{ fontSize: 7, fontFamily: "Times-Bold", fill: "#16a34a" }}
        >
          ✓ success path
        </SvgText>
      </G>

      {/* ── Limitations panel (bottom, full width) ── */}
      {(() => {
        const panelY = 224;
        const panelH = 46;
        return (
          <G>
            <Rect
              x={22}
              y={panelY}
              width={width - 44}
              height={panelH}
              rx={4}
              fill="#fef2f2"
              stroke="#dc2626"
              strokeWidth={0.8}
            />
            <SvgText
              x={32}
              y={panelY + 13}
              style={{
                fontSize: 7.5,
                fontFamily: "Times-Bold",
                fill: "#b91c1c",
              }}
            >
              ⚠ KEY CONSTRAINTS
            </SvgText>
            {limitations.map((lim, i) => {
              const colW = (width - 44 - 16) / limitations.length;
              const lx = 32 + i * colW;
              return (
                <G key={`lim-${i}`}>
                  <SvgText
                    x={lx}
                    y={panelY + 28}
                    style={{
                      fontSize: 7,
                      fontFamily: "Times-Bold",
                      fill: "#dc2626",
                    }}
                  >
                    {lim.tag}
                  </SvgText>
                  <SvgText
                    x={lx}
                    y={panelY + 39}
                    style={{
                      fontSize: 6.5,
                      fontFamily: "Times-Roman",
                      fill: "#7f1d1d",
                    }}
                  >
                    {lim.desc}
                  </SvgText>
                </G>
              );
            })}
          </G>
        );
      })()}
    </Svg>
  );
}
