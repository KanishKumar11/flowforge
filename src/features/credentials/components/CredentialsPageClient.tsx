"use strict";
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
  Terminal,
  Shield,
  Smartphone,
  BookOpen,
  CreditCard,
  Phone,
  Brain,
  Mail,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const providerIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  github: Github,
  slack: Slack,
  custom: Terminal,
  google: Globe,
  openai: Terminal,
  anthropic: Brain,
  notion: BookOpen,
  stripe: CreditCard,
  twilio: Phone,
  smtp: Mail,
  email: Mail,
  imap: Mail,
  default: Key,
};

export function CredentialsPageClient() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCredentialId, setEditingCredentialId] = useState<string | null>(
    null,
  );
  const [newCredential, setNewCredential] = useState({
    name: "",
    type: "apiKey" as "apiKey" | "oauth2" | "basic" | "bearer" | "custom",
    provider: "custom",
    apiKey: "",
    // SMTP-specific fields
    smtpHost: "",
    smtpPort: "587",
    smtpSecure: false,
    smtpUser: "",
    smtpPass: "",
    smtpFrom: "",
    // Twilio-specific fields
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioPhoneNumber: "",
    // IMAP-specific fields
    imapHost: "",
    imapPort: "993",
    imapSecure: true,
    imapUser: "",
    imapPass: "",
  });

  // Auto-open create dialog with pre-selected provider when ?create=X is in URL
  useEffect(() => {
    const createProvider = searchParams.get("create");
    if (createProvider) {
      setNewCredential((prev) => ({
        ...prev,
        provider: createProvider,
        name:
          createProvider.charAt(0).toUpperCase() +
          createProvider.slice(1) +
          " Credential",
      }));
      setShowCreateModal(true);
    }
  }, [searchParams]);

  const trpc = useTRPC();
  const client = useVanillaClient();
  const {
    data: credentials,
    isLoading,
    refetch,
  } = useQuery(trpc.credentials.list.queryOptions());

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
      setNewCredential({
        name: "",
        type: "apiKey",
        provider: "custom",
        apiKey: "",
        smtpHost: "",
        smtpPort: "587",
        smtpSecure: false,
        smtpUser: "",
        smtpPass: "",
        smtpFrom: "",
        twilioAccountSid: "",
        twilioAuthToken: "",
        twilioPhoneNumber: "",
        imapHost: "",
        imapPort: "993",
        imapSecure: true,
        imapUser: "",
        imapPass: "",
      });
      toast.success("Credential created successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to create credential", {
        description: error.message,
      });
    },
  });

  const updateCredential = useMutation({
    mutationFn: (data: {
      id: string;
      name?: string;
      data?: Record<string, unknown>;
    }) => client.credentials.update.mutate(data),
    onSuccess: () => {
      refetch();
      setShowCreateModal(false);
      setEditingCredentialId(null);
      setNewCredential({
        name: "",
        type: "apiKey",
        provider: "custom",
        apiKey: "",
        smtpHost: "",
        smtpPort: "587",
        smtpSecure: false,
        smtpUser: "",
        smtpPass: "",
        smtpFrom: "",
        twilioAccountSid: "",
        twilioAuthToken: "",
        twilioPhoneNumber: "",
        imapHost: "",
        imapPort: "993",
        imapSecure: true,
        imapUser: "",
        imapPass: "",
      });
      toast.success("Credential updated successfully");
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
      refetch();
      toast.success("Credential deleted");
    },
    onError: () => {
      toast.error("Failed to delete credential");
    },
  });

  const filteredCredentials = credentials?.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleStartEdit = async (cred: {
    id: string;
    name: string;
    type: string;
    provider: string;
  }) => {
    // Show modal immediately with basic info
    setNewCredential({
      name: cred.name,
      type: cred.type as "apiKey" | "oauth2" | "basic" | "bearer" | "custom",
      provider: cred.provider,
      apiKey: "",
      smtpHost: "",
      smtpPort: "587",
      smtpSecure: false,
      smtpUser: "",
      smtpPass: "",
      smtpFrom: "",
      twilioAccountSid: "",
      twilioAuthToken: "",
      twilioPhoneNumber: "",
      imapHost: "",
      imapPort: "993",
      imapSecure: true,
      imapUser: "",
      imapPass: "",
    });
    setEditingCredentialId(cred.id);
    setShowCreateModal(true);
  };

  const handleCreateOrUpdate = async () => {
    if (!newCredential.name.trim()) return;

    const isSmtp = newCredential.provider === "smtp";
    const isTwilio = newCredential.provider === "twilio";
    const isImap = newCredential.provider === "imap";

    let credData: Record<string, unknown>;
    if (isSmtp) {
      credData = {
        host: newCredential.smtpHost,
        port: newCredential.smtpPort || "587",
        secure: newCredential.smtpSecure,
        user: newCredential.smtpUser,
        pass: newCredential.smtpPass,
        ...(newCredential.smtpFrom && { from: newCredential.smtpFrom }),
      };
    } else if (isTwilio) {
      credData = {
        accountSid: newCredential.twilioAccountSid,
        authToken: newCredential.twilioAuthToken,
        phoneNumber: newCredential.twilioPhoneNumber,
      };
    } else if (isImap) {
      credData = {
        host: newCredential.imapHost,
        port: newCredential.imapPort || "993",
        secure: newCredential.imapSecure,
        user: newCredential.imapUser,
        pass: newCredential.imapPass,
      };
    } else {
      credData = { apiKey: newCredential.apiKey };
    }

    if (editingCredentialId) {
      // Update existing credential — always send data so fields like smtpHost are persisted
      await updateCredential.mutateAsync({
        id: editingCredentialId,
        name: newCredential.name,
        data: credData,
      });
    } else {
      // Create new credential
      await createCredential.mutateAsync({
        name: newCredential.name,
        type: newCredential.type,
        provider: newCredential.provider,
        data: credData,
      });
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingCredentialId(null);
    setNewCredential({
      name: "",
      type: "apiKey",
      provider: "custom",
      apiKey: "",
      smtpHost: "",
      smtpPort: "587",
      smtpSecure: false,
      smtpUser: "",
      smtpPass: "",
      smtpFrom: "",
      twilioAccountSid: "",
      twilioAuthToken: "",
      twilioPhoneNumber: "",
      imapHost: "",
      imapPort: "993",
      imapSecure: true,
      imapUser: "",
      imapPass: "",
    });
  };

  return (
    <div className="flex flex-col h-full space-y-6 bg-(--arch-bg) min-h-screen">
      <div className="p-8 border-b border-(--arch-border)">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-mono uppercase tracking-tight text-(--arch-fg) mb-2">
              <span className="text-(--arch-muted) mr-2">&gt;</span>
              System Credentials
            </h1>
            <p className="text-(--arch-muted) font-mono text-sm max-w-2xl">
              // SECURE STORAGE FOR API KEYS AND AUTH TOKENS
              <br />
              // ENCRYPTED AT REST. ACCESS RESTRICTED.
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="gap-2 bg-(--arch-fg) text-(--arch-bg) hover:bg-[rgba(var(--arch-fg-rgb)/0.9)] rounded-none border-0 font-mono uppercase text-xs h-10 px-6"
          >
            <Plus className="h-4 w-4" />
            New Credential
          </Button>
        </div>
      </div>

      <div className="flex-1 px-8 pb-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats */}
          {!isLoading && credentials && credentials.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: "Total Active",
                  value: credentials.length,
                  icon: Shield,
                },
                {
                  label: "API Keys",
                  value: credentials.filter((c) => c.type === "apiKey").length,
                  icon: Key,
                },
                {
                  label: "OAuth Links",
                  value: credentials.filter((c) => c.type === "oauth2").length,
                  icon: Globe,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-(--arch-bg-secondary) border border-(--arch-border) p-6 rounded-none shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-(--arch-bg) border border-(--arch-border)">
                      <stat.icon className="h-6 w-6 text-(--arch-fg)" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold font-mono text-(--arch-fg)">
                        {stat.value}
                      </p>
                      <p className="text-xs text-(--arch-muted) font-mono uppercase tracking-wider">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            {/* Search */}
            {!isLoading && credentials && credentials.length > 0 && (
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--arch-muted)" />
                <Input
                  placeholder="SEARCH_KEY_ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) placeholder:text-(--arch-muted) font-mono text-xs rounded-none focus-visible:ring-0 focus-visible:border-(--arch-fg) h-10"
                />
              </div>
            )}

            {/* Quick Connect OAuth */}
            <div className="flex flex-wrap gap-3">
              {[
                {
                  name: "Slack",
                  icon: Slack,
                  href: "/api/oauth/slack/connect",
                },
                {
                  name: "Google",
                  icon: Globe,
                  href: "/api/oauth/google/connect",
                },
                {
                  name: "GitHub",
                  icon: Github,
                  href: "/api/oauth/github/connect",
                },
                {
                  name: "Notion",
                  icon: Globe,
                  href: "/api/oauth/notion/connect",
                },
              ].map((provider) => (
                <Button
                  key={provider.name}
                  variant="outline"
                  className="gap-2 bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) hover:bg-(--arch-fg) hover:text-(--arch-bg) rounded-none font-mono uppercase text-xs h-9 transition-colors"
                  onClick={() => (window.location.href = provider.href)}
                >
                  <provider.icon className="h-3.5 w-3.5" />
                  Link {provider.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="p-6 border border-(--arch-border) bg-(--arch-bg-secondary) space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-none bg-[rgba(var(--arch-muted-rgb)/0.2)]" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24 bg-[rgba(var(--arch-muted-rgb)/0.2)]" />
                      <Skeleton className="h-3 w-16 bg-[rgba(var(--arch-muted-rgb)/0.2)]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && credentials?.length === 0 && (
            <div className="border border-(--arch-border) border-dashed p-12 bg-[rgba(var(--arch-bg-secondary-rgb)/0.5)] text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-(--arch-bg) border border-(--arch-border) mx-auto mb-6">
                <KeyRound className="w-8 h-8 text-(--arch-fg)" />
              </div>
              <h3 className="text-lg font-bold font-mono text-(--arch-fg) uppercase tracking-wider mb-2">
                No Credentials Found
              </h3>
              <p className="max-w-md mx-auto text-(--arch-muted) font-mono text-sm mb-8">
                Initialize your secure storage by adding API keys or
                authentication tokens.
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-(--arch-fg) text-(--arch-bg) hover:bg-[rgba(var(--arch-fg-rgb)/0.9)] rounded-none font-mono uppercase text-xs h-10 px-8"
              >
                <Plus className="w-4 h-4 mr-2" />
                Initialize Storage
              </Button>
            </div>
          )}

          {/* Credentials Grid */}
          {!isLoading &&
            filteredCredentials &&
            filteredCredentials.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCredentials.map((credential) => {
                  const Icon =
                    providerIcons[credential.provider] || providerIcons.default;

                  return (
                    <Card
                      key={credential.id}
                      className="group bg-(--arch-bg) border-(--arch-border) hover:border-(--arch-fg) transition-colors rounded-none shadow-none"
                    >
                      <CardHeader className="pb-3 border-b border-(--arch-border) bg-(--arch-bg-secondary)/30">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-(--arch-bg) border border-(--arch-border) flex items-center justify-center">
                              <Icon className="h-5 w-5 text-(--arch-fg)" />
                            </div>
                            <div>
                              <CardTitle className="text-sm font-bold font-mono text-(--arch-fg) uppercase tracking-wider">
                                {credential.name}
                              </CardTitle>
                              <CardDescription className="text-xs font-mono text-(--arch-muted) mt-1">
                                TYPE: {credential.type.toUpperCase()}
                              </CardDescription>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-(--arch-muted) hover:text-(--arch-fg) hover:bg-[rgba(var(--arch-fg-rgb)/0.1)] rounded-none"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono z-50 min-w-37.5"
                            >
                              <DropdownMenuItem
                                className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs uppercase tracking-wider"
                                onClick={() => handleStartEdit(credential)}
                              >
                                <Pencil className="mr-2 h-3.5 w-3.5" />
                                Edit Config
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-400 focus:bg-red-900/40 focus:text-red-400 cursor-pointer text-xs uppercase tracking-wider"
                                onClick={() =>
                                  deleteCredential.mutate({ id: credential.id })
                                }
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                Terminate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between text-[10px] font-mono text-(--arch-muted) uppercase tracking-widest">
                          <span>
                            CREATED:{" "}
                            {formatDistanceToNow(credential.createdAt, {
                              addSuffix: true,
                            })}
                          </span>
                          {credential.lastUsedAt && (
                            <span>
                              LAST_ACCESS:{" "}
                              {formatDistanceToNow(credential.lastUsedAt, {
                                addSuffix: true,
                              })}
                            </span>
                          )}
                        </div>
                        <div className="mt-4 flex gap-2">
                          <div className="h-1 w-1 bg-(--arch-muted) rounded-full animate-pulse"></div>
                          <div className="h-1 w-1 bg-(--arch-muted) rounded-full delay-75 animate-pulse"></div>
                          <div className="h-1 w-1 bg-(--arch-muted) rounded-full delay-150 animate-pulse"></div>
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
        <DialogContent className="sm:max-w-120 bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none shadow-2xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 border-b border-(--arch-border) bg-(--arch-bg-secondary)">
            <DialogTitle className="font-mono uppercase text-sm tracking-widest text-(--arch-fg) flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              {editingCredentialId ? "Edit Config" : "New Secure Object"}
            </DialogTitle>
            <DialogDescription className="font-mono text-xs text-(--arch-muted) mt-2">
              {editingCredentialId
                ? "UPDATE_PARAMETERS. LEAVE_KEY_EMPTY_TO_RETAIN."
                : "INITIALIZE_NEW_SECURE_OBJECT. AUTHENTICATION_REQUIRED."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 p-6 overflow-y-auto flex-1">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block"
              >
                Identifier (Name)
              </Label>
              <Input
                id="name"
                placeholder="MY_API_KEY_01"
                value={newCredential.name}
                onChange={(e) =>
                  setNewCredential({ ...newCredential, name: e.target.value })
                }
                className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-10 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Hide Auth Type for SMTP — it's irrelevant for email users */}
              {newCredential.provider !== "smtp" && (
                <div className="space-y-2">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
                    Auth Type
                  </Label>
                  <Select
                    value={newCredential.type}
                    onValueChange={(value) =>
                      setNewCredential({
                        ...newCredential,
                        type: value as
                          | "apiKey"
                          | "oauth2"
                          | "basic"
                          | "bearer"
                          | "custom",
                      })
                    }
                  >
                    <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono text-xs h-10 focus:ring-1 focus:ring-(--arch-fg)">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono z-50">
                      <SelectItem
                        value="apiKey"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs font-mono"
                      >
                        API_KEY
                      </SelectItem>
                      <SelectItem
                        value="bearer"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs font-mono"
                      >
                        BEARER_TOKEN
                      </SelectItem>
                      <SelectItem
                        value="basic"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs font-mono"
                      >
                        BASIC_AUTH
                      </SelectItem>
                      <SelectItem
                        value="oauth2"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs font-mono"
                      >
                        OAUTH2
                      </SelectItem>
                      <SelectItem
                        value="custom"
                        className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs font-mono"
                      >
                        CUSTOM
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
                  Provider
                </Label>
                <Select
                  value={newCredential.provider}
                  onValueChange={(value) =>
                    setNewCredential({ ...newCredential, provider: value })
                  }
                >
                  <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono text-xs h-10 focus:ring-1 focus:ring-(--arch-fg)">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) rounded-none font-mono z-50">
                    <SelectItem
                      value="custom"
                      className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs font-mono"
                    >
                      CUSTOM
                    </SelectItem>
                    <SelectItem
                      value="github"
                      className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs font-mono"
                    >
                      GITHUB
                    </SelectItem>
                    <SelectItem
                      value="slack"
                      className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs font-mono"
                    >
                      SLACK
                    </SelectItem>
                    <SelectItem
                      value="google"
                      className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs font-mono"
                    >
                      GOOGLE
                    </SelectItem>
                    <SelectItem
                      value="openai"
                      className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs font-mono"
                    >
                      OPENAI
                    </SelectItem>
                    <SelectItem
                      value="anthropic"
                      className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs font-mono"
                    >
                      ANTHROPIC
                    </SelectItem>
                    <SelectItem
                      value="notion"
                      className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs font-mono"
                    >
                      NOTION
                    </SelectItem>
                    <SelectItem
                      value="stripe"
                      className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs font-mono"
                    >
                      STRIPE
                    </SelectItem>
                    <SelectItem
                      value="twilio"
                      className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs font-mono"
                    >
                      TWILIO
                    </SelectItem>
                    <SelectItem
                      value="smtp"
                      className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs font-mono"
                    >
                      SMTP (EMAIL)
                    </SelectItem>
                    <SelectItem
                      value="imap"
                      className="focus:bg-(--arch-fg) focus:text-(--arch-bg) cursor-pointer text-xs font-mono"
                    >
                      IMAP (EMAIL INBOX)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* SMTP-specific fields */}
            {newCredential.provider === "smtp" ? (
              <div className="space-y-4">
                {/* Email provider preset picker */}
                <div className="space-y-2">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
                    Email Provider
                  </Label>
                  <div className="grid grid-cols-5 gap-2">
                    {(
                      [
                        {
                          label: "Gmail",
                          host: "smtp.gmail.com",
                          port: "587",
                          secure: false,
                        },
                        {
                          label: "Zoho",
                          host: "smtp.zoho.com",
                          port: "587",
                          secure: false,
                        },
                        {
                          label: "Outlook",
                          host: "smtp-mail.outlook.com",
                          port: "587",
                          secure: false,
                        },
                        {
                          label: "Yahoo",
                          host: "smtp.mail.yahoo.com",
                          port: "465",
                          secure: true,
                        },
                        {
                          label: "Custom",
                          host: "",
                          port: "587",
                          secure: false,
                        },
                      ] as const
                    ).map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() =>
                          setNewCredential({
                            ...newCredential,
                            smtpHost: preset.host,
                            smtpPort: preset.port,
                            smtpSecure: preset.secure,
                          })
                        }
                        className={`py-2 text-xs font-mono border transition-colors ${
                          newCredential.smtpHost === preset.host
                            ? "border-(--arch-fg) bg-(--arch-fg) text-(--arch-bg)"
                            : "border-(--arch-border) text-(--arch-muted) hover:border-(--arch-fg) hover:text-(--arch-fg)"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
                      SMTP Host
                    </Label>
                    <Input
                      placeholder="smtp.gmail.com"
                      value={newCredential.smtpHost}
                      onChange={(e) =>
                        setNewCredential({
                          ...newCredential,
                          smtpHost: e.target.value,
                        })
                      }
                      className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-10 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
                      Port
                    </Label>
                    <Input
                      placeholder="587"
                      value={newCredential.smtpPort}
                      onChange={(e) =>
                        setNewCredential({
                          ...newCredential,
                          smtpPort: e.target.value,
                        })
                      }
                      className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-10 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
                    Email Address
                  </Label>
                  <Input
                    placeholder="you@gmail.com"
                    value={newCredential.smtpUser}
                    onChange={(e) =>
                      setNewCredential({
                        ...newCredential,
                        smtpUser: e.target.value,
                      })
                    }
                    className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-10 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
                    Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="App password or account password"
                    value={newCredential.smtpPass}
                    onChange={(e) =>
                      setNewCredential({
                        ...newCredential,
                        smtpPass: e.target.value,
                      })
                    }
                    className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-10 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
                    From Name / Address{" "}
                    <span className="normal-case text-(--arch-muted)">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    placeholder='"My App" <noreply@yourdomain.com>'
                    value={newCredential.smtpFrom}
                    onChange={(e) =>
                      setNewCredential({
                        ...newCredential,
                        smtpFrom: e.target.value,
                      })
                    }
                    className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-10 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
                  />
                </div>
                {newCredential.smtpHost === "smtp.gmail.com" && (
                  <div className="p-3 border border-yellow-500/30 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400 text-xs font-mono space-y-1">
                    <p className="font-semibold">
                      Gmail requires an App Password
                    </p>
                    <p>
                      Your regular Gmail password won\'t work. Go to{" "}
                      <span className="underline">
                        myaccount.google.com/apppasswords
                      </span>
                      , create an app password, and paste it above.
                    </p>
                  </div>
                )}
                {newCredential.smtpHost === "smtp.zoho.com" && (
                  <div className="p-3 border border-orange-500/30 bg-orange-500/5 text-orange-600 dark:text-orange-400 text-xs font-mono space-y-1">
                    <p className="font-semibold">
                      Zoho requires an App-Specific Password
                    </p>
                    <p>
                      Your Zoho login password won&apos;t work. Go to{" "}
                      <span className="underline">
                        accounts.zoho.com → Security → App Passwords
                      </span>
                      , generate one, and paste it above.
                    </p>
                  </div>
                )}
                {newCredential.smtpHost === "smtp-mail.outlook.com" && (
                  <div className="p-3 border border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400 text-xs font-mono">
                    <p>
                      Use your Outlook email address and password. If you have
                      2FA, create an App Password at
                      account.microsoft.com/security.
                    </p>
                  </div>
                )}
              </div>
            ) : newCredential.provider === "twilio" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
                    Account SID
                  </Label>
                  <Input
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    value={newCredential.twilioAccountSid}
                    onChange={(e) =>
                      setNewCredential({
                        ...newCredential,
                        twilioAccountSid: e.target.value,
                      })
                    }
                    className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-10 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
                    Auth Token
                  </Label>
                  <Input
                    type="password"
                    placeholder="********************************"
                    value={newCredential.twilioAuthToken}
                    onChange={(e) =>
                      setNewCredential({
                        ...newCredential,
                        twilioAuthToken: e.target.value,
                      })
                    }
                    className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-10 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
                    Twilio Phone Number (Optional)
                  </Label>
                  <Input
                    placeholder="+1234567890"
                    value={newCredential.twilioPhoneNumber}
                    onChange={(e) =>
                      setNewCredential({
                        ...newCredential,
                        twilioPhoneNumber: e.target.value,
                      })
                    }
                    className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-10 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
                  />
                </div>
              </div>
            ) : newCredential.provider === "imap" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      label: "Gmail",
                      host: "imap.gmail.com",
                      port: "993",
                      secure: true,
                    },
                    {
                      label: "Outlook",
                      host: "outlook.office365.com",
                      port: "993",
                      secure: true,
                    },
                    {
                      label: "Zoho",
                      host: "imap.zoho.com",
                      port: "993",
                      secure: true,
                    },
                    {
                      label: "Yahoo",
                      host: "imap.mail.yahoo.com",
                      port: "993",
                      secure: true,
                    },
                    { label: "Custom", host: "", port: "993", secure: true },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() =>
                        setNewCredential({
                          ...newCredential,
                          imapHost: preset.host,
                          imapPort: preset.port,
                          imapSecure: preset.secure,
                        })
                      }
                      className={`px-2 py-1.5 text-[10px] font-mono uppercase border transition-all ${
                        newCredential.imapHost === preset.host &&
                        preset.host !== ""
                          ? "bg-(--arch-fg) text-(--arch-bg) border-(--arch-fg)"
                          : "bg-(--arch-bg) text-(--arch-muted) border-(--arch-border) hover:text-(--arch-fg) hover:border-(--arch-fg)"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
                    IMAP Host
                  </Label>
                  <Input
                    placeholder="imap.gmail.com"
                    value={newCredential.imapHost}
                    onChange={(e) =>
                      setNewCredential({
                        ...newCredential,
                        imapHost: e.target.value,
                      })
                    }
                    className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-10 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
                      Port
                    </Label>
                    <Input
                      placeholder="993"
                      value={newCredential.imapPort}
                      onChange={(e) =>
                        setNewCredential({
                          ...newCredential,
                          imapPort: e.target.value,
                        })
                      }
                      className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-10 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
                      TLS / SSL
                    </Label>
                    <Select
                      value={newCredential.imapSecure ? "true" : "false"}
                      onValueChange={(v) =>
                        setNewCredential({
                          ...newCredential,
                          imapSecure: v === "true",
                        })
                      }
                    >
                      <SelectTrigger className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-10 focus:ring-1 focus:ring-(--arch-fg)">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono rounded-none">
                        <SelectItem
                          value="true"
                          className="font-mono text-xs focus:bg-(--arch-fg) focus:text-(--arch-bg)"
                        >
                          SSL/TLS (port 993)
                        </SelectItem>
                        <SelectItem
                          value="false"
                          className="font-mono text-xs focus:bg-(--arch-fg) focus:text-(--arch-bg)"
                        >
                          STARTTLS (port 143)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
                    Email / Username
                  </Label>
                  <Input
                    placeholder="you@example.com"
                    value={newCredential.imapUser}
                    onChange={(e) =>
                      setNewCredential({
                        ...newCredential,
                        imapUser: e.target.value,
                      })
                    }
                    className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-10 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block">
                    Password / App Password
                  </Label>
                  <Input
                    type="password"
                    placeholder="********************************"
                    value={newCredential.imapPass}
                    onChange={(e) =>
                      setNewCredential({
                        ...newCredential,
                        imapPass: e.target.value,
                      })
                    }
                    className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-10 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
                  />
                </div>
                {(newCredential.imapHost === "imap.gmail.com" ||
                  newCredential.imapHost === "imap.mail.yahoo.com") && (
                  <div className="p-3 border border-yellow-500/30 bg-yellow-500/5">
                    <p className="text-[11px] font-mono text-yellow-500 leading-relaxed">
                      <strong>App Password required.</strong> Gmail/Yahoo block
                      regular passwords for IMAP. Enable 2FA then generate an
                      App Password at your account security settings.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label
                  htmlFor="apiKey"
                  className="text-(--arch-fg) font-mono uppercase text-xs tracking-wider mb-1 block"
                >
                  Secret / Token
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="**********************"
                  value={newCredential.apiKey}
                  onChange={(e) =>
                    setNewCredential({
                      ...newCredential,
                      apiKey: e.target.value,
                    })
                  }
                  className="bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) font-mono text-xs rounded-none h-10 placeholder:text-(--arch-muted) focus-visible:ring-1 focus-visible:ring-(--arch-fg)"
                />
              </div>
            )}
          </div>
          <DialogFooter className="p-6 border-t border-(--arch-border) bg-(--arch-bg-secondary) flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={handleCloseModal}
              className="text-(--arch-muted) hover:text-(--arch-fg) hover:bg-[rgba(var(--arch-fg-rgb)/0.1)] font-mono uppercase text-xs rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateOrUpdate}
              disabled={
                !newCredential.name.trim() ||
                createCredential.isPending ||
                updateCredential.isPending
              }
              className="bg-(--arch-fg) text-(--arch-bg) hover:bg-[rgba(var(--arch-fg-rgb)/0.9)] rounded-none font-mono uppercase text-xs px-6 shadow-[0_0_10px_rgba(74,222,128,0.3)]"
            >
              {(createCredential.isPending || updateCredential.isPending) && (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              )}
              {editingCredentialId ? "Update Object" : "Initialize"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
