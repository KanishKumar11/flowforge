"use client";

import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import BookPageLayout from "../components/BookPageLayout";

/**
 * Chapter 5.3: Requirement Gathering (7 pages)
 */
export default function RequirementGathering() {
  return (
    <BookPageLayout chapterTitle="SDLC" chapterNum="06">
      {/* Section Title */}
      <Text style={styles.h2}>6.3 Requirement Gathering</Text>
      <Text style={styles.paragraphIndent}>
        Requirement gathering is the foundational phase of the software
        development life cycle, where the needs, expectations, and constraints
        of stakeholders are systematically identified and documented. The
        quality of requirements directly impacts the success of the final
        product—incomplete or incorrect requirements lead to rework, delays, and
        user dissatisfaction.
      </Text>
      <Text style={styles.paragraphIndent}>
        For the Flowgent platform, a multi-method approach to requirement
        gathering was employed, combining questionnaires, interviews,
        competitive analysis, and prototype evaluation. This comprehensive
        approach ensured that requirements captured not only explicit user needs
        but also implicit expectations and industry best practices.
      </Text>

      {/* 6.3.1 Requirement Gathering Methods */}
      <Text style={styles.h3}>6.3.1 Requirement Gathering Methods</Text>
      <Text style={styles.paragraphIndent}>
        Three primary methods were utilized to gather requirements for the
        Flowgent platform:
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>1. Questionnaire Survey:</Text> A structured
          questionnaire was distributed to potential users including developers,
          business analysts, and project managers to understand their automation
          needs and pain points.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>2. Stakeholder Interviews:</Text> In-depth
          interviews were conducted with key stakeholders to explore specific
          use cases, constraints, and priorities in detail.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>3. Competitive Analysis:</Text> Existing
          workflow automation platforms were analyzed to understand industry
          standards, common features, and areas for differentiation.
        </Text>
      </View>

      {/* 6.3.2 Questionnaire Method */}
      <Text style={styles.h3}>6.3.2 Questionnaire Method</Text>
      <Text style={styles.paragraphIndent}>
        A comprehensive questionnaire was designed and distributed to potential
        users of workflow automation platforms. The questionnaire aimed to
        understand current tool usage, pain points, feature priorities, and
        technical requirements. A total of 47 responses were collected from
        participants with varying backgrounds in software development, business
        operations, and project management.
      </Text>

      {/* Questionnaire Box */}
      <View
        style={{
          borderWidth: 1,
          borderColor: "#999999",
          backgroundColor: "#f9f9f9",
          padding: 12,
          marginTop: 12,
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontFamily: "Times-Bold",
            marginBottom: 10,
            fontSize: 11,
            textAlign: "center",
          }}
        >
          FLOWGENT USER REQUIREMENTS QUESTIONNAIRE
        </Text>

        <Text
          style={{ fontFamily: "Times-Bold", marginBottom: 6, fontSize: 10 }}
        >
          Section A: Background Information
        </Text>
        <View style={{ marginLeft: 16, marginBottom: 8 }}>
          <Text style={{ fontSize: 9, marginBottom: 3 }}>
            1. What is your primary role? (Developer / Business Analyst / PM /
            Operations / Other)
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 3 }}>
            2. What is the size of your organization? (1-10 / 11-50 / 51-200 /
            200+)
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 3 }}>
            3. How would you rate your technical expertise? (Beginner /
            Intermediate / Advanced)
          </Text>
        </View>

        <Text
          style={{ fontFamily: "Times-Bold", marginBottom: 6, fontSize: 10 }}
        >
          Section B: Current Tool Usage
        </Text>
        <View style={{ marginLeft: 16, marginBottom: 8 }}>
          <Text style={{ fontSize: 9, marginBottom: 3 }}>
            4. What workflow automation tools have you used before?
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 3 }}>
            5. How satisfied are you with your current tools? (1-Very
            Dissatisfied to 5-Very Satisfied)
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 3 }}>
            6. What are the main limitations of your current tools?
          </Text>
        </View>

        <Text
          style={{ fontFamily: "Times-Bold", marginBottom: 6, fontSize: 10 }}
        >
          Section C: Feature Requirements
        </Text>
        <View style={{ marginLeft: 16, marginBottom: 8 }}>
          <Text style={{ fontSize: 9, marginBottom: 3 }}>
            7. Which trigger types are most important? (Manual / Webhook /
            Scheduled / All)
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 3 }}>
            8. Which integrations are essential for your work? (Select all that
            apply)
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 3 }}>
            9. How important is AI integration in workflows? (1-Not Important to
            5-Critical)
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 3 }}>
            10. How important is team collaboration? (1-Not Important to
            5-Critical)
          </Text>
        </View>
      </View>

      {/* Continued Questionnaire Box */}
      <View
        style={{
          borderWidth: 1,
          borderColor: "#999999",
          backgroundColor: "#f9f9f9",
          padding: 12,
          marginBottom: 12,
        }}
      >
        <Text
          style={{ fontFamily: "Times-Bold", marginBottom: 6, fontSize: 10 }}
        >
          Section D: Technical Requirements
        </Text>
        <View style={{ marginLeft: 16, marginBottom: 8 }}>
          <Text style={{ fontSize: 9, marginBottom: 3 }}>
            11. Is self-hosting capability important for your organization? (Yes
            / No / Maybe)
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 3 }}>
            12. What security features are required? (SSO / MFA / Encryption /
            Audit Logs)
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 3 }}>
            13. How important is monitoring and debugging capability? (1-5
            scale)
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 3 }}>
            14. Do you need version control for workflows? (Yes / No)
          </Text>
        </View>

        <Text
          style={{ fontFamily: "Times-Bold", marginBottom: 6, fontSize: 10 }}
        >
          Section E: Usability Preferences
        </Text>
        <View style={{ marginLeft: 16, marginBottom: 8 }}>
          <Text style={{ fontSize: 9, marginBottom: 3 }}>
            15. Do you prefer visual/drag-drop or code-based workflow design?
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 3 }}>
            16. How much time should be required to create a basic workflow?
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 3 }}>
            17. What documentation/help resources would be most valuable?
          </Text>
          <Text style={{ fontSize: 9, marginBottom: 3 }}>
            18. Any additional features or requirements not covered above?
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontSize: 9,
          fontFamily: "Times-Italic",
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        Figure 6.3: User Requirements Questionnaire
      </Text>

      {/* 6.3.3 Interview Method */}
      <Text style={styles.h3}>6.3.3 Interview Method</Text>
      <Text style={styles.paragraphIndent}>
        Following the questionnaire analysis, in-depth interviews were conducted
        with 8 key stakeholders representing different user personas. These
        semi-structured interviews explored specific use cases, pain points, and
        requirements in greater detail than the questionnaire allowed.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Interview Participants:</Text>
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
            backgroundColor: "#f0f0f0",
            borderBottomWidth: 1,
            borderBottomColor: "#333333",
          }}
        >
          <Text
            style={{
              width: "8%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            #
          </Text>
          <Text
            style={{
              width: "22%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Role
          </Text>
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
            Industry
          </Text>
          <Text
            style={{
              width: "45%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Primary Use Case
          </Text>
        </View>
        {[
          [
            "1",
            "Software Developer",
            "Technology",
            "API integration and data sync",
          ],
          ["2", "Business Analyst", "Finance", "Report generation automation"],
          ["3", "DevOps Engineer", "SaaS", "CI/CD notifications and alerts"],
          [
            "4",
            "Project Manager",
            "Consulting",
            "Cross-platform task management",
          ],
          ["5", "Marketing Manager", "E-commerce", "Lead nurturing workflows"],
          [
            "6",
            "Operations Lead",
            "Healthcare",
            "Patient notification systems",
          ],
          ["7", "Startup Founder", "EdTech", "User onboarding automation"],
          [
            "8",
            "IT Administrator",
            "Manufacturing",
            "System monitoring and alerts",
          ],
        ].map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              borderBottomWidth: i < 7 ? 1 : 0,
              borderBottomColor: "#cccccc",
            }}
          >
            <Text
              style={{
                width: "8%",
                padding: 4,
                fontSize: 8,
                textAlign: "center",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[0]}
            </Text>
            <Text
              style={{
                width: "22%",
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
                width: "25%",
                padding: 4,
                fontSize: 8,
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[2]}
            </Text>
            <Text style={{ width: "45%", padding: 4, fontSize: 8 }}>
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
        Table 6.6: Interview Participants and Use Cases
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Interview Structure:</Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        Each interview lasted 45-60 minutes and followed a semi-structured
        format with the following sections:
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Current workflow management practices and tools (10 min)
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Pain points and frustrations with existing solutions (10 min)
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Specific use case walkthrough and requirements (15 min)
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Feature prioritization exercise (10 min)
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Open discussion and additional requirements (10 min)
        </Text>
      </View>

      {/* 6.3.4 Questionnaire Results */}
      <Text style={styles.h3}>6.3.4 Questionnaire Results Analysis</Text>
      <Text style={styles.paragraphIndent}>
        The questionnaire responses were analyzed to identify patterns and
        priorities. The following tables summarize key findings from the survey.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Respondent Demographics:</Text>
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
            backgroundColor: "#f0f0f0",
            borderBottomWidth: 1,
            borderBottomColor: "#333333",
          }}
        >
          <Text
            style={{
              width: "35%",
              padding: 5,
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
              width: "35%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Options
          </Text>
          <Text
            style={{
              width: "30%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Percentage
          </Text>
        </View>
        {[
          ["Primary Role", "Developers", "38%"],
          ["", "Business Analysts", "23%"],
          ["", "Project Managers", "17%"],
          ["", "Operations", "15%"],
          ["", "Other", "7%"],
          ["Organization Size", "1-10 employees", "21%"],
          ["", "11-50 employees", "34%"],
          ["", "51-200 employees", "28%"],
          ["", "200+ employees", "17%"],
          ["Technical Expertise", "Beginner", "26%"],
          ["", "Intermediate", "45%"],
          ["", "Advanced", "29%"],
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
                width: "35%",
                padding: 4,
                fontSize: 8,
                fontFamily: row[0] ? "Times-Bold" : "Times-Roman",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[0]}
            </Text>
            <Text
              style={{
                width: "35%",
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
                textAlign: "center",
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
        Table 6.7: Questionnaire Respondent Demographics
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Tool Usage and Satisfaction:</Text>
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
            backgroundColor: "#f0f0f0",
            borderBottomWidth: 1,
            borderBottomColor: "#333333",
          }}
        >
          <Text
            style={{
              width: "30%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Previous Tool
          </Text>
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
            Usage %
          </Text>
          <Text
            style={{
              width: "45%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Avg. Satisfaction (1-5)
          </Text>
        </View>
        {[
          ["Zapier", "51%", "3.4"],
          ["n8n", "23%", "3.7"],
          ["Make/Integromat", "34%", "3.5"],
          ["Microsoft Power Automate", "28%", "3.2"],
          ["Custom Scripts", "40%", "2.8"],
          ["None", "12%", "N/A"],
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
                width: "25%",
                padding: 4,
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
                width: "45%",
                padding: 4,
                fontSize: 8,
                textAlign: "center",
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
        Table 6.8: Current Tool Usage and Satisfaction Levels
      </Text>

      {/* 6.3.5 Key Findings */}
      <Text style={styles.h3}>6.3.5 Key Findings</Text>
      <Text style={styles.paragraphIndent}>
        Analysis of the questionnaire responses and interview transcripts
        revealed several significant findings that shaped the Flowgent
        requirements:
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>
          Finding 1: Learning Curve is a Major Barrier (85%)
        </Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        85% of respondents reported struggling with the learning curve of
        existing automation tools. Many commented that while features were
        powerful, the time investment to learn the platform was prohibitive.
        This finding emphasized the need for an intuitive, visual interface that
        reduces the barrier to entry.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>
          Finding 2: HTTP API Integration is Essential (70%)
        </Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        70% of respondents indicated that HTTP API integration was their most
        common use case. Many workflows involve calling external APIs, webhooks,
        or custom services. This finding prioritized robust HTTP Request node
        capabilities with support for all common methods, authentication types,
        and response handling.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>
          Finding 3: AI Features are Increasingly Desired (65%)
        </Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        65% of respondents expressed interest in AI-powered automation features.
        Use cases included content generation, data analysis, intelligent
        routing, and natural language processing. This finding validated the
        decision to include native AI integration as a core feature.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>
          Finding 4: Team Collaboration is Critical (80%)
        </Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        80% of respondents worked in team environments and required
        collaboration features. Many were frustrated that RBAC and team features
        were locked behind expensive enterprise plans. This finding established
        team collaboration as a core requirement rather than a premium add-on.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>
          Finding 5: Monitoring is Non-Negotiable (90%)
        </Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        90% of respondents emphasized the importance of execution monitoring and
        debugging. When automations fail, users need clear visibility into what
        went wrong. This finding prioritized comprehensive logging, execution
        history, and error reporting.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>
          Finding 6: Visual Interface Preferred (75%)
        </Text>
      </Text>
      <Text style={styles.paragraphIndent}>
        75% of respondents preferred visual/drag-drop workflow design over
        code-based solutions. Even technically proficient users appreciated the
        visual representation for understanding complex workflows. This finding
        reinforced the visual-first design approach.
      </Text>

      {/* 6.3.6 Use Case Identification */}
      <Text style={styles.h3}>6.3.6 Use Case Identification</Text>
      <Text style={styles.paragraphIndent}>
        Based on the requirement gathering activities, the following primary use
        cases were identified for the Flowgent platform:
      </Text>

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
              width: "10%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            UC#
          </Text>
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
            Use Case
          </Text>
          <Text
            style={{
              width: "20%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Actor
          </Text>
          <Text
            style={{
              width: "45%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Description
          </Text>
        </View>
        {[
          [
            "UC01",
            "Create Workflow",
            "User",
            "Design workflow using visual editor",
          ],
          [
            "UC02",
            "Configure Trigger",
            "User",
            "Set up manual/webhook/schedule trigger",
          ],
          ["UC03", "Add Action Node", "User", "Add and configure action nodes"],
          [
            "UC04",
            "Execute Workflow",
            "System",
            "Run workflow based on trigger",
          ],
          [
            "UC05",
            "View Execution",
            "User",
            "Monitor execution status and logs",
          ],
          ["UC06", "Manage Credentials", "User", "Store API keys and tokens"],
          [
            "UC07",
            "Invite Team Member",
            "Admin",
            "Add users to team workspace",
          ],
          ["UC08", "Set Permissions", "Admin", "Configure role-based access"],
        ].map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              borderBottomWidth: i < 7 ? 1 : 0,
              borderBottomColor: "#cccccc",
            }}
          >
            <Text
              style={{
                width: "10%",
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
                width: "25%",
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
                width: "20%",
                padding: 4,
                fontSize: 8,
                textAlign: "center",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[2]}
            </Text>
            <Text style={{ width: "45%", padding: 4, fontSize: 8 }}>
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
          marginBottom: 8,
        }}
      >
        Table 6.9: Primary Use Cases Identified
      </Text>

      {/* 6.3.7 Stakeholder Analysis */}
      <Text style={styles.h3}>6.3.7 Stakeholder Analysis</Text>
      <Text style={styles.paragraphIndent}>
        Understanding the various stakeholders and their perspectives was
        crucial for prioritizing requirements. The following analysis identifies
        key stakeholder groups and their primary concerns.
      </Text>

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
              width: "20%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Stakeholder
          </Text>
          <Text
            style={{
              width: "35%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Primary Concerns
          </Text>
          <Text
            style={{
              width: "45%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Success Criteria
          </Text>
        </View>
        {[
          [
            "End Users",
            "Ease of use, learning curve, visual design",
            "Create workflow in <15 minutes",
          ],
          [
            "Developers",
            "Extensibility, API access, debugging",
            "Clear logs, code-level control when needed",
          ],
          [
            "Team Admins",
            "Access control, credential security",
            "Role-based permissions, secure storage",
          ],
          [
            "IT Operations",
            "Reliability, monitoring, audit logs",
            "99.9% uptime, comprehensive logging",
          ],
          [
            "Business Owners",
            "ROI, productivity gains, cost",
            "Measurable efficiency improvements",
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
                width: "35%",
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
              style={{ width: "45%", padding: 5, fontSize: 8, lineHeight: 1.3 }}
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
        Table 6.10: Stakeholder Analysis
      </Text>

      {/* 6.3.8 Requirement Prioritization */}
      <Text style={styles.h3}>
        6.3.8 Requirement Prioritization (MoSCoW Method)
      </Text>
      <Text style={styles.paragraphIndent}>
        Requirements were prioritized using the MoSCoW method, which categorizes
        requirements into Must Have, Should Have, Could Have, and Won't Have
        (this version). This prioritization ensured that essential features were
        completed first while maintaining visibility into the full scope.
      </Text>

      <View style={{ marginLeft: 16, marginBottom: 12 }}>
        <Text style={{ fontSize: 11, marginBottom: 8, lineHeight: 1.5 }}>
          <Text style={styles.bold}>Must Have (Critical for MVP):</Text>
        </Text>
        <View style={{ marginLeft: 16, marginBottom: 8 }}>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            • Visual workflow editor with drag-and-drop interface
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            • Node types: Trigger (manual, webhook, schedule), HTTP Request, AI
            (OpenAI)
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            • Workflow execution engine with basic error handling
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            • User authentication (email/password, OAuth)
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            • Workflow save/load and basic management
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            • Execution history and status view
          </Text>
        </View>

        <Text style={{ fontSize: 11, marginBottom: 8, lineHeight: 1.5 }}>
          <Text style={styles.bold}>
            Should Have (Important, not critical for launch):
          </Text>
        </Text>
        <View style={{ marginLeft: 16, marginBottom: 8 }}>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            • Additional AI providers (Anthropic Claude, Google Gemini)
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            • Slack and Notion integrations
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            • Team workspaces with basic RBAC
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            • Credential management with encryption
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            • Retry logic and advanced error handling
          </Text>
        </View>

        <Text style={{ fontSize: 11, marginBottom: 8, lineHeight: 1.5 }}>
          <Text style={styles.bold}>
            Could Have (Desirable if time permits):
          </Text>
        </Text>
        <View style={{ marginLeft: 16, marginBottom: 8 }}>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            • Workflow version history and rollback
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            • Email integration (SMTP)
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            • Advanced team roles and permissions
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            • Execution replay for debugging
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            • Workflow templates and marketplace
          </Text>
        </View>

        <Text style={{ fontSize: 11, marginBottom: 8, lineHeight: 1.5 }}>
          <Text style={styles.bold}>
            Won't Have (Deferred to future versions):
          </Text>
        </Text>
        <View style={{ marginLeft: 16, marginBottom: 8 }}>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            • Mobile application
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            • Custom node development SDK
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            • On-premise deployment package
          </Text>
          <Text style={{ fontSize: 10, marginBottom: 3 }}>
            • White-label/embedding support
          </Text>
        </View>
      </View>

      {/* 6.3.9 Requirements Traceability Matrix */}
      <Text style={styles.h3}>6.3.9 Requirements Traceability Matrix</Text>
      <Text style={styles.paragraphIndent}>
        A Requirements Traceability Matrix (RTM) was created to map requirements
        to their sources and to the components that implement them. This matrix
        ensures that all requirements are addressed and provides traceability
        for validation.
      </Text>

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
              width: "10%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Req#
          </Text>
          <Text
            style={{
              width: "28%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Requirement
          </Text>
          <Text
            style={{
              width: "17%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Source
          </Text>
          <Text
            style={{
              width: "13%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Priority
          </Text>
          <Text
            style={{
              width: "32%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
            }}
          >
            Implementation
          </Text>
        </View>
        {[
          [
            "R01",
            "Visual workflow editor",
            "Q:15, I:1-8",
            "Must",
            "React Flow canvas",
          ],
          [
            "R02",
            "Multiple trigger types",
            "Q:7, I:3",
            "Must",
            "Trigger node types",
          ],
          [
            "R03",
            "HTTP API integration",
            "Q:8, I:1,4",
            "Must",
            "HTTP Request node",
          ],
          [
            "R04",
            "AI model integration",
            "Q:9, I:7",
            "Must",
            "AI provider nodes",
          ],
          ["R05", "Team workspaces", "Q:10, I:5", "Should", "Team model, RBAC"],
          [
            "R06",
            "Credential security",
            "Q:12, I:6",
            "Should",
            "Encrypted storage",
          ],
          [
            "R07",
            "Execution monitoring",
            "Q:13, I:1-8",
            "Must",
            "Execution logs UI",
          ],
          [
            "R08",
            "Self-hosting option",
            "Q:11, I:8",
            "Should",
            "Docker, Netlify",
          ],
          ["R09", "Version control", "Q:14, I:4", "Could", "Workflow versions"],
          ["R10", "Slack integration", "Q:8, I:3,5", "Should", "Slack node"],
          ["R11", "Notion integration", "Q:8, I:7", "Should", "Notion node"],
          ["R12", "Audit logging", "Q:12, I:6,8", "Could", "Activity logs"],
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
                width: "10%",
                padding: 3,
                fontSize: 7,
                fontFamily: "Times-Bold",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[0]}
            </Text>
            <Text
              style={{
                width: "28%",
                padding: 3,
                fontSize: 7,
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[1]}
            </Text>
            <Text
              style={{
                width: "17%",
                padding: 3,
                fontSize: 7,
                textAlign: "center",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[2]}
            </Text>
            <Text
              style={{
                width: "13%",
                padding: 3,
                fontSize: 7,
                textAlign: "center",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[3]}
            </Text>
            <Text style={{ width: "32%", padding: 3, fontSize: 7 }}>
              {row[4]}
            </Text>
          </View>
        ))}
      </View>
      <Text
        style={{
          fontSize: 9,
          fontFamily: "Times-Italic",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Table 6.11: Requirements Traceability Matrix (Q=Questionnaire,
        I=Interview)
      </Text>

      {/* 6.3.10 Validation of Requirements */}
      <Text style={styles.h3}>6.3.10 Validation of Requirements</Text>
      <Text style={styles.paragraphIndent}>
        Requirements were validated using multiple techniques to ensure they
        were complete, consistent, and feasible:
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Stakeholder Review:</Text> Requirements
          were presented to interview participants for confirmation that their
          needs were accurately captured.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Prototype Evaluation:</Text> A
          low-fidelity prototype of the visual editor was created and evaluated
          by users to validate usability requirements.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Technical Feasibility:</Text> Each
          requirement was assessed for technical feasibility with the chosen
          technology stack.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Consistency Check:</Text> Requirements
          were reviewed for conflicts or contradictions, ensuring they could all
          be satisfied simultaneously.
        </Text>
      </View>

      {/* 6.3.11 Challenges in Requirement Gathering */}
      <Text style={styles.h3}>6.3.11 Challenges in Requirement Gathering</Text>
      <Text style={styles.paragraphIndent}>
        Several challenges were encountered during the requirement gathering
        process:
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Diverse User Base:</Text> Potential users
          ranged from non-technical business users to experienced developers.
          Balancing simplicity for beginners with power for advanced users
          required careful feature design.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Feature Creep:</Text> Users often
          requested features beyond the project scope. The MoSCoW prioritization
          helped maintain focus on core requirements.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Implicit Requirements:</Text> Some
          requirements were unstated because users assumed them to be obvious.
          Careful probing and prototype evaluation helped surface these implicit
          expectations.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Conflicting Priorities:</Text> Different
          stakeholder groups sometimes had conflicting priorities. Balancing
          these required explicit trade-off decisions documented in the SRS.
        </Text>
      </View>

      {/* 6.3.12 Requirements Documentation */}
      <Text style={styles.h3}>6.3.12 Requirements Documentation</Text>
      <Text style={styles.paragraphIndent}>
        The requirement gathering phase produced the following documentation
        artifacts:
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Software Requirements Specification (SRS) Document
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Use Case Specifications with detailed scenarios
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Requirements Traceability Matrix
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Stakeholder Analysis Document
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Questionnaire Results Analysis
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Interview Summary Reports
        </Text>
      </View>
      <Text style={styles.paragraphIndent}>
        These documents served as the authoritative source for requirements
        throughout the project and were updated as requirements evolved.
      </Text>

      {/* 6.3.13 Summary */}
      <Text style={styles.h3}>6.3.13 Summary</Text>
      <Text style={styles.paragraphIndent}>
        The requirement gathering phase employed a comprehensive multi-method
        approach combining questionnaires (47 responses), stakeholder interviews
        (8 participants), and competitive analysis. Key findings revealed strong
        demand for visual interfaces (75%), HTTP integration (70%), AI
        capabilities (65%), and team collaboration (80%).
      </Text>
      <Text style={styles.paragraphIndent}>
        Requirements were prioritized using the MoSCoW method and documented in
        a formal SRS with traceability to sources. The validated requirements
        formed the foundation for the system design and implementation phases
        that followed. The next section presents the detailed Software
        Requirements Specification derived from this gathering process.
      </Text>
    </BookPageLayout>
  );
}
