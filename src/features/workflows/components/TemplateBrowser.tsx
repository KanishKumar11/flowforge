"use client";

import { useTRPC, useVanillaClient } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BookTemplate,
  Workflow,
  Zap,
  Database,
  MessageSquare,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const categoryIcons: Record<string, React.ReactNode> = {
  Notifications: <MessageSquare className="h-5 w-5" />,
  Scheduled: <Clock className="h-5 w-5" />,
  AI: <Zap className="h-5 w-5" />,
  Data: <Database className="h-5 w-5" />,
  Developer: <Workflow className="h-5 w-5" />,
};

export function TemplateBrowser() {
  const trpc = useTRPC();
  const client = useVanillaClient();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const { data, isLoading } = useQuery(trpc.workflows.templates.queryOptions());

  const createFromTemplate = useMutation({
    mutationFn: (data: { templateId: string; name: string }) =>
      client.workflows.createFromTemplate.mutate(data),
    onSuccess: (workflow) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      toast.success("Workflow created from template!");
      setIsOpen(false);
      router.push(`/workflows/${workflow.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading templates...</div>;
  }

  const templates = data?.templates || [];
  const categories = data?.categories || [];
  const filteredTemplates = selectedCategory
    ? templates.filter((t) => t.category === selectedCategory)
    : templates;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BookTemplate className="h-4 w-4" />
          Browse Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookTemplate className="h-5 w-5" />
            Workflow Templates
          </DialogTitle>
        </DialogHeader>

        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="gap-2"
            >
              {categoryIcons[cat] || <Workflow className="h-4 w-4" />}
              {cat}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-auto grid gap-4 sm:grid-cols-2 py-4">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:border-primary ${
                selectedTemplate === template.id
                  ? "border-primary ring-2 ring-primary/20"
                  : ""
              }`}
              onClick={() => {
                setSelectedTemplate(template.id);
                setWorkflowName(template.name);
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  {template.name}
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Button */}
        {selectedTemplate && (
          <div className="border-t pt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Workflow Name</label>
              <Input
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="My Workflow"
              />
            </div>
            <Button
              className="w-full"
              onClick={() =>
                createFromTemplate.mutate({
                  templateId: selectedTemplate,
                  name: workflowName,
                })
              }
              disabled={createFromTemplate.isPending}
            >
              {createFromTemplate.isPending
                ? "Creating..."
                : "Create from Template"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
