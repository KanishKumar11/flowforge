import {
  Svg,
  G,
  Rect,
  Text as SvgText,
  Line,
  Circle,
} from "@react-pdf/renderer";

/**
 * Service Integration Matrix
 * Spreadsheet-style summary of supported integrations: auth method, rate limit, OAuth flow.
 */
export default function ServiceIntegrationMatrix() {
  const width = 495;
  const height = 320;

  const cols = [
    { label: "Service", w: 90 },
    { label: "Auth", w: 90 },
    { label: "Rate Limit", w: 95 },
    { label: "OAuth Flow", w: 90 },
    { label: "Scopes", w: 100 },
  ];

  const rows = [
    {
      service: "Slack",
      auth: "OAuth 2.0",
      rate: "1 req/sec/user",
      flow: "Auth-code + PKCE",
      scopes: "chat:write, channels:read",
    },
    {
      service: "Google Sheets",
      auth: "OAuth 2.0",
      rate: "60 req/min",
      flow: "Auth-code (refresh)",
      scopes: "spreadsheets",
    },
    {
      service: "GitHub",
      auth: "OAuth / PAT",
      rate: "5 000 req/hr",
      flow: "Auth-code",
      scopes: "repo, issues",
    },
    {
      service: "Notion",
      auth: "OAuth 2.0",
      rate: "3 req/sec",
      flow: "Auth-code",
      scopes: "read_content, write",
    },
    {
      service: "Stripe",
      auth: "API Key",
      rate: "100 req/sec",
      flow: "n/a (key only)",
      scopes: "—",
    },
    {
      service: "Twilio",
      auth: "API Key + SID",
      rate: "1 msg/sec",
      flow: "n/a (key only)",
      scopes: "—",
    },
    {
      service: "OpenAI",
      auth: "API Key",
      rate: "10k tok/min",
      flow: "n/a (key only)",
      scopes: "—",
    },
    {
      service: "Anthropic",
      auth: "API Key",
      rate: "5 req/min",
      flow: "n/a (key only)",
      scopes: "—",
    },
    {
      service: "Google Gemini",
      auth: "API Key",
      rate: "60 req/min",
      flow: "n/a (key only)",
      scopes: "—",
    },
  ];

  // Color-code auth type
  function authBadge(auth: string) {
    if (auth.startsWith("OAuth")) return { bg: "#dbeafe", fg: "#1d4ed8" };
    if (auth === "API Key") return { bg: "#fef3c7", fg: "#92400e" };
    return { bg: "#fce7f3", fg: "#9d174d" };
  }

  const tableX = 12;
  const tableY = 50;
  const headerH = 22;
  const rowH = 24;
  const tableW = cols.reduce((s, c) => s + c.w, 0);

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={width / 2}
        y={20}
        textAnchor="middle"
        style={{ fontSize: 11, fontFamily: "Times-Bold", fill: "#1a1a1a" }}
      >
        Service Integration Matrix
      </SvgText>
      <SvgText
        x={width / 2}
        y={34}
        textAnchor="middle"
        style={{ fontSize: 8, fontFamily: "Times-Italic", fill: "#475569" }}
      >
        9 integrations · 3 auth methods · per-provider rate limits
      </SvgText>

      {/* Header background */}
      <Rect
        x={tableX}
        y={tableY}
        width={tableW}
        height={headerH}
        fill="#1e293b"
      />

      {/* Header cells */}
      {(() => {
        let xCursor = tableX;
        return cols.map((c, i) => {
          const cell = (
            <G key={`h-${i}`}>
              <SvgText
                x={xCursor + c.w / 2}
                y={tableY + 14}
                textAnchor="middle"
                style={{
                  fontSize: 8.5,
                  fontFamily: "Times-Bold",
                  fill: "#ffffff",
                  letterSpacing: 0.4,
                }}
              >
                {c.label.toUpperCase()}
              </SvgText>
              {i < cols.length - 1 && (
                <Line
                  x1={xCursor + c.w}
                  y1={tableY}
                  x2={xCursor + c.w}
                  y2={tableY + headerH}
                  stroke="#475569"
                  strokeWidth={0.6}
                />
              )}
            </G>
          );
          xCursor += c.w;
          return cell;
        });
      })()}

      {/* Body rows */}
      {rows.map((r, ri) => {
        const y = tableY + headerH + ri * rowH;
        const isAlt = ri % 2 === 1;
        const badge = authBadge(r.auth);
        let xCursor = tableX;
        const cellsArr: {
          val: string;
          w: number;
          bold: boolean;
          isAuth?: boolean;
        }[] = [
          { val: r.service, w: cols[0].w, bold: true },
          { val: r.auth, w: cols[1].w, bold: false, isAuth: true },
          { val: r.rate, w: cols[2].w, bold: false },
          { val: r.flow, w: cols[3].w, bold: false },
          { val: r.scopes, w: cols[4].w, bold: false },
        ];

        return (
          <G key={`row-${ri}`}>
            {/* Row background */}
            <Rect
              x={tableX}
              y={y}
              width={tableW}
              height={rowH}
              fill={isAlt ? "#f8fafc" : "#ffffff"}
            />
            {cellsArr.map((c, ci) => {
              const cell = (
                <G key={`c-${ri}-${ci}`}>
                  {c.isAuth ? (
                    <G>
                      <Rect
                        x={xCursor + 8}
                        y={y + 5}
                        width={c.w - 16}
                        height={rowH - 10}
                        rx={3}
                        fill={badge.bg}
                      />
                      <SvgText
                        x={xCursor + c.w / 2}
                        y={y + rowH / 2 + 3}
                        textAnchor="middle"
                        style={{
                          fontSize: 7.5,
                          fontFamily: "Times-Bold",
                          fill: badge.fg,
                        }}
                      >
                        {c.val}
                      </SvgText>
                    </G>
                  ) : (
                    <SvgText
                      x={xCursor + c.w / 2}
                      y={y + rowH / 2 + 3}
                      textAnchor="middle"
                      style={{
                        fontSize: 7.5,
                        fontFamily: c.bold ? "Times-Bold" : "Times-Roman",
                        fill: "#1a1a1a",
                      }}
                    >
                      {c.val}
                    </SvgText>
                  )}
                  {ci < cellsArr.length - 1 && (
                    <Line
                      x1={xCursor + c.w}
                      y1={y}
                      x2={xCursor + c.w}
                      y2={y + rowH}
                      stroke="#e2e8f0"
                      strokeWidth={0.5}
                    />
                  )}
                </G>
              );
              xCursor += c.w;
              return cell;
            })}
            {/* Bottom border */}
            <Line
              x1={tableX}
              y1={y + rowH}
              x2={tableX + tableW}
              y2={y + rowH}
              stroke="#e2e8f0"
              strokeWidth={0.5}
            />
          </G>
        );
      })}

      {/* Outer table border */}
      <Rect
        x={tableX}
        y={tableY}
        width={tableW}
        height={headerH + rows.length * rowH}
        fill="none"
        stroke="#475569"
        strokeWidth={1}
      />

      {/* Legend */}
      <G>
        <Circle
          cx={tableX + 8}
          cy={height - 14}
          r={4}
          fill="#dbeafe"
          stroke="#1d4ed8"
          strokeWidth={0.6}
        />
        <SvgText
          x={tableX + 16}
          y={height - 11}
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: "#1a1a1a" }}
        >
          OAuth 2.0
        </SvgText>
        <Circle
          cx={tableX + 80}
          cy={height - 14}
          r={4}
          fill="#fef3c7"
          stroke="#92400e"
          strokeWidth={0.6}
        />
        <SvgText
          x={tableX + 88}
          y={height - 11}
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: "#1a1a1a" }}
        >
          API Key
        </SvgText>
        <Circle
          cx={tableX + 145}
          cy={height - 14}
          r={4}
          fill="#fce7f3"
          stroke="#9d174d"
          strokeWidth={0.6}
        />
        <SvgText
          x={tableX + 153}
          y={height - 11}
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: "#1a1a1a" }}
        >
          Hybrid
        </SvgText>
        <SvgText
          x={width - 14}
          y={height - 11}
          textAnchor="end"
          style={{ fontSize: 7, fontFamily: "Times-Italic", fill: "#64748b" }}
        >
          All credentials encrypted at rest (AES-256-GCM)
        </SvgText>
      </G>
    </Svg>
  );
}
