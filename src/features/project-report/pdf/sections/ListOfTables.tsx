"use client";

import { Page, View, Text } from "@react-pdf/renderer";
import { toRoman, PAGE_MARGINS, FOOTER_BOTTOM } from "../styles";

interface ListOfTablesProps {
  startPage: number;
}

const tables = [
  // Chapter 1
  { number: "1.1", title: "Technology Stack", page: "5" },
  { number: "1.2", title: "Technology Justification", page: "6" },
  { number: "1.3", title: "Key Features Summary", page: "9" },
  { number: "1.4", title: "Report Organization", page: "10" },

  // Chapter 2
  {
    number: "2.1",
    title: "Feature Comparison of Workflow Automation Platforms",
    page: "16",
  },
  {
    number: "2.2",
    title: "Detailed Feature Comparison \u2014 Flowgent vs n8n",
    page: "19",
  },

  // Chapter 3
  {
    number: "3.1",
    title: "Technology Stack Selection and Justification",
    page: "27",
  },

  // Chapter 4 - Feasibility Study
  {
    number: "4.1",
    title: "Technology Stack Feasibility Assessment",
    page: "32",
  },
  { number: "4.2", title: "Technical Risk Analysis", page: "34" },
  { number: "4.3", title: "Infrastructure Cost Analysis", page: "34" },
  { number: "4.4", title: "Feasibility Summary", page: "41" },

  // Chapter 5 - Estimation & Planning
  { number: "5.1", title: "Lines of Code by Module", page: "43" },
  { number: "5.2", title: "Risk Analysis Matrix", page: "47" },

  // Chapter 6 - SDLC
  { number: "6.1", title: "SDLC Phases and Deliverables Overview", page: "52" },
  { number: "6.2", title: "SDLC Phase Duration and Timeline", page: "55" },
  { number: "6.3", title: "Sprint Structure and Ceremonies", page: "60" },
  { number: "6.4", title: "Sprint Overview and Deliverables", page: "60" },
  {
    number: "6.5",
    title: "Comparison of Development Methodologies",
    page: "61",
  },
  { number: "6.6", title: "Interview Participants and Use Cases", page: "64" },
  { number: "6.7", title: "Questionnaire Respondent Demographics", page: "66" },
  { number: "6.8", title: "Current Tool Usage and Satisfaction", page: "67" },
  { number: "6.9", title: "Primary Use Cases Identified", page: "68" },
  { number: "6.10", title: "Stakeholder Analysis", page: "69" },
  { number: "6.11", title: "Requirements Traceability Matrix", page: "70" },
  { number: "6.12", title: "Primary Data Entities", page: "76" },
  { number: "6.13", title: "Requirements Summary by Category", page: "79" },
  {
    number: "6.14",
    title: "Requirements Traceability Matrix (SRS)",
    page: "79",
  },

  // Chapter 7 - System Design
  { number: "7.1", title: "Context Diagram Data Flows", page: "85" },
  { number: "7.2", title: "Use Case Specifications", page: "89" },
  { number: "7.3", title: "Entity Relationships", page: "91" },
  { number: "7.4", title: "User Table Schema", page: "93" },
  { number: "7.5", title: "Session Table Schema", page: "93" },
  { number: "7.6", title: "Account Table Schema", page: "95" },
  { number: "7.7", title: "Verification Table Schema", page: "95" },
  { number: "7.8", title: "Workflow Table Schema", page: "96" },
  { number: "7.9", title: "Execution Table Schema", page: "96" },
  { number: "7.10", title: "AuditLog Table Schema", page: "98" },
  { number: "7.11", title: "Credential Table Schema", page: "98" },
  { number: "7.12", title: "Schedule Table Schema", page: "100" },
  { number: "7.13", title: "WebhookEndpoint Table Schema", page: "100" },
  { number: "7.14", title: "Team Table Schema", page: "102" },
  { number: "7.15", title: "Invitation Table Schema", page: "102" },
  { number: "7.16", title: "TeamMember Table Schema", page: "104" },
  { number: "7.17", title: "WorkflowVersion Table Schema", page: "104" },
  { number: "7.18", title: "ExecutionStatus Enumeration", page: "106" },
  { number: "7.19", title: "ExecutionMode Enumeration", page: "106" },
  { number: "7.20", title: "HttpMethod Enumeration", page: "106" },
  { number: "7.21", title: "TeamRole Enumeration", page: "106" },
  { number: "7.22", title: "Entity Relationship Summary", page: "107" },

  // Chapter 8 - Implementation
  { number: "8.1", title: "Project Directory Structure", page: "108" },
  { number: "8.2", title: "tRPC Router Summary", page: "112" },
  { number: "8.3", title: "Complete Node Types Implementation", page: "116" },
  { number: "8.4", title: "Built-in Workflow Templates", page: "123" },
  { number: "8.5", title: "Next.js API Routes", page: "125" },

  // Chapter 9 - Testing
  { number: "9.1", title: "SOLID Principles Implementation", page: "128" },
  { number: "9.2", title: "Design Patterns Used", page: "129" },
  { number: "9.3", title: "Testing Levels and Coverage", page: "130" },
  { number: "9.4", title: "Unit Test Cases", page: "131" },
  { number: "9.5", title: "Integration Test Cases", page: "131" },
  { number: "9.6", title: "System Test Cases", page: "132" },
  { number: "9.7", title: "UI/UX Test Cases", page: "132" },
  { number: "9.8", title: "Security Test Cases", page: "133" },
  { number: "9.9", title: "Performance Test Results", page: "133" },
  { number: "9.10", title: "Defect Tracking Log", page: "134" },
  { number: "9.11", title: "Complete Test Results Summary", page: "135" },

  // Chapter 10 - User Manual
<<<<<<< HEAD
  { number: "10.1", title: "Flowgent Node Catalog", page: "136" },
  { number: "10.2", title: "Common Cron Schedule Examples", page: "137" },
  { number: "10.3", title: "Team Role Permissions Matrix", page: "137" },
  { number: "10.4", title: "Common Issues & Resolutions", page: "138" },
=======
  { number: "10.1", title: "Flowgent Node Catalog", page: "99" },
  { number: "10.2", title: "Common Cron Schedule Examples", page: "100" },
  { number: "10.3", title: "Team Role Permissions Matrix", page: "100" },
  { number: "10.4", title: "Common Issues & Resolutions", page: "101" },
>>>>>>> 7ee487ff45e6c74e190c28b867faabef13249665

  // Chapter 12 - Conclusions
  { number: "12.1", title: "Project Objectives Achievement", page: "149" },
  { number: "12.2", title: "Current Limitations", page: "151" },

  // Annexures
  { number: "A.1", title: "Complete Prisma Database Schema", page: "156" },
  { number: "B.1", title: "HTTP API Endpoints", page: "158" },
  { number: "C.1", title: "tRPC Router Summary", page: "160" },
  { number: "D.1", title: "Required Environment Variables", page: "162" },
  { number: "E.1", title: "Complete Node Type Reference", page: "164" },
];

// Split items across pages
const ITEMS_PER_PAGE_1 = 22; // First page (with header)
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
