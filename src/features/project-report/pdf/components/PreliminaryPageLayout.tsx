"use client";

import { Page, View, Text } from "@react-pdf/renderer";
import { styles, toRoman, PAGE_MARGINS, FOOTER_BOTTOM } from "../styles";

interface PreliminaryPageLayoutProps {
  children: React.ReactNode;
  pageNumber: number;
}

/**
 * Layout for Preliminary Pages (Declaration, Certificate, etc.)
 * Uses consistent margins from styles.ts
 */
export default function PreliminaryPageLayout({
  children,
  pageNumber,
}: PreliminaryPageLayoutProps) {
  return (
    <Page
      size="A4"
      style={{
        paddingTop: 50, // Smaller top margin - no header on prelim pages
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
      {/* Main Content */}
      {children}

      {/* Footer - Minimal Design (Page Number Only) */}
      <View
        fixed
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 10,
            fontFamily: "Times-Roman",
            color: "#444444",
          }}
        >
          {toRoman(pageNumber)}
        </Text>
      </View>
    </Page>
  );
}
