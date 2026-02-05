# Flowgent Technical Documentation

**Version:** 1.0.0  
**Last Updated:** January 2026  
**Status:** Production Ready

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technological Foundation](#2-technological-foundation)
3. [System Architecture](#3-system-architecture)
4. [Key Features & Modules](#4-key-features--modules)
5. [Node Types Catalog](#5-node-types-catalog)
6. [Database Schema](#6-database-schema-prisma)
7. [Design System & UI/UX](#7-design-system--uiux)
8. [API Reference](#8-api-reference)
9. [Environment Variables](#9-environment-variables)
10. [Security Model](#10-security-model)
11. [Templates & Quick Start](#11-templates--quick-start)
12. [Getting Started](#12-getting-started)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Project Overview

**Flowgent** is an advanced, visually-driven workflow automation platform designed to empower teams to build, execute, and monitor complex business logic without writing code. It combines a powerful React-based drag-and-drop editor with a robust server-side execution engine powered by Inngest, enabling reliable, scalable, and auditable automations.

### Core Value Proposition

- **Visual Programming:** Intuitive node-based editor for defining logic.
- **Reliable Execution:** Durable execution engine with built-in retries and state management.
- **Team Collaboration:** Granular Role-Based Access Control (RBAC) for secure team environments.
- **Enterprise Ready:** Comprehensive logging, audit trails, and version control.

---

## 2. Technological Foundation

Flowgent leverages a cutting-edge "Bleeding Edge" stack.

### Core Stack

| Component            | Technology                | Version |
| -------------------- | ------------------------- | ------- |
| **Framework**        | Next.js (App Router)      | 16.1.1  |
| **Language**         | TypeScript                | 5.x     |
| **UI Library**       | React + Shadcn/UI         | 19.x    |
| **Styling**          | Tailwind CSS              | v4      |
| **Database ORM**     | Prisma                    | 7.2.0   |
| **Database**         | PostgreSQL                | 14+     |
| **API Layer**        | tRPC                      | v11     |
| **Execution Engine** | Inngest                   | 3.49.3  |
| **Auth**             | Better Auth + Polar       | Latest  |
| **Canvas Engine**    | @xyflow/react             | 12.10.0 |
| **AI SDKs**          | OpenAI, Anthropic, Google | Latest  |

### Additional Dependencies

- **Charting:** Recharts
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **Date Utils:** date-fns
- **Notifications:** Slack Web API
- **Database Integrations:** Notion API

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │     React 19 + Next.js App Router + tRPC Client           │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐   │ │
│  │  │ Dashboard    │ │ Workflow     │ │ Executions       │   │ │
│  │  │ Home         │ │ Editor       │ │ Monitor          │   │ │
│  │  └──────────────┘ └──────────────┘ └──────────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (Next.js Server)                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    tRPC v11 Routers                        │ │
│  │  workflows │ executions │ teams │ credentials │ audit     │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │               Prisma ORM → PostgreSQL                      │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXECUTION PLANE (Inngest)                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Durable Functions: workflow.execute, schedule.run         │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │ │
│  │  │ HTTP     │ │ AI       │ │ Slack    │ │ Custom   │      │ │
│  │  │ Executor │ │ Executor │ │ Executor │ │ Executor │      │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Directory Structure

```
src/
├── app/                  # Next.js App Router pages and layouts
│   ├── (auth)/           # Authentication routes (login, signup)
│   ├── (dashboard)/      # Protected application routes
│   │   ├── (rest)/       # Dashboard sub-routes
│   │   │   ├── settings/
│   │   │   ├── teams/
│   │   │   ├── subscription/
│   │   │   └── credentials/
│   │   └── layout.tsx    # Dashboard layout with sidebar
│   └── api/              # API routes
│       ├── auth/         # Better Auth handlers
│       ├── inngest/      # Inngest webhook endpoint
│       ├── trpc/         # tRPC HTTP handler
│       └── webhook/      # Workflow trigger endpoint
├── components/           # Shared UI components (Shadcn + Custom)
│   ├── ui/               # Shadcn primitives
│   └── DashboardHeader.tsx
├── features/             # Feature-based modular architecture
│   ├── auth/             # Authentication components
│   ├── credentials/      # Credentials management
│   ├── dashboard/        # Dashboard home
│   ├── editor/           # Workflow editor & Canvas
│   │   ├── components/   # NodePalette, NodeConfigPanel, etc.
│   │   └── hooks/        # useWorkflowState, etc.
│   ├── executions/       # Execution history & details
│   ├── schedules/        # Cron scheduling
│   ├── teams/            # Team management & RBAC
│   └── workflows/        # Workflow CRUD & templates
├── generated/            # Prisma generated client
├── hooks/                # Shared React hooks
├── inngest/              # Inngest client & functions
│   ├── client.ts         # Inngest client setup
│   └── functions.ts      # All workflow executors
├── lib/                  # Utility functions
│   ├── cron-helper.ts    # Cron expression utilities
│   ├── db.ts             # Prisma client singleton
│   └── templates.ts      # Built-in workflow templates
├── server/               # Server-side utilities
│   └── auth.ts           # Auth configuration
└── trpc/                 # tRPC configuration
    ├── client.ts         # React Query + tRPC client
    ├── init.ts           # tRPC initialization
    └── routers/          # All router definitions
```

---

## 4. Key Features & Modules

### 4.1 The Visual Editor (`src/features/editor`)

- **Canvas:** Built on `@xyflow/react`, supports infinite panning, zooming, and mini-map.
- **Node System:** Custom nodes with type-specific configurations.
- **State Management:** Local React state synced via tRPC mutations.
- **Validation:** Real-time node connection and configuration validation.

### 4.2 Durable Execution Engine (`src/inngest`)

- **Step-by-Step Execution:** Each node is a distinct Inngest "step."
- **State Persistence:** Input/Output persisted to `Execution` table.
- **Retries:** Automatic retries for failed steps.
- **Flow Control:** Branching, parallel execution, sub-workflows.

### 4.3 Team & Collaboration (`src/features/teams`)

- **RBAC Model:** Owners, Admins, Members, Viewers.
- **Isolation:** Workflows scoped to Teams or Users.
- **Invitation System:** Email-based secure invitations.

### 4.4 Credentials Management (`src/features/credentials`)

- **Encryption:** AES-256 encryption at rest.
- **Scoping:** Team-wide or private credentials.

### 4.5 Version Control

- **Snapshotting:** Complete workflow snapshots on version save.
- **Rollback:** Restore previous versions.

---

## 5. Node Types Catalog

### 5.1 Triggers

| Type       | Description              | Configuration              |
| ---------- | ------------------------ | -------------------------- |
| `manual`   | User-initiated execution | None                       |
| `webhook`  | HTTP POST trigger        | Path, Secret, IP Allowlist |
| `schedule` | Cron-based scheduling    | Cron expression, Timezone  |

### 5.2 Actions

| Type            | Description              | Configuration                      |
| --------------- | ------------------------ | ---------------------------------- |
| `http-request`  | Make HTTP API calls      | URL, Method, Headers, Body         |
| `email`         | Send emails              | To, Subject, Body, Template        |
| `slack`         | Post to Slack            | Channel, Message, Webhook URL      |
| `notion`        | Notion operations        | Database ID, Operation, Properties |
| `google_sheets` | Google Sheets operations | Sheet ID, Range, Operation         |
| `openai`        | AI completions (GPT-4)   | Model, Prompt, Temperature         |
| `anthropic`     | AI completions (Claude)  | Model, Prompt, Max Tokens          |
| `gemini`        | AI completions (Google)  | Model, Prompt                      |
| `stripe`        | Payment operations       | Action (charge, subscription)      |
| `twilio`        | SMS/Voice                | Phone, Message, Voice URL          |

### 5.3 Logic Nodes

| Type        | Description            | Configuration                       |
| ----------- | ---------------------- | ----------------------------------- |
| `if`        | Conditional branching  | Condition expression                |
| `switch`    | Multi-path branching   | Cases array                         |
| `loop`      | Iterate over arrays    | Iterator variable, Array expression |
| `delay`     | Wait before continuing | Duration (seconds/minutes/hours)    |
| `transform` | Data transformation    | JavaScript expression               |

### 5.4 Advanced Nodes

| Type           | Description               | Configuration               |
| -------------- | ------------------------- | --------------------------- |
| `sub-workflow` | Execute another workflow  | Workflow ID, Input mapping  |
| `merge`        | Combine parallel branches | Merge strategy              |
| `comment`      | Documentation node        | Comment text (no execution) |

---

## 6. Database Schema (Prisma)

### 6.1 Core Models

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  emailVerified Boolean  @default(false)
  image         String?
  workflows     Workflow[]
  credentials   Credential[]
  executions    Execution[]
  teamMembers   TeamMember[]
}

model Workflow {
  id          String   @id @default(cuid())
  name        String
  description String?
  nodes       Json     @default("[]")
  edges       Json     @default("[]")
  viewport    Json?
  settings    Json?
  isActive    Boolean  @default(false)
  isFavorite  Boolean  @default(false)
  version     Int      @default(1)
  userId      String
  teamId      String?
  executions  Execution[]
  schedules   Schedule[]
  webhooks    WebhookEndpoint[]
}

model Execution {
  id          String          @id @default(cuid())
  status      ExecutionStatus @default(PENDING)
  mode        ExecutionMode   @default(MANUAL)
  startedAt   DateTime        @default(now())
  finishedAt  DateTime?
  duration    Int?
  inputData   Json?
  outputData  Json?
  nodeResults Json?
  error       Json?
  workflowId  String
  userId      String?
}

model Credential {
  id       String @id @default(cuid())
  name     String
  type     String  // oauth2, apiKey, basic, bearer
  provider String  // slack, github, google, custom
  data     String  // Encrypted JSON
  userId   String
}
```

### 6.2 Enums

```prisma
enum ExecutionStatus { PENDING, RUNNING, SUCCESS, ERROR, CANCELLED, WAITING }
enum ExecutionMode { MANUAL, SCHEDULED, WEBHOOK, TRIGGER, SUBWORKFLOW }
enum TeamRole { OWNER, ADMIN, MEMBER, VIEWER }
enum HttpMethod { GET, POST, PUT, PATCH, DELETE }
```

---

## 7. Design System & UI/UX

### 7.1 Design Tokens

- **Colors:** HSL-based variables for Dark/Light mode.
- **Glassmorphism:** `backdrop-blur-xl`, `bg-background/80`, `border-white/10`.
- **Gradients:** Vibrant gradients for primary actions.

### 7.2 CSS Classes

| Class            | Description                      |
| ---------------- | -------------------------------- |
| `glass`          | Glassmorphic container with blur |
| `glass-subtle`   | Lighter glass effect             |
| `gradient-text`  | Animated gradient text           |
| `hover-lift`     | Subtle lift on hover             |
| `hover-glow`     | Glow effect on hover             |
| `animate-fadeIn` | Fade-in entrance animation       |
| `animate-blob`   | Floating blob animation          |

### 7.3 Component Patterns

- **Glass Cards:** Stats, content containers.
- **Interactive Tables:** Sortable, filterable grids.
- **Node Config Panel:** Floating glass sidebar.

---

## 8. API Reference

### 8.1 tRPC Routers

#### `workflows.*`

| Procedure            | Type     | Description                |
| -------------------- | -------- | -------------------------- |
| `list`               | Query    | List user/team workflows   |
| `byId`               | Query    | Get workflow by ID         |
| `create`             | Mutation | Create new workflow        |
| `update`             | Mutation | Update workflow definition |
| `delete`             | Mutation | Delete workflow            |
| `toggleActive`       | Mutation | Activate/deactivate        |
| `duplicate`          | Mutation | Clone workflow             |
| `templates`          | Query    | List built-in templates    |
| `createFromTemplate` | Mutation | Create from template       |
| `toggleFavorite`     | Mutation | Star/unstar workflow       |
| `versions`           | Query    | List version history       |
| `createVersion`      | Mutation | Save new version           |
| `revertToVersion`    | Mutation | Rollback to version        |

#### `executions.*`

| Procedure  | Type     | Description                  |
| ---------- | -------- | ---------------------------- |
| `list`     | Query    | List executions with filters |
| `byId`     | Query    | Get execution details        |
| `retry`    | Mutation | Retry failed execution       |
| `cancel`   | Mutation | Cancel running execution     |
| `timeline` | Query    | Get execution timeline       |

#### `teams.*`

| Procedure      | Type     | Description            |
| -------------- | -------- | ---------------------- |
| `list`         | Query    | List user's teams      |
| `byId`         | Query    | Get team details       |
| `create`       | Mutation | Create new team        |
| `update`       | Mutation | Update team info       |
| `delete`       | Mutation | Delete team            |
| `invite`       | Mutation | Invite member by email |
| `updateRole`   | Mutation | Change member role     |
| `removeMember` | Mutation | Remove team member     |

#### `credentials.*`

| Procedure | Type     | Description           |
| --------- | -------- | --------------------- |
| `list`    | Query    | List user credentials |
| `create`  | Mutation | Store new credential  |
| `update`  | Mutation | Update credential     |
| `delete`  | Mutation | Delete credential     |

#### `schedules.*`

| Procedure     | Type     | Description      |
| ------------- | -------- | ---------------- |
| `list`        | Query    | List schedules   |
| `create`      | Mutation | Create schedule  |
| `update`      | Mutation | Update schedule  |
| `delete`      | Mutation | Delete schedule  |
| `cronPresets` | Query    | Get cron presets |

#### `audit.*`

| Procedure   | Type  | Description              |
| ----------- | ----- | ------------------------ |
| `list`      | Query | List audit logs          |
| `forEntity` | Query | Logs for specific entity |
| `summary`   | Query | Aggregated statistics    |

### 8.2 Webhook API

- **Endpoint:** `POST /api/webhook/:path`
- **Headers:** `x-flowgent-signature` (HMAC-SHA256)
- **Response:** `{ executionId: string }`

---

## 9. Environment Variables

| Variable                       | Required | Description                  |
| ------------------------------ | -------- | ---------------------------- |
| `DATABASE_URL`                 | ✅       | PostgreSQL connection string |
| `BETTER_AUTH_SECRET`           | ✅       | Auth encryption key          |
| `BETTER_AUTH_URL`              | ✅       | Base URL for auth callbacks  |
| `INNGEST_EVENT_KEY`            | ✅       | Inngest event signing key    |
| `INNGEST_SIGNING_KEY`          | ✅       | Inngest webhook verification |
| `OPENAI_API_KEY`               | ❌       | For OpenAI node              |
| `ANTHROPIC_API_KEY`            | ❌       | For Anthropic node           |
| `GOOGLE_GENERATIVE_AI_API_KEY` | ❌       | For Gemini node              |
| `SLACK_BOT_TOKEN`              | ❌       | For Slack integration        |
| `NOTION_API_KEY`               | ❌       | For Notion integration       |
| `STRIPE_SECRET_KEY`            | ❌       | For Stripe integration       |
| `TWILIO_ACCOUNT_SID`           | ❌       | For Twilio integration       |
| `TWILIO_AUTH_TOKEN`            | ❌       | For Twilio integration       |
| `POLAR_ACCESS_TOKEN`           | ❌       | For subscription billing     |
| `SENTRY_DSN`                   | ❌       | Error monitoring             |

---

## 10. Security Model

### 10.1 Authentication

- **Provider:** Better Auth with email/password + OAuth.
- **Session:** Secure HTTP-only cookies.
- **Token Rotation:** Automatic refresh token rotation.

### 10.2 Authorization

- **Resource Isolation:** Workflows scoped to User or Team.
- **RBAC Enforcement:** tRPC middleware validates team roles.
- **Permissions Matrix:**

| Role   | View | Edit | Execute | Delete | Manage Members |
| ------ | ---- | ---- | ------- | ------ | -------------- |
| OWNER  | ✅   | ✅   | ✅      | ✅     | ✅             |
| ADMIN  | ✅   | ✅   | ✅      | ✅     | ✅             |
| MEMBER | ✅   | ✅   | ✅      | ❌     | ❌             |
| VIEWER | ✅   | ❌   | ❌      | ❌     | ❌             |

### 10.3 Data Protection

- **Credentials:** Encrypted at rest (AES-256).
- **Audit Logging:** All mutations logged with IP/User-Agent.
- **Input Validation:** Zod schemas on all tRPC procedures.

### 10.4 Webhook Security

- **HMAC Verification:** Optional signature validation.
- **IP Allowlisting:** Restrict webhook callers.
- **Rate Limiting:** Configurable per-endpoint limits.

---

## 11. Templates & Quick Start

### Built-in Templates

| Template               | Category      | Description                         |
| ---------------------- | ------------- | ----------------------------------- |
| Webhook to Slack       | Notifications | Receive webhook → notify Slack      |
| Daily Report Generator | Scheduled     | Cron → Fetch API → Email            |
| AI Content Generator   | AI            | Manual → OpenAI → Notion            |
| Data Sync Pipeline     | Data          | Hourly → API → Loop → Google Sheets |
| GitHub Issue Notifier  | Developer     | GitHub webhook → IF → Slack         |

### Creating from Template

1. Navigate to Workflows page.
2. Click "Browse Templates".
3. Select a template and click "Use Template".
4. Customize nodes and connections.
5. Save and activate.

---

## 12. Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Chrome/Edge browser (recommended)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd flowgent

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your DATABASE_URL and auth secrets

# Push database schema
npx prisma db push

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

### Deployment (Vercel)

```bash
# Build
npm run build

# Deploy
vercel deploy --prod
```

---

## 13. Troubleshooting

### Common Issues

| Issue                         | Cause                       | Solution                                             |
| ----------------------------- | --------------------------- | ---------------------------------------------------- |
| Database connection failed    | Invalid `DATABASE_URL`      | Verify PostgreSQL is running and URL is correct      |
| Auth redirect loop            | Missing `BETTER_AUTH_URL`   | Set to your app's base URL                           |
| Inngest functions not running | Missing event keys          | Verify `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` |
| Canvas not rendering          | Browser compatibility       | Use Chrome/Edge; check WebGL support                 |
| Workflow execution stuck      | Inngest service unavailable | Check Inngest dashboard for function status          |
| Credential encryption error   | Missing/invalid secret      | Ensure `BETTER_AUTH_SECRET` is set                   |

### Development Commands

```bash
# Run linter
npm run lint

# Format code
npm run format

# View Prisma Studio
npx prisma studio

# Run Inngest dev server
npx inngest-cli dev
```

### Logs & Monitoring

- **Sentry:** Automatic error tracking (configure `SENTRY_DSN`).
- **Inngest Dashboard:** View function runs, retries, failures.
- **Audit Logs:** In-app audit trail for all actions.

---

_Generated by Google Deepmind Agent - January 2026_
