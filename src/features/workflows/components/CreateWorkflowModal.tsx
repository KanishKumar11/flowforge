"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface CreateWorkflowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
  isLoading?: boolean;
}

export function CreateWorkflowModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading: externalIsLoading,
}: CreateWorkflowModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit({ name: name.trim(), description: description.trim() });
      setName("");
      setDescription("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create workflow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-(--arch-bg) border-(--arch-border) rounded-none">
        <DialogHeader>
          <DialogTitle className="font-mono text-(--arch-fg) uppercase tracking-wide">
            Create New Workflow
          </DialogTitle>
          <DialogDescription className="font-mono text-xs text-(--arch-muted)">
            Start building your automation. You can add nodes and configure them
            in the workflow editor.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider"
              >
                Workflow Name
              </Label>
              <Input
                id="name"
                placeholder="My Awesome Workflow"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs h-9 focus-visible:ring-0"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider"
              >
                Description (optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what this workflow does..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs focus-visible:ring-0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-(--arch-border) hover:bg-(--arch-fg) hover:text-(--arch-bg) text-(--arch-fg) font-mono uppercase text-xs rounded-none h-9 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || isLoading || externalIsLoading}
              className="bg-(--arch-fg) text-(--arch-bg) hover:bg-(--arch-fg)/90 font-mono uppercase text-xs rounded-none h-9 transition-colors disabled:opacity-50"
            >
              {(isLoading || externalIsLoading) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Workflow
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
