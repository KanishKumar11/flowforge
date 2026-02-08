"use client";

import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";

// ── Helper: render a schema table ──────────────────────────────────────────
const SchemaTable = ({
  tableName,
  tableNum,
  fields,
}: {
  tableName: string;
  tableNum: string;
  fields: string[][];
}) => (
  <View style={{ marginBottom: 4 }}>
    <View
      wrap={false}
      style={{
        borderWidth: 1,
        borderColor: "#d1d5db",
        marginTop: 8,
        marginBottom: 4,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* Table name header */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#1e40af",
          borderBottomWidth: 1,
          borderBottomColor: "#1e3a8a",
        }}
      >
        <Text
          style={{
            width: "100%",
            padding: 5,
            fontSize: 9,
            fontFamily: "Times-Bold",
            textAlign: "center",
            color: "#ffffff",
          }}
        >
          {tableName}
        </Text>
      </View>
      {/* Column headers */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#eff6ff",
          borderBottomWidth: 1,
          borderBottomColor: "#bfdbfe",
        }}
      >
        <Text
          style={{
            width: "25%",
            padding: 4,
            fontSize: 9,
            fontFamily: "Times-Bold",
            borderRightWidth: 1,
            borderRightColor: "#bfdbfe",
            color: "#1e40af",
          }}
        >
          Field
        </Text>
        <Text
          style={{
            width: "25%",
            padding: 4,
            fontSize: 9,
            fontFamily: "Times-Bold",
            borderRightWidth: 1,
            borderRightColor: "#bfdbfe",
            color: "#1e40af",
          }}
        >
          Type
        </Text>
        <Text
          style={{
            width: "50%",
            padding: 4,
            fontSize: 9,
            fontFamily: "Times-Bold",
            color: "#1e40af",
          }}
        >
          Constraints
        </Text>
      </View>
      {/* Data rows */}
      {fields.map((row, i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            borderBottomWidth: i < fields.length - 1 ? 1 : 0,
            borderBottomColor: "#e5e7eb",
            backgroundColor: i % 2 === 0 ? "#ffffff" : "#f9fafb",
          }}
        >
          <Text
            style={{
              width: "25%",
              padding: 3,
              fontSize: 7,
              fontFamily: "Courier",
              borderRightWidth: 1,
              borderRightColor: "#e5e7eb",
            }}
          >
            {row[0]}
          </Text>
          <Text
            style={{
              width: "25%",
              padding: 3,
              fontSize: 7,
              borderRightWidth: 1,
              borderRightColor: "#e5e7eb",
            }}
          >
            {row[1]}
          </Text>
          <Text style={{ width: "50%", padding: 3, fontSize: 7 }}>
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
        marginBottom: 8,
      }}
    >
      Table {tableNum}: {tableName} Table Structure
    </Text>
  </View>
);

// ── Helper: render an enum table ───────────────────────────────────────────
const EnumTable = ({
  enumName,
  tableNum,
  values,
}: {
  enumName: string;
  tableNum: string;
  values: string[][];
}) => (
  <View style={{ marginBottom: 4 }}>
    <View
      wrap={false}
      style={{
        borderWidth: 1,
        borderColor: "#d1d5db",
        marginTop: 8,
        marginBottom: 4,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#7c3aed",
          borderBottomWidth: 1,
          borderBottomColor: "#6d28d9",
        }}
      >
        <Text
          style={{
            width: "100%",
            padding: 5,
            fontSize: 9,
            fontFamily: "Times-Bold",
            textAlign: "center",
            color: "#ffffff",
          }}
        >
          {enumName}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#f5f3ff",
          borderBottomWidth: 1,
          borderBottomColor: "#ddd6fe",
        }}
      >
        <Text
          style={{
            width: "30%",
            padding: 4,
            fontSize: 9,
            fontFamily: "Times-Bold",
            borderRightWidth: 1,
            borderRightColor: "#ddd6fe",
            color: "#6d28d9",
          }}
        >
          Value
        </Text>
        <Text
          style={{
            width: "70%",
            padding: 4,
            fontSize: 9,
            fontFamily: "Times-Bold",
            color: "#6d28d9",
          }}
        >
          Description
        </Text>
      </View>
      {values.map((row, i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            borderBottomWidth: i < values.length - 1 ? 1 : 0,
            borderBottomColor: "#e5e7eb",
            backgroundColor: i % 2 === 0 ? "#ffffff" : "#faf5ff",
          }}
        >
          <Text
            style={{
              width: "30%",
              padding: 3,
              fontSize: 7,
              fontFamily: "Courier",
              borderRightWidth: 1,
              borderRightColor: "#e5e7eb",
            }}
          >
            {row[0]}
          </Text>
          <Text style={{ width: "70%", padding: 3, fontSize: 7 }}>
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
        marginBottom: 8,
      }}
    >
      Table {tableNum}: {enumName} Enum Values
    </Text>
  </View>
);

