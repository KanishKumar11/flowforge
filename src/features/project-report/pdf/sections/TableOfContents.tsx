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
  {
    chapter: "",
    title: "Certificate of Originality",
    page: "vi",
    type: "intro",
  },
  { chapter: "", title: "List of Figures", page: "xiii", type: "intro" },
  { chapter: "", title: "List of Tables", page: "xiv", type: "intro" },
  { chapter: "", title: "List of Acronyms", page: "xviii", type: "intro" },

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
  { chapter: "02", title: "PROBLEM STATEMENT", page: "11", type: "main" },
  { chapter: "", title: "2.1 Introduction", page: "7", type: "sub" },
  { chapter: "", title: "2.2 Problem Statement", page: "11", type: "sub" },
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
  {
    chapter: "",
    title: "2.5.1 Detailed Comparison: Flowgent vs n8n",
    page: "14",
    type: "sub",
  },
  { chapter: "", title: "2.6 Gap Analysis", page: "15", type: "sub" },
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
  { chapter: "03", title: "OBJECTIVES", page: "24", type: "main" },
  { chapter: "", title: "3.1 Introduction", page: "17", type: "sub" },
  { chapter: "", title: "3.2 Primary Objectives", page: "17", type: "sub" },
  { chapter: "", title: "3.3 Secondary Objectives", page: "20", type: "sub" },
  { chapter: "", title: "3.4 Technical Objectives", page: "22", type: "sub" },
  { chapter: "", title: "3.5 Expected Outcomes", page: "23", type: "sub" },
  { chapter: "", title: "3.6 Summary", page: "24", type: "sub" },

  // Chapter 4
  { chapter: "04", title: "FEASIBILITY STUDY", page: "32", type: "main" },
  { chapter: "", title: "4.1 Introduction", page: "32", type: "sub" },
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
    title: "PROJECT ESTIMATION & PLANNING",
    page: "42",
    type: "main",
  },
  { chapter: "", title: "5.1 Introduction to COCOMO", page: "34", type: "sub" },
  {
    chapter: "",
    title: "5.2 Lines of Code Estimation",
    page: "34",
    type: "sub",
  },
  { chapter: "", title: "5.3 Basic COCOMO Model", page: "35", type: "sub" },
  {
    chapter: "",
    title: "5.4 Intermediate COCOMO Model",
    page: "36",
    type: "sub",
  },
  { chapter: "", title: "5.5 Risk Analysis", page: "37", type: "sub" },
  {
    chapter: "",
    title: "5.6 Actual vs Estimated Comparison",
    page: "37",
    type: "sub",
  },
  { chapter: "", title: "5.7 Summary", page: "38", type: "sub" },

  // Chapter 6
  {
    chapter: "06",
    title: "SOFTWARE DEVELOPMENT LIFE CYCLE",
    page: "48",
    type: "main",
  },
  { chapter: "", title: "6.1 Introduction to SDLC", page: "39", type: "sub" },
  { chapter: "", title: "6.2 Importance of SDLC", page: "40", type: "sub" },
  { chapter: "", title: "6.3 SDLC Phases Overview", page: "41", type: "sub" },
  { chapter: "", title: "6.4 Requirement Gathering", page: "46", type: "sub" },
  { chapter: "", title: "6.5 SRS Preparation", page: "55", type: "sub" },
  { chapter: "", title: "6.6 Phase Timeline", page: "65", type: "sub" },
  { chapter: "", title: "6.7 Summary", page: "66", type: "sub" },

  // Chapter 7
  { chapter: "07", title: "SYSTEM DESIGN", page: "84", type: "main" },
  { chapter: "", title: "7.1 Introduction", page: "84", type: "sub" },
  { chapter: "", title: "7.2 Data Flow Diagrams", page: "84", type: "sub" },
  { chapter: "", title: "7.3 Use Case Diagrams", page: "85", type: "sub" },
  {
    chapter: "",
    title: "7.4 Entity-Relationship Diagram",
    page: "86",
    type: "sub",
  },
  { chapter: "", title: "7.5 Architecture Design", page: "87", type: "sub" },
  { chapter: "", title: "7.6 Database Schema", page: "88", type: "sub" },
  { chapter: "", title: "7.7 Security Design", page: "89", type: "sub" },
  { chapter: "", title: "7.8 Summary", page: "90", type: "sub" },

  // Chapter 8
  { chapter: "08", title: "IMPLEMENTATION", page: "108", type: "main" },
  { chapter: "", title: "8.1 Introduction", page: "108", type: "sub" },
  { chapter: "", title: "8.2 Project Structure", page: "108", type: "sub" },
  {
    chapter: "",
    title: "8.3 Frontend Implementation",
    page: "109",
    type: "sub",
  },
  {
    chapter: "",
    title: "8.4 Backend Implementation",
    page: "111",
    type: "sub",
  },
  { chapter: "", title: "8.5 Execution Engine", page: "113", type: "sub" },
  { chapter: "", title: "8.6 Node Implementation", page: "114", type: "sub" },
  { chapter: "", title: "8.7 API Routes", page: "116", type: "sub" },
  { chapter: "", title: "8.8 Deployment", page: "118", type: "sub" },
  { chapter: "", title: "8.9 Summary", page: "119", type: "sub" },
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
    title: "8.7.3 Limitations of AI Nodes",
    page: "84",
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
  { chapter: "09", title: "TESTING", page: "125", type: "main" },
  { chapter: "", title: "9.1 Testing Strategy", page: "125", type: "sub" },
  { chapter: "", title: "9.2 Unit Testing", page: "126", type: "sub" },
  { chapter: "", title: "9.3 Integration Testing", page: "127", type: "sub" },
  { chapter: "", title: "9.4 UI/UX Testing", page: "128", type: "sub" },
  { chapter: "", title: "9.5 Security Testing", page: "129", type: "sub" },
  { chapter: "", title: "9.6 Performance Testing", page: "130", type: "sub" },
  { chapter: "", title: "9.7 Defect Tracking", page: "131", type: "sub" },
  { chapter: "", title: "9.8 Test Results Summary", page: "132", type: "sub" },
  { chapter: "", title: "9.9 Testing Conclusion", page: "132", type: "sub" },
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
  { chapter: "10", title: "USER MANUAL", page: "133", type: "main" },
  { chapter: "", title: "10.1 Getting Started", page: "133", type: "sub" },
  { chapter: "", title: "10.2 Dashboard Navigation", page: "134", type: "sub" },
  { chapter: "", title: "10.3 Workflow Creation", page: "135", type: "sub" },
  { chapter: "", title: "10.4 Credential Setup", page: "136", type: "sub" },
  { chapter: "", title: "10.5 Execution Monitoring", page: "137", type: "sub" },
  { chapter: "", title: "10.6 Scheduling Workflows", page: "138", type: "sub" },
  { chapter: "", title: "10.7 Team Collaboration", page: "139", type: "sub" },
  { chapter: "", title: "10.8 Version History", page: "140", type: "sub" },
  { chapter: "", title: "10.1 Getting Started", page: "95", type: "sub" },
  {
    chapter: "",
    title: "10.2 Dashboard Navigation",
    page: "96",
    type: "sub",
  },
  { chapter: "", title: "10.3 Creating a Workflow", page: "97", type: "sub" },
  {
    chapter: "",
    title: "10.4 Node Types & Configuration",
    page: "97",
    type: "sub",
  },
  {
    chapter: "",
    title: "10.5 Credential Management",
    page: "98",
    type: "sub",
  },
  {
    chapter: "",
    title: "10.6 Executing & Monitoring Workflows",
    page: "99",
    type: "sub",
  },
  {
    chapter: "",
    title: "10.7 Scheduling Workflows",
    page: "99",
    type: "sub",
  },
  { chapter: "", title: "10.8 Team Collaboration", page: "100", type: "sub" },
  { chapter: "", title: "10.9 Version History", page: "100", type: "sub" },
  {
    chapter: "",
    title: "10.10 Webhook Configuration",
    page: "101",
    type: "sub",
  },
  {
    chapter: "",
    title: "10.11 Troubleshooting & FAQ",
    page: "101",
    type: "sub",
  },
  { chapter: "", title: "10.12 Summary", page: "102", type: "sub" },

  // Chapter 11
  { chapter: "11", title: "OUTPUT & SCREENSHOTS", page: "142", type: "main" },
  {
    chapter: "",
    title: "11.1 Authentication Screens",
    page: "142",
    type: "sub",
  },
  { chapter: "", title: "11.2 Dashboard", page: "143", type: "sub" },
  { chapter: "", title: "11.3 Workflow Editor", page: "144", type: "sub" },
  { chapter: "", title: "11.4 Executions", page: "145", type: "sub" },
  {
    chapter: "",
    title: "11.5 Credential Management",
    page: "146",
    type: "sub",
  },
  { chapter: "", title: "11.6 Team Management", page: "147", type: "sub" },
  { chapter: "", title: "11.7 Summary", page: "148", type: "sub" },
  {
    chapter: "",
    title: "11.1 Authentication Screens",
    page: "103",
    type: "sub",
  },
  { chapter: "", title: "11.2 Dashboard", page: "103", type: "sub" },
  {
    chapter: "",
    title: "11.3 Visual Workflow Editor",
    page: "104",
    type: "sub",
  },
  { chapter: "", title: "11.4 Workflows Management", page: "104", type: "sub" },
  { chapter: "", title: "11.5 Execution History", page: "104", type: "sub" },
  {
    chapter: "",
    title: "11.6 Credential Management",
    page: "105",
    type: "sub",
  },
  { chapter: "", title: "11.7 Team Management", page: "105", type: "sub" },
  {
    chapter: "",
    title: "11.8 Schedule Configuration",
    page: "105",
    type: "sub",
  },
  { chapter: "", title: "11.9 Version History", page: "105", type: "sub" },
  {
    chapter: "",
    title: "11.10 Webhook Documentation",
    page: "106",
    type: "sub",
  },
  { chapter: "", title: "11.11 Summary", page: "106", type: "sub" },

  // Chapter 12
  {
    chapter: "12",
    title: "CONCLUSIONS & FUTURE SCOPE",
    page: "150",
    type: "main",
  },
  { chapter: "", title: "12.1 Project Summary", page: "150", type: "sub" },
  { chapter: "", title: "12.2 Key Achievements", page: "151", type: "sub" },
  { chapter: "", title: "12.3 Limitations", page: "152", type: "sub" },
  { chapter: "", title: "12.4 Future Scope", page: "153", type: "sub" },
  { chapter: "", title: "12.5 Conclusion", page: "153", type: "sub" },
  { chapter: "", title: "12.1 Project Summary", page: "107", type: "sub" },
  { chapter: "", title: "12.2 Key Achievements", page: "107", type: "sub" },
  {
    chapter: "",
    title: "12.3 Technical Accomplishments",
    page: "108",
    type: "sub",
  },
  { chapter: "", title: "12.4 Limitations", page: "108", type: "sub" },
  { chapter: "", title: "12.5 Lessons Learned", page: "108", type: "sub" },
  { chapter: "", title: "12.6 Future Scope", page: "109", type: "sub" },
  { chapter: "", title: "12.7 Conclusion", page: "109", type: "sub" },

  // Back Matter
  { chapter: "", title: "REFERENCES", page: "154", type: "main", noNum: true },
  { chapter: "", title: "ANNEXURES", page: "156", type: "main", noNum: true },
];

