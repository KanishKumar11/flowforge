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
  // Reusable cell styles
  const tableHeader = {
<<<<<<< HEAD
    backgroundColor: "#dbeafe",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
=======
    backgroundColor: "#dbeafe", borderTopLeftRadius: 6, borderTopRightRadius: 6,
>>>>>>> 7ee487ff45e6c74e190c28b867faabef13249665
    flexDirection: "row" as const,
    borderBottomWidth: 1,
    borderBottomColor: "#93c5fd",
  };
  const tableRow = (last: boolean) => ({
    flexDirection: "row" as const,
    borderBottomWidth: last ? 0 : 1,
    borderBottomColor: "#cbd5e1",
  });
  const cellHead = (w: string, last = false) => ({
    width: w,
    fontSize: 9.5,
    fontFamily: "Times-Bold" as const,
    padding: 6,
    borderRightWidth: last ? 0 : 1,
    borderRightColor: "#bfdbfe",
  });
  const cell = (w: string, font = "Times-Roman", last = false) => ({
    width: w,
    fontSize: 9,
    fontFamily: font,
    padding: 5,
    borderRightWidth: last ? 0 : 1,
    borderRightColor: "#bfdbfe",
  });

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
        This chapter is a user guide for the Flowgent 1.0 platform. It covers
        major operations from setup to advanced automation. The application is
        accessible at <Text style={styles.bold}>https://flowgent.app</Text>.
      </Text>

      {/* ── 10.1 Getting Started ── */}
      <Text style={styles.h2}>10.1 Getting Started</Text>

      <Text style={styles.h3}>10.1.1 System Requirements</Text>
      <Text style={styles.paragraphIndent}>
        Flowgent is web-based and requires no local installation. A modern
        browser (Chrome 100+, Firefox 100+, Edge 100+, or Safari 15+) with
        JavaScript enabled and a stable internet connection (≥ 2 Mbps) is
        required. A 1280×720 minimum display is supported; 1920×1080 is
        recommended for the editor.
      </Text>

      <Text style={styles.h3}>10.1.2 Account Registration</Text>
      <Text style={styles.paragraphIndent}>
        New users register at <Text style={styles.bold}>/sign-up</Text> using
        either email + password (8+ characters) or a Google / GitHub OAuth
        provider. After verifying the email, users are redirected to the
        dashboard.
      </Text>

      <Text style={styles.h3}>10.1.3 User Journey Overview</Text>
      <Text style={styles.paragraphIndent}>
        The diagram below illustrates the typical user journey from sign-up to
        advanced feature utilization:
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
<<<<<<< HEAD
        After login, users land on the{" "}
        <Text style={styles.bold}>Dashboard</Text> — the central hub showing
        overview cards (totals, today&apos;s executions, success rate), a
        recent-executions table, quick actions (Create Workflow, View
        Executions, Manage Team), and a sidebar with navigation to Workflows,
        Executions, Credentials, Schedules, Teams, and Settings. A theme toggle
        in the header switches between Light and Dark modes; the preference
        persists across sessions.
=======
        After login, users land on the <Text style={styles.bold}>Dashboard</Text>{" "}
        — the central hub showing overview cards (totals, today&apos;s
        executions, success rate), a recent-executions table, quick actions
        (Create Workflow, View Executions, Manage Team), and a sidebar with
        navigation to Workflows, Executions, Credentials, Schedules, Teams, and
        Settings. A theme toggle in the header switches between Light and Dark
        modes; the preference persists across sessions.
