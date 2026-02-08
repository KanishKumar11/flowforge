import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { WebClient } from "@slack/web-api";
import { Client as NotionClient } from "@notionhq/client";

// Types for workflow execution
interface NodeData {
  type: string;
  label: string;
  config: Record<string, unknown>;
}

interface WorkflowNode {
  id: string;
  type: "trigger" | "action";
  data: NodeData;
  position: { x: number; y: number };
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

interface ExecutionContext {
  workflowId: string;
  executionId: string;
  triggerData: Record<string, unknown>;
  nodeResults: Record<string, unknown>;
}

// Node executor functions
async function executeHttpRequest(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const url = config.url as string;
  const method = (config.method as string) || "GET";
  const headers = (config.headers as Record<string, string>) || {};
  const body = config.body as string | undefined;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: method !== "GET" && body ? body : undefined,
    });

    const data = await response.json().catch(() => response.text());
    return {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data,
    };
  } catch (error) {
    throw new Error(`HTTP Request failed: ${(error as Error).message}`);
  }
}

async function executeCode(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const code = config.code as string;

  // Simple expression evaluation (in production, use a proper sandbox)
  try {
    // Create a function with access to context data
    const fn = new Function(
      "input",
      "results",
      `
      "use strict";
      ${code}
      `,
    );
    return fn(context.triggerData, context.nodeResults);
  } catch (error) {
    throw new Error(`Code execution failed: ${(error as Error).message}`);
  }
}

