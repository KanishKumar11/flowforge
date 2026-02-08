"use client";

import { Page, View, Text } from "@react-pdf/renderer";
import { toRoman, PAGE_MARGINS, FOOTER_BOTTOM } from "../styles";

interface ListOfFiguresProps {
  pageNumber: number;
}

const figures = [
  { number: "1.1", title: "System Architecture Overview", page: "3" },
  { number: "1.2", title: "Project Module Structure", page: "5" },
  {
    number: "2.1",
    title: "Workflow Automation Market Growth (2022-2030)",
    page: "10",
  },
  { number: "4.1", title: "SWOT Analysis Matrix", page: "31" },
  { number: "5.1", title: "SDLC Phases Flow Diagram", page: "35" },
  { number: "5.2", title: "Agile Sprint Cycle", page: "41" },
  { number: "5.3", title: "User Requirements Questionnaire", page: "48" },
  { number: "6.1", title: "Context Diagram (Level 0 DFD)", page: "67" },
  { number: "6.2", title: "Level 1 Data Flow Diagram", page: "68" },
  {
    number: "6.3",
    title: "Level 2 DFD - Workflow Execution Engine",
    page: "69",
  },
  { number: "6.4", title: "Use Case Diagram", page: "70" },
  { number: "6.5", title: "Entity-Relationship Diagram", page: "71" },
  { number: "6.6", title: "Component Hierarchy Diagram", page: "72" },
  { number: "6.7", title: "Workflow Execution Sequence Diagram", page: "73" },
  { number: "7.1", title: "Risk Assessment Matrix", page: "75" },
  { number: "7.2", title: "Project Timeline - Gantt Chart", page: "76" },
  { number: "8.1", title: "Deployment Architecture", page: "86" },
  { number: "9.1", title: "Testing Pyramid", page: "89" },
];

/**
 * List of Figures - Editorial Design with consistent margins
 */
export default function ListOfFigures({ pageNumber }: ListOfFiguresProps) {
  const renderHeader = () => (
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
        Figures
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
        List of Figures
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
      {renderHeader()}

      <View>
        {figures.map((fig, index) => (
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
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "flex-end" }}
            >
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
              {fig.page}
            </Text>
          </View>
        ))}
      </View>

      {/* Footer */}
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
          {toRoman(pageNumber)}
        </Text>
      </View>
    </Page>
  );
}
