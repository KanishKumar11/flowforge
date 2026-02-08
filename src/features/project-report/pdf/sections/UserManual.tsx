"use client";

import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import BookPageLayout from "../components/BookPageLayout";
import UserJourneyDiagram from "../diagrams/UserJourneyDiagram";

/**
 * Chapter 10: User Manual
 * Step-by-step guide for end users of Flowgent 1.0
 */
export default function UserManual() {
  return (
    <BookPageLayout chapterTitle="User Manual" chapterNum="10">
      {/* Chapter Title */}
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
          CHAPTER 10
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
          USER MANUAL
        </Text>
        <View style={{ width: 60, height: 3, backgroundColor: "#000000" }} />
      </View>

      <Text style={styles.paragraphIndent}>
        This chapter serves as a comprehensive user guide for the Flowgent 1.0
        platform. It provides step-by-step instructions for all major
        operations, from initial account setup to advanced workflow automation,
        enabling users to leverage the platform effectively. The application is
        accessible at <Text style={styles.bold}>https://flowgent.app</Text>.
      </Text>

      {/* ── 10.1 Getting Started ── */}
      <Text style={styles.h2}>10.1 Getting Started</Text>

      <Text style={styles.h3}>10.1.1 System Requirements</Text>
      <Text style={styles.paragraphIndent}>
        Flowgent 1.0 is a web-based application and requires no local
        installation. The following are the minimum requirements:
      </Text>
      <View style={{ paddingLeft: 24, marginBottom: 8 }}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Browser:</Text> Google Chrome (v100+),
          Mozilla Firefox (v100+), Microsoft Edge (v100+), or Safari (v15+)
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Internet:</Text> Stable broadband
          connection (minimum 2 Mbps recommended)
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Display:</Text> Minimum 1280×720
          resolution; 1920×1080 recommended for optimal editor experience
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• JavaScript:</Text> Must be enabled in the
          browser
        </Text>
      </View>

      <Text style={styles.h3}>10.1.2 Account Registration</Text>
      <Text style={styles.paragraphIndent}>
        To begin using Flowgent, users must create an account:
      </Text>
      <View style={{ paddingLeft: 24, marginBottom: 8 }}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 1:</Text> Navigate to{" "}
          <Text style={styles.bold}>https://flowgent.app/sign-up</Text>
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 2:</Text> Enter your full name, email
          address, and choose a secure password (minimum 8 characters)
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 3:</Text> Alternatively, click{" "}
          <Text style={styles.bold}>&quot;Sign in with Google&quot;</Text> or{" "}
          <Text style={styles.bold}>&quot;Sign in with GitHub&quot;</Text> for
          OAuth-based registration
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 4:</Text> Verify your email address
          using the verification link sent to your inbox
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 5:</Text> Log in to access the
          dashboard
        </Text>
      </View>

      <Text style={styles.h3}>10.1.3 User Journey Overview</Text>
      <Text style={styles.paragraphIndent}>
        The following diagram illustrates the typical user journey through the
        Flowgent platform, from initial sign-up to advanced feature utilization:
      </Text>

      <View
        wrap={false}
        style={{ alignItems: "center", marginTop: 8, marginBottom: 8 }}
      >
        <UserJourneyDiagram />
      </View>
      <Text
        style={{
          fontSize: 9,
          fontFamily: "Times-Italic",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Figure 10.1: User Journey Through Flowgent Platform
      </Text>

      {/* ── 10.2 Dashboard ── */}
      <Text style={styles.h2}>10.2 Dashboard Navigation</Text>

      <Text style={styles.paragraphIndent}>
        Upon successful login, users are directed to the{" "}
        <Text style={styles.bold}>Dashboard</Text> — the central hub of the
        platform. The dashboard provides an at-a-glance overview of all workflow
        activity.
      </Text>

      <Text style={styles.h3}>10.2.1 Dashboard Components</Text>
      <View style={{ paddingLeft: 24, marginBottom: 8 }}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Overview Cards:</Text> Display total
          workflows, active workflows, today&apos;s executions, and success rate
          percentage
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Recent Executions:</Text> A table showing
          the latest workflow runs with status (success/failed), duration, and
          timestamp
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Quick Actions:</Text> Buttons for{" "}
          <Text style={styles.bold}>Create Workflow</Text>,{" "}
          <Text style={styles.bold}>View Executions</Text>, and{" "}
          <Text style={styles.bold}>Manage Team</Text>
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Sidebar Navigation:</Text> Access to
          Workflows, Executions, Credentials, Schedules, Teams, and Settings
        </Text>
      </View>

      <Text style={styles.h3}>10.2.2 Theme Selection</Text>
      <Text style={styles.paragraphIndent}>
        Flowgent supports both <Text style={styles.bold}>Light</Text> and{" "}
        <Text style={styles.bold}>Dark</Text> themes. Users can toggle the theme
        using the theme switch icon in the top-right corner of the application
        header. The preference is saved and persisted across sessions.
      </Text>

      {/* ── 10.3 Workflow Creation ── */}
      <Text style={styles.h2}>10.3 Creating a Workflow</Text>

      <Text style={styles.paragraphIndent}>
        Workflow creation is the core functionality of Flowgent. The process
        involves the following steps:
      </Text>

      <Text style={styles.h3}>10.3.1 Initiating a New Workflow</Text>
      <View style={{ paddingLeft: 24, marginBottom: 8 }}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 1:</Text> Click the{" "}
          <Text style={styles.bold}>&quot;+ New Workflow&quot;</Text> button on
          the Workflows page or Dashboard
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 2:</Text> Enter a descriptive name for
          the workflow (e.g., &quot;Daily Sales Report Generator&quot;)
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 3:</Text> Optionally, add a description
          to document the workflow&apos;s purpose
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 4:</Text> The visual editor opens with
          a default <Text style={styles.bold}>Trigger Node</Text> on the canvas
        </Text>
      </View>

      <Text style={styles.h3}>10.3.2 Using the Visual Editor</Text>
      <Text style={styles.paragraphIndent}>
        The visual editor is a drag-and-drop canvas powered by React Flow. Key
        interactions include:
      </Text>
      <View style={{ paddingLeft: 24, marginBottom: 8 }}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Adding Nodes:</Text> Click the{" "}
          <Text style={styles.bold}>&quot;+&quot;</Text> button on any
          node&apos;s output handle, or use the right-click context menu →{" "}
          <Text style={styles.bold}>Add Node</Text>
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Connecting Nodes:</Text> Drag from an
          output handle (right side) to an input handle (left side) of another
          node to create a connection edge
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Moving Nodes:</Text> Click and drag any
          node to reposition it on the canvas
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Deleting:</Text> Select a node or edge and
          press the <Text style={styles.bold}>Delete</Text> key, or use the
          context menu
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Panning & Zooming:</Text> Use mouse scroll
          to zoom, click and drag on empty canvas to pan
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Auto-Save:</Text> Changes are
          automatically saved with debounced persistence
        </Text>
      </View>

      {/* ── 10.4 Node Types ── */}
      <Text style={styles.h2}>10.4 Node Types & Configuration</Text>

      <Text style={styles.paragraphIndent}>
        Flowgent provides 24 distinct node types organized into 7 categories.
        Each node is configured through a side panel that opens upon clicking
        the node.
      </Text>

      <Text style={styles.h3}>10.4.1 Trigger Nodes</Text>
      <View style={{ paddingLeft: 24, marginBottom: 8 }}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Manual Trigger:</Text> Execute the
          workflow on-demand via the &quot;Run&quot; button
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Webhook Trigger:</Text> Receive data from
          external HTTP requests via a unique webhook URL
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Schedule Trigger:</Text> Run workflows at
          specified intervals using cron expressions (e.g.,{" "}
          <Text style={styles.bold}>0 9 * * 1-5</Text> for weekdays at 9 AM)
        </Text>
      </View>

      <Text style={styles.h3}>10.4.2 Action Nodes</Text>
      <View style={{ paddingLeft: 24, marginBottom: 8 }}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• HTTP Request:</Text> Make GET, POST, PUT,
          PATCH, DELETE requests to any URL with custom headers and body
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Send Email:</Text> Send emails via
          configured SMTP or Resend integration
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Delay:</Text> Pause execution for a
          specified duration (seconds, minutes, or hours)
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Set Variable:</Text> Create or modify
          variables available to downstream nodes
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Code (JavaScript):</Text> Execute custom
          JavaScript code with access to input data and libraries
        </Text>
      </View>

      <Text style={styles.h3}>10.4.3 AI Nodes</Text>
      <View style={{ paddingLeft: 24, marginBottom: 8 }}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• OpenAI:</Text> Generate text using GPT
          models (GPT-4o, GPT-4o-mini). Requires OpenAI API key credential
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Anthropic:</Text> Use Claude models
          (Claude 3.5 Sonnet, Claude 3 Haiku) for text generation
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Google Gemini:</Text> Leverage Gemini
          models for multimodal AI capabilities
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Text Classifier:</Text> Classify input
          text into predefined categories using AI
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Summarizer:</Text> Generate concise
          summaries of lengthy text inputs
        </Text>
      </View>

      <Text style={styles.h3}>10.4.4 Logic Nodes</Text>
      <View style={{ paddingLeft: 24, marginBottom: 8 }}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• IF Condition:</Text> Branch workflow
          execution based on configurable conditions (equals, contains, greater
          than, etc.)
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Switch:</Text> Route execution to multiple
          branches based on a value match
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Loop:</Text> Iterate over arrays or repeat
          actions a specified number of times
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Merge:</Text> Combine data from multiple
          parallel branches into a single flow
        </Text>
      </View>

      <Text style={styles.h3}>10.4.5 Integration Nodes</Text>
      <View style={{ paddingLeft: 24, marginBottom: 8 }}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Slack:</Text> Send messages, create
          channels, or list users in Slack workspaces
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Google Sheets:</Text> Read, write, or
          update spreadsheet data
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• GitHub:</Text> Create issues, manage
          repositories, and trigger on events
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Notion:</Text> Create or update pages and
          databases
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Stripe:</Text> Process payments, manage
          customers, and handle subscriptions
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Twilio:</Text> Send SMS messages and make
          voice calls
        </Text>
      </View>

      {/* ── 10.5 Credentials ── */}
      <Text style={styles.h2}>10.5 Credential Management</Text>

      <Text style={styles.paragraphIndent}>
        Credentials store sensitive authentication data (API keys, OAuth tokens)
        required by integration and AI nodes. All credentials are encrypted
        using AES-256-GCM before database storage.
      </Text>

      <Text style={styles.h3}>10.5.1 Adding Credentials</Text>
      <View style={{ paddingLeft: 24, marginBottom: 8 }}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 1:</Text> Navigate to{" "}
          <Text style={styles.bold}>Credentials</Text> from the sidebar
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 2:</Text> Click{" "}
          <Text style={styles.bold}>&quot;+ New Credential&quot;</Text>
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 3:</Text> Select the credential type
          (e.g., OpenAI API Key, Slack Bot Token, GitHub Personal Access Token)
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 4:</Text> Enter the required fields —
          each field is masked for security
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 5:</Text> Click{" "}
          <Text style={styles.bold}>&quot;Save&quot;</Text>. The credential is
          encrypted and stored securely
        </Text>
      </View>

      <Text style={styles.h3}>10.5.2 Using Credentials in Nodes</Text>
      <Text style={styles.paragraphIndent}>
        When configuring a node that requires authentication (e.g., OpenAI,
        Slack), a <Text style={styles.bold}>Credential</Text> dropdown appears
        in the node configuration panel. Select the previously saved credential
        from the list. Credentials are scoped to the user (personal) or team
        (shared) level.
      </Text>

      {/* ── 10.6 Execution ── */}
      <Text style={styles.h2}>10.6 Executing & Monitoring Workflows</Text>

      <Text style={styles.h3}>10.6.1 Manual Execution</Text>
      <Text style={styles.paragraphIndent}>
        To execute a workflow manually:
      </Text>
      <View style={{ paddingLeft: 24, marginBottom: 8 }}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 1:</Text> Open the desired workflow in
          the visual editor
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 2:</Text> Click the{" "}
          <Text style={styles.bold}>&quot;▶ Run&quot;</Text> button in the
          editor toolbar
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 3:</Text> The execution begins from the
          Trigger node and progresses through connected nodes sequentially
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 4:</Text> Execution status is displayed
          on each node in real-time (green = success, red = error)
        </Text>
      </View>

      <Text style={styles.h3}>10.6.2 Viewing Execution History</Text>
      <Text style={styles.paragraphIndent}>
        Navigate to <Text style={styles.bold}>Executions</Text> from the sidebar
        to view all past workflow runs. Each execution record includes:
      </Text>
      <View style={{ paddingLeft: 24, marginBottom: 8 }}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Status:</Text> Success, Failed, or Running
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Duration:</Text> Total execution time in
          seconds
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Trigger Type:</Text> Manual, Webhook, or
          Schedule
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Node-Level Output:</Text> Click on any
          execution to view individual node inputs/outputs and error messages
        </Text>
      </View>

      <Text style={styles.h3}>10.6.3 Error Handling</Text>
      <Text style={styles.paragraphIndent}>
        When an execution fails, the failed node is highlighted in red. Users
        can click the node to view the error details including the error
        message, stack trace (if available), and retry options. The workflow can
        be edited and re-executed without losing the previous execution data.
      </Text>

      {/* ── 10.7 Schedule ── */}
      <Text style={styles.h2}>10.7 Scheduling Workflows</Text>

      <Text style={styles.paragraphIndent}>
        Workflows can be automated to run at specific intervals using cron
        schedules:
      </Text>
      <View style={{ paddingLeft: 24, marginBottom: 8 }}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 1:</Text> Navigate to{" "}
          <Text style={styles.bold}>Schedules</Text> from the sidebar
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 2:</Text> Click{" "}
          <Text style={styles.bold}>&quot;+ New Schedule&quot;</Text>
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 3:</Text> Select the target workflow
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 4:</Text> Configure the schedule using
          either the visual cron builder or manual cron expression input
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 5:</Text> Set the timezone (defaults to
          user&apos;s local timezone)
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 6:</Text> Enable the schedule by
          toggling the active switch
        </Text>
      </View>

      <Text style={styles.paragraphIndent}>Common schedule examples:</Text>

      {/* Schedule Examples Table */}
      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#000000",
          marginTop: 8,
          marginBottom: 4,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#f0f0f0",
            borderBottomWidth: 1,
            borderBottomColor: "#000000",
          }}
        >
          <Text
            style={{
              width: "40%",
              fontSize: 9.5,
              fontFamily: "Times-Bold",
              padding: 6,
              borderRightWidth: 1,
              borderRightColor: "#000000",
            }}
          >
            Cron Expression
          </Text>
          <Text
            style={{
              width: "60%",
              fontSize: 9.5,
              fontFamily: "Times-Bold",
              padding: 6,
            }}
          >
            Description
          </Text>
        </View>
        {[
          ["0 9 * * 1-5", "Every weekday at 9:00 AM"],
          ["0 */6 * * *", "Every 6 hours"],
          ["0 0 1 * *", "First day of every month at midnight"],
          ["*/30 * * * *", "Every 30 minutes"],
          ["0 8 * * 1", "Every Monday at 8:00 AM"],
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
                width: "40%",
                fontSize: 9,
                fontFamily: "Courier",
                padding: 5,
                borderRightWidth: 1,
                borderRightColor: "#000000",
              }}
            >
              {row[0]}
            </Text>
            <Text
              style={{
                width: "60%",
                fontSize: 9,
                fontFamily: "Times-Roman",
                padding: 5,
              }}
            >
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
          marginBottom: 12,
        }}
      >
        Table 10.1: Common Cron Schedule Examples
      </Text>

      {/* ── 10.8 Team Management ── */}
      <Text style={styles.h2}>10.8 Team Collaboration</Text>

      <Text style={styles.paragraphIndent}>
        Flowgent supports multi-user teams with role-based access control:
      </Text>

      <Text style={styles.h3}>10.8.1 Creating a Team</Text>
      <View style={{ paddingLeft: 24, marginBottom: 8 }}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 1:</Text> Navigate to{" "}
          <Text style={styles.bold}>Teams</Text> from the sidebar
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 2:</Text> Click{" "}
          <Text style={styles.bold}>&quot;+ Create Team&quot;</Text>
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 3:</Text> Enter the team name and
          optional description
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 4:</Text> The creating user is
          automatically assigned the <Text style={styles.bold}>Owner</Text> role
        </Text>
      </View>

      <Text style={styles.h3}>10.8.2 Role Permissions</Text>

      {/* Roles Table */}
      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#000000",
          marginTop: 8,
          marginBottom: 4,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#f0f0f0",
            borderBottomWidth: 1,
            borderBottomColor: "#000000",
          }}
        >
          <Text
            style={{
              width: "20%",
              fontSize: 9.5,
              fontFamily: "Times-Bold",
              padding: 6,
              borderRightWidth: 1,
              borderRightColor: "#000000",
            }}
          >
            Role
          </Text>
          <Text
            style={{
              width: "80%",
              fontSize: 9.5,
              fontFamily: "Times-Bold",
              padding: 6,
            }}
          >
            Permissions
          </Text>
        </View>
        {[
          [
            "Owner",
            "Full access — manage team, billing, members, workflows, credentials, and settings",
          ],
          [
            "Admin",
            "Manage members, create/edit/delete workflows, manage credentials and schedules",
          ],
          [
            "Member",
            "Create and edit own workflows, execute workflows, view shared credentials",
          ],
          [
            "Viewer",
            "View workflows and execution history only — no edit or execute permissions",
          ],
        ].map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              borderBottomWidth: i < 3 ? 1 : 0,
              borderBottomColor: "#cccccc",
            }}
          >
            <Text
              style={{
                width: "20%",
                fontSize: 9,
                fontFamily: "Times-Bold",
                padding: 5,
                borderRightWidth: 1,
                borderRightColor: "#000000",
              }}
            >
              {row[0]}
            </Text>
            <Text
              style={{
                width: "80%",
                fontSize: 9,
                fontFamily: "Times-Roman",
                padding: 5,
              }}
            >
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
          marginBottom: 12,
        }}
      >
        Table 10.2: Team Role Permissions Matrix
      </Text>

      <Text style={styles.h3}>10.8.3 Inviting Members</Text>
      <Text style={styles.paragraphIndent}>
        Team Owners and Admins can invite new members by navigating to{" "}
        <Text style={styles.bold}>Teams → [Team Name] → Members</Text> and
        clicking <Text style={styles.bold}>&quot;Invite Member&quot;</Text>.
        Enter the user&apos;s email address and assign an appropriate role. An
        invitation email is sent automatically. The invited user must accept the
        invitation to join the team.
      </Text>

      {/* ── 10.9 Version History ── */}
      <Text style={styles.h2}>10.9 Version History</Text>

      <Text style={styles.paragraphIndent}>
        Flowgent automatically maintains version history for all workflows.
        Every time a workflow is saved, a new version is created with a
        timestamp. Users can:
      </Text>
      <View style={{ paddingLeft: 24, marginBottom: 8 }}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• View Versions:</Text> Click the{" "}
          <Text style={styles.bold}>&quot;History&quot;</Text> icon in the
          editor toolbar to see a chronological list of all versions
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Compare Versions:</Text> Select any two
          versions to see a visual diff of the workflow canvas
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>• Restore Versions:</Text> Click{" "}
          <Text style={styles.bold}>&quot;Restore&quot;</Text> on any historical
          version to revert the workflow to that state
        </Text>
      </View>

      {/* ── 10.10 Webhooks ── */}
      <Text style={styles.h2}>10.10 Webhook Configuration</Text>

      <Text style={styles.paragraphIndent}>
        Webhooks allow external services to trigger workflows by sending HTTP
        requests. To set up a webhook:
      </Text>
      <View style={{ paddingLeft: 24, marginBottom: 8 }}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 1:</Text> Add a{" "}
          <Text style={styles.bold}>Webhook Trigger</Text> node to your workflow
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 2:</Text> A unique webhook URL is
          automatically generated (e.g.,{" "}
          <Text style={styles.bold}>
            https://flowgent.app/api/webhooks/abc-123
          </Text>
          )
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 3:</Text> Enable the workflow to
          activate the webhook endpoint
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 4:</Text> Configure the external
          service to send POST/GET requests to the webhook URL
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Step 5:</Text> The incoming request headers,
          query parameters, and body are available as node output data
        </Text>
      </View>

      {/* ── 10.11 Troubleshooting ── */}
      <Text style={styles.h2}>10.11 Troubleshooting & FAQ</Text>

      {/* FAQ Table */}
      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#000000",
          marginTop: 8,
          marginBottom: 4,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#f0f0f0",
            borderBottomWidth: 1,
            borderBottomColor: "#000000",
          }}
        >
          <Text
            style={{
              width: "40%",
              fontSize: 9.5,
              fontFamily: "Times-Bold",
              padding: 6,
              borderRightWidth: 1,
              borderRightColor: "#000000",
            }}
          >
            Issue
          </Text>
          <Text
            style={{
              width: "60%",
              fontSize: 9.5,
              fontFamily: "Times-Bold",
              padding: 6,
            }}
          >
            Resolution
          </Text>
        </View>
        {[
          [
            "Workflow not executing",
            "Ensure the workflow is enabled (active toggle is ON) and all required credentials are configured",
          ],
          [
            "AI node returns error",
            "Verify API key credential is valid and has sufficient balance/quota with the provider",
          ],
          [
            "Webhook not receiving data",
            "Confirm the workflow is active and the webhook URL is correctly configured in the external service",
          ],
          [
            "Schedule not triggering",
            "Check the cron expression validity, timezone setting, and that the schedule status is active",
          ],
          [
            "Node connection fails",
            "Ensure you drag from an output handle (right) to an input handle (left). Check that the connection path is valid",
          ],
          [
            "Slow execution",
            "Large payloads or API rate limits may cause delays. Consider adding Delay nodes or optimizing data transformations",
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
                width: "40%",
                fontSize: 9,
                fontFamily: "Times-Roman",
                padding: 5,
                borderRightWidth: 1,
                borderRightColor: "#000000",
              }}
            >
              {row[0]}
            </Text>
            <Text
              style={{
                width: "60%",
                fontSize: 9,
                fontFamily: "Times-Roman",
                padding: 5,
              }}
            >
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
          marginBottom: 12,
        }}
      >
        Table 10.3: Common Issues & Resolutions
      </Text>

      {/* ── 10.12 Summary ── */}
      <Text style={styles.h2}>10.12 Summary</Text>
      <Text style={styles.paragraphIndent}>
        This user manual covered the complete operational workflow of Flowgent
        1.0 — from account creation and dashboard navigation to workflow design,
        node configuration, credential management, execution monitoring,
        scheduling, team collaboration, version control, and webhook setup. The
        platform is designed to be intuitive and self-explanatory, with
        contextual help available throughout the interface. For additional
        assistance, users may contact the support team via the in-app help
        section or refer to the online documentation at{" "}
        <Text style={styles.bold}>https://flowgent.app/docs</Text>.
      </Text>
    </BookPageLayout>
  );
}