async function executeIf(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<{ condition: boolean; branch: "true" | "false" }> {
  const condition = config.condition as string;

  try {
    const fn = new Function(
      "input",
      "results",
      `
      "use strict";
      return Boolean(${condition});
      `,
    );
    const result = fn(context.triggerData, context.nodeResults);
    return { condition: result, branch: result ? "true" : "false" };
  } catch (error) {
    throw new Error(`Condition evaluation failed: ${(error as Error).message}`);
  }
}

async function executeWait(
  config: Record<string, unknown>,
): Promise<{ waited: number }> {
  const duration = (config.duration as number) || 1000;
  // Inngest will handle this with step.sleep
  return { waited: duration };
}

async function executeEmail(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  // In production, integrate with email service (SendGrid, Resend, etc.)
  const to = config.to as string;
  const subject = config.subject as string;
  const body = config.body as string;

  console.log(`[Email] Would send to: ${to}, subject: ${subject}`);

  return {
    sent: true,
    to,
    subject,
    timestamp: new Date().toISOString(),
  };
}

async function executeSet(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const mode = (config.mode as string) || "overwrite";
  const fields = (config.fields as Record<string, unknown>) || {};

  if (mode === "append") {
    return { ...context.triggerData, ...fields };
  }
  return fields;
}

async function executeFilter(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const condition = config.condition as string;
  const items = (config.items || context.triggerData) as unknown[]; // Default to trigger data if not specified

  if (!Array.isArray(items)) {
    throw new Error("Filter input must be an array");
  }

  try {
    const fn = new Function(
      "item",
      "index",
      `"use strict"; return Boolean(${condition});`,
    );
    return items.filter((item, index) => fn(item, index));
  } catch (error) {
    throw new Error(`Filter evaluation failed: ${(error as Error).message}`);
  }
}

async function executeSort(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const field = config.field as string;
  const order = (config.order as string) || "asc";
  const items = (config.items || context.triggerData) as any[];

  if (!Array.isArray(items)) {
    throw new Error("Sort input must be an array");
  }

  return [...items].sort((a, b) => {
    const valA = field ? a[field] : a;
    const valB = field ? b[field] : b;

    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });
}

async function executeSlack(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const channel = config.channel as string;
  const message = config.message as string;
  const token = process.env.SLACK_BOT_TOKEN; // In production, fetch from Credential model

  if (token) {
    const slack = new WebClient(token);
    await slack.chat.postMessage({ channel, text: message });
    return { sent: true, channel, message, provider: "slack_api" };
  }

  // Fallback / Mock
  console.log(`[Slack] Sending to ${channel}: ${message}`);
  return { sent: true, channel, message, provider: "mock" };
}

async function executeDatabase(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const operation = (config.operation as string) || "find";
  const collection = config.collection as string;
  const query = config.query as string;

  // Mock Database execution
  console.log(`[Database] ${operation} on ${collection}: ${query}`);

  return {
    success: true,
    operation,
    collection,
    result: { id: "mock-id", data: "mock-data" }, // Mock data
    timestamp: new Date().toISOString(),
  };
}

async function executeGoogleSheets(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const operation = config.operation as string;
  const spreadsheetId = config.spreadsheetId as string;
  const range = config.range as string;

  console.log(
    `[Google Sheets] ${operation} on ${spreadsheetId} range ${range}`,
  );

  // Full implementation would use googleapis or google-spreadsheet
  return { success: true, operation, spreadsheetId, range };
}

async function executeGitHub(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const operation = config.operation as string;
  const owner = config.owner as string;
  const repo = config.repo as string;

  console.log(`[GitHub] ${operation} on ${owner}/${repo}`);

  // Full implementation would use octokit or fetch to https://api.github.com
  return { success: true, operation, repo: `${owner}/${repo}` };
}

async function executeNotion(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const operation = config.operation as string;
  const databaseId = config.databaseId as string;
  const token = process.env.NOTION_KEY; // In production, fetch from Credential

  if (token && operation === "create_page") {
    const notion = new NotionClient({ auth: token });
    // Simplified create page logic
    // await notion.pages.create({ ... });
    return { success: true, provider: "notion_api", operation };
  }

  console.log(`[Notion] ${operation} on db ${databaseId}`);
  return { success: true, operation, databaseId, provider: "mock" };
}

// Loop executor - iterates over an array and returns results
async function executeLoop(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const items = (config.items || context.triggerData) as unknown[];
  const expression = config.expression as string;

  if (!Array.isArray(items)) {
    throw new Error("Loop input must be an array");
  }

  const results: unknown[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (expression) {
      try {
        const fn = new Function(
          "item",
          "index",
          `"use strict"; return ${expression};`,
        );
        results.push(fn(item, i));
      } catch (error) {
        results.push({ error: (error as Error).message, item, index: i });
      }
    } else {
      results.push(item);
    }
  }

  return { items: results, count: results.length };
}

// Switch executor - multi-branch conditional logic
async function executeSwitch(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const value = config.value as unknown;
  const cases =
    (config.cases as Array<{ value: unknown; output: unknown }>) || [];
  const defaultOutput = config.default as unknown;

  // Find matching case
  for (const c of cases) {
    if (c.value === value) {
      return { matched: true, case: c.value, output: c.output };
    }
  }

  return { matched: false, output: defaultOutput };
}

// OpenAI executor - call ChatGPT API
// OpenAI/LLM executor - call ChatGPT, Claude, or Gemini API
async function executeOpenAI(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const provider = (config.provider as string) || "openai";
  const model = (config.model as string) || "gpt-4o-mini";
  const prompt = config.prompt as string;
  const systemPrompt = config.systemPrompt as string;

  // Provider-specific execution
  if (provider === "anthropic") {
    const apiKey = process.env.ANTHROPIC_API_KEY || (config.apiKey as string);
    if (!apiKey) {
      console.log("[Anthropic] No API key found, returning mock response");
      return {
        mock: true,
        message: `[Mock Claude] Response for: ${prompt}`,
        model,
      };
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model,
          max_tokens: 1024,
          system: systemPrompt,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Anthropic API error: ${error}`);
      }
      const data = await response.json();
      return {
        message: data.content?.[0]?.text || "",
        model,
        usage: data.usage,
      };
    } catch (error) {
      throw new Error(
        `Anthropic execution failed: ${(error as Error).message}`,
      );
    }
  }

  if (provider === "google") {
    const apiKey = process.env.GOOGLE_API_KEY || (config.apiKey as string);
    if (!apiKey) {
      console.log("[Gemini] No API key found, returning mock response");
      return {
        mock: true,
        message: `[Mock Gemini] Response for: ${prompt}`,
        model,
      };
    }

    try {
      // Simple Gemini GenerateContent API
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          // Google doesn't have a direct "system" role in standard generateContent in the same way,
          // but we can prepend it or use system_instruction if supported by the model version.
          // For simplicity we prepend.
          ...(systemPrompt
            ? { system_instruction: { parts: [{ text: systemPrompt }] } }
            : {}),
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API error: ${error}`);
      }
      const data = await response.json();
      return {
        message: data.candidates?.[0]?.content?.parts?.[0]?.text || "",
        model,
        usage: data.usageMetadata,
      };
    } catch (error) {
      throw new Error(`Gemini execution failed: ${(error as Error).message}`);
    }
  }

  // Default: OpenAI
  const apiKey = process.env.OPENAI_API_KEY || (config.apiKey as string);
  if (!apiKey) {
    console.log("[OpenAI] No API key found, returning mock response");
    return {
      mock: true,
      message: `[Mock GPT] Response for: ${prompt}`,
      model,
    };
  }

  if (!prompt) {
    throw new Error("Prompt is required");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    return {
      message: data.choices?.[0]?.message?.content || "",
      model,
      usage: data.usage,
    };
  } catch (error) {
    throw new Error(`OpenAI execution failed: ${(error as Error).message}`);
  }
}

