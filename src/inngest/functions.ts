import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { WebClient } from "@slack/web-api";
import { Client as NotionClient } from "@notionhq/client";
import nodemailer from "nodemailer";
import { decryptCredential } from "@/lib/crypto";
import { getNextCronDate } from "@/lib/cron-helper";

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
  sourceHandle?: string;
  label?: string;
}

interface ExecutionContext {
  workflowId: string;
  executionId: string;
  teamId: string | null;
  triggerData: Record<string, unknown>;
  nodeResults: Record<string, unknown>;
}

// ── Template variable resolver ────────────────────────────────────────
// Resolves {{trigger.body.email}}, {{nodeId.field}}, etc. in config strings
function resolveTemplateVars(
  value: unknown,
  context: ExecutionContext,
): unknown {
  if (typeof value !== "string") return value;

  return value.replace(/\{\{([^}]+)\}\}/g, (_match, path: string) => {
    const parts = path.trim().split(".");
    const [root, ...rest] = parts;

    let base: unknown;
    if (root === "trigger") {
      base = context.triggerData;
    } else {
      base = context.nodeResults[root];
    }

    const resolved = rest.reduce((obj: unknown, key: string) => {
      if (obj !== null && obj !== undefined && typeof obj === "object") {
        return (obj as Record<string, unknown>)[key];
      }
      return undefined;
    }, base);

    return resolved !== undefined && resolved !== null
      ? String(resolved)
      : _match;
  });
}

function resolveConfig(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Record<string, unknown> {
  const resolved: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(config)) {
    resolved[key] = resolveTemplateVars(value, context);
  }
  return resolved;
}

// ── Shared credential-resolution helper ──────────────────────────────
// Resolves an API key / token from: env var → inline config → stored Credential
async function resolveCredential(
  config: Record<string, unknown>,
  envValue: string | undefined,
): Promise<string | undefined> {
  if (envValue) return envValue;
  if (config.apiKey && typeof config.apiKey === "string") return config.apiKey;

  const credId = config.credentialId as string | undefined;
  if (credId) {
    try {
      const cred = await prisma.credential.findFirst({ where: { id: credId } });
      if (cred) {
        try {
          const data = decryptCredential(cred.data || "{}");
          return (
            (data.apiKey as string) ||
            (data.accessToken as string) ||
            (data.access_token as string) ||
            (data.key as string) ||
            (data.token as string) ||
            (data.secret as string) ||
            (data.client_secret as string)
          );
        } catch {
          // decryption or data parse failed – ignore
        }
      }
    } catch {
      // Credential fetch failed — continue without auth
    }
  }

  return undefined;
}

