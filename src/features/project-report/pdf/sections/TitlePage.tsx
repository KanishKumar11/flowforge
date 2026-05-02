"use client";

import { Page, View, Text, Image } from "@react-pdf/renderer";

/**
 * Title Page - No page number, light theme, matches reference layout
 */
export default function TitlePage() {
  return (
    <Page
      size="A4"
      style={{
        paddingHorizontal: 56,
        paddingTop: 56,
        paddingBottom: 56,
        fontFamily: "Times-Roman",
        backgroundColor: "#ffffff",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* ── TOP SECTION ── */}
      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontSize: 9,
            fontFamily: "Times-Roman",
            textTransform: "uppercase",
            letterSpacing: 3,
            color: "#333333",
            marginBottom: 6,
          }}
        >
          A Project Report on
        </Text>

        {/* Main Title */}
        <Text
          style={{
            fontSize: 56,
            fontFamily: "Times-Bold",
            letterSpacing: 1,
            color: "#000000",
            marginBottom: 4,
          }}
        >
          Flowgent 1.0
        </Text>

        {/* Subtitle */}
        <Text
          style={{
            fontSize: 13,
            fontFamily: "Times-Italic",
            color: "#444444",
            marginBottom: 10,
          }}
        >
          Visual Workflow Automation Platform
        </Text>

        {/* Project Logo */}
        <View
          style={{
            backgroundColor: "#000000",
            padding: 8,
            borderRadius: 4,
            marginBottom: 0,
          }}
        >
          <Image src="/logo.png" style={{ width: 52, height: 52 }} />
        </View>
      </View>

      {/* ── MIDDLE SECTION ── */}
      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontSize: 9,
            fontFamily: "Times-Bold",
            textTransform: "uppercase",
            letterSpacing: 1.5,
            color: "#222222",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Submitted in Partial Fulfillment for the Award of Degree of
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontFamily: "Times-Bold",
            color: "#000000",
            marginBottom: 3,
          }}
        >
          Bachelor of Computer Applications
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Times-Roman",
            color: "#333333",
          }}
        >
          (BCA)
        </Text>
      </View>

      {/* ── SUBMITTED BY / GUIDANCE ROW ── */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 8,
        }}
      >
        {/* Left: Student */}
        <View>
          <Text
            style={{
              fontSize: 8,
              fontFamily: "Times-Roman",
              textTransform: "uppercase",
              letterSpacing: 1.5,
              color: "#666666",
              marginBottom: 4,
            }}
          >
            Submitted By
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: "Times-Bold",
              color: "#000000",
              marginBottom: 2,
            }}
          >
            Kanish Kumar
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontFamily: "Times-Roman",
              color: "#444444",
            }}
          >
            Roll No: 11792312331
          </Text>
        </View>

        {/* Right: Guides */}
        <View style={{ alignItems: "flex-start" }}>
          <Text
            style={{
              fontSize: 8,
              fontFamily: "Times-Roman",
              textTransform: "uppercase",
              letterSpacing: 1.5,
              color: "#666666",
              marginBottom: 4,
            }}
          >
            Under the Guidance of
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Times-Bold",
              color: "#000000",
              marginBottom: 1,
            }}
          >
            Mr. Anshuman Sharma
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Times-Roman",
              color: "#333333",
              marginBottom: 1,
            }}
          >
            &amp;
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Times-Bold",
              color: "#000000",
            }}
          >
            Dr. Sunny Sharma
          </Text>
        </View>
      </View>

      {/* ── BOTTOM SECTION: College ── */}
      <View style={{ alignItems: "center" }}>
        {/* GNDU Logo */}
        <Image
          src="/gndu.png"
          style={{ width: 180, height: 180, marginBottom: 14 }}
        />

        <Text
          style={{
            fontSize: 10,
            fontFamily: "Times-Roman",
            color: "#333333",
            marginBottom: 4,
          }}
        >
          PG Department of Computer Science and Applications
        </Text>

        <Text
          style={{
            fontSize: 17,
            fontFamily: "Times-Bold",
            textTransform: "uppercase",
            letterSpacing: 2,
            color: "#000000",
            marginBottom: 4,
          }}
        >
          Hindu College, Amritsar
        </Text>

        <Text
          style={{
            fontSize: 10,
            fontFamily: "Times-Italic",
            color: "#444444",
            marginBottom: 6,
          }}
        >
          Affiliated to Guru Nanak Dev University, Amritsar
        </Text>

        <Text
          style={{
            fontSize: 11,
            fontFamily: "Times-Bold",
            color: "#000000",
          }}
        >
          Batch Year: 2023-2026
        </Text>
      </View>
    </Page>
  );
}