// Sub-Workflow executor - execute another workflow
async function executeSubWorkflow(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const workflowId = config.workflowId as string;
  const inputData = (config.inputData || context.triggerData) as Record<
    string,
    unknown
  >;

  if (!workflowId) {
    throw new Error("Sub-workflow ID is required");
  }

  // Find the sub-workflow
  const subWorkflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
  });

  if (!subWorkflow) {
    throw new Error(`Sub-workflow ${workflowId} not found`);
  }

  // Create execution record for sub-workflow
  const execution = await prisma.execution.create({
    data: {
      workflowId,
      mode: "SUBWORKFLOW",
      status: "PENDING",
      inputData: inputData as object,
    },
  });

  // Note: In a real implementation, this would trigger the sub-workflow execution
  // For now, we return a reference to track it
  console.log(
    `[SubWorkflow] Triggered workflow ${workflowId} with execution ${execution.id}`,
  );

  return {
    subWorkflowId: workflowId,
    executionId: execution.id,
    status: "triggered",
    inputData,
  };
}

// Merge executor - combine multiple inputs into one
async function executeMerge(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const mode = (config.mode as string) || "combine";
  // In a real execution, inputs would come from multiple incoming connections
  // For now, we use triggerData and any additional inputs
  const inputs = (config.inputs || [context.triggerData]) as unknown[];

  switch (mode) {
    case "combine":
      // Combine all inputs into an array
      return { merged: inputs };
    case "append":
      // Append arrays together
      return { merged: inputs.flat() };
    case "multiplex":
      // Output each input in sequence
      return { items: inputs, count: inputs.length };
    default:
      return { merged: inputs };
  }
}

// Stripe executor - payment operations
async function executeStripe(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const apiKey = process.env.STRIPE_SECRET_KEY || (config.apiKey as string);
  const operation = (config.operation as string) || "create_payment_intent";

  if (!apiKey) {
    console.log("[Stripe] No API key found, returning mock response");
    return { mock: true, operation, message: "API key not configured" };
  }

  try {
    switch (operation) {
      case "create_payment_intent": {
        const amount = (config.amount as number) || 1000;
        const currency = (config.currency as string) || "usd";

        const response = await fetch(
          "https://api.stripe.com/v1/payment_intents",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `amount=${amount}&currency=${currency}`,
          },
        );

        return await response.json();
      }
      case "list_customers": {
        const response = await fetch("https://api.stripe.com/v1/customers", {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        return await response.json();
      }
      default:
        return { success: false, error: `Unknown operation: ${operation}` };
    }
  } catch (error) {
    throw new Error(`Stripe execution failed: ${(error as Error).message}`);
  }
}

// Twilio executor - send SMS
async function executeTwilio(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const accountSid =
    process.env.TWILIO_ACCOUNT_SID || (config.accountSid as string);
  const authToken =
    process.env.TWILIO_AUTH_TOKEN || (config.authToken as string);
  const from = (config.from as string) || process.env.TWILIO_PHONE_NUMBER;
  const to = config.to as string;
  const body = config.body as string;

  if (!accountSid || !authToken) {
    console.log("[Twilio] Credentials not found, returning mock response");
    return {
      mock: true,
      to,
      body,
      message: "Twilio credentials not configured",
    };
  }

  if (!to || !body) {
    throw new Error("Twilio requires 'to' phone number and 'body' message");
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `To=${encodeURIComponent(to)}&From=${encodeURIComponent(from || "")}&Body=${encodeURIComponent(body)}`,
      },
    );

    return await response.json();
  } catch (error) {
    throw new Error(`Twilio execution failed: ${(error as Error).message}`);
  }
}

// Comment node - does nothing, for documentation only
async function executeComment(): Promise<unknown> {
  return { executed: false, type: "comment", note: "Comments do not execute" };
}

