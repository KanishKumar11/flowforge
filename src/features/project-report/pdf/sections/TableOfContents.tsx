"use client";

import { Page, View, Text } from "@react-pdf/renderer";
import { styles, toRoman, PAGE_MARGINS, FOOTER_BOTTOM } from "../styles";

interface TableOfContentsProps {
  startPage: number;
}

const tocItems = [
  // Front Matter (as provided)
  { chapter: "", title: "CERTIFICATE", page: "2", type: "intro" },
  { chapter: "", title: "ACKNOWLEDGEMENT", page: "3", type: "intro" },
  { chapter: "", title: "PREFACE", page: "4", type: "intro" },
  { chapter: "", title: "ABSTRACT", page: "5", type: "intro" },
  { chapter: "", title: "LIST OF FIGURES", page: "12", type: "intro" },
  { chapter: "", title: "LIST OF TABLES", page: "14", type: "intro" },
  { chapter: "", title: "LIST OF ACRONYMS", page: "18", type: "intro" },

  // Chapter 1: INTRODUCTION
  { chapter: "01", title: "INTRODUCTION", page: "1", type: "main" },
  { chapter: "", title: "1.1 Project Overview", page: "1", type: "sub" },
  { chapter: "", title: "1.2 Background", page: "1", type: "sub" },
  { chapter: "", title: "1.3 Problem Statement", page: "2", type: "sub" },
  { chapter: "", title: "1.4 Motivation", page: "3", type: "sub" },
  { chapter: "", title: "1.5 Project Objectives", page: "3", type: "sub" },
  { chapter: "", title: "1.6 Proposed Solution", page: "4", type: "sub" },
  { chapter: "", title: "1.7 Technology Stack", page: "6", type: "sub" },
  { chapter: "", title: "1.8 Technology Justification", page: "7", type: "sub" },
  { chapter: "", title: "1.9 Scope of the Project", page: "9", type: "sub" },
  { chapter: "", title: "1.10 Key Features Summary", page: "10", type: "sub" },
  { chapter: "", title: "1.11 Report Organization", page: "11", type: "sub" },

  // Chapter 2: PROBLEM STATEMENT
  { chapter: "02", title: "PROBLEM STATEMENT", page: "12", type: "main" },
  { chapter: "", title: "2.1 Introduction", page: "12", type: "sub" },
  { chapter: "", title: "2.2 Problem Statement", page: "12", type: "sub" },
  { chapter: "", title: "2.3 Market Demand & Industry Trends", page: "16", type: "sub" },
  { chapter: "", title: "2.4 Analysis of Existing Solutions", page: "17", type: "sub" },
  { chapter: "", title: "2.5 Comparative Analysis", page: "19", type: "sub" },
  { chapter: "", title: "2.6 Gap Analysis", page: "22", type: "sub" },
  { chapter: "", title: "2.7 Proposed Solution Overview", page: "23", type: "sub" },
  { chapter: "", title: "2.8 Justification for New Development", page: "24", type: "sub" },
  { chapter: "", title: "2.9 Summary", page: "25", type: "sub" },

  // Chapter 3: OBJECTIVES
  { chapter: "03", title: "OBJECTIVES", page: "26", type: "main" },
  { chapter: "", title: "3.1 Introduction", page: "26", type: "sub" },
  { chapter: "", title: "3.2 Primary Objectives", page: "27", type: "sub" },
  { chapter: "", title: "3.3 Secondary Objectives", page: "30", type: "sub" },
  { chapter: "", title: "3.4 Technical Objectives", page: "32", type: "sub" },
  { chapter: "", title: "3.5 Expected Outcomes", page: "34", type: "sub" },
  { chapter: "", title: "3.6 Summary", page: "34", type: "sub" },

  // Chapter 4: FEASIBILITY / SDLC
  { chapter: "04", title: "FEASIBILITY STUDY", page: "36", type: "main" },
  { chapter: "", title: "4.1 Introduction", page: "36", type: "sub" },
  { chapter: "", title: "4.2 Technical Feasibility", page: "36", type: "sub" },
  { chapter: "", title: "4.3 Economic Feasibility", page: "38", type: "sub" },
  { chapter: "", title: "4.4 Operational Feasibility", page: "41", type: "sub" },
  { chapter: "", title: "4.5 Schedule Feasibility", page: "42", type: "sub" },
  { chapter: "", title: "4.6 Legal Feasibility", page: "43", type: "sub" },
  { chapter: "", title: "4.7 SWOT Analysis", page: "44", type: "sub" },
  { chapter: "", title: "4.8 Feasibility Summary", page: "45", type: "sub" },
  { chapter: "", title: "4.9 Conclusion", page: "45", type: "sub" },

  // Chapter 5: ESTIMATION & PLANNING (COCOMO)
  { chapter: "05", title: "PROJECT ESTIMATION & PLANNING", page: "47", type: "main" },
  { chapter: "", title: "5.1 Introduction to COCOMO", page: "47", type: "sub" },
  { chapter: "", title: "5.2 Lines of Code Estimation", page: "47", type: "sub" },
  { chapter: "", title: "5.3 Basic COCOMO Model", page: "48", type: "sub" },
  { chapter: "", title: "5.4 Intermediate COCOMO Model", page: "49", type: "sub" },
  { chapter: "", title: "5.5 Risk Analysis", page: "51", type: "sub" },
  { chapter: "", title: "5.6 Actual vs Estimated Comparison", page: "52", type: "sub" },
  { chapter: "", title: "5.7 Summary", page: "53", type: "sub" },

  // Chapter 6: SDLC
  { chapter: "06", title: "SOFTWARE DEVELOPMENT LIFE CYCLE", page: "55", type: "main" },
  { chapter: "", title: "6.1 Introduction to SDLC", page: "55", type: "sub" },
  { chapter: "", title: "6.2 Process Model", page: "64", type: "sub" },
  { chapter: "", title: "6.3 Requirement Gathering", page: "72", type: "sub" },
  { chapter: "", title: "6.4 Software Requirement Specification", page: "81", type: "sub" },

  // Chapter 7: SYSTEM DESIGN
  { chapter: "07", title: "SYSTEM DESIGN", page: "93", type: "main" },
  { chapter: "", title: "7.1 Introduction", page: "93", type: "sub" },
  { chapter: "", title: "7.2 Data Flow Diagrams", page: "93", type: "sub" },
  { chapter: "", title: "7.3 Use Case Diagrams", page: "96", type: "sub" },
  { chapter: "", title: "7.4 Entity-Relationship Diagram", page: "98", type: "sub" },
  { chapter: "", title: "7.5 System Architecture", page: "100", type: "sub" },
  { chapter: "", title: "7.6 Database Schema", page: "102", type: "sub" },
  { chapter: "", title: "7.7 Design Patterns", page: "114", type: "sub" },
  { chapter: "", title: "7.8 Security Design", page: "114", type: "sub" },
  { chapter: "", title: "7.9 Interaction Design", page: "114", type: "sub" },
  { chapter: "", title: "7.10 Summary", page: "117", type: "sub" },

  // Chapter 8: IMPLEMENTATION
  { chapter: "08", title: "IMPLEMENTATION", page: "118", type: "main" },
  { chapter: "", title: "8.1 Introduction", page: "118", type: "sub" },
  { chapter: "", title: "8.2 Project Structure", page: "118", type: "sub" },
  { chapter: "", title: "8.3 Frontend Implementation", page: "119", type: "sub" },
  { chapter: "", title: "8.4 Backend Implementation", page: "120", type: "sub" },
  { chapter: "", title: "8.5 Workflow Execution Engine", page: "123", type: "sub" },
  { chapter: "", title: "8.6 Node Types Implementation", page: "127", type: "sub" },
  { chapter: "", title: "8.7 Integration Implementation", page: "128", type: "sub" },
  { chapter: "", title: "8.8 Key Features Implementation", page: "129", type: "sub" },
  { chapter: "", title: "8.9 API Routes", page: "133", type: "sub" },
  { chapter: "", title: "8.10 Deployment", page: "134", type: "sub" },
  { chapter: "", title: "8.11 Summary", page: "135", type: "sub" },

  // Chapter 9: TESTING
  { chapter: "09", title: "TESTING", page: "136", type: "main" },
  { chapter: "", title: "9.1 Software Engineering Principles", page: "136", type: "sub" },
  { chapter: "", title: "9.2 Testing Strategy", page: "137", type: "sub" },
  { chapter: "", title: "9.3 Unit Testing", page: "138", type: "sub" },
  { chapter: "", title: "9.4 Integration Testing", page: "139", type: "sub" },
  { chapter: "", title: "9.5 System Testing", page: "140", type: "sub" },
  { chapter: "", title: "9.6 UI/UX Testing", page: "140", type: "sub" },
  { chapter: "", title: "9.7 Security Testing", page: "141", type: "sub" },
  { chapter: "", title: "9.8 Performance Testing", page: "141", type: "sub" },
  { chapter: "", title: "9.9 Defect Tracking", page: "143", type: "sub" },
  { chapter: "", title: "9.10 Test Results Summary", page: "143", type: "sub" },
  { chapter: "", title: "9.11 Testing Conclusion", page: "144", type: "sub" },

  // Chapter 10: USER MANUAL
  { chapter: "10", title: "USER MANUAL", page: "145", type: "main" },
  { chapter: "", title: "10.1 Getting Started", page: "145", type: "sub" },
  { chapter: "", title: "10.2 Dashboard Navigation", page: "146", type: "sub" },
  { chapter: "", title: "10.3 Creating a Workflow", page: "147", type: "sub" },
  { chapter: "", title: "10.4 Node Types & Configuration", page: "147", type: "sub" },
  { chapter: "", title: "10.5 Credential Management", page: "149", type: "sub" },
  { chapter: "", title: "10.6 Executing & Monitoring Workflows", page: "150", type: "sub" },
  { chapter: "", title: "10.7 Scheduling Workflows", page: "150", type: "sub" },
  { chapter: "", title: "10.8 Team Collaboration", page: "151", type: "sub" },
  { chapter: "", title: "10.9 Version History", page: "152", type: "sub" },
  { chapter: "", title: "10.10 Webhook Configuration", page: "152", type: "sub" },
  { chapter: "", title: "10.11 Troubleshooting & FAQ", page: "153", type: "sub" },
  { chapter: "", title: "10.12 Summary", page: "153", type: "sub" },

  // Chapter 11: OUTPUT & SCREENSHOTS
  { chapter: "11", title: "OUTPUT & SCREENSHOTS", page: "154", type: "main" },
  { chapter: "", title: "11.1 Authentication Screens", page: "154", type: "sub" },
  { chapter: "", title: "11.2 Dashboard", page: "155", type: "sub" },
  { chapter: "", title: "11.3 Visual Workflow Editor", page: "156", type: "sub" },
  { chapter: "", title: "11.4 Workflows Management", page: "157", type: "sub" },
  { chapter: "", title: "11.5 Execution History", page: "158", type: "sub" },
  { chapter: "", title: "11.6 Credential Management", page: "159", type: "sub" },
  { chapter: "", title: "11.7 Team Management", page: "159", type: "sub" },
  { chapter: "", title: "11.8 Schedule Configuration", page: "160", type: "sub" },
  { chapter: "", title: "11.9 Version History", page: "160", type: "sub" },
  { chapter: "", title: "11.10 Webhook Documentation", page: "160", type: "sub" },
  { chapter: "", title: "11.11 Summary", page: "161", type: "sub" },

  // Chapter 12: CONCLUSIONS
  { chapter: "12", title: "CONCLUSIONS & FUTURE SCOPE", page: "162", type: "main" },
  { chapter: "", title: "12.1 Project Summary", page: "162", type: "sub" },
  { chapter: "", title: "12.2 Key Achievements", page: "162", type: "sub" },
  { chapter: "", title: "12.3 Technical Accomplishments", page: "163", type: "sub" },
  { chapter: "", title: "12.4 Limitations", page: "163", type: "sub" },
  { chapter: "", title: "12.5 Lessons Learned", page: "163", type: "sub" },
  { chapter: "", title: "12.6 Future Scope", page: "164", type: "sub" },
  { chapter: "", title: "12.7 Conclusion", page: "166", type: "sub" },

  // Back Matter
  { chapter: "", title: "REFERENCES", page: "167", type: "main", noNum: true },
  { chapter: "", title: "ANNEXURES", page: "169", type: "main", noNum: true },
  { chapter: "", title: "Annexure A: Complete Database Schema", page: "169", type: "sub", noNum: true },
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