>>>>>>> 7ee487ff45e6c74e190c28b867faabef13249665
      </Text>

      {/* ── 10.3 Workflow Creation ── */}
      <Text style={styles.h2}>10.3 Creating a Workflow</Text>

      <Text style={styles.paragraphIndent}>
        Click <Text style={styles.bold}>&quot;+ New Workflow&quot;</Text> on the
        Workflows page, enter a name (e.g.,{" "}
        <Text style={styles.italic}>&quot;Daily Sales Report&quot;</Text>) and
        an optional description. The visual editor opens with a default Trigger
        node on the canvas.
      </Text>

      <Text style={styles.h3}>10.3.1 Using the Visual Editor</Text>
      <Text style={styles.paragraphIndent}>
        The editor is a drag-and-drop canvas powered by React Flow. Add nodes
        via the <Text style={styles.bold}>+</Text> handle on any node or the
        right-click context menu. Connect nodes by dragging from an output
        handle (right) to an input handle (left). Nodes can be moved, deleted
        (Delete key), or duplicated. Use mouse-scroll to zoom and click-drag on
        empty canvas to pan. Changes are auto-saved with debounced persistence.
      </Text>

      {/* ── 10.4 Node Catalog (consolidated table) ── */}
      <Text style={styles.h2}>10.4 Node Catalog</Text>

      <Text style={styles.paragraphIndent}>
        Flowgent provides 24 node types across 5 categories. Each node is
        configured via a side panel that opens on click.
      </Text>

      <View
        wrap={false}
        style={{
          borderWidth: 1,
<<<<<<< HEAD
          borderColor: "#94a3b8",
          borderRadius: 6,
=======
          borderColor: "#94a3b8", borderRadius: 6,
>>>>>>> 7ee487ff45e6c74e190c28b867faabef13249665
          marginTop: 8,
          marginBottom: 4,
        }}
      >
        <View style={tableHeader}>
          <Text style={cellHead("22%")}>Category</Text>
          <Text style={cellHead("22%")}>Node</Text>
          <Text style={cellHead("56%", true)}>Purpose</Text>
        </View>
        {[
          ["Trigger", "Manual", "Run on-demand via the Run button"],
          ["", "Webhook", "Receive HTTP requests at a unique URL"],
          ["", "Schedule", "Cron-based recurring execution"],
          ["Action", "HTTP Request", "Call any REST endpoint (GET/POST/etc.)"],
          ["", "Send Email", "SMTP / Resend integration"],
          ["", "Delay", "Pause for seconds, minutes, or hours"],
          ["", "Set Variable", "Store values for downstream nodes"],
          ["", "Code (JS)", "Run custom JavaScript on input data"],
          ["AI", "OpenAI", "GPT-4o / GPT-4o-mini text generation"],
          ["", "Anthropic", "Claude 3.5 Sonnet / Haiku"],
          ["", "Google Gemini", "Multimodal AI capabilities"],
          ["", "Text Classifier", "Categorise text via AI"],
          ["", "Summarizer", "Concise summaries of long text"],
          ["Logic", "IF Condition", "Branch on equality / contains / >, etc."],
          ["", "Switch", "Multi-branch routing on a value"],
          ["", "Loop", "Iterate over arrays or N times"],
          ["", "Merge", "Combine parallel branches"],
          ["Integration", "Slack", "Messages, channels, users"],
          ["", "Google Sheets", "Read / write spreadsheet rows"],
          ["", "GitHub", "Issues, repos, event triggers"],
          ["", "Notion", "Create / update pages & databases"],
          ["", "Stripe", "Payments, customers, subscriptions"],
          ["", "Twilio", "SMS messages and voice calls"],
        ].map((row, i, arr) => (
          <View key={i} style={tableRow(i === arr.length - 1)}>
            <Text style={cell("22%", "Times-Bold")}>{row[0]}</Text>
            <Text style={cell("22%")}>{row[1]}</Text>
            <Text style={{ ...cell("56%", "Times-Roman", true) }}>
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
        Table 10.1: Flowgent Node Catalog
      </Text>

      {/* ── 10.5 Credentials ── */}
      <Text style={styles.h2}>10.5 Credential Management</Text>

      <Text style={styles.paragraphIndent}>
<<<<<<< HEAD
        Credentials store API keys and OAuth tokens needed by integration and AI
        nodes. All values are encrypted with AES-256-GCM before being written to
        the database. Add a credential from{" "}
        <Text style={styles.bold}>Credentials → + New Credential</Text>: pick
        the type (e.g., OpenAI API Key, Slack Bot Token), fill the masked
        fields, and save. Within a node config, choose the saved credential from
        the <Text style={styles.bold}>Credential</Text> dropdown. Credentials
        are scoped at the user (personal) or team (shared) level.
=======
        Credentials store API keys and OAuth tokens needed by integration and
        AI nodes. All values are encrypted with AES-256-GCM before being
        written to the database. Add a credential from{" "}
        <Text style={styles.bold}>Credentials → + New Credential</Text>: pick
        the type (e.g., OpenAI API Key, Slack Bot Token), fill the masked
        fields, and save. Within a node config, choose the saved credential
        from the <Text style={styles.bold}>Credential</Text> dropdown.
        Credentials are scoped at the user (personal) or team (shared) level.
>>>>>>> 7ee487ff45e6c74e190c28b867faabef13249665
      </Text>

      {/* ── 10.6 Execution ── */}
      <Text style={styles.h2}>10.6 Executing &amp; Monitoring Workflows</Text>

      <Text style={styles.paragraphIndent}>
        Run a workflow manually by opening it in the editor and clicking{" "}
        <Text style={styles.bold}>&quot;▶ Run&quot;</Text>. Execution begins at
        the Trigger node and progresses through connected nodes; status colours
        each node in real time (green = success, red = error). The{" "}
        <Text style={styles.bold}>Executions</Text> page lists every run with
        status, duration, trigger type, and per-node input/output. When a run
        fails, the failed node is highlighted; clicking it reveals the error
        message and stack trace, and the workflow can be edited and re-run
        without losing previous data.
      </Text>

      {/* ── 10.7 Schedule ── */}
      <Text style={styles.h2}>10.7 Scheduling Workflows</Text>

      <Text style={styles.paragraphIndent}>
        Workflows can be automated to run at fixed intervals. From{" "}
        <Text style={styles.bold}>Schedules → + New Schedule</Text>, select the
        target workflow, configure a cron expression (visual builder or manual
        input), choose a timezone, and toggle the schedule active. Common
        patterns:
      </Text>

      <View
        wrap={false}
        style={{
          borderWidth: 1,
<<<<<<< HEAD
          borderColor: "#94a3b8",
          borderRadius: 6,
=======
          borderColor: "#94a3b8", borderRadius: 6,
>>>>>>> 7ee487ff45e6c74e190c28b867faabef13249665
          marginTop: 8,
          marginBottom: 4,
        }}
      >
        <View style={tableHeader}>
          <Text style={cellHead("40%")}>Cron Expression</Text>
          <Text style={cellHead("60%", true)}>Description</Text>
        </View>
        {[
          ["0 9 * * 1-5", "Every weekday at 9:00 AM"],
          ["0 */6 * * *", "Every 6 hours"],
          ["0 0 1 * *", "First day of every month at midnight"],
          ["*/30 * * * *", "Every 30 minutes"],
          ["0 8 * * 1", "Every Monday at 8:00 AM"],
        ].map((row, i, arr) => (
          <View key={i} style={tableRow(i === arr.length - 1)}>
            <Text style={cell("40%", "Courier")}>{row[0]}</Text>
            <Text style={{ ...cell("60%", "Times-Roman", true) }}>
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
        Table 10.2: Common Cron Schedule Examples
      </Text>

      {/* ── 10.8 Team Management ── */}
      <Text style={styles.h2}>10.8 Team Collaboration</Text>

      <Text style={styles.paragraphIndent}>
        Flowgent supports multi-user teams with role-based access control.
<<<<<<< HEAD
        Create a team from{" "}
        <Text style={styles.bold}>Teams → + Create Team</Text>; the creator is
        automatically assigned the <Text style={styles.bold}>Owner</Text> role.
        Owners and Admins can invite members by email and assign roles; the
        invited user must accept the invitation to join.
=======
        Create a team from <Text style={styles.bold}>Teams → + Create Team</Text>;
        the creator is automatically assigned the{" "}
        <Text style={styles.bold}>Owner</Text> role. Owners and Admins can
        invite members by email and assign roles; the invited user must accept
        the invitation to join.
>>>>>>> 7ee487ff45e6c74e190c28b867faabef13249665
      </Text>

      <View
        wrap={false}
        style={{
          borderWidth: 1,
<<<<<<< HEAD
          borderColor: "#94a3b8",
          borderRadius: 6,
=======
          borderColor: "#94a3b8", borderRadius: 6,
>>>>>>> 7ee487ff45e6c74e190c28b867faabef13249665
          marginTop: 8,
          marginBottom: 4,
        }}
      >
        <View style={tableHeader}>
          <Text style={cellHead("20%")}>Role</Text>
          <Text style={cellHead("80%", true)}>Permissions</Text>
        </View>
        {[
          [
            "Owner",
            "Full access — manage team, billing, members, workflows, credentials, settings",
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
        ].map((row, i, arr) => (
          <View key={i} style={tableRow(i === arr.length - 1)}>
            <Text style={cell("20%", "Times-Bold")}>{row[0]}</Text>
            <Text style={{ ...cell("80%", "Times-Roman", true) }}>
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
        Table 10.3: Team Role Permissions Matrix
      </Text>

      {/* ── 10.9 Version History ── */}
      <Text style={styles.h2}>10.9 Version History</Text>

      <Text style={styles.paragraphIndent}>
        Every workflow save creates a timestamped version. Open the{" "}
        <Text style={styles.bold}>History</Text> panel from the editor toolbar
        to view a chronological list, compare any two versions side-by-side, or
        restore the workflow to a previous state with a single click.
      </Text>

      {/* ── 10.10 Webhooks ── */}
      <Text style={styles.h2}>10.10 Webhook Configuration</Text>

      <Text style={styles.paragraphIndent}>
        Adding a <Text style={styles.bold}>Webhook Trigger</Text> node
        auto-generates a unique URL (e.g.,{" "}
        <Text style={styles.bold}>/api/webhooks/abc-123</Text>). Once the
        workflow is enabled, the endpoint accepts POST/GET requests from
        external services; incoming headers, query parameters, and body become
        the trigger node&apos;s output.
      </Text>

      {/* ── 10.11 Troubleshooting ── */}
      <Text style={styles.h2}>10.11 Troubleshooting &amp; FAQ</Text>

      <View
        wrap={false}
        style={{
          borderWidth: 1,
<<<<<<< HEAD
          borderColor: "#94a3b8",
          borderRadius: 6,
=======
          borderColor: "#94a3b8", borderRadius: 6,
>>>>>>> 7ee487ff45e6c74e190c28b867faabef13249665
          marginTop: 8,
          marginBottom: 4,
        }}
      >
        <View style={tableHeader}>
          <Text style={cellHead("40%")}>Issue</Text>
          <Text style={cellHead("60%", true)}>Resolution</Text>
        </View>
        {[
          [
            "Workflow not executing",
            "Ensure the workflow is enabled (active toggle ON) and credentials are configured",
          ],
          [
            "AI node returns error",
            "Verify API key is valid and the provider has remaining quota / balance",
          ],
          [
            "Webhook not receiving data",
            "Confirm workflow is active and the URL is correctly set in the external service",
          ],
          [
            "Schedule not triggering",
            "Validate the cron expression, timezone, and that the schedule is active",
          ],
          [
            "Node connection fails",
            "Drag from output (right) to input (left); ensure handle types match",
          ],
          [
            "Slow execution",
            "Large payloads or rate limits cause delays; insert Delay nodes or batch data",
          ],
        ].map((row, i, arr) => (
          <View key={i} style={tableRow(i === arr.length - 1)}>
            <Text style={cell("40%")}>{row[0]}</Text>
            <Text style={{ ...cell("60%", "Times-Roman", true) }}>
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
        Table 10.4: Common Issues &amp; Resolutions
      </Text>
    </BookPageLayout>
  );
}