// Execute a single node
async function executeNode(
  node: WorkflowNode,
  context: ExecutionContext,
): Promise<unknown> {
  const { type, config } = node.data;

  switch (type) {
    case "http-request":
      return executeHttpRequest(config, context);
    case "code":
      return executeCode(config, context);
    case "if":
      return executeIf(config, context);
    case "switch":
      return executeSwitch(config, context);
    case "loop":
      return executeLoop(config, context);
    case "wait":
      return executeWait(config);
    case "email":
      return executeEmail(config, context);
    case "set":
      return executeSet(config, context);
    case "filter":
      return executeFilter(config, context);
    case "sort":
      return executeSort(config, context);
    case "openai":
      return executeOpenAI(config, context);
    case "slack":
      return executeSlack(config, context);
    case "database":
      return executeDatabase(config, context);
    case "google_sheets":
      return executeGoogleSheets(config, context);
    case "github":
      return executeGitHub(config, context);
    case "notion":
      return executeNotion(config, context);
    case "stripe":
      return executeStripe(config, context);
    case "twilio":
      return executeTwilio(config, context);
    case "sub-workflow":
      return executeSubWorkflow(config, context);
    case "merge":
      return executeMerge(config, context);
    case "comment":
      return executeComment();
    case "manual":
    case "webhook":
    case "schedule":
      // Trigger nodes just pass through the trigger data
      return context.triggerData;
    default:
      console.log(`Unknown node type: ${type}`);
      return { type, executed: true };
  }
}

// Get next nodes in the execution order
function getNextNodes(
  currentNodeId: string,
  edges: WorkflowEdge[],
  nodes: WorkflowNode[],
): WorkflowNode[] {
  const outgoingEdges = edges.filter((e) => e.source === currentNodeId);
  return outgoingEdges
    .map((edge) => nodes.find((n) => n.id === edge.target))
    .filter(Boolean) as WorkflowNode[];
}

// Direct workflow execution (no Inngest dependency)
// Used as a fallback when Inngest is unavailable or for direct invocation
export async function executeWorkflowDirect(
  workflowId: string,
  executionId: string,
  triggerData: Record<string, unknown> = {},
): Promise<{
  success: boolean;
  executionId: string;
  results: Record<string, unknown>;
}> {
  // Update execution status to running
  await prisma.execution.update({
    where: { id: executionId },
    data: {
      status: "RUNNING",
      startedAt: new Date(),
    },
  });

  try {
    // Fetch workflow
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    const nodes = (workflow.nodes as unknown as WorkflowNode[]) || [];
    const edges = (workflow.edges as unknown as WorkflowEdge[]) || [];

    if (nodes.length === 0) {
      throw new Error("Workflow has no nodes");
    }

    // Find trigger node (entry point)
    const triggerNode = nodes.find((n) => n.type === "trigger");
    if (!triggerNode) {
      throw new Error("Workflow has no trigger node");
    }

    // Execution context
    const context: ExecutionContext = {
      workflowId,
      executionId,
      triggerData,
      nodeResults: {},
    };

    // Execute nodes in order (BFS traversal)
    const executed = new Set<string>();
    const queue: WorkflowNode[] = [triggerNode];

    while (queue.length > 0) {
      const currentNode = queue.shift()!;

      if (executed.has(currentNode.id)) {
        continue;
      }

      // Execute the node
      const result = await executeNode(currentNode, context);

      // Handle wait nodes
      if (currentNode.data.type === "wait") {
        const waitMs = (currentNode.data.config.duration as number) || 1000;
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }

      // Store result
      context.nodeResults[currentNode.id] = result;
      executed.add(currentNode.id);

      // Get and queue next nodes
      const nextNodes = getNextNodes(currentNode.id, edges, nodes);
      for (const nextNode of nextNodes) {
        if (!executed.has(nextNode.id)) {
          queue.push(nextNode);
        }
      }
    }

    // Update execution status to success
    await prisma.execution.update({
      where: { id: executionId },
      data: {
        status: "SUCCESS",
        finishedAt: new Date(),
        outputData: context.nodeResults as Record<string, never>,
        nodeResults: context.nodeResults as Record<string, never>,
      },
    });

    return {
      success: true,
      executionId,
      results: context.nodeResults,
    };
  } catch (error) {
    // Update execution status to error
    await prisma.execution.update({
      where: { id: executionId },
      data: {
        status: "ERROR",
        finishedAt: new Date(),
        error: (error as Error).message,
      },
    });

    throw error;
  }
}

