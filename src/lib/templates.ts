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
      {
        id: "1",
        type: "trigger",
        position: { x: 100, y: 100 },
        data: { type: "webhook", label: "Webhook Trigger", config: {} },
      },
      {
        id: "2",
        type: "action",
        position: { x: 350, y: 100 },
        data: {
          type: "slack",
          label: "Send to Slack",
          config: {
            channel: "#general",
            message: "New webhook received: {{trigger.body}}",
          },
        },
      },
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
      {
        id: "1",
        type: "trigger",
        position: { x: 100, y: 100 },
        data: {
          type: "schedule",
          label: "Daily at 9 AM",
          config: { cron: "0 9 * * *" },
        },
      },
      {
        id: "2",
        type: "action",
        position: { x: 350, y: 100 },
        data: {
          type: "http-request",
          label: "Fetch Data",
          config: { url: "https://api.example.com/data", method: "GET" },
        },
      },
      {
        id: "3",
        type: "action",
        position: { x: 600, y: 100 },
        data: {
          type: "email",
          label: "Send Report",
          config: {
            to: "team@example.com",
            subject: "Daily Report",
            emailBody: "Here is your daily report data:\n\n{{2.data}}",
          },
        },
      },
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
      {
        id: "1",
        type: "trigger",
        position: { x: 100, y: 100 },
        data: { type: "manual", label: "Manual Trigger", config: {} },
      },
      {
        id: "2",
        type: "action",
        position: { x: 350, y: 100 },
        data: {
          type: "openai",
          label: "Generate Content",
          config: {
            model: "gpt-4o",
            prompt: "Write a blog post about {{trigger.topic}}",
          },
        },
      },
      {
        id: "3",
        type: "action",
        position: { x: 600, y: 100 },
        data: {
          type: "notion",
          label: "Save to Notion",
          config: { operation: "create_page" },
        },
      },
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
      {
        id: "1",
        type: "trigger",
        position: { x: 100, y: 100 },
        data: {
          type: "schedule",
          label: "Every Hour",
          config: { cron: "0 * * * *" },
        },
      },
      {
        id: "2",
        type: "action",
        position: { x: 350, y: 100 },
        data: {
          type: "http-request",
          label: "Fetch API",
          config: { url: "https://api.example.com/items", method: "GET" },
        },
      },
      {
        id: "3",
        type: "action",
        position: { x: 600, y: 100 },
        data: {
          type: "loop",
          label: "Process Items",
          config: { expression: "item" },
        },
      },
      {
        id: "4",
        type: "action",
        position: { x: 850, y: 100 },
        data: {
          type: "google_sheets",
          label: "Save to Sheets",
          config: { operation: "append_row" },
        },
      },
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
      {
        id: "1",
        type: "trigger",
        position: { x: 100, y: 100 },
        data: { type: "webhook", label: "GitHub Webhook", config: {} },
      },
      {
        id: "2",
        type: "action",
        position: { x: 350, y: 100 },
        data: {
          type: "if",
          label: "Is New Issue?",
          config: { condition: "input?.action === 'opened'" },
        },
      },
      {
        id: "3",
        type: "action",
        position: { x: 600, y: 100 },
        data: {
          type: "slack",
          label: "Notify Team",
          config: {
            channel: "#dev",
            message: "New issue: {{trigger.issue.title}}",
          },
        },
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3", sourceHandle: "true" },
    ],
    tags: ["github", "webhook", "slack", "developer"],
  },
  {
    id: "lead-notification-pipeline",
    name: "Lead Notification Pipeline",
    description:
      "Route incoming leads to email and Slack based on lead score. Requires: Slack credential, SMTP credential.",
    category: "Sales",
    icon: "webhook",
    nodes: [
      {
        id: "1",
        type: "trigger",
        position: { x: 100, y: 200 },
        data: {
          type: "webhook",
          label: "Incoming Lead",
          config: {},
        },
      },
      {
        id: "2",
        type: "action",
        position: { x: 350, y: 200 },
        data: {
          type: "if",
          label: "High-Value Lead?",
          config: { condition: "input?.body?.score >= 80" },
        },
      },
      {
        id: "3",
        type: "action",
        position: { x: 600, y: 100 },
        data: {
          type: "slack",
          label: "Alert Sales Team",
          config: {
            channel: "#sales",
            message:
              "🔥 High-value lead: {{trigger.body.name}} (Score: {{trigger.body.score}})",
          },
        },
      },
      {
        id: "4",
        type: "action",
        position: { x: 600, y: 300 },
        data: {
          type: "email",
          label: "Send Welcome Email",
          config: {
            to: "{{trigger.body.email}}",
            subject: "Thanks for your interest!",
            emailBody:
              "Hi {{trigger.body.name}}, we received your inquiry and will be in touch shortly.",
          },
        },
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3", sourceHandle: "true" },
      { id: "e2-4", source: "2", target: "4", sourceHandle: "false" },
    ],
    tags: ["sales", "leads", "webhook", "slack", "email"],
  },
  {
    id: "ai-email-responder",
    name: "AI Email Responder",
    description:
      "Generate AI-powered email drafts from prompts and send them. Requires: OpenAI/Anthropic API key, SMTP credential.",
    category: "AI",
    icon: "openai",
    nodes: [
      {
        id: "1",
        type: "trigger",
        position: { x: 100, y: 150 },
        data: { type: "manual", label: "Manual Trigger", config: {} },
      },
      {
        id: "2",
        type: "action",
        position: { x: 350, y: 150 },
        data: {
          type: "openai",
          label: "Generate Email Draft",
          config: {
            provider: "openai",
            model: "gpt-4o",
            systemPrompt:
              "You are a professional email writer. Write concise, polite emails.",
            prompt:
              "Write an email about: {{trigger.topic}}\nRecipient: {{trigger.recipientName}}",
          },
        },
      },
      {
        id: "3",
        type: "action",
        position: { x: 600, y: 150 },
        data: {
          type: "email",
          label: "Send Email",
          config: {
            to: "{{trigger.to}}",
            subject: "{{trigger.subject}}",
            emailBody: "{{2.text}}",
          },
        },
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
    ],
    tags: ["ai", "email", "openai", "automation"],
  },
  {
    id: "api-health-monitor",
    name: "API Health Monitor",
    description:
      "Check API health every 5 minutes and alert on failure. Requires: Slack or SMTP credential.",
    category: "DevOps",
    icon: "http",
    nodes: [
      {
        id: "1",
        type: "trigger",
        position: { x: 100, y: 200 },
        data: {
          type: "schedule",
          label: "Every 5 Minutes",
          config: { cron: "*/5 * * * *" },
        },
      },
      {
        id: "2",
        type: "action",
        position: { x: 350, y: 200 },
        data: {
          type: "http-request",
          label: "Health Check",
          config: {
            url: "https://your-api.com/health",
            method: "GET",
          },
        },
      },
      {
        id: "3",
        type: "action",
        position: { x: 600, y: 200 },
        data: {
          type: "if",
          label: "Is Down?",
          config: { condition: "results['2']?.status !== 200" },
        },
      },
      {
        id: "4",
        type: "action",
        position: { x: 850, y: 100 },
        data: {
          type: "slack",
          label: "Alert Team",
          config: {
            channel: "#alerts",
            message:
              "🚨 API Health Check FAILED! Status: {{2.status}}. URL: https://your-api.com/health",
          },
        },
      },
      {
        id: "5",
        type: "action",
        position: { x: 850, y: 300 },
        data: {
          type: "email",
          label: "Email Alert",
          config: {
            to: "devops@yourcompany.com",
            subject: "⚠️ API DOWN — Health check failed",
            emailBody:
              "Your API health check returned status {{2.status}} at {{trigger.triggeredAt}}.",
          },
        },
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4", sourceHandle: "true" },
      { id: "e3-5", source: "3", target: "5", sourceHandle: "true" },
    ],
    tags: ["devops", "monitoring", "health-check", "alerts"],
  },
  {
    id: "content-review-pipeline",
    name: "Content Review Pipeline",
    description:
      "AI reviews submitted content, saves approved items to Notion. Requires: OpenAI API key, Notion credential.",
    category: "AI",
    icon: "openai",
    nodes: [
      {
        id: "1",
        type: "trigger",
        position: { x: 100, y: 200 },
        data: { type: "webhook", label: "Content Submission", config: {} },
      },
      {
        id: "2",
        type: "action",
        position: { x: 350, y: 200 },
        data: {
          type: "openai",
          label: "AI Review",
          config: {
            provider: "openai",
            model: "gpt-4o",
            systemPrompt:
              'You are a content reviewer. Respond with JSON: {"approved": true/false, "feedback": "..."}',
            prompt:
              "Review this content for quality and accuracy:\n\n{{trigger.body.content}}",
          },
        },
      },
      {
        id: "3",
        type: "action",
        position: { x: 600, y: 200 },
        data: {
          type: "if",
          label: "Approved?",
          config: {
            condition:
              "String(results['2']?.text || '').includes('\"approved\": true')",
          },
        },
      },
      {
        id: "4",
        type: "action",
        position: { x: 850, y: 100 },
        data: {
          type: "notion",
          label: "Save to Notion",
          config: {
            operation: "create_page",
            databaseId: "YOUR_DATABASE_ID",
            title: "{{trigger.body.title}}",
          },
        },
      },
      {
        id: "5",
        type: "action",
        position: { x: 850, y: 300 },
        data: {
          type: "email",
          label: "Rejection Notice",
          config: {
            to: "{{trigger.body.authorEmail}}",
            subject: "Content Review: Revision Needed",
            emailBody:
              "Your content '{{trigger.body.title}}' needs revision. Feedback: {{2.text}}",
          },
        },
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4", sourceHandle: "true" },
      { id: "e3-5", source: "3", target: "5", sourceHandle: "false" },
    ],
    tags: ["ai", "content", "notion", "review"],
  },
  {
    id: "stripe-payment-notifier",
    name: "Stripe Payment Notifier",
    description:
      "Get notified via Slack and email when Stripe payments arrive. Requires: Slack credential, SMTP credential.",
    category: "Payments",
    icon: "stripe",
    nodes: [
      {
        id: "1",
        type: "trigger",
        position: { x: 100, y: 200 },
        data: {
          type: "webhook",
          label: "Stripe Webhook",
          config: {},
        },
      },
      {
        id: "2",
        type: "action",
        position: { x: 350, y: 200 },
        data: {
          type: "transform",
          label: "Extract Payment Info",
          config: {
            expression:
              "({ amount: input.body?.data?.object?.amount / 100, currency: input.body?.data?.object?.currency, customer: input.body?.data?.object?.customer, type: input.body?.type })",
          },
        },
      },
      {
        id: "3",
        type: "action",
        position: { x: 600, y: 100 },
        data: {
          type: "slack",
          label: "Notify on Slack",
          config: {
            channel: "#payments",
            message:
              "💰 Payment received! ${{2.amount}} {{2.currency}} from customer {{2.customer}}",
          },
        },
      },
      {
        id: "4",
        type: "action",
        position: { x: 600, y: 300 },
        data: {
          type: "email",
          label: "Email Finance",
          config: {
            to: "finance@yourcompany.com",
            subject: "New Payment: ${{2.amount}}",
            emailBody:
              "A payment of ${{2.amount}} {{2.currency}} was received from customer {{2.customer}}.",
          },
        },
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e2-4", source: "2", target: "4" },
    ],
    tags: ["stripe", "payments", "slack", "email"],
  },
  {
    id: "customer-onboarding",
    name: "Customer Onboarding Sequence",
    description:
      "Welcome email, wait 2 days, then send follow-up. Requires: SMTP credential.",
    category: "CRM",
    icon: "email",
    nodes: [
      {
        id: "1",
        type: "trigger",
        position: { x: 100, y: 200 },
        data: {
          type: "webhook",
          label: "New Customer",
          config: {},
        },
      },
      {
        id: "2",
        type: "action",
        position: { x: 350, y: 200 },
        data: {
          type: "email",
          label: "Welcome Email",
          config: {
            to: "{{trigger.body.email}}",
            subject: "Welcome to our platform! 🎉",
            emailBody:
              "Hi {{trigger.body.name}},\n\nWelcome! We're thrilled to have you.\n\nHere are some things to get you started...",
          },
        },
      },
      {
        id: "3",
        type: "action",
        position: { x: 600, y: 200 },
        data: {
          type: "wait",
          label: "Wait 2 Days",
          config: { duration: "172800000" },
        },
      },
      {
        id: "4",
        type: "action",
        position: { x: 850, y: 200 },
        data: {
          type: "email",
          label: "Follow-up Email",
          config: {
            to: "{{trigger.body.email}}",
            subject: "How's it going? Need any help?",
            emailBody:
              "Hi {{trigger.body.name}},\n\nJust checking in! Have you had a chance to explore the platform?\n\nLet us know if you need any help.",
          },
        },
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
    ],
    tags: ["crm", "onboarding", "email", "wait"],
  },
  {
    id: "github-pr-reviewer",
    name: "GitHub PR Reviewer",
    description:
      "AI-assisted pull request review — gets PR details and posts a review comment. Requires: OpenAI API key, GitHub credential.",
    category: "Developer",
    icon: "github",
    nodes: [
      {
        id: "1",
        type: "trigger",
        position: { x: 100, y: 200 },
        data: {
          type: "webhook",
          label: "GitHub PR Webhook",
          config: {},
        },
      },
      {
        id: "2",
        type: "action",
        position: { x: 350, y: 200 },
        data: {
          type: "if",
          label: "Is PR Opened?",
          config: { condition: "input?.body?.action === 'opened'" },
        },
      },
      {
        id: "3",
        type: "action",
        position: { x: 600, y: 200 },
        data: {
          type: "openai",
          label: "AI Code Review",
          config: {
            provider: "openai",
            model: "gpt-4o",
            systemPrompt:
              "You are a senior code reviewer. Provide constructive feedback on the pull request. Be concise.",
            prompt:
              "Review this PR:\nTitle: {{trigger.body.pull_request.title}}\nDescription: {{trigger.body.pull_request.body}}\nChanged files: {{trigger.body.pull_request.changed_files}}",
          },
        },
      },
      {
        id: "4",
        type: "action",
        position: { x: 850, y: 200 },
        data: {
          type: "github",
          label: "Post Review Comment",
          config: {
            operation: "create_issue",
            owner: "{{trigger.body.repository.owner.login}}",
            repo: "{{trigger.body.repository.name}}",
            title: "AI Review: {{trigger.body.pull_request.title}}",
            body: "{{3.text}}",
          },
        },
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3", sourceHandle: "true" },
      { id: "e3-4", source: "3", target: "4" },
    ],
    tags: ["github", "ai", "code-review", "developer"],
  },
  {
    id: "form-to-db-notify",
    name: "Form Submission → DB + Notify",
    description:
      "Save form submissions to a PostgreSQL database and notify the team on Telegram and Discord. Requires: PostgreSQL credential, Telegram bot token, Discord webhook.",
    category: "Data",
    icon: "database",
    nodes: [
      {
        id: "1",
        type: "trigger",
        position: { x: 100, y: 200 },
        data: { type: "webhook", label: "Form Submission", config: {} },
      },
      {
        id: "2",
        type: "action",
        position: { x: 350, y: 200 },
        data: {
          type: "database",
          label: "Save Lead to DB",
          config: {
            query:
              "INSERT INTO leads (name, email, message, created_at) VALUES ('{{trigger.body.name}}', '{{trigger.body.email}}', '{{trigger.body.message}}', NOW()) RETURNING id",
          },
        },
      },
      {
        id: "3",
        type: "action",
        position: { x: 600, y: 100 },
        data: {
          type: "telegram",
          label: "Notify via Telegram",
          config: {
            text: "📬 New lead: {{trigger.body.name}} ({{trigger.body.email}})\n{{trigger.body.message}}",
            parseMode: "HTML",
          },
        },
      },
      {
        id: "4",
        type: "action",
        position: { x: 600, y: 300 },
        data: {
          type: "discord",
          label: "Log to Discord",
          config: {
            message:
              "New submission from **{{trigger.body.name}}** — {{trigger.body.email}}",
            username: "Flowgent Bot",
          },
        },
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e2-4", source: "2", target: "4" },
    ],
    tags: ["database", "telegram", "discord", "webhook", "leads"],
  },
  {
    id: "scheduled-db-digest",
    name: "Scheduled DB Digest",
    description:
      "Weekly query from PostgreSQL, filter active error records, sort by timestamp, format and email a digest. Requires: PostgreSQL credential, SMTP credential.",
    category: "Scheduled",
    icon: "schedule",
    nodes: [
      {
        id: "1",
        type: "trigger",
        position: { x: 100, y: 200 },
        data: {
          type: "schedule",
          label: "Every Monday 9 AM",
          config: { cron: "0 9 * * 1" },
        },
      },
      {
        id: "2",
        type: "action",
        position: { x: 350, y: 200 },
        data: {
          type: "database",
          label: "Fetch Last 7 Days Events",
          config: {
            query:
              "SELECT id, type, message, created_at FROM events WHERE created_at >= NOW() - INTERVAL '7 days' ORDER BY created_at DESC",
          },
        },
      },
      {
        id: "3",
        type: "action",
        position: { x: 600, y: 200 },
        data: {
          type: "filter",
          label: "Errors Only",
          config: {
            conditions: [
              {
                field: "type",
                operator: "===",
                value: "error",
                combinator: "AND",
              },
            ],
            condition: "item.type === 'error'",
          },
        },
      },
      {
        id: "4",
        type: "action",
        position: { x: 850, y: 200 },
        data: {
          type: "sort",
          label: "Sort by Date",
          config: { field: "created_at", order: "desc" },
        },
      },
      {
        id: "5",
        type: "action",
        position: { x: 1100, y: 200 },
        data: {
          type: "set",
          label: "Format Digest",
          config: {
            fields: {
              subject: "Weekly Error Digest — {{trigger.triggeredAt}}",
              errorCount: "{{3.length}}",
            },
          },
        },
      },
      {
        id: "6",
        type: "action",
        position: { x: 1350, y: 200 },
        data: {
          type: "email",
          label: "Send Digest",
          config: {
            to: "admin@yourcompany.com",
            subject: "Weekly Error Digest",
            emailBody:
              "There were {{5.errorCount}} errors in the last 7 days.\n\nSee attached for details.",
          },
        },
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e5-6", source: "5", target: "6" },
    ],
    tags: ["schedule", "database", "filter", "sort", "email", "digest"],
  },
  {
    id: "api-key-deploy-hook",
    name: "API Key Deploy Hook",
    description:
      "Trigger a deployment via API key, check the result, then notify on Slack (success) or Telegram (failure). Requires: Slack credential, Telegram bot token.",
    category: "DevOps",
    icon: "http",
    nodes: [
      {
        id: "1",
        type: "trigger",
        position: { x: 100, y: 200 },
        data: {
          type: "webhook",
          label: "API Key Trigger",
          config: {},
        },
      },
      {
        id: "2",
        type: "action",
        position: { x: 350, y: 200 },
        data: {
          type: "http-request",
          label: "Trigger Deployment",
          config: {
            url: "https://your-deploy-endpoint.com/deploy",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: '{"ref": "main"}',
          },
        },
      },
      {
        id: "3",
        type: "action",
        position: { x: 600, y: 200 },
        data: {
          type: "if",
          label: "Deploy OK?",
          config: {
            conditions: [
              {
                field: "2.status",
                operator: "===",
                value: "200",
                combinator: "AND",
              },
            ],
            condition: "results['2']?.status === 200",
          },
        },
      },
      {
        id: "4",
        type: "action",
        position: { x: 850, y: 100 },
        data: {
          type: "slack",
          label: "Success Alert",
          config: {
            channel: "#deployments",
            message: "✅ Deployment triggered successfully via API key.",
          },
        },
      },
      {
        id: "5",
        type: "action",
        position: { x: 850, y: 300 },
        data: {
          type: "telegram",
          label: "Failure Alert",
          config: {
            text: "❌ Deployment FAILED. HTTP status: {{2.status}}",
            parseMode: "HTML",
          },
        },
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4", sourceHandle: "true" },
      { id: "e3-5", source: "3", target: "5", sourceHandle: "false" },
    ],
    tags: ["devops", "deployment", "slack", "telegram", "api-key"],
  },
  {
    id: "scheduled-data-backup",
    name: "Scheduled Data Backup",
    description:
      "Daily API data backup with transformation to Google Sheets. Requires: Google Sheets credential.",
    category: "Operations",
    icon: "schedule",
    nodes: [
      {
        id: "1",
        type: "trigger",
        position: { x: 100, y: 200 },
        data: {
          type: "schedule",
          label: "Daily at Midnight",
          config: { cron: "0 0 * * *" },
        },
      },
      {
        id: "2",
        type: "action",
        position: { x: 350, y: 200 },
        data: {
          type: "http-request",
          label: "Fetch Data",
          config: {
            url: "https://api.example.com/data/export",
            method: "GET",
          },
        },
      },
      {
        id: "3",
        type: "action",
        position: { x: 600, y: 200 },
        data: {
          type: "transform",
          label: "Format for Sheets",
          config: {
            expression:
              "Array.isArray(input) ? input.map(item => ({ id: item.id, name: item.name, date: new Date().toISOString() })) : [input]",
          },
        },
      },
      {
        id: "4",
        type: "action",
        position: { x: 850, y: 200 },
        data: {
          type: "google_sheets",
          label: "Save to Sheets",
          config: { operation: "append_row" },
        },
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
    ],
    tags: ["schedule", "backup", "google-sheets", "data"],
  },
  {
    id: "ai-email-auto-responder",
    name: "AI Email Auto-Responder",
    description:
      "Monitor your inbox via IMAP, use AI to draft a smart reply, and send it back automatically",
    category: "AI",
    icon: "email-inbox",
    nodes: [
      {
        id: "1",
        type: "trigger",
        position: { x: 100, y: 150 },
        data: {
          type: "email-inbox",
          label: "Email Inbox (IMAP)",
          config: {
            mailbox: "INBOX",
            filterFrom: "",
            filterSubject: "",
          },
        },
      },
      {
        id: "2",
        type: "action",
        position: { x: 400, y: 150 },
        data: {
          type: "openai",
          label: "Draft AI Reply",
          config: {
            model: "gpt-4o-mini",
            prompt:
              "You received an email from {{trigger.from}} with subject \"{{trigger.subject}}\".\n\nEmail body:\n{{trigger.body}}\n\nWrite a professional, friendly reply. Keep it concise (2-3 paragraphs). Sign off as 'The Team'.",
          },
        },
      },
      {
        id: "3",
        type: "action",
        position: { x: 700, y: 150 },
        data: {
          type: "email",
          label: "Send Reply",
          config: {
            to: "{{trigger.from}}",
            subject: "Re: {{trigger.subject}}",
            body: "{{2.message}}",
          },
        },
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
    ],
    tags: ["ai", "email", "imap", "auto-reply", "openai"],
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