// Node executor functions
async function executeHttpRequest(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const url = config.url as string;
  const method = (config.method as string) || "GET";
  // Headers may be stored as a JSON string from the config panel textarea
  let headers: Record<string, string> = {};
  if (config.headers) {
    if (typeof config.headers === "string") {
      try {
        headers = JSON.parse(config.headers);
      } catch {
        /* invalid JSON, ignore */
      }
    } else {
      headers = config.headers as Record<string, string>;
    }
  }
  const body = config.body as string | undefined;

  // Optionally inject Authorization from a saved credential
  const authToken = await resolveCredential(config, undefined);
  const authHeaders: Record<string, string> = {};
  if (authToken) {
    authHeaders["Authorization"] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...headers, // user-supplied headers override auth if present
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
  // Duration may arrive as a string from the config panel input
  const raw = config.duration;
  const duration =
    typeof raw === "string"
      ? parseInt(raw, 10) || 1000
      : (raw as number) || 1000;
  // Inngest will handle this with step.sleep
  return { waited: duration };
}

async function executeEmail(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const to = config.to as string;
  const subject = config.subject as string;
  const body = (config.emailBody || config.body) as string;

  if (!to || !subject) {
    throw new Error("Email node requires 'to' and 'subject' fields");
  }

  // Resolve SMTP credentials from user's stored credential
  const credId = config.credentialId as string | undefined;
  console.log(
    `[email] credentialId=${credId ?? "(none)"} to="${to}" subject="${subject}"`,
  );

  let smtpConfig: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    from?: string;
  } | null = null;

  if (credId) {
    try {
      const cred = await prisma.credential.findFirst({ where: { id: credId } });
      if (cred) {
        console.log(
          `[email] credential found: id=${cred.id} name="${cred.name}" provider=${cred.provider}`,
        );
        const data = decryptCredential(cred.data || "{}");
        const smtpHost = data.host as string | undefined;
        const smtpUser = data.user as string | undefined;
        const smtpPort = String(data.port || "587");
        const smtpSecure = data.secure === true || data.secure === "true";
        console.log(
          `[email] decrypted cred: host=${smtpHost ?? "(missing)"} port=${smtpPort} secure=${smtpSecure} user=${smtpUser ?? "(missing)"} pass=${data.pass ? "[set]" : "(missing)"}`,
        );
        if (data.user && data.pass) {
          if (!smtpHost) {
            throw new Error(
              `Email node: Your SMTP credential "${cred.name}" is missing a host (e.g. smtp.zoho.com, smtp.gmail.com). Edit the credential and add the SMTP host.`,
            );
          }
          smtpConfig = {
            host: smtpHost,
            port: parseInt(smtpPort),
            secure: smtpSecure,
            user: data.user as string,
            pass: data.pass as string,
            from: data.from as string | undefined,
          };
        } else {
          console.log(
            `[email] credential missing user or pass — fields present: ${Object.keys(data).join(", ")}`,
          );
        }
      } else {
        console.log(`[email] credential id=${credId} not found in DB`);
      }
    } catch (err) {
      // Re-throw so the real error surfaces instead of silently falling back
      throw err;
    }
  }

  // Fall back to env vars if no credential configured
  if (!smtpConfig && process.env.SMTP_USER && process.env.SMTP_PASS) {
    console.log(
      `[email] falling back to env-var SMTP: host=${process.env.SMTP_HOST ?? "(missing)"} user=${process.env.SMTP_USER}`,
    );
    if (!process.env.SMTP_HOST) {
      throw new Error(
        "Email node: SMTP_HOST env var is not set. Set it to your mail provider's SMTP server (e.g. smtp.zoho.com, smtp.gmail.com).",
      );
    }
    smtpConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    };
  }

  if (!smtpConfig) {
    throw new Error(
      "Email node: No SMTP credential configured. Add an SMTP credential in the Credentials page and select it in the node config.",
    );
  }

  console.log(
    `[email] connecting: host=${smtpConfig.host} port=${smtpConfig.port} secure=${smtpConfig.secure} requireTLS=${!smtpConfig.secure} user=${smtpConfig.user}`,
  );

  try {
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure, // true = SSL/TLS (port 465), false = STARTTLS (port 587)
      requireTLS: !smtpConfig.secure, // enforce STARTTLS upgrade on port 587
      auth: { user: smtpConfig.user, pass: smtpConfig.pass },
      tls: { rejectUnauthorized: true },
    });

    const from =
      smtpConfig.from ||
      process.env.SMTP_FROM ||
      `"FlowGent" <${smtpConfig.user}>`;

    console.log(`[email] sending from="${from}" to="${to}"`);

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html: body
        ? `<div style="font-family: sans-serif;">${body.replace(/\n/g, "<br>")}</div>`
        : undefined,
      text: body || "",
    });

    console.log(`[email] sent OK messageId=${info.messageId}`);

    return {
      sent: true,
      to,
      subject,
      messageId: info.messageId,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    const msg = (error as Error).message;
    console.error(`[email] send failed: ${msg}`);

    // Provide actionable guidance for common SMTP errors
    if (
      msg.includes("535") ||
      msg.includes("Authentication Failed") ||
      msg.includes("Invalid login")
    ) {
      const host = smtpConfig?.host ?? "";
      let hint = "";
      if (host.includes("zoho")) {
        hint =
          " → Zoho blocks regular account passwords for SMTP. Go to mail.zoho.com → Settings → Security → App Passwords, generate an App Password, and use that instead.";
      } else if (host.includes("gmail")) {
        hint =
          " → Gmail blocks regular account passwords for SMTP. Go to myaccount.google.com → Security → App Passwords, generate one, and use that instead.";
      } else {
        hint =
          " → Your SMTP provider rejected the password. Check that SMTP access is enabled in your mail account settings and that you are using an App Password if 2FA is active.";
      }
      throw new Error(
        `Email send failed: Authentication rejected by ${host}.${hint}`,
      );
    }

    if (msg.includes("ECONNREFUSED") || msg.includes("ETIMEDOUT")) {
      throw new Error(
        `Email send failed: Could not connect to ${smtpConfig?.host}:${smtpConfig?.port}. Check the host and port in your SMTP credential.`,
      );
    }

    throw new Error(`Email send failed: ${msg}`);
  }
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
  const token = await resolveCredential(config, process.env.SLACK_BOT_TOKEN);

  if (!channel) {
    throw new Error("Slack node requires a 'channel' field (e.g. #general)");
  }
  if (!message) {
    throw new Error("Slack node requires a 'message' field");
  }

  if (!token) {
    throw new Error(
      "Slack node: No Slack token configured. Go to Credentials → Link Slack (OAuth) or create a Slack credential with your Bot Token.",
    );
  }

  const slack = new WebClient(token);
  await slack.chat.postMessage({ channel, text: message });
  return { sent: true, channel, message, provider: "slack_api" };
}

