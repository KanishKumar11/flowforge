"use client";

import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import BookPageLayout from "../components/BookPageLayout";

/**
 * Chapter 12: Conclusions & Future Scope (4 pages)
 */
export default function Conclusions() {
  return (
    <BookPageLayout chapterTitle="Conclusions" chapterNum="12">
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Times-Roman",
            color: "#666666",
            letterSpacing: 3,
            marginBottom: 8,
          }}
        >
          CHAPTER 12
        </Text>
        <Text
          style={{
            fontSize: 24,
            fontFamily: "Times-Bold",
            textAlign: "center",
            marginBottom: 16,
            textTransform: "uppercase",
          }}
        >
          CONCLUSIONS & FUTURE SCOPE
        </Text>
        <View style={{ width: 60, height: 3, backgroundColor: "#000000" }} />
      </View>

      <Text style={styles.h2}>12.1 Project Summary</Text>
      <Text style={styles.paragraphIndent}>
        Flowgent 1.0 has been successfully developed as a comprehensive visual
        workflow automation platform. The project achieved its primary
        objectives of creating an intuitive, accessible tool for workflow
        automation that bridges the gap between no-code simplicity and developer
        flexibility.
      </Text>
      <Text style={styles.paragraphIndent}>
        The platform enables users to visually design, execute, and monitor
        automated workflows through an intuitive drag-and-drop interface. By
        leveraging modern web technologies and cloud-native architecture,
        Flowgent provides a robust, scalable solution for personal and
        team-based workflow automation.
      </Text>

      <Text style={styles.h2}>12.2 Key Achievements</Text>
      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          marginTop: 12,
          marginBottom: 12,
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
              width: "25%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Objective
          </Text>
          <Text
            style={{
              width: "45%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Achievement
          </Text>
          <Text
            style={{
              width: "30%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Status
          </Text>
        </View>
        {[
          [
            "Visual Editor",
            "React Flow-based drag-and-drop canvas",
            "Completed",
          ],
          ["Execution Engine", "Durable execution with Inngest", "Completed"],
          ["AI Integration", "OpenAI, Anthropic, Google Gemini", "Completed"],
          ["Team Collaboration", "RBAC with 4 role levels", "Completed"],
          ["Credential Security", "AES-256 encrypted storage", "Completed"],
          [
            "24 Node Types",
            "HTTP, AI, Slack, GitHub, Notion, Stripe, Twilio, logic nodes",
            "Completed",
          ],
          [
            "Version Control",
            "Workflow versioning with rollback support",
            "Completed",
          ],
          [
            "Scheduled Execution",
            "Cron-based scheduling with timezone support",
            "Completed",
          ],
          [
            "Webhook Triggers",
            "Auto-generated endpoints with secret validation",
            "Completed",
          ],
          ["Templates", "5 pre-built workflow templates", "Completed"],
          [
            "Monitoring",
            "Real-time execution logs & error alerting",
            "Completed",
          ],
        ].map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              borderBottomWidth: i < 9 ? 1 : 0,
              borderBottomColor: "#cccccc",
            }}
          >
            <Text
              style={{
                width: "25%",
                padding: 4,
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
                width: "45%",
                padding: 4,
                fontSize: 8,
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[1]}
            </Text>
            <Text
              style={{
                width: "30%",
                padding: 4,
                fontSize: 8,
                color: "#006600",
              }}
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
          marginBottom: 12,
        }}
      >
        Table 12.1: Project Objectives Achievement
      </Text>

      <Text style={styles.h2}>12.3 Technical Accomplishments</Text>
      <View style={{ marginLeft: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          <Text style={styles.bold}>Frontend:</Text> Modern React 19 with
          Next.js 16 App Router, TypeScript, Tailwind CSS
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          <Text style={styles.bold}>Backend:</Text> Type-safe API with tRPC (7
          routers, 59 procedures), Prisma ORM, PostgreSQL
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          <Text style={styles.bold}>Execution:</Text> Durable workflow execution
          with Inngest, BFS traversal, automatic retries
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          <Text style={styles.bold}>Security:</Text> Better Auth with OAuth2
          (Google, GitHub), RBAC, AES-256 encrypted credentials
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          <Text style={styles.bold}>Integrations:</Text> 24 node types including
          Slack, Google Sheets, GitHub, Notion, Stripe, Twilio, AI providers
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          <Text style={styles.bold}>Deployment:</Text> Netlify hosting, Neon
          PostgreSQL, Inngest Cloud, Sentry monitoring
        </Text>
      </View>

      <Text style={styles.h2}>12.4 Limitations</Text>
      <Text style={styles.paragraphIndent}>
        While Flowgent 1.0 successfully delivers core functionality, several
        limitations have been identified that represent opportunities for future
        development.
      </Text>

      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          marginTop: 12,
          marginBottom: 12,
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
              width: "25%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Limitation
          </Text>
          <Text
            style={{
              width: "40%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Description
          </Text>
          <Text
            style={{
              width: "35%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Impact
          </Text>
        </View>
        {[
          [
            "No Mobile App",
            "Web-only responsive interface",
            "Limited mobile workflow monitoring",
          ],
          [
            "Single Tenant",
            "Shared database architecture",
            "Not suitable for enterprise isolation",
          ],
          [
            "No Custom Nodes",
            "Fixed node type library (24 types)",
            "Cannot extend with user-created node types",
          ],
          [
            "Basic Analytics",
            "Execution history and stats only",
            "No advanced performance insights or dashboards",
          ],
          [
            "No On-Premise",
            "Cloud-hosted only (Netlify/Neon)",
            "Cannot self-host for data residency needs",
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
                width: "25%",
                padding: 4,
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
                width: "40%",
                padding: 4,
                fontSize: 8,
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[1]}
            </Text>
            <Text style={{ width: "35%", padding: 4, fontSize: 8 }}>
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
          marginBottom: 12,
        }}
      >
        Table 12.2: Current Limitations
      </Text>

      <Text style={styles.h2}>12.5 Lessons Learned</Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 10, marginBottom: 6 }}>
          <Text style={styles.bold}>Technology Selection:</Text> Choosing
          mature, well-documented frameworks (Next.js, Prisma) significantly
          reduced development friction.
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 6 }}>
          <Text style={styles.bold}>Type Safety:</Text> TypeScript and tRPC's
          end-to-end type safety prevented numerous bugs during development.
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 6 }}>
          <Text style={styles.bold}>Managed Services:</Text> Using Inngest for
          execution and Netlify for hosting eliminated infrastructure
          complexity.
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 6 }}>
          <Text style={styles.bold}>Iterative Development:</Text> Agile sprints
          allowed for rapid iteration and early feedback incorporation.
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 6 }}>
          <Text style={styles.bold}>Documentation:</Text> Maintaining inline
          documentation facilitated code understanding during refactoring.
        </Text>
      </View>

      <Text style={styles.h2}>12.6 Future Scope</Text>
      <Text style={styles.paragraphIndent}>
        The following enhancements are planned for future versions of Flowgent
        to address current limitations and expand platform capabilities.
      </Text>

      <Text style={styles.h3}>12.6.1 Short-Term Roadmap (v1.1 - v1.5)</Text>
      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          marginTop: 8,
          marginBottom: 12,
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
              width: "15%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Version
          </Text>
          <Text
            style={{
              width: "30%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Feature
          </Text>
          <Text
            style={{
              width: "40%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Description
          </Text>
          <Text
            style={{
              width: "15%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Priority
          </Text>
        </View>
        {[
          [
            "1.1",
            "Database Nodes",
            "Direct PostgreSQL, MySQL, MongoDB query nodes",
            "High",
          ],
          [
            "1.2",
            "Custom Node SDK",
            "Allow users to create and publish custom nodes",
            "High",
          ],
          [
            "1.3",
            "Advanced Analytics",
            "Execution metrics, cost tracking, dashboards",
            "Medium",
          ],
          [
            "1.4",
            "Workflow Sharing",
            "Public template marketplace with community contributions",
            "Medium",
          ],
          [
            "1.5",
            "Multi-language Code",
            "Python and TypeScript code nodes alongside JavaScript",
            "Medium",
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
                width: "15%",
                padding: 3,
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
                width: "30%",
                padding: 3,
                fontSize: 8,
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[1]}
            </Text>
            <Text
              style={{
                width: "40%",
                padding: 3,
                fontSize: 8,
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[2]}
            </Text>
            <Text
              style={{
                width: "15%",
                padding: 3,
                fontSize: 8,
                textAlign: "center",
              }}
            >
              {row[3]}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.h3}>12.6.2 Long-Term Vision (v2.0+)</Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 10, marginBottom: 6 }}>
          <Text style={styles.bold}>AI Workflow Builder:</Text> Natural language
          to workflow generation using LLMs. Users describe automation in plain
          English and receive a complete workflow draft.
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 6 }}>
          <Text style={styles.bold}>Node Marketplace:</Text>{" "}
          Community-contributed custom nodes and templates with rating and
          review system.
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 6 }}>
          <Text style={styles.bold}>Mobile Applications:</Text> Native iOS and
          Android apps for workflow monitoring, execution control, and push
          notifications.
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 6 }}>
          <Text style={styles.bold}>Enterprise Features:</Text> SSO integration,
          audit logging, compliance certifications (SOC 2, GDPR), and dedicated
          support.
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 6 }}>
          <Text style={styles.bold}>On-Premise Deployment:</Text> Self-hosted
          option for organizations with strict data residency requirements.
        </Text>
      </View>

      <Text style={styles.h3}>12.6.3 Commercial Potential</Text>
      <Text style={styles.paragraphIndent}>
        Flowgent has significant commercial potential in the growing workflow
        automation market. The freemium SaaS model with tiered pricing (Free,
        Pro, Enterprise) could provide sustainable revenue while maintaining
        accessibility for individual users and small teams.
      </Text>

      <Text style={styles.h2}>12.7 Conclusion</Text>
      <Text style={styles.paragraphIndent}>
        The development of Flowgent 1.0 has been a comprehensive journey through
        modern full-stack web development, from requirements gathering through
        deployment. The project successfully demonstrates the feasibility of
        building accessible automation tools using open-source technologies that
        can compete with established commercial solutions.
      </Text>
      <Text style={styles.paragraphIndent}>
        Key takeaways from this project include the importance of selecting the
        right technology stack, implementing robust security measures from the
        start, and following established software engineering practices
        throughout the development lifecycle.
      </Text>
      <Text style={styles.paragraphIndent}>
        The comprehensive documentation, modular architecture, and extensive
        test coverage ensure that Flowgent can continue to evolve beyond this
        initial release. The foundation laid by this project supports both
        continued academic exploration and potential commercial development.
      </Text>

      <View
        style={{
          marginTop: 20,
          padding: 16,
          backgroundColor: "#f8f8f8",
          borderLeftWidth: 4,
          borderLeftColor: "#333333",
        }}
      >
        <Text
          style={{ fontSize: 11, fontFamily: "Times-Italic", lineHeight: 1.6 }}
        >
          "Flowgent represents not just an academic project submission, but a
          solid foundation for continued learning and potential commercial
          development in the workflow automation space. The skills gained
          through this project—modern React development, cloud-native
          architecture, security implementation, and full-stack deployment—are
          directly applicable to industry positions."
        </Text>
      </View>

      <View
        style={{
          marginTop: 24,
          padding: 14,
          borderWidth: 2,
          borderColor: "#006600",
          backgroundColor: "#f0fff0",
          alignItems: "center",
        }}
      >
        <Text
          style={{ fontSize: 14, fontFamily: "Times-Bold", color: "#006600" }}
        >
          PROJECT COMPLETED SUCCESSFULLY
        </Text>
        <Text style={{ fontSize: 10, marginTop: 8, textAlign: "center" }}>
          Flowgent v1.0 | Visual Workflow Automation Platform
        </Text>
        <Text style={{ fontSize: 10, marginTop: 4, textAlign: "center" }}>
          Deployed: https://flowgent.app | GitHub:
          https://github.com/kanishKumar11/flowgent
        </Text>
        <Text style={{ fontSize: 10, marginTop: 4, textAlign: "center" }}>
          All objectives achieved | Submitted: March 15, 2026
        </Text>
      </View>

      <Text style={[styles.paragraphIndent, { marginTop: 24 }]}>
        The author extends gratitude to the project guide, faculty members, and
        all who contributed to making this project a success. Special thanks to
        the open-source community whose tools and libraries made this project
        possible.
      </Text>
    </BookPageLayout>
  );
}
