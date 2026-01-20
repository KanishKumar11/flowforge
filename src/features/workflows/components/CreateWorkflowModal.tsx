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
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create New Workflow</DialogTitle>
          <DialogDescription>
            Start building your automation. You can add nodes and configure them
            in the workflow editor.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workflow Name</Label>
              <Input
                id="name"
                placeholder="My Awesome Workflow"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe what this workflow does..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || isLoading || externalIsLoading}>
              {(isLoading || externalIsLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Workflow
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
