"use client";

import { useTRPC, useVanillaClient } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, RotateCcw, Clock, User } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface VersionHistoryPanelProps {
  workflowId: string;
  currentVersion: number;
}

// Define explicit types to avoid deep type inference issues
interface VersionUser {
  id: string;
  name: string | null;
  email: string;
}

interface WorkflowVersion {
  id: string;
  versionNum: number;
  createdAt: string | Date;
  changeMessage: string | null;
  createdBy: VersionUser | null;
}

export function VersionHistoryPanel({ workflowId, currentVersion }: VersionHistoryPanelProps) {
  const trpc = useTRPC();
  const client = useVanillaClient();
  const queryClient = useQueryClient();

  const { data: versions, isLoading } = useQuery(
    trpc.workflows.listVersions.queryOptions({ workflowId })
  );

  const rollback = useMutation({
    mutationFn: (data: { workflowId: string; versionNum: number }) =>
      client.workflows.rollback.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      toast.success("Rolled back to selected version");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse text-muted-foreground">Loading versions...</div>
        </CardContent>
      </Card>
    );
  }

  // Cast to our explicit type to avoid deep inference
  const typedVersions = versions as WorkflowVersion[] | undefined;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-4 w-4" />
          Version History
          <span className="text-muted-foreground font-normal text-sm">
            (Current: v{currentVersion})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          {typedVersions && typedVersions.length > 0 ? (
            <div className="space-y-2">
              {typedVersions.map((version) => (
                <div
                  key={version.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${version.versionNum === currentVersion
                    ? "border-primary bg-primary/5"
                    : "hover:bg-accent"
                    }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Version {version.versionNum}</span>
                      {version.versionNum === currentVersion && (
                        <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                      </span>
                      {version.createdBy && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {version.createdBy.name || version.createdBy.email}
                        </span>
                      )}
                    </div>
                    {version.changeMessage && (
                      <p className="text-xs text-muted-foreground">
                        {version.changeMessage}
                      </p>
                    )}
                  </div>
                  {version.versionNum !== currentVersion && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        rollback.mutate({ workflowId, versionNum: version.versionNum })
                      }
                      disabled={rollback.isPending}
                      className="gap-1"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Restore
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No version history yet</p>
              <p className="text-xs">Versions are saved when you edit the workflow</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
