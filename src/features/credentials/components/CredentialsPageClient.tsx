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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC, useVanillaClient } from "@/trpc/client";
import { formatDistanceToNow } from "date-fns";
import {
  Github,
  Globe,
  Key,
  KeyRound,
  Loader2,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Slack,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";

const providerIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  slack: Slack,
  custom: Globe,
  default: Key,
};

const providerColors: Record<string, string> = {
  github: "bg-gray-900 text-white",
  slack: "bg-pink-500/10 text-pink-500",
  google: "bg-blue-500/10 text-blue-500",
  custom: "bg-purple-500/10 text-purple-500",
};

export function CredentialsPageClient() {
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCredentialId, setEditingCredentialId] = useState<string | null>(null);
  const [newCredential, setNewCredential] = useState({
    name: "",
    type: "apiKey" as "apiKey" | "oauth2" | "basic" | "bearer" | "custom",
    provider: "custom",
    apiKey: "",
  });

  const trpc = useTRPC();
  const client = useVanillaClient();
  const { data: credentials, isLoading, refetch } = useQuery(trpc.credentials.list.queryOptions());

  const createCredential = useMutation({
    mutationFn: (data: {
      name: string;
      type: "apiKey" | "oauth2" | "basic" | "bearer" | "custom";
      provider: string;
      data: Record<string, unknown>;
    }) => client.credentials.create.mutate(data),
    onSuccess: () => {
      refetch();
      setShowCreateModal(false);
      setEditingCredentialId(null);
      setNewCredential({ name: "", type: "apiKey", provider: "custom", apiKey: "" });
      toast.success("Credential created successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to create credential", { description: error.message });
    },
  });

  const updateCredential = useMutation({
    mutationFn: (data: { id: string; name?: string; data?: Record<string, unknown> }) =>
      client.credentials.update.mutate(data),
    onSuccess: () => {
      refetch();
      setShowCreateModal(false);
      setEditingCredentialId(null);
      setNewCredential({ name: "", type: "apiKey", provider: "custom", apiKey: "" });
      toast.success("Credential updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update credential", { description: error.message });
    },
  });

  const deleteCredential = useMutation({
    mutationFn: (data: { id: string }) => client.credentials.delete.mutate(data),
    onSuccess: () => {
      refetch();
      toast.success("Credential deleted");
    },
    onError: () => {
      toast.error("Failed to delete credential");
    },
  });

  const filteredCredentials = credentials?.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateOrUpdate = async () => {
    if (!newCredential.name.trim()) return;

    if (editingCredentialId) {
      // Update existing credential
      await updateCredential.mutateAsync({
        id: editingCredentialId,
        name: newCredential.name,
        ...(newCredential.apiKey && { data: { apiKey: newCredential.apiKey } }),
      });
    } else {
      // Create new credential
      await createCredential.mutateAsync({
        name: newCredential.name,
        type: newCredential.type,
        provider: newCredential.provider,
        data: { apiKey: newCredential.apiKey },
      });
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingCredentialId(null);
    setNewCredential({ name: "", type: "apiKey", provider: "custom", apiKey: "" });
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <DashboardHeader
        title="Credentials"
        description="Securely store API keys and authentication tokens"
        action={
          <Button onClick={() => setShowCreateModal(true)} className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
            <Plus className="h-4 w-4" />
            New Credential
          </Button>
        }
      />

      <div className="flex-1 px-8 pb-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats */}
          {!isLoading && credentials && credentials.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-xl border border-white/20 dark:border-white/10 shadow-lg backdrop-blur-xl hover-lift transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <KeyRound className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{credentials.length}</p>
                    <p className="text-sm text-muted-foreground font-medium">Total Credentials</p>
                  </div>
                </div>
              </div>
              <div className="glass p-6 rounded-xl border border-white/20 dark:border-white/10 shadow-lg backdrop-blur-xl hover-lift transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20">
                    <Key className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {credentials.filter((c) => c.type === "apiKey").length}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">API Keys</p>
                  </div>
                </div>
              </div>
              <div className="glass p-6 rounded-xl border border-white/20 dark:border-white/10 shadow-lg backdrop-blur-xl hover-lift transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-500/10 ring-1 ring-green-500/20">
                    <Globe className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {credentials.filter((c) => c.type === "oauth2").length}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">OAuth Connections</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            {/* Search */}
            {!isLoading && credentials && credentials.length > 0 && (
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search credentials..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-background/50 border-input/50 focus:bg-background transition-all"
                />
              </div>
            )}

            {/* Quick Connect OAuth */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="gap-2 hover:bg-[#E01E5A]/10 hover:text-[#E01E5A] hover:border-[#E01E5A]/20 transition-all"
                onClick={() => window.location.href = "/api/oauth/slack/connect"}
              >
                <Slack className="h-4 w-4" />
                Connect Slack
              </Button>
              <Button
                variant="outline"
                className="gap-2 hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/20 transition-all"
                onClick={() => window.location.href = "/api/oauth/google/connect"}
              >
                <Globe className="h-4 w-4" />
                Connect Google
              </Button>
              <Button
                variant="outline"
                className="gap-2 hover:bg-zinc-900/10 dark:hover:bg-zinc-100/10 hover:border-zinc-500/20 transition-all"
                onClick={() => window.location.href = "/api/oauth/github/connect"}
              >
                <Github className="h-4 w-4" />
                Connect GitHub
              </Button>
              <Button
                variant="outline"
                className="gap-2 hover:bg-neutral-800/10 hover:text-neutral-800 dark:hover:text-neutral-200 hover:border-neutral-500/20 transition-all"
                onClick={() => window.location.href = "/api/oauth/notion/connect"}
              >
                <Globe className="h-4 w-4" />
                Connect Notion
              </Button>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-6 border rounded-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && credentials?.length === 0 && (
            <div className="empty-state animate-fadeIn glass border border-white/20 dark:border-white/10 p-12 rounded-2xl">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6 mx-auto ring-1 ring-primary/20">
                <KeyRound className="w-10 h-10 text-primary" />
              </div>
              <h3 className="empty-state-title text-xl font-bold">No credentials yet</h3>
              <p className="empty-state-description max-w-md mx-auto mt-2 text-muted-foreground">
                Add API keys and authentication tokens to use in your workflows.
                All credentials are encrypted at rest.
              </p>
              <div className="mt-8 flex justify-center">
                <Button onClick={() => setShowCreateModal(true)} size="lg" className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30">
                  <Plus className="w-4 h-4" />
                  Add Your First Credential
                </Button>
              </div>
            </div>
          )}

          {/* Credentials Grid */}
          {!isLoading && filteredCredentials && filteredCredentials.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {filteredCredentials.map((credential) => {
                const Icon = providerIcons[credential.provider] || providerIcons.default;
                const colorClass = providerColors[credential.provider] || "bg-muted text-muted-foreground";

                return (
                  <Card key={credential.id} className="group card-interactive glass border-white/20 dark:border-white/10 hover:border-primary/30 transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${colorClass} ring-1 ring-inset ring-black/5`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold">{credential.name}</CardTitle>
                            <CardDescription className="text-xs font-medium mt-0.5">
                              {credential.type} • {credential.provider}
                            </CardDescription>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass border-white/20 dark:border-white/10">
                            <DropdownMenuItem
                              onClick={() => {
                                setNewCredential({
                                  name: credential.name,
                                  type: credential.type as "apiKey" | "oauth2" | "basic" | "bearer" | "custom",
                                  provider: credential.provider,
                                  apiKey: "",
                                });
                                setEditingCredentialId(credential.id);
                                setShowCreateModal(true);
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => deleteCredential.mutate({ id: credential.id })}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium pl-[52px]">
                        <span>
                          Created {formatDistanceToNow(credential.createdAt, { addSuffix: true })}
                        </span>
                        {credential.lastUsedAt && (
                          <span className="text-primary/80">
                            Used {formatDistanceToNow(credential.lastUsedAt, { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[480px] glass border-white/20 dark:border-white/10">
          <DialogHeader>
            <DialogTitle>{editingCredentialId ? "Edit Credential" : "Add New Credential"}</DialogTitle>
            <DialogDescription>
              {editingCredentialId
                ? "Update your credential details. Leave the API key empty to keep the existing value."
                : "Securely store your API key or authentication token."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="My API Key"
                value={newCredential.name}
                onChange={(e) =>
                  setNewCredential({ ...newCredential, name: e.target.value })
                }
                className="bg-background/50 border-input/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={newCredential.type}
                  onValueChange={(value) =>
                    setNewCredential({ ...newCredential, type: value as "apiKey" | "oauth2" | "basic" | "bearer" | "custom" })
                  }
                >
                  <SelectTrigger className="bg-background/50 border-input/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apiKey">API Key</SelectItem>
                    <SelectItem value="bearer">Bearer Token</SelectItem>
                    <SelectItem value="basic">Basic Auth</SelectItem>
                    <SelectItem value="oauth2">OAuth2</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Provider</Label>
                <Select
                  value={newCredential.provider}
                  onValueChange={(value) =>
                    setNewCredential({ ...newCredential, provider: value })
                  }
                >
                  <SelectTrigger className="bg-background/50 border-input/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom</SelectItem>
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="slack">Slack</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="openai">OpenAI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key / Token</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-..."
                value={newCredential.apiKey}
                onChange={(e) =>
                  setNewCredential({ ...newCredential, apiKey: e.target.value })
                }
                className="bg-background/50 border-input/50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal} className="hover:bg-primary/5">
              Cancel
            </Button>
            <Button
              onClick={handleCreateOrUpdate}
              disabled={!newCredential.name.trim() || createCredential.isPending || updateCredential.isPending}
              className="shadow-lg shadow-primary/20"
            >
              {(createCredential.isPending || updateCredential.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingCredentialId ? "Update Credential" : "Add Credential"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
