"use client";

import { Page, View, Text } from "@react-pdf/renderer";

export default function InnerCover() {
  return (
    <Page
      size="A4"
      wrap={false}
      style={{
        fontFamily: "Times-Roman",
        backgroundColor: "#ffffff",
        height: 842,
        minHeight: 842,
      }}
    >
      {/* Full-bleed top color bars (no padding) */}
      <View style={{ marginBottom: 0 }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 3, height: 10, backgroundColor: "#3b82f6" }} />
          <View style={{ flex: 2, height: 10, backgroundColor: "#6366f1" }} />
          <View style={{ flex: 1, height: 10, backgroundColor: "#06b6d4" }} />
          <View style={{ flex: 1.5, height: 10, backgroundColor: "#10b981" }} />
          <View style={{ flex: 1, height: 10, backgroundColor: "#f59e0b" }} />
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, height: 4, backgroundColor: "#f59e0b" }} />
          <View style={{ flex: 2, height: 4, backgroundColor: "#10b981" }} />
          <View style={{ flex: 3, height: 4, backgroundColor: "#06b6d4" }} />
          <View style={{ flex: 2, height: 4, backgroundColor: "#6366f1" }} />
          <View style={{ flex: 1, height: 4, backgroundColor: "#3b82f6" }} />
        </View>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              flex: 2,
              height: 2,
              backgroundColor: "#3b82f6",
              opacity: 0.3,
            }}
          />
          <View
            style={{
              flex: 1,
              height: 2,
              backgroundColor: "#6366f1",
              opacity: 0.3,
            }}
          />
          <View
            style={{
              flex: 3,
              height: 2,
              backgroundColor: "#06b6d4",
              opacity: 0.3,
            }}
          />
          <View
            style={{
              flex: 1,
              height: 2,
              backgroundColor: "#10b981",
              opacity: 0.3,
            }}
          />
          <View
            style={{
              flex: 2,
              height: 2,
              backgroundColor: "#f59e0b",
              opacity: 0.3,
            }}
          />
        </View>
      </View>

      {/* Main content area with padding */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: 48,
          paddingTop: 30,
          paddingBottom: 20,
          justifyContent: "space-between",
        }}
      >
        {/* ─── TOP: Architecture Overview ─── */}
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 8,
              color: "#94a3b8",
              letterSpacing: 3,
              fontFamily: "Helvetica",
              marginBottom: 22,
            }}
          >
            SYSTEM ARCHITECTURE
          </Text>

          {/* Row 1: Frontend */}
          <View style={{ marginBottom: 6 }}>
            <ArchBox
              label="React + Next.js Frontend"
              bg="#eef2ff"
              border="#6366f1"
            />
          </View>
          <View
            style={{ width: 1.5, height: 20, backgroundColor: "#cbd5e1" }}
          />

          {/* Row 2: Core layer */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ArchBox label="tRPC API Layer" bg="#f5f3ff" border="#8b5cf6" />
            <View
              style={{ width: 18, height: 1.5, backgroundColor: "#cbd5e1" }}
            />
            <ArchBox
              label="Execution Engine"
              bg="#eff6ff"
              border="#3b82f6"
              bold
            />
            <View
              style={{ width: 18, height: 1.5, backgroundColor: "#cbd5e1" }}
            />
            <ArchBox label="Integrations" bg="#ecfdf5" border="#06b6d4" />
          </View>

          {/* Connectors down */}
          <View style={{ flexDirection: "row", gap: 80 }}>
            <View
              style={{ width: 1.5, height: 20, backgroundColor: "#cbd5e1" }}
            />
            <View
              style={{ width: 1.5, height: 20, backgroundColor: "#cbd5e1" }}
            />
            <View
              style={{ width: 1.5, height: 20, backgroundColor: "#cbd5e1" }}
            />
          </View>

          {/* Row 3: Data & Auth & Queue */}
          <View style={{ flexDirection: "row", gap: 20 }}>
            <ArchBox
              label="PostgreSQL + Prisma"
              bg="#ecfdf5"
              border="#10b981"
            />
            <ArchBox label="Better Auth" bg="#fffbeb" border="#f59e0b" />
            <ArchBox label="Inngest Queue" bg="#eef2ff" border="#6366f1" />
          </View>
        </View>

        {/* ─── CENTER: Title Section ─── */}
        <View style={{ alignItems: "center" }}>
          {/* Color dots */}
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#3b82f6",
              }}
            />
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#6366f1",
              }}
            />
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#06b6d4",
              }}
            />
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#10b981",
              }}
            />
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#f59e0b",
              }}
            />
          </View>

          <Text
            style={{
              fontSize: 56,
              fontFamily: "Times-Bold",
              color: "#0f172a",
              letterSpacing: 8,
              marginBottom: 10,
            }}
          >
            FLOWGENT
          </Text>

          <Text
            style={{
              fontSize: 11,
              fontFamily: "Helvetica",
              color: "#94a3b8",
              letterSpacing: 4,
              marginBottom: 18,
            }}
          >
            VERSION 1.0
          </Text>

          {/* Colored accent bars */}
          <View style={{ flexDirection: "row", gap: 3, marginBottom: 22 }}>
            <View
              style={{
                width: 24,
                height: 3,
                backgroundColor: "#3b82f6",
                borderRadius: 1.5,
              }}
            />
            <View
              style={{
                width: 16,
                height: 3,
                backgroundColor: "#6366f1",
                borderRadius: 1.5,
              }}
            />
            <View
              style={{
                width: 20,
                height: 3,
                backgroundColor: "#06b6d4",
                borderRadius: 1.5,
              }}
            />
            <View
              style={{
                width: 12,
                height: 3,
                backgroundColor: "#10b981",
                borderRadius: 1.5,
              }}
            />
            <View
              style={{
                width: 14,
                height: 3,
                backgroundColor: "#f59e0b",
                borderRadius: 1.5,
              }}
            />
          </View>

          <Text
            style={{
              fontSize: 15,
              fontFamily: "Times-Italic",
              color: "#334155",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            AI-Powered Visual Workflow Automation Platform
          </Text>

          <View style={{ paddingHorizontal: 16 }}>
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Times-Roman",
                color: "#64748b",
                textAlign: "center",
                lineHeight: 1.7,
              }}
            >
              A modern, full-stack platform for building, scheduling, and
              executing automated workflows with real-time monitoring, team
              collaboration, and third-party integrations.
            </Text>
          </View>

          {/* Key Features */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 20,
              marginTop: 22,
            }}
          >
            <FeatureItem icon="◆" label="Visual Editor" color="#3b82f6" />
            <FeatureItem icon="◆" label="Scheduled Runs" color="#6366f1" />
            <FeatureItem icon="◆" label="Real-time Logs" color="#06b6d4" />
            <FeatureItem icon="◆" label="Team Collaboration" color="#10b981" />
          </View>
        </View>

        {/* ─── BOTTOM: Author & Tech ─── */}
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 14,
              borderTopWidth: 1,
              borderTopColor: "#e2e8f0",
              borderBottomWidth: 1,
              borderBottomColor: "#e2e8f0",
              marginBottom: 18,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 7,
                  color: "#94a3b8",
                  letterSpacing: 1,
                  fontFamily: "Helvetica",
                  marginBottom: 3,
                }}
              >
                AUTHOR
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Times-Bold",
                  color: "#0f172a",
                }}
              >
                Kanish Kumar
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 7,
                  color: "#94a3b8",
                  letterSpacing: 1,
                  fontFamily: "Helvetica",
                  marginBottom: 3,
                }}
              >
                INSTITUTION
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Times-Bold",
                  color: "#0f172a",
                }}
              >
                Hindu College, Amritsar
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontSize: 7,
                  color: "#94a3b8",
                  letterSpacing: 1,
                  fontFamily: "Helvetica",
                  marginBottom: 3,
                }}
              >
                ACADEMIC YEAR
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Times-Bold",
                  color: "#0f172a",
                }}
              >
                2025-2026
              </Text>
            </View>
          </View>

          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 9,
                fontFamily: "Times-Italic",
                color: "#94a3b8",
                marginBottom: 5,
              }}
            >
              Built with
            </Text>
            <Text
              style={{
                fontSize: 9,
                fontFamily: "Times-Roman",
                color: "#64748b",
                textAlign: "center",
              }}
            >
              Next.js 16 · React 19 · TypeScript · tRPC · PostgreSQL · Prisma
              ORM · Inngest · Better Auth
            </Text>
          </View>
        </View>
      </View>

      {/* Full-bleed bottom color bars (no padding) */}
      <View>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              flex: 2,
              height: 2,
              backgroundColor: "#f59e0b",
              opacity: 0.3,
            }}
          />
          <View
            style={{
              flex: 3,
              height: 2,
              backgroundColor: "#10b981",
              opacity: 0.3,
            }}
          />
          <View
            style={{
              flex: 1,
              height: 2,
              backgroundColor: "#06b6d4",
              opacity: 0.3,
            }}
          />
          <View
            style={{
              flex: 2,
              height: 2,
              backgroundColor: "#6366f1",
              opacity: 0.3,
            }}
          />
          <View
            style={{
              flex: 1,
              height: 2,
              backgroundColor: "#3b82f6",
              opacity: 0.3,
            }}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, height: 4, backgroundColor: "#3b82f6" }} />
          <View style={{ flex: 2, height: 4, backgroundColor: "#6366f1" }} />
          <View style={{ flex: 3, height: 4, backgroundColor: "#06b6d4" }} />
          <View style={{ flex: 1.5, height: 4, backgroundColor: "#10b981" }} />
          <View style={{ flex: 1, height: 4, backgroundColor: "#f59e0b" }} />
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, height: 10, backgroundColor: "#f59e0b" }} />
          <View style={{ flex: 1.5, height: 10, backgroundColor: "#10b981" }} />
          <View style={{ flex: 1, height: 10, backgroundColor: "#06b6d4" }} />
          <View style={{ flex: 2, height: 10, backgroundColor: "#6366f1" }} />
          <View style={{ flex: 3, height: 10, backgroundColor: "#3b82f6" }} />
        </View>
      </View>
    </Page>
  );
}

/* ─── Architecture Box ─── */
function ArchBox({
  label,
  bg,
  border,
  bold = false,
}: {
  label: string;
  bg: string;
  border: string;
  bold?: boolean;
}) {
  return (
    <View
      style={{
        borderWidth: bold ? 1.5 : 1,
        borderColor: border,
        backgroundColor: bg,
        borderRadius: 3,
        paddingHorizontal: 14,
        paddingVertical: 8,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 7.5,
          fontFamily: bold ? "Helvetica-Bold" : "Helvetica",
          color: "#334155",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

/* ─── Feature Item ─── */
function FeatureItem({
  label,
  color,
}: {
  icon?: string;
  label: string;
  color: string;
}) {
  return (
    <View style={{ alignItems: "center", gap: 3 }}>
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: color,
        }}
      />
      <Text
        style={{
          fontSize: 7.5,
          fontFamily: "Helvetica",
          color: "#475569",
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
