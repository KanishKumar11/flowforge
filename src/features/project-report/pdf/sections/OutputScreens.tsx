"use client";

import { View, Text, Image } from "@react-pdf/renderer";
import { styles, PAGE_MARGINS } from "../styles";
import BookPageLayout from "../components/BookPageLayout";

/**
 * Chapter 11: Output & Screenshots
 * Concise per-screen captions accompanying full-size screenshots.
 */
export default function OutputScreens() {
  const CONTENT_WIDTH = 595 - PAGE_MARGINS.left - PAGE_MARGINS.right;

  // Helper components
  const Screen = ({
    title,
    url,
    description,
    src,
  }: {
    title: string;
    url?: string;
    description: string;
    src?: string;
  }) => (
    <View>
      <View
        wrap={false}
        style={{
          borderLeftWidth: 3,
          borderLeftColor: "#1a1a1a",
          paddingLeft: 10,
          marginTop: 8,
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 10,
            fontFamily: "Times-Bold",
            marginBottom: 2,
          }}
        >
          {title}
          {url && (
            <Text
              style={{
                fontSize: 9,
                fontFamily: "Courier",
                color: "#475569",
              }}
            >
              {`  (${url})`}
            </Text>
          )}
        </Text>
        <Text style={{ fontSize: 9, lineHeight: 1.5 }}>{description}</Text>
      </View>
      {src && (
        <View style={{ marginTop: 4, marginBottom: 14, alignItems: "center" }}>
          <Image src={src} style={{ width: CONTENT_WIDTH }} />
        </View>
      )}
    </View>
  );

  return (
    <BookPageLayout chapterTitle="Output & Screenshots" chapterNum="11">
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
          CHAPTER 11
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
          OUTPUT &amp; SCREENSHOTS
        </Text>
        <View style={{ width: 60, height: 3, backgroundColor: "#000000" }} />
      </View>

      <Text style={styles.paragraphIndent}>
        This chapter presents the key screens of the deployed Flowgent 1.0
        platform (<Text style={styles.bold}>https://flowgent.app</Text>). All
        screens support both Light and Dark themes; screenshots are taken in
        the Light theme.
      </Text>

      {/* ── 11.1 Authentication ── */}
      <Text style={styles.h2}>11.1 Authentication</Text>

      <Screen
        title="11.1.1 Login Page"
        url="/login"
        description="A centred card with the Flowgent branding and an animated workflow visualizer on the left, and the login form (email, password, OAuth Google/GitHub) on the right. Inline validation; redirect to dashboard on success."
        src="/outputs/login.png"
      />

      <Screen
        title="11.1.2 Sign Up Page"
        url="/signup"
        description="Full name, email, password (with strength indicator), and OAuth buttons. Auto sign-in after registration; a personal team workspace is created with the OWNER role."
        src="/outputs/signup.png"
      />

      {/* ── 11.2 Dashboard ── */}
      <Text style={styles.h2}>11.2 Dashboard</Text>

      <Screen
        title="11.2.1 Dashboard Home"
        url="/dashboard"
        description="Sidebar nav (Workflows, Executions, Credentials, Teams, Settings) and a top header with search, notifications, theme toggle, and user menu. Four metric cards (Total Workflows, Total Executions, Success Rate, Active Schedules), three quick-action buttons (Create Workflow, Browse Templates, Manage Credentials), and a Recent Workflows grid."
        src="/outputs/dashboard.png"
      />

      {/* ── 11.3 Workflow Editor ── */}
      <Text style={styles.h2}>11.3 Visual Workflow Editor</Text>

      <Screen
        title="11.3.1 Editor Canvas"
        url="/workflows/[id]"
        description="Full-screen React Flow canvas with dotted grid, MiniMap (bottom-right), and zoom/lock controls (bottom-left). The left palette groups 24 nodes by category (Triggers, Logic, Data, HTTP, AI, Integrations, Other); the right config panel renders dynamic forms per node type with a credential dropdown. The toolbar exposes save (auto-save indicator), execute, undo/redo, version history, export/import, and an active/inactive toggle. Edges are animated curves with directional arrows; node status (green/red/spinner) updates in real time."
        src="/outputs/workflow_editor.png"
      />

      {/* ── 11.4 Workflows ── */}
      <Text style={styles.h2}>11.4 Workflows Management</Text>

      <Screen
        title="11.4.1 Workflows List"
        url="/workflows"
        description="Create / Browse Templates buttons (top-right), full-text search across name/description/tags/folder, filters (folder, tags), sort and grid/list toggle. Each card shows name, description, dates, active badge, execution count, favorite star, folder tag, and per-card actions (Edit, Duplicate, Export, Delete). The Templates dialog ships with 5 built-in templates."
        src="/outputs/workflows.png"
      />

      {/* ── 11.5 Executions ── */}
      <Text style={styles.h2}>11.5 Execution History</Text>

      <Screen
        title="11.5.1 Executions List"
        url="/executions"
        description="Status summary bar (total / success / failed / running) plus filters (status, workflow) and an hourly timeline with cursor-based pagination. Table columns: Execution ID, Workflow, Status, Mode (Manual / Scheduled / Webhook), Started At, Duration, Actions. The Detail view shows trigger data, per-node input/output, error messages with stack traces, timing breakdown, and retry info."
      />

      <Screen
        title="11.5.1 Executions List"
        url="/executions"
        description="Status summary bar (total / success / failed / running) plus filters (status, workflow) and an hourly timeline with cursor-based pagination. Table columns: Execution ID, Workflow, Status, Mode (Manual / Scheduled / Webhook), Started At, Duration, Actions. The Detail view shows trigger data, per-node input/output, error messages with stack traces, timing breakdown, and retry info."
        src="@file:execution_history.png"
      />

      {/* ── 11.6 Credentials ── */}
      <Text style={styles.h2}>11.6 Credential Management</Text>

      <Screen
        title="11.6.1 Credentials Page"
        url="/credentials"
        description="Lists stored credentials with provider icon, type (API Key, OAuth, Bearer Token), creation date, and expiry status. OAuth Connect buttons launch the OAuth2 flow for Slack, Google, GitHub, and Notion. The Add Credential dialog renders dynamic fields based on the selected type."
        src="/outputs/credentials.png"
      />

      {/* ── 11.7 Teams ── */}
      <Text style={styles.h2}>11.7 Team Management</Text>

      <Screen
        title="11.7.1 Teams Page"
        url="/teams"
        description="Team list with name, member count, workflow count, and plan badge. The team detail view lists members (avatar, name, email, role badge) with role management (Owner / Admin / Member / Viewer) and an Invite Member dialog. Invitations are sent via email with a 7-day expiry token."
        src="/outputs/team.png"
      />

      {/* ── 11.8 Schedules ── */}
      <Text style={styles.h2}>11.8 Schedule Configuration</Text>

      <Screen
        title="11.8.1 CronPicker (Workflow Settings)"
        description="Visual cron builder with presets (Every minute, Every hour, etc.) and a custom expression input with validation. Shows a human-readable description, timezone selector, and a preview of the next 5 run times. The Schedule list provides per-schedule active toggles, last/next run timestamps, and execution counts."
      />

      {/* ── 11.9 Version History ── */}
      <Text style={styles.h2}>11.9 Version History</Text>

      <Screen
        title="11.9.1 Version History Panel"
        description="Slide-in panel listing every workflow version chronologically with version number, timestamp, optional change message, and a Rollback button that restores the workflow's nodes, edges, and settings."
      />

      {/* ── 11.10 Webhook Docs ── */}
      <Text style={styles.h2}>11.10 Webhook Documentation</Text>

      <Screen
        title="11.10.1 Auto-generated Webhook Docs"
        description="Displays the unique webhook URL, HTTP method badge, copy-to-clipboard cURL example, IP allowlist, secret hash for signature validation, and a call counter."
      />

      {/* ── 11.11 Summary ── */}
      <Text style={styles.h2}>11.11 Summary</Text>
      <Text style={styles.paragraphIndent}>
        Flowgent 1.0 ships a complete set of UI surfaces covering authentication,
        dashboard overview, visual workflow design and configuration, execution
        monitoring, and team management — all live at{" "}
        <Text style={styles.bold}>https://flowgent.app</Text> with full
        light/dark theme support.
      </Text>

      <View
        wrap={false}
        style={{
          marginTop: 16,
          padding: 12,
          borderWidth: 1,
          borderColor: "#94a3b8", borderRadius: 6,
          backgroundColor: "#f8fafc",
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontFamily: "Times-Bold",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Application Access
        </Text>
        <Text style={{ fontSize: 9, textAlign: "center", marginBottom: 4 }}>
          <Text style={styles.bold}>Production URL:</Text> https://flowgent.app
        </Text>
        <Text style={{ fontSize: 9, textAlign: "center", marginBottom: 4 }}>
          <Text style={styles.bold}>Source Code:</Text>{" "}
          https://github.com/kanishKumar11/flowgent
        </Text>
        <Text style={{ fontSize: 9, textAlign: "center" }}>
          <Text style={styles.bold}>Total Screens:</Text> 12+ unique pages and
          dialogs
        </Text>
      </View>
    </BookPageLayout>
  );
}
