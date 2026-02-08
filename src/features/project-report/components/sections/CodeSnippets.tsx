export default function CodeSnippets() {
  return (
    <div className="report-page page-break-after report-section relative">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-8 py-2 text-right border-b border-gray-300 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-500">Chapter 7: Implementation</span>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-lg font-bold uppercase tracking-wider text-gray-500">Chapter 7</h2>
        <h1 className="report-h1 mt-2">Implementation</h1>
      </div>

      <h2 className="report-h2">7.1 Code Snippets</h2>
      <p className="report-paragraph">
        This section presents important code snippets demonstrating key implementation
        aspects of the Flowgent platform.
      </p>

      <h3 className="report-h3 mt-6">7.1.1 Database Schema (Prisma)</h3>
      <div className="code-snippet avoid-break">
        {`model Workflow {
  id          String    @id @default(cuid())
  name        String
  description String?
  nodes       Json      @default("[]")
  edges       Json      @default("[]")
  viewport    Json?
  settings    Json?
  isActive    Boolean   @default(false)
  isFavorite  Boolean   @default(false)
  version     Int       @default(1)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  userId      String
  user        User      @relation(fields: [userId], 
                        references: [id], onDelete: Cascade)
  teamId      String?
  team        Team?     @relation(fields: [teamId], 
                        references: [id], onDelete: SetNull)
  executions  Execution[]
  schedules   Schedule[]
}`}
      </div>
      <p className="code-snippet-caption">Listing 7.1: Workflow Model Definition</p>

      <h3 className="report-h3 mt-6">7.1.2 tRPC Router (Workflow CRUD)</h3>
      <div className="code-snippet avoid-break">
        {`export const workflowRouter = router({
  list: protectedProcedure
    .input(z.object({
      teamId: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      const where = {
        OR: [
          { userId: ctx.user.id },
          { teamId: input.teamId },
        ],
        ...(input.search && {
          name: { contains: input.search, mode: 'insensitive' },
        }),
      };
      
      return prisma.workflow.findMany({
        where,
        take: input.limit,
        orderBy: { updatedAt: 'desc' },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      teamId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return prisma.workflow.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      });
    }),
});`}
      </div>
      <p className="code-snippet-caption">Listing 7.2: tRPC Workflow Router</p>

      <h3 className="report-h3 mt-6">7.1.3 Inngest Workflow Executor</h3>
      <div className="code-snippet avoid-break">
        {`export const executeWorkflow = inngest.createFunction(
  { id: "workflow-execute" },
  { event: "workflow/execute" },
  async ({ event, step }) => {
    const { workflowId, executionId } = event.data;
    
    // Update status to running
    await step.run("update-status", async () => {
      await prisma.execution.update({
        where: { id: executionId },
        data: { status: "RUNNING" },
      });
    });

    // Execute each node
    const nodeResults = {};
    for (const node of sortedNodes) {
      const result = await step.run(
        \`execute-\${node.id}\`,
        async () => executeNode(node, nodeResults)
      );
      nodeResults[node.id] = result;
    }

    // Mark as completed
    await step.run("complete", async () => {
      await prisma.execution.update({
        where: { id: executionId },
        data: { 
          status: "SUCCESS",
          finishedAt: new Date(),
          nodeResults,
        },
      });
    });
  }
);`}
      </div>
      <p className="code-snippet-caption">Listing 7.3: Inngest Workflow Execution Function</p>

      <h3 className="report-h3 mt-6">7.1.4 React Workflow Editor Component</h3>
      <div className="code-snippet avoid-break">
        {`export function WorkflowEditor({ workflowId }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
}`}
      </div>
      <p className="code-snippet-caption">Listing 7.4: React Flow Editor Component</p>
    </div>
  );
}
