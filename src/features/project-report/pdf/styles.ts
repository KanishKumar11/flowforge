import { StyleSheet, Font } from "@react-pdf/renderer";

// Standard standard fonts are used: Times-Roman, Times-Bold, Times-Italic

// A4 dimensions: 210mm x 297mm = 595pt x 842pt
// Premium report margins - consistent across ALL pages
export const PAGE_MARGINS = {
  top: 70, // Space for header
  bottom: 60, // Space for footer
  left: 50, // Generous side margins for premium feel
  right: 50,
};

// Header/Footer positioning
export const HEADER_TOP = 25;
export const FOOTER_BOTTOM = 30;

// Roman numeral converter
export const toRoman = (num: number): string => {
  const romanNumerals: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let result = "";
  for (const [value, numeral] of romanNumerals) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result.toLowerCase();
};

// Base styles shared across all pages
export const styles = StyleSheet.create({
  // Page layouts
  page: {
    paddingTop: PAGE_MARGINS.top,
    paddingBottom: PAGE_MARGINS.bottom,
    paddingLeft: PAGE_MARGINS.left,
    paddingRight: PAGE_MARGINS.right,
    fontFamily: "Times-Roman",
    fontSize: 12,
    lineHeight: 1.5,
    color: "#000000",
    backgroundColor: "#ffffff",
  },
  pageNoMargin: {
    fontFamily: "Times-Roman",
    fontSize: 12,
    lineHeight: 1.5,
    color: "#000000",
    backgroundColor: "#ffffff",
  },

  // Typography
  h1: {
    fontSize: 26,
    fontFamily: "Times-Bold",
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  h2: {
    fontSize: 20,
    fontFamily: "Times-Bold",
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: "#222222",
  },
  h3: {
    fontSize: 16,
    fontFamily: "Times-Bold",
    marginBottom: 10,
    marginTop: 6,
  },
  paragraph: {
    fontSize: 12,
    textAlign: "justify",
    marginBottom: 10,
    lineHeight: 1.6, // Slightly clearer reading flow
  },
  paragraphIndent: {
    fontSize: 12,
    textAlign: "justify",
    marginBottom: 10,
    lineHeight: 1.6,
    textIndent: 42,
  },

  // Layout utilities
  flexRow: {
    flexDirection: "row",
  },
  flexCol: {
    flexDirection: "column",
  },
  flexBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flexCenter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textCenter: {
    textAlign: "center",
  },
  textRight: {
    textAlign: "right",
  },
  textJustify: {
    textAlign: "justify",
  },

  // Spacing
  mt4: { marginTop: 16 },
  mt8: { marginTop: 32 },
  mt12: { marginTop: 48 },
  mb4: { marginBottom: 16 },
  mb8: { marginBottom: 32 },
  mb12: { marginBottom: 48 },
  py4: { paddingTop: 16, paddingBottom: 16 },
  px4: { paddingLeft: 16, paddingRight: 16 },

  // Decorative elements
  underline: {
    width: 80,
    height: 3,
    backgroundColor: "#000000",
    marginTop: 12,
  },
  divider: {
    width: "100%",
    height: 0.5,
    backgroundColor: "#444444",
    marginTop: 18,
    marginBottom: 18,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 11,
    fontFamily: "Times-Roman",
    color: "#444444",
  },

  // Tables
  table: {
    width: "100%",
    marginTop: 14,
    marginBottom: 14,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#444444",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: "#222222",
    backgroundColor: "#D9E2F3",
    fontFamily: "Times-Bold",
  },
  tableCell: {
    padding: 10,
    fontSize: 11,
    lineHeight: 1.4,
  },

  // Bold text
  bold: {
    fontFamily: "Times-Bold",
  },
  italic: {
    fontFamily: "Times-Italic",
  },

  // Border box
  borderBox: {
    borderWidth: 1.5,
    borderColor: "#000000",
    padding: 16,
  },

  // Signature section
  signatureBlock: {
    marginTop: 48,
    alignItems: "flex-end",
  },
  signatureLine: {
    width: 180,
    borderTopWidth: 1.5,
    borderTopColor: "#000000",
    marginBottom: 6,
  },
});
