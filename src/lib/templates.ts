// Built-in workflow templates for Flowgent

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  nodes: object[];
  edges: object[];
  tags: string[];
}

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "webhook-to-slack",
    name: "Webhook to Slack",
    description: "Receive a webhook and send a notification to Slack",
    category: "Notifications",
    icon: "webhook",
    nodes: [
      { id: "1", type: "trigger", position: { x: 100, y: 100 }, data: { type: "webhook", label: "Webhook Trigger", config: {} } },
      { id: "2", type: "action", position: { x: 350, y: 100 }, data: { type: "slack", label: "Send to Slack", config: { channel: "#general", message: "New webhook received: {{trigger.body}}" } } },
    ],
    edges: [{ id: "e1-2", source: "1", target: "2" }],
    tags: ["webhook", "slack", "notification"],
  },
  {
    id: "daily-report",
    name: "Daily Report Generator",
    description: "Generate and send a daily report via email",
    category: "Scheduled",
    icon: "schedule",
    nodes: [
      { id: "1", type: "trigger", position: { x: 100, y: 100 }, data: { type: "schedule", label: "Daily at 9 AM", config: { cron: "0 9 * * *" } } },
      { id: "2", type: "action", position: { x: 350, y: 100 }, data: { type: "http-request", label: "Fetch Data", config: { url: "https://api.example.com/data", method: "GET" } } },
      { id: "3", type: "action", position: { x: 600, y: 100 }, data: { type: "email", label: "Send Report", config: { to: "team@example.com", subject: "Daily Report" } } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
    ],
    tags: ["schedule", "email", "report"],
  },
  {
    id: "ai-content-generator",
    name: "AI Content Generator",
    description: "Generate content using OpenAI and save to Notion",
    category: "AI",
    icon: "openai",
    nodes: [
      { id: "1", type: "trigger", position: { x: 100, y: 100 }, data: { type: "manual", label: "Manual Trigger", config: {} } },
      { id: "2", type: "action", position: { x: 350, y: 100 }, data: { type: "openai", label: "Generate Content", config: { model: "gpt-4o-mini", prompt: "Write a blog post about {{trigger.topic}}" } } },
      { id: "3", type: "action", position: { x: 600, y: 100 }, data: { type: "notion", label: "Save to Notion", config: { operation: "create_page" } } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
    ],
    tags: ["ai", "openai", "notion", "content"],
  },
  {
    id: "data-sync",
    name: "Data Sync Pipeline",
    description: "Sync data from API to Google Sheets",
    category: "Data",
    icon: "database",
    nodes: [
      { id: "1", type: "trigger", position: { x: 100, y: 100 }, data: { type: "schedule", label: "Every Hour", config: { cron: "0 * * * *" } } },
      { id: "2", type: "action", position: { x: 350, y: 100 }, data: { type: "http-request", label: "Fetch API", config: { url: "https://api.example.com/items", method: "GET" } } },
      { id: "3", type: "action", position: { x: 600, y: 100 }, data: { type: "loop", label: "Process Items", config: { expression: "item" } } },
      { id: "4", type: "action", position: { x: 850, y: 100 }, data: { type: "google_sheets", label: "Save to Sheets", config: { operation: "append_row" } } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
    ],
    tags: ["data", "sync", "google-sheets", "loop"],
  },
  {
    id: "github-issue-notifier",
    name: "GitHub Issue Notifier",
    description: "Get notified when new GitHub issues are created",
    category: "Developer",
    icon: "github",
    nodes: [
      { id: "1", type: "trigger", position: { x: 100, y: 100 }, data: { type: "webhook", label: "GitHub Webhook", config: {} } },
      { id: "2", type: "action", position: { x: 350, y: 100 }, data: { type: "if", label: "Is New Issue?", config: { condition: "trigger.action === 'opened'" } } },
      { id: "3", type: "action", position: { x: 600, y: 100 }, data: { type: "slack", label: "Notify Team", config: { channel: "#dev", message: "New issue: {{trigger.issue.title}}" } } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
    ],
    tags: ["github", "webhook", "slack", "developer"],
  },
];

// Get templates by category
export function getTemplatesByCategory(category: string): WorkflowTemplate[] {
  return workflowTemplates.filter((t) => t.category === category);
}

// Get all categories
export function getCategories(): string[] {
  return [...new Set(workflowTemplates.map((t) => t.category))];
}

// Get template by ID
export function getTemplateById(id: string): WorkflowTemplate | undefined {
  return workflowTemplates.find((t) => t.id === id);
}
