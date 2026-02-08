"use client";

import { Page, View, Text } from "@react-pdf/renderer";
import { styles, toRoman, PAGE_MARGINS, FOOTER_BOTTOM } from "../styles";

interface TableOfContentsProps {
  startPage: number;
}

const tocItems = [
  // Front Matter
  { chapter: "", title: "Declaration", page: "i", type: "intro" },
  { chapter: "", title: "Certificate", page: "ii", type: "intro" },
  { chapter: "", title: "Acknowledgement", page: "iii", type: "intro" },
  { chapter: "", title: "Preface", page: "iv", type: "intro" },
  { chapter: "", title: "Abstract", page: "v", type: "intro" },
  { chapter: "", title: "List of Figures", page: "xi", type: "intro" },
  { chapter: "", title: "List of Tables", page: "xii", type: "intro" },
  { chapter: "", title: "List of Acronyms", page: "xvi", type: "intro" },

  // Chapter 1
  { chapter: "01", title: "INTRODUCTION", page: "1", type: "main" },
  { chapter: "", title: "1.1 Project Overview", page: "1", type: "sub" },
  { chapter: "", title: "1.2 Background", page: "1", type: "sub" },
  { chapter: "", title: "1.3 Problem Statement", page: "2", type: "sub" },
  { chapter: "", title: "1.4 Motivation", page: "3", type: "sub" },
  { chapter: "", title: "1.5 Project Objectives", page: "3", type: "sub" },
  { chapter: "", title: "1.6 Proposed Solution", page: "4", type: "sub" },
  { chapter: "", title: "1.7 Technology Stack", page: "4", type: "sub" },
  {
    chapter: "",
    title: "1.8 Technology Justification",
    page: "5",
    type: "sub",
  },
  { chapter: "", title: "1.9 Scope of the Project", page: "6", type: "sub" },
  { chapter: "", title: "1.10 Key Features Summary", page: "6", type: "sub" },
  { chapter: "", title: "1.11 Report Organization", page: "7", type: "sub" },

  // Chapter 2
  { chapter: "02", title: "PROBLEM STATEMENT", page: "7", type: "main" },
  { chapter: "", title: "2.1 Introduction", page: "7", type: "sub" },
  { chapter: "", title: "2.2 Problem Statement", page: "7", type: "sub" },
  {
    chapter: "",
    title: "2.3 Market Demand & Industry Trends",
    page: "10",
    type: "sub",
  },
  {
    chapter: "",
    title: "2.4 Analysis of Existing Solutions",
    page: "11",
    type: "sub",
  },
  { chapter: "", title: "2.5 Comparative Analysis", page: "13", type: "sub" },
  { chapter: "", title: "2.6 Gap Analysis", page: "14", type: "sub" },
  {
    chapter: "",
    title: "2.7 Proposed Solution Overview",
    page: "15",
    type: "sub",
  },
  {
    chapter: "",
    title: "2.8 Justification for New Development",
    page: "16",
    type: "sub",
  },
  { chapter: "", title: "2.9 Summary", page: "17", type: "sub" },

  // Chapter 3
  { chapter: "03", title: "OBJECTIVES", page: "17", type: "main" },
  { chapter: "", title: "3.1 Introduction", page: "17", type: "sub" },
  { chapter: "", title: "3.2 Primary Objectives", page: "17", type: "sub" },
  { chapter: "", title: "3.3 Secondary Objectives", page: "20", type: "sub" },
  { chapter: "", title: "3.4 Technical Objectives", page: "22", type: "sub" },
  { chapter: "", title: "3.5 Expected Outcomes", page: "23", type: "sub" },
  { chapter: "", title: "3.6 Summary", page: "24", type: "sub" },

  // Chapter 4
  { chapter: "04", title: "FEASIBILITY STUDY", page: "25", type: "main" },
  { chapter: "", title: "4.1 Introduction", page: "25", type: "sub" },
  { chapter: "", title: "4.2 Technical Feasibility", page: "25", type: "sub" },
  { chapter: "", title: "4.3 Economic Feasibility", page: "27", type: "sub" },
  {
    chapter: "",
    title: "4.4 Operational Feasibility",
    page: "28",
    type: "sub",
  },
  { chapter: "", title: "4.5 Schedule Feasibility", page: "29", type: "sub" },
  { chapter: "", title: "4.6 Legal Feasibility", page: "30", type: "sub" },
  { chapter: "", title: "4.7 SWOT Analysis", page: "31", type: "sub" },
  { chapter: "", title: "4.8 Feasibility Summary", page: "32", type: "sub" },
  { chapter: "", title: "4.9 Conclusion", page: "33", type: "sub" },

  // Chapter 5
  {
    chapter: "05",
    title: "SOFTWARE DEVELOPMENT LIFE CYCLE",
    page: "34",
    type: "main",
  },
  { chapter: "", title: "5.1 Introduction to SDLC", page: "34", type: "sub" },
  { chapter: "", title: "5.2 Process Model", page: "40", type: "sub" },
  { chapter: "", title: "5.3 Requirement Gathering", page: "46", type: "sub" },
  {
    chapter: "",
    title: "5.4 Software Requirement Specification",
    page: "55",
    type: "sub",
  },

  // Chapter 6
  { chapter: "06", title: "SYSTEM DESIGN", page: "66", type: "main" },
  { chapter: "", title: "6.1 Introduction", page: "66", type: "sub" },
  { chapter: "", title: "6.2 Data Flow Diagrams", page: "66", type: "sub" },
  { chapter: "", title: "6.3 Use Case Diagrams", page: "67", type: "sub" },
  {
    chapter: "",
    title: "6.4 Entity-Relationship Diagram",
    page: "68",
    type: "sub",
  },
  { chapter: "", title: "6.5 System Architecture", page: "68", type: "sub" },
  { chapter: "", title: "6.6 Database Schema", page: "69", type: "sub" },
  { chapter: "", title: "6.7 Design Patterns", page: "70", type: "sub" },
  { chapter: "", title: "6.8 Security Design", page: "71", type: "sub" },
  { chapter: "", title: "6.9 Interaction Design", page: "72", type: "sub" },
  { chapter: "", title: "6.10 Summary", page: "72", type: "sub" },

  // Chapter 7
  {
    chapter: "07",
    title: "PROJECT ESTIMATION & PLANNING",
    page: "72",
    type: "main",
  },
  { chapter: "", title: "7.1 Introduction to COCOMO", page: "72", type: "sub" },
  {
    chapter: "",
    title: "7.2 Lines of Code Estimation",
    page: "72",
    type: "sub",
  },
  { chapter: "", title: "7.3 Basic COCOMO Model", page: "73", type: "sub" },
  {
    chapter: "",
    title: "7.4 Intermediate COCOMO Model",
    page: "74",
    type: "sub",
  },
  { chapter: "", title: "7.5 Risk Analysis", page: "75", type: "sub" },
  {
    chapter: "",
    title: "7.6 Actual vs Estimated Comparison",
    page: "75",
    type: "sub",
  },
  { chapter: "", title: "7.7 Summary", page: "76", type: "sub" },

  // Chapter 8
  { chapter: "08", title: "IMPLEMENTATION", page: "77", type: "main" },
  { chapter: "", title: "8.1 Introduction", page: "77", type: "sub" },
  { chapter: "", title: "8.2 Project Structure", page: "77", type: "sub" },
  {
    chapter: "",
    title: "8.3 Frontend Implementation",
    page: "78",
    type: "sub",
  },
  { chapter: "", title: "8.4 Backend Implementation", page: "79", type: "sub" },
  {
    chapter: "",
    title: "8.5 Workflow Execution Engine",
    page: "81",
    type: "sub",
  },
  {
    chapter: "",
    title: "8.6 Node Types Implementation",
    page: "82",
    type: "sub",
  },
  {
    chapter: "",
    title: "8.7 Integration Implementation",
    page: "83",
    type: "sub",
  },
  {
    chapter: "",
    title: "8.8 Key Features Implementation",
    page: "84",
    type: "sub",
  },
  { chapter: "", title: "8.9 API Routes", page: "85", type: "sub" },
  { chapter: "", title: "8.10 Deployment", page: "86", type: "sub" },
  { chapter: "", title: "8.11 Summary", page: "87", type: "sub" },

  // Chapter 9
  { chapter: "09", title: "TESTING", page: "88", type: "main" },
  {
    chapter: "",
    title: "9.1 Software Engineering Principles",
    page: "88",
    type: "sub",
  },
  { chapter: "", title: "9.2 Testing Strategy", page: "89", type: "sub" },
  { chapter: "", title: "9.3 Unit Testing", page: "89", type: "sub" },
  { chapter: "", title: "9.4 Integration Testing", page: "90", type: "sub" },
  { chapter: "", title: "9.5 System Testing", page: "91", type: "sub" },
  { chapter: "", title: "9.6 UI/UX Testing", page: "91", type: "sub" },
  { chapter: "", title: "9.7 Security Testing", page: "92", type: "sub" },
  { chapter: "", title: "9.8 Performance Testing", page: "92", type: "sub" },
  { chapter: "", title: "9.9 Defect Tracking", page: "93", type: "sub" },
  { chapter: "", title: "9.10 Test Results Summary", page: "93", type: "sub" },
  { chapter: "", title: "9.11 Testing Conclusion", page: "93", type: "sub" },

  // Chapter 10
  { chapter: "10", title: "OUTPUT & SCREENSHOTS", page: "95", type: "main" },
  {
    chapter: "",
    title: "10.1 Authentication Screens",
    page: "95",
    type: "sub",
  },
  { chapter: "", title: "10.2 Dashboard", page: "95", type: "sub" },
  {
    chapter: "",
    title: "10.3 Visual Workflow Editor",
    page: "96",
    type: "sub",
  },
  { chapter: "", title: "10.4 Workflows Management", page: "96", type: "sub" },
  { chapter: "", title: "10.5 Execution History", page: "96", type: "sub" },
  { chapter: "", title: "10.6 Credential Management", page: "97", type: "sub" },
  { chapter: "", title: "10.7 Team Management", page: "97", type: "sub" },
  {
    chapter: "",
    title: "10.8 Schedule Configuration",
    page: "97",
    type: "sub",
  },
  { chapter: "", title: "10.9 Version History", page: "97", type: "sub" },
  {
    chapter: "",
    title: "10.10 Webhook Documentation",
    page: "98",
    type: "sub",
  },
  { chapter: "", title: "10.11 Summary", page: "98", type: "sub" },

  // Chapter 11
  {
    chapter: "11",
    title: "CONCLUSIONS & FUTURE SCOPE",
    page: "99",
    type: "main",
  },
  { chapter: "", title: "11.1 Project Summary", page: "99", type: "sub" },
  { chapter: "", title: "11.2 Key Achievements", page: "99", type: "sub" },
  {
    chapter: "",
    title: "11.3 Technical Accomplishments",
    page: "100",
    type: "sub",
  },
  { chapter: "", title: "11.4 Limitations", page: "100", type: "sub" },
  { chapter: "", title: "11.5 Lessons Learned", page: "100", type: "sub" },
  { chapter: "", title: "11.6 Future Scope", page: "101", type: "sub" },
  { chapter: "", title: "11.7 Conclusion", page: "101", type: "sub" },

  // Back Matter
  { chapter: "", title: "REFERENCES", page: "103", type: "main", noNum: true },
  { chapter: "", title: "ANNEXURES", page: "105", type: "main", noNum: true },
];

