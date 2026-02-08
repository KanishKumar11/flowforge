"use client";

import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import BookPageLayout from "../components/BookPageLayout";
import SDLCDiagram from "../diagrams/SDLCDiagram";

/**
 * Chapter 5: Software Development Life Cycle Overview (4 pages)
 */
export default function SDLCOverview() {
  return (
    <BookPageLayout chapterTitle="SDLC" chapterNum="06">
      {/* Chapter Title */}
      <View style={{ alignItems: "center", marginBottom: 32 }}>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Times-Roman",
            color: "#666666",
            letterSpacing: 3,
            marginBottom: 8,
          }}
        >
          CHAPTER 5
        </Text>
        <Text
          style={{
            fontSize: 26,
            fontFamily: "Times-Bold",
            textAlign: "center",
            marginBottom: 16,
            textTransform: "uppercase",
            lineHeight: 1.5,
            letterSpacing: 1,
          }}
        >
          SOFTWARE DEVELOPMENT{"\n"}LIFE CYCLE
        </Text>
        <View style={{ width: 60, height: 3, backgroundColor: "#000000" }} />
      </View>

      {/* 6.1 Introduction */}
      <Text style={styles.h2}>6.1 Introduction to SDLC</Text>
      <Text style={styles.paragraphIndent}>
        The Software Development Life Cycle (SDLC) is a comprehensive framework
        that defines the processes and activities involved in developing
        high-quality software systems. It provides a structured approach to
        planning, creating, testing, and deploying software applications,
        ensuring that the final product meets specified requirements and quality
        standards.
      </Text>
      <Text style={styles.paragraphIndent}>
        For the Flowgent platform, adherence to a well-defined SDLC was
        essential given the complexity of the system and the need for reliable,
        production-grade software. This chapter provides an overview of the SDLC
        phases implemented in this project, followed by detailed coverage of
        each phase in subsequent sections.
      </Text>
      <Text style={styles.paragraphIndent}>
        The SDLC methodology chosen for this project balances thorough planning
        and documentation with the flexibility to adapt to evolving
        requirements. This approach recognizes that software development is
        inherently iterative and that early feedback is valuable for producing
        software that truly meets user needs.
      </Text>

      {/* 6.1.1 Importance of SDLC */}
      <Text style={styles.h3}>6.1.1 Importance of SDLC</Text>
      <Text style={styles.paragraphIndent}>
        Following a structured SDLC methodology provides numerous benefits that
        contribute to project success. These benefits are particularly relevant
        for complex systems like Flowgent that involve multiple technologies,
        integration points, and user-facing features.
      </Text>

      <Text style={styles.h3}>6.1.1.1 Quality Assurance</Text>
      <Text style={styles.paragraphIndent}>
        A structured SDLC incorporates quality checkpoints at each phase,
        ensuring that defects are identified and addressed early when they are
        less expensive to fix. Testing is not relegated to the end of
        development but is woven throughout the lifecycle. For Flowgent, this
        meant continuous testing during development, reducing the risk of
        critical bugs in production.
      </Text>

      <Text style={styles.h3}>6.1.1.2 Risk Management</Text>
      <Text style={styles.paragraphIndent}>
        By requiring feasibility analysis and careful planning before
        implementation, the SDLC helps identify and mitigate risks early.
        Technical risks (such as technology selection), schedule risks
        (realistic timeline estimation), and resource risks (skill requirements)
        are all addressed systematically rather than discovered during
        implementation.
      </Text>

      <Text style={styles.h3}>6.1.1.3 Resource Optimization</Text>
      <Text style={styles.paragraphIndent}>
        Clear phase definitions and deliverables enable efficient allocation of
        time and effort. Rather than pursuing multiple directions
        simultaneously, the team can focus on phase-appropriate activities.
        Requirements gathering precedes design, which precedes
        implementation—each phase building on the outputs of the previous phase.
      </Text>

      <Text style={styles.h3}>
        6.1.1.4 Documentation and Knowledge Transfer
      </Text>
      <Text style={styles.paragraphIndent}>
        SDLC phases produce documentation artifacts that capture decisions,
        designs, and implementation details. This documentation serves multiple
        purposes: guiding development, enabling review and feedback, supporting
        maintenance, and facilitating knowledge transfer to future maintainers.
      </Text>

      {/* 6.1.2 SDLC Phases Overview */}
      <Text style={styles.h3}>6.1.2 SDLC Phases Overview</Text>
      <Text style={styles.paragraphIndent}>
        The development of Flowgent followed a six-phase SDLC model, each phase
        producing specific deliverables that informed and enabled subsequent
        phases. The following table summarizes these phases, their duration, and
        key outputs.
      </Text>

      <View style={{ marginTop: 16, marginBottom: 8 }}>
        <SDLCDiagram />
        <Text
          style={{
            fontSize: 9,
            fontFamily: "Times-Italic",
            textAlign: "center",
            marginTop: 4,
            marginBottom: 12,
          }}
        >
          Figure 5.1: SDLC Phases Flow Diagram
        </Text>
      </View>

      {/* Phases Overview Table */}
      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#f0f0f0",
            borderBottomWidth: 1,
            borderBottomColor: "#333333",
          }}
        >
          <Text
            style={{
              width: "20%",
              padding: 6,
              fontSize: 10,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Phase
          </Text>
          <Text
            style={{
              width: "35%",
              padding: 6,
              fontSize: 10,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Key Activities
          </Text>
          <Text
            style={{
              width: "45%",
              padding: 6,
              fontSize: 10,
              fontFamily: "Times-Bold",
            }}
          >
            Deliverables
          </Text>
        </View>
        {[
          [
            "Requirements",
            "Stakeholder interviews, questionnaires, use case identification",
            "SRS Document, Use Case Specifications",
          ],
          [
            "Feasibility",
            "Technical assessment, cost-benefit analysis, risk identification",
            "Feasibility Report, Technology Selection",
          ],
          [
            "Design",
            "Architecture design, database modeling, UI/UX design",
            "System Architecture, DFD, ER Diagrams",
          ],
          [
            "Development",
            "Coding, code review, continuous integration",
            "Source Code, API Documentation",
          ],
          [
            "Testing",
            "Unit testing, integration testing, user acceptance testing",
            "Test Reports, Bug Fixes",
          ],
          [
            "Deployment",
            "Environment setup, production deployment, monitoring",
            "Production System, Deployment Guide",
          ],
        ].map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              borderBottomWidth: i < 5 ? 1 : 0,
              borderBottomColor: "#cccccc",
            }}
          >
            <Text
              style={{
                width: "20%",
                padding: 6,
                fontSize: 9,
                fontFamily: "Times-Bold",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[0]}
            </Text>
            <Text
              style={{
                width: "35%",
                padding: 6,
                fontSize: 9,
                lineHeight: 1.4,
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[1]}
            </Text>
            <Text
              style={{ width: "45%", padding: 6, fontSize: 9, lineHeight: 1.4 }}
            >
              {row[2]}
            </Text>
          </View>
        ))}
      </View>
      <Text
        style={{
          fontSize: 9,
          fontFamily: "Times-Italic",
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        Table 5.1: SDLC Phases and Deliverables Overview
      </Text>

      {/* 6.1.3 Phase Descriptions */}
      <Text style={styles.h3}>6.1.3 Phase Descriptions</Text>

      {/* Phase 1: Requirements */}
      <Text style={styles.h3}>
        6.1.3.1 Phase 1: Requirement Gathering and Analysis
      </Text>
      <Text style={styles.paragraphIndent}>
        The requirements phase focused on understanding the problem domain,
        identifying stakeholders, and capturing both functional and
        non-functional requirements for the Flowgent platform. This phase was
        critical for establishing a clear scope and ensuring that subsequent
        phases addressed actual user needs.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Activities Performed:</Text>
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Analysis of existing workflow automation solutions
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Development and distribution of user questionnaires
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Identification of functional requirements (features, integrations)
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Identification of non-functional requirements (performance,
          security)
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Use case development for different user roles
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Requirement prioritization using MoSCoW method
        </Text>
      </View>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Deliverables:</Text> Software Requirements
        Specification (SRS) document, Use Case Specifications, Requirements
        Traceability Matrix
      </Text>
      <Text
        style={{
          fontSize: 10,
          fontFamily: "Times-Italic",
          color: "#666666",
          marginLeft: 24,
          marginBottom: 12,
        }}
      >
        Detailed coverage: Section 6.3 (Requirement Gathering), Section 6.4
        (SRS)
      </Text>

      {/* Phase 2: Feasibility */}
      <Text style={styles.h3}>6.1.3.2 Phase 2: Feasibility Study</Text>
      <Text style={styles.paragraphIndent}>
        The feasibility study evaluated whether the project could be completed
        successfully given the available resources, technologies, and timeline.
        This phase assessed technical, economic, and operational feasibility to
        ensure project viability before committing to full development.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Activities Performed:</Text>
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Technical feasibility assessment of proposed technology stack
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Economic feasibility analysis (development cost, infrastructure
          cost)
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Operational feasibility evaluation (user adoption, maintenance)
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Risk identification and mitigation planning
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Technology selection and evaluation
        </Text>
      </View>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Deliverables:</Text> Feasibility Report,
        Technology Assessment Document, Cost-Benefit Analysis
      </Text>
      <Text
        style={{
          fontSize: 10,
          fontFamily: "Times-Italic",
          color: "#666666",
          marginLeft: 24,
          marginBottom: 12,
        }}
      >
        Detailed coverage: Chapter 4 (Feasibility Study)
      </Text>

      {/* Phase 3: Design */}
      <Text style={styles.h3}>6.1.3.3 Phase 3: System Design</Text>
      <Text style={styles.paragraphIndent}>
        The design phase translated requirements into a detailed technical
        blueprint for the system. This included high-level architecture design,
        database modeling, user interface design, and detailed component
        specifications that would guide implementation.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Activities Performed:</Text>
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • System architecture design (frontend, backend, database, execution
          engine)
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Data Flow Diagram (DFD) creation at multiple levels
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Entity-Relationship (ER) diagram and database schema design
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Use Case diagram development
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Component interface specification
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • UI/UX wireframing and prototyping
        </Text>
      </View>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Deliverables:</Text> System Architecture
        Document, DFD Diagrams, ER Diagrams, Database Schema, UI Wireframes
      </Text>
      <Text
        style={{
          fontSize: 10,
          fontFamily: "Times-Italic",
          color: "#666666",
          marginLeft: 24,
          marginBottom: 12,
        }}
      >
        Detailed coverage: Chapter 6 (System Design)
      </Text>

      {/* Phase 4: Development */}
      <Text style={styles.h3}>6.1.3.4 Phase 4: Development (Coding)</Text>
      <Text style={styles.paragraphIndent}>
        The development phase implemented the designed system following the
        Agile methodology with iterative sprints. This phase produced the actual
        source code, tests, and documentation that comprise the Flowgent
        platform.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Activities Performed:</Text>
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Sprint planning and backlog management
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Frontend development (React components, pages, hooks)
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Backend development (tRPC routers, services, database operations)
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Visual editor implementation (React Flow integration)
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Node executor implementation (Inngest functions)
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Integration development (HTTP, Slack, AI providers)
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Code review and quality assurance
        </Text>
      </View>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Deliverables:</Text> Source Code Repository,
        API Documentation, Component Library, Developer Documentation
      </Text>
      <Text
        style={{
          fontSize: 10,
          fontFamily: "Times-Italic",
          color: "#666666",
          marginLeft: 24,
          marginBottom: 12,
        }}
      >
        Detailed coverage: Section 6.2 (Process Model), Chapter 8
        (Implementation)
      </Text>

      {/* Phase 5: Testing */}
      <Text style={styles.h3}>6.1.3.5 Phase 5: Testing</Text>
      <Text style={styles.paragraphIndent}>
        The testing phase validated that the implemented system met its
        requirements and functioned correctly under various conditions. Testing
        was performed at multiple levels to ensure comprehensive coverage.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Activities Performed:</Text>
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Unit testing of individual functions and components
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Integration testing of subsystem interactions
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • End-to-end testing of complete user workflows
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Performance testing under load
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Security testing for common vulnerabilities
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Bug tracking and resolution
        </Text>
      </View>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Deliverables:</Text> Test Plans, Test Cases,
        Test Reports, Bug Fix Documentation
      </Text>
      <Text
        style={{
          fontSize: 10,
          fontFamily: "Times-Italic",
          color: "#666666",
          marginLeft: 24,
          marginBottom: 12,
        }}
      >
        Detailed coverage: Chapter 9 (Testing)
      </Text>

      {/* Phase 6: Deployment */}
      <Text style={styles.h3}>6.1.3.6 Phase 6: Deployment</Text>
      <Text style={styles.paragraphIndent}>
        The deployment phase prepared the application for production use,
        establishing the necessary infrastructure, configuration, and monitoring
        to ensure reliable operation.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Activities Performed:</Text>
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Production environment configuration on Netlify
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • PostgreSQL database setup on Neon
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Inngest cloud configuration for execution engine
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Environment variable management and secrets
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Domain configuration and SSL certificates
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Monitoring and logging setup
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Deployment pipeline automation
        </Text>
      </View>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Deliverables:</Text> Production Environment,
        Deployment Documentation, Monitoring Dashboard
      </Text>

      {/* 6.1.4 Phase Duration and Timeline */}
      <Text style={styles.h3}>6.1.4 Phase Duration and Timeline</Text>
      <Text style={styles.paragraphIndent}>
        The project was completed over a 12-week period, with time allocated to
        each phase based on its complexity and dependencies. The following table
        shows the approximate duration and timeline for each phase.
      </Text>

      {/* Timeline Table */}
      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          marginTop: 12,
          marginBottom: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#f0f0f0",
            borderBottomWidth: 1,
            borderBottomColor: "#333333",
          }}
        >
          <Text
            style={{
              width: "30%",
              padding: 6,
              fontSize: 10,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Phase
          </Text>
          <Text
            style={{
              width: "20%",
              padding: 6,
              fontSize: 10,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Duration
          </Text>
          <Text
            style={{
              width: "25%",
              padding: 6,
              fontSize: 10,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Weeks
          </Text>
          <Text
            style={{
              width: "25%",
              padding: 6,
              fontSize: 10,
              fontFamily: "Times-Bold",
            }}
          >
            % Effort
          </Text>
        </View>
        {[
          ["Requirements", "1 week", "Jan 6–10", "8%"],
          ["Feasibility", "1 week", "Jan 13–17", "8%"],
          ["Design", "2 weeks", "Jan 20–Feb 1", "17%"],
          ["Development", "6 weeks", "Feb 3–Mar 7", "50%"],
          ["Testing", "1 week", "Mar 8–12", "8%"],
          ["Deployment", "1 week", "Mar 13–15", "9%"],
        ].map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              borderBottomWidth: i < 5 ? 1 : 0,
              borderBottomColor: "#cccccc",
            }}
          >
            <Text
              style={{
                width: "30%",
                padding: 6,
                fontSize: 9,
                fontFamily: "Times-Bold",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[0]}
            </Text>
            <Text
              style={{
                width: "20%",
                padding: 6,
                fontSize: 9,
                textAlign: "center",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[1]}
            </Text>
            <Text
              style={{
                width: "25%",
                padding: 6,
                fontSize: 9,
                textAlign: "center",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[2]}
            </Text>
            <Text
              style={{
                width: "25%",
                padding: 6,
                fontSize: 9,
                textAlign: "center",
              }}
            >
              {row[3]}
            </Text>
          </View>
        ))}
      </View>
      <Text
        style={{
          fontSize: 9,
          fontFamily: "Times-Italic",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Table 5.2: SDLC Phase Duration and Timeline
      </Text>

      {/* 6.1.5 Summary */}
      <Text style={styles.h3}>6.1.5 Summary</Text>
      <Text style={styles.paragraphIndent}>
        This section has provided an overview of the Software Development Life
        Cycle followed in the development of the Flowgent platform. The
        six-phase approach—Requirements, Feasibility, Design, Development,
        Testing, and Deployment—provided a structured framework that ensured
        quality, managed risk, and produced comprehensive documentation. The
        following sections provide detailed coverage of each phase.
      </Text>
    </BookPageLayout>
  );
}
