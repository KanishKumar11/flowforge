"use client";

import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import BookPageLayout from "../components/BookPageLayout";
import MarketGrowthChart from "../diagrams/MarketGrowthChart";
import ComparisonRadar from "../diagrams/ComparisonRadar";

/**
 * Chapter 2: Problem Statement (7 pages)
 */
export default function ProblemStatement() {
  return (
    <BookPageLayout chapterTitle="Problem Statement" chapterNum="02">
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
          CHAPTER 2
        </Text>
        <Text
          style={{
            fontSize: 28,
            fontFamily: "Times-Bold",
            textAlign: "center",
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: 1.5,
          }}
        >
          PROBLEM STATEMENT
        </Text>
        <View style={{ width: 60, height: 3, backgroundColor: "#000000" }} />
      </View>

      {/* 2.1 Introduction */}
      <Text style={styles.h2}>2.1 Introduction</Text>
      <Text style={styles.paragraphIndent}>
        In today's rapidly evolving digital landscape, organizations of all
        sizes face mounting pressure to streamline their operations, reduce
        manual intervention, and improve overall efficiency. The proliferation
        of cloud-based services, APIs, and SaaS applications has created both
        opportunities and challenges for businesses seeking to automate their
        workflows and integrate disparate systems.
      </Text>
      <Text style={styles.paragraphIndent}>
        While numerous workflow automation platforms exist in the market, each
        comes with its own set of limitations that prevent widespread adoption
        among non-technical users. This chapter provides a comprehensive
        analysis of the current challenges in workflow automation, examines
        existing solutions and their shortcomings, and establishes the
        foundation for the proposed Flowgent platform.
      </Text>
      <Text style={styles.paragraphIndent}>
        The need for accessible, reliable, and intelligent workflow automation
        has never been greater. Organizations that fail to adopt automation face
        reduced productivity, increased operational costs, and diminished
        competitive advantage in an increasingly digital marketplace.
      </Text>

      {/* 2.2 Problem Statement */}
      <Text style={styles.h2}>2.2 Problem Statement</Text>
      <Text style={styles.paragraphIndent}>
        Modern organizations encounter several interconnected challenges when
        attempting to automate their business processes and integrate various
        software systems. These challenges can be categorized into four primary
        areas: manual process overhead, technical barriers to automation,
        integration complexity, and reliability concerns.
      </Text>

      {/* 2.2.1 Manual Process Overhead */}
      <Text style={styles.h3}>2.2.1 Manual Process Overhead</Text>
      <Text style={styles.paragraphIndent}>
        Despite the availability of sophisticated software tools, many business
        operations continue to rely heavily on manual interventions for tasks
        that could potentially be automated. These manual processes create
        significant operational bottlenecks and introduce opportunities for
        human error.
      </Text>
      <Text style={styles.paragraph}>
        Common examples of manual process overhead include:
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Data Entry and Transfer:</Text> Employees
          frequently copy data manually between systems, such as transferring
          customer information from web forms to CRM systems, updating
          spreadsheets with data from emails, or synchronizing inventory levels
          across multiple platforms.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Report Generation:</Text> Creating
          periodic reports often involves gathering data from multiple sources,
          formatting it consistently, and distributing it to stakeholders—a
          process that can consume hours of valuable time each week.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Notification Management:</Text> Sending
          timely notifications to team members, customers, or partners based on
          specific events or conditions typically requires constant monitoring
          and manual intervention.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• File Processing:</Text> Tasks such as
          converting file formats, extracting information from documents,
          organizing files into appropriate folders, and backing up important
          data are often performed manually.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Cross-System Synchronization:</Text>{" "}
          Maintaining consistency across multiple software platforms requires
          regular manual updates, leading to data discrepancies and outdated
          information.
        </Text>
      </View>
      <Text style={styles.paragraphIndent}>
        The cumulative impact of these manual processes is substantial.
        According to industry research, knowledge workers spend an average of
        4.5 hours per week on routine, repetitive tasks that could be automated.
        For a mid-sized organization with 100 knowledge workers, this translates
        to over 23,000 hours of potentially automatable work annually.
      </Text>

      {/* 2.2.2 Technical Barrier to Automation */}
      <Text style={styles.h3}>2.2.2 Technical Barrier to Automation</Text>
      <Text style={styles.paragraphIndent}>
        One of the most significant obstacles to widespread automation adoption
        is the technical expertise required to implement and maintain automated
        workflows. Traditional automation solutions typically demand programming
        knowledge, creating a substantial barrier for business users who
        understand their processes intimately but lack the coding skills to
        automate them.
      </Text>
      <Text style={styles.paragraph}>
        This technical barrier manifests in several ways:
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Programming Requirements:</Text> Many
          automation platforms require users to write code in languages such as
          Python, JavaScript, or proprietary scripting languages. Even
          "low-code" solutions often require understanding of programming
          concepts like variables, conditionals, and loops.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• API Comprehension:</Text> Integrating with
          external services requires understanding REST APIs, authentication
          mechanisms (OAuth, API keys), request/response formats (JSON, XML),
          and error handling—concepts unfamiliar to most non-technical users.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Debugging Complexity:</Text> When
          automations fail, diagnosing the root cause often requires technical
          analysis of logs, stack traces, and system behavior that business
          users are ill-equipped to perform.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Dependency on IT Teams:</Text>{" "}
          Organizations frequently rely on IT departments or external developers
          to create and maintain automations, creating bottlenecks and
          increasing costs. IT teams, already stretched thin managing critical
          infrastructure, may deprioritize automation requests.
        </Text>
      </View>
      <Text style={styles.paragraphIndent}>
        The consequence of this technical barrier is a significant automation
        gap: the people who best understand the processes that need automation
        are often unable to implement the solutions themselves, while those with
        the technical skills to automate may lack the domain knowledge to design
        effective workflows.
      </Text>

      {/* 2.2.3 Integration Complexity */}
      <Text style={styles.h3}>2.2.3 Integration Complexity</Text>
      <Text style={styles.paragraphIndent}>
        Modern businesses typically utilize a diverse ecosystem of software
        applications and services. The average mid-sized company uses over 120
        SaaS applications, each designed to solve specific business problems.
        While this software diversity enables specialized functionality, it
        creates significant challenges when these systems need to work together.
      </Text>
      <Text style={styles.paragraph}>
        Integration complexity arises from several factors:
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Diverse API Standards:</Text> Different
          services implement their APIs using various standards, authentication
          methods, data formats, and conventions. What works for one API may not
          work for another, requiring unique integration code for each service.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Authentication Challenges:</Text> Services
          use different authentication mechanisms including API keys, OAuth 2.0,
          JWT tokens, and basic authentication. Managing credentials securely
          across multiple integrations adds complexity.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Data Transformation Requirements:</Text>{" "}
          Data from one system often needs to be transformed before it can be
          used by another. This includes format conversion, field mapping, data
          validation, and handling missing or null values.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Rate Limiting and Quotas:</Text> Most APIs
          impose rate limits and usage quotas that integrations must respect.
          Building systems that gracefully handle these constraints without
          losing data requires sophisticated retry logic.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Version Management:</Text> APIs evolve
          over time, and integrations must adapt to breaking changes, deprecated
          endpoints, and new functionality while maintaining backward
          compatibility.
        </Text>
      </View>
      <Text style={styles.paragraphIndent}>
        Building custom integrations between systems is expensive and
        time-consuming. A single point-to-point integration can take weeks or
        months to develop, test, and deploy. With dozens or hundreds of
        potential integration points, organizations face an exponentially
        growing integration challenge that traditional approaches cannot address
        cost-effectively.
      </Text>

      {/* 2.2.4 Reliability and Monitoring Concerns */}
      <Text style={styles.h3}>2.2.4 Reliability and Monitoring Concerns</Text>
      <Text style={styles.paragraphIndent}>
        For automation to deliver its promised benefits, workflows must execute
        reliably and provide visibility into their operation. However, ensuring
        reliability in distributed automation systems presents significant
        challenges that many existing solutions fail to address adequately.
      </Text>
      <Text style={styles.paragraph}>Key reliability concerns include:</Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Transient Failures:</Text> Network
          timeouts, temporary service outages, and rate limiting can cause
          workflow steps to fail even when the underlying logic is correct.
          Systems must handle these failures gracefully without losing work or
          creating inconsistent states.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• State Management:</Text> Long-running
          workflows may span hours or days, requiring the system to maintain
          state across execution steps. If the automation platform experiences
          downtime, it must be able to resume workflows from where they left
          off.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Error Visibility:</Text> When failures
          occur, users need clear, actionable information about what went wrong
          and how to fix it. Cryptic error messages or missing context make
          troubleshooting difficult and time-consuming.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Execution Monitoring:</Text> Operators
          need real-time visibility into workflow execution status, including
          which steps are running, which have completed, and which have failed.
          Historical execution data enables performance analysis and
          optimization.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>• Audit Requirements:</Text> For compliance
          and security purposes, organizations often need detailed audit trails
          showing who created or modified workflows, when executions occurred,
          and what data was processed.
        </Text>
      </View>

      {/* 2.3 Market Demand & Industry Trends */}
      <Text style={styles.h2}>2.3 Market Demand & Industry Trends</Text>
      <Text style={styles.paragraphIndent}>
        The global workflow automation market has been experiencing significant
        growth, driven by the increasing need for operational efficiency and
        digital transformation across industries. According to Grand View
        Research, the workflow automation market was valued at approximately USD
        9.4 billion in 2022 and is projected to reach USD 46.2 billion by 2030,
        growing at a compound annual growth rate (CAGR) of 22.4%.
      </Text>
      <Text style={styles.paragraphIndent}>
        Several key trends are accelerating this growth: the rise of citizen
        development (enabling non-technical users to build automations), the
        convergence of AI/ML with automation platforms, the shift toward
        cloud-native and API-first architectures, and increasing demand for
        low-code/no-code solutions. Gartner predicts that by 2026, 80% of
        organizations will have adopted hyperautomation as a strategic
        initiative, up from 20% in 2022.
      </Text>
      <Text style={styles.paragraphIndent}>
        The proliferation of SaaS applications within enterprises (an average of
        130+ per mid-size company) has created an urgent need for integration
        and automation tools. Additionally, the shortage of professional
        developers has driven demand for platforms that empower business users
        to create their own automations without coding expertise.
      </Text>

      <View style={{ marginTop: 16, marginBottom: 8 }}>
        <MarketGrowthChart />
        <Text
          style={{
            fontSize: 9,
            fontFamily: "Times-Italic",
            textAlign: "center",
            marginTop: 4,
            marginBottom: 12,
          }}
        >
          Figure 2.1: Workflow Automation Market Growth Projection (2022-2030)
        </Text>
      </View>

      {/* 2.4 Analysis of Existing Solutions */}
      <Text style={styles.h2}>2.4 Analysis of Existing Solutions</Text>
      <Text style={styles.paragraphIndent}>
        The workflow automation market has seen significant growth in recent
        years, with numerous platforms attempting to address the challenges
        outlined above. This section provides a comprehensive analysis of
        leading solutions, examining their strengths and limitations to
        establish the context for Flowgent's development.
      </Text>

      {/* 2.4.1 Zapier */}
      <Text style={styles.h3}>2.4.1 Zapier</Text>
      <Text style={styles.paragraphIndent}>
        Zapier is the market leader in consumer-focused workflow automation,
        offering connections to over 6,000 applications through a web-based
        interface. Founded in 2011, Zapier pioneered the "trigger-action"
        paradigm that has become the standard for no-code automation.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Strengths:</Text>
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Extensive library of pre-built integrations with popular SaaS
          applications
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • User-friendly interface accessible to non-technical users
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Reliable cloud-hosted infrastructure with strong uptime
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Good documentation and customer support
        </Text>
      </View>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Limitations:</Text>
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Linear workflow model limits complex automation scenarios
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • No self-hosting option raises data privacy concerns
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Expensive at scale with task-based pricing model
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Limited AI capabilities without third-party integrations
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Team features reserved for expensive enterprise plans
        </Text>
      </View>

      {/* 2.4.2 n8n */}
      <Text style={styles.h3}>2.4.2 n8n</Text>
      <Text style={styles.paragraphIndent}>
        n8n (pronounced "nodemation") is an open-source workflow automation
        platform that offers both self-hosted and cloud-hosted deployment
        options. It provides a visual node-based editor and emphasizes
        extensibility through custom nodes.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Strengths:</Text>
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Open-source with self-hosting capability for data sovereignty
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Visual node-based editor with good flexibility
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Active community developing custom integrations
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Lower cost than proprietary alternatives
        </Text>
      </View>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Limitations:</Text>
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Steeper learning curve than consumer-focused alternatives
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Self-hosting requires technical expertise for deployment and
          maintenance
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • UI can feel complex for simple automation tasks
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • AI capabilities require plugin installation and configuration
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Enterprise features (SSO, RBAC) require paid license
        </Text>
      </View>

      {/* 2.4.3 Make (Integromat) */}
      <Text style={styles.h3}>2.4.3 Make (formerly Integromat)</Text>
      <Text style={styles.paragraphIndent}>
        Make, formerly known as Integromat, offers a visual automation platform
        with sophisticated data mapping and transformation capabilities. It
        positions itself between the simplicity of Zapier and the power of n8n.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Strengths:</Text>
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Powerful visual scenario builder with branching logic
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Advanced data transformation and mapping tools
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Good balance of power and usability
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Competitive pricing for moderate usage
        </Text>
      </View>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Limitations:</Text>
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Cloud-only with no self-hosting option
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Complex interface can overwhelm new users
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Limited AI integration capabilities
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Operation-based pricing can become expensive
        </Text>
      </View>

      {/* 2.4.4 Microsoft Power Automate */}
      <Text style={styles.h3}>2.4.4 Microsoft Power Automate</Text>
      <Text style={styles.paragraphIndent}>
        Microsoft Power Automate (formerly Microsoft Flow) is an enterprise
        workflow automation platform deeply integrated with the Microsoft 365
        ecosystem. It offers both cloud flows and desktop automation through
        robotic process automation (RPA).
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Strengths:</Text>
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Deep integration with Microsoft services (Office 365, Dynamics,
          Azure)
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Enterprise-grade security and compliance features
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Desktop automation (RPA) capabilities
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • AI Builder for intelligent document processing
        </Text>
      </View>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Limitations:</Text>
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 8 }}>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Best suited for Microsoft-centric environments
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Complex licensing model tied to Microsoft 365
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Limited flexibility compared to open-source alternatives
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • Can be overwhelming for simple automation needs
        </Text>
      </View>

      {/* 2.5 Comparative Analysis */}
      <Text style={styles.h2}>2.5 Comparative Analysis</Text>
      <Text style={styles.paragraphIndent}>
        The following table provides a comprehensive comparison of existing
        workflow automation solutions across key evaluation criteria. This
        analysis informed the feature prioritization and design decisions for
        the Flowgent platform.
      </Text>

      {/* Comparison Table */}
      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        {/* Header */}
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
              width: "16%",
              padding: 6,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Zapier
          </Text>
          <Text
            style={{
              width: "16%",
              padding: 6,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            n8n
          </Text>
          <Text
            style={{
              width: "16%",
              padding: 6,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Make
          </Text>
          <Text
            style={{
              width: "16%",
              padding: 6,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Power Auto
          </Text>
          <Text
            style={{
              width: "16%",
              padding: 6,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Flowgent
          </Text>
        </View>
        {/* Rows */}
        {[
          [
            "Visual Editor",
            "Basic",
            "Advanced",
            "Advanced",
            "Moderate",
            "Advanced",
          ],
          ["Self-Hosted", "No", "Yes", "No", "No", "Yes"],
          ["Open Source", "No", "Yes", "No", "No", "No"],
          [
            "Native AI",
            "Limited",
            "Plugins",
            "Limited",
            "AI Builder",
            "Built-in",
          ],
          [
            "Team RBAC",
            "Enterprise",
            "Enterprise",
            "Enterprise",
            "Yes",
            "Built-in",
          ],
          ["Branching Logic", "Limited", "Yes", "Yes", "Yes", "Yes"],
          ["Error Handling", "Basic", "Good", "Good", "Good", "Advanced"],
          [
            "Execution Logs",
            "7 days",
            "Unlimited",
            "30 days",
            "28 days",
            "Unlimited",
          ],
          ["Webhook Support", "Yes", "Yes", "Yes", "Yes", "Yes"],
          ["Schedule Triggers", "Yes", "Yes", "Yes", "Yes", "Yes"],
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
                width: "16%",
                padding: 5,
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
                width: "16%",
                padding: 5,
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
                width: "16%",
                padding: 5,
                fontSize: 8,
                textAlign: "center",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[3]}
            </Text>
            <Text
              style={{
                width: "16%",
                padding: 5,
                fontSize: 8,
                textAlign: "center",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[4]}
            </Text>
            <Text
              style={{
                width: "16%",
                padding: 5,
                fontSize: 8,
                textAlign: "center",
                fontFamily: "Times-Bold",
              }}
            >
              {row[5]}
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
        Table 2.1: Comprehensive Feature Comparison of Workflow Automation
        Platforms
      </Text>

      <Text style={styles.h3}>2.5.1 Detailed Comparison: Flowgent vs n8n</Text>
      <Text style={styles.paragraphIndent}>
        Since n8n is the closest competitor to Flowgent in terms of self-hosting
        capability and visual editor approach, a detailed feature-by-feature
        comparison is presented below.
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
            Feature
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
            n8n
          </Text>
          <Text
            style={{
              width: "35%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Flowgent
          </Text>
        </View>
        {[
          [
            "Technology Stack",
            "Vue.js, TypeScript, SQLite/Postgres",
            "Next.js 16, React 19, TypeScript, PostgreSQL",
          ],
          ["API Architecture", "REST API", "tRPC (end-to-end type safety)"],
          [
            "Execution Engine",
            "Built-in, in-process",
            "Inngest (durable, serverless, auto-retry)",
          ],
          [
            "Authentication",
            "Community Edition: basic\nEnterprise: SSO",
            "Better Auth (OAuth, MFA, session mgmt)",
          ],
          [
            "AI Integration",
            "Requires LangChain plugin install",
            "Native multi-provider (OpenAI, Anthropic, Google)",
          ],
          [
            "Team Collaboration",
            "Enterprise plan only",
            "Built-in RBAC (Owner/Admin/Member)",
          ],
          [
            "Visual Editor",
            "Proprietary canvas",
            "React Flow (MIT, extensible)",
          ],
          ["State Management", "Vuex/Pinia", "Zustand (minimal boilerplate)"],
          [
            "Node Types",
            "400+ (community)",
            "24 core (curated, production-ready)",
          ],
          ["Credential Storage", "AES-256 encryption", "AES-256 encryption"],
          ["Scheduling", "Cron-based", "Cron + natural language parsing"],
          [
            "Workflow Versioning",
            "Enterprise only",
            "Built-in version history",
          ],
          ["Deployment", "Docker, npm, cloud", "Netlify serverless, Docker"],
          [
            "Monitoring",
            "Built-in execution log",
            "Sentry + built-in audit logging",
          ],
          [
            "Licensing",
            "Sustainable Use License (v1.x)",
            "Proprietary (SaaS planned)",
          ],
          [
            "Learning Curve",
            "Steep (complex UI)",
            "Moderate (guided onboarding)",
          ],
        ].map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              borderBottomWidth: i < 15 ? 1 : 0,
              borderBottomColor: "#cccccc",
            }}
          >
            <Text
              style={{
                width: "30%",
                padding: 4,
                fontSize: 7.5,
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
                padding: 4,
                fontSize: 7.5,
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[1]}
            </Text>
            <Text
              style={{
                width: "35%",
                padding: 4,
                fontSize: 7.5,
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
        Table 2.2: Detailed Feature Comparison — Flowgent vs n8n
      </Text>

      <View
        wrap={false}
        style={{ alignItems: "center", marginTop: 8, marginBottom: 8 }}
      >
        <ComparisonRadar />
      </View>
      <Text
        style={{
          fontSize: 9,
          fontFamily: "Times-Italic",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Figure 2.2: Feature Comparison Radar — Flowgent vs n8n
      </Text>

      {/* 2.6 Gap Analysis */}
      <Text style={styles.h2}>2.6 Gap Analysis</Text>
      <Text style={styles.paragraphIndent}>
        Based on the comparative analysis of existing solutions, several
        significant gaps in the current market offerings have been identified.
        These gaps represent opportunities for improvement that the Flowgent
        platform aims to address.
      </Text>

      <Text style={styles.h3}>2.6.1 Accessibility Gap</Text>
      <Text style={styles.paragraphIndent}>
        While platforms like Zapier offer user-friendly interfaces, they
        sacrifice power and flexibility. Conversely, powerful platforms like n8n
        require technical expertise. There is a clear need for a platform that
        combines the accessibility of consumer tools with the capabilities of
        developer-focused solutions.
      </Text>

      <Text style={styles.h3}>2.6.2 AI Integration Gap</Text>
      <Text style={styles.paragraphIndent}>
        The rapid advancement of AI technologies, particularly large language
        models, has created new possibilities for intelligent automation.
        However, existing platforms offer only limited AI capabilities,
        typically through basic integrations rather than native, deeply
        integrated features. Users increasingly want to leverage AI for content
        generation, data analysis, decision-making, and natural language
        processing within their workflows.
      </Text>

      <Text style={styles.h3}>2.6.3 Deployment Flexibility Gap</Text>
      <Text style={styles.paragraphIndent}>
        Organizations with strict data governance requirements need the ability
        to self-host their automation infrastructure. While n8n offers this
        capability, it comes with significant complexity. There is demand for a
        solution that offers easy deployment on modern cloud platforms like
        Netlify while maintaining data sovereignty.
      </Text>

      <Text style={styles.h3}>2.6.4 Team Collaboration Gap</Text>
      <Text style={styles.paragraphIndent}>
        Modern workflows are rarely created or managed by individuals working in
        isolation. Teams need to collaborate on workflow design, share
        credentials securely, and manage access permissions. While enterprise
        tiers of existing platforms offer role-based access control, these
        features are often priced beyond the reach of small and medium
        businesses.
      </Text>

      <Text style={styles.h3}>2.6.5 Reliability and Observability Gap</Text>
      <Text style={styles.paragraphIndent}>
        Many automation platforms treat reliability as an afterthought,
        providing minimal retry logic and limited visibility into execution
        status. For business-critical workflows, organizations need guaranteed
        execution with automatic retry, dead-letter queues for failed messages,
        and comprehensive logging for debugging and compliance.
      </Text>

      {/* 2.7 Proposed Solution Overview */}
      <Text style={styles.h2}>2.7 Proposed Solution Overview</Text>
      <Text style={styles.paragraphIndent}>
        To address the identified problems and gaps in existing solutions, this
        project proposes the development of Flowgent—a next-generation visual
        workflow automation platform designed from the ground up to be
        accessible, powerful, and reliable.
      </Text>

      <Text style={styles.h3}>2.7.1 Core Principles</Text>
      <Text style={styles.paragraphIndent}>
        Flowgent is built on four foundational principles that guide all design
        and implementation decisions:
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>1. Visual-First Design:</Text> Every feature
          is designed with visual representation as the primary interface. Users
          should be able to understand, create, and modify workflows through
          intuitive drag-and-drop interactions without writing code.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>2. Reliability by Default:</Text> Workflows
          should execute reliably without users needing to implement complex
          error handling. The platform handles retries, state persistence, and
          failure recovery automatically.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>3. AI-Native Architecture:</Text> Rather
          than treating AI as an add-on, Flowgent integrates AI capabilities as
          first-class citizens. Users can leverage multiple AI providers
          (OpenAI, Anthropic, Google) through consistent, easy-to-use nodes.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.5 }}>
          <Text style={styles.bold}>4. Self-Hosted and Extensible:</Text>
          Flowgent supports self-hosted deployment, allowing organizations to
          run on their own infrastructure with full data sovereignty. The
          modular architecture enables customization and future feature
          expansion.
        </Text>
      </View>

      <Text style={styles.h3}>2.7.2 Technical Approach</Text>
      <Text style={styles.paragraphIndent}>
        Flowgent leverages modern web technologies and architectural patterns to
        deliver a robust, scalable platform:
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • <Text style={styles.bold}>Frontend:</Text> Next.js 16 with React 19
          provides a responsive, performant user experience with server-side
          rendering for fast initial loads.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • <Text style={styles.bold}>Visual Editor:</Text> React Flow powers
          the node-based visual editor with smooth interactions, zooming, and
          connection management.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • <Text style={styles.bold}>Backend:</Text> tRPC enables end-to-end
          type safety between client and server, eliminating a class of bugs and
          improving developer productivity.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • <Text style={styles.bold}>Database:</Text> PostgreSQL with Prisma
          ORM provides reliable data storage with migrations and type-safe
          queries.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • <Text style={styles.bold}>Execution Engine:</Text> Inngest provides
          durable function execution with built-in retry, rate limiting, and
          observability—the backbone of reliable workflow execution.
        </Text>
        <Text style={{ fontSize: 11, marginBottom: 4 }}>
          • <Text style={styles.bold}>Authentication:</Text> Better Auth with
          OAuth support enables secure user authentication with Google, GitHub,
          and email/password options.
        </Text>
      </View>

      {/* 2.8 Justification for New Development */}
      <Text style={styles.h2}>2.8 Justification for New Development</Text>
      <Text style={styles.paragraphIndent}>
        Given the existence of multiple workflow automation platforms in the
        market, it is essential to justify the development of a new solution.
        The following factors support the decision to create Flowgent rather
        than adopt or extend an existing platform:
      </Text>

      <Text style={styles.h3}>2.8.1 Unique Value Proposition</Text>
      <Text style={styles.paragraphIndent}>
        No existing solution combines all the following characteristics:
        affordable pricing, modern technology stack, native AI integration,
        self-hosting capability, and team collaboration features accessible to
        small businesses. Flowgent aims to be the first platform to offer this
        complete package.
      </Text>

      <Text style={styles.h3}>2.8.2 Modern Technology Foundation</Text>
      <Text style={styles.paragraphIndent}>
        Many existing platforms were architected years ago and carry technical
        debt that limits their ability to adopt modern best practices. By
        building on the latest technologies (Next.js 16, React 19, Inngest),
        Flowgent benefits from improved performance, developer experience, and
        maintainability.
      </Text>

      <Text style={styles.h3}>2.8.3 Academic and Learning Objectives</Text>
      <Text style={styles.paragraphIndent}>
        As an academic project, Flowgent provides an opportunity to apply
        software engineering principles, explore modern web development
        practices, and gain hands-on experience with production-grade
        technologies. The project scope allows for comprehensive coverage of the
        software development lifecycle.
      </Text>

      <Text style={styles.h3}>2.8.4 Community Contribution</Text>
      <Text style={styles.paragraphIndent}>
        Flowgent is developed as an academic project with a long-term vision of
        evolving into a commercially viable SaaS product. While the current
        version serves as a proof-of-concept built during the BCA programme, the
        architecture and technology stack have been deliberately chosen to
        support future scalability and monetization. Organizations seeking
        modern workflow automation solutions would benefit from a platform built
        on contemporary, production-grade technologies that can be deployed and
        scaled as a startup offering.
      </Text>

      {/* 2.9 Summary */}
      <Text style={styles.h2}>2.9 Summary</Text>
      <Text style={styles.paragraphIndent}>
        This chapter has established the context and motivation for the Flowgent
        workflow automation platform. Modern organizations face significant
        challenges in automating their business processes, including manual
        process overhead, technical barriers, integration complexity, and
        reliability concerns.
      </Text>
      <Text style={styles.paragraphIndent}>
        Analysis of existing solutions reveals that while capable platforms
        exist, none fully addresses the combination of accessibility, power, AI
        integration, and deployment flexibility that organizations increasingly
        demand. The identified gaps—in accessibility, AI integration, deployment
        options, team collaboration, and reliability—represent the opportunities
        that Flowgent aims to address.
      </Text>
      <Text style={styles.paragraphIndent}>
        The proposed solution applies modern technologies and architectural
        patterns to create a platform that is visually intuitive, inherently
        reliable, AI-native, and open for customization. The following chapters
        will detail the project objectives, system architecture, implementation
        approach, and validation of the developed platform.
      </Text>
    </BookPageLayout>
  );
}