const ITEMS_PER_PAGE_1 = 21; // Front matter + first chapters
const ITEMS_PER_PAGE_2 = 24;
const ITEMS_PER_PAGE_3 = 24;
const ITEMS_PER_PAGE_4 = 24;
const ITEMS_PER_PAGE_5 = 18;

const page1Items = tocItems.slice(0, ITEMS_PER_PAGE_1);
const page2Items = tocItems.slice(
  ITEMS_PER_PAGE_1,
  ITEMS_PER_PAGE_1 + ITEMS_PER_PAGE_2,
);
const page3Items = tocItems.slice(
  ITEMS_PER_PAGE_1 + ITEMS_PER_PAGE_2,
  ITEMS_PER_PAGE_1 + ITEMS_PER_PAGE_2 + ITEMS_PER_PAGE_3,
);
const page4Items = tocItems.slice(
  ITEMS_PER_PAGE_1 + ITEMS_PER_PAGE_2 + ITEMS_PER_PAGE_3,
  ITEMS_PER_PAGE_1 + ITEMS_PER_PAGE_2 + ITEMS_PER_PAGE_3 + ITEMS_PER_PAGE_4,
);
const page5Items = tocItems.slice(
  ITEMS_PER_PAGE_1 + ITEMS_PER_PAGE_2 + ITEMS_PER_PAGE_3 + ITEMS_PER_PAGE_4,
);

