# Demo Workflows

Eight workflows designed to demonstrate Flowgent at its best — branching logic, multi-step data pipelines, AI integration, and multi-channel output. Each maps to a built-in template.

> **Complexity bar:** A compelling demo workflow has 5+ nodes, at least one branch (IF/Filter), and touches 2+ integration types. Anything simpler just illustrates a node — it doesn't sell the platform.

---

## 1. SaaS API Uptime Monitor

**Template ID:** `api-health-monitor` · **Category:** DevOps  
**Real-life use case:** A startup's backend goes down at 3 AM. Nobody notices for 2 hours because there's no automated alerting. This workflow is the fix.

Pings a health endpoint every 5 minutes. On failure, simultaneously Slacks the #alerts channel and emails the on-call devops address.

**Node chain:**

```
schedule (*/5 * * * *)
  → http-request (GET /health)
  → if (status !== 200)
      ├─ slack (#alerts: "🚨 API DOWN — status {{status}}")
      └─ email (devops@ — timestamped failure report)
```

**Why it's worth showing:** External HTTP → conditional branch → dual parallel outputs. Real production alerting pattern that replaces PagerDuty for simple cases.

**Required credentials:** Slack credential, SMTP credential  
**Tags:** `devops`, `monitoring`, `health-check`, `alerts`

---

## 2. SaaS Trial-to-Paid Drip Sequence

**Template ID:** `customer-onboarding` · **Category:** CRM  
**Real-life use case:** A B2B SaaS with a 14-day free trial. Users who don't convert are often just forgetting — a well-timed 3-email sequence recovers 15–25% of churning trials. This is what Customer.io charges $150/mo for.

**Node chain:**

```
webhook (signup)
  → email ("Welcome, {{name}}! Here's how to get started")
  → wait (2 days)
  → email ("Pro tip: you haven't tried {{feature}} yet")
  → wait (5 days)
  → email ("Your trial ends in 48 hours — here's what you'd lose")
```

**Why it's worth showing:** The `wait` node is the key differentiator from a basic email blast. It demonstrates true async workflow execution with stateful pausing — something that's genuinely hard to build from scratch.

**Required credentials:** SMTP credential  
**Tags:** `crm`, `onboarding`, `email`, `wait`

---

## 3. Contact Form → CRM + Multi-Channel Notify

**Template ID:** `form-to-db-notify` · **Category:** Data  
**Real-life use case:** A consultancy's website has a contact form. Every submission needs to be persisted to their leads DB, instantly visible to sales on Telegram (mobile), and logged to a Discord ops channel. Currently someone manually copies leads into a spreadsheet.

**Node chain:**

```
webhook (form POST)
  → database (INSERT INTO leads — name, email, message, created_at)
  → telegram (sales team: "📬 New lead: {{name}} — {{email}}")
  → discord (#ops: "Submission from **{{name}}**")
```

**Why it's worth showing:** Three distinct outputs from one trigger. DB write = permanent state, Telegram = real-time mobile push, Discord = audit trail. This is the most common SMB automation pattern.

**Required credentials:** PostgreSQL credential, Telegram bot token, Discord webhook URL  
**Tags:** `database`, `telegram`, `discord`, `webhook`, `leads`

---

## 4. E-Commerce Order → Inventory → Fulfillment

**Template ID:** `daily-report` (replace with `form-to-db-notify` pattern, extended)  
**Real-life use case:** A Shopify store using a custom checkout. When an order arrives, check inventory in real time, confirm or flag it, then route to fulfilment or back-order handling — no human in the loop.

**Node chain:**

```
webhook (new order)
  → database (SELECT qty FROM stock WHERE product_id = {{productId}})
  → if (stock.quantity >= order.quantity)
      ├─ [in stock]
      │    → database (UPDATE stock — decrement qty)
      │    → email (customer: "Your order is confirmed!")
      │    → slack (#ops: "📦 Order #{{id}} — ready to fulfil")
      └─ [out of stock]
           → database (INSERT INTO backorders)
           → email (customer: "Back-ordered — ships in 5 days")
           → telegram (ops team: "⚠️ Stock depleted: {{productId}}")
```

