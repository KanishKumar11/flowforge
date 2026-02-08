"use client";

import { Page, View, Text } from "@react-pdf/renderer";
import { styles, toRoman, PAGE_MARGINS } from "../styles";
import type { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
  pageNumber: number;
  isRoman?: boolean; // true for preliminary pages (i, ii, iii...)
  showHeader?: boolean;
  headerText?: string;
  noMargin?: boolean;
}

/**
 * Reusable page wrapper with consistent margins, optional header, and footer
 */
export default function PageWrapper({
  children,
  pageNumber,
  isRoman = false,
  showHeader = false,
  headerText = "",
  noMargin = false,
}: PageWrapperProps) {
  const pageNumberText = isRoman ? toRoman(pageNumber) : String(pageNumber);

  return (
    <Page size="A4" style={noMargin ? styles.pageNoMargin : styles.page}>
      {/* Optional Header */}
      {showHeader && headerText && (
        <View
          style={{
            position: "absolute",
            top: PAGE_MARGINS.top,
            left: PAGE_MARGINS.left,
            right: PAGE_MARGINS.right,
            borderBottomWidth: 1,
            borderBottomColor: "#333333",
            paddingBottom: 8,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: 2,
              color: "#666666",
              textAlign: "right",
            }}
          >
            {headerText}
          </Text>
        </View>
      )}

      {/* Main Content */}
      <View style={{ flex: 1, paddingTop: showHeader ? 30 : 0 }}>
        {children}
      </View>

      {/* Footer with Page Number */}
      <View style={styles.footer} fixed>
        <Text>{pageNumberText}</Text>
      </View>
    </Page>
  );
}