export default function TableOfContents({ startPage }: TableOfContentsProps) {
  const renderTocItem = (item: (typeof tocItems)[0], index: number) => {
    const isMain = item.type === "main";
    const isIntro = item.type === "intro";

    // Add extra spacing before the first main chapter if it follows intro items
    const isFirstChapter = item.title === "INTRODUCTION";

    return (
      <View
        key={index}
        style={{
          flexDirection: "row",
          alignItems: "flex-end", // Align text to bottom of row for cleaner look
          marginBottom: isMain || isIntro ? 12 : 6,
          marginTop: isMain && !isFirstChapter ? 8 : isFirstChapter ? 24 : 0, // Add extra space before Chapter 1
          borderTopWidth: isFirstChapter ? 1 : 0, // Separator line before Chapter 1
          borderTopColor: "#eeeeee",
          paddingTop: isFirstChapter ? 16 : 0,
        }}
      >
        {/* Chapter Number Column */}
        <View style={{ width: 40 }}>
          {item.chapter && (
            <Text
              style={{
                fontFamily: "Times-Bold",
                fontSize: 12,
                color: "#888888", // Subtle grey for numbers
              }}
            >
              {item.chapter}
            </Text>
          )}
        </View>

        {/* Title Column */}
        <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-end" }}>
          <Text
            style={{
              fontFamily: isMain || isIntro ? "Times-Bold" : "Times-Roman",
              fontSize: isMain || isIntro ? 11 : 10,
              color: isMain || isIntro ? "#000000" : "#444444",
              letterSpacing: isMain ? 1 : 0,
              textTransform: isMain ? "uppercase" : "none",
            }}
          >
            {item.title}
          </Text>

          {/* Dot Leader - aesthetic visual connector */}
          <View
            style={{
              flex: 1,
              borderBottomWidth: 1,
              borderBottomColor: isMain || isIntro ? "#eeeeee" : "#f0f0f0",
              borderBottomStyle: "dotted",
              marginBottom: 2,
              marginLeft: 8,
              marginRight: 8,
            }}
          />
        </View>

        {/* Page Number */}
        <Text
          style={{
            fontFamily: isMain || isIntro ? "Times-Bold" : "Times-Roman",
            fontSize: isMain || isIntro ? 11 : 10,
            color: isMain || isIntro ? "#000000" : "#444444",
            width: 30, // Slightly wider for roman numerals
            textAlign: "right",
          }}
        >
          {item.page}
        </Text>
      </View>
    );
  };

  const renderHeader = (isContd: boolean) => (
    <View style={{ marginBottom: 40, marginTop: 0 }}>
      <Text
        style={{
          fontSize: 10,
          fontFamily: "Times-Roman",
          color: "#888888",
          letterSpacing: 4,
          textTransform: "uppercase",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        Contents
      </Text>
      <Text
        style={{
          fontSize: 24,
          fontFamily: "Times-Bold",
          textAlign: "center",
          letterSpacing: 1.5,
          textTransform: "uppercase",
        }}
      >
        {isContd ? "Continued..." : "Table of Contents"}
      </Text>
      <View
        style={{
          width: 40,
          height: 1,
          backgroundColor: "#000000",
          alignSelf: "center",
          marginTop: 16,
        }}
      />
    </View>
  );

  return (
    <>
      <Page
        size="A4"
        style={{
          paddingTop: 50, // Smaller top - no header on prelim pages
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
        {renderHeader(false)}
        <View>{page1Items.map(renderTocItem)}</View>
        <View
          style={{
            position: "absolute",
            bottom: 20,
            left: 0,
            right: 0,
            textAlign: "center",
          }}
          fixed
        >
          <Text
            style={{
              fontSize: 10,
              fontFamily: "Times-Roman",
              color: "#444444",
            }}
          >
            {toRoman(startPage)}
          </Text>
        </View>
      </Page>

      <Page
        size="A4"
        style={{
          paddingTop: 50, // Smaller top - no header on prelim pages
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
        {renderHeader(true)}
        <View>{page2Items.map(renderTocItem)}</View>
        <View
          style={{
            position: "absolute",
            bottom: FOOTER_BOTTOM,
            left: 0,
            right: 0,
            textAlign: "center",
          }}
          fixed
        >
          <Text
            style={{
              fontSize: 10,
              fontFamily: "Times-Roman",
              color: "#444444",
            }}
          >
            {toRoman(startPage + 1)}
          </Text>
        </View>
      </Page>

      {page3Items.length > 0 && (
        <Page
          size="A4"
          style={{
            paddingTop: 50,
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
          {renderHeader(true)}
          <View>{page3Items.map(renderTocItem)}</View>
          <View
            style={{
              position: "absolute",
              bottom: FOOTER_BOTTOM,
              left: 0,
              right: 0,
              textAlign: "center",
            }}
            fixed
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Times-Roman",
                color: "#444444",
              }}
            >
              {toRoman(startPage + 2)}
            </Text>
          </View>
        </Page>
      )}

      {page4Items.length > 0 && (
        <Page
          size="A4"
          style={{
            paddingTop: 50,
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
          {renderHeader(true)}
          <View>{page4Items.map(renderTocItem)}</View>
          <View
            style={{
              position: "absolute",
              bottom: FOOTER_BOTTOM,
              left: 0,
              right: 0,
              textAlign: "center",
            }}
            fixed
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Times-Roman",
                color: "#444444",
              }}
            >
              {toRoman(startPage + 3)}
            </Text>
          </View>
        </Page>
      )}

      {page5Items.length > 0 && (
        <Page
          size="A4"
          style={{
            paddingTop: 50,
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
          {renderHeader(true)}
          <View>{page5Items.map(renderTocItem)}</View>
          <View
            style={{
              position: "absolute",
              bottom: FOOTER_BOTTOM,
              left: 0,
              right: 0,
              textAlign: "center",
            }}
            fixed
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Times-Roman",
                color: "#444444",
              }}
            >
              {toRoman(startPage + 4)}
            </Text>
          </View>
        </Page>
      )}
    </>
  );
}