async function executeDatabase(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const operation = (config.operation as string) || "query";
  const query = resolveTemplateVars(config.query as string, context) as string;
  const credentialId = config.credentialId as string | undefined;

  if (!query) {
    throw new Error("Database node: No SQL query provided.");
  }

  // Resolve connection string from credential or direct config
  let connectionString: string | undefined;

  if (credentialId) {
    const credential = await prisma.credential.findUnique({
      where: { id: credentialId },
    });
    if (!credential) {
      throw new Error(`Database node: Credential '${credentialId}' not found.`);
    }
    const decrypted = decryptCredential(credential.data);
    connectionString =
      (decrypted as Record<string, string>).connectionString ||
      (decrypted as Record<string, string>).url ||
      (decrypted as Record<string, string>).databaseUrl;
  } else {
    connectionString =
      (resolveTemplateVars(config.connectionString, context) as string) ||
      undefined;
  }

  if (!connectionString) {
    throw new Error(
      "Database node: No connection string available. Create a PostgreSQL credential or set the connectionString field.",
    );
  }

  // Dynamic import to avoid bundling issues
  const { Client } = await import("pg");
  const client = new Client({ connectionString });

  try {
    await client.connect();
    const result = await client.query(query);
    return {
      operation,
      rowCount: result.rowCount,
      rows: result.rows,
      fields: result.fields?.map((f) => ({
        name: f.name,
        dataTypeID: f.dataTypeID,
      })),
    };
  } finally {
    await client.end().catch(() => {});
  }
}

async function executeDiscord(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const webhookUrl = resolveTemplateVars(config.webhookUrl, context) as string;
  const message = resolveTemplateVars(config.message, context) as string;
  const username = resolveTemplateVars(config.username, context) as
    | string
    | undefined;
  const avatarUrl = resolveTemplateVars(config.avatarUrl, context) as
    | string
    | undefined;

  if (!webhookUrl) {
    throw new Error("Discord node: webhookUrl is required.");
  }
  if (!message) {
    throw new Error("Discord node: message is required.");
  }

  const body: Record<string, unknown> = { content: message };
  if (username) body.username = username;
  if (avatarUrl) body.avatar_url = avatarUrl;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Discord webhook failed (${response.status}): ${text}`);
  }

  return { sent: true, webhookUrl, message };
}

async function executeTelegram(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const botToken = resolveTemplateVars(config.botToken, context) as string;
  const chatId = resolveTemplateVars(config.chatId, context) as string;
  const text = resolveTemplateVars(config.text, context) as string;
  const parseMode = (config.parseMode as string) || "HTML";

  if (!botToken) {
    throw new Error("Telegram node: botToken is required.");
  }
  if (!chatId) {
    throw new Error("Telegram node: chatId is required.");
  }
  if (!text) {
    throw new Error("Telegram node: text (message) is required.");
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode }),
  });

  const data = (await response.json()) as {
    ok: boolean;
    description?: string;
    result?: unknown;
  };
  if (!data.ok) {
    throw new Error(`Telegram API error: ${data.description}`);
  }

  return { sent: true, chatId, text, result: data.result };
}

async function executeGoogleSheets(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const operation = config.operation as string;
  const spreadsheetId = config.spreadsheetId as string;
  const range = config.range as string;
  const token = await resolveCredential(config, process.env.GOOGLE_API_KEY);

  if (!token) {
    throw new Error(
      "Google Sheets node: No Google credential configured. Go to Credentials → Link Google (OAuth) to grant Sheets access, or create a Google credential with your API key.",
    );
  }

  if (!spreadsheetId) {
    throw new Error(
      "Google Sheets node requires a 'Spreadsheet ID'. Find it in your Google Sheets URL.",
    );
  }

  const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    switch (operation) {
      case "read_rows": {
        const res = await fetch(
          `${baseUrl}/values/${encodeURIComponent(range)}`,
          { headers },
        );
        if (!res.ok) throw new Error(`Sheets API error: ${await res.text()}`);
        const data = await res.json();
        return { success: true, operation, values: data.values || [], range };
      }
      case "append_row": {
        const values = (config.values as unknown[]) || [];
        const res = await fetch(
          `${baseUrl}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({ values: [values] }),
          },
        );
        if (!res.ok) throw new Error(`Sheets API error: ${await res.text()}`);
        return { success: true, operation, appended: values };
      }
      default:
        return {
          success: false,
          error: `Unknown Sheets operation: ${operation}`,
        };
    }
  } catch (error) {
    throw new Error(
      `Google Sheets execution failed: ${(error as Error).message}`,
    );
  }
}

