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
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Redo2, Save, Undo2 } from "lucide-react";
import Link from "next/link";
import { useTRPC, useVanillaClient } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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
  const { screenToFlowPosition } = useReactFlow();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Undo/Redo history
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedo = useRef(false);

  const { data: workflow, isLoading, refetch } = useQuery(
    trpc.workflows.get.queryOptions({ id: workflowId })
  );

  const updateWorkflow = useMutation({
    mutationFn: (data: { id: string; nodes?: unknown; edges?: unknown; name?: string; description?: string }) =>
      client.workflows.update.mutate(data),
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
      toast.success("Workflow execution started", {
        description: `Execution ID: ${data.executionId}`,
        action: {
          label: "View",
          onClick: () => window.open(`/executions/${data.executionId}`, "_blank"),
        },
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to start execution", { description: error.message });
    },
  });

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Load workflow data
  useEffect(() => {
    if (workflow) {
      // @ts-ignore - Suppress deep recursion error from React Flow types
      const loadedNodes = (Array.isArray(workflow.nodes) ? workflow.nodes : []) as unknown as Node[];
      const loadedEdges = (Array.isArray(workflow.edges) ? workflow.edges : []) as unknown as Edge[];
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
      if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
      // Save: Cmd/Ctrl + S
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      // Delete selected node: Backspace or Delete
      if ((e.key === "Backspace" || e.key === "Delete") && selectedNode) {
        setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
        setSelectedNode(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo, selectedNode, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleAddNode = useCallback(
    (type: string, nodeType: "trigger" | "action", position?: { x: number; y: number }) => {
      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: nodeType,
        position: position || { x: 250, y: nodes.length * 120 + 50 },
        data: {
          type,
          label: type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, " "),
          config: {},
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [nodes, setNodes]
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
    [screenToFlowPosition, handleAddNode]
  );

  const handleSave = () => {
    setIsSaving(true);
    updateWorkflow.mutate({
      id: workflowId,
      nodes,
      edges,
    });
  };

  const handleExecute = () => {
    executeWorkflow.mutate({ id: workflowId });
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
        nds.map((node) => (node.id === nodeId ? { ...node, data } : node))
      );
    },
    [setNodes]
  );

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading workflow...
        </div>
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
      <NodePalette onAddNode={(type, nodeType) => handleAddNode(type, nodeType)} />

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
            style: { strokeWidth: 2, stroke: "var(--border)" },
            type: "smoothstep",
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="var(--border)"
          />
          <Controls className="!bg-card/50 !backdrop-blur-md !border-border/50 !shadow-lg border rounded-xl overflow-hidden" />
          <MiniMap
            className="!bg-card/50 !backdrop-blur-md !border-border/50 !shadow-lg border rounded-xl"
            nodeColor="var(--primary)"
            maskColor="transparent"
            style={{ opacity: 0.8 }}
          />

          {/* Top Panel */}
          <Panel position="top-left" className="flex items-center gap-4 m-4">
            <Button
              variant="ghost"
              size="sm"
              className="glass-subtle hover:bg-background/80 shadow-sm transition-all hover:scale-105"
              asChild
            >
              <Link href="/workflows" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
              <span className="font-semibold text-foreground/90">{workflow.name}</span>
              {isSaving && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Saving...
                </span>
              )}
            </div>
          </Panel>

          {/* Top Right Panel */}
          <Panel position="top-right" className="flex items-center gap-3 m-4">
            <div className="glass p-1 rounded-xl flex items-center gap-1 shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleUndo}
                disabled={!canUndo}
                title="Undo (⌘Z)"
                className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors rounded-lg"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <div className="w-px h-4 bg-border/50" />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRedo}
                disabled={!canRedo}
                title="Redo (⌘⇧Z)"
                className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors rounded-lg"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="glass p-1.5 rounded-xl flex items-center gap-2 shadow-sm">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="border-primary/20 hover:bg-primary/5 hover:border-primary/40 h-8"
              >
                <Save className="h-3.5 w-3.5 mr-2 text-primary" />
                Save
              </Button>
              <Button
                size="sm"
                onClick={handleExecute}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 border-0 shadow-lg shadow-primary/20 h-8"
              >
                <Play className="h-3.5 w-3.5 mr-2 fill-current" />
                Execute
              </Button>
            </div>
          </Panel>

          {/* Keyboard Shortcuts Hint */}
          <Panel position="bottom-left" className="m-4">
            <div className="glass-subtle px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground/70 border border-border/30">
              ⌘S Save • ⌘Z Undo • ⌘⇧Z Redo • ⌫ Delete
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Node Config Panel */}
      {selectedNode && (
        <NodeConfigPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdate={handleNodeUpdate}
        />
      )}
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
