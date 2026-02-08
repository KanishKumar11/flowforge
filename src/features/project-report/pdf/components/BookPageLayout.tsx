"use client";

import { Page, View, Text } from "@react-pdf/renderer";
import { PAGE_MARGINS, HEADER_TOP, FOOTER_BOTTOM } from "../styles";

interface BookPageLayoutProps {
  children: React.ReactNode;
  chapterTitle?: string;
  chapterNum?: string;
}

/**
 * Modern Book Layout with Headers and Footers
 * Content automatically wraps to new pages.
 * Header and footer repeat on every page via `fixed`.
 */
export default function BookPageLayout({
  children,
  chapterTitle,
  chapterNum,
}: BookPageLayoutProps) {
  return (
    <Page
      size="A4"
      wrap
      style={{
        paddingTop: PAGE_MARGINS.top,
        paddingBottom: PAGE_MARGINS.bottom,
        paddingLeft: PAGE_MARGINS.left,
        paddingRight: PAGE_MARGINS.right,
        fontFamily: "Times-Roman",
        fontSize: 12,
        lineHeight: 1.5,
        color: "#000000",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Header — absolute positioned, repeats on every page */}
      <View
        fixed
        style={{
          position: "absolute",
          top: HEADER_TOP,
          left: PAGE_MARGINS.left,
          right: PAGE_MARGINS.right,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 9,
              fontFamily: "Times-Roman",
              color: "#666666",
              letterSpacing: 0.5,
            }}
          >
            {chapterNum ? `CHAPTER ${chapterNum}` : ""}
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontFamily: "Times-Bold",
              color: "#000000",
              maxWidth: "60%",
              textAlign: "right",
            }}
          >
            {chapterTitle}
          </Text>
        </View>
        <View
          style={{
            height: 1,
            marginTop: 8,
            backgroundColor: "#cccccc",
          }}
        />
      </View>

      {/* Main Content — automatically wraps to new pages */}
      {children}

      {/* Footer divider line — absolute, repeats via fixed */}
      <View
        fixed
        style={{
          position: "absolute",
          bottom: FOOTER_BOTTOM + 20,
          left: PAGE_MARGINS.left,
          right: PAGE_MARGINS.right,
          height: 1,
          backgroundColor: "#cccccc",
        }}
      />

      {/* Footer left text — absolute, repeats via fixed */}
      <Text
        fixed
        style={{
          position: "absolute",
          bottom: FOOTER_BOTTOM,
          left: PAGE_MARGINS.left,
          fontSize: 9,
          fontFamily: "Times-Roman",
          color: "#666666",
        }}
      >
        Flowgent 1.0 — Project Report
      </Text>
    </Page>
  );
}