async function executeGitHub(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const operation = config.operation as string;
  const owner = config.owner as string;
  const repo = config.repo as string;
  const token = await resolveCredential(config, process.env.GITHUB_TOKEN);

  if (!token) {
    throw new Error(
      "GitHub node: No GitHub token configured. Go to Credentials → Link GitHub (OAuth) or create a GitHub credential with a Personal Access Token.",
    );
  }

  if (!owner || !repo) {
    throw new Error("GitHub node requires 'Owner' and 'Repo' fields.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  try {
    switch (operation) {
      case "list_issues": {
        const res = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/issues`,
          { headers },
        );
        if (!res.ok) throw new Error(`GitHub API error: ${await res.text()}`);
        return { success: true, operation, issues: await res.json() };
      }
      case "create_issue": {
        const title = config.title as string;
        const body = config.body as string;
        const res = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/issues`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({ title, body }),
          },
        );
        if (!res.ok) throw new Error(`GitHub API error: ${await res.text()}`);
        return { success: true, operation, issue: await res.json() };
      }
      case "list_repos": {
        const res = await fetch(`https://api.github.com/users/${owner}/repos`, {
          headers,
        });
        if (!res.ok) throw new Error(`GitHub API error: ${await res.text()}`);
        return { success: true, operation, repos: await res.json() };
      }
      default:
        return {
          success: false,
          error: `Unknown GitHub operation: ${operation}`,
        };
    }
  } catch (error) {
    throw new Error(`GitHub execution failed: ${(error as Error).message}`);
  }
}

