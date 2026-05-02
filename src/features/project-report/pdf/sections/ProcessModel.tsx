"use client";

import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import BookPageLayout from "../components/BookPageLayout";
import AgileSprintDiagram from "../diagrams/AgileSprintDiagram";

/**
 * Section 6.2: Process Model — Agile Methodology
 */
export default function ProcessModel() {
  // Reusable cell helpers
  const headerRow = {
    flexDirection: "row" as const,
    backgroundColor: "#dbeafe", borderTopLeftRadius: 6, borderTopRightRadius: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#93c5fd",
  };
  const headCell = (w: string, last = false) => ({
    width: w,
    padding: 6,
    fontSize: 10,
    fontFamily: "Times-Bold" as const,
    borderRightWidth: last ? 0 : 1,
    borderRightColor: "#bfdbfe",
  });
  const dataRow = (last: boolean) => ({
    flexDirection: "row" as const,
    borderBottomWidth: last ? 0 : 1,
    borderBottomColor: "#cbd5e1",
  });
  const dataCell = (
    w: string,
    opts: { bold?: boolean; center?: boolean; last?: boolean; size?: number } = {},
  ) => ({
    width: w,
    padding: 5,
    fontSize: opts.size ?? 9,
    fontFamily: opts.bold ? ("Times-Bold" as const) : ("Times-Roman" as const),
    textAlign: opts.center ? ("center" as const) : ("left" as const),
    lineHeight: 1.3,
    borderRightWidth: opts.last ? 0 : 1,
    borderRightColor: "#cbd5e1",
  });

  return (
    <BookPageLayout chapterTitle="SDLC" chapterNum="06">
      {/* Section Title */}
      <Text style={styles.h2}>6.2 Process Model</Text>
      <Text style={styles.paragraphIndent}>
        The choice of process model influences project organisation,
        communication, and the ability to respond to change. This section
        describes the Agile methodology adopted for Flowgent, the rationale,
        and how it was implemented in practice.
      </Text>

      {/* 6.2.1 Agile Methodology Overview */}
      <Text style={styles.h3}>6.2.1 Agile Methodology Overview</Text>
      <Text style={styles.paragraphIndent}>
        Agile is a set of principles emphasising iterative development,
        customer collaboration, and responsiveness to change. Unlike sequential
        waterfall approaches, Agile embraces the inherent uncertainty of
        software work and uses it as an opportunity for continuous improvement.
        For Flowgent, a Scrum-influenced Agile model was adopted, organising
        work into time-boxed weekly sprints — providing structure for planning
        while preserving flexibility to adapt.
      </Text>

      {/* 6.2.2 Justification — merged */}
      <Text style={styles.h3}>6.2.2 Justification for Agile Selection</Text>
      <Text style={styles.paragraphIndent}>
        Agile suited Flowgent for several intertwined reasons. The core visual
        editor required extensive iteration to land on an intuitive UX —
        impossible to fully specify upfront. Requirements evolved during
        development (e.g., AI integration grew from one provider to three).
        Integrating multiple complex technologies (Next.js, React Flow,
        Inngest, tRPC, Prisma) introduced significant risk; building working
        software incrementally surfaced and resolved integration issues early.
        Finally, every sprint produced potentially deployable software,
        enabling regular demos, validation, and course correction.
      </Text>

      {/* 6.2.3 Sprint Structure */}
      <Text style={styles.h3}>6.2.3 Sprint Structure</Text>
      <Text style={styles.paragraphIndent}>
        Development was organised into one-week sprints, providing a
        consistent rhythm for planning, execution, and review. Each sprint
        followed a defined ceremony schedule.
      </Text>

      <View style={{ marginTop: 16, marginBottom: 8 }}>
        <AgileSprintDiagram />
        <Text
          style={{
            fontSize: 9,
            fontFamily: "Times-Italic",
            textAlign: "center",
            marginTop: 4,
            marginBottom: 12,
          }}
        >
          Figure 6.4: Agile Sprint Cycle
        </Text>
      </View>

      {/* Sprint Structure Table */}
      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#94a3b8", borderRadius: 6,
          marginTop: 12,
          marginBottom: 8,
        }}
      >
        <View style={headerRow}>
          <Text style={headCell("22%")}>Activity</Text>
          <Text style={headCell("15%")}>Duration</Text>
          <Text style={headCell("20%")}>Timing</Text>
          <Text style={headCell("43%", true)}>Purpose</Text>
        </View>
        {[
          ["Sprint Planning", "2 hours", "Day 1", "Define goals, select backlog, estimate effort"],
          ["Daily Standup", "15 min", "Daily", "Sync progress, identify blockers"],
          ["Development", "~35 hours", "Days 1-5", "Implementation, testing, code review"],
          ["Sprint Review", "1 hour", "Day 5", "Demo features, gather feedback"],
          ["Retrospective", "30 min", "Day 5", "Reflect on process, identify improvements"],
        ].map((row, i, arr) => (
          <View key={i} style={dataRow(i === arr.length - 1)}>
            <Text style={dataCell("22%", { bold: true })}>{row[0]}</Text>
            <Text style={dataCell("15%", { center: true })}>{row[1]}</Text>
            <Text style={dataCell("20%", { center: true })}>{row[2]}</Text>
            <Text style={dataCell("43%", { last: true })}>{row[3]}</Text>
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
        Table 6.3: Sprint Structure and Ceremonies
      </Text>

      {/* 6.2.4 Agile Artifacts — DoD trimmed 6→3 */}
      <Text style={styles.h3}>6.2.4 Agile Artifacts</Text>
      <Text style={styles.paragraphIndent}>
        The <Text style={styles.bold}>Product Backlog</Text> was a prioritised
        list of features expressed as user stories where applicable, refined
        continuously based on feedback. The{" "}
        <Text style={styles.bold}>Sprint Backlog</Text> selected items for each
        sprint, broken down into technical tasks. A{" "}
        <Text style={styles.bold}>Burn-down Chart</Text> tracked remaining work
        versus time. The <Text style={styles.bold}>Definition of Done</Text>{" "}
        ensured a shared quality bar — an item was considered done when:
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Code follows project standards, is reviewed, and merged
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Unit tests are written and passing; manually verified
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Documentation is updated and the feature is deployed to staging
        </Text>
      </View>

      {/* 6.2.5 Sprints Overview */}
      <Text style={styles.h3}>6.2.5 Development Sprints</Text>
      <Text style={styles.paragraphIndent}>
        The project ran across 12 sprints, each focusing on a specific
        functional area. Sprints 1-2 established the foundation (Next.js,
        Prisma schema, Better Auth). Sprints 3-4 built the React Flow editor
        with custom nodes, validation, and persistence. Sprints 5-6 introduced
        the Inngest-backed execution engine with retry logic. Sprints 7-9 added
        HTTP, Slack, Email, and the three AI providers. Sprint 10 delivered
        team RBAC and shared credentials, and Sprints 11-12 wrapped with
        comprehensive testing, Sentry monitoring, and the production deploy.
      </Text>

      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#94a3b8", borderRadius: 6,
          marginTop: 12,
          marginBottom: 8,
        }}
      >
        <View style={headerRow}>
          <Text style={headCell("15%")}>Sprint</Text>
          <Text style={headCell("25%")}>Focus Area</Text>
          <Text style={headCell("60%", true)}>Key Deliverables</Text>
        </View>
        {[
          ["Sprint 1", "Project Setup", "Repository, Next.js app, Prisma schema, authentication"],
          ["Sprint 2", "Database & Auth", "User & team models, Better Auth integration"],
          ["Sprint 3", "Visual Editor I", "React Flow setup, canvas, basic node rendering"],
          ["Sprint 4", "Visual Editor II", "Node connections, validation, save/load workflows"],
          ["Sprint 5", "Execution I", "Inngest integration, workflow parser, basic execution"],
          ["Sprint 6", "Execution II", "Node executors, error handling, retry logic"],
          ["Sprint 7", "HTTP Integration", "HTTP Request node, credential management"],
          ["Sprint 8", "Slack & Email", "Slack node, Email node, notifications"],
          ["Sprint 9", "AI Integration", "OpenAI, Anthropic, Google Gemini nodes"],
          ["Sprint 10", "Team Features", "RBAC, team management, credential sharing"],
          ["Sprint 11", "Testing", "Unit tests, integration tests, bug fixes"],
          ["Sprint 12", "Deployment", "Production setup, monitoring, documentation"],
        ].map((row, i, arr) => (
          <View key={i} style={dataRow(i === arr.length - 1)}>
            <Text style={dataCell("15%", { bold: true, size: 8 })}>{row[0]}</Text>
            <Text style={dataCell("25%", { size: 8 })}>{row[1]}</Text>
            <Text style={dataCell("60%", { size: 8, last: true })}>{row[2]}</Text>
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
        Table 6.4: Sprint Overview and Deliverables
      </Text>

      {/* 6.2.6 Agile Practices Adopted */}
      <Text style={styles.h3}>6.2.6 Agile Practices Adopted</Text>
      <Text style={styles.paragraphIndent}>
        Beyond sprint structure, several practices improved quality and
        productivity: <Text style={styles.bold}>Continuous Integration</Text>{" "}
        ran tests on every commit; <Text style={styles.bold}>Code Review</Text>{" "}
        gated all merges; <Text style={styles.bold}>Refactoring</Text> was
        treated as ongoing rather than deferred;{" "}
        <Text style={styles.bold}>Test-Driven Development</Text> drove critical
        components like the workflow parser and node executors; and{" "}
        <Text style={styles.bold}>pair programming</Text> was used for complex
        or unfamiliar tasks.
      </Text>

      {/* 6.2.7 Comparison with Alternative Methodologies */}
      <Text style={styles.h3}>6.2.7 Comparison with Alternatives</Text>
      <Text style={styles.paragraphIndent}>
        For context, Agile is contrasted below with Waterfall and Spiral —
        common alternatives in academic discussion.
      </Text>

      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#94a3b8", borderRadius: 6,
          marginTop: 12,
          marginBottom: 8,
        }}
      >
        <View style={headerRow}>
          <Text style={headCell("20%")}>Aspect</Text>
          <Text style={headCell("27%")}>Waterfall</Text>
          <Text style={headCell("27%")}>Spiral</Text>
          <Text style={headCell("26%", true)}>Agile</Text>
        </View>
        {[
          ["Approach", "Sequential phases", "Risk-driven iterations", "Value-driven sprints"],
          ["Flexibility", "Low — changes costly", "Medium — planned changes", "High — embraces change"],
          ["Documentation", "Heavy", "Moderate", "Just enough"],
          ["Delivery", "End of project", "Per iteration", "Every sprint"],
          ["Risk Discovery", "Late", "Per cycle", "Continuous"],
          ["Customer Input", "Beginning only", "Per iteration", "Continuous"],
          ["Best For", "Stable requirements", "High-risk projects", "Evolving requirements"],
        ].map((row, i, arr) => (
          <View key={i} style={dataRow(i === arr.length - 1)}>
            <Text style={dataCell("20%", { bold: true, size: 8 })}>{row[0]}</Text>
            <Text style={dataCell("27%", { size: 8 })}>{row[1]}</Text>
            <Text style={dataCell("27%", { size: 8 })}>{row[2]}</Text>
            <Text style={dataCell("26%", { size: 8, last: true })}>{row[3]}</Text>
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
        Table 6.5: Comparison of Development Methodologies
      </Text>

      <Text style={styles.paragraphIndent}>
        Given Flowgent&apos;s evolving requirements, heavy UI iteration, and
        multi-technology integration, Agile provided the optimal balance.
        Waterfall would have been too rigid; Spiral&apos;s formal risk
        analysis was unnecessary at this scale.
      </Text>

      {/* 6.2.8 Lessons Learned + Summary (combined) */}
      <Text style={styles.h3}>6.2.8 Lessons Learned &amp; Summary</Text>
      <Text style={styles.paragraphIndent}>
        Three themes emerged. First, sprint length matters — one-week sprints
        gave momentum but demanded disciplined planning. Second, a strict
        Definition of Done was essential to prevent prematurely &quot;done&quot;
        items. Third, technical debt accumulates under deadline pressure;
        dedicated refactoring time must be planned. Across twelve one-week
        sprints, Agile&apos;s iterative cadence, ceremonies, and practices
        carried Flowgent from initial setup to a fully functional, deployed
        workflow automation platform.
      </Text>
    </BookPageLayout>
  );
}