// ── Group heading ──────────────────────────────────────────────────────────
const GroupHeading = ({ children }: { children: string }) => (
  <Text
    style={{
      fontSize: 10,
      fontFamily: "Times-Bold",
      marginTop: 12,
      marginBottom: 4,
    }}
  >
    {children}
  </Text>
);

// ════════════════════════════════════════════════════════════════════════════
// Main component
// ════════════════════════════════════════════════════════════════════════════
export default function DatabaseSchemaSection() {
  return (
    <View>
      <Text style={styles.h3}>7.6.1 Complete Database Schema</Text>
      <Text style={styles.paragraphIndent}>
        The following tables define the complete database schema for the
        Flowgent platform, organized by functional domain. Each table includes
        field names, data types, and constraints as specified in the Prisma
        schema.
      </Text>

      {/* ─── A. Authentication Tables ───────────────────────────────── */}
      <GroupHeading>A. Authentication Tables</GroupHeading>

      <SchemaTable
        tableName="User"
        tableNum="7.4"
        fields={[
          ["id", "String", "PK, Default: cuid()"],
          ["email", "String", "Unique, Not Null"],
          ["name", "String", "Nullable"],
          ["emailVerified", "Boolean", "Not Null, Default: false"],
          ["image", "String", "Nullable"],
          ["createdAt", "DateTime", "Not Null, Default: now()"],
          ["updatedAt", "DateTime", "Not Null, Auto-update"],
        ]}
      />

      <SchemaTable
        tableName="Session"
        tableNum="7.5"
        fields={[
          ["id", "String", "PK, Default: cuid()"],
          ["expiresAt", "DateTime", "Not Null"],
          ["token", "String", "Unique, Not Null"],
          ["createdAt", "DateTime", "Not Null, Default: now()"],
          ["updatedAt", "DateTime", "Not Null, Auto-update"],
          ["ipAddress", "String", "Nullable"],
          ["userAgent", "String", "Nullable"],
          ["userId", "String", "FK \u2192 User, Not Null, Indexed"],
        ]}
      />

      <SchemaTable
        tableName="Account"
        tableNum="7.6"
        fields={[
          ["id", "String", "PK, Default: cuid()"],
          ["accountId", "String", "Not Null"],
          ["providerId", "String", "Not Null"],
          ["userId", "String", "FK \u2192 User, Not Null, Indexed"],
          ["accessToken", "String", "Nullable"],
          ["refreshToken", "String", "Nullable"],
          ["idToken", "String", "Nullable"],
          ["accessTokenExpiresAt", "DateTime", "Nullable"],
          ["refreshTokenExpiresAt", "DateTime", "Nullable"],
          ["scope", "String", "Nullable"],
          ["password", "String", "Nullable"],
          ["createdAt", "DateTime", "Not Null, Default: now()"],
          ["updatedAt", "DateTime", "Not Null, Auto-update"],
        ]}
      />

      <SchemaTable
        tableName="Verification"
        tableNum="7.7"
        fields={[
          ["id", "String", "PK, Default: cuid()"],
          ["identifier", "String", "Not Null"],
          ["value", "String", "Not Null"],
          ["expiresAt", "DateTime", "Not Null"],
          ["createdAt", "DateTime", "Not Null, Default: now()"],
          ["updatedAt", "DateTime", "Not Null, Auto-update"],
        ]}
      />

      {/* ─── B. Workflow Tables ─────────────────────────────────────── */}
      <GroupHeading>B. Workflow Tables</GroupHeading>

      <SchemaTable
        tableName="Workflow"
        tableNum="7.8"
        fields={[
          ["id", "String", "PK, Default: cuid()"],
          ["name", "String", "Not Null"],
          ["description", "String", "Nullable"],
          ["nodes", "Json", "Not Null"],
          ["edges", "Json", "Not Null"],
          ["viewport", "Json", "Nullable"],
          ["settings", "Json", "Nullable"],
          ["folder", "String", "Nullable"],
          ["tags", "String[]", "Array"],
          ["isFavorite", "Boolean", "Not Null, Default: false"],
          ["errorAlertEmail", "String", "Nullable"],
          ["errorAlertSlack", "String", "Nullable"],
          ["errorAlertEnabled", "Boolean", "Not Null, Default: false"],
          ["isActive", "Boolean", "Not Null, Default: true"],
          ["version", "Int", "Not Null, Default: 1"],
          ["userId", "String", "FK \u2192 User, Not Null, Indexed"],
          ["teamId", "String", "FK \u2192 Team, Nullable, Indexed"],
          ["createdAt", "DateTime", "Not Null, Default: now()"],
          ["updatedAt", "DateTime", "Not Null, Auto-update"],
          ["lastExecutedAt", "DateTime", "Nullable"],
        ]}
      />

      <SchemaTable
        tableName="Execution"
        tableNum="7.9"
        fields={[
          ["id", "String", "PK, Default: cuid()"],
          ["status", "ExecutionStatus", "Not Null, Enum, Default: PENDING"],
          ["mode", "ExecutionMode", "Not Null, Enum"],
          ["startedAt", "DateTime", "Not Null, Default: now()"],
          ["finishedAt", "DateTime", "Nullable"],
          ["duration", "Int", "Nullable"],
          ["inputData", "Json", "Nullable"],
          ["outputData", "Json", "Nullable"],
          ["nodeResults", "Json", "Nullable"],
          ["error", "Json", "Nullable"],
          ["workflowId", "String", "FK \u2192 Workflow, Not Null, Indexed"],
          ["userId", "String", "FK \u2192 User, Nullable, Indexed"],
          ["retryOf", "String", "Nullable"],
          ["retryCount", "Int", "Not Null, Default: 0"],
        ]}
      />

      <SchemaTable
        tableName="AuditLog"
        tableNum="7.10"
        fields={[
          ["id", "String", "PK, Default: cuid()"],
          ["action", "String", "Not Null"],
          ["entity", "String", "Not Null"],
          ["entityId", "String", "Nullable"],
          ["details", "Json", "Nullable"],
          ["ipAddress", "String", "Nullable"],
          ["userAgent", "String", "Nullable"],
          ["userId", "String", "FK \u2192 User, Not Null, Indexed"],
          ["createdAt", "DateTime", "Not Null, Default: now()"],
        ]}
      />

      {/* ─── C. Integration Tables ──────────────────────────────────── */}
      <GroupHeading>C. Integration Tables</GroupHeading>

      <SchemaTable
        tableName="Credential"
        tableNum="7.11"
        fields={[
          ["id", "String", "PK, Default: cuid()"],
          ["name", "String", "Not Null"],
          ["type", "String", "Not Null"],
          ["provider", "String", "Not Null"],
          ["data", "String", "Not Null, Encrypted (AES-256)"],
          ["expiresAt", "DateTime", "Nullable"],
          ["refreshToken", "String", "Nullable"],
          ["scope", "String", "Nullable"],
          ["metadata", "Json", "Nullable"],
          ["userId", "String", "FK \u2192 User, Not Null, Indexed"],
          ["createdAt", "DateTime", "Not Null, Default: now()"],
          ["updatedAt", "DateTime", "Not Null, Auto-update"],
          ["lastUsedAt", "DateTime", "Nullable"],
        ]}
      />

      <SchemaTable
        tableName="Schedule"
        tableNum="7.12"
        fields={[
          ["id", "String", "PK, Default: cuid()"],
          ["cronExpression", "String", "Not Null"],
          ["timezone", "String", "Not Null, Default: UTC"],
          ["isActive", "Boolean", "Not Null, Default: true"],
          ["workflowId", "String", "FK \u2192 Workflow, Unique, Not Null"],
          ["nextRunAt", "DateTime", "Nullable"],
          ["lastRunAt", "DateTime", "Nullable"],
          ["createdAt", "DateTime", "Not Null, Default: now()"],
          ["updatedAt", "DateTime", "Not Null, Auto-update"],
        ]}
      />

      <SchemaTable
        tableName="WebhookEndpoint"
        tableNum="7.13"
        fields={[
          ["id", "String", "PK, Default: cuid()"],
          ["path", "String", "Unique, Not Null"],
          ["method", "HttpMethod", "Not Null, Enum, Default: POST"],
          ["isActive", "Boolean", "Not Null, Default: true"],
          ["secretHash", "String", "Nullable"],
          ["ipAllowlist", "String[]", "Array"],
          ["workflowId", "String", "FK \u2192 Workflow, Not Null, Indexed"],
          ["createdAt", "DateTime", "Not Null, Default: now()"],
          ["lastCalledAt", "DateTime", "Nullable"],
          ["callCount", "Int", "Not Null, Default: 0"],
        ]}
      />

      {/* ─── D. Team Tables ─────────────────────────────────────────── */}
      <GroupHeading>D. Team Tables</GroupHeading>

      <SchemaTable
        tableName="Team"
        tableNum="7.14"
        fields={[
          ["id", "String", "PK, Default: cuid()"],
          ["name", "String", "Not Null"],
          ["slug", "String", "Unique, Not Null"],
          ["description", "String", "Nullable"],
          ["image", "String", "Nullable"],
          ["plan", "String", "Not Null, Default: free"],
          ["createdAt", "DateTime", "Not Null, Default: now()"],
          ["updatedAt", "DateTime", "Not Null, Auto-update"],
        ]}
      />

      <SchemaTable
        tableName="Invitation"
        tableNum="7.15"
        fields={[
          ["id", "String", "PK, Default: cuid()"],
          ["email", "String", "Not Null"],
          ["token", "String", "Unique, Not Null"],
          ["teamId", "String", "FK \u2192 Team, Not Null, Indexed"],
          ["role", "String", "Not Null"],
          ["expiresAt", "DateTime", "Not Null"],
          ["createdAt", "DateTime", "Not Null, Default: now()"],
        ]}
      />

      <SchemaTable
        tableName="TeamMember"
        tableNum="7.16"
        fields={[
          ["id", "String", "PK, Default: cuid()"],
          ["role", "TeamRole", "Not Null, Enum, Default: MEMBER"],
          ["teamId", "String", "FK \u2192 Team, Not Null, Indexed"],
          ["userId", "String", "FK \u2192 User, Not Null, Indexed"],
          ["createdAt", "DateTime", "Not Null, Default: now()"],
        ]}
      />

      {/* ─── E. Versioning ──────────────────────────────────────────── */}
      <GroupHeading>E. Versioning</GroupHeading>

      <SchemaTable
        tableName="WorkflowVersion"
        tableNum="7.17"
        fields={[
          ["id", "String", "PK, Default: cuid()"],
          ["versionNum", "Int", "Not Null"],
          ["nodes", "Json", "Not Null"],
          ["edges", "Json", "Not Null"],
          ["viewport", "Json", "Nullable"],
          ["settings", "Json", "Nullable"],
          ["changeMessage", "String", "Nullable"],
          ["workflowId", "String", "FK \u2192 Workflow, Not Null, Indexed"],
          ["createdById", "String", "FK \u2192 User, Nullable, Indexed"],
          ["createdAt", "DateTime", "Not Null, Default: now()"],
        ]}
      />

      {/* ─── 7.6.2 Enumerations ────────────────────────────────────── */}
      <Text style={styles.h3}>7.6.2 Enumerations</Text>
      <Text style={styles.paragraphIndent}>
        The following enumerated types define the valid values for key
        categorical fields in the database schema.
      </Text>

      <EnumTable
        enumName="ExecutionStatus"
        tableNum="7.18"
        values={[
          ["PENDING", "Execution is queued and awaiting processing"],
          ["RUNNING", "Execution is currently in progress"],
          ["SUCCESS", "Execution completed successfully"],
          ["ERROR", "Execution terminated due to an error"],
          ["CANCELLED", "Execution was cancelled by the user"],
          ["WAITING", "Execution is paused waiting for external input"],
        ]}
      />

      <EnumTable
        enumName="ExecutionMode"
        tableNum="7.19"
        values={[
          ["MANUAL", "Triggered manually by a user"],
          ["SCHEDULED", "Triggered by a cron schedule"],
          ["WEBHOOK", "Triggered by an incoming webhook request"],
          ["TRIGGER", "Triggered by an external event or integration"],
          ["SUBWORKFLOW", "Triggered as a child of another workflow"],
        ]}
      />

      <EnumTable
        enumName="HttpMethod"
        tableNum="7.20"
        values={[
          ["GET", "HTTP GET request (read-only)"],
          ["POST", "HTTP POST request (create resource)"],
          ["PUT", "HTTP PUT request (replace resource)"],
          ["PATCH", "HTTP PATCH request (partial update)"],
          ["DELETE", "HTTP DELETE request (remove resource)"],
        ]}
      />

      <EnumTable
        enumName="TeamRole"
        tableNum="7.21"
        values={[
          ["OWNER", "Full control including team deletion and billing"],
          ["ADMIN", "Manage members, workflows, and settings"],
          ["MEMBER", "Create and edit workflows, view executions"],
          ["VIEWER", "Read-only access to workflows and executions"],
        ]}
      />

      {/* ─── F. Entity Relationship Summary ─────────────────────────── */}
      <GroupHeading>F. Entity Relationship Summary</GroupHeading>
      <Text style={styles.paragraphIndent}>
        Table 7.22 provides a consolidated view of all foreign key relationships
        between database entities, including cardinality and referential
        integrity constraints configured in the Prisma schema.
      </Text>

      <View style={{ marginBottom: 4 }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: "#333333",
            marginTop: 8,
            marginBottom: 4,
          }}
        >
          {/* Header row */}
          <View
            wrap={false}
            style={{
              flexDirection: "row",
              backgroundColor: "#e8e8e8",
              borderBottomWidth: 1,
              borderBottomColor: "#333333",
            }}
          >
            <Text
              style={{
                width: "100%",
                padding: 4,
                fontSize: 9,
                fontFamily: "Times-Bold",
                textAlign: "center",
              }}
            >
              Entity Relationship Summary
            </Text>
          </View>
          {/* Column headers */}
          <View
            wrap={false}
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
                padding: 4,
                fontSize: 8,
                fontFamily: "Times-Bold",
                borderRightWidth: 1,
                borderRightColor: "#333333",
              }}
            >
              Parent
            </Text>
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
              Child
            </Text>
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
              FK Field
            </Text>
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
              Cardinality
            </Text>
            <Text
              style={{
                width: "28%",
                padding: 4,
                fontSize: 8,
                fontFamily: "Times-Bold",
              }}
            >
              On Delete
            </Text>
          </View>
          {/* Data rows */}
          {[
            ["User", "Session", "userId", "1 : N", "Cascade"],
            ["User", "Account", "userId", "1 : N", "Cascade"],
            ["User", "Verification", "identifier", "1 : N", "Cascade"],
            ["User", "Workflow", "userId", "1 : N", "Cascade"],
            ["User", "Credential", "userId", "1 : N", "Cascade"],
            ["User", "AuditLog", "userId", "1 : N", "Cascade"],
            ["User", "Invitation", "invitedById", "1 : N", "Cascade"],
            ["User", "TeamMember", "userId", "1 : N", "Cascade"],
            ["Workflow", "Execution", "workflowId", "1 : N", "Cascade"],
            ["Workflow", "WorkflowVersion", "workflowId", "1 : N", "Cascade"],
            ["Workflow", "Schedule", "workflowId", "1 : 1", "Cascade"],
            ["Workflow", "AuditLog", "workflowId", "1 : N", "Set Null"],
            ["Team", "Workflow", "teamId", "1 : N", "Set Null"],
            ["Team", "Invitation", "teamId", "1 : N", "Cascade"],
            ["Team", "TeamMember", "teamId", "1 : N", "Cascade"],
            ["Team", "WebhookEndpoint", "teamId", "1 : N", "Cascade"],
          ].map((row, i, arr) => (
            <View
              key={i}
              wrap={false}
              style={{
                flexDirection: "row",
                borderBottomWidth: i < arr.length - 1 ? 1 : 0,
                borderBottomColor: "#cccccc",
              }}
            >
              <Text
                style={{
                  width: "18%",
                  padding: 3,
                  fontSize: 7,
                  fontFamily: "Courier",
                  borderRightWidth: 1,
                  borderRightColor: "#cccccc",
                }}
              >
                {row[0]}
              </Text>
              <Text
                style={{
                  width: "18%",
                  padding: 3,
                  fontSize: 7,
                  fontFamily: "Courier",
                  borderRightWidth: 1,
                  borderRightColor: "#cccccc",
                }}
              >
                {row[1]}
              </Text>
              <Text
                style={{
                  width: "18%",
                  padding: 3,
                  fontSize: 7,
                  fontFamily: "Courier",
                  borderRightWidth: 1,
                  borderRightColor: "#cccccc",
                }}
              >
                {row[2]}
              </Text>
              <Text
                style={{
                  width: "18%",
                  padding: 3,
                  fontSize: 7,
                  borderRightWidth: 1,
                  borderRightColor: "#cccccc",
                }}
              >
                {row[3]}
              </Text>
              <Text style={{ width: "28%", padding: 3, fontSize: 7 }}>
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
          Table 7.22: Entity Relationship Summary
        </Text>
      </View>
    </View>
  );
}
