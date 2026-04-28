"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  type Connection,
  type Node,
  type Edge,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { TriggerNode } from "@/features/editor/nodes/TriggerNode";
import { ActionNode } from "@/features/editor/nodes/ActionNode";
import { NodePalette } from "./NodePalette";
import { NodeConfigPanel } from "./NodeConfigPanel";
import { ExecutionSettings } from "./ExecutionSettings";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Play,
  Redo2,
  Save,
  Settings,
  Undo2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useTRPC, useVanillaClient } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { BallLoader } from "@/components/ui/ball-loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface WorkflowEditorProps {
  workflowId: string;
}

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

// History for undo/redo
interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

function WorkflowEditorInner({ workflowId }: WorkflowEditorProps) {
  const trpc = useTRPC();
  const client = useVanillaClient();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, getViewport } = useReactFlow();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showExecutionSettings, setShowExecutionSettings] = useState(false);
  const [testInputOpen, setTestInputOpen] = useState(false);
  const [testInputJson, setTestInputJson] = useState(
    '{\n  "email": "user@example.com",\n  "name": "Test User"\n}',
  );
  const [testInputError, setTestInputError] = useState<string | null>(null);

  // Undo/Redo history
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedo = useRef(false);

  const {
    data: workflow,
    isLoading,
    refetch,
  } = useQuery(trpc.workflows.get.queryOptions({ id: workflowId }));

  const updateWorkflow = useMutation({
    mutationFn: (data: {
      id: string;
      nodes?: unknown;
      edges?: unknown;
      name?: string;
      description?: string;
      viewport?: unknown;
    }) => client.workflows.update.mutate(data),
    onSuccess: () => {
      refetch();
      toast.success("Workflow saved");
      setIsSaving(false);
    },
    onError: () => {
      toast.error("Failed to save workflow");
      setIsSaving(false);
    },
  });

  const executeWorkflow = useMutation({
    mutationFn: (data: { id: string; inputData?: Record<string, unknown> }) =>
      client.workflows.execute.mutate(data),
    onSuccess: (data) => {
      toast.success("Execution Started", {
        description: "Redirecting to execution logs...",
        duration: 5000,
        action: {
          label: "VIEW LOGS",
          onClick: () =>
            window.open(`/executions/${data.executionId}`, "_blank"),
        },
      });
    },
    onError: (error: Error) => {
      toast.error("Execution Failed", {
        description: error.message,
        duration: 5000,
      });
    },
  });

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Load workflow data
  useEffect(() => {
    if (workflow) {
      // @ts-ignore - Suppress deep recursion error from React Flow types
      const loadedNodes = (Array.isArray(workflow.nodes)
        ? workflow.nodes
        : []) as unknown as Node[];
      const loadedEdges = (Array.isArray(workflow.edges)
        ? workflow.edges
        : []) as unknown as Edge[];
      setNodes(loadedNodes);
      setEdges(loadedEdges);
      // Initialize history
      setHistory([{ nodes: loadedNodes, edges: loadedEdges }]);
      setHistoryIndex(0);
    }
    // @ts-ignore - Suppress deep recursion error from React Flow types
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setNodes/setEdges are stable
  }, [workflow]);

  // Push to history on changes (debounced)
  useEffect(() => {
    if (isUndoRedo.current) {
      isUndoRedo.current = false;
      return;
    }
    const timer = setTimeout(() => {
      if (nodes.length > 0 || edges.length > 0) {
        setHistory((prev) => {
          const newHistory = prev.slice(0, historyIndex + 1);
          return [...newHistory, { nodes: [...nodes], edges: [...edges] }];
        });
        setHistoryIndex((prev) => prev + 1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [nodes, edges]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = useCallback(() => {
    if (!canUndo) return;
    isUndoRedo.current = true;
    const prevState = history[historyIndex - 1];
    setNodes(prevState.nodes);
    setEdges(prevState.edges);
    setHistoryIndex(historyIndex - 1);
  }, [canUndo, history, historyIndex, setNodes, setEdges]);

  const handleRedo = useCallback(() => {
    if (!canRedo) return;
    isUndoRedo.current = true;
    const nextState = history[historyIndex + 1];
    setNodes(nextState.nodes);
    setEdges(nextState.edges);
    setHistoryIndex(historyIndex + 1);
  }, [canRedo, history, historyIndex, setNodes, setEdges]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Cmd/Ctrl + Z
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Redo: Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y
      if (
        (e.metaKey || e.ctrlKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        handleRedo();
      }
      // Save: Cmd/Ctrl + S
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      // Delete selected node: Backspace or Delete (skip if focus is in a text field)
      if ((e.key === "Backspace" || e.key === "Delete") && selectedNode) {
        const tag = (document.activeElement as HTMLElement)?.tagName;
        const isEditable = (document.activeElement as HTMLElement)?.isContentEditable;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || isEditable) return;
        setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
        setEdges((eds) =>
          eds.filter(
            (e) => e.source !== selectedNode.id && e.target !== selectedNode.id,
          ),
        );
        setSelectedNode(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo, selectedNode, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleAddNode = useCallback(
    (
      type: string,
      nodeType: "trigger" | "action",
      position?: { x: number; y: number },
    ) => {
      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: nodeType,
        position: position || { x: 250, y: nodes.length * 120 + 50 },
        data: {
          type,
          label:
            type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, " "),
          config: {},
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [nodes, setNodes],
  );

  // Handle drop from palette
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) return;

      const { nodeType, category } = JSON.parse(data);

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      handleAddNode(nodeType, category, position);
    },
    [screenToFlowPosition, handleAddNode],
  );

  const handleSave = () => {
    setIsSaving(true);
    updateWorkflow.mutate({
      id: workflowId,
      nodes,
      edges,
      viewport: getViewport(),
    });
  };

  const handleExecute = () => {
    // Check if the workflow has a webhook trigger — if so, prompt for test body data
    const hasWebhookTrigger = nodes.some(
      (n) =>
        n.type === "trigger" &&
        (n.data as { type?: string }).type === "webhook",
    );
    if (hasWebhookTrigger) {
      setTestInputOpen(true);
    } else {
      executeWorkflow.mutate({ id: workflowId });
    }
  };

  const handleTestInputSubmit = () => {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(testInputJson);
    } catch {
      setTestInputError("Invalid JSON — please fix before running.");
      return;
    }
    setTestInputError(null);
    setTestInputOpen(false);
    executeWorkflow.mutate({ id: workflowId, inputData: parsed });
  };

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleNodeUpdate = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((node) => (node.id === nodeId ? { ...node, data } : node)),
      );
    },
    [setNodes],
  );

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <BallLoader />
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Workflow not found</p>
          <Button asChild>
            <Link href="/workflows">Go to Workflows</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex">
      {/* Node Palette */}
      <NodePalette
        onAddNode={(type, nodeType) => handleAddNode(type, nodeType)}
      />

      {/* Canvas */}
      <div className="flex-1 h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
          defaultEdgeOptions={{
            style: { strokeWidth: 2, stroke: "var(--arch-accent)" },
            type: "smoothstep",
            animated: true,
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="var(--arch-muted)"
            className="opacity-20"
          />
          <Controls className="bg-(--arch-bg)! border-(--arch-border)! shadow-none! rounded-none! [&>button]:border-(--arch-border)! [&>button]:bg-(--arch-bg)! [&>button]:text-(--arch-fg)! [&>button:hover]:bg-(--arch-fg)! [&>button:hover]:text-(--arch-bg)!" />
          <MiniMap
            className="bg-(--arch-bg-secondary)! border-(--arch-border)! border-2! shadow-lg! rounded-none!"
            nodeColor={(n) => {
              return "var(--arch-fg)";
            }}
            maskColor="rgba(var(--arch-bg-rgb), 0.5)"
            style={{ backgroundColor: "var(--arch-bg-secondary)" }}
          />

          {/* Top Panel */}
          <Panel position="top-left" className="flex items-center gap-4 m-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) hover:bg-(--arch-fg) hover:text-(--arch-bg) rounded-none font-mono uppercase text-xs"
              asChild
            >
              <Link href="/workflows" className="gap-2">
                <ArrowLeft className="h-3 w-3" />
                Back
              </Link>
            </Button>
            <div className="bg-(--arch-bg) border border-(--arch-border) px-4 py-2 flex items-center gap-2 shadow-none">
              <span className="font-mono uppercase text-(--arch-fg) text-sm">
                {workflow.name}
              </span>
              {isSaving && (
                <span className="flex items-center gap-1.5 text-xs text-(--arch-fg) bg-[rgba(var(--arch-fg-rgb)/0.1)] px-2 py-0.5 rounded-none font-mono uppercase">
                  <div className="h-1.5 w-1.5 bg-(--arch-fg) animate-pulse" />
                  Saving...
                </span>
              )}
            </div>
          </Panel>

          {/* Top Right Panel */}
          <Panel position="top-right" className="flex items-center gap-3 m-4">
            <div className="bg-(--arch-bg) border border-(--arch-border) p-1 flex items-center gap-1 shadow-none">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleUndo}
                disabled={!canUndo}
                title="Undo (⌘Z)"
                className="h-8 w-8 hover:bg-(--arch-fg) hover:text-(--arch-bg) text-(--arch-fg) transition-colors rounded-none"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <div className="w-px h-4 bg-(--arch-border)" />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRedo}
                disabled={!canRedo}
                title="Redo (⌘⇧Z)"
                className="h-8 w-8 hover:bg-(--arch-fg) hover:text-(--arch-bg) text-(--arch-fg) transition-colors rounded-none"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="bg-(--arch-bg) border border-(--arch-border) p-1 flex items-center gap-2 shadow-none">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowExecutionSettings((v) => !v);
                  setSelectedNode(null);
                }}
                className="hover:bg-(--arch-fg) hover:text-(--arch-bg) text-(--arch-fg) h-8 rounded-none font-mono uppercase text-xs"
                title="Execution Settings"
              >
                <Settings className="h-3.5 w-3.5 mr-2" />
                Settings
              </Button>
              <div className="w-px h-4 bg-(--arch-border)" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="hover:bg-(--arch-fg) hover:text-(--arch-bg) text-(--arch-fg) h-8 rounded-none font-mono uppercase text-xs"
              >
                <Save className="h-3.5 w-3.5 mr-2" />
                Save
              </Button>
              <Button
                size="sm"
                onClick={handleExecute}
                disabled={executeWorkflow.isPending}
                className="bg-(--arch-fg) text-(--arch-bg) hover:bg-[rgba(var(--arch-fg-rgb)/0.9)] border-0 h-8 rounded-none font-mono uppercase text-xs disabled:opacity-70 transition-all min-w-[100px]"
              >
                {executeWorkflow.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                    Running
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 mr-2 fill-current" />
                    Execute
                  </>
                )}
              </Button>
            </div>
          </Panel>

          {/* Keyboard Shortcuts Hint */}
          <Panel position="bottom-left" className="m-4">
            <div className="bg-[rgba(var(--arch-bg-rgb)/0.8)] backdrop-blur-sm px-3 py-1.5 text-xs font-mono text-(--arch-muted) border border-(--arch-border) uppercase">
              Ctrl+S Save • Ctrl+Z Undo • Ctrl+Shift+Z Redo • Del Delete
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Node Config Panel */}
      {selectedNode && nodes.find((n) => n.id === selectedNode.id) && (
        <NodeConfigPanel
          node={nodes.find((n) => n.id === selectedNode.id)!}
          onClose={() => setSelectedNode(null)}
          onUpdate={handleNodeUpdate}
          workflowId={workflowId}
        />
      )}

      {/* Execution Settings Panel */}
      {showExecutionSettings && !selectedNode && (
        <ExecutionSettings
          workflowId={workflowId}
          initialTimeoutMs={
            (workflow as { timeoutMs?: number | null }).timeoutMs ?? null
          }
          initialMaxConcurrency={
            (workflow as { maxConcurrency?: number }).maxConcurrency ?? 0
          }
          onClose={() => setShowExecutionSettings(false)}
        />
      )}

      {/* Test Input Dialog — shown when executing a webhook-triggered workflow manually */}
      <Dialog open={testInputOpen} onOpenChange={setTestInputOpen}>
        <DialogContent className="sm:max-w-md font-mono">
          <DialogHeader>
            <DialogTitle className="font-mono uppercase text-sm tracking-wider">
              Test Input Data
            </DialogTitle>
            <DialogDescription className="text-xs font-mono">
              This workflow uses a webhook trigger. Provide a sample JSON body
              to populate{" "}
              <code className="bg-muted px-1">{"{{trigger.body.*}}"}</code>{" "}
              variables during this test run.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label className="text-xs font-mono uppercase">
              Webhook body (JSON)
            </Label>
            <Textarea
              className="font-mono text-xs h-40 resize-none"
              value={testInputJson}
              onChange={(e) => {
                setTestInputJson(e.target.value);
                setTestInputError(null);
              }}
              spellCheck={false}
            />
            {testInputError && (
              <p className="text-destructive text-xs font-mono">
                {testInputError}
              </p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="font-mono uppercase text-xs rounded-none"
              onClick={() => setTestInputOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="font-mono uppercase text-xs rounded-none"
              onClick={handleTestInputSubmit}
              disabled={executeWorkflow.isPending}
            >
              <Play className="h-3.5 w-3.5 mr-2 fill-current" />
              Run
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function WorkflowEditor({ workflowId }: WorkflowEditorProps) {
  return (
    <ReactFlowProvider>
      <WorkflowEditorInner workflowId={workflowId} />
    </ReactFlowProvider>
  );
}
