import * as Sentry from "@sentry/nextjs";

function validateEnvVars() {
  const required = ["DATABASE_URL", "BETTER_AUTH_SECRET"];

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. Check your .env file.`,
    );
  }
}

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    validateEnvVars();
    await import("../sentry.server.config");

    // Start the IMAP background poller only on self-hosted Node.js
    // (skipped on Vercel/Netlify serverless where each request is stateless).
    const isServerless =
      process.env.VERCEL ?? process.env.NETLIFY ?? process.env.LAMBDA_TASK_ROOT;
    if (!isServerless) {
      console.log("[imap-auto] starting in-process IMAP poller (60s interval)");

      // Define runImapPoller INSIDE this nodejs-only block so the Edge Runtime
      // build dead-code-eliminates it (and the db/functions dynamic imports).
      const runImapPoller = async () => {
        try {
          const { pollImapWorkflowOnce } = await import("@/inngest/functions");
          const prisma = (await import("@/lib/db")).default;

          const all = await prisma.workflow.findMany({
            where: { isActive: true },
            select: { id: true, nodes: true },
          });

          const imapWorkflows = all.filter((wf) => {
            const nodes = wf.nodes as unknown as Array<{
              type: string;
              data: { type: string };
            }>;
            return (
              Array.isArray(nodes) &&
              nodes.some(
                (n) => n.type === "trigger" && n.data?.type === "email-inbox",
              )
            );
          });

          for (const wf of imapWorkflows) {
            const result = await pollImapWorkflowOnce(wf.id);
            if (result.error) {
              console.warn(`[imap-auto] workflow ${wf.id}: ${result.error}`);
            } else if (result.emailsFound > 0) {
              console.log(
                `[imap-auto] workflow ${wf.id}: found ${result.emailsFound} email(s), created ${result.executionsCreated} execution(s)`,
              );
            }
          }
        } catch (err) {
          console.error("[imap-auto] poller error:", err);
        }
      };

      // First poll after a short delay so the DB connection is ready
      setTimeout(() => {
        runImapPoller();
        setInterval(runImapPoller, 60_000);
      }, 5_000);
    }
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
