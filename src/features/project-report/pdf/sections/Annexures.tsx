"use client";

import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import BookPageLayout from "../components/BookPageLayout";

/**
 * Annexures section — placed after References
 * Contains: Prisma schema, API endpoint reference, configuration overview
 */
export default function Annexures() {
  return (
    <BookPageLayout chapterTitle="Annexures">
      {/* Title */}
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 24,
            fontFamily: "Times-Bold",
            textAlign: "center",
            marginBottom: 16,
            textTransform: "uppercase",
          }}
        >
          ANNEXURES
        </Text>
        <View style={{ width: 60, height: 3, backgroundColor: "#000000" }} />
      </View>

      {/* ===== Annexure A: Database Schema ===== */}
      <Text style={styles.h2}>Annexure A: Complete Database Schema</Text>
      <Text style={styles.paragraphIndent}>
        The following is the complete list of all 14 Prisma models used in
        Flowgent 1.0, hosted on a{" "}
        <Text style={styles.bold}>Neon PostgreSQL</Text> database. The schema is
        managed via Prisma ORM with migration support.
      </Text>

      {/* Table: All models */}
      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          marginTop: 10,
          marginBottom: 4,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#e8e8e8",
            borderBottomWidth: 1,
            borderBottomColor: "#333333",
          }}
        >
          <Text
            style={{
              width: "5%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
              textAlign: "center",
            }}
          >
            #
          </Text>
          <Text
            style={{
              width: "20%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Model
          </Text>
          <Text
            style={{
              width: "40%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Key Fields
          </Text>
          <Text
            style={{
              width: "35%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
            }}
          >
            Purpose
          </Text>
        </View>
        {/* Rows */}
        {[
          [
            "1",
            "User",
            "id, name, email, emailVerified, image, createdAt",
            "User accounts & authentication",
          ],
          [
            "2",
            "Session",
            "id, userId, token, expiresAt, ipAddress, userAgent",
            "Session management for Better Auth",
          ],
          [
            "3",
            "Account",
            "id, userId, providerId, accountId, accessToken",
            "OAuth provider account linkage",
          ],
          [
            "4",
            "Verification",
            "id, identifier, value, expiresAt",
            "Email verification tokens",
          ],
          [
            "5",
            "Team",
            "id, name, slug, planId, createdById, customerId",
            "Organization / team workspace",
          ],
          [
            "6",
            "TeamMember",
            "id, teamId, userId, role (OWNER/ADMIN/MEMBER/VIEWER)",
            "Team membership with RBAC roles",
          ],
          [
            "7",
            "Invitation",
            "id, teamId, email, role, token, expiresAt, status",
            "Team invite tokens (7-day expiry)",
          ],
          [
            "8",
            "Workflow",
            "id, name, description, nodes (JSON), edges (JSON), isActive, teamId",
            "Workflow definitions with graph data",
          ],
          [
            "9",
            "WorkflowVersion",
            "id, workflowId, version, nodes, edges, settings, message",
            "Versioned snapshots for rollback",
          ],
          [
            "10",
            "Execution",
            "id, workflowId, status, mode, triggerData, result, duration",
            "Execution records & outcomes",
          ],
          [
            "11",
            "Credential",
            "id, name, type, data (encrypted), provider, teamId",
            "Encrypted credential storage",
          ],
          [
            "12",
            "Schedule",
            "id, workflowId, cron, timezone, isActive, nextRunAt",
            "Cron-based scheduling metadata",
          ],
          [
            "13",
            "WebhookEndpoint",
            "id, workflowId, method, secret, isActive, callCount",
            "Auto-generated webhook receivers",
          ],
          [
            "14",
            "AuditLog",
            "id, teamId, userId, action, resource, details, ipAddress",
            "Activity audit trail",
          ],
        ].map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              borderBottomWidth: i < 13 ? 1 : 0,
              borderBottomColor: "#cccccc",
            }}
          >
            <Text
              style={{
                width: "5%",
                padding: 3,
                fontSize: 7,
                textAlign: "center",
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
                fontSize: 7,
                fontFamily: "Times-Bold",
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
                fontSize: 7,
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[2]}
            </Text>
            <Text style={{ width: "35%", padding: 3, fontSize: 7 }}>
              {row[3]}
            </Text>
          </View>
        ))}
      </View>
      <Text
        style={{
          fontSize: 8,
          fontFamily: "Times-Italic",
          textAlign: "center",
          marginTop: 2,
          marginBottom: 16,
        }}
      >
        Table A.1: Complete Prisma Database Schema — 14 Models
      </Text>

      {/* ===== Annexure B: API Endpoints ===== */}
      <Text style={styles.h2}>Annexure B: API Endpoint Reference</Text>
      <Text style={styles.paragraphIndent}>
        The following table lists all HTTP API routes exposed by the
        application, separate from the tRPC procedures.
      </Text>

      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          marginTop: 10,
          marginBottom: 4,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#e8e8e8",
            borderBottomWidth: 1,
            borderBottomColor: "#333333",
          }}
        >
          <Text
            style={{
              width: "15%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Method
          </Text>
          <Text
            style={{
              width: "40%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Endpoint
          </Text>
          <Text
            style={{
              width: "45%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
            }}
          >
            Description
          </Text>
        </View>
        {[
          [
            "ALL",
            "/api/auth/**",
            "Better Auth handler — login, signup, OAuth callbacks",
          ],
          [
            "ALL",
            "/api/trpc/**",
            "tRPC API — 59 type-safe procedures across 7 routers",
          ],
          [
            "GET/POST",
            "/api/webhooks/[id]",
            "Workflow webhook trigger endpoint",
          ],
          [
            "POST",
            "/api/inngest",
            "Inngest event receiver for durable execution",
          ],
          [
            "POST",
            "/api/polar/webhooks",
            "Polar payment/subscription webhooks",
          ],
          [
            "GET",
            "/api/sentry-example-api",
            "Sentry integration test endpoint",
          ],
          [
            "GET",
            "/api/oauth/callback/[provider]",
            "OAuth2 callback handler (Slack, Google, GitHub, Notion)",
          ],
          ["POST", "/api/workflows/import", "Workflow JSON import endpoint"],
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
                width: "15%",
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
                width: "40%",
                padding: 3,
                fontSize: 7,
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[1]}
            </Text>
            <Text style={{ width: "45%", padding: 3, fontSize: 7 }}>
              {row[2]}
            </Text>
          </View>
        ))}
      </View>
      <Text
        style={{
          fontSize: 8,
          fontFamily: "Times-Italic",
          textAlign: "center",
          marginTop: 2,
          marginBottom: 16,
        }}
      >
        Table B.1: HTTP API Endpoints
      </Text>

      {/* ===== Annexure C: tRPC Routers ===== */}
      <Text style={styles.h2}>Annexure C: tRPC Router Procedures</Text>
      <Text style={styles.paragraphIndent}>
        The platform uses 7 tRPC routers with a total of 59 type-safe
        procedures. The following table summarizes each router.
      </Text>

      <View
        wrap={false}
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          marginTop: 10,
          marginBottom: 4,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#e8e8e8",
            borderBottomWidth: 1,
            borderBottomColor: "#333333",
          }}
        >
          <Text
            style={{
              width: "20%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Router
          </Text>
          <Text
            style={{
              width: "15%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
              textAlign: "center",
            }}
          >
            Procedures
          </Text>
          <Text
            style={{
              width: "65%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
            }}
          >
            Key Operations
          </Text>
        </View>
        {[
          [
            "workflows",
            "12",
            "CRUD, duplicate, import/export, toggle active, favorites, folder management",
          ],
          [
            "executions",
            "8",
            "List with cursor pagination, get detail, create, cancel, retry, delete, bulk delete, stats",
          ],
          [
            "credentials",
            "7",
            "CRUD, list by type, encrypt/decrypt, OAuth token refresh",
          ],
          [
            "teams",
            "11",
            "CRUD, member management, invitations, role updates, team switching, slug lookup",
          ],
          [
            "schedules",
            "7",
            "CRUD, toggle active, pause/resume, update cron, next-run preview",
          ],
          [
            "webhooks",
            "6",
            "Create endpoint, regenerate secret, toggle active, get URL, IP allowlisting",
          ],
          [
            "dashboard",
            "8",
            "Stats aggregation, recent workflows, execution timeline, team overview, quick actions",
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
                width: "15%",
                padding: 3,
                fontSize: 7,
                textAlign: "center",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[1]}
            </Text>
            <Text style={{ width: "65%", padding: 3, fontSize: 7 }}>
              {row[2]}
            </Text>
          </View>
        ))}
      </View>
      <Text
        style={{
          fontSize: 8,
          fontFamily: "Times-Italic",
          textAlign: "center",
          marginTop: 2,
          marginBottom: 16,
        }}
      >
        Table C.1: tRPC Router Summary — 59 Total Procedures
      </Text>

      {/* ===== Annexure D: Environment Configuration ===== */}
      <Text style={styles.h2}>Annexure D: Environment Configuration</Text>
      <Text style={styles.paragraphIndent}>
        The application requires the following environment variables for
        deployment. All secrets are stored securely via Netlify environment
        variable management.
      </Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          marginTop: 10,
          marginBottom: 4,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#e8e8e8",
            borderBottomWidth: 1,
            borderBottomColor: "#333333",
          }}
        >
          <Text
            style={{
              width: "35%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Variable
          </Text>
          <Text
            style={{
              width: "65%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
            }}
          >
            Purpose
          </Text>
        </View>
        {[
          ["DATABASE_URL", "Neon PostgreSQL connection string (pooled)"],
          ["DIRECT_DATABASE_URL", "Direct Neon connection for migrations"],
          ["BETTER_AUTH_SECRET", "Session encryption secret for Better Auth"],
          [
            "BETTER_AUTH_URL",
            "Base URL for auth callbacks (https://flowgent.app)",
          ],
          ["GOOGLE_CLIENT_ID / SECRET", "Google OAuth2 credentials"],
          ["GITHUB_CLIENT_ID / SECRET", "GitHub OAuth2 credentials"],
          ["OPENAI_API_KEY", "OpenAI GPT API access key"],
          ["ANTHROPIC_API_KEY", "Anthropic Claude API access key"],
          ["GOOGLE_AI_API_KEY", "Google Gemini API access key"],
          ["SLACK_CLIENT_ID / SECRET", "Slack OAuth2 app credentials"],
          ["NOTION_CLIENT_ID / SECRET", "Notion integration credentials"],
          ["INNGEST_EVENT_KEY", "Inngest event ingestion key"],
          ["INNGEST_SIGNING_KEY", "Inngest webhook signature verification"],
          ["SENTRY_DSN", "Sentry error monitoring data source name"],
          ["POLAR_ACCESS_TOKEN", "Polar subscription management token"],
          ["ENCRYPTION_KEY", "AES-256 key for credential encryption"],
          ["RESEND_API_KEY", "Resend email service API key"],
        ].map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              borderBottomWidth: i < 16 ? 1 : 0,
              borderBottomColor: "#cccccc",
            }}
          >
            <Text
              style={{
                width: "35%",
                padding: 3,
                fontSize: 7,
                fontFamily: "Times-Bold",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[0]}
            </Text>
            <Text style={{ width: "65%", padding: 3, fontSize: 7 }}>
              {row[1]}
            </Text>
          </View>
        ))}
      </View>
      <Text
        style={{
          fontSize: 8,
          fontFamily: "Times-Italic",
          textAlign: "center",
          marginTop: 2,
          marginBottom: 16,
        }}
      >
        Table D.1: Required Environment Variables
      </Text>

      {/* ===== Annexure E: Node Type Reference ===== */}
      <Text style={styles.h2}>Annexure E: Complete Node Type Reference</Text>
      <Text style={styles.paragraphIndent}>
        All 24 node types available in Flowgent 1.0, categorized by function.
      </Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: "#333333",
          marginTop: 10,
          marginBottom: 4,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#e8e8e8",
            borderBottomWidth: 1,
            borderBottomColor: "#333333",
          }}
        >
          <Text
            style={{
              width: "18%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Category
          </Text>
          <Text
            style={{
              width: "25%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Node Type
          </Text>
          <Text
            style={{
              width: "57%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
            }}
          >
            Description
          </Text>
        </View>
        {[
          [
            "Triggers",
            "Manual Trigger",
            "User-initiated workflow execution from UI",
          ],
          [
            "Triggers",
            "Webhook",
            "HTTP endpoint trigger with auto-generated URL",
          ],
          [
            "Triggers",
            "Schedule",
            "Cron-based recurring execution with timezone support",
          ],
          [
            "Logic",
            "IF Condition",
            "Boolean branching based on expression evaluation",
          ],
          ["Logic", "Switch", "Multi-path routing based on value matching"],
          [
            "Logic",
            "Loop",
            "Iterates over arrays with configurable batch size",
          ],
          ["Logic", "Filter", "Filters data arrays based on conditions"],
          ["Logic", "Merge", "Combines data from multiple input branches"],
          ["Data", "Set", "Creates or transforms data with key-value mapping"],
          ["Data", "Sort", "Sorts arrays by specified field and direction"],
          [
            "Data",
            "Code (JS)",
            "Executes custom JavaScript in sandboxed environment",
          ],
          ["Data", "Wait", "Pauses execution for a configurable duration"],
          [
            "HTTP",
            "HTTP Request",
            "Full REST client with method, headers, body, auth",
          ],
          [
            "HTTP",
            "Email (Resend)",
            "Sends emails via Resend API with templates",
          ],
          ["AI", "OpenAI", "GPT-4/3.5 text generation and chat completion"],
          ["AI", "Anthropic", "Claude model text generation"],
          ["AI", "Google Gemini", "Gemini model text generation"],
          [
            "Integration",
            "Slack",
            "Posts messages to Slack channels via OAuth",
          ],
          [
            "Integration",
            "Google Sheets",
            "Reads/writes spreadsheet data via OAuth",
          ],
          [
            "Integration",
            "GitHub",
            "Creates issues, PRs, manages repos via OAuth",
          ],
          [
            "Integration",
            "Notion",
            "Creates/updates Notion pages/databases via OAuth",
          ],
          ["Integration", "Stripe", "Payment and subscription management"],
          ["Integration", "Twilio", "SMS sending via Twilio API"],
          [
            "Utility",
            "Sub-Workflow",
            "Executes another workflow as a nested step",
          ],
        ].map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              borderBottomWidth: i < 23 ? 1 : 0,
              borderBottomColor: "#cccccc",
            }}
          >
            <Text
              style={{
                width: "18%",
                padding: 2,
                fontSize: 6.5,
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
                padding: 2,
                fontSize: 6.5,
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[1]}
            </Text>
            <Text style={{ width: "57%", padding: 2, fontSize: 6.5 }}>
              {row[2]}
            </Text>
          </View>
        ))}
      </View>
      <Text
        style={{
          fontSize: 8,
          fontFamily: "Times-Italic",
          textAlign: "center",
          marginTop: 2,
          marginBottom: 16,
        }}
      >
        Table E.1: Complete Node Type Reference — 24 Node Types
      </Text>

      {/* Summary box */}
      <View
        wrap={false}
        style={{
          marginTop: 16,
          padding: 12,
          borderWidth: 1,
          borderColor: "#333333",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Text
          style={{
            fontSize: 10,
            fontFamily: "Times-Bold",
            textAlign: "center",
            marginBottom: 6,
          }}
        >
          End of Annexures
        </Text>
        <Text style={{ fontSize: 8, textAlign: "center" }}>
          Source Code: https://github.com/kanishKumar11/flowgent | Deployed:
          https://flowgent.app
        </Text>
      </View>
    </BookPageLayout>
  );
}
