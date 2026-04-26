import { createTRPCRouter } from "../init";
import { workflowsRouter } from "./workflows";
import { credentialsRouter } from "./credentials";
import { executionsRouter } from "./executions";
import { schedulesRouter } from "./schedules";
import { webhooksRouter } from "./webhooks";
import { teamsRouter } from "./teams";
import { auditRouter } from "./audit";
import { apiKeysRouter } from "./apiKeys";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credentials: credentialsRouter,
  executions: executionsRouter,
  schedules: schedulesRouter,
  webhooks: webhooksRouter,
  teams: teamsRouter,
  audit: auditRouter,
  apiKeys: apiKeysRouter,
});

export type AppRouter = typeof appRouter;
