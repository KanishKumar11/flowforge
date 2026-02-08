"use client";

import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import BookPageLayout from "../components/BookPageLayout";
import SystemArchitecture from "../diagrams/SystemArchitecture";
import ProjectStructure from "../diagrams/ProjectStructure";

/**
 * Chapter 1: Introduction
 * Content automatically wraps across pages via BookPageLayout.
 */
export default function Introduction() {
  return (
    <BookPageLayout chapterTitle="Introduction" chapterNum="01">
      {/* Chapter Title Block */}
      <View style={{ marginBottom: 28, alignItems: "center", marginTop: 20 }}>
        <Text
          style={{
            fontSize: 11,
            fontFamily: "Times-Roman",
            color: "#666666",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Chapter 01
        </Text>
        <Text
          style={{
            fontSize: 26,
            fontFamily: "Times-Bold",
            textAlign: "center",
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "#000000",
          }}
        >
          Introduction
        </Text>
        <View
          style={{
            width: 60,
            height: 2,
            backgroundColor: "#000000",
            marginTop: 12,
          }}
        />
      </View>

      <Text style={styles.h2}>1.1 Project Overview</Text>
      <Text style={styles.paragraphIndent}>
        In the contemporary digital landscape, the agility with which an
        organization can adapt its operational workflows is a definitive factor
        in its success. As businesses increasingly rely on a diverse array of
        digital tools—from Customer Relationship Management (CRM) systems and
        marketing platforms to cloud databases and communication channels—the
        complexity of managing data flow between these disparate systems has
        grown exponentially.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Flowgent 1.0</Text> is a state-of-the-art,
        visual workflow automation platform designed to address this challenge.
        It provides a bridge between technical capability and operational
        necessity, allowing users to orchestrate complex business logic through
        an intuitive, drag-and-drop interface. By abstracting the intricacies of
        API integrations, data transformation, and conditional logic into visual
        "nodes," Flowgent democratizes automation.
      </Text>
      <Text style={styles.paragraph}>
        The platform empowers product managers, marketing teams, and operations
        specialists to build, test, and deploy sophisticated workflows without
        writing a single line of code, while still offering the extensibility
        required by developers. Built on a modern stack comprising{" "}
        <Text style={styles.bold}>Next.js 16, React Flow, and Inngest</Text>,
        the platform features a robust, durable execution engine.
      </Text>

      <Text style={styles.h2}>1.2 Background</Text>
      <Text style={styles.h3}>1.2.1 The Digital Transformation Era</Text>
      <Text style={styles.paragraphIndent}>
        The last decade has witnessed a massive shift towards digital
        transformation. Organizations of all sizes have moved their operations
        to the cloud, adopting Software-as-a-Service (SaaS) solutions for
        virtually every business function. While this digitization has improved
        capabilities, it has also led to "SaaS Sprawl"—a phenomenon where
        critical business data is fragmented across dozens of unconnected
        applications.
      </Text>

      <Text style={styles.paragraph}>
        For instance, a simple process like "Onboarding a New Client" might
        involve creating a record in Salesforce, sending a welcome email via
        SendGrid, setting up a project workspace in Trello or Jira, and creating
        a shared folder in Google Drive. Performing these steps manually is
        time-consuming, prone to human error, and unscalable.
      </Text>

      <Text style={styles.h3}>1.2.2 The Integration Gap</Text>
      <Text style={styles.paragraphIndent}>
        To solve this fragmentation, the industry has traditionally relied on
        two approaches: point-to-point custom integrations written by
        developers, or rigid, linear automation tools. Custom integrations are
        expensive to build and maintain, often becoming "technical debt" as APIs
        change. Legacy automation tools, on the other hand, often lack the
        flexibility to handle complex branching logic, loops, or
        human-in-the-loop interactions.
      </Text>
      <Text style={styles.paragraph}>
        This creates an "Integration Gap": a situation where the business need
        for automation vastly outstrips the technical capacity to implement it.
        Flowgent aims to close this gap by providing a platform that is
        practically as easy to use as consumer tools but theoretically as
        powerful as custom code.
      </Text>

      <Text style={styles.h2}>1.3 Problem Statement</Text>
      <Text style={styles.paragraphIndent}>
        Despite the availability of automation tools, several critical problems
        persist in the current landscape:
      </Text>

      <Text style={styles.h3}>1. High Technical Barrier</Text>
      <Text style={styles.paragraph}>
        Traditional orchestration platforms (like Airflow or Temporal) are
        code-first, requiring significant expertise in Python, Go, or Java. This
        excludes non-technical subject matter experts from the automation
        process, creating a bottleneck where every workflow change requires
        engineering time.
      </Text>

      <Text style={styles.h3}>2. Operational Fragility</Text>
      <Text style={styles.paragraph}>
        Simplistic automation tools often fail silently. If an API is
        temporarily down or a rate limit is hit, the workflow fails, and data is
        lost. Building "durable" execution—where steps are retried automatically
        and state is preserved across crashes—is mathematically complex and
        difficult to implement from scratch.
      </Text>

      <Text style={styles.h3}>3. Cost and Lock-in</Text>
      <Text style={styles.paragraph}>
        Enterprise Integration Platforms as a Service (iPaaS) like MuleSoft or
        Boomi involve exorbitant licensing fees and multi-year contracts.
        Conversely, entry-level tools often become prohibitively expensive as
        usage scales (e.g., paying per "operation"), punishing success.
      </Text>

      <Text style={styles.h3}>4. Lack of Developer Experience</Text>
      <Text style={styles.paragraph}>
        Many no-code tools are "black boxes." If a user needs a specific data
        transformation that isn't pre-built, they are stuck. There is a lack of
        platforms that offer a "low-code" escape hatch, allowing developers to
        inject custom JavaScript or TypeScript where needed.
      </Text>

      <Text style={styles.h2}>1.4 Motivation</Text>
      <Text style={styles.paragraphIndent}>
        The motivation behind developing Flowgent 1.0 is rooted in the
        philosophy of{" "}
        <Text style={styles.bold}>"Software Democratization."</Text> We believe
        that the ability to automate work should not be a privilege reserved for
        software engineers.
      </Text>
      <Text style={styles.paragraph}>
        By building a visual layer on top of a durable execution engine, we aim
        to encourage a new class of "Citizen Developers"—operational experts who
        can build their own tools. Furthermore, the decision to build this as a
        modern web application using React 19 and Next.js 16 was driven by a
        desire to push the boundaries of what is possible in a browser-based
        IDE.
      </Text>
      <Text style={styles.paragraph}>
        Additionally, with the rise of Generative AI, there is a unique
        opportunity to integrate Large Language Models (LLMs) directly into the
        automation flow, allowing workflows to not just move data, but to
        "think" about it—summarizing text, categorizing support tickets, or
        generating diverse content.
      </Text>

      <Text style={styles.h2}>1.5 Project Objectives</Text>
      <Text style={styles.paragraph}>
        The primary and secondary objectives of this project are outlined below:
      </Text>

      <Text style={styles.h3}>1.5.1 Primary Objectives</Text>
      <View style={{ paddingLeft: 12, marginBottom: 12 }}>
        <View style={{ flexDirection: "row", marginBottom: 6 }}>
          <Text style={{ fontSize: 14, marginRight: 8, marginTop: -3 }}>•</Text>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Times-Roman",
              lineHeight: 1.5,
              flex: 1,
            }}
          >
            <Text style={styles.bold}>Visual Orchestration:</Text> A React
            Flow-powered canvas supporting drag-and-drop node placement, dynamic
            edge connections, and real-time validation of workflow logic.
          </Text>
        </View>
        <View style={{ flexDirection: "row", marginBottom: 6 }}>
          <Text style={{ fontSize: 14, marginRight: 8, marginTop: -3 }}>•</Text>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Times-Roman",
              lineHeight: 1.5,
              flex: 1,
            }}
          >
            <Text style={styles.bold}>Durable Execution:</Text> A backend engine
            built on Inngest that guarantees exactly-once execution, handles
            race conditions, and manages state persistence across long-running
            workflows.
          </Text>
        </View>
        <View style={{ flexDirection: "row", marginBottom: 6 }}>
          <Text style={{ fontSize: 14, marginRight: 8, marginTop: -3 }}>•</Text>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Times-Roman",
              lineHeight: 1.5,
              flex: 1,
            }}
          >
            <Text style={styles.bold}>Extensible Node Library:</Text> A growing
            catalog of reusable nodes covering common use cases: HTTP requests,
            Webhooks, Data Parsing, and AI inference.
          </Text>
        </View>
      </View>

      <Text style={styles.h3}>1.5.2 Secondary Objectives</Text>
      <View style={{ paddingLeft: 12, marginBottom: 12 }}>
        <View style={{ flexDirection: "row", marginBottom: 6 }}>
          <Text style={{ fontSize: 14, marginRight: 8, marginTop: -3 }}>•</Text>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Times-Roman",
              lineHeight: 1.5,
              flex: 1,
            }}
          >
            <Text style={styles.bold}>Security & Access:</Text> Enterprise-grade
            features including Role-Based Access Control (RBAC) with 4 role
            levels, encrypted credential storage using AES-256.
          </Text>
        </View>
        <View style={{ flexDirection: "row", marginBottom: 6 }}>
          <Text style={{ fontSize: 14, marginRight: 8, marginTop: -3 }}>•</Text>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Times-Roman",
              lineHeight: 1.5,
              flex: 1,
            }}
          >
            <Text style={styles.bold}>AI Integration:</Text> Native nodes for
            interacting with Large Language Models (OpenAI GPT-4, Anthropic
            Claude, Google Gemini) for intelligent data processing.
          </Text>
        </View>
        <View style={{ flexDirection: "row", marginBottom: 6 }}>
          <Text style={{ fontSize: 14, marginRight: 8, marginTop: -3 }}>•</Text>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Times-Roman",
              lineHeight: 1.5,
              flex: 1,
            }}
          >
            <Text style={styles.bold}>Real-time Monitoring:</Text> Detailed
            execution logs, status updates, and analytics for every step of a
            running workflow.
          </Text>
        </View>
      </View>

      <Text style={styles.h2}>1.6 Proposed Solution</Text>
      <Text style={styles.paragraphIndent}>
        Flowgent 1.0 architecture follows an Event-Driven design pattern. The
        solution consists of three main components:
      </Text>

      <Text style={styles.h3}>1. The Visual Frontend (React Flow)</Text>
      <Text style={styles.paragraph}>
        A client-side Single Page Application (SPA) where the workflow state is
        managed using React 19 with Next.js 16 App Router. It serializes the
        visual graph (nodes and edges) into a JSON structure that represents the
        "definition" of the automated process. The editor provides real-time
        validation, auto-save functionality, and collaborative editing support.
      </Text>

      <Text style={styles.h3}>2. The Orchestration Layer (Inngest)</Text>
      <Text style={styles.paragraph}>
        Unlike traditional cron jobs, Flowgent utilizes a specialized
        orchestration queue. When a workflow is triggered, an event is pushed to
        this queue. The Inngest engine then "plays" the workflow definition,
        executing step 1, waiting for the result, then executing step 2, and so
        on. This decoupling allows for massive scalability and ensures durable
        execution with automatic retries.
      </Text>

      <Text style={styles.h3}>3. The Integration Layer</Text>
      <Text style={styles.paragraph}>
        A collection of server-side functions that perform the actual work
        (e.g., calling the OpenAI API, querying a PostgreSQL database, sending
        Slack messages). These functions are stateless and idempotent where
        possible, ensuring reliability and predictability.
      </Text>

      <View style={{ marginTop: 16, marginBottom: 8 }}>
        <SystemArchitecture />
        <Text
          style={{
            fontSize: 9,
            fontFamily: "Times-Italic",
            textAlign: "center",
            marginTop: 4,
            marginBottom: 12,
          }}
        >
          Figure 1.1: System Architecture Overview
        </Text>
      </View>

      <Text style={styles.h2} break>
        1.7 Technology Stack
      </Text>
      <Text style={styles.paragraphIndent}>
        Flowgent is built using industry-standard technologies, ensuring
        reliability, community support, and minimal licensing costs during
        development. The following table details each technology, its role, and
        its license.
      </Text>
      <View style={{ borderWidth: 1, borderColor: "#333333", marginTop: 12 }}>
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
              width: "18%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Layer
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
            Technology
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
            Purpose
          </Text>
          <Text
            style={{
              width: "17%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            License
          </Text>
        </View>
        {[
          ["Frontend", "React 19", "Component-based UI library by Meta", "MIT"],
          [
            "Framework",
            "Next.js 16",
            "Full-stack React framework with SSR/SSG",
            "MIT",
          ],
          [
            "Visual Editor",
            "React Flow",
            "Interactive node-based graph editor",
            "MIT",
          ],
          ["Styling", "Tailwind CSS v4", "Utility-first CSS framework", "MIT"],
          [
            "UI Components",
            "shadcn/ui",
            "Accessible component library (Radix)",
            "MIT",
          ],
          ["API Layer", "tRPC", "End-to-end type-safe RPC APIs", "MIT"],
          [
            "Database",
            "PostgreSQL 16",
            "Advanced open-source relational DB",
            "PostgreSQL",
          ],
          [
            "ORM",
            "Prisma",
            "Type-safe database client & migrations",
            "Apache 2.0",
          ],
          [
            "Execution",
            "Inngest",
            "Durable serverless workflow engine",
            "Apache 2.0",
          ],
          [
            "Authentication",
            "Better Auth",
            "OAuth 2.0 authentication library",
            "MIT",
          ],
          [
            "Language",
            "TypeScript 5",
            "Typed JavaScript superset",
            "Apache 2.0",
          ],
          [
            "State Mgmt",
            "Zustand",
            "Lightweight React state management",
            "MIT",
          ],
          ["Validation", "Zod", "TypeScript-first schema validation", "MIT"],
          [
            "Email",
            "Resend + React Email",
            "Transactional email delivery",
            "MIT",
          ],
          [
            "Monitoring",
            "Sentry",
            "Error tracking & performance monitoring",
            "MIT (SDK)",
          ],
        ].map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              borderBottomWidth: i < 14 ? 1 : 0,
              borderBottomColor: "#cccccc",
            }}
          >
            <Text
              style={{
                width: "18%",
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
                width: "40%",
                padding: 4,
                fontSize: 8,
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[2]}
            </Text>
            <Text style={{ width: "17%", padding: 4, fontSize: 8 }}>
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
          marginTop: 4,
        }}
      >
        Table 1.1: Technology Stack
      </Text>

      <View style={{ marginTop: 16, marginBottom: 8 }}>
        <ProjectStructure />
        <Text
          style={{
            fontSize: 9,
            fontFamily: "Times-Italic",
            textAlign: "center",
            marginTop: 4,
            marginBottom: 12,
          }}
        >
          Figure 1.2: Project Module Structure
        </Text>
      </View>

      <Text style={styles.h2}>1.8 Technology Justification</Text>
      <Text style={styles.paragraphIndent}>
        Each technology in the Flowgent stack was selected after evaluating
        alternatives based on type safety, developer experience, community
        support, and architectural fit. The following table presents the
        justification for each choice.
      </Text>

      <View
        style={{ borderWidth: 1, borderColor: "#333333", marginTop: 12 }}
        break
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
            Technology
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
            Alternatives Considered
          </Text>
          <Text
            style={{
              width: "55%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Reason for Selection
          </Text>
        </View>
        {[
          [
            "Next.js 16",
            "Create React App, Vite, Remix",
            "Built-in SSR/SSG, API routes, middleware support, and file-based routing eliminate the need for a separate backend server. Turbopack provides fast HMR during development.",
          ],
          [
            "React 19",
            "Vue.js, Angular, Svelte",
            "Largest ecosystem, extensive component libraries (shadcn/ui, React Flow), server components for reduced client bundle, and strong TypeScript support.",
          ],
          [
            "TypeScript 5",
            "JavaScript, Flow",
            "Compile-time type checking catches errors before runtime, enhances IDE autocomplete, and enables end-to-end type safety with tRPC and Prisma.",
          ],
          [
            "tRPC",
            "REST, GraphQL (Apollo)",
            "Zero-schema API development with automatic type inference from backend to frontend. No code generation step required unlike GraphQL. Simpler than REST with built-in validation via Zod.",
          ],
          [
            "PostgreSQL 16",
            "MySQL, MongoDB, SQLite",
            "Advanced features like JSONB for flexible node configs, row-level security, robust transaction support, and mature ecosystem. ACID compliance critical for workflow execution state.",
          ],
          [
            "Prisma ORM",
            "Drizzle, TypeORM, Knex",
            "Type-safe database client generated from schema, declarative migrations, visual database browser (Prisma Studio), and excellent Next.js integration.",
          ],
          [
            "Inngest",
            "BullMQ, Temporal, AWS Step Functions",
            "Durable workflow execution with automatic retries, step functions, and event-driven architecture. No infrastructure to manage unlike BullMQ (requires Redis). Built-in observability dashboard.",
          ],
          [
            "Better Auth",
            "NextAuth, Clerk, Auth0",
            "Self-hosted with full data ownership, built-in OAuth providers, session management, and RBAC. No vendor lock-in or per-user pricing unlike Clerk/Auth0.",
          ],
          [
            "Zustand",
            "Redux, Jotai, MobX",
            "Minimal boilerplate with a simple hook-based API. No providers or reducers needed. Ideal for managing workflow editor canvas state without prop drilling.",
          ],
          [
            "Tailwind CSS v4",
            "styled-components, CSS Modules, Sass",
            "Utility-first approach enables rapid prototyping, consistent design tokens, zero CSS file management, and excellent tree-shaking for small production bundles.",
          ],
          [
            "React Flow",
            "JointJS, GoJS, D3.js",
            "Purpose-built for node-based editors with built-in zoom, pan, minimap, and edge routing. MIT licensed with active maintenance and React-native integration.",
          ],
          [
            "Zod",
            "Yup, Joi, io-ts",
            "TypeScript-first schema validation that integrates directly with tRPC for API input validation and with React Hook Form for client-side form validation.",
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
                width: "20%",
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
            <Text style={{ width: "55%", padding: 4, fontSize: 8 }}>
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
          marginTop: 4,
        }}
      >
        Table 1.2: Technology Justification
      </Text>

      <Text style={styles.h2}>1.9 Scope of the Project</Text>
      <Text style={styles.paragraphIndent}>
        The scope defines the boundaries of the current release (v1.0) and sets
        clear expectations for what is included and excluded.
      </Text>

      <Text style={styles.h3}>1.9.1 In Scope</Text>
      <View style={{ paddingLeft: 12, marginBottom: 12, marginTop: 8 }}>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Authentication & User Profile:</Text>{" "}
          Secure login via email/password and OAuth (Google, GitHub)
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Workflow Builder:</Text> Complete canvas
          operations (add, delete, connect, configure nodes)
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Execution Engine:</Text> Integration with
          Inngest for running workflows with retries
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Node Library:</Text> HTTP, Webhook,
          Schedule, JavaScript Code, OpenAI, Slack, SendGrid
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Team Collaboration:</Text> Multi-user
          workspaces with RBAC (Owner, Admin, Member, Viewer)
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Credential Management:</Text> Secure
          storage with AES-256 encryption
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Dashboard:</Text> Analytics on workflow
          run success/failure rates
        </Text>
      </View>

      <Text style={styles.h3}>1.9.2 Out of Scope</Text>
      <View style={{ paddingLeft: 12, marginBottom: 12, marginTop: 8 }}>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Native Mobile Application:</Text> The
          platform is web-only for v1.0
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>On-Premise Binary:</Text> Self-hosting via
          Docker only, no packaged installer
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Legacy Protocols:</Text> No support for
          SOAP or XML-RPC; focus on REST/GraphQL
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Custom Node Development:</Text> Users
          cannot create custom node types in v1.0
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Marketplace:</Text> No public template
          sharing in v1.0
        </Text>
      </View>

      <Text style={styles.h2}>1.10 Key Features Summary</Text>
      <View
        wrap={false}
        style={{ borderWidth: 1, borderColor: "#333333", marginTop: 12 }}
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
              width: "70%",
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
            "Visual Editor",
            "Drag-and-drop workflow builder with real-time validation",
          ],
          [
            "20+ Node Types",
            "HTTP, AI, Slack, Email, Data transformation nodes",
          ],
          [
            "Durable Execution",
            "Automatic retries, state persistence, exactly-once semantics",
          ],
          ["Team Workspaces", "Multi-user collaboration with 4 RBAC levels"],
          ["Credential Vault", "AES-256 encrypted storage for API keys"],
          [
            "Execution Logs",
            "Real-time monitoring with detailed step-by-step logs",
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
                padding: 4,
                fontSize: 8,
                fontFamily: "Times-Bold",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[0]}
            </Text>
            <Text style={{ width: "70%", padding: 4, fontSize: 8 }}>
              {row[1]}
            </Text>
          </View>
        ))}
      </View>
      <Text
        style={{
          fontSize: 9,
          fontFamily: "Times-Italic",
          textAlign: "center",
          marginTop: 4,
        }}
      >
        Table 1.3: Key Features Summary
      </Text>

      <Text style={styles.h2}>1.11 Report Organization</Text>
      <Text style={styles.paragraphIndent}>
        This report is organized into eight chapters, each addressing a specific
        aspect of the project development lifecycle.
      </Text>

      <View
        wrap={false}
        style={{ borderWidth: 1, borderColor: "#333333", marginTop: 16 }}
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
            Chapter
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
            Title
          </Text>
          <Text
            style={{
              width: "55%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Contents
          </Text>
        </View>
        {[
          [
            "Chapter 1",
            "Introduction",
            "Project overview, background, problem statement, objectives",
          ],
          [
            "Chapter 2",
            "Problem Statement",
            "Detailed analysis of challenges and existing solutions",
          ],
          [
            "Chapter 3",
            "Objectives",
            "Primary, secondary, and technical objectives",
          ],
          [
            "Chapter 4",
            "Feasibility Study",
            "Evaluates technical, economic, operational, schedule, and legal feasibility of the project with SWOT analysis.",
          ],
          [
            "Chapter 5",
            "Project Estimation & Planning",
            "COCOMO analysis, effort estimation, risk assessment",
          ],
          [
            "Chapter 6",
            "SOFTWARE DEVELOPMENT LIFE CYCLE",
            "Covers software development lifecycle, process model selection, requirement gathering methodology, and software requirements specification.",
          ],
          [
            "Chapter 7",
            "System Design",
            "DFD, ER diagrams, architecture, database schema",
          ],
          [
            "Chapter 8",
            "Implementation",
            "Code architecture, technology stack, key features, deployment",
          ],
          [
            "Chapter 9",
            "Testing",
            "Test cases, SOLID/DRY principles, quality assurance",
          ],
          [
            "Chapter 10",
            "Output & Screenshots",
            "Application screens, UI walkthroughs, feature showcase",
          ],
          ["Chapter 11", "Conclusions", "Summary, limitations, future scope"],
        ].map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              borderBottomWidth: i < 10 ? 1 : 0,
              borderBottomColor: "#cccccc",
            }}
          >
            <Text
              style={{
                width: "20%",
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
            <Text style={{ width: "55%", padding: 4, fontSize: 8 }}>
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
          marginTop: 4,
        }}
      >
        Table 1.4: Report Organization
      </Text>

      <View
        style={{
          marginTop: 24,
          padding: 14,
          backgroundColor: "#f8f8f8",
          borderLeftWidth: 4,
          borderLeftColor: "#333333",
        }}
      >
        <Text
          style={{ fontSize: 10, fontFamily: "Times-Italic", lineHeight: 1.5 }}
        >
          "This project represents the culmination of three years of study in
          Computer Science, applying theoretical knowledge to build a
          real-world, production-ready application that solves genuine business
          problems."
        </Text>
      </View>
    </BookPageLayout>
  );
}
