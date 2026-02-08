"use client";

import { Page, View, Text } from "@react-pdf/renderer";
import { toRoman, PAGE_MARGINS, FOOTER_BOTTOM } from "../styles";

interface AcronymsProps {
  startPage: number;
}

const acronyms = [
  { abbr: "AI", full: "Artificial Intelligence" },
  { abbr: "API", full: "Application Programming Interface" },
  { abbr: "BCA", full: "Bachelor of Computer Applications" },
  { abbr: "CI/CD", full: "Continuous Integration / Continuous Deployment" },
  { abbr: "COCOMO", full: "Constructive Cost Model" },
  { abbr: "CRUD", full: "Create, Read, Update, Delete" },
  { abbr: "CSS", full: "Cascading Style Sheets" },
  { abbr: "DB", full: "Database" },
  { abbr: "DFD", full: "Data Flow Diagram" },
  { abbr: "ER", full: "Entity Relationship" },
  { abbr: "HTML", full: "HyperText Markup Language" },
  { abbr: "HTTP", full: "HyperText Transfer Protocol" },
  { abbr: "JSON", full: "JavaScript Object Notation" },
  { abbr: "JWT", full: "JSON Web Token" },
  { abbr: "LLM", full: "Large Language Model" },
  { abbr: "OAuth", full: "Open Authorization" },
  { abbr: "ORM", full: "Object-Relational Mapping" },
  { abbr: "PDF", full: "Portable Document Format" },
  { abbr: "RBAC", full: "Role-Based Access Control" },
  { abbr: "REST", full: "Representational State Transfer" },
  { abbr: "RPC", full: "Remote Procedure Call" },
  { abbr: "SDLC", full: "Software Development Life Cycle" },
  { abbr: "SQL", full: "Structured Query Language" },
  { abbr: "SRS", full: "Software Requirement Specification" },
  { abbr: "SSR", full: "Server-Side Rendering" },
  { abbr: "tRPC", full: "TypeScript Remote Procedure Call" },
  { abbr: "UI", full: "User Interface" },
  { abbr: "URL", full: "Uniform Resource Locator" },
  { abbr: "UX", full: "User Experience" },
];

const pageStyle = {
  paddingTop: 50, // Smaller top - no header on prelim pages
  paddingBottom: PAGE_MARGINS.bottom,
  paddingLeft: PAGE_MARGINS.left,
  paddingRight: PAGE_MARGINS.right,
  fontFamily: "Times-Roman" as const,
  fontSize: 12,
  lineHeight: 1.5,
  color: "#000000",
  backgroundColor: "#ffffff",
};

/**
 * List of Acronyms - Editorial Design (Multi-page) with consistent margins
 */
export default function Acronyms({ startPage }: AcronymsProps) {
  const itemsPerPage = 20;
  const pages = [];

  for (let i = 0; i < acronyms.length; i += itemsPerPage) {
    pages.push(acronyms.slice(i, i + itemsPerPage));
  }

  const renderHeader = (isContd: boolean) => (
    <View style={{ marginBottom: 36, marginTop: 0 }}>
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
        Abbreviations
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
        {isContd ? "Acronyms (Contd.)" : "List of Acronyms"}
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

  const renderItem = (item: (typeof acronyms)[0], index: number) => (
    <View
      key={index}
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 10,
      }}
    >
      {/* Abbreviation */}
      <View style={{ width: 80 }}>
        <Text
          style={{
            fontFamily: "Times-Bold",
            fontSize: 12,
            color: "#000000",
          }}
        >
          {item.abbr}
        </Text>
      </View>

      {/* Full Form */}
      <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-end" }}>
        <Text
          style={{
            fontFamily: "Times-Roman",
            fontSize: 11,
            color: "#444444",
          }}
        >
          {item.full}
        </Text>
      </View>
    </View>
  );

  return (
    <>
      {pages.map((pageItems, pageIndex) => (
        <Page key={pageIndex} size="A4" style={pageStyle}>
          {renderHeader(pageIndex > 0)}
          <View>{pageItems.map(renderItem)}</View>
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
              {toRoman(startPage + pageIndex)}
            </Text>
          </View>
        </Page>
      ))}
    </>
  );
}
