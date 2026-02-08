"use client";

import { Page, View, Text } from "@react-pdf/renderer";

/**
 * Inner Cover Page - unnumbered decorative page after the hardcover title.
 */
export default function InnerCoverPage() {
  return (
    <Page
      size="A4"
      style={{
        padding: 60,
        fontFamily: "Times-Roman",
        backgroundColor: "#ffffff",
      }}
    >
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View>
          <Text
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: 3,
              color: "#666666",
              marginBottom: 12,
            }}
          >
            Project Report
          </Text>
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Times-Bold",
              letterSpacing: 2,
              color: "#111111",
            }}
          >
            FLOWGENT 1.0
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Times-Italic",
              color: "#444444",
              marginTop: 6,
            }}
          >
            Visual Workflow Automation Platform
          </Text>
        </View>

        <View>
          <View
            style={{
              height: 1,
              backgroundColor: "#dddddd",
              marginBottom: 18,
            }}
          />
          <Text style={{ fontSize: 10, color: "#666666" }}>
            Department of Computer Applications
          </Text>
          <Text style={{ fontSize: 10, color: "#666666", marginTop: 2 }}>
            Hindu College, Amritsar
          </Text>
          <Text style={{ fontSize: 10, color: "#666666", marginTop: 2 }}>
            Academic Session 2025-26
          </Text>
        </View>
      </View>

      {/* Watermark */}
      <Text
        style={{
          position: "absolute",
          right: 40,
          bottom: 30,
          fontSize: 48,
          fontFamily: "Times-Bold",
          color: "#f2f2f2",
          letterSpacing: 4,
        }}
      >
        FLOWGENT
      </Text>
    </Page>
  );
}