**Why this is the strongest demo:** Two DB operations, two conditional branches, three notification channels. Shows the platform replacing chunks of backend business logic without writing code.

**Required credentials:** PostgreSQL credential, SMTP credential, Slack credential, Telegram bot token  
**Tags:** `ecommerce`, `database`, `if`, `email`, `slack`, `telegram`

---

## 5. Stripe Payment → Invoice DB + Tiered Alert

**Template ID:** `stripe-payment-notifier` · **Category:** Payments  
**Real-life use case:** A freelance agency or SaaS. Every Stripe payment needs to be logged to their billing DB, the revenue channel notified, and the finance lead emailed — without anyone manually entering data. VIP payments ($1000+) get a separate high-priority alert.

**Node chain:**

```
webhook (Stripe payment_intent.succeeded)
  → transform (extract: amount ÷ 100, currency, customer, invoice_id)
  → if (amount >= 1000)
      ├─ [high value] slack (#revenue: "💰 VIP payment: ${{amount}} from {{customer}}")
      └─ [standard]   slack (#payments: "${{amount}} received")
  → database (INSERT INTO invoices — amount, currency, customer, stripe_id, paid_at)
  → email (finance@: payment confirmation with totals)
```

**Why it's realistic:** Normalise raw Stripe event → branch by business tier → DB write → dual notifications. Replaces a Stripe + Baremetrics + Slack integration stack.

**Required credentials:** Slack credential, PostgreSQL credential, SMTP credential  
**Tags:** `stripe`, `payments`, `slack`, `email`, `database`

---

## 6. AI Customer Support Triage

**Template ID:** `content-review-pipeline` (same pattern, different domain)  
**Real-life use case:** A SaaS product gets 200+ support tickets/day. The team can't manually triage them. This workflow classifies urgency and category via AI and routes critical issues to the on-call engineer instantly — before a human reads the ticket.

**Node chain:**

```
webhook (new support ticket from Intercom/Zendesk)
  → openai (classify: {urgency: "critical|high|low", category: "billing|bug|feature|question"})
  → if (urgency === "critical")
      ├─ [critical]
      │    → slack (#incidents: "🚨 CRITICAL: {{title}}")
      │    → telegram (on-call engineer: "Respond within 15 min")
      │    → database (INSERT with priority=critical, assigned=on-call)
      └─ [non-critical]
           → database (INSERT with AI-classified priority + category)
           → email (customer: "Ticket #{{id}} received — reply within 24h")
```

**Why this is impressive:** AI classification feeding conditional multi-channel routing + DB persistence. This pattern replaces a Zendesk + PagerDuty + AI triage service combination.

**Required credentials:** OpenAI API key, Slack credential, Telegram bot token, PostgreSQL credential, SMTP credential  
**Tags:** `ai`, `support`, `openai`, `slack`, `telegram`, `database`

---

## 7. Weekly Error Digest from Database

**Template ID:** `scheduled-db-digest` · **Category:** Scheduled  
**Real-life use case:** An engineering team wants a Monday morning Slack or email summarising every error from the past week — without building a custom internal dashboard. The digest filters noise, sorts by recency, and counts severity.

**Node chain:**

```
schedule (0 9 * * 1 — Monday 9 AM)
  → database (SELECT * FROM events WHERE type='error' AND created_at >= NOW()-7d)
  → filter (item.type === 'error')
  → sort (created_at DESC)
  → set (errorCount: results.length, subject: "Weekly Digest — {{count}} errors")
  → email (engineering@: formatted summary)
```

**Why it's a good demo:** Shows the full data manipulation chain: DB read → filter → sort → shape → output. Replaces scheduled cron scripts that query a DB and send formatted reports.

