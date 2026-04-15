"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC, useVanillaClient } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workflowTemplates } from "@/lib/templates";
import { UpgradePlanDialog } from "@/components/UpgradePlanDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Search,
  Zap,
  Clock,
  Sparkles,
  Database,
  Code2,
  TrendingUp,
  Server,
  CreditCard,
  Users,
  Settings,
  Webhook,
  Play,
  ArrowRight,
  Layers,
} from "lucide-react";

// ─── Category metadata ────────────────────────────────────────────────────────
const CATEGORIES: {
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  { label: "All", icon: <Layers className="w-3.5 h-3.5" />, color: "" },
  { label: "Notifications", icon: <Zap className="w-3.5 h-3.5" />, color: "text-yellow-500" },
  { label: "Scheduled", icon: <Clock className="w-3.5 h-3.5" />, color: "text-blue-500" },
  { label: "AI", icon: <Sparkles className="w-3.5 h-3.5" />, color: "text-purple-500" },
  { label: "Data", icon: <Database className="w-3.5 h-3.5" />, color: "text-green-500" },
  { label: "Developer", icon: <Code2 className="w-3.5 h-3.5" />, color: "text-cyan-500" },
  { label: "Sales", icon: <TrendingUp className="w-3.5 h-3.5" />, color: "text-orange-500" },
  { label: "DevOps", icon: <Server className="w-3.5 h-3.5" />, color: "text-red-500" },
  { label: "Payments", icon: <CreditCard className="w-3.5 h-3.5" />, color: "text-emerald-500" },
  { label: "CRM", icon: <Users className="w-3.5 h-3.5" />, color: "text-pink-500" },
  { label: "Operations", icon: <Settings className="w-3.5 h-3.5" />, color: "text-slate-500" },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Notifications: <Zap className="w-5 h-5" />,
  Scheduled: <Clock className="w-5 h-5" />,
  AI: <Sparkles className="w-5 h-5" />,
  Data: <Database className="w-5 h-5" />,
  Developer: <Code2 className="w-5 h-5" />,
  Sales: <TrendingUp className="w-5 h-5" />,
  DevOps: <Server className="w-5 h-5" />,
  Payments: <CreditCard className="w-5 h-5" />,
  CRM: <Users className="w-5 h-5" />,
  Operations: <Settings className="w-5 h-5" />,
};

