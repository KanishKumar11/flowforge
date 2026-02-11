"use client";

import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import BookPageLayout from "../components/BookPageLayout";
import AgileSprintDiagram from "../diagrams/AgileSprintDiagram";

/**
 * Chapter 5.2: Process Model - Agile Methodology (5 pages)
 */
export default function ProcessModel() {
  return (
    <BookPageLayout chapterTitle="SDLC" chapterNum="06">
      {/* Section Title */}
      <Text style={styles.h2}>6.2 Process Model</Text>
      <Text style={styles.paragraphIndent}>
        The selection of an appropriate process model is a critical decision
        that influences project organization, communication patterns, and the
        ability to respond to changing requirements. This section describes the
        Agile Development Methodology adopted for the Flowgent project,
        providing justification for this choice and detailing its
        implementation.
      </Text>

      {/* 6.2.1 Agile Methodology Overview */}
      <Text style={styles.h3}>6.2.1 Agile Methodology Overview</Text>
      <Text style={styles.paragraphIndent}>
        Agile software development is a set of principles and practices that
        emphasize iterative development, customer collaboration, and
        responsiveness to change. Unlike traditional waterfall approaches that
        attempt to define all requirements upfront and proceed through
        sequential phases, Agile embraces the inherent uncertainty in software
        development and uses it as an opportunity for continuous improvement.
      </Text>
      <Text style={styles.paragraphIndent}>
        The Agile approach is codified in the Agile Manifesto, which values:
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          • <Text style={styles.bold}>Individuals and interactions</Text> over
          processes and tools
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          • <Text style={styles.bold}>Working software</Text> over comprehensive
          documentation
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          • <Text style={styles.bold}>Customer collaboration</Text> over
          contract negotiation
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          • <Text style={styles.bold}>Responding to change</Text> over following
          a plan
        </Text>
      </View>
      <Text style={styles.paragraphIndent}>
        For this project, a Scrum-influenced Agile approach was adopted,
        organizing work into time-boxed iterations called sprints. This provided
        the structure needed for planning and tracking while maintaining the
        flexibility to adapt to discoveries made during development.
      </Text>

      {/* 6.2.2 Justification for Agile Selection */}
      <Text style={styles.h3}>6.2.2 Justification for Agile Selection</Text>
      <Text style={styles.paragraphIndent}>
        Several factors influenced the decision to adopt Agile for the Flowgent
        project. Each factor addresses specific characteristics of the project
        that made Agile particularly suitable.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Iterative Development Needs:</Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        The visual workflow editor—the core feature of Flowgent—required
        extensive iteration to achieve an intuitive user experience. It was not
        possible to fully specify the editor's behavior upfront; instead, the
        design evolved through cycles of implementation, evaluation, and
        refinement. Agile's iterative approach accommodated this evolution
        naturally.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Evolving Requirements:</Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        As development progressed, new insights emerged about user needs,
        technical constraints, and integration possibilities. The initial
        requirement for basic AI integration, for example, expanded to include
        multiple AI providers (OpenAI, Anthropic, Google) as their capabilities
        and value became apparent. Agile's embrace of change made these
        adaptations feasible.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Risk Mitigation:</Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        The technical complexity of integrating multiple technologies (Next.js,
        React Flow, Inngest, tRPC, Prisma) presented significant risk. Agile's
        approach of building working software incrementally meant that
        integration issues were discovered and resolved early, rather than
        accumulating until a single integration phase.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Continuous Delivery Value:</Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        Each sprint produced potentially deployable software, enabling ongoing
        demonstration and validation. This visibility into progress helped
        maintain momentum and provided regular opportunities for feedback and
        course correction.
      </Text>

      {/* 6.2.3 Sprint Structure */}
      <Text style={styles.h3}>6.2.3 Sprint Structure</Text>
      <Text style={styles.paragraphIndent}>
        Development was organized into one-week sprints, providing a consistent
        rhythm for planning, execution, and review. Each sprint followed a
        defined structure with specific ceremonies and deliverables.
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
          borderColor: "#333333",
          marginTop: 12,
          marginBottom: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#D9E2F3",
            borderBottomWidth: 1,
            borderBottomColor: "#333333",
          }}
        >
          <Text
            style={{
              width: "22%",
              padding: 6,
              fontSize: 10,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Activity
          </Text>
          <Text
            style={{
              width: "15%",
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
              width: "20%",
              padding: 6,
              fontSize: 10,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Timing
          </Text>
          <Text
            style={{
              width: "43%",
              padding: 6,
              fontSize: 10,
              fontFamily: "Times-Bold",
            }}
          >
            Purpose
          </Text>
        </View>
        {[
          [
            "Sprint Planning",
            "2 hours",
            "Day 1",
            "Define sprint goals, select backlog items, estimate effort",
          ],
          [
            "Daily Standup",
            "15 min",
            "Daily",
            "Sync on progress, identify blockers, coordinate work",
          ],
          [
            "Development",
            "~35 hours",
            "Days 1-5",
            "Implementation, testing, code review",
          ],
          [
            "Sprint Review",
            "1 hour",
            "Day 5",
            "Demo completed features, gather feedback",
          ],
          [
            "Retrospective",
            "30 min",
            "Day 5",
            "Reflect on process, identify improvements",
          ],
        ].map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              borderBottomWidth: i < 4 ? 1 : 0,
              borderBottomColor: "#cccccc",
            }}
          >
            <Text
              style={{
                width: "22%",
                padding: 5,
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
                width: "15%",
                padding: 5,
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
                width: "20%",
                padding: 5,
                fontSize: 9,
                textAlign: "center",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[2]}
            </Text>
            <Text
              style={{ width: "43%", padding: 5, fontSize: 9, lineHeight: 1.3 }}
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
          marginBottom: 16,
        }}
      >
        Table 6.3: Sprint Structure and Ceremonies
      </Text>

      {/* 6.2.4 Agile Artifacts */}
      <Text style={styles.h3}>6.2.4 Agile Artifacts</Text>
      <Text style={styles.paragraphIndent}>
        Several key artifacts were maintained throughout the project to support
        the Agile process:
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Product Backlog:</Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        A prioritized list of all features, enhancements, and bug fixes for the
        product. Items were described as user stories where applicable (e.g.,
        "As a user, I want to drag nodes onto the canvas so that I can build
        workflows visually"). The backlog was continuously refined based on
        feedback and changing priorities.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Sprint Backlog:</Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        The subset of product backlog items selected for completion in the
        current sprint, along with a plan for delivering them. Sprint backlog
        items were broken down into specific technical tasks.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Definition of Done:</Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        A shared understanding of what "done" means for each backlog item. For
        Flowgent, an item was considered done when:
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Code is written and follows project coding standards
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Unit tests are written and passing
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Feature is manually tested and works as expected
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Code is reviewed and approved
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Documentation is updated if applicable
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Feature is deployed to staging environment
        </Text>
      </View>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Burn-down Chart:</Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        A visual representation of remaining work versus time, used to track
        sprint progress and predict completion. When the burn-down showed the
        sprint was at risk, scope was adjusted or blockers were addressed.
      </Text>

      {/* 6.2.5 Development Sprints Overview */}
      <Text style={styles.h3}>6.2.5 Development Sprints Overview</Text>
      <Text style={styles.paragraphIndent}>
        The project was executed over 12 sprints, each focusing on specific
        functional areas. The following table provides an overview of each
        sprint's focus and key deliverables.
      </Text>

      {/* Sprints Table */}
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
            backgroundColor: "#D9E2F3",
            borderBottomWidth: 1,
            borderBottomColor: "#333333",
          }}
        >
          <Text
            style={{
              width: "15%",
              padding: 6,
              fontSize: 10,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Sprint
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
            Focus Area
          </Text>
          <Text
            style={{
              width: "60%",
              padding: 6,
              fontSize: 10,
              fontFamily: "Times-Bold",
            }}
          >
            Key Deliverables
          </Text>
        </View>
        {[
          [
            "Sprint 1",
            "Project Setup",
            "Repository, Next.js app, Prisma schema, authentication",
          ],
          [
            "Sprint 2",
            "Database & Auth",
            "User model, team model, Better Auth integration",
          ],
          [
            "Sprint 3",
            "Visual Editor I",
            "React Flow setup, canvas, basic node rendering",
          ],
          [
            "Sprint 4",
            "Visual Editor II",
            "Node connections, validation, save/load workflows",
          ],
          [
            "Sprint 5",
            "Execution I",
            "Inngest integration, workflow parser, basic execution",
          ],
          [
            "Sprint 6",
            "Execution II",
            "Node executors, error handling, retry logic",
          ],
          [
            "Sprint 7",
            "HTTP Integration",
            "HTTP Request node, credential management",
          ],
          [
            "Sprint 8",
            "Slack & Email",
            "Slack node, Email node, notification system",
          ],
          [
            "Sprint 9",
            "AI Integration",
            "OpenAI, Anthropic, Google Gemini nodes",
          ],
          [
            "Sprint 10",
            "Team Features",
            "RBAC, team management, credential sharing",
          ],
          ["Sprint 11", "Testing", "Unit tests, integration tests, bug fixes"],
          [
            "Sprint 12",
            "Deployment",
            "Production setup, monitoring, documentation",
          ],
        ].map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              borderBottomWidth: i < 11 ? 1 : 0,
              borderBottomColor: "#cccccc",
            }}
          >
            <Text
              style={{
                width: "15%",
                padding: 5,
                fontSize: 8,
                fontFamily: "Times-Bold",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[0]}
            </Text>
            <Text
              style={{
                width: "25%",
                padding: 5,
                fontSize: 8,
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[1]}
            </Text>
            <Text
              style={{ width: "60%", padding: 5, fontSize: 8, lineHeight: 1.3 }}
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
        Table 6.4: Sprint Overview and Deliverables
      </Text>

      {/* 6.2.6 Detailed Sprint Descriptions */}
      <Text style={styles.h3}>6.2.6 Detailed Sprint Descriptions</Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Sprints 1-2: Foundation</Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        The initial sprints established the project foundation including
        repository setup, development environment configuration, and core
        infrastructure. The Next.js application was initialized with TypeScript,
        Tailwind CSS was configured for styling, and the Prisma schema was
        designed to support users, teams, workflows, and executions. Better Auth
        was integrated for authentication with Google and GitHub OAuth
        providers.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Sprints 3-4: Visual Editor</Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        These sprints focused on the core visual workflow editor. React Flow was
        integrated as the canvas library, and custom node components were
        created for different node types (triggers, actions, AI nodes). The
        connection system was implemented with validation to prevent invalid
        connections. Workflow serialization enabling save and load functionality
        was developed, along with the workflow management API.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Sprints 5-6: Execution Engine</Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        The execution engine sprints integrated Inngest for durable function
        execution. A workflow parser was developed to convert the visual
        representation into executable steps. Node executors were implemented
        for each node type, with proper error handling, retry logic, and state
        management between steps.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Sprints 7-8: Service Integrations</Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        Integration sprints added connectivity to external services. The HTTP
        Request node was implemented supporting all common HTTP methods with
        configurable headers, body, and authentication. The credential
        management system was built to securely store and use API keys. Slack
        integration enabled sending messages to channels and users. Email
        integration was implemented via SMTP configuration.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Sprint 9: AI Capabilities</Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        This sprint added AI integration as a first-class feature. Nodes were
        created for OpenAI (GPT-4, GPT-3.5), Anthropic (Claude 3 Sonnet, Opus),
        and Google (Gemini Pro, Flash). Each node supports configurable prompts,
        system messages, temperature, and token limits. The implementation
        abstracts provider differences while exposing relevant configuration
        options.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Sprint 10: Team Features</Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        Team collaboration features were implemented including role-based access
        control with Owner, Admin, Member, and Viewer roles. Team management
        functionality allows creating teams, inviting members, and managing
        roles. Credentials can be shared within teams with appropriate
        permission controls.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Sprints 11-12: Testing and Deployment</Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        The final sprints focused on quality assurance and production readiness.
        Comprehensive testing was performed including unit tests, integration
        tests, and end-to-end workflow testing. Bugs discovered during testing
        were fixed. The production environment was configured on Netlify with
        PostgreSQL on Neon and Inngest Cloud for execution. The application was
        deployed at https://flowgent.app. Monitoring and logging were
        established using Sentry.
      </Text>

      {/* 6.2.7 Agile Practices Adopted */}
      <Text style={styles.h3}>6.2.7 Agile Practices Adopted</Text>
      <Text style={styles.paragraphIndent}>
        Beyond the sprint structure, several specific Agile practices were
        adopted to improve quality and productivity:
      </Text>

      <View style={{ marginLeft: 16, marginBottom: 12 }}>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Continuous Integration:</Text> Code was
          committed frequently and integrated continuously. The CI pipeline ran
          tests on each commit to catch regressions early.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Code Review:</Text> All changes were
          reviewed before merging. This caught bugs, improved code quality, and
          shared knowledge across the codebase.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Refactoring:</Text> Technical debt was
          addressed continuously rather than allowed to accumulate. When
          patterns became clearer, code was refactored to improve
          maintainability.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Test-Driven Development:</Text> For
          critical components like the workflow parser and node executors, tests
          were written before implementation to clarify requirements and ensure
          correctness.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Pair Programming:</Text> Complex or
          unfamiliar tasks were tackled collaboratively, combining knowledge and
          catching errors in real-time.
        </Text>
      </View>

      {/* 6.2.8 Comparison with Alternative Methodologies */}
      <Text style={styles.h3}>
        6.2.8 Comparison with Alternative Methodologies
      </Text>
      <Text style={styles.paragraphIndent}>
        To provide context for the Agile selection, a brief comparison with
        alternative methodologies is provided:
      </Text>

      {/* Methodology Comparison Table */}
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
            backgroundColor: "#D9E2F3",
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
            Aspect
          </Text>
          <Text
            style={{
              width: "27%",
              padding: 6,
              fontSize: 10,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Waterfall
          </Text>
          <Text
            style={{
              width: "27%",
              padding: 6,
              fontSize: 10,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Spiral
          </Text>
          <Text
            style={{
              width: "26%",
              padding: 6,
              fontSize: 10,
              fontFamily: "Times-Bold",
            }}
          >
            Agile
          </Text>
        </View>
        {[
          [
            "Approach",
            "Sequential phases",
            "Risk-driven iterations",
            "Value-driven sprints",
          ],
          [
            "Flexibility",
            "Low - changes costly",
            "Medium - planned changes",
            "High - embraces change",
          ],
          ["Documentation", "Heavy emphasis", "Moderate", "Just enough"],
          ["Delivery", "End of project", "Per iteration", "Every sprint"],
          ["Risk Discovery", "Late in process", "Per cycle", "Continuous"],
          ["Customer Input", "Beginning only", "Per iteration", "Continuous"],
          [
            "Best For",
            "Stable requirements",
            "High-risk projects",
            "Evolving requirements",
          ],
        ].map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              borderBottomWidth: i < 6 ? 1 : 0,
              borderBottomColor: "#cccccc",
            }}
          >
            <Text
              style={{
                width: "20%",
                padding: 5,
                fontSize: 8,
                fontFamily: "Times-Bold",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[0]}
            </Text>
            <Text
              style={{
                width: "27%",
                padding: 5,
                fontSize: 8,
                lineHeight: 1.3,
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[1]}
            </Text>
            <Text
              style={{
                width: "27%",
                padding: 5,
                fontSize: 8,
                lineHeight: 1.3,
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[2]}
            </Text>
            <Text
              style={{ width: "26%", padding: 5, fontSize: 8, lineHeight: 1.3 }}
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
          marginBottom: 16,
        }}
      >
        Table 6.5: Comparison of Development Methodologies
      </Text>

      <Text style={styles.paragraphIndent}>
        Given the nature of the Flowgent project—with evolving requirements,
        significant UI/UX iteration needs, and integration of multiple
        technologies—Agile provided the optimal balance of structure and
        flexibility. The waterfall approach would have been too rigid for the
        iterative UI development needed, while spiral's emphasis on formal risk
        analysis was unnecessary for this project's scale.
      </Text>

      {/* 6.2.9 Lessons Learned */}
      <Text style={styles.h3}>6.2.9 Lessons Learned</Text>
      <Text style={styles.paragraphIndent}>
        The Agile implementation yielded several valuable lessons:
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          1. <Text style={styles.bold}>Sprint length matters:</Text> One-week
          sprints provided good momentum but required disciplined planning. For
          complex features, two-week sprints might have been more appropriate.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          2. <Text style={styles.bold}>Definition of Done is essential:</Text>{" "}
          Without a clear definition, it was easy to call items "done"
          prematurely. Enforcing the DoD improved quality significantly.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          3. <Text style={styles.bold}>Technical debt accumulates:</Text>{" "}
          Despite intentions to address debt continuously, some accumulated
          during deadline pressure. Dedicated refactoring time should be
          planned.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          4.{" "}
          <Text style={styles.bold}>Integration early, integrate often:</Text>{" "}
          Early integration of React Flow, Inngest, and other components
          revealed issues that would have been costly to fix later.
        </Text>
      </View>

      {/* 6.2.10 Summary */}
      <Text style={styles.h3}>6.2.10 Summary</Text>
      <Text style={styles.paragraphIndent}>
        The Agile methodology provided an effective framework for developing the
        Flowgent platform. Through twelve one-week sprints, the project
        progressed from initial setup to a fully functional workflow automation
        platform. The iterative approach enabled continuous feedback and
        adaptation, while the sprint ceremonies ensured consistent planning,
        review, and improvement. The lessons learned from this Agile
        implementation will inform future projects.
      </Text>
    </BookPageLayout>
  );
}