// Main workflow execution function (Inngest-managed)
export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: 3,
  },
  { event: "workflow/execute" },
  async ({ event, step }) => {
    const { workflowId, executionId, triggerData = {} } = event.data;

    // Update execution status to running
    await step.run("update-status-running", async () => {
      await prisma.execution.update({
        where: { id: executionId },
        data: {
          status: "RUNNING",
          startedAt: new Date(),
        },
      });
    });

    try {
      // Fetch workflow
      const workflow = await step.run("fetch-workflow", async () => {
        return prisma.workflow.findUnique({
          where: { id: workflowId },
        });
      });

      if (!workflow) {
        throw new Error(`Workflow ${workflowId} not found`);
      }

      const nodes = (workflow.nodes as unknown as WorkflowNode[]) || [];
      const edges = (workflow.edges as unknown as WorkflowEdge[]) || [];

      if (nodes.length === 0) {
        throw new Error("Workflow has no nodes");
      }

      // Find trigger node (entry point)
      const triggerNode = nodes.find((n) => n.type === "trigger");
      if (!triggerNode) {
        throw new Error("Workflow has no trigger node");
      }

      // Execution context
      const context: ExecutionContext = {
        workflowId,
        executionId,
        triggerData,
        nodeResults: {},
      };

      // Execute nodes in order (BFS traversal)
      const executed = new Set<string>();
      const queue: WorkflowNode[] = [triggerNode];

      while (queue.length > 0) {
        const currentNode = queue.shift()!;

        if (executed.has(currentNode.id)) {
          continue;
        }

        // Execute the node
        const result = await step.run(
          `execute-node-${currentNode.id}`,
          async () => {
            return executeNode(currentNode, context);
          },
        );

        // Handle wait nodes specially
        if (currentNode.data.type === "wait") {
          const waitMs = (currentNode.data.config.duration as number) || 1000;
          await step.sleep(`wait-${currentNode.id}`, waitMs);
        }

        // Store result
        context.nodeResults[currentNode.id] = result;
        executed.add(currentNode.id);

        // Handle conditional branching for IF nodes
        if (currentNode.data.type === "if") {
          const ifResult = result as { condition: boolean; branch: string };
          // In a full implementation, we'd filter edges by branch label
          // For now, we continue to all connected nodes
        }

        // Get and queue next nodes
        const nextNodes = getNextNodes(currentNode.id, edges, nodes);
        for (const nextNode of nextNodes) {
          if (!executed.has(nextNode.id)) {
            queue.push(nextNode);
          }
        }
      }

      // Update execution status to success
      await step.run("update-status-success", async () => {
        await prisma.execution.update({
          where: { id: executionId },
          data: {
            status: "SUCCESS",
            finishedAt: new Date(),
            outputData: context.nodeResults as Record<string, never>,
            nodeResults: context.nodeResults as Record<string, never>,
          },
        });
      });

      return {
        success: true,
        executionId,
        results: context.nodeResults,
      };
    } catch (error) {
      // Update execution status to error
      await step.run("update-status-error", async () => {
        await prisma.execution.update({
          where: { id: executionId },
          data: {
            status: "ERROR",
            finishedAt: new Date(),
            error: (error as Error).message,
          },
        });
      });

      throw error;
    }
  },
);

// Schedule trigger function
export const scheduledWorkflow = inngest.createFunction(
  {
    id: "scheduled-workflow",
  },
  { cron: "* * * * *" }, // Runs every minute, checks for due schedules
  async ({ step }) => {
    // Fetch active schedules that are due
    const dueSchedules = await step.run("fetch-due-schedules", async () => {
      return prisma.schedule.findMany({
        where: {
          isActive: true,
          nextRunAt: {
            lte: new Date(),
          },
        },
        include: {
          workflow: true,
        },
      });
    });

    // Trigger each due workflow
    for (const schedule of dueSchedules) {
      await step.run(`trigger-workflow-${schedule.workflowId}`, async () => {
        // Create execution record
        const execution = await prisma.execution.create({
          data: {
            workflowId: schedule.workflowId,
            mode: "SCHEDULED",
            status: "PENDING",
            inputData: { scheduleId: schedule.id },
          },
        });

        // Execute workflow directly
        await executeWorkflowDirect(schedule.workflowId, execution.id, {
          scheduleId: schedule.id,
          triggeredAt: new Date().toISOString(),
        });

        // Update next run time based on cron
        // In production, use a proper cron parser
        const nextRun = new Date(Date.now() + 60000); // Default: 1 minute later
        await prisma.schedule.update({
          where: { id: schedule.id },
          data: {
            lastRunAt: new Date(),
            nextRunAt: nextRun,
          },
        });
      });
    }

    return { processed: dueSchedules.length };
  },
);