const ITEMS_PER_PAGE_1 = 21; // Front matter + first chapters
const ITEMS_PER_PAGE_2 = 24;
const ITEMS_PER_PAGE_3 = 24;
const ITEMS_PER_PAGE_4 = 24;
const ITEMS_PER_PAGE_5 = 24;
const ITEMS_PER_PAGE_6 = 24;
const ITEMS_PER_PAGE_7 = 24; // Extra pages to accommodate overflow
const ITEMS_PER_PAGE_8 = 24;

const page1Items = tocItems.slice(0, ITEMS_PER_PAGE_1);
const s2 = ITEMS_PER_PAGE_1;
const page2Items = tocItems.slice(s2, s2 + ITEMS_PER_PAGE_2);
const s3 = s2 + ITEMS_PER_PAGE_2;
const page3Items = tocItems.slice(s3, s3 + ITEMS_PER_PAGE_3);
const s4 = s3 + ITEMS_PER_PAGE_3;
const page4Items = tocItems.slice(s4, s4 + ITEMS_PER_PAGE_4);
const s5 = s4 + ITEMS_PER_PAGE_4;
const page5Items = tocItems.slice(s5, s5 + ITEMS_PER_PAGE_5);
const s6 = s5 + ITEMS_PER_PAGE_5;
const page6Items = tocItems.slice(s6, s6 + ITEMS_PER_PAGE_6);
const s7 = s6 + ITEMS_PER_PAGE_6;
const page7Items = tocItems.slice(s7, s7 + ITEMS_PER_PAGE_7);
const s8 = s7 + ITEMS_PER_PAGE_7;
const page8Items = tocItems.slice(s8, s8 + ITEMS_PER_PAGE_8);
const page9Items = tocItems.slice(s8 + ITEMS_PER_PAGE_8); // Any remaining items

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

      {page6Items.length > 0 && (
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
          <View>{page6Items.map(renderTocItem)}</View>
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
              {toRoman(startPage + 5)}
            </Text>
          </View>
        </Page>
      )}

      {page7Items.length > 0 && (
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
          <View>{page7Items.map(renderTocItem)}</View>
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
              {toRoman(startPage + 6)}
            </Text>
          </View>
        </Page>
      )}

      {page8Items.length > 0 && (
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
          <View>{page8Items.map(renderTocItem)}</View>
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
              {toRoman(startPage + 7)}
            </Text>
          </View>
        </Page>
      )}

      {page9Items.length > 0 && (
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
          <View>{page9Items.map(renderTocItem)}</View>
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
              {toRoman(startPage + 8)}
            </Text>
          </View>
        </Page>
      )}
    </>
  );
}