**Required credentials:** PostgreSQL credential, SMTP credential  
**Tags:** `schedule`, `database`, `filter`, `sort`, `email`, `digest`

---

## 8. CI/CD Deploy Pipeline via API Key

**Template ID:** `api-key-deploy-hook` · **Category:** DevOps  
**Real-life use case:** A team wants non-engineers (PMs, QA, clients) to trigger a staging deployment without repo access — just a secure URL from a Slack button or an internal tool. On success, Slack confirms. On failure, it auto-rolls back and alerts the dev lead on Telegram.

**Node chain:**

```
POST /api/run/fg_YOUR_API_KEY
  → http-request (POST /deploy — triggers build pipeline)
  → http-request (GET /health — smoke test the new build)
  → if (smoke test status === 200)
      ├─ [success] slack (#deployments: "✅ Staging deployed")
      └─ [failure]
           → http-request (POST /rollback)
           → telegram (dev lead: "❌ Deploy failed — rolled back")
           → slack (#deployments: "⚠️ Rollback complete — manual review needed")
```

**Trigger example:**

```bash
curl -X POST "https://your-domain.com/api/run/fg_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"environment": "staging", "ref": "main"}'
```

**Why this is the best closer demo:** Uses the API Key trigger built into Flowgent, chains three HTTP calls, auto-rolls back on failure, notifies two channels. Replaces a full GitOps deployment script.

**Required credentials:** Slack credential, Telegram bot token  
**Tags:** `devops`, `deployment`, `cicd`, `slack`, `telegram`, `api-key`, `rollback`

---

## Complexity Assessment

| #   | Workflow                        | Nodes | Branches | Integrations                                | Rating |
| --- | ------------------------------- | ----- | -------- | ------------------------------------------- | ------ |
| 1   | API Uptime Monitor              | 5     | 1        | schedule, http, slack, email                | ★★★☆☆  |
| 2   | Trial Drip Sequence             | 6     | 0        | webhook, email ×3, wait ×2                  | ★★☆☆☆  |
| 3   | Form → CRM + Notify             | 4     | 0        | webhook, db, telegram, discord              | ★★☆☆☆  |
| 4   | Order → Inventory → Fulfil      | 8     | 2        | webhook, db ×2, email, slack, telegram      | ★★★★★  |
| 5   | Stripe → Invoice + Tiered Alert | 6     | 1        | webhook, transform, slack, db, email        | ★★★★☆  |
| 6   | AI Support Triage               | 7     | 1        | webhook, openai, slack, telegram, db, email | ★★★★★  |
| 7   | Weekly Error Digest             | 6     | 0        | schedule, db, filter, sort, set, email      | ★★★☆☆  |
| 8   | CI/CD Deploy Hook               | 8     | 1        | api-key, http ×3, slack, telegram           | ★★★★★  |

**Best demos to lead with:** #4 (order fulfillment), #6 (AI triage), #8 (deploy hook) — these show the most business logic density per workflow and are closest to what real teams would build on day one.

---

## What These Workflows Replace

| Workflow            | Replaces                                     | Typical cost     |
| ------------------- | -------------------------------------------- | ---------------- |
| API Uptime Monitor  | PagerDuty / Statuspage basic plan            | $23–$299/mo      |
| Trial Drip Sequence | Customer.io / Intercom drip                  | $100–$500/mo     |
| Form → CRM + Notify | Zapier form → CRM zap + Notify               | $20–$50/mo       |
| Order → Inventory   | Custom order management backend code         | Engineering time |
| Stripe → Invoice    | Stripe + Baremetrics + Slack wiring          | $50–$200/mo      |
| AI Support Triage   | Zendesk + PagerDuty + AI classify service    | $200–$1000/mo    |
| Weekly Error Digest | Custom cron + DB query + email scripts       | Engineering time |
| CI/CD Deploy Hook   | GitHub Actions + Slack bot + rollback script | Engineering time |
