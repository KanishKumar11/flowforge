/**
 * Survey Results Charts
 * Combined visual showing respondent demographics and tool satisfaction
 * For Chapter 6 (Requirement Gathering)
 */
import { Svg, G, Rect, Text as SvgText, Line } from "@react-pdf/renderer";

export default function SurveyResultsChart() {
  const width = 495;
  const height = 460;

  const colors = {
    text: "#1a1a1a",
    label: "#333333",
    sublabel: "#555555",
    grid: "#E0E0E0",
    bars: ["#0D47A1", "#1565C0", "#1976D2", "#2196F3", "#42A5F5", "#64B5F6"],
    satisfaction: "#E65100",
    satisfactionBg: "#FFF3E0",
  };

  // ── Section 1: Role Distribution (horizontal bars) ──
  const roles = [
    { name: "Developers", pct: 38 },
    { name: "Business Analysts", pct: 23 },
    { name: "Project Managers", pct: 17 },
    { name: "Operations", pct: 15 },
    { name: "Other", pct: 7 },
  ];

  const sec1Top = 50;
  const sec1Left = 130;
  const sec1Right = 240;
  const sec1BarH = 18;
  const sec1Gap = 6;
  const sec1W = sec1Right - sec1Left;

  // ── Section 2: Technical Expertise (horizontal bars) ──
  const expertise = [
    { name: "Intermediate", pct: 45 },
    { name: "Advanced", pct: 29 },
    { name: "Beginner", pct: 26 },
  ];

  const sec2Left = 370;
  const sec2Right = 480;
  const sec2W = sec2Right - sec2Left;

  // ── Section 3: Tool Usage & Satisfaction ──
  const tools = [
    { name: "Zapier", usage: 51, satisfaction: 3.4 },
    { name: "Custom Scripts", usage: 40, satisfaction: 2.8 },
    { name: "Make/Integromat", usage: 34, satisfaction: 3.5 },
    { name: "Power Automate", usage: 28, satisfaction: 3.2 },
    { name: "n8n", usage: 23, satisfaction: 3.7 },
    { name: "None", usage: 12, satisfaction: 0 },
  ];

  const sec3Top = 210;
  const sec3Left = 130;
  const sec3Right = width - 30;
  const sec3BarH = 22;
  const sec3Gap = 8;
  const sec3W = sec3Right - sec3Left;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={width / 2}
        y={18}
        textAnchor="middle"
        style={{
          fontSize: 11,
          fontFamily: "Times-Bold",
          fill: colors.text,
        }}
      >
        Survey Results — 47 Respondents
      </SvgText>

      {/* Subtitle */}
      <SvgText
        x={width / 2}
        y={32}
        textAnchor="middle"
        style={{
          fontSize: 8,
          fontFamily: "Times-Italic",
          fill: colors.sublabel,
        }}
      >
        Requirement gathering questionnaire demographics and tool satisfaction
      </SvgText>

      {/* ── Section 1: Role Distribution ── */}
      <SvgText
        x={15}
        y={sec1Top}
        style={{
          fontSize: 9,
          fontFamily: "Times-Bold",
          fill: colors.text,
        }}
      >
        Primary Role
      </SvgText>

      {roles.map((role, i) => {
        const y = sec1Top + 10 + i * (sec1BarH + sec1Gap);
        const barW = (role.pct / 50) * sec1W;
        return (
          <G key={`role-${i}`}>
            <SvgText
              x={sec1Left - 6}
              y={y + sec1BarH / 2 + 3}
              textAnchor="end"
              style={{
                fontSize: 7,
                fontFamily: "Times-Roman",
                fill: colors.label,
              }}
            >
              {role.name}
            </SvgText>
            <Rect
              x={sec1Left}
              y={y}
              width={barW}
              height={sec1BarH}
              rx={3}
              fill={colors.bars[i]}
            />
            <SvgText
              x={sec1Left + barW + 5}
              y={y + sec1BarH / 2 + 3}
              style={{
                fontSize: 8,
                fontFamily: "Times-Bold",
                fill: colors.text,
              }}
            >
              {role.pct}%
            </SvgText>
          </G>
        );
      })}

      {/* ── Section 2: Technical Expertise ── */}
      <SvgText
        x={280}
        y={sec1Top}
        style={{
          fontSize: 9,
          fontFamily: "Times-Bold",
          fill: colors.text,
        }}
      >
        Technical Level
      </SvgText>

      {expertise.map((exp, i) => {
        const y = sec1Top + 10 + i * (sec1BarH + sec1Gap);
        const barW = (exp.pct / 50) * sec2W;
        return (
          <G key={`exp-${i}`}>
            <SvgText
              x={sec2Left - 6}
              y={y + sec1BarH / 2 + 3}
              textAnchor="end"
              style={{
                fontSize: 7,
                fontFamily: "Times-Roman",
                fill: colors.label,
              }}
            >
              {exp.name}
            </SvgText>
            <Rect
              x={sec2Left}
              y={y}
              width={barW}
              height={sec1BarH}
              rx={3}
              fill={colors.bars[i]}
            />
            <SvgText
              x={sec2Left + barW + 5}
              y={y + sec1BarH / 2 + 3}
              style={{
                fontSize: 8,
                fontFamily: "Times-Bold",
                fill: colors.text,
              }}
            >
              {exp.pct}%
            </SvgText>
          </G>
        );
      })}

      {/* Separator */}
      <Line
        x1={20}
        y1={sec3Top - 15}
        x2={width - 20}
        y2={sec3Top - 15}
        stroke={colors.grid}
        strokeWidth={0.8}
      />

      {/* ── Section 3: Tool Usage & Satisfaction ── */}
      <SvgText
        x={15}
        y={sec3Top}
        style={{
          fontSize: 9,
          fontFamily: "Times-Bold",
          fill: colors.text,
        }}
      >
        Tool Usage &
      </SvgText>
      <SvgText
        x={15}
        y={sec3Top + 12}
        style={{
          fontSize: 9,
          fontFamily: "Times-Bold",
          fill: colors.text,
        }}
      >
        Satisfaction
      </SvgText>

      {/* Scale */}
      {[0, 20, 40, 60].map((val, idx) => {
        const x = sec3Left + (val / 60) * sec3W;
        return (
          <G key={`scale-${idx}`}>
            <Line
              x1={x}
              y1={sec3Top + 18}
              x2={x}
              y2={sec3Top + 24 + tools.length * (sec3BarH + sec3Gap)}
              stroke={colors.grid}
              strokeWidth={0.8}
            />
            <SvgText
              x={x}
              y={sec3Top + 14}
              textAnchor="middle"
              style={{
                fontSize: 7,
                fontFamily: "Times-Roman",
                fill: colors.sublabel,
              }}
            >
              {val}%
            </SvgText>
          </G>
        );
      })}

      {tools.map((tool, i) => {
        const y = sec3Top + 24 + i * (sec3BarH + sec3Gap);
        const barW = (tool.usage / 60) * sec3W;
        return (
          <G key={`tool-${i}`}>
            <SvgText
              x={sec3Left - 6}
              y={y + sec3BarH / 2 + 3}
              textAnchor="end"
              style={{
                fontSize: 7,
                fontFamily: "Times-Roman",
                fill: colors.label,
              }}
            >
              {tool.name}
            </SvgText>
            {/* Usage bar */}
            <Rect
              x={sec3Left}
              y={y}
              width={barW}
              height={sec3BarH}
              rx={3}
              fill={colors.bars[i]}
            />
            <SvgText
              x={sec3Left + barW / 2}
              y={y + sec3BarH / 2 + 3}
              textAnchor="middle"
              style={{
                fontSize: 8,
                fontFamily: "Times-Bold",
                fill: "#FFFFFF",
              }}
            >
              {tool.usage}%
            </SvgText>

            {/* Satisfaction score */}
            {tool.satisfaction > 0 && (
              <G>
                <Rect
                  x={sec3Left + barW + 8}
                  y={y + 2}
                  width={42}
                  height={sec3BarH - 4}
                  rx={3}
                  fill={colors.satisfactionBg}
                  stroke={colors.satisfaction}
                  strokeWidth={0.8}
                />
                <SvgText
                  x={sec3Left + barW + 29}
                  y={y + sec3BarH / 2 + 3}
                  textAnchor="middle"
                  style={{
                    fontSize: 7,
                    fontFamily: "Times-Bold",
                    fill: colors.satisfaction,
                  }}
                >
                  ★ {tool.satisfaction}
                </SvgText>
              </G>
            )}
          </G>
        );
      })}

      {/* Legend */}
      <G>
        <Rect
          x={20}
          y={height - 22}
          width={455}
          height={18}
          rx={3}
          fill="#FAFAFA"
          stroke="#E0E0E0"
          strokeWidth={0.8}
        />
        <Rect
          x={30}
          y={height - 17}
          width={10}
          height={8}
          rx={2}
          fill={colors.bars[0]}
        />
        <SvgText
          x={44}
          y={height - 10}
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
        >
          Usage % among respondents
        </SvgText>
        <Rect
          x={180}
          y={height - 17}
          width={10}
          height={8}
          rx={2}
          fill={colors.satisfactionBg}
          stroke={colors.satisfaction}
          strokeWidth={0.8}
        />
        <SvgText
          x={194}
          y={height - 10}
          style={{ fontSize: 7, fontFamily: "Times-Roman", fill: colors.label }}
        >
          Satisfaction (1-5 scale)
        </SvgText>
        <SvgText
          x={330}
          y={height - 10}
          style={{
            fontSize: 7,
            fontFamily: "Times-Italic",
            fill: colors.sublabel,
          }}
        >
          Source: Flowgent Requirements Survey (n=47)
        </SvgText>
      </G>
    </Svg>
  );
}
