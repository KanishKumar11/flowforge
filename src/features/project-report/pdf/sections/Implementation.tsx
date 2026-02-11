"use client";

import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import BookPageLayout from "../components/BookPageLayout";
import DeploymentDiagram from "../diagrams/DeploymentDiagram";
import AINodeFlowDiagram from "../diagrams/AINodeFlowDiagram";
import BFSFlowchart from "../diagrams/BFSFlowchart";

/**
 * Chapter 8: Implementation
 * Covers module-wise implementation, code snippets, architecture, and key features.
 */
export default function Implementation() {
  return (
    <BookPageLayout chapterTitle="Implementation" chapterNum="08">
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
          CHAPTER 8
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
          IMPLEMENTATION
        </Text>
        <View style={{ width: 60, height: 3, backgroundColor: "#000000" }} />
      </View>

      {/* 8.1 Introduction */}
      <Text style={styles.h2}>8.1 Introduction</Text>
      <Text style={styles.paragraphIndent}>
        This chapter presents the implementation details of Flowgent 1.0,
        covering the project structure, module-wise development approach, key
        code patterns, and the implementation of all major features. The
        platform was developed using <Text style={styles.bold}>TypeScript</Text>{" "}
        as the primary language with <Text style={styles.bold}>Next.js 16</Text>{" "}
        (App Router) as the full-stack framework. The source code is hosted on
        GitHub at{" "}
        <Text style={styles.bold}>
          https://github.com/kanishKumar11/flowgent
        </Text>{" "}
        and the production deployment is accessible at{" "}
        <Text style={styles.bold}>https://flowgent.app</Text>.
      </Text>
      <Text style={styles.paragraphIndent}>
        The implementation follows a modular architecture with clear separation
        of concerns. The codebase consists of approximately 18,000 lines of
        TypeScript/React code organized into feature modules, shared components,
        API routers, and utility libraries.
      </Text>

      {/* 8.2 Project Structure */}
      <Text style={styles.h2}>8.2 Project Structure</Text>
      <Text style={styles.paragraphIndent}>
        The project follows the Next.js App Router convention with a
        feature-based organization pattern. The directory structure separates
        concerns into distinct areas for maintainability and scalability.
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
            backgroundColor: "#D9E2F3",
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
            Directory
          </Text>
          <Text
            style={{
              width: "70%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Purpose
          </Text>
        </View>
        {[
          ["src/app/", "Next.js App Router pages, layouts, and API routes"],
          ["src/features/", "Feature modules (editor, workflows, teams, etc.)"],
          [
            "src/components/",
            "Shared UI components (header, sidebar, 54 UI primitives)",
          ],
          ["src/trpc/", "tRPC client, server, and API routers (7 routers)"],
          ["src/lib/", "Utility libraries (auth, db, email, plans, templates)"],
          ["src/inngest/", "Background job definitions (execution engine)"],
          ["src/hooks/", "Custom React hooks (useDebounce, useMobile)"],
          ["prisma/", "Database schema and migrations"],
          ["public/", "Static assets (images, icons)"],
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
          marginBottom: 12,
        }}
      >
        Table 8.1: Project Directory Structure
      </Text>

      {/* 8.3 Frontend Implementation */}
      <Text style={styles.h2}>8.3 Frontend Implementation</Text>

      <Text style={styles.h3}>8.3.1 Visual Workflow Editor</Text>
      <Text style={styles.paragraphIndent}>
        The visual workflow editor is the core feature of Flowgent, implemented
        using <Text style={styles.bold}>@xyflow/react</Text> (React Flow). The
        editor provides a full-featured canvas for building automation workflows
        through drag-and-drop interaction.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Key Components:</Text>
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>WorkflowEditor.tsx:</Text> Main canvas
          component with React Flow integration, undo/redo history, auto-save,
          and keyboard shortcuts
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>NodePalette.tsx:</Text> Searchable
          drag-and-drop palette displaying all 24 node types organized by
          category (Triggers, Logic, Data, Actions, AI, Integrations)
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>NodeConfigPanel.tsx:</Text> Dynamic
          configuration side panel that adapts its form fields based on the
          selected node type
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>TriggerNode.tsx / ActionNode.tsx:</Text>{" "}
          Custom node renderers with status indicators, connection handles, and
          execution result badges
        </Text>
      </View>
      <Text style={styles.paragraph}>
        The editor serializes the visual graph (nodes, edges, viewport) into a
        JSON structure stored in the PostgreSQL database. This JSON
        representation serves as the workflow definition that the execution
        engine processes.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Code Snippet — React Flow Editor Hook:</Text>
      </Text>
      <View
        style={{
          backgroundColor: "#f5f5f5",
          borderWidth: 1,
          borderColor: "#cccccc",
          padding: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 7.5, fontFamily: "Courier", lineHeight: 1.4 }}>
          {`// src/features/editor/hooks/useWorkflowEditor.ts
import { useCallback, useRef } from "react";
import {
  useNodesState, useEdgesState, addEdge,
  type Connection, type Edge, type Node,
} from "@xyflow/react";
import { api } from "@/trpc/client";

export function useWorkflowEditor(workflowId: string) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowRef = useRef<HTMLDivElement>(null);

  const saveWorkflow = api.workflow.save.useMutation();

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  const handleSave = useCallback(async () => {
    await saveWorkflow.mutateAsync({
      id: workflowId,
      nodes: JSON.stringify(nodes),
      edges: JSON.stringify(edges),
    });
  }, [nodes, edges, workflowId, saveWorkflow]);

  return {
    nodes, edges, reactFlowRef,
    onNodesChange, onEdgesChange, onConnect,
    handleSave, isSaving: saveWorkflow.isPending,
  };
}`}
        </Text>
      </View>

      <Text style={styles.h3}>8.3.2 Dashboard Interface</Text>
      <Text style={styles.paragraphIndent}>
        The dashboard provides users with an overview of their automation
        activity. Key components include:
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>StatsCards:</Text> Display total
          workflows, executions, success rate, and active schedules
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>RecentWorkflows:</Text> Quick access to
          recently modified workflows
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>QuickActions:</Text> Shortcuts for
          creating workflows, browsing templates, and managing credentials
        </Text>
      </View>

      <Text style={styles.h3}>8.3.3 UI Component Library</Text>
      <Text style={styles.paragraphIndent}>
        Flowgent uses <Text style={styles.bold}>shadcn/ui</Text> with{" "}
        <Text style={styles.bold}>Tailwind CSS v4</Text> for its component
        library. A total of <Text style={styles.bold}>54 UI components</Text>{" "}
        are available including buttons, dialogs, forms, tables, toasts,
        tooltips, command palette, and more. The component library ensures
        consistency across the application and supports both light and dark
        themes via <Text style={styles.bold}>next-themes</Text>.
      </Text>

      {/* 8.4 Backend Implementation */}
      <Text style={styles.h2}>8.4 Backend Implementation</Text>

      <Text style={styles.h3}>8.4.1 tRPC API Layer</Text>
      <Text style={styles.paragraphIndent}>
        The API layer is implemented using{" "}
        <Text style={styles.bold}>tRPC v11</Text>, providing end-to-end type
        safety between the client and server. All API procedures are
        type-checked at compile time, eliminating runtime type errors. The API
        is organized into <Text style={styles.bold}>7 routers</Text> with a
        total of <Text style={styles.bold}>59 procedures</Text>.
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
            backgroundColor: "#D9E2F3",
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
            Router
          </Text>
          <Text
            style={{
              width: "15%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
              borderRightWidth: 1,
              borderRightColor: "#333333",
            }}
          >
            Procedures
          </Text>
          <Text
            style={{
              width: "65%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Key Operations
          </Text>
        </View>
        {[
          [
            "workflows",
            "21",
            "CRUD, execute, export/import, versioning, favorites, search, templates, error alerts",
          ],
          [
            "credentials",
            "6",
            "Create, update, delete, encrypted storage, decryption for execution",
          ],
          [
            "executions",
            "7",
            "List, detail, stats, cancel, retry, timeline analytics, delete",
          ],
          [
            "schedules",
            "7",
            "CRUD, toggle active, cron presets, human-readable descriptions",
          ],
          [
            "webhooks",
            "5",
            "Create, update, delete, regenerate URL path, list",
          ],
          [
            "teams",
            "9",
            "CRUD, invite members, remove, update roles, accept invitation",
          ],
          [
            "audit",
            "4",
            "List logs, entity history, create entry, activity summary",
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
                width: "15%",
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
              style={{ width: "65%", padding: 4, fontSize: 7, lineHeight: 1.3 }}
            >
              {row[2]}
            </Text>
          </View>
        ))}
        <View style={{ flexDirection: "row", backgroundColor: "#D9E2F3" }}>
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
            Total
          </Text>
          <Text
            style={{
              width: "15%",
              padding: 5,
              fontSize: 9,
              fontFamily: "Times-Bold",
              textAlign: "center",
            }}
          >
            59
          </Text>
          <Text style={{ width: "65%", padding: 5, fontSize: 9 }}></Text>
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
        Table 8.2: tRPC Router Summary
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Code Snippet — tRPC Router Definition:</Text>
      </Text>
      <View
        style={{
          backgroundColor: "#f5f5f5",
          borderWidth: 1,
          borderColor: "#cccccc",
          padding: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 7.5, fontFamily: "Courier", lineHeight: 1.4 }}>
          {`// src/trpc/routers/_app.ts
import { router } from "../init";
import { workflowsRouter } from "./workflows";
import { credentialsRouter } from "./credentials";
import { executionsRouter } from "./executions";
import { schedulesRouter } from "./schedules";
import { webhooksRouter } from "./webhooks";
import { teamsRouter } from "./teams";
import { auditRouter } from "./audit";

export const appRouter = router({
  workflows: workflowsRouter,
  credentials: credentialsRouter,
  executions: executionsRouter,
  schedules: schedulesRouter,
  webhooks: webhooksRouter,
  teams: teamsRouter,
  audit: auditRouter,
});

export type AppRouter = typeof appRouter;`}
        </Text>
      </View>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>
          Code Snippet — tRPC Protected Procedure:
        </Text>
      </Text>
      <View
        style={{
          backgroundColor: "#f5f5f5",
          borderWidth: 1,
          borderColor: "#cccccc",
          padding: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 7.5, fontFamily: "Courier", lineHeight: 1.4 }}>
          {`// src/trpc/init.ts
import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth";

const t = initTRPC.context<Context>().create();
export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({ headers: ctx.headers });
  if (!session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user: session.user, session } });
});`}
        </Text>
      </View>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>
          Code Snippet — tRPC Create Workflow Route:
        </Text>
      </Text>
      <View
        style={{
          backgroundColor: "#f5f5f5",
          borderWidth: 1,
          borderColor: "#cccccc",
          padding: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 7.5, fontFamily: "Courier", lineHeight: 1.4 }}>
          {`// src/trpc/routers/workflow.ts
export const workflowRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      description: z.string().optional(),
      teamId: z.string().optional(),
      templateId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await ctx.db.workflow.create({
        data: {
          name: input.name,
          description: input.description ?? "",
          userId: ctx.user.id,
          teamId: input.teamId,
          nodes: "[]",
          edges: "[]",
          viewport: JSON.stringify({ x: 0, y: 0, zoom: 1 }),
          status: "DRAFT",
          version: 1,
        },
      });
      return { id: workflow.id, name: workflow.name };
    }),
});`}
        </Text>
      </View>

      <Text style={styles.h3}>8.4.2 Database Layer (Prisma ORM)</Text>
      <Text style={styles.paragraphIndent}>
        The database layer uses <Text style={styles.bold}>Prisma ORM</Text> with{" "}
        <Text style={styles.bold}>PostgreSQL</Text> as the database engine. The
        schema defines <Text style={styles.bold}>14 models</Text> and{" "}
        <Text style={styles.bold}>4 enums</Text> covering all aspects of the
        platform.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Code Snippet — Core Workflow Model:</Text>
      </Text>
      <View
        style={{
          backgroundColor: "#f5f5f5",
          borderWidth: 1,
          borderColor: "#cccccc",
          padding: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 7.5, fontFamily: "Courier", lineHeight: 1.4 }}>
          {`model Workflow {
  id          String   @id @default(cuid())
  name        String
  description String?
  nodes       Json     @default("[]")
  edges       Json     @default("[]")
  viewport    Json?
  settings    Json?
  folder      String?
  tags        String[] @default([])
  isFavorite  Boolean  @default(false)
  isActive    Boolean  @default(true)
  version     Int      @default(1)
  errorAlertEmail   String?
  errorAlertSlack   String?
  errorAlertEnabled Boolean @default(false)
  userId      String
  teamId      String?
  user        User     @relation(...)
  team        Team?    @relation(...)
  executions  Execution[]
  schedules   Schedule[]
  webhooks    WebhookEndpoint[]
  versions    WorkflowVersion[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}`}
        </Text>
      </View>

      <Text style={styles.h3}>8.4.3 Authentication System</Text>
      <Text style={styles.paragraphIndent}>
        Authentication is implemented using{" "}
        <Text style={styles.bold}>Better Auth</Text> with both email/password
        and OAuth (Google, GitHub) login methods. The system automatically
        creates a personal team workspace with OWNER role when a new user signs
        up. Session management uses secure HTTP-only cookies with automatic
        refresh.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Code Snippet — Auth Configuration:</Text>
      </Text>
      <View
        style={{
          backgroundColor: "#f5f5f5",
          borderWidth: 1,
          borderColor: "#cccccc",
          padding: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 7.5, fontFamily: "Courier", lineHeight: 1.4 }}>
          {`// src/lib/auth.ts
export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    polar({
      clientId: env.POLAR_CLIENT_ID,
      checkout: { enabled: true },
      portal: { enabled: true },
    }),
  ],
});`}
        </Text>
      </View>

      {/* 8.5 Workflow Execution Engine */}
      <Text style={styles.h2}>8.5 Workflow Execution Engine</Text>
      <Text style={styles.paragraphIndent}>
        The execution engine is the heart of Flowgent, responsible for
        interpreting workflow definitions and executing each node in the correct
        order. It is implemented using <Text style={styles.bold}>Inngest</Text>{" "}
        for durable, fault-tolerant execution.
      </Text>

      <Text style={styles.h3}>8.5.1 BFS Graph Traversal</Text>
      <Text style={styles.paragraphIndent}>
        When a workflow is triggered, the execution engine performs a
        Breadth-First Search (BFS) traversal of the workflow graph starting from
        the trigger node. Each node is executed as a separate Inngest step,
        ensuring that failures at any point can be retried without re-executing
        previously successful steps.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Code Snippet — Workflow Execution Core:</Text>
      </Text>
      <View
        style={{
          backgroundColor: "#f5f5f5",
          borderWidth: 1,
          borderColor: "#cccccc",
          padding: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 7.5, fontFamily: "Courier", lineHeight: 1.4 }}>
          {`// src/inngest/functions.ts
export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow", retries: 3 },
  { event: "workflow/execute" },
  async ({ event, step }) => {
    // 1. Load workflow definition
    const workflow = await step.run("load-workflow", () =>
      db.workflow.findUnique({ where: { id: event.data.workflowId } })
    );
    // 2. BFS traversal from trigger node
    const queue = [triggerNode];
    const visited = new Set();
    while (queue.length > 0) {
      const node = queue.shift();
      if (visited.has(node.id)) continue;
      visited.add(node.id);
      // 3. Execute each node as a durable step
      const result = await step.run(
        \`execute-\${node.id}\`,
        () => executeNode(node, context)
      );
      // 4. Handle conditional branching
      if (node.type === "if" || node.type === "switch") {
        const nextEdges = getMatchingEdges(node, result);
        nextEdges.forEach(e => queue.push(findNode(e.target)));
      } else {
        getOutgoingNodes(node).forEach(n => queue.push(n));
      }
    }
  }
);`}
        </Text>
      </View>

      <View style={{ marginTop: 12, marginBottom: 4 }} break>
        <BFSFlowchart />
      </View>
      <Text
        style={{
          fontSize: 9,
          fontFamily: "Times-Italic",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Figure 8.1: BFS Workflow Execution Algorithm — Flowchart
      </Text>

      <Text style={styles.h3}>8.5.2 Node Executors</Text>
      <Text style={styles.paragraphIndent}>
        Each of the 24 node types has a dedicated executor function that handles
        its specific logic. The executor receives the node configuration and
        execution context (including results from previous nodes) and returns a
        result object. A Strategy pattern is used to select the appropriate
        executor at runtime.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>
          Code Snippet — HTTP Request Node Executor:
        </Text>
      </Text>
      <View
        style={{
          backgroundColor: "#f5f5f5",
          borderWidth: 1,
          borderColor: "#cccccc",
          padding: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 7.5, fontFamily: "Courier", lineHeight: 1.4 }}>
          {`// src/inngest/executors/httpRequestExecutor.ts
import type { NodeData, ExecutionResult } from "@/types";

export async function executeHttpRequest(
  node: NodeData,
  context: Record<string, unknown>
): Promise<ExecutionResult> {
  const { url, method, headers, body } = node.config;
  const resolvedUrl = resolveTemplate(url, context);
  const resolvedBody = body ? resolveTemplate(body, context) : undefined;

  const startTime = Date.now();
  const response = await fetch(resolvedUrl, {
    method: method || "GET",
    headers: parseHeaders(headers, context),
    body: resolvedBody,
  });

  const data = await response.json();
  return {
    success: response.ok,
    data,
    statusCode: response.status,
    duration: Date.now() - startTime,
    error: response.ok ? null : data.message ?? "Request failed",
  };
}`}
        </Text>
      </View>

      <Text style={styles.h3}>8.5.3 Scheduled Execution</Text>
      <Text style={styles.paragraphIndent}>
        A second Inngest function runs every minute, polling the database for
        schedules that are due for execution. When a schedule's{" "}
        <Text style={styles.bold}>nextRunAt</Text> timestamp has passed, it
        triggers the workflow execution and updates the next run time based on
        the cron expression. The <Text style={styles.bold}>cron-helper</Text>{" "}
        utility library provides 10 preset cron expressions and human-readable
        descriptions.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>
          Code Snippet — Scheduled Workflow Polling:
        </Text>
      </Text>
      <View
        style={{
          backgroundColor: "#f5f5f5",
          borderWidth: 1,
          borderColor: "#cccccc",
          padding: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 7.5, fontFamily: "Courier", lineHeight: 1.4 }}>
          {`// src/inngest/functions.ts
export const pollSchedules = inngest.createFunction(
  { id: "poll-schedules" },
  { cron: "* * * * *" }, // Every minute
  async ({ step }) => {
    const dueSchedules = await step.run("find-due", () =>
      db.schedule.findMany({
        where: {
          isActive: true,
          nextRunAt: { lte: new Date() },
        },
        include: { workflow: true },
      })
    );
    for (const schedule of dueSchedules) {
      await step.run(\`trigger-\${schedule.id}\`, async () => {
        await inngest.send({
          name: "workflow/execute",
          data: { workflowId: schedule.workflowId, mode: "SCHEDULED" },
        });
        // Update next run time
        const next = getNextCronDate(schedule.cronExpression, schedule.timezone);
        await db.schedule.update({
          where: { id: schedule.id },
          data: { nextRunAt: next, lastRunAt: new Date() },
        });
      });
    }
  }
);`}
        </Text>
      </View>

      {/* 8.6 Node Types Implementation */}
      <Text style={styles.h2}>8.6 Node Types Implementation</Text>
      <Text style={styles.paragraphIndent}>
        Flowgent implements <Text style={styles.bold}>24 node types</Text>{" "}
        across two categories: 3 Trigger nodes and 21 Action nodes. Each node
        type consists of a frontend component (for the editor), a configuration
        schema, and a backend executor.
      </Text>

      <View
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
            backgroundColor: "#D9E2F3",
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
              width: "22%",
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
              width: "60%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
            }}
          >
            Implementation Details
          </Text>
        </View>
        {[
          ["Triggers", "manual", "User-initiated via dashboard button click"],
          [
            "",
            "webhook",
            "Dynamic HTTP endpoint with nanoid-generated paths, IP allowlist, secret hash validation",
          ],
          [
            "",
            "schedule",
            "Cron-based via Inngest polling, timezone-aware, configurable expressions",
          ],
          [
            "Logic",
            "if",
            "Boolean expression evaluation, conditional branching with true/false edges",
          ],
          [
            "",
            "switch",
            "Multi-case matching with default fallback, routes execution to matched branch",
          ],
          [
            "",
            "loop",
            "Array iteration with expression-based item access, sequential sub-execution",
          ],
          [
            "",
            "filter",
            "Array filtering with condition evaluation, outputs filtered results",
          ],
          [
            "",
            "merge",
            "Combines multiple inputs via combine, append, or multiplex modes",
          ],
          [
            "Data",
            "set",
            "Set/overwrite context variables for downstream nodes",
          ],
          ["", "sort", "Sort arrays by specified field and order (asc/desc)"],
          [
            "",
            "code",
            "Sandboxed JavaScript execution via new Function() constructor",
          ],
          ["", "wait", "Configurable delay using Inngest step.sleep()"],
          [
            "HTTP",
            "http-request",
            "Full REST client: GET/POST/PUT/PATCH/DELETE with headers, body, auth",
          ],
          [
            "",
            "email",
            "SMTP email sending via Nodemailer with HTML template support",
          ],
          [
            "AI",
            "openai",
            "Chat completions API supporting GPT-4o, GPT-4o-mini with temperature, max tokens",
          ],
          [
            "",
            "(anthropic)",
            "Claude models via Anthropic API with system prompts",
          ],
          ["", "(gemini)", "Google Gemini models via generativelanguage API"],
          [
            "Services",
            "slack",
            "Post messages to channels via @slack/web-api OAuth integration",
          ],
          [
            "",
            "google_sheets",
            "Append rows and read data via Google Sheets API",
          ],
          [
            "",
            "github",
            "Create/list issues via GitHub REST API with OAuth tokens",
          ],
          [
            "",
            "notion",
            "Create pages and query databases via @notionhq/client",
          ],
          [
            "",
            "stripe",
            "Create payment intents, list customers via Stripe API",
          ],
          ["", "twilio", "Send SMS messages via Twilio REST API"],
          [
            "Other",
            "sub-workflow",
            "Execute another workflow as a child, creating linked execution records",
          ],
          [
            "",
            "comment",
            "Documentation-only node, no execution — for annotating workflows",
          ],
        ].map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              borderBottomWidth: i < 24 ? 1 : 0,
              borderBottomColor: "#cccccc",
            }}
          >
            <Text
              style={{
                width: "18%",
                padding: 3,
                fontSize: 7,
                fontFamily: row[0] ? "Times-Bold" : "Times-Roman",
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[0]}
            </Text>
            <Text
              style={{
                width: "22%",
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
              style={{ width: "60%", padding: 3, fontSize: 7, lineHeight: 1.3 }}
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
        Table 8.3: Complete Node Types Implementation (24 Total)
      </Text>

      {/* 8.7 Integration Implementation */}
      <Text style={styles.h2}>8.7 Integration Implementation</Text>

      <Text style={styles.h3}>8.7.1 OAuth2 Flow</Text>
      <Text style={styles.paragraphIndent}>
        Flowgent implements OAuth2 authorization code flow for connecting
        third-party services. Four OAuth providers are supported:{" "}
        <Text style={styles.bold}>Slack, Google, GitHub, and Notion</Text>, each
        with dedicated connect and callback API routes.
      </Text>
      <Text style={styles.paragraph}>
        The OAuth flow works as follows: (1) User clicks "Connect" in credential
        management, (2) GET /api/oauth/[provider]/connect redirects to the
        provider's authorization URL with required scopes, (3) User authorizes
        the application, (4) GET /api/oauth/[provider]/callback receives the
        authorization code, (5) Server exchanges code for access/refresh tokens,
        (6) Tokens are encrypted and stored as a Credential record.
      </Text>

      <Text style={styles.h3}>8.7.2 AI Provider Integration</Text>
      <Text style={styles.paragraphIndent}>
        The AI integration node supports three providers through a unified
        interface. The node executor routes requests to the appropriate API
        based on the selected provider:
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>OpenAI:</Text> POST to
          api.openai.com/v1/chat/completions — supports GPT-4o, GPT-4o-mini
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Anthropic:</Text> POST to
          api.anthropic.com/v1/messages — supports Claude 3.5 Sonnet, Opus
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Google Gemini:</Text> POST to
          generativelanguage.googleapis.com — supports Gemini Pro, Flash
        </Text>
      </View>

      <Text style={styles.h3}>8.7.3 Limitations of AI Nodes</Text>
      <Text style={styles.paragraphIndent}>
        While the AI integration provides powerful capabilities, several
        inherent limitations must be acknowledged for transparent system
        documentation:
      </Text>

      <View
        wrap={false}
        style={{ alignItems: "center", marginTop: 8, marginBottom: 8 }}
      >
        <AINodeFlowDiagram />
      </View>
      <Text
        style={{
          fontSize: 9,
          fontFamily: "Times-Italic",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Figure 8.2: AI Node Execution Pipeline
      </Text>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 10, marginBottom: 6, lineHeight: 1.5 }}>
          • <Text style={styles.bold}>API Dependency:</Text> All AI operations
          require active internet connectivity and rely on third-party API
          availability. Provider outages directly impact workflow execution.
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 6, lineHeight: 1.5 }}>
          • <Text style={styles.bold}>Cost Accumulation:</Text> Each API call
          incurs token-based charges. Complex workflows with multiple AI nodes
          can accumulate significant costs, especially with GPT-4o or Claude
          Opus models.
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 6, lineHeight: 1.5 }}>
          • <Text style={styles.bold}>Non-Deterministic Output:</Text> LLM
          responses are inherently non-deterministic. Identical prompts may
          produce different outputs across executions, making workflow results
          less predictable than traditional logic nodes.
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 6, lineHeight: 1.5 }}>
          • <Text style={styles.bold}>Token Limits:</Text> Each model has input
          and output token limits (e.g., GPT-4o: 128K input, 16K output). Large
          payloads may be truncated or rejected, requiring chunking strategies
          not yet implemented.
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 6, lineHeight: 1.5 }}>
          • <Text style={styles.bold}>No Streaming Support:</Text> The current
          implementation waits for the complete response before passing data to
          the next node, adding latency for long-form generation tasks.
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 6, lineHeight: 1.5 }}>
          • <Text style={styles.bold}>Rate Limiting:</Text> API providers
          enforce rate limits (requests per minute). High-volume workflows may
          encounter throttling, requiring queuing logic handled by Inngest.
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 6, lineHeight: 1.5 }}>
          • <Text style={styles.bold}>No Fine-Tuning:</Text> The platform uses
          models via inference APIs only. Custom model fine-tuning or training
          on domain-specific data is not supported.
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 6, lineHeight: 1.5 }}>
          • <Text style={styles.bold}>Hallucination Risk:</Text> AI models may
          generate factually incorrect outputs. No built-in fact-checking or
          validation layer is provided — users must verify AI-generated content
          before acting on it.
        </Text>
      </View>

      <Text style={styles.h3}>8.7.4 Integration Registry</Text>
      <Text style={styles.paragraphIndent}>
        A centralized integration registry (src/lib/integrations/registry.ts)
        defines all available integrations with their operations, required
        scopes, and authentication methods. This registry-driven approach allows
        adding new integrations by simply registering them without modifying the
        core execution engine.
      </Text>

      {/* 8.8 Key Features Implementation */}
      <Text style={styles.h2}>8.8 Key Features Implementation</Text>

      <Text style={styles.h3}>8.8.1 Credential Management</Text>
      <Text style={styles.paragraphIndent}>
        Credentials (API keys, OAuth tokens, bearer tokens) are stored with{" "}
        <Text style={styles.bold}>AES-256 encryption</Text> in the database. The
        data field containing sensitive information is encrypted before storage
        and decrypted only during workflow execution. Credential metadata (name,
        type, provider) is stored in plaintext for listing purposes without
        exposing secrets.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Code Snippet — Credential Encryption:</Text>
      </Text>
      <View
        style={{
          backgroundColor: "#f5f5f5",
          borderWidth: 1,
          borderColor: "#cccccc",
          padding: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 7.5, fontFamily: "Courier", lineHeight: 1.4 }}>
          {`// src/features/credentials/credential-utils.ts
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");

export function encryptCredential(data: Record<string, unknown>) {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag().toString("hex");
  return { iv: iv.toString("hex"), encrypted, tag };
}

export function decryptCredential(stored: { iv: string; encrypted: string; tag: string }) {
  const decipher = createDecipheriv(ALGORITHM, KEY, Buffer.from(stored.iv, "hex"));
  decipher.setAuthTag(Buffer.from(stored.tag, "hex"));
  let decrypted = decipher.update(stored.encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
}`}
        </Text>
      </View>

      <Text style={styles.h3}>8.8.2 Workflow Versioning</Text>
      <Text style={styles.paragraphIndent}>
        Every time a workflow's nodes or edges are modified, the system
        automatically creates a version snapshot in the{" "}
        <Text style={styles.bold}>WorkflowVersion</Text> table. Users can view
        the complete version history and rollback to any previous version. Each
        version stores the full nodes, edges, viewport, and settings JSON along
        with a version number and optional change message.
      </Text>

      <Text style={styles.h3}>8.8.3 Import/Export</Text>
      <Text style={styles.paragraphIndent}>
        Workflows can be exported to a portable JSON format containing the
        workflow definition (nodes, edges, viewport, settings) and metadata. The
        import procedure accepts this JSON format and creates a new workflow,
        enabling sharing and backup capabilities.
      </Text>

      <Text style={styles.paragraphIndent}>
        The visual workflow editor is built using React Flow with custom node
        components. Each node type has a dedicated renderer that displays its
        configuration and status.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>
          Code Snippet — Visual Workflow Editor Setup:
        </Text>
      </Text>
      <View
        style={{
          backgroundColor: "#f5f5f5",
          borderWidth: 1,
          borderColor: "#cccccc",
          padding: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 7.5, fontFamily: "Courier", lineHeight: 1.4 }}>
          {`// src/features/editor/components/WorkflowEditor.tsx
"use client";
import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import { useWorkflowEditor } from "../hooks/useWorkflowEditor";
import { nodeTypes } from "./nodes";
import { edgeTypes } from "./edges";

export function WorkflowEditor({ workflowId }: { workflowId: string }) {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useWorkflowEditor(workflowId);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
}`}
        </Text>
      </View>

      <Text style={styles.h3}>8.8.4 Workflow Templates</Text>
      <Text style={styles.paragraphIndent}>
        Five built-in workflow templates are provided in src/lib/templates.ts to
        help users get started quickly:
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
            Template
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
            Category
          </Text>
          <Text
            style={{
              width: "50%",
              padding: 4,
              fontSize: 9,
              fontFamily: "Times-Bold",
            }}
          >
            Nodes Used
          </Text>
        </View>
        {[
          ["Webhook to Slack", "Notifications", "webhook → slack"],
          [
            "Daily Report Generator",
            "Scheduled",
            "schedule → http-request → email",
          ],
          ["AI Content Generator", "AI", "manual → openai → notion"],
          [
            "Data Sync Pipeline",
            "Data",
            "schedule → http-request → loop → google_sheets",
          ],
          ["GitHub Issue Notifier", "Developer", "webhook → if → slack"],
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
                padding: 3,
                fontSize: 8,
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
                borderRightWidth: 1,
                borderRightColor: "#cccccc",
              }}
            >
              {row[1]}
            </Text>
            <Text style={{ width: "50%", padding: 3, fontSize: 8 }}>
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
        Table 8.4: Built-in Workflow Templates
      </Text>

      <Text style={styles.h3}>8.8.5 Error Alerting</Text>
      <Text style={styles.paragraphIndent}>
        Each workflow can be configured with error alerting via email and/or
        Slack webhook. When a workflow execution fails, the system automatically
        sends a notification to the configured alert channels. The{" "}
        <Text style={styles.bold}>ErrorAlertSettings</Text> component provides a
        UI for configuring alert email addresses and Slack webhook URLs.
      </Text>

      <Text style={styles.h3}>8.8.6 Subscription & Billing</Text>
      <Text style={styles.paragraphIndent}>
        Flowgent integrates with <Text style={styles.bold}>Polar</Text> for
        subscription management. Two plans are offered: Free (3 workflows, 100
        executions/month, 1 team member) and Pro (100 workflows, 10,000
        executions/month, 10 team members, API access, priority support). Plan
        limits are enforced at the API layer when creating workflows, executing
        workflows, and inviting team members.
      </Text>

      <Text style={styles.h3}>8.8.7 Audit Logging</Text>
      <Text style={styles.paragraphIndent}>
        All significant user actions are recorded in the{" "}
        <Text style={styles.bold}>AuditLog</Text> table, capturing the action
        type, entity, entity ID, details, IP address, and user agent. The audit
        trail supports compliance requirements and provides visibility into team
        activity.
      </Text>

      <Text style={styles.h3}>8.8.8 Workflow Organization</Text>
      <Text style={styles.paragraphIndent}>
        Workflows can be organized using folders, tags, and favorites. A
        full-text search capability allows finding workflows by name,
        description, tags, or folder. Recent workflows and favorites are
        accessible from dedicated views.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>
          Code Snippet — Team RBAC Permission Check:
        </Text>
      </Text>
      <View
        style={{
          backgroundColor: "#f5f5f5",
          borderWidth: 1,
          borderColor: "#cccccc",
          padding: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 7.5, fontFamily: "Courier", lineHeight: 1.4 }}>
          {`// src/lib/auth-utils.ts
import { db } from "./db";

type TeamRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

const ROLE_HIERARCHY: Record<TeamRole, number> = {
  OWNER: 4, ADMIN: 3, MEMBER: 2, VIEWER: 1,
};

export async function checkTeamPermission(
  userId: string,
  teamId: string,
  requiredRole: TeamRole
): Promise<boolean> {
  const membership = await db.teamMember.findUnique({
    where: { userId_teamId: { userId, teamId } },
    select: { role: true },
  });
  if (!membership) return false;
  return ROLE_HIERARCHY[membership.role as TeamRole]
    >= ROLE_HIERARCHY[requiredRole];
}

export async function requireTeamRole(
  userId: string, teamId: string, role: TeamRole
) {
  const allowed = await checkTeamPermission(userId, teamId, role);
  if (!allowed) throw new TRPCError({ code: "FORBIDDEN" });
}`}
        </Text>
      </View>

      {/* 8.9 API Routes */}
      <Text style={styles.h2}>8.9 API Routes</Text>
      <Text style={styles.paragraphIndent}>
        In addition to the tRPC API, Flowgent exposes{" "}
        <Text style={styles.bold}>8 Next.js API routes</Text> for functionality
        that requires standard HTTP endpoints:
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
            backgroundColor: "#D9E2F3",
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
            Route
          </Text>
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
            Methods
          </Text>
          <Text
            style={{
              width: "50%",
              padding: 4,
              fontSize: 8,
              fontFamily: "Times-Bold",
            }}
          >
            Purpose
          </Text>
        </View>
        {[
          [
            "/api/auth/[...all]",
            "ALL",
            "Better Auth catch-all (login, signup, session, OAuth)",
          ],
          [
            "/api/trpc/[trpc]",
            "ALL",
            "tRPC endpoint handler for all 59 procedures",
          ],
          [
            "/api/webhooks/[path]",
            "ALL",
            "Dynamic webhook receiver — triggers workflow executions",
          ],
          [
            "/api/webhooks/polar",
            "POST",
            "Polar payment webhook for subscription events",
          ],
          [
            "/api/oauth/[provider]/connect",
            "GET",
            "Initiates OAuth2 authorization code flow",
          ],
          [
            "/api/oauth/[provider]/callback",
            "GET",
            "OAuth2 callback — exchanges code for tokens",
          ],
          [
            "/api/inngest",
            "POST",
            "Inngest event receiver for background job processing",
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
            <Text
              style={{ width: "50%", padding: 3, fontSize: 7, lineHeight: 1.3 }}
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
        Table 8.5: Next.js API Routes
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Code Snippet — Webhook Handler Route:</Text>
      </Text>
      <View
        style={{
          backgroundColor: "#f5f5f5",
          borderWidth: 1,
          borderColor: "#cccccc",
          padding: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 7.5, fontFamily: "Courier", lineHeight: 1.4 }}>
          {`// src/app/api/webhook/[workflowId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inngest } from "@/inngest/client";

export async function POST(
  req: NextRequest,
  { params }: { params: { workflowId: string } }
) {
  const workflow = await db.workflow.findUnique({
    where: { id: params.workflowId, status: "ACTIVE" },
    select: { id: true, userId: true, nodes: true, edges: true },
  });
  if (!workflow) {
    return NextResponse.json(
      { error: "Workflow not found" }, { status: 404 }
    );
  }

  const payload = await req.json().catch(() => null);
  await inngest.send({
    name: "workflow/execute",
    data: {
      workflowId: workflow.id,
      userId: workflow.userId,
      trigger: { type: "WEBHOOK", payload },
    },
  });

  return NextResponse.json({ success: true, executionId: workflow.id });
}`}
        </Text>
      </View>

      {/* 8.10 Deployment */}
      <Text style={styles.h2}>8.10 Deployment</Text>
      <Text style={styles.paragraphIndent}>
        Flowgent 1.0 is deployed to production with the following
        infrastructure:
      </Text>
      <View style={{ marginTop: 16, marginBottom: 8 }}>
        <DeploymentDiagram />
        <Text
          style={{
            fontSize: 10,
            fontFamily: "Times-Italic",
            textAlign: "center",
            marginTop: 8,
            marginBottom: 12,
          }}
        >
          Figure 8.3: Deployment Architecture
        </Text>
      </View>
      <View style={{ marginLeft: 24, marginBottom: 12 }}>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Application Hosting:</Text> Netlify with
          serverless functions for the Next.js application
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Database:</Text> PostgreSQL on Neon
          (serverless Postgres with connection pooling)
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Execution Engine:</Text> Inngest Cloud for
          durable workflow execution processing
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Monitoring:</Text> Sentry for error
          tracking, performance monitoring, and console logging
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Domain:</Text> flowgent.app with SSL
          certificate
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          • <Text style={styles.bold}>Source Code:</Text>{" "}
          github.com/kanishKumar11/flowgent (Git version control)
        </Text>
      </View>

      {/* 8.11 Summary */}
      <Text style={styles.h2}>8.11 Summary</Text>
      <Text style={styles.paragraphIndent}>
        This chapter has presented the complete implementation of Flowgent 1.0,
        covering the project structure, frontend development with React Flow,
        backend API with tRPC, database layer with Prisma, workflow execution
        engine with Inngest, all 24 node types, OAuth2 integrations, and key
        features including credential management, versioning, templates, error
        alerting, subscription billing, and audit logging. The modular
        architecture and type-safe approach ensure maintainability and
        extensibility for future development.
      </Text>

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
            fontSize: 11,
            fontFamily: "Times-Bold",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Implementation Summary
        </Text>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "50%", paddingRight: 8 }}>
            <Text style={{ fontSize: 9, marginBottom: 2 }}>
              • 18,000+ lines of TypeScript
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 2 }}>
              • 24 Node Types
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 2 }}>
              • 59 API Procedures
            </Text>
            <Text style={{ fontSize: 9 }}>• 14 Database Models</Text>
          </View>
          <View style={{ width: "50%", paddingLeft: 8 }}>
            <Text style={{ fontSize: 9, marginBottom: 2 }}>
              • 54 UI Components
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 2 }}>
              • 5 Workflow Templates
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 2 }}>
              • 4 OAuth Providers
            </Text>
            <Text style={{ fontSize: 9 }}>• 3 AI Providers</Text>
          </View>
        </View>
      </View>
    </BookPageLayout>
  );
}
