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
import { ArrowLeft, Play, Redo2, Save, Undo2, Loader2, Workflow } from "lucide-react";
import Link from "next/link";
import { useTRPC, useVanillaClient } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface WorkflowEditorProps {
  workflowId: string;
}

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

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
    }) => client.workflows.update.mutate(data),
    onSuccess: () => {
      refetch();
      toast.success("Workflow Saved Successfully", {
        className: "bg-black border-white/10 text-white font-mono uppercase tracking-wider text-xs",
      });
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
      toast.success("Execution Sequence Initiated", {
        description: "Routing to execution logs...",
        duration: 5000,
        className: "bg-black border-emerald-500/20 text-emerald-400 font-mono tracking-wide text-xs",
        action: {
          label: "MONITOR",
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

  useEffect(() => {
    if (workflow) {
      // Cast payload as any to prevent TS infinite recursion on deep JSON types
      const payload: any = workflow;
      const loadedNodes = (Array.isArray(payload.nodes)
        ? payload.nodes
        : []) as Node[];
      const loadedEdges = (Array.isArray(payload.edges)
        ? payload.edges
        : []) as Edge[];
      setNodes(loadedNodes);
      setEdges(loadedEdges);
      setHistory([{ nodes: loadedNodes, edges: loadedEdges }]);
      setHistoryIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if (
        (e.metaKey || e.ctrlKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        handleRedo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
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
        nds.map((node) => (node.id === nodeId ? { ...node, data } : node)),
      );
    },
    [setNodes],
  );

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[var(--background)]">
        <motion.div 
          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-16 h-16 rounded-3xl bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)] flex items-center justify-center"
        >
          <Workflow className="h-6 w-6 text-(--arch-accent)" />
        </motion.div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <p className="text-(--arch-muted) font-mono uppercase tracking-widest mb-6 text-sm">Target Flow Not Found</p>
          <Link 
            href="/workflows"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-(--arch-fg) text-[var(--background)] hover:bg-white transition-all font-mono text-xs uppercase tracking-wider py-3 px-8 border border-transparent shadow-[0_0_20px_rgba(var(--arch-accent-rgb)/0.2)] hover:shadow-[0_0_30px_rgba(var(--arch-accent-rgb)/0.4)]"
          >
            RETURN_TO_HUB
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full flex bg-[var(--background)] overflow-hidden">
      {/* Node Palette Desktop Stack */}
      <div className="z-10 shadow-[20px_0_40px_rgba(0,0,0,0.5)]">
        <NodePalette onAddNode={(type, nodeType) => handleAddNode(type, nodeType)} />
      </div>

      {/* Primary Canvas */}
      <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
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
          
          <Controls className="bg-[rgba(255,255,255,0.02)]! backdrop-blur-xl! border-white/5! shadow-xl! rounded-xl! [&>button]:border-white/5! [&>button]:bg-transparent! [&>button]:text-(--arch-fg)! [&>button:hover]:bg-white/5! [&>button:hover]:text-white! overflow-hidden!" />
          
          <MiniMap
            className="bg-[rgba(255,255,255,0.02)]! backdrop-blur-xl! border-white/5! border! shadow-2xl! rounded-2xl! overflow-hidden!"
            nodeColor={() => "var(--arch-fg)"}
            maskColor="rgba(0,0,0, 0.7)"
            style={{ backgroundColor: "transparent" }}
          />

          {/* Top Panel - Glass Pipeline */}
          <Panel position="top-left" className="flex items-center gap-3 m-6">
            <Link 
              href="/workflows"
              className="flex items-center justify-center h-10 w-10 rounded-full glass-panel hover:bg-white/10 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 text-(--arch-fg) group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 20 }}
              className="glass-panel h-10 px-6 rounded-full flex items-center gap-3"
            >
              <Workflow className="h-4 w-4 text-(--arch-accent)" />
              <span className="font-mono uppercase tracking-wide text-(--arch-fg) text-sm bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                {workflow.name}
              </span>
              {isSaving && (
                <span className="flex items-center gap-2 ml-4 text-[10px] text-(--arch-accent) bg-[rgba(var(--arch-accent-rgb)/0.1)] px-2.5 py-1 rounded-full font-mono uppercase tracking-widest border border-[rgba(var(--arch-accent-rgb)/0.2)]">
                  <div className="h-1.5 w-1.5 rounded-full bg-(--arch-accent) animate-pulse shadow-[0_0_10px_var(--arch-accent)]" />
                  Saving Schema
                </span>
              )}
            </motion.div>
          </Panel>

          {/* Top Right Panel - Executive Controls */}
          <Panel position="top-right" className="flex items-center gap-3 m-6">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 20, delay: 0.1 }}
              className="glass-panel p-1 rounded-full flex items-center"
            >
              <button
                onClick={handleUndo}
                disabled={!canUndo}
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10 text-(--arch-fg) transition-colors disabled:opacity-30"
              >
                <Undo2 className="h-4 w-4" />
              </button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <button
                onClick={handleRedo}
                disabled={!canRedo}
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10 text-(--arch-fg) transition-colors disabled:opacity-30"
              >
                <Redo2 className="h-4 w-4" />
              </button>
            </motion.div>

            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 20, delay: 0.2 }}
              className="glass-panel p-1 rounded-full flex items-center gap-1"
            >
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 hover:bg-white/10 text-(--arch-fg) h-8 px-4 rounded-full font-mono uppercase tracking-wider text-[10px] transition-colors"
              >
                <Save className="h-3.5 w-3.5" />
                Commit
              </button>
              <button
                onClick={handleExecute}
                disabled={executeWorkflow.isPending}
                className="flex items-center justify-center bg-(--arch-fg) text-[var(--background)] hover:bg-white border text-[10px] uppercase font-bold tracking-widest font-mono h-8 px-5 rounded-full transition-all gap-2"
              >
                {executeWorkflow.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Seq_Run
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-[var(--background)]" />
                    Deploy
                  </>
                )}
              </button>
            </motion.div>
          </Panel>

          {/* Keyboard Shortcuts Hint */}
          <Panel position="bottom-center" className="m-6">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 0.5 }}
              whileHover={{ opacity: 1 }}
              className="glass-panel px-6 py-2 rounded-full text-[10px] font-mono tracking-widest text-white/50 flex gap-4 uppercase"
            >
              <span><b className="text-white">⌘S</b> Save</span>
              <span><b className="text-white">⌘Z</b> Undo</span>
              <span><b className="text-white">⌘⇧Z</b> Redo</span>
              <span><b className="text-white">⌫</b> Delete</span>
            </motion.div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Config Drawer - Framer Motion */}
      <AnimatePresence>
        {selectedNode && nodes.find((n) => n.id === selectedNode.id) && (
          <NodeConfigPanel
            node={nodes.find((n) => n.id === selectedNode.id)!}
            onClose={() => setSelectedNode(null)}
            onUpdate={handleNodeUpdate}
          />
        )}
      </AnimatePresence>
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
