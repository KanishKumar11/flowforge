"use client";

import { Page, View, Text } from "@react-pdf/renderer";
import { toRoman, PAGE_MARGINS } from "../styles";

interface ListOfFiguresProps {
  startPage: number;
}

const figures = [
  { number: "1.1", title: "System Architecture Overview", page: "3" },
  {
    number: "1.2",
    title: "Technology Stack \u2014 Layered Architecture",
    page: "5",
  },
  { number: "1.3", title: "Project Module Structure", page: "6" },
  {
    number: "2.1",
    title: "Problem Analysis \u2014 Challenges & Solutions",
    page: "11",
  },
  {
    number: "2.2",
    title: "Workflow Automation Market Growth (2022-2030)",
    page: "14",
  },
  {
    number: "2.3",
    title: "Feature Comparison Radar — Flowgent vs n8n",
    page: "20",
  },
  { number: "3.1", title: "Project Objectives Hierarchy", page: "25" },
  {
    number: "4.1",
    title: "Technical Feasibility Radar Assessment",
    page: "32",
  },
  { number: "4.2", title: "Project Cost Breakdown", page: "35" },
  { number: "4.3", title: "12-Week Project Schedule Timeline", page: "38" },
  { number: "4.4", title: "SWOT Analysis Matrix", page: "40" },
  { number: "4.5", title: "Feasibility Assessment Scorecard", page: "41" },
  { number: "5.1", title: "LOC Distribution by Module", page: "43" },
  { number: "5.2", title: "Risk Assessment Matrix", page: "47" },
  { number: "5.3", title: "Project Timeline — Gantt Chart", page: "48" },
  {
    number: "5.4",
    title: "COCOMO Estimated vs Actual — Comparison",
    page: "49",
  },
  { number: "6.1", title: "SDLC Phases Flow Diagram", page: "52" },
  {
    number: "6.2",
    title: "Requirements Survey — Demographics & Tool Satisfaction",
    page: "54",
  },
  { number: "6.3", title: "SDLC Phase — Effort Distribution", page: "58" },
  { number: "6.4", title: "Agile Sprint Cycle", page: "60" },
  { number: "6.5", title: "User Requirements Questionnaire", page: "64" },
  { number: "7.1", title: "Context Diagram (Level 0 DFD)", page: "85" },
  { number: "7.2", title: "Level 1 Data Flow Diagram", page: "86" },
  {
    number: "7.3",
    title: "Level 2 DFD — Workflow Execution Engine",
    page: "87",
  },
  { number: "7.4", title: "Use Case Diagram", page: "88" },
  { number: "7.5", title: "Entity-Relationship Diagram", page: "90" },
  { number: "7.6", title: "Component Hierarchy Diagram", page: "93" },
  { number: "7.7", title: "Workflow Execution Sequence Diagram", page: "106" },
  {
    number: "7.8",
    title: "Workflow Execution Activity Diagram",
    page: "107",
  },
  {
    number: "8.1",
    title: "BFS Workflow Execution Algorithm — Flowchart",
    page: "115",
  },
  { number: "8.2", title: "Node Execution State Machine", page: "116" },
  { number: "8.3", title: "AI Node Execution Pipeline", page: "116" },
  { number: "8.4", title: "Service Integration Matrix", page: "119" },
  { number: "8.5", title: "Deployment Architecture", page: "121" },
  { number: "9.1", title: "Testing Pyramid", page: "128" },
  {
    number: "9.2",
    title: "Performance Metrics — Target vs Actual",
    page: "133",
  },
  {
    number: "9.4",
    title: "Test Results Summary — 142 Tests, 100% Pass Rate",
    page: "135",
  },
  {
    number: "10.1",
    title: "User Journey Through Flowgent Platform",
    page: "136",
  },
  {
    number: "12.1",
    title: "Flowgent Development Roadmap — Short-Term & Long-Term",
    page: "151",
  },
];

const PAGE_1_COUNT = 22;

/**
 * List of Figures - Split across 2 pages for readability
 */
export default function ListOfFigures({ startPage }: ListOfFiguresProps) {
  const page1Figures = figures.slice(0, PAGE_1_COUNT);
  const page2Figures = figures.slice(PAGE_1_COUNT);

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

  const renderHeader = (isContd: boolean = false) => (
    <View style={{ marginBottom: 36, marginTop: 0 }}>
      <Text
        style={{
          fontSize: 10,
          fontFamily: "Times-Roman",
          color: "#888888",
          letterSpacing: 4,
          textTransform: "uppercase" as const,
          marginBottom: 8,
          textAlign: "center" as const,
        }}
      >
        Figures
      </Text>
      <Text
        style={{
          fontSize: 24,
          fontFamily: "Times-Bold",
          textAlign: "center" as const,
          letterSpacing: 1.5,
          textTransform: "uppercase" as const,
        }}
      >
        {isContd ? "List of Figures (continued)" : "List of Figures"}
      </Text>
      <View
        style={{
          width: 40,
          height: 1,
          backgroundColor: "#000000",
          alignSelf: "center" as const,
          marginTop: 16,
        }}
      />
    </View>
  );

  const renderFigureEntry = (
    fig: { number: string; title: string; page: string },
    index: number,
  ) => (
    <View
      key={index}
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 10,
      }}
    >
      {/* Figure Number */}
      <View style={{ width: 40 }}>
        <Text
          style={{
            fontFamily: "Times-Bold",
            fontSize: 12,
            color: "#888888",
          }}
        >
          {fig.number}
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
          {fig.title}
        </Text>

        <View
          style={{
            flex: 1,
            borderBottomWidth: 1,
            borderBottomColor: "#f0f0f0",
            borderBottomStyle: "dotted" as const,
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
          textAlign: "right" as const,
        }}
      >
        {fig.page}
      </Text>
    </View>
  );

  const renderFooter = (pageNum: number) => (
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
        {toRoman(pageNum)}
      </Text>
    </View>
  );

  return (
    <>
      {/* Page 1 */}
      <Page size="A4" style={pageStyle}>
        {renderHeader()}
        <View>{page1Figures.map(renderFigureEntry)}</View>
        {renderFooter(startPage)}
      </Page>

      {/* Page 2 */}
      <Page size="A4" style={pageStyle}>
        {renderHeader(true)}
        <View style={{ marginTop: 10 }}>
          {page2Figures.map((fig, i) =>
            renderFigureEntry(fig, i + PAGE_1_COUNT),
          )}
        </View>
        {renderFooter(startPage + 1)}
      </Page>
    </>
  );
}
