import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { executeWorkflow, scheduledWorkflow, imapPoller } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [executeWorkflow, scheduledWorkflow, imapPoller],
  serveHost:
    process.env.INNGEST_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined),
});