async function executeNotion(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const operation = config.operation as string;
  const databaseId = config.databaseId as string;
  const token = await resolveCredential(config, process.env.NOTION_KEY);

  if (!token) {
    throw new Error(
      "Notion node: No Notion token configured. Go to Credentials → Link Notion (OAuth) or create a Notion credential with your Integration Token.",
    );
  }

  if (
    !databaseId &&
    (operation === "create_page" || operation === "query_database")
  ) {
    throw new Error(
      "Notion node requires a 'Database ID'. Find it in your Notion database URL.",
    );
  }

  const notion = new NotionClient({ auth: token });

  try {
    switch (operation) {
      case "create_page": {
        const title = (config.title as string) || "Untitled";
        const page = await notion.pages.create({
          parent: { database_id: databaseId },
          properties: {
            title: { title: [{ text: { content: title } }] },
          },
        });
        return { success: true, provider: "notion_api", operation, page };
      }
      case "query_database": {
        const res = await fetch(
          `https://api.notion.com/v1/databases/${databaseId}/query`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Notion-Version": "2022-06-28",
              "Content-Type": "application/json",
            },
          },
        );
        if (!res.ok) throw new Error(`Notion API error: ${await res.text()}`);
        const result = await res.json();
        return {
          success: true,
          provider: "notion_api",
          operation,
          results: result.results,
        };
      }
      default:
        return {
          success: false,
          error: `Unknown Notion operation: ${operation}`,
        };
    }
  } catch (error) {
    throw new Error(`Notion execution failed: ${(error as Error).message}`);
  }
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
  // Cases may be stored as a JSON string from the config panel textarea
  let cases: Array<{ value: unknown; output: unknown }> = [];
  if (typeof config.cases === "string") {
    try {
      cases = JSON.parse(config.cases);
    } catch {
      /* invalid JSON */
    }
  } else if (Array.isArray(config.cases)) {
    cases = config.cases as Array<{ value: unknown; output: unknown }>;
  }
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
    const apiKey = await resolveCredential(
      config,
      process.env.ANTHROPIC_API_KEY,
    );
    if (!apiKey) {
      throw new Error(
        "Anthropic node: No API key configured. Go to Credentials → create an Anthropic credential with your API key, or set ANTHROPIC_API_KEY in env vars.",
      );
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
    const apiKey = await resolveCredential(
      config,
      process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    );
    if (!apiKey) {
      throw new Error(
        "Gemini node: No API key configured. Go to Credentials → create a Google credential with your API key, or set GOOGLE_GENERATIVE_AI_API_KEY in env vars.",
      );
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
  const apiKey = await resolveCredential(config, process.env.OPENAI_API_KEY);
  if (!apiKey) {
    throw new Error(
      "OpenAI node: No API key configured. Go to Credentials → create an OpenAI credential with your API key, or set OPENAI_API_KEY in env vars.",
    );
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

// Transform executor - data transformation via JavaScript expression
async function executeTransform(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const expression = config.expression as string;
  if (!expression) {
    // No expression — pass through the trigger data
    return context.triggerData;
  }

  try {
    const fn = new Function(
      "input",
      "results",
      `"use strict"; return ${expression};`,
    );
    return fn(context.triggerData, context.nodeResults);
  } catch (error) {
    throw new Error(`Transform expression failed: ${(error as Error).message}`);
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

  // Find the sub-workflow — must belong to the same team
  const subWorkflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
      ...(context.teamId ? { teamId: context.teamId } : {}),
    },
  });

  if (!subWorkflow) {
    throw new Error(
      `Sub-workflow ${workflowId} not found or does not belong to this team`,
    );
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

  // Actually execute the sub-workflow
  const result = await executeWorkflowDirect(
    workflowId,
    execution.id,
    inputData,
  );

  return {
    subWorkflowId: workflowId,
    executionId: execution.id,
    status: result.success ? "completed" : "failed",
    results: result.results,
  };
}

// Merge executor - combine multiple inputs into one
async function executeMerge(
  config: Record<string, unknown>,
  context: ExecutionContext,
): Promise<unknown> {
  const mode = (config.mode as string) || "combine";
  // Collect results from all parent nodes that have already executed
  const allResults = Object.values(context.nodeResults);
  const inputs = allResults.length > 0 ? allResults : [context.triggerData];

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
  const apiKey = await resolveCredential(config, process.env.STRIPE_SECRET_KEY);
  const operation = (config.operation as string) || "create_payment_intent";

  if (!apiKey) {
    throw new Error(
      "Stripe node: No API key configured. Go to Credentials → create a Stripe credential with your Secret Key, or set STRIPE_SECRET_KEY in env vars.",
    );
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

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Stripe API error: ${error}`);
        }
        return await response.json();
      }
      case "list_customers": {
        const response = await fetch("https://api.stripe.com/v1/customers", {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Stripe API error: ${error}`);
        }
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
  // Twilio needs accountSid + authToken; try resolving via credential
  let accountSid =
    process.env.TWILIO_ACCOUNT_SID || (config.accountSid as string);
  let authToken = process.env.TWILIO_AUTH_TOKEN || (config.authToken as string);

  // If not found in env/config, try credential
  if (!accountSid || !authToken) {
    const credId = config.credentialId as string | undefined;
    if (credId) {
      try {
        const cred = await prisma.credential.findFirst({
          where: { id: credId },
        });
        if (cred) {
          const data = decryptCredential(cred.data || "{}");
          accountSid =
            accountSid ||
            (data.accountSid as string) ||
            (data.account_sid as string);
          authToken =
            authToken ||
            (data.authToken as string) ||
            (data.auth_token as string) ||
            (data.apiKey as string) ||
            (data.token as string);
        }
      } catch {
        /* ignore */
      }
    }
  }

  const from = (config.from as string) || process.env.TWILIO_PHONE_NUMBER;
  const to = config.to as string;
  const body = config.body as string;

  if (!accountSid || !authToken) {
    throw new Error(
      "Twilio node: No credentials configured. Go to Credentials → create a Twilio credential with your Account SID and Auth Token, or set TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN in env vars.",
    );
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

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Twilio API error: ${error}`);
    }

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
  const { type } = node.data;
  // Resolve {{trigger.X}} / {{nodeId.X}} template variables in all string config values
  const config = resolveConfig(node.data.config, context);

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
    case "discord":
      return executeDiscord(config, context);
    case "telegram":
      return executeTelegram(config, context);
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
    case "transform":
      return executeTransform(config, context);
    case "delay":
      // "delay" is an alias for "wait"
      return executeWait(config);
    case "manual":
    case "webhook":
    case "schedule":
    case "email-inbox":
      // Trigger nodes just pass through the trigger data
      return context.triggerData;
    default:
      return { type, executed: true, warning: `Unknown node type: ${type}` };
  }
}

// Get next nodes in the execution order, optionally filtering by branch
function getNextNodes(
  currentNodeId: string,
  edges: WorkflowEdge[],
  nodes: WorkflowNode[],
  branchFilter?: string,
): WorkflowNode[] {
  let outgoingEdges = edges.filter((e) => e.source === currentNodeId);

  // If a branch filter is specified, ONLY follow edges matching that branch
  // Never fall through to all edges — an IF "true" branch must not execute the "false" branch
  if (branchFilter !== undefined) {
    const filtered = outgoingEdges.filter(
      (e) =>
        e.sourceHandle === branchFilter ||
        e.label === branchFilter ||
        (e.sourceHandle || "").toLowerCase() === branchFilter.toLowerCase(),
    );
    return filtered
      .map((edge) => nodes.find((n) => n.id === edge.target))
      .filter(Boolean) as WorkflowNode[];
  }

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
  console.log(
    `[direct] start workflowId=${workflowId} executionId=${executionId}`,
  );
  // Fetch workflow first to check concurrency / timeout settings
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
  });

  if (!workflow) {
    console.error(`[direct] workflow not found: ${workflowId}`);
    await prisma.execution
      .update({
        where: { id: executionId },
        data: {
          status: "ERROR",
          finishedAt: new Date(),
          error: `Workflow ${workflowId} not found`,
        },
      })
      .catch(() => {});
    throw new Error(`Workflow ${workflowId} not found`);
  }

  console.log(
    `[direct] workflow found: "${workflow.name}" nodes=${Array.isArray(workflow.nodes) ? (workflow.nodes as unknown[]).length : 0}`,
  );

  // ── Concurrency check ─────────────────────────────────────────────
  const maxConcurrency = workflow.maxConcurrency ?? 0;
  if (maxConcurrency > 0) {
    const running = await prisma.execution.count({
      where: { workflowId, status: "RUNNING" },
    });
    console.log(
      `[direct] concurrency check: running=${running} max=${maxConcurrency}`,
    );
    if (running >= maxConcurrency) {
      console.warn(`[direct] concurrency limit reached — cancelling execution`);
      await prisma.execution.update({
        where: { id: executionId },
        data: {
          status: "CANCELLED",
          finishedAt: new Date(),
          error: `Concurrency limit reached (max ${maxConcurrency} concurrent execution${maxConcurrency === 1 ? "" : "s"})`,
        },
      });
      return { success: false, executionId, results: {} };
    }
  }

  // Update execution status to running
  await prisma.execution.update({
    where: { id: executionId },
    data: {
      status: "RUNNING",
      startedAt: new Date(),
    },
  });

  // ── Timeout wrapper ───────────────────────────────────────────────
  const timeoutMs = workflow.timeoutMs ?? 0;

  const runExecution = async (): Promise<{
    success: boolean;
    executionId: string;
    results: Record<string, unknown>;
  }> => {
    try {
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
        teamId: workflow.teamId,
        triggerData,
        nodeResults: {},
      };

      console.log(
        `[direct] starting BFS: triggerNode=${triggerNode.id} type=${triggerNode.data.type} totalNodes=${nodes.length} totalEdges=${edges.length}`,
      );

      // Execute nodes in order (BFS traversal)
      const executed = new Set<string>();
      const queue: WorkflowNode[] = [triggerNode];

      while (queue.length > 0) {
        const currentNode = queue.shift()!;

        if (executed.has(currentNode.id)) {
          continue;
        }

        console.log(
          `[direct] executing node id=${currentNode.id} type=${currentNode.data.type} label="${currentNode.data.label}"`,
        );
        // Execute the node
        const result = await executeNode(currentNode, context);

        // Handle wait nodes
        if (currentNode.data.type === "wait") {
          const waitMs =
            parseInt(String(currentNode.data.config.duration), 10) || 1000;
          await new Promise((resolve) => setTimeout(resolve, waitMs));
        }

        console.log(
          `[direct] node ${currentNode.id} (${currentNode.data.type}) result:`,
          JSON.stringify(result).slice(0, 200),
        );

        // Store result and persist incrementally so UI shows real-time progress
        context.nodeResults[currentNode.id] = result;
        executed.add(currentNode.id);
        await prisma.execution.update({
          where: { id: executionId },
          data: { nodeResults: context.nodeResults as Record<string, never> },
        });

        // Determine branch filter for conditional nodes
        let branchFilter: string | undefined;
        if (currentNode.data.type === "if") {
          const ifResult = result as { condition: boolean; branch: string };
          branchFilter = ifResult.branch; // "true" or "false"
        } else if (currentNode.data.type === "switch") {
          const switchResult = result as {
            matched: boolean;
            case?: unknown;
            output?: unknown;
          };
          branchFilter = switchResult.matched
            ? String(switchResult.case)
            : "default";
        }

        // Get and queue next nodes (filtered by branch for IF/Switch)
        const nextNodes = getNextNodes(
          currentNode.id,
          edges,
          nodes,
          branchFilter,
        );
        for (const nextNode of nextNodes) {
          if (!executed.has(nextNode.id)) {
            queue.push(nextNode);
          }
        }
      }

      console.log(
        `[direct] all nodes executed (${executed.size}). marking SUCCESS.`,
      );

      // Update execution status to success
      const finishedAt = new Date();
      const startRecord = await prisma.execution.findUnique({
        where: { id: executionId },
        select: { startedAt: true },
      });
      const duration = startRecord?.startedAt
        ? finishedAt.getTime() - startRecord.startedAt.getTime()
        : null;
      await prisma.execution.update({
        where: { id: executionId },
        data: {
          status: "SUCCESS",
          finishedAt,
          duration,
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
      console.error(`[direct] execution ERROR:`, error);
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
  }; // end runExecution

  if (timeoutMs > 0) {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(`Workflow execution timed out after ${timeoutMs}ms`),
          ),
        timeoutMs,
      ),
    );
    return Promise.race([runExecution(), timeoutPromise]).catch(async (err) => {
      await prisma.execution.update({
        where: { id: executionId },
        data: {
          status: "ERROR",
          finishedAt: new Date(),
          error: (err as Error).message,
        },
      });
      throw err;
    });
  }

  return runExecution();
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
        teamId: workflow.teamId,
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

        // Store result immediately so it's available before any sleep
        context.nodeResults[currentNode.id] = result;
        executed.add(currentNode.id);

        // Persist progress to DB so UI shows real-time node status
        await step.run(`save-progress-${currentNode.id}`, async () => {
          await prisma.execution.update({
            where: { id: executionId },
            data: { nodeResults: context.nodeResults as Record<string, never> },
          });
        });

        // Handle wait/delay nodes with durable sleep
        if (
          currentNode.data.type === "wait" ||
          currentNode.data.type === "delay"
        ) {
          const raw = currentNode.data.config.duration;
          const waitMs =
            typeof raw === "string"
              ? parseInt(raw, 10) || 1000
              : (raw as number) || 1000;
          await step.sleep(`wait-${currentNode.id}`, waitMs);
        }

        // Determine branch filter for conditional nodes
        let branchFilter: string | undefined;
        if (currentNode.data.type === "if") {
          const ifResult = result as { condition: boolean; branch: string };
          branchFilter = ifResult.branch; // "true" or "false"
        } else if (currentNode.data.type === "switch") {
          const switchResult = result as {
            matched: boolean;
            case?: unknown;
            output?: unknown;
          };
          branchFilter = switchResult.matched
            ? String(switchResult.case)
            : "default";
        }

        // Get and queue next nodes (filtered by branch for IF/Switch)
        const nextNodes = getNextNodes(
          currentNode.id,
          edges,
          nodes,
          branchFilter,
        );
        for (const nextNode of nextNodes) {
          if (!executed.has(nextNode.id)) {
            queue.push(nextNode);
          }
        }
      }

      // Update execution status to success
      await step.run("update-status-success", async () => {
        const finishedAt = new Date();
        const startRecord = await prisma.execution.findUnique({
          where: { id: executionId },
          select: { startedAt: true },
        });
        const duration = startRecord?.startedAt
          ? finishedAt.getTime() - startRecord.startedAt.getTime()
          : null;
        await prisma.execution.update({
          where: { id: executionId },
          data: {
            status: "SUCCESS",
            finishedAt,
            duration,
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

        // Calculate real next run time from cron expression
        const nextRun = getNextCronDate(schedule.cronExpression);
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

// ── IMAP Inbox Poller ─────────────────────────────────────────────────────────

/**
 * Polls the IMAP inbox for a single workflow and creates executions for each
 * new email. Called by both the Inngest cron and the tRPC "Poll Now" endpoint.
 */
export async function pollImapWorkflowOnce(workflowId: string): Promise<{
  connected: boolean;
  emailsFound: number;
  executionsCreated: number;
  error?: string;
}> {
  const wf = await prisma.workflow.findUnique({
    where: { id: workflowId },
    select: { id: true, nodes: true, teamId: true, settings: true },
  });
  if (!wf) {
    return {
      connected: false,
      emailsFound: 0,
      executionsCreated: 0,
      error: "Workflow not found",
    };
  }

  const nodes = wf.nodes as unknown as WorkflowNode[];
  const triggerNode = nodes.find(
    (n) => n.type === "trigger" && n.data.type === "email-inbox",
  );
  if (!triggerNode) {
    return {
      connected: false,
      emailsFound: 0,
      executionsCreated: 0,
      error: "No email-inbox trigger node found",
    };
  }

  const cfg = (triggerNode.data.config ?? {}) as Record<string, unknown>;
  const credentialId = cfg.credentialId as string | undefined;
  if (!credentialId) {
    return {
      connected: false,
      emailsFound: 0,
      executionsCreated: 0,
      error: "No IMAP credential selected in trigger node",
    };
  }

  let imapConfig: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
  };
  try {
    const cred = await prisma.credential.findUnique({
      where: { id: credentialId },
    });
    if (!cred) {
      return {
        connected: false,
        emailsFound: 0,
        executionsCreated: 0,
        error: `Credential not found: ${credentialId}`,
      };
    }
    const decrypted = decryptCredential(cred.data);
    imapConfig = {
      host: (decrypted.host as string) || "",
      port: Number(decrypted.port ?? 993),
      secure: decrypted.secure !== false,
      user: (decrypted.user as string) || "",
      pass: (decrypted.pass as string) || "",
    };
  } catch (err) {
    return {
      connected: false,
      emailsFound: 0,
      executionsCreated: 0,
      error: `Failed to decrypt credential: ${(err as Error).message}`,
    };
  }

  const mailbox = (cfg.mailbox as string) || "INBOX";
  const filterFrom = (cfg.filterFrom as string) || "";
  const filterSubject = (cfg.filterSubject as string) || "";

  const metaKey = `imap_last_poll_${triggerNode.id}`;
  const settings = (wf.settings ?? {}) as Record<string, unknown>;
  const lastPoll = settings[metaKey]
    ? new Date(settings[metaKey] as string)
    : new Date(Date.now() - 5 * 60 * 1000);

  console.log(
    `[imap] polling ${imapConfig.host} mailbox=${mailbox} since=${lastPoll.toISOString()} workflow=${wf.id}`,
  );

  const { ImapFlow } = await import("imapflow");
  const client = new ImapFlow({
    host: imapConfig.host,
    port: imapConfig.port,
    secure: imapConfig.secure,
    auth: { user: imapConfig.user, pass: imapConfig.pass },
    logger: false,
  });

  const emails: Array<{
    messageId: string;
    from: string;
    subject: string;
    body: string;
    date: string;
  }> = [];
  let connected = false;

  try {
    await client.connect();
    connected = true;
    const lock = await client.getMailboxLock(mailbox);
    try {
      for await (const msg of client.fetch(
        { since: lastPoll },
        { envelope: true, bodyStructure: true, source: true },
      )) {
        const env = msg.envelope;
        if (!env) continue;
        const from = env.from?.[0]?.address ?? "";
        const subject = env.subject ?? "";
        const date = env.date?.toISOString() ?? new Date().toISOString();
        const msgId = env.messageId ?? msg.uid.toString();
        const body = msg.source
          ? msg.source.toString("utf8").slice(0, 10000)
          : "";

        if (
          filterFrom &&
          !from.toLowerCase().includes(filterFrom.toLowerCase())
        )
          continue;
        if (
          filterSubject &&
          !subject.toLowerCase().includes(filterSubject.toLowerCase())
        )
          continue;

        emails.push({ messageId: msgId, from, subject, body, date });
      }
    } finally {
      lock.release();
    }
    await client.logout();
  } catch (err) {
    console.error(`[imap] connection error for workflow ${wf.id}:`, err);
    return {
      connected,
      emailsFound: 0,
      executionsCreated: 0,
      error: (err as Error).message,
    };
  }

  console.log(
    `[imap] found ${emails.length} new email(s) for workflow ${wf.id}`,
  );

  let executionsCreated = 0;
  for (const email of emails) {
    const execution = await prisma.execution.create({
      data: {
        workflowId: wf.id,
        mode: "SCHEDULED",
        status: "PENDING",
        inputData: email,
      },
    });
    await executeWorkflowDirect(wf.id, execution.id, {
      from: email.from,
      subject: email.subject,
      body: email.body,
      date: email.date,
      messageId: email.messageId,
    });
    executionsCreated++;
  }

  await prisma.workflow.update({
    where: { id: wf.id },
    data: {
      settings: JSON.parse(
        JSON.stringify({ ...settings, [metaKey]: new Date().toISOString() }),
      ),
    },
  });

  return { connected, emailsFound: emails.length, executionsCreated };
}

// Runs every minute, finds workflows with email-inbox triggers, polls each mailbox.
export const imapPoller = inngest.createFunction(
  { id: "imap-inbox-poller" },
  { cron: "* * * * *" },
  async ({ step }) => {
    const workflows = await step.run("fetch-imap-workflows", async () => {
      const all = await prisma.workflow.findMany({
        where: { isActive: true },
        select: { id: true, nodes: true },
      });
      return all
        .filter((wf) => {
          const nodes = wf.nodes as unknown as WorkflowNode[];
          return (
            Array.isArray(nodes) &&
            nodes.some(
              (n) => n.type === "trigger" && n.data?.type === "email-inbox",
            )
          );
        })
        .map((wf) => wf.id);
    });

    let totalTriggered = 0;
    for (const wfId of workflows) {
      const result = await step.run(`poll-imap-${wfId}`, () =>
        pollImapWorkflowOnce(wfId),
      );
      totalTriggered += result.executionsCreated;
      if (result.error) {
        console.warn(`[imap] workflow ${wfId} poll error: ${result.error}`);
      }
    }

    return { workflows: workflows.length, triggered: totalTriggered };
  },
);