const TRIGGER_ICONS: Record<string, React.ReactNode> = {
  webhook: <Webhook className="w-3 h-3" />,
  schedule: <Clock className="w-3 h-3" />,
  manual: <Play className="w-3 h-3" />,
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface TemplateNode {
  id: string;
  type: string;
  data: { type: string; label: string };
}

function getTriggerType(nodes: object[]): string {
  const trigger = (nodes as TemplateNode[]).find((n) => n.type === "trigger");
  return trigger?.data?.type ?? "manual";
}

function getNodeCount(nodes: object[]): number {
  return (nodes as TemplateNode[]).filter((n) => n.type === "action").length;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function WorkflowTemplateLibrary() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const client = useVanillaClient();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTemplate, setSelectedTemplate] = useState<
    (typeof workflowTemplates)[0] | null
  >(null);
  const [workflowName, setWorkflowName] = useState("");
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  // Keep server-side data in sync with local templates
  const { data } = useQuery(trpc.workflows.templates.queryOptions());
  const templates = data?.templates ?? workflowTemplates;

  const createFromTemplate = useMutation({
    mutationFn: (args: { templateId: string; name: string }) =>
      client.workflows.createFromTemplate.mutate(args),
    onSuccess: (workflow) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      toast.success("Workflow created from template!");
      setSelectedTemplate(null);
      router.push(`/workflows/${workflow.id}`);
    },
    onError: (error: Error) => {
      if (
        error.message.includes("Plan limit reached") ||
        (error as { data?: { code?: string } }).data?.code === "FORBIDDEN"
      ) {
        setSelectedTemplate(null);
        setShowUpgradeDialog(true);
      } else {
        toast.error(error.message);
      }
    },
  });

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = templates.filter((t) => {
    const matchesCategory =
      activeCategory === "All" || t.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (t: (typeof workflowTemplates)[0]) => {
    setWorkflowName(t.name);
    setSelectedTemplate(t);
  };

  const handleConfirm = () => {
    if (!selectedTemplate) return;
    createFromTemplate.mutate({
      templateId: selectedTemplate.id,
      name: workflowName || selectedTemplate.name,
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ── Search + filter bar ─────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--arch-muted)" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates by name, tag, or category…"
            className="pl-9 h-11 bg-(--arch-bg-secondary) border-(--arch-border) font-mono text-sm"
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const count =
              cat.label === "All"
                ? templates.length
                : templates.filter((t) => t.category === cat.label).length;
            if (count === 0) return null;
            const isActive = activeCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-none border transition-all ${
                  isActive
                    ? "border-(--arch-fg) bg-(--arch-fg) text-(--arch-bg)"
                    : "border-(--arch-border) bg-(--arch-bg-secondary) text-(--arch-muted) hover:border-(--arch-fg) hover:text-(--arch-fg)"
                }`}
              >
                <span className={isActive ? "" : cat.color}>{cat.icon}</span>
                {cat.label}
                <span
                  className={`ml-0.5 text-[10px] tabular-nums ${isActive ? "opacity-70" : "opacity-50"}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Results count ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono text-(--arch-muted) uppercase tracking-widest">
          {filtered.length} template{filtered.length !== 1 ? "s" : ""}
          {search && ` for "${search}"`}
          {activeCategory !== "All" && ` in ${activeCategory}`}
        </p>
      </div>

      {/* ── Template grid ────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Search className="w-10 h-10 text-(--arch-muted) mb-4 opacity-30" />
          <p className="font-mono text-sm text-(--arch-muted)">
            No templates match your search.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setActiveCategory("All");
            }}
            className="mt-3 text-xs font-mono text-(--arch-fg) underline underline-offset-2"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((template) => {
            const triggerType = getTriggerType(template.nodes);
            const actionCount = getNodeCount(template.nodes);
            const categoryIcon =
              CATEGORY_ICONS[template.category] ?? <Zap className="w-5 h-5" />;

            return (
              <div
                key={template.id}
                className="group flex flex-col border border-(--arch-border) bg-(--arch-bg-secondary) hover:border-(--arch-fg) transition-all duration-200 overflow-hidden"
              >
                {/* Card header */}
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="p-2 border border-(--arch-border) bg-(--arch-bg) text-(--arch-fg) group-hover:border-(--arch-fg) transition-colors shrink-0">
                      {categoryIcon}
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-mono border-(--arch-border) text-(--arch-muted) shrink-0"
                    >
                      {template.category}
                    </Badge>
                  </div>

                  <h3 className="font-bold font-mono text-sm text-(--arch-fg) uppercase tracking-tight mb-1.5">
                    {template.name}
                  </h3>
                  <p className="text-xs text-(--arch-muted) font-mono leading-relaxed mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 text-[11px] font-mono text-(--arch-muted)">
                    <span className="flex items-center gap-1">
                      {TRIGGER_ICONS[triggerType] ?? (
                        <Play className="w-3 h-3" />
                      )}
                      {triggerType}
                    </span>
                    <span className="opacity-30">·</span>
                    <span>{actionCount} node{actionCount !== 1 ? "s" : ""}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="px-5 pb-3 flex flex-wrap gap-1.5">
                  {template.tags.slice(0, 4).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSearch(tag);
                        setActiveCategory("All");
                      }}
                      className="text-[10px] font-mono px-2 py-0.5 border border-(--arch-border) text-(--arch-muted) hover:border-(--arch-fg) hover:text-(--arch-fg) transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                {/* CTA */}
                <div className="border-t border-(--arch-border) p-4">
                  <Button
                    onClick={() => handleUseTemplate(template)}
                    className="w-full gap-2 h-9 text-xs font-mono rounded-none bg-(--arch-fg) text-(--arch-bg) hover:opacity-90 transition-opacity group-hover:gap-3"
                  >
                    Use Template
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Name dialog ──────────────────────────────────────────────── */}
      <Dialog
        open={!!selectedTemplate}
        onOpenChange={(open) => !open && setSelectedTemplate(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-mono text-base">
              Name your workflow
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-1.5">
            <p className="text-xs text-(--arch-muted) font-mono">
              Creating from{" "}
              <span className="text-(--arch-fg) font-semibold">
                {selectedTemplate?.name}
              </span>
            </p>
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="My Workflow"
              className="font-mono"
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSelectedTemplate(null)}
              className="font-mono text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={createFromTemplate.isPending || !workflowName.trim()}
              className="font-mono text-xs gap-2"
            >
              {createFromTemplate.isPending ? "Creating…" : "Create & Open"}
              {!createFromTemplate.isPending && (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Upgrade dialog ───────────────────────────────────────────── */}
      <UpgradePlanDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        limitType="workflows"
      />
    </div>
  );
}
