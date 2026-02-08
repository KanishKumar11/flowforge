"use client";

import { Page, View, Text } from "@react-pdf/renderer";
import { toRoman, PAGE_MARGINS, FOOTER_BOTTOM } from "../styles";

interface ListOfTablesProps {
  startPage: number;
}

const tables = [
  // Chapter 1
  { number: "1.1", title: "Technology Stack", page: "4" },
  { number: "1.2", title: "Key Features Summary", page: "5" },
  { number: "1.3", title: "Report Organization", page: "6" },

  // Chapter 2
  {
    number: "2.1",
    title: "Feature Comparison of Workflow Automation Platforms",
    page: "11",
  },

  // Chapter 3
  {
    number: "3.1",
    title: "Technology Stack Selection and Justification",
    page: "17",
  },

  // Chapter 4 - Feasibility Study
  {
    number: "4.1",
    title: "Technology Stack Feasibility Assessment",
    page: "26",
  },
  { number: "4.2", title: "Technical Risk Analysis", page: "28" },
  { number: "4.3", title: "Infrastructure Cost Analysis", page: "28" },
  { number: "4.4", title: "Feasibility Summary", page: "29" },

  // Chapter 5 - SDLC
  { number: "5.1", title: "SDLC Phases and Deliverables Overview", page: "36" },
  { number: "5.2", title: "SDLC Phase Duration and Timeline", page: "39" },
  { number: "5.3", title: "Sprint Structure and Ceremonies", page: "42" },
  { number: "5.4", title: "Sprint Overview and Deliverables", page: "43" },
  {
    number: "5.5",
    title: "Comparison of Development Methodologies",
    page: "45",
  },
  { number: "5.6", title: "Interview Participants and Use Cases", page: "48" },
  { number: "5.7", title: "Questionnaire Respondent Demographics", page: "50" },
  { number: "5.8", title: "Current Tool Usage and Satisfaction", page: "51" },
  { number: "5.9", title: "Primary Use Cases Identified", page: "52" },
  { number: "5.10", title: "Stakeholder Analysis", page: "53" },
  { number: "5.11", title: "Requirements Traceability Matrix", page: "54" },
  { number: "5.12", title: "Primary Data Entities", page: "58" },
  { number: "5.13", title: "Requirements Summary by Category", page: "62" },
  {
    number: "5.14",
    title: "Requirements Traceability Matrix (SRS)",
    page: "63",
  },

  // Chapter 6 - System Design
  { number: "6.1", title: "Context Diagram Data Flows", page: "67" },
  { number: "6.2", title: "Use Case Specifications", page: "70" },
  { number: "6.3", title: "Entity Relationships", page: "71" },
  { number: "6.4", title: "User Table Schema", page: "72" },
  { number: "6.5", title: "Session Table Schema", page: "72" },
  { number: "6.6", title: "Account Table Schema", page: "73" },
  { number: "6.7", title: "Verification Table Schema", page: "73" },
  { number: "6.8", title: "Workflow Table Schema", page: "74" },
  { number: "6.9", title: "Execution Table Schema", page: "74" },
  { number: "6.10", title: "AuditLog Table Schema", page: "75" },
  { number: "6.11", title: "Credential Table Schema", page: "75" },
  { number: "6.12", title: "Schedule Table Schema", page: "76" },
  { number: "6.13", title: "WebhookEndpoint Table Schema", page: "76" },
  { number: "6.14", title: "Team Table Schema", page: "77" },
  { number: "6.15", title: "Invitation Table Schema", page: "77" },
  { number: "6.16", title: "TeamMember Table Schema", page: "78" },
  { number: "6.17", title: "WorkflowVersion Table Schema", page: "78" },
  { number: "6.18", title: "ExecutionStatus Enumeration", page: "79" },
  { number: "6.19", title: "ExecutionMode Enumeration", page: "79" },
  { number: "6.20", title: "HttpMethod Enumeration", page: "79" },
  { number: "6.21", title: "TeamRole Enumeration", page: "79" },
  { number: "6.22", title: "Entity Relationship Summary", page: "80" },

  // Chapter 7 - Estimation
  { number: "7.1", title: "Lines of Code by Module", page: "80" },
  { number: "7.2", title: "Risk Analysis Matrix", page: "82" },

  // Chapter 8 - Implementation
  { number: "8.1", title: "Project Directory Structure", page: "85" },
  { number: "8.2", title: "tRPC Router Summary", page: "87" },
  { number: "8.3", title: "Complete Node Types Implementation", page: "89" },
  { number: "8.4", title: "Built-in Workflow Templates", page: "92" },
  { number: "8.5", title: "Next.js API Routes", page: "93" },

  // Chapter 9 - Testing
  { number: "9.1", title: "SOLID Principles Implementation", page: "95" },
  { number: "9.2", title: "Design Patterns Used", page: "96" },
  { number: "9.3", title: "Testing Levels and Coverage", page: "96" },
  { number: "9.4", title: "Unit Test Cases", page: "97" },
  { number: "9.5", title: "Integration Test Cases", page: "97" },
  { number: "9.6", title: "System Test Cases", page: "98" },
  { number: "9.7", title: "UI/UX Test Cases", page: "98" },
  { number: "9.8", title: "Security Test Cases", page: "99" },
  { number: "9.9", title: "Performance Test Results", page: "99" },
  { number: "9.10", title: "Defect Tracking Log", page: "100" },
  { number: "9.11", title: "Complete Test Results Summary", page: "100" },

  // Chapter 11 - Conclusions
  { number: "11.1", title: "Project Objectives Achievement", page: "106" },
  { number: "11.2", title: "Current Limitations", page: "107" },

  // Annexures
  { number: "A.1", title: "Complete Prisma Database Schema", page: "110" },
  { number: "B.1", title: "HTTP API Endpoints", page: "111" },
  { number: "C.1", title: "tRPC Router Summary", page: "112" },
  { number: "D.1", title: "Required Environment Variables", page: "113" },
  { number: "E.1", title: "Complete Node Type Reference", page: "114" },
];

