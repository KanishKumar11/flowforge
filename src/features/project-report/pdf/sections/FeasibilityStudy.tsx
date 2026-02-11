"use client";

import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import BookPageLayout from "../components/BookPageLayout";
import SWOTDiagram from "../diagrams/SWOTDiagram";
import TechFeasibilityRadar from "../diagrams/TechFeasibilityRadar";
import CostBreakdownChart from "../diagrams/CostBreakdownChart";
import ScheduleTimeline from "../diagrams/ScheduleTimeline";
import FeasibilityScorecard from "../diagrams/FeasibilityScorecard";

/**
 * Chapter 4: Feasibility Study (7 pages)
 */
export default function FeasibilityStudy() {
  return (
    <BookPageLayout chapterTitle="Feasibility Study" chapterNum="04">
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
          CHAPTER 4
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
          FEASIBILITY STUDY
        </Text>
        <View style={{ width: 60, height: 3, backgroundColor: "#000000" }} />
      </View>

      <Text style={styles.h2}>4.1 Introduction</Text>
      <Text style={styles.paragraphIndent}>
        A feasibility study is a critical preliminary analysis conducted before
        committing resources to a project. It evaluates whether the proposed
        project is technically possible, economically viable, and operationally
        practical. This section presents the comprehensive feasibility analysis
        conducted for the Flowgent workflow automation platform.
      </Text>
      <Text style={styles.paragraphIndent}>
        The feasibility study examines five dimensions: technical feasibility
        (can we build it?), economic feasibility (is it cost-effective?),
        operational feasibility (will it work in practice?), schedule
        feasibility (can we complete it in time?), and legal feasibility (are
        there regulatory concerns?). Each dimension contributes to the overall
        project viability assessment.
      </Text>

      <Text style={styles.h2}>4.2 Technical Feasibility</Text>
      <Text style={styles.paragraphIndent}>
        Technical feasibility assesses whether the project can be accomplished
        with available technology, tools, and expertise. For Flowgent, this
        analysis examined the technology stack, third-party integrations, and
        technical complexity.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Technology Stack Assessment:</Text>
      </Text>
      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          marginTop: 8,
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
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Technology
          </Text>
          <Text
            style={{
              width: "55%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Assessment
          </Text>
          <Text
            style={{
              width: "23%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Status
          </Text>
        </View>
        {[
          [
            "Next.js 16",
            "Latest stable version with App Router, mature ecosystem",
            "Feasible",
          ],
          [
            "React 19",
            "Industry standard, extensive community support",
            "Feasible",
          ],
          [
            "TypeScript",
            "Provides type safety, excellent IDE support",
            "Feasible",
          ],
          [
            "React Flow",
            "Purpose-built for node-based editors, active development",
            "Feasible",
          ],
          [
            "Inngest",
            "Durable execution, built-in retry and monitoring",
            "Feasible",
          ],
          ["Prisma ORM", "Type-safe database access, excellent DX", "Feasible"],
          [
            "PostgreSQL",
            "Robust, scalable, industry-standard RDBMS",
            "Feasible",
          ],
          ["tRPC", "End-to-end type safety for API layer", "Feasible"],
          [
            "Better Auth",
            "Comprehensive auth solution, OAuth support",
            "Feasible",
          ],
        ].map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              borderBottomWidth: i < 8 ? 1 : 0,
              borderBottomColor: "#cccccc",
            }}
          >
            <Text
              style={{
                width: "22%",
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
                width: "55%",
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
                width: "23%",
                padding: 3,
                fontSize: 8,
                textAlign: "center",
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
        Table 4.1: Technology Stack Feasibility Assessment
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Third-Party Integration Assessment:</Text>
      </Text>
      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          marginTop: 8,
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
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Integration
          </Text>
          <Text
            style={{
              width: "35%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            SDK/API Available
          </Text>
          <Text
            style={{
              width: "25%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Documentation
          </Text>
          <Text
            style={{
              width: "20%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Status
          </Text>
        </View>
        {[
          ["OpenAI", "Official Node.js SDK", "Excellent", "Feasible"],
          ["Anthropic", "Official TypeScript SDK", "Good", "Feasible"],
          ["Google AI", "Official SDK (Gemini)", "Good", "Feasible"],
          ["Slack", "Official Web API", "Excellent", "Feasible"],
          ["Notion", "Official API", "Good", "Feasible"],
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
                width: "20%",
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
                width: "35%",
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
                width: "25%",
                padding: 3,
                fontSize: 8,
                textAlign: "center",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[2]}
            </Text>
            <Text
              style={{
                width: "20%",
                padding: 3,
                fontSize: 8,
                textAlign: "center",
                color: "#006600",
              }}
            >
              {row[3]}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Technical Risk Analysis:</Text>
      </Text>
      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          marginTop: 8,
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
              width: "25%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Risk
          </Text>
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
            Likelihood
          </Text>
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
            Impact
          </Text>
          <Text
            style={{
              width: "45%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Mitigation Strategy
          </Text>
        </View>
        {[
          [
            "React Flow limitations",
            "Low",
            "Medium",
            "Extend with custom components; fallback to alternative",
          ],
          [
            "Inngest service outage",
            "Low",
            "High",
            "Implement queue fallback; monitor status",
          ],
          [
            "API rate limits",
            "Medium",
            "Medium",
            "Implement caching; use multiple API keys",
          ],
          [
            "Database scalability",
            "Low",
            "Medium",
            "Use connection pooling; optimize queries",
          ],
          [
            "Security vulnerabilities",
            "Medium",
            "High",
            "Follow OWASP guidelines; regular audits",
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
                width: "15%",
                padding: 3,
                fontSize: 8,
                textAlign: "center",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[1]}
            </Text>
            <Text
              style={{
                width: "15%",
                padding: 3,
                fontSize: 8,
                textAlign: "center",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[2]}
            </Text>
            <Text
              style={{ width: "45%", padding: 3, fontSize: 8, lineHeight: 1.3 }}
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
        Table 4.2: Technical Risk Analysis
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Skills Assessment:</Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        The development team possesses the necessary skills for all core
        technologies. Experience with React and TypeScript is strong, while
        Next.js App Router and Inngest required additional learning during the
        project. Online resources, documentation, and community support were
        adequate for skill gaps.
      </Text>

      <View
        style={{
          marginTop: 12,
          padding: 10,
          borderWidth: 2,
          borderColor: "#006600",
          backgroundColor: "#f0fff0",
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontFamily: "Times-Bold",
            color: "#006600",
            textAlign: "center",
          }}
        >
          Technical Feasibility Assessment: APPROVED
        </Text>
        <Text style={{ fontSize: 9, textAlign: "center", marginTop: 4 }}>
          All technologies are mature, well-documented, and compatible.
          Technical risks are manageable.
        </Text>
      </View>

      <View
        wrap={false}
        style={{ alignItems: "center", marginTop: 16, marginBottom: 8 }}
      >
        <TechFeasibilityRadar />
      </View>
      <Text
        style={{
          fontSize: 9,
          fontFamily: "Times-Italic",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Figure 4.1: Technical Feasibility Radar Assessment
      </Text>

      <Text style={styles.h2}>4.3 Economic Feasibility</Text>
      <Text style={styles.paragraphIndent}>
        Economic feasibility analyzes the costs and benefits of the project to
        determine whether it provides positive value. For an academic project,
        this analysis focuses on development costs, infrastructure costs, and
        potential commercial value.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Development Cost Analysis:</Text>
      </Text>
      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          marginTop: 8,
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
              width: "30%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Category
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
              width: "30%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Cost
          </Text>
        </View>
        {[
          [
            "Development Labor",
            "12 weeks × 30 hrs/week × INR 400/hr (imputed)",
            "INR 1,50,000 (imputed)",
          ],
          [
            "Hardware",
            "Laptop (amortized over project duration)",
            "INR 45,000",
          ],
          ["Cloud & Hosting", "Vercel Pro, Neon DB, Domain", "INR 15,000/year"],
          [
            "Internet & Utilities",
            "Broadband, electricity (12 weeks)",
            "INR 15,000",
          ],
          [
            "Misc & Contingency",
            "Plugins, resources, contingency",
            "INR 10,000",
          ],
          [
            "Dev & Design Tools",
            "VS Code, Git, Figma, Vitest (all free/OSS)",
            "INR 0",
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
                width: "30%",
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
                width: "40%",
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
                width: "30%",
                padding: 3,
                fontSize: 8,
                textAlign: "right",
              }}
            >
              {row[2]}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Infrastructure Cost Analysis (Monthly):</Text>
      </Text>
      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          marginTop: 8,
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
              width: "25%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Service
          </Text>
          <Text
            style={{
              width: "25%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Plan
          </Text>
          <Text
            style={{
              width: "25%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Development
          </Text>
          <Text
            style={{
              width: "25%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Production
          </Text>
        </View>
        {[
          ["Netlify Hosting", "Free → Pro", "INR0", "INR1,600/mo"],
          ["Neon Database", "Free → Pro", "INR0", "INR1,600/mo"],
          ["Inngest", "Free tier", "INR0", "INR0 (free tier)"],
          ["Domain", "flowgent.app", "-", "INR125/mo (annual)"],
          ["OpenAI API", "Pay-as-you-go", "INR500/mo", "INR2,000/mo"],
          ["Slack API", "Free tier", "INR0", "INR0"],
          ["Email (SMTP)", "Resend", "INR0", "INR0 (free tier)"],
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
                width: "25%",
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
                width: "25%",
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
                width: "25%",
                padding: 3,
                fontSize: 8,
                textAlign: "right",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[2]}
            </Text>
            <Text
              style={{
                width: "25%",
                padding: 3,
                fontSize: 8,
                textAlign: "right",
              }}
            >
              {row[3]}
            </Text>
          </View>
        ))}
        <View style={{ flexDirection: "row", backgroundColor: "#D9E2F3" }}>
          <Text
            style={{
              width: "50%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Total Monthly
          </Text>
          <Text
            style={{
              width: "25%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              textAlign: "right",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            INR500
          </Text>
          <Text
            style={{
              width: "25%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              textAlign: "right",
            }}
          >
            INR5,425
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontSize: 9,
          fontFamily: "Times-Italic",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Table 4.3: Infrastructure Cost Analysis
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Cost-Benefit Analysis:</Text>
      </Text>
      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          marginTop: 8,
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
              width: "50%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Costs (1st Year)
          </Text>
          <Text
            style={{
              width: "50%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Benefits
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: "#cccccc",
          }}
        >
          <View
            style={{
              width: "50%",
              borderRightWidth: 1,
              borderRightColor: "#cccccc",
              padding: 6,
            }}
          >
            <Text style={{ fontSize: 8, marginBottom: 2 }}>
              • Development: INR0 (self-developed)
            </Text>
            <Text style={{ fontSize: 8, marginBottom: 2 }}>
              • Development infra: INR6,000
            </Text>
            <Text style={{ fontSize: 8, marginBottom: 2 }}>
              • Production infra: INR65,100/yr
            </Text>
            <Text style={{ fontSize: 8, marginBottom: 2 }}>
              • Total: ~INR71,100
            </Text>
          </View>
          <View style={{ width: "50%", padding: 6 }}>
            <Text style={{ fontSize: 8, marginBottom: 2 }}>
              • Learning and skill development
            </Text>
            <Text style={{ fontSize: 8, marginBottom: 2 }}>
              • Portfolio project
            </Text>
            <Text style={{ fontSize: 8, marginBottom: 2 }}>
              • Potential SaaS product launch
            </Text>
            <Text style={{ fontSize: 8, marginBottom: 2 }}>
              • Potential commercial value
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.paragraphIndent}>
        The economic analysis demonstrates that the project is viable within the
        constraints of an academic project. Development costs are minimized
        through use of free and open-source tools. Production infrastructure
        costs are reasonable and can be reduced by operating within free tiers
        during initial deployment. The potential commercial value and portfolio
        benefits outweigh the modest infrastructure investments.
      </Text>

      <View
        style={{
          marginTop: 12,
          padding: 10,
          borderWidth: 2,
          borderColor: "#006600",
          backgroundColor: "#f0fff0",
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontFamily: "Times-Bold",
            color: "#006600",
            textAlign: "center",
          }}
        >
          Economic Feasibility Assessment: APPROVED
        </Text>
        <Text style={{ fontSize: 9, textAlign: "center", marginTop: 4 }}>
          Initial costs are minimal. Production costs are manageable and
          scalable with usage.
        </Text>
      </View>

      <View
        wrap={false}
        style={{ alignItems: "center", marginTop: 16, marginBottom: 8 }}
      >
        <CostBreakdownChart />
      </View>
      <Text
        style={{
          fontSize: 9,
          fontFamily: "Times-Italic",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Figure 4.2: Project Cost Breakdown
      </Text>

      <Text style={styles.h2} break>
        4.4 Operational Feasibility
      </Text>
      <Text style={styles.paragraphIndent}>
        Operational feasibility evaluates whether the system will work
        effectively in its intended environment and whether users will adopt and
        use it. This analysis considers user acceptance, organizational fit, and
        long-term maintainability.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>User Acceptance Factors:</Text>
      </Text>
      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          marginTop: 8,
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
              width: "25%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Factor
          </Text>
          <Text
            style={{
              width: "50%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Assessment
          </Text>
          <Text
            style={{
              width: "25%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Rating
          </Text>
        </View>
        {[
          [
            "Ease of Learning",
            "Visual drag-and-drop interface minimizes learning curve",
            "High",
          ],
          [
            "User Interface",
            "Modern, intuitive design following UX best practices",
            "High",
          ],
          [
            "Perceived Value",
            "Clear time savings from automation visible immediately",
            "High",
          ],
          [
            "Feature Parity",
            "Matches or exceeds competitors in key areas",
            "Medium-High",
          ],
          [
            "Documentation",
            "Comprehensive docs, tutorials, and examples planned",
            "Medium",
          ],
          [
            "Support",
            "Community support via GitHub, no paid support tier",
            "Medium",
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
                width: "25%",
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
                width: "50%",
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
                width: "25%",
                padding: 3,
                fontSize: 8,
                textAlign: "center",
              }}
            >
              {row[2]}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Maintainability Assessment:</Text>
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Code Quality:</Text> TypeScript ensures
          type safety; ESLint/Prettier enforce standards
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Architecture:</Text> Modular design with
          clear separation of concerns
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Documentation:</Text> Inline comments,
          JSDoc, separate architecture docs
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Testing:</Text> Unit and integration tests
          enable safe refactoring
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Dependencies:</Text> Actively maintained,
          audited regularly for vulnerabilities
        </Text>
      </View>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Scalability Assessment:</Text>
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Horizontal Scaling:</Text> Netlify
          auto-scales serverless functions
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Database Scaling:</Text> Neon supports
          read replicas and connection pooling
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Execution Scaling:</Text> Inngest handles
          concurrent executions automatically
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Geographic Distribution:</Text> Netlify
          edge network provides global CDN
        </Text>
      </View>

      <View
        style={{
          marginTop: 8,
          padding: 10,
          borderWidth: 2,
          borderColor: "#006600",
          backgroundColor: "#f0fff0",
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontFamily: "Times-Bold",
            color: "#006600",
            textAlign: "center",
          }}
        >
          Operational Feasibility Assessment: APPROVED
        </Text>
        <Text style={{ fontSize: 9, textAlign: "center", marginTop: 4 }}>
          System is designed for ease of use, maintainability, and scalability.
        </Text>
      </View>

      <Text style={styles.h2} break>
        4.5 Schedule Feasibility
      </Text>
      <Text style={styles.paragraphIndent}>
        Schedule feasibility assesses whether the project can be completed
        within the required timeframe. The project timeline is 12 weeks, which
        must accommodate all SDLC phases from requirements to deployment.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Timeline Analysis:</Text>
      </Text>
      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          marginTop: 8,
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
              width: "25%",
              padding: 4,
              fontSize: 9,
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
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Allocated
          </Text>
          <Text
            style={{
              width: "35%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Key Deliverables
          </Text>
          <Text
            style={{
              width: "20%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Risk Level
          </Text>
        </View>
        {[
          ["Requirements", "1 week", "SRS Document", "Low"],
          ["Feasibility", "1 week", "Feasibility Report", "Low"],
          ["Design", "2 weeks", "Architecture, DFDs, ER", "Medium"],
          ["Development", "6 weeks", "Working Application", "Medium-High"],
          ["Testing", "1 week", "Test Reports", "Medium"],
          ["Deployment", "1 week", "Production System", "Low"],
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
                width: "25%",
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
                width: "20%",
                padding: 3,
                fontSize: 8,
                textAlign: "center",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[1]}
            </Text>
            <Text
              style={{
                width: "35%",
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
                width: "20%",
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

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Schedule Risk Mitigation:</Text>
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Buffer Time:</Text> 1 week contingency
          built into development phase
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Scope Management:</Text> MoSCoW
          prioritization enables scope reduction if needed
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Parallel Development:</Text> Frontend and
          backend can progress concurrently
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Reusable Components:</Text> Libraries
          reduce implementation time
        </Text>
      </View>

      <View
        style={{
          marginTop: 8,
          padding: 10,
          borderWidth: 2,
          borderColor: "#006600",
          backgroundColor: "#f0fff0",
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontFamily: "Times-Bold",
            color: "#006600",
            textAlign: "center",
          }}
        >
          Schedule Feasibility Assessment: APPROVED
        </Text>
        <Text style={{ fontSize: 9, textAlign: "center", marginTop: 4 }}>
          12-week timeline is achievable with appropriate scope management.
        </Text>
      </View>

      <View
        wrap={false}
        style={{ alignItems: "center", marginTop: 16, marginBottom: 8 }}
      >
        <ScheduleTimeline />
      </View>
      <Text
        style={{
          fontSize: 9,
          fontFamily: "Times-Italic",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Figure 4.3: 12-Week Project Schedule Timeline
      </Text>

      <Text style={styles.h2}>4.6 Legal Feasibility</Text>
      <Text style={styles.paragraphIndent}>
        Legal feasibility examines regulatory, licensing, and compliance
        considerations that may impact the project.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Licensing Analysis:</Text>
      </Text>
      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          marginTop: 8,
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
              width: "25%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Dependency
          </Text>
          <Text
            style={{
              width: "25%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            License
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
            Compatible
          </Text>
          <Text
            style={{
              width: "20%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Status
          </Text>
        </View>
        {[
          ["React", "MIT", "Yes - permissive", "OK"],
          ["Next.js", "MIT", "Yes - permissive", "OK"],
          ["React Flow", "MIT", "Yes - permissive", "OK"],
          ["Prisma", "Apache 2.0", "Yes - permissive", "OK"],
          ["Inngest SDK", "Apache 2.0", "Yes - permissive", "OK"],
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
                width: "25%",
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
                width: "30%",
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
                width: "20%",
                padding: 3,
                fontSize: 8,
                textAlign: "center",
                color: "#006600",
              }}
            >
              {row[3]}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Data Privacy Considerations:</Text>
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>User Data:</Text> Minimal PII collected
          (email, name); stored securely
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Credentials:</Text> Encrypted at rest
          using AES-256
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Execution Data:</Text> User workflow data
          not shared with third parties
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>GDPR Compliance:</Text> Data deletion
          capability; privacy policy required
        </Text>
      </View>

      <View
        style={{
          marginTop: 8,
          padding: 10,
          borderWidth: 2,
          borderColor: "#006600",
          backgroundColor: "#f0fff0",
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontFamily: "Times-Bold",
            color: "#006600",
            textAlign: "center",
          }}
        >
          Legal Feasibility Assessment: APPROVED
        </Text>
        <Text style={{ fontSize: 9, textAlign: "center", marginTop: 4 }}>
          All dependencies use permissive licenses. Privacy requirements are
          accommodated.
        </Text>
      </View>

      <Text style={[styles.h2, { marginTop: 20 }]}>4.7 SWOT Analysis</Text>
      <Text style={styles.paragraphIndent}>
        A SWOT analysis provides a strategic view of the project's position by
        examining Strengths, Weaknesses, Opportunities, and Threats.
      </Text>

      <View style={{ marginTop: 16, marginBottom: 8 }}>
        <SWOTDiagram />
        <Text
          style={{
            fontSize: 9,
            fontFamily: "Times-Italic",
            textAlign: "center",
            marginTop: 4,
            marginBottom: 12,
          }}
        >
          Figure 4.4: SWOT Analysis Matrix
        </Text>
      </View>

      <Text style={styles.h2} break>
        4.8 Feasibility Summary
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
            backgroundColor: "#D9E2F3",
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
            Feasibility Dimension
          </Text>
          <Text
            style={{
              width: "50%",
              padding: 6,
              fontSize: 10,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Key Finding
          </Text>
          <Text
            style={{
              width: "20%",
              padding: 6,
              fontSize: 10,
              fontFamily: "Times-Bold",
            }}
          >
            Status
          </Text>
        </View>
        {[
          ["Technical", "Mature stack, manageable risks", "APPROVED"],
          ["Economic", "Minimal costs, positive value", "APPROVED"],
          ["Operational", "User-friendly, maintainable", "APPROVED"],
          ["Schedule", "12 weeks achievable", "APPROVED"],
          ["Legal", "Compliant licensing", "APPROVED"],
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
                width: "30%",
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
                width: "50%",
                padding: 5,
                fontSize: 9,
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
                color: "#006600",
                fontFamily: "Times-Bold",
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
          marginBottom: 16,
        }}
      >
        Table 4.4: Feasibility Summary
      </Text>

      <View
        wrap={false}
        style={{ alignItems: "center", marginTop: 16, marginBottom: 8 }}
      >
        <FeasibilityScorecard />
      </View>
      <Text
        style={{
          fontSize: 9,
          fontFamily: "Times-Italic",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Figure 4.5: Feasibility Assessment Scorecard
      </Text>

      <Text style={styles.h2}>4.9 Conclusion</Text>
      <Text style={styles.paragraphIndent}>
        The comprehensive feasibility study conducted for the Flowgent workflow
        automation platform concludes that the project is viable across all five
        dimensions examined. Technical feasibility is confirmed by the
        availability of mature, well-documented technologies and manageable
        integration risks. Economic feasibility is supported by minimal
        development costs and reasonable infrastructure investments.
      </Text>
      <Text style={styles.paragraphIndent}>
        Operational feasibility is ensured through user-centric design,
        maintainable architecture, and built-in scalability. Schedule
        feasibility is achievable within the 12-week timeline through Agile
        methodology and appropriate scope management. Legal feasibility is
        confirmed through use of permissively licensed dependencies and
        accommodation of privacy requirements.
      </Text>
      <Text style={styles.paragraphIndent}>
        The SWOT analysis reveals a project with significant strengths in
        technology and design approach, manageable weaknesses that can be
        addressed over time, substantial market opportunities, and threats that
        can be mitigated through continuous improvement and community building.
      </Text>

      <View
        style={{
          marginTop: 16,
          padding: 14,
          borderWidth: 3,
          borderColor: "#006600",
          backgroundColor: "#f0fff0",
          alignItems: "center",
        }}
      >
        <Text
          style={{ fontSize: 14, fontFamily: "Times-Bold", color: "#006600" }}
        >
          OVERALL FEASIBILITY ASSESSMENT
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontFamily: "Times-Bold",
            color: "#006600",
            marginTop: 8,
          }}
        >
          PROJECT APPROVED
        </Text>
        <Text style={{ fontSize: 10, marginTop: 8, textAlign: "center" }}>
          Based on comprehensive analysis across all feasibility dimensions, the
          Flowgent workflow automation platform project is approved to proceed
          to the design and implementation phases.
        </Text>
      </View>
    </BookPageLayout>
  );
}
