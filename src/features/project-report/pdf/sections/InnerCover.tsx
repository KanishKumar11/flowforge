"use client";

import {
  Page,
  View,
  Text,
  Svg,
  Rect,
  Line,
  Circle,
  G,
} from "@react-pdf/renderer";

/**
 * Creative Inner Cover Page
 * A modern, visual branding page placed after the formal title page.
 * Features a simplified system architecture silhouette and project identity.
 */
export default function InnerCover() {
  return (
    <Page
      size="A4"
      style={{
        backgroundColor: "#0f172a",
        padding: 0,
      }}
    >
      {/* Background grid pattern */}
      <Svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 595,
          height: 842,
        }}
      >
        {/* Subtle grid lines */}
        {Array.from({ length: 30 }).map((_, i) => (
          <Line
            key={`h-${i}`}
            x1={0}
            y1={i * 28}
            x2={595}
            y2={i * 28}
            stroke="#1e293b"
            strokeWidth={0.5}
          />
        ))}
        {Array.from({ length: 22 }).map((_, i) => (
          <Line
            key={`v-${i}`}
            x1={i * 28}
            y1={0}
            x2={i * 28}
            y2={842}
            stroke="#1e293b"
            strokeWidth={0.5}
          />
        ))}
      </Svg>

      {/* Architecture diagram silhouette */}
      <Svg
        style={{
          position: "absolute",
          top: 180,
          left: 60,
          width: 475,
          height: 340,
        }}
      >
        {/* Central node - Execution Engine */}
        <Rect
          x={180}
          y={130}
          width={115}
          height={46}
          rx={4}
          fill="#1e3a5f"
          stroke="#3b82f6"
          strokeWidth={1.5}
        />
        <Text
          x={237}
          y={158}
          style={{
            fontSize: 8,
            fontFamily: "Courier",
            fill: "#94a3b8",
            textAnchor: "middle" as const,
          }}
        >
          EXECUTION ENGINE
        </Text>

        {/* Top node - React Frontend */}
        <Rect
          x={180}
          y={20}
          width={115}
          height={40}
          rx={4}
          fill="#1e3a5f"
          stroke="#3b82f6"
          strokeWidth={1}
        />
        <Text
          x={237}
          y={44}
          style={{
            fontSize: 8,
            fontFamily: "Courier",
            fill: "#94a3b8",
            textAnchor: "middle" as const,
          }}
        >
          REACT FRONTEND
        </Text>

        {/* Left node - tRPC API */}
        <Rect
          x={30}
          y={130}
          width={100}
          height={40}
          rx={4}
          fill="#1e3a5f"
          stroke="#3b82f6"
          strokeWidth={1}
        />
        <Text
          x={80}
          y={154}
          style={{
            fontSize: 8,
            fontFamily: "Courier",
            fill: "#94a3b8",
            textAnchor: "middle" as const,
          }}
        >
          tRPC API
        </Text>

        {/* Right node - Integrations */}
        <Rect
          x={345}
          y={130}
          width={100}
          height={40}
          rx={4}
          fill="#1e3a5f"
          stroke="#3b82f6"
          strokeWidth={1}
        />
        <Text
          x={395}
          y={154}
          style={{
            fontSize: 8,
            fontFamily: "Courier",
            fill: "#94a3b8",
            textAnchor: "middle" as const,
          }}
        >
          INTEGRATIONS
        </Text>

        {/* Bottom left - PostgreSQL */}
        <Rect
          x={70}
          y={250}
          width={105}
          height={40}
          rx={4}
          fill="#1e3a5f"
          stroke="#3b82f6"
          strokeWidth={1}
        />
        <Text
          x={122}
          y={274}
          style={{
            fontSize: 8,
            fontFamily: "Courier",
            fill: "#94a3b8",
            textAnchor: "middle" as const,
          }}
        >
          POSTGRESQL
        </Text>

        {/* Bottom right - Auth */}
        <Rect
          x={300}
          y={250}
          width={105}
          height={40}
          rx={4}
          fill="#1e3a5f"
          stroke="#3b82f6"
          strokeWidth={1}
        />
        <Text
          x={352}
          y={274}
          style={{
            fontSize: 8,
            fontFamily: "Courier",
            fill: "#94a3b8",
            textAnchor: "middle" as const,
          }}
        >
          BETTER AUTH
        </Text>

        {/* Connecting lines */}
        <Line
          x1={237}
          y1={60}
          x2={237}
          y2={130}
          stroke="#334155"
          strokeWidth={1}
        />
        <Line
          x1={130}
          y1={150}
          x2={180}
          y2={150}
          stroke="#334155"
          strokeWidth={1}
        />
        <Line
          x1={295}
          y1={150}
          x2={345}
          y2={150}
          stroke="#334155"
          strokeWidth={1}
        />
        <Line
          x1={200}
          y1={176}
          x2={140}
          y2={250}
          stroke="#334155"
          strokeWidth={1}
        />
        <Line
          x1={270}
          y1={176}
          x2={335}
          y2={250}
          stroke="#334155"
          strokeWidth={1}
        />

        {/* Data flow dots */}
        <Circle cx={237} cy={95} r={2.5} fill="#3b82f6" opacity={0.6} />
        <Circle cx={155} cy={150} r={2.5} fill="#3b82f6" opacity={0.6} />
        <Circle cx={320} cy={150} r={2.5} fill="#3b82f6" opacity={0.6} />
        <Circle cx={170} cy={213} r={2.5} fill="#3b82f6" opacity={0.6} />
        <Circle cx={302} cy={213} r={2.5} fill="#3b82f6" opacity={0.6} />

        {/* Accent glow circles */}
        <Circle
          cx={237}
          cy={153}
          r={6}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={0.5}
          opacity={0.3}
        />
        <Circle
          cx={237}
          cy={153}
          r={12}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={0.3}
          opacity={0.15}
        />
      </Svg>

      {/* Top accent line */}
      <View
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          right: 60,
          height: 1,
          backgroundColor: "#1e293b",
        }}
      />

      {/* Version tag — top right */}
      <View
        style={{
          position: "absolute",
          top: 40,
          right: 60,
        }}
      >
        <Text
          style={{
            fontSize: 8,
            fontFamily: "Courier",
            color: "#475569",
            letterSpacing: 2,
          }}
        >
          v1.0.0
        </Text>
      </View>

      {/* Project identity — top left */}
      <View
        style={{
          position: "absolute",
          top: 80,
          left: 60,
        }}
      >
        <Text
          style={{
            fontSize: 8,
            fontFamily: "Courier",
            color: "#475569",
            letterSpacing: 3,
          }}
        >
          PROJECT REPORT
        </Text>
      </View>

      {/* Main title block */}
      <View
        style={{
          position: "absolute",
          bottom: 240,
          left: 60,
          right: 60,
        }}
      >
        <Text
          style={{
            fontSize: 56,
            fontFamily: "Times-Bold",
            color: "#f1f5f9",
            letterSpacing: 6,
          }}
        >
          FLOWGENT
        </Text>
        <View
          style={{
            width: 60,
            height: 3,
            backgroundColor: "#3b82f6",
            marginTop: 12,
            marginBottom: 16,
          }}
        />
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Times-Roman",
            color: "#94a3b8",
            letterSpacing: 1,
          }}
        >
          Visual Workflow Automation Platform
        </Text>
      </View>

      {/* Bottom metadata */}
      <View
        style={{
          position: "absolute",
          bottom: 60,
          left: 60,
          right: 60,
        }}
      >
        <View
          style={{
            height: 1,
            backgroundColor: "#1e293b",
            marginBottom: 16,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 7,
                fontFamily: "Courier",
                color: "#475569",
                letterSpacing: 2,
                marginBottom: 4,
              }}
            >
              AUTHOR
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Times-Bold",
                color: "#cbd5e1",
              }}
            >
              Kanish Kumar
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 7,
                fontFamily: "Courier",
                color: "#475569",
                letterSpacing: 2,
                marginBottom: 4,
              }}
            >
              INSTITUTION
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Times-Bold",
                color: "#cbd5e1",
              }}
            >
              Hindu College, Amritsar
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 7,
                fontFamily: "Courier",
                color: "#475569",
                letterSpacing: 2,
                marginBottom: 4,
              }}
            >
              YEAR
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontFamily: "Times-Bold",
                color: "#cbd5e1",
              }}
            >
              2025 — 2026
            </Text>
          </View>
        </View>

        {/* Tech stack pills */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {[
            "Next.js",
            "TypeScript",
            "React",
            "tRPC",
            "Prisma",
            "PostgreSQL",
            "Inngest",
            "Better Auth",
          ].map((tech) => (
            <View
              key={tech}
              style={{
                borderWidth: 1,
                borderColor: "#334155",
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 7,
                  fontFamily: "Courier",
                  color: "#64748b",
                  letterSpacing: 0.5,
                }}
              >
                {tech}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  );
}
