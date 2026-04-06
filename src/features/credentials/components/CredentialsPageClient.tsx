"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Component,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const providerConfig: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  github: { icon: Github, color: "text-white" },
  slack: { icon: Slack, color: "text-[#E01E5A]" },
  notion: { icon: BookOpen, color: "text-zinc-200" },
  stripe: { icon: CreditCard, color: "text-[#635BFF]" },
  twilio: { icon: Phone, color: "text-[#F22F46]" },
  openai: { icon: Brain, color: "text-[#10A37F]" },
  google_sheets: { icon: Component, color: "text-[#0F9D58]" },
  email: { icon: Mail, color: "text-blue-400" },
  custom: { icon: Globe, color: "text-(--arch-accent)" },
};

export function CredentialsPageClient() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCredentialId, setEditingCredentialId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [newCredential, setNewCredential] = useState({
    name: "",
    type: "apiKey" as "apiKey" | "oauth2" | "basic" | "bearer" | "custom",
    provider: "custom",
    data: { key: "", secret: "", username: "", password: "", custom: "" },
  });

  const trpc = useTRPC();
  const client = useVanillaClient();

  const {
    data: credentials,
    isLoading,
    refetch,
  } = useQuery(trpc.credentials.list.queryOptions());

  const createCredential = useMutation({
    mutationFn: (data: any) => client.credentials.create.mutate(data),
    onSuccess: () => {
      refetch();
      setShowCreateModal(false);
      resetForm();
      toast.success("Security Clearance Granted", {
        className: "bg-black border-emerald-500/20 text-emerald-400 font-mono tracking-wide text-xs",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to provision credential", {
        className: "bg-black border-red-500/20 text-red-500 font-mono tracking-wide text-xs",
      });
    },
  });

  const updateCredential = useMutation({
    mutationFn: (data: any) => client.credentials.update.mutate(data),
    onSuccess: () => {
      refetch();
      setShowCreateModal(false);
      resetForm();
      toast.success("Security Block Updated", {
        className: "bg-black border-emerald-500/20 text-emerald-400 font-mono tracking-wide text-xs",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to revise credential");
    },
  });

  const deleteCredential = useMutation({
    mutationFn: (data: { id: string }) =>
      client.credentials.delete.mutate(data),
    onSuccess: () => {
      refetch();
      toast.success("Clearance Revoked", {
        className: "bg-black border-red-500/20 text-red-400 font-mono tracking-wide text-xs",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to purge credential");
    },
  });

  const resetForm = () => {
    setNewCredential({
      name: "",
      type: "apiKey",
      provider: "custom",
      data: { key: "", secret: "", username: "", password: "", custom: "" },
    });
    setEditingCredentialId(null);
  };

  const handleEdit = (credential: any) => {
    setNewCredential({
      name: credential.name,
      type: credential.type,
      provider: credential.provider,
      data: { key: "", secret: "", username: "", password: "", custom: "" }, 
    });
    setEditingCredentialId(credential.id);
    setShowCreateModal(true);
  };

  const handleSubmit = () => {
    if (!newCredential.name) {
      toast.error("IDENTIFIER REQUIRED", {
        className: "bg-black border-red-500/20 text-red-400 font-mono tracking-wide text-xs",
      });
      return;
    }

    if (editingCredentialId) {
      updateCredential.mutate({
        id: editingCredentialId,
        name: newCredential.name,
        type: newCredential.type,
        provider: newCredential.provider,
        data: newCredential.data,
      });
    } else {
      createCredential.mutate(newCredential);
    }
  };

  const filteredCredentials = credentials?.filter((c: any) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const containerVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[var(--background)]">
      <div className="px-8 py-2">
        <DashboardHeader
          title="Security Center"
          description="Manage cryptographic keys and integration clearances"
        />
      </div>

      <div className="flex-1 px-8 pb-12 overflow-auto">
        <div className="max-w-[1600px] mx-auto space-y-8">
          
          {/* Active Vault Summary */}
          <div className="glass-panel rounded-[2rem] p-8 border-emerald-500/10 bg-emerald-500/[0.02]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                  <Shield className="h-8 w-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-mono uppercase tracking-widest text-[#fff] font-bold">Encrypted Vault Status</h3>
                  <p className="text-white/50 text-[10px] uppercase font-mono tracking-widest mt-1">
                    AES-256-GCM Transport Enabled
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                  <Input
                    placeholder="Search Vaults..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-64 pl-10 bg-white/5 border-white/10 text-white font-mono text-xs rounded-full h-11 focus-visible:ring-1 focus-visible:ring-emerald-500/50 hover:bg-white/10 transition-colors"
                  />
                </div>
                <Button
                  onClick={() => {
                    resetForm();
                    setShowCreateModal(true);
                  }}
                  className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-black border border-transparent shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all h-11 px-6 font-mono text-[10px] uppercase tracking-widest font-bold hidden md:flex gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Provision Block
                </Button>
              </div>
            </div>
          </div>

          {/* Credentials Matrix Grid */}
          <div className="w-full pt-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-panel h-[180px] rounded-[2rem] p-6 flex flex-col justify-between">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
                      <div className="space-y-3 flex-1">
                        <div className="h-5 w-1/2 rounded bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite_0.1s]" />
                        <div className="h-3 w-1/3 rounded bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite_0.2s]" />
                      </div>
                    </div>
                    <div className="h-2 w-full max-w-[100px] rounded bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite_0.3s] mt-auto" />
                  </div>
                ))}
              </div>
            ) : filteredCredentials?.length === 0 ? (
              <div className="glass-panel rounded-[2rem] p-16 flex flex-col items-center justify-center border-dashed border-white/10 text-center">
                <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5" />
                  <KeyRound className="h-10 w-10 text-white/30" />
                </div>
                <h3 className="text-xl font-bold font-mono tracking-widest uppercase text-white mb-2">Vault Empty</h3>
                <p className="text-white/50 text-[10px] font-mono uppercase tracking-widest max-w-sm mb-8">
                  {searchQuery ? "No matching records found." : "No credentials have been provisioned."}
                </p>
                <Button
                  onClick={() => {
                    resetForm();
                    setShowCreateModal(true);
                  }}
                  className="rounded-full bg-(--arch-fg) text-[var(--background)] hover:bg-white h-11 px-8 font-mono text-[10px] uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(var(--arch-accent-rgb)/0.2)] hover:shadow-[0_0_30px_rgba(var(--arch-accent-rgb)/0.4)] transition-all gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Provision Block
                </Button>
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredCredentials?.map((credential: any) => {
                    const providerInfo = providerConfig[credential.provider] || providerConfig.custom;
                    const ProviderIcon = providerInfo.icon;

                    return (
                      <motion.div 
                        layout
                        key={credential.id}
                        variants={itemVariants}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <div className="glass-panel rounded-[2rem] p-6 h-full flex flex-col hover:bg-[rgba(255,255,255,0.03)] hover:border-white/10 transition-all duration-300 group relative overflow-hidden">
                          {/* Inner glow flare for providers */}
                          {credential.provider !== "custom" && (
                            <div className={`absolute -top-16 -right-16 w-32 h-32 ${providerInfo.color.replace('text-', 'bg-')} opacity-[0.05] blur-3xl rounded-full group-hover:opacity-[0.1] transition-opacity duration-700`} />
                          )}

                          <div className="flex items-start justify-between relative z-10">
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors ${providerInfo.color}`}>
                                <ProviderIcon className="h-6 w-6" />
                              </div>
                              <div>
                                <h4 className="font-mono text-white tracking-widest font-bold uppercase truncate max-w-[180px]">
                                  {credential.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                                    {credential.provider}
                                  </span>
                                  <span className="text-[9px] font-mono text-(--arch-accent) uppercase tracking-widest px-2 py-0.5 rounded-full bg-[rgba(var(--arch-accent-rgb)/0.1)] border border-[rgba(var(--arch-accent-rgb)/0.2)]">
                                    {credential.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-white/30 hover:text-white hover:bg-white/10 rounded-full"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-[rgba(15,17,21,0.95)] backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl w-48"
                              >
                                <DropdownMenuItem
                                  className="focus:bg-white/5 focus:text-white cursor-pointer font-mono text-[10px] uppercase tracking-widest text-white/70 rounded-xl"
                                  onClick={() => handleEdit(credential)}
                                >
                                  <Pencil className="mr-2 h-3.5 w-3.5" />
                                  Modify Config
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-400 focus:bg-red-400/10 focus:text-red-400 cursor-pointer font-mono text-[10px] uppercase tracking-widest mt-1 rounded-xl"
                                  onClick={() => deleteCredential.mutate({ id: credential.id })}
                                >
                                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                                  Terminate
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="mt-auto pt-6 opacity-40 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center justify-between text-[9px] font-mono text-white/50 uppercase tracking-widest">
                                <span>
                                  INIT: {formatDistanceToNow(credential.createdAt)} AGO
                                </span>
                                {credential.lastUsedAt && (
                                  <span>
                                    PULL: {formatDistanceToNow(credential.lastUsedAt)} AGO //
                                  </span>
                                )}
                            </div>
                            <div className="mt-3 flex gap-1.5 h-1">
                              <div className="h-full flex-1 bg-white/[0.05] rounded-full overflow-hidden">
                                <div className="h-full w-0 bg-(--arch-accent) group-hover:w-full transition-all duration-[2000ms] ease-out delay-100 opacity-30" />
                              </div>
                              <div className="h-full flex-1 bg-white/[0.05] rounded-full overflow-hidden">
                                <div className="h-full w-0 bg-(--arch-accent) group-hover:w-full transition-all duration-[2000ms] ease-out delay-300 opacity-30" />
                              </div>
                              <div className="h-full flex-1 bg-white/[0.05] rounded-full overflow-hidden">
                                <div className="h-full w-0 bg-(--arch-accent) group-hover:w-full transition-all duration-[2000ms] ease-out delay-500 opacity-30" />
                              </div>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Modal - Config Update */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[480px] bg-[rgba(15,17,21,0.95)] backdrop-blur-2xl border-white/10 text-white rounded-[2rem] shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
            <DialogTitle className="font-mono uppercase text-lg tracking-widest text-emerald-400 flex items-center gap-3">
              <Terminal className="h-5 w-5" />
              {editingCredentialId ? "MODIFY OVERRIDE" : "NEW SECURE OBJECT"}
            </DialogTitle>
            <DialogDescription className="font-mono text-[10px] uppercase text-white/50 mt-2 tracking-widest leading-relaxed">
              {editingCredentialId
                ? "UPDATE_PARAMETERS. LEAVE_KEY_EMPTY_TO_RETAIN."
                : "INITIALIZE_NEW_SECURE_OBJECT. AUTHENTICATION_REQUIRED."}
            </DialogDescription>
          </DialogHeader>

          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <Label className="text-white/70 font-mono uppercase text-[10px] tracking-widest ml-1">
                Identifier Alias
              </Label>
              <Input
                placeholder="MY_API_KEY_01"
                value={newCredential.name}
                onChange={(e) =>
                  setNewCredential({ ...newCredential, name: e.target.value })
                }
                className="bg-black/50 border-white/10 text-white font-mono text-xs rounded-xl h-11 px-4 placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-emerald-400/50 focus-visible:border-emerald-400/50"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-white/70 font-mono uppercase text-[10px] tracking-widest ml-1">
                  Auth Type
                </Label>
                <Select
                  value={newCredential.type}
                  onValueChange={(value) =>
                    setNewCredential({ ...newCredential, type: value as any })
                  }
                >
                  <SelectTrigger className="bg-black/50 border-white/10 text-white rounded-xl font-mono text-xs h-11 focus:ring-1 focus:ring-emerald-400/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f1115] border-white/10 rounded-xl">
                    <SelectItem value="apiKey" className="font-mono text-[10px] uppercase my-1 text-white/70 focus:bg-white/10 rounded-lg">API Key</SelectItem>
                    <SelectItem value="bearer" className="font-mono text-[10px] uppercase my-1 text-white/70 focus:bg-white/10 rounded-lg">Bearer Token</SelectItem>
                    <SelectItem value="basic" className="font-mono text-[10px] uppercase my-1 text-white/70 focus:bg-white/10 rounded-lg">Basic Auth</SelectItem>
                    <SelectItem value="oauth2" className="font-mono text-[10px] uppercase my-1 text-white/70 focus:bg-white/10 rounded-lg">OAuth2</SelectItem>
                    <SelectItem value="custom" className="font-mono text-[10px] uppercase my-1 text-white/70 focus:bg-white/10 rounded-lg">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-white/70 font-mono uppercase text-[10px] tracking-widest ml-1">
                  Provider Node
                </Label>
                <Select
                  value={newCredential.provider}
                  onValueChange={(value) =>
                    setNewCredential({ ...newCredential, provider: value })
                  }
                >
                  <SelectTrigger className="bg-black/50 border-white/10 text-white rounded-xl font-mono text-xs h-11 focus:ring-1 focus:ring-emerald-400/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f1115] border-white/10 rounded-xl max-h-[300px]">
                    <SelectItem value="custom" className="font-mono text-[10px] uppercase my-1 text-white/70 focus:bg-white/10 rounded-lg">Custom Service</SelectItem>
                    <SelectItem value="github" className="font-mono text-[10px] uppercase my-1 text-white/70 focus:bg-white/10 rounded-lg">GitHub Data</SelectItem>
                    <SelectItem value="slack" className="font-mono text-[10px] uppercase my-1 text-white/70 focus:bg-white/10 rounded-lg">Slack API</SelectItem>
                    <SelectItem value="stripe" className="font-mono text-[10px] uppercase my-1 text-white/70 focus:bg-white/10 rounded-lg">Stripe Billing</SelectItem>
                    <SelectItem value="twilio" className="font-mono text-[10px] uppercase my-1 text-white/70 focus:bg-white/10 rounded-lg">Twilio SMS</SelectItem>
                    <SelectItem value="openai" className="font-mono text-[10px] uppercase my-1 text-white/70 focus:bg-white/10 rounded-lg">OpenAI Gen</SelectItem>
                    <SelectItem value="google_sheets" className="font-mono text-[10px] uppercase my-1 text-white/70 focus:bg-white/10 rounded-lg">Google Sheets</SelectItem>
                    <SelectItem value="notion" className="font-mono text-[10px] uppercase my-1 text-white/70 focus:bg-white/10 rounded-lg">Notion DB</SelectItem>
                    <SelectItem value="email" className="font-mono text-[10px] uppercase my-1 text-white/70 focus:bg-white/10 rounded-lg">SMTP/Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dynamic Inputs Based on Type */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
              {(newCredential.type === "apiKey" || newCredential.type === "bearer") && (
                <div className="space-y-3">
                  <Label className="text-emerald-400 font-mono uppercase text-[10px] tracking-widest ml-1 flex items-center gap-2">
                    <KeyRound className="h-3 w-3" /> Secure Token
                  </Label>
                  <Input
                    type="password"
                    placeholder="sk_live_..."
                    value={newCredential.data.key}
                    onChange={(e) => setNewCredential({ ...newCredential, data: { ...newCredential.data, key: e.target.value }})}
                    className="bg-black/50 border-white/10 text-white font-mono text-xs rounded-xl h-11 px-4 placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-emerald-400/50"
                  />
                </div>
              )}

              {newCredential.type === "basic" && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-white/70 font-mono uppercase text-[10px] tracking-widest ml-1">Username</Label>
                    <Input
                      type="text"
                      placeholder="admin"
                      value={newCredential.data.username}
                      onChange={(e) => setNewCredential({ ...newCredential, data: { ...newCredential.data, username: e.target.value }})}
                      className="bg-black/50 border-white/10 text-white font-mono text-xs rounded-xl h-11 px-4 placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-emerald-400/50"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-emerald-400 font-mono uppercase text-[10px] tracking-widest ml-1 flex items-center gap-2">
                      <KeyRound className="h-3 w-3" /> Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={newCredential.data.password}
                      onChange={(e) => setNewCredential({ ...newCredential, data: { ...newCredential.data, password: e.target.value }})}
                      className="bg-black/50 border-white/10 text-white font-mono text-xs rounded-xl h-11 px-4 placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-emerald-400/50"
                    />
                  </div>
                </div>
              )}

              {(newCredential.type === "oauth2" || newCredential.type === "custom") && (
                <div className="space-y-3">
                  <Label className="text-emerald-400 font-mono uppercase text-[10px] tracking-widest ml-1 flex items-center gap-2">
                    <Shield className="h-3 w-3" /> JSON Configuration
                  </Label>
                  <textarea
                    placeholder='{ "clientId": "...", "clientSecret": "..." }'
                    value={newCredential.data.custom}
                    onChange={(e) => setNewCredential({ ...newCredential, data: { ...newCredential.data, custom: e.target.value }})}
                    className="w-full bg-black/50 border border-white/10 text-white font-mono text-[10px] rounded-xl p-4 min-h-[120px] placeholder:text-white/20 focus:ring-1 focus:ring-emerald-400/50 focus:outline-none resize-none"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 rounded-full border-white/10 bg-transparent text-white/50 hover:bg-white/5 hover:text-white font-mono text-[10px] uppercase tracking-widest h-11"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createCredential.isPending || updateCredential.isPending}
                className="flex-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black border border-transparent shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all font-mono text-[10px] uppercase tracking-widest font-bold h-11"
              >
                {(createCredential.isPending || updateCredential.isPending) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  editingCredentialId ? "Push Update" : "Provision"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
