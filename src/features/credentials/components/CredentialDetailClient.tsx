"use client";

import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC, useVanillaClient } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDistanceToNow, format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Key,
  Loader2,
  Pencil,
  Shield,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CredentialDetailClientProps {
  credentialId: string;
}

export function CredentialDetailClient({
  credentialId,
}: CredentialDetailClientProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const client = useVanillaClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");

  const {
    data: credential,
    isLoading,
    refetch,
  } = useQuery(trpc.credentials.get.queryOptions({ id: credentialId }));

  const updateCredential = useMutation({
    mutationFn: (data: { id: string; name: string }) =>
      client.credentials.update.mutate(data),
    onSuccess: () => {
      refetch();
      setIsEditing(false);
      toast.success("Credential updated");
    },
    onError: (error: Error) => {
      toast.error("Failed to update credential", {
        description: error.message,
      });
    },
  });

  const deleteCredential = useMutation({
    mutationFn: (data: { id: string }) =>
      client.credentials.delete.mutate(data),
    onSuccess: () => {
      toast.success("Credential deleted");
      router.push("/credentials");
    },
    onError: () => {
      toast.error("Failed to delete credential");
    },
  });

  const handleSave = () => {
    if (!editName.trim()) return;
    updateCredential.mutate({ id: credentialId, name: editName.trim() });
  };

  const handleStartEdit = () => {
    setEditName(credential?.name || "");
    setIsEditing(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full space-y-6">
        <DashboardHeader title="Credential" description="Loading..." />
        <div className="flex-1 px-8 pb-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!credential) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-4">
        <p className="text-muted-foreground font-mono text-sm">
          Credential not found
        </p>
        <Button variant="outline" asChild>
          <Link href="/credentials">Back to Credentials</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      <DashboardHeader
        title={credential.name}
        description={`${credential.provider} · ${credential.type}`}
        action={
          <Button
            variant="outline"
            asChild
            className="gap-2 font-mono text-xs uppercase rounded-xl"
          >
            <Link href="/credentials">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      <div className="flex-1 px-8 pb-8 overflow-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Details Card */}
          <Card className="bg-background border-border shadow-none rounded-xl">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-lg font-bold font-mono uppercase text-foreground flex items-center gap-2">
                <Key className="h-5 w-5" />
                Credential Details
              </CardTitle>
              <CardDescription className="font-mono text-xs text-muted-foreground">
                View and manage this credential.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label className="text-foreground font-mono uppercase text-xs flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  Name
                </Label>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-background border-border focus:border-foreground text-foreground font-mono rounded-xl text-xs max-w-sm"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={updateCredential.isPending}
                      className="rounded-xl font-mono text-xs uppercase"
                    >
                      {updateCredential.isPending && (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      )}
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(false)}
                      className="rounded-xl font-mono text-xs uppercase"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-mono text-sm">
                      {credential.name}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleStartEdit}
                      className="h-7 w-7 p-0"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Type & Provider */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-foreground font-mono uppercase text-xs flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Type
                  </Label>
                  <span className="inline-block px-3 py-1 bg-secondary text-foreground font-mono text-xs rounded-lg border border-border">
                    {credential.type}
                  </span>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground font-mono uppercase text-xs">
                    Provider
                  </Label>
                  <span className="inline-block px-3 py-1 bg-secondary text-foreground font-mono text-xs rounded-lg border border-border capitalize">
                    {credential.provider}
                  </span>
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-1">
                  <Label className="text-muted-foreground font-mono uppercase text-[10px] flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Created
                  </Label>
                  <p className="text-foreground font-mono text-xs">
                    {format(new Date(credential.createdAt), "MMM d, yyyy")}
                  </p>
                  <p className="text-muted-foreground font-mono text-[10px]">
                    {formatDistanceToNow(new Date(credential.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground font-mono uppercase text-[10px] flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Updated
                  </Label>
                  <p className="text-foreground font-mono text-xs">
                    {format(new Date(credential.updatedAt), "MMM d, yyyy")}
                  </p>
                  <p className="text-muted-foreground font-mono text-[10px]">
                    {formatDistanceToNow(new Date(credential.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground font-mono uppercase text-[10px] flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last Used
                  </Label>
                  <p className="text-foreground font-mono text-xs">
                    {credential.lastUsedAt
                      ? format(new Date(credential.lastUsedAt), "MMM d, yyyy")
                      : "Never"}
                  </p>
                  {credential.lastUsedAt && (
                    <p className="text-muted-foreground font-mono text-[10px]">
                      {formatDistanceToNow(new Date(credential.lastUsedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-background border-red-500/20 shadow-none rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold font-mono uppercase text-red-500">
                Danger Zone
              </CardTitle>
              <CardDescription className="font-mono text-xs text-muted-foreground">
                Permanently delete this credential. This cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={() => deleteCredential.mutate({ id: credentialId })}
                disabled={deleteCredential.isPending}
                className="gap-2 rounded-xl font-mono text-xs uppercase"
              >
                {deleteCredential.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Delete Credential
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
