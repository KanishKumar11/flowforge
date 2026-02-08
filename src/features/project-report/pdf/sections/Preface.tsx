"use client";

import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import PreliminaryPageLayout from "../components/PreliminaryPageLayout";

interface PrefaceProps {
  pageNumber: number;
}

/**
 * Preface Page
 * Uses PreliminaryPageLayout for consistent margins
 */
export default function Preface({ pageNumber }: PrefaceProps) {
  return (
    <PreliminaryPageLayout pageNumber={pageNumber}>
      {/* Title */}
      <View style={{ alignItems: "center", marginBottom: 28 }}>
        <Text style={styles.h1}>PREFACE</Text>
        <View style={{ width: 80, height: 4, backgroundColor: "#000000" }} />
      </View>

      {/* Content */}
      <View>
        <Text style={styles.paragraphIndent}>
          This project report presents the development of{" "}
          <Text style={styles.bold}>Flowgent 1.0</Text>, a visual workflow
          automation platform designed to simplify complex business process
          automation for users of all technical backgrounds. The project was
          undertaken as part of the academic requirements for the degree of{" "}
          <Text style={styles.bold}>
            Bachelor of Computer Applications (BCA)
          </Text>{" "}
          at Hindu College, Amritsar.
        </Text>

        <Text style={[styles.paragraph, { marginTop: 12 }]}>
          The report is structured to provide a comprehensive understanding of
          the project from conception to completion. It begins with an
          introduction to the problem domain and motivation, followed by a
          detailed analysis of existing solutions and their limitations.
        </Text>

        <Text style={[styles.paragraph, { marginTop: 12 }]}>
          The subsequent chapters cover the complete{" "}
          <Text style={styles.bold}>
            Software Development Life Cycle (SDLC)
          </Text>
          , including requirement gathering through questionnaire methods,
          system design with DFD, Use Case, and ER diagrams, and project
          estimation using the COCOMO model.
        </Text>

        {/* Technologies Box */}
        <View
          style={{
            borderWidth: 1,
            borderColor: "#999999",
            padding: 14,
            marginTop: 14,
            marginBottom: 14,
          }}
        >
          <Text style={{ fontFamily: "Times-Bold", marginBottom: 8 }}>
            Technologies Explored:
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Text style={{ fontSize: 10, width: "50%", marginBottom: 3 }}>
              • Next.js 16 & React 19
            </Text>
            <Text style={{ fontSize: 10, width: "50%", marginBottom: 3 }}>
              • TypeScript & Tailwind CSS
            </Text>
            <Text style={{ fontSize: 10, width: "50%", marginBottom: 3 }}>
              • PostgreSQL & Prisma ORM
            </Text>
            <Text style={{ fontSize: 10, width: "50%", marginBottom: 3 }}>
              • Inngest for Durable Execution
            </Text>
            <Text style={{ fontSize: 10, width: "50%", marginBottom: 3 }}>
              • React Flow for Visual Editor
            </Text>
            <Text style={{ fontSize: 10, width: "50%", marginBottom: 3 }}>
              • tRPC for Type-Safe APIs
            </Text>
            <Text style={{ fontSize: 10, width: "50%", marginBottom: 3 }}>
              • Better Auth for Authentication
            </Text>
            <Text style={{ fontSize: 10, width: "50%", marginBottom: 3 }}>
              • AI SDKs (OpenAI, Anthropic)
            </Text>
          </View>
        </View>

        <Text style={styles.paragraph}>
          The implementation chapter includes carefully selected code snippets
          that demonstrate key concepts, covering the full technology stack from
          frontend React Flow integration to backend tRPC routers and the
          Inngest execution engine. The testing chapter provides comprehensive
          test cases and methodology. The output chapter describes all
          application screens and interfaces. The report concludes with an
          honest assessment of the project&apos;s limitations and a roadmap for
          future enhancements.
        </Text>

        <Text style={[styles.paragraph, { marginTop: 12 }]}>
          Every effort has been made to present the information in a clear,
          well-organized manner while adhering to academic standards. I hope
          this report serves as both documentation of my learning journey and a
          useful reference for anyone interested in building similar full-stack
          applications.
        </Text>

        <View
          style={{
            borderWidth: 1,
            borderColor: "#cccccc",
            padding: 10,
            marginTop: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 10, fontFamily: "Times-Italic" }}>
            Your feedback and suggestions are welcome to help improve this work.
          </Text>
        </View>
      </View>
    </PreliminaryPageLayout>
  );
}