// Split items across pages
const ITEMS_PER_PAGE_1 = 18; // First page (with header)
const ITEMS_PER_PAGE_N = 22; // Continuation pages

const page1Items = tables.slice(0, ITEMS_PER_PAGE_1);
const page2Items = tables.slice(
  ITEMS_PER_PAGE_1,
  ITEMS_PER_PAGE_1 + ITEMS_PER_PAGE_N,
);
const page3Items = tables.slice(
  ITEMS_PER_PAGE_1 + ITEMS_PER_PAGE_N,
  ITEMS_PER_PAGE_1 + ITEMS_PER_PAGE_N * 2,
);
const page4Items = tables.slice(ITEMS_PER_PAGE_1 + ITEMS_PER_PAGE_N * 2);

/**
 * List of Tables - Multi-page editorial design with consistent margins
 */
export default function ListOfTables({ startPage }: ListOfTablesProps) {
  const renderHeader = (isContd: boolean) => (
    <View style={{ marginBottom: isContd ? 28 : 36, marginTop: 0 }}>
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
        Tables
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
        {isContd ? "List of Tables (Continued)" : "List of Tables"}
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

  const renderTableItem = (tbl: (typeof tables)[0], index: number) => (
    <View
      key={index}
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 10,
      }}
    >
      {/* Table Number */}
      <View style={{ width: 40 }}>
        <Text
          style={{
            fontFamily: "Times-Bold",
            fontSize: 12,
            color: "#888888",
          }}
        >
          {tbl.number}
        </Text>
      </View>

      {/* Title & Dot Leader */}
      <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-end" }}>
        <Text
          style={{
            fontFamily: "Times-Bold",
            fontSize: 11,
            color: "#444444",
          }}
        >
          {tbl.title}
        </Text>

        <View
          style={{
            flex: 1,
            borderBottomWidth: 1,
            borderBottomColor: "#f0f0f0",
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
          fontFamily: "Times-Roman",
          fontSize: 11,
          color: "#444444",
          width: 20,
          textAlign: "right",
        }}
      >
        {tbl.page}
      </Text>
    </View>
  );

  const renderFooter = (pageOffset: number) => (
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
        style={{ fontSize: 10, fontFamily: "Times-Roman", color: "#444444" }}
      >
        {toRoman(startPage + pageOffset)}
      </Text>
    </View>
  );

  const pageStyle = {
    paddingTop: 50,
    paddingBottom: PAGE_MARGINS.bottom,
    paddingLeft: PAGE_MARGINS.left,
    paddingRight: PAGE_MARGINS.right,
    fontFamily: "Times-Roman" as const,
    fontSize: 12,
    lineHeight: 1.5,
    color: "#000000",
    backgroundColor: "#ffffff",
  };

  return (
    <>
      {/* Page 1 */}
      <Page size="A4" style={pageStyle}>
        {renderHeader(false)}
        <View>{page1Items.map(renderTableItem)}</View>
        {renderFooter(0)}
      </Page>

      {/* Page 2 */}
      {page2Items.length > 0 && (
        <Page size="A4" style={pageStyle}>
          {renderHeader(true)}
          <View>{page2Items.map(renderTableItem)}</View>
          {renderFooter(1)}
        </Page>
      )}

      {/* Page 3 */}
      {page3Items.length > 0 && (
        <Page size="A4" style={pageStyle}>
          {renderHeader(true)}
          <View>{page3Items.map(renderTableItem)}</View>
          {renderFooter(2)}
        </Page>
      )}

      {/* Page 4 */}
      {page4Items.length > 0 && (
        <Page size="A4" style={pageStyle}>
          {renderHeader(true)}
          <View>{page4Items.map(renderTableItem)}</View>
          {renderFooter(3)}
        </Page>
      )}
    </>
  );
}
