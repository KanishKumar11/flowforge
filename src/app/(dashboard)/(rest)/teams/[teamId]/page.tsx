// @ts-nocheck
"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  UserPlus,
  Trash2,
  Shield,
  Activity,
  AlertCircle,
  Mail,
  X,
  RefreshCw,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BallLoader } from "@/components/ui/ball-loader";
import { PLANS } from "@/lib/plans";
import { useHasActiveSubscription } from "@/features/hooks/useSubscription";
import { cn } from "@/lib/utils";

const springTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
} as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: springTransition },
};

function GlassContainer({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      variants={itemVariants}
      onClick={onClick}
      className={cn(
        "relative rounded-[2rem] p-8 md:p-10 z-10 transition-all",
        "bg-background border border-border/50",
        "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]",
        "before:absolute before:inset-0 before:rounded-[2rem] before:border before:border-white/10 before:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] before:pointer-events-none",
        onClick &&
          "cursor-pointer hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] hover:-translate-y-[2px]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const teamId = params.teamId as string;
  const { hasActiveSubscription } = useHasActiveSubscription();

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"ADMIN" | "MEMBER" | "VIEWER">(
    "MEMBER",
  );
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const { data: team, isLoading } = useQuery(
    trpc.teams.get.queryOptions({ id: teamId }),
  );

  const teamQueryKey = trpc.teams.get.queryOptions({ id: teamId }).queryKey;

  const inviteMember = useMutation(
    trpc.teams.invite.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: teamQueryKey });
        toast.success("Member invited successfully");
        setIsInviteOpen(false);
        setInviteEmail("");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const removeMember = useMutation(
    trpc.teams.removeMember.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: teamQueryKey });
        toast.success("Member removed");
      },
    }),
  );

  const updateRole = useMutation(
    trpc.teams.updateMemberRole.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: teamQueryKey });
        toast.success("Role updated");
      },
    }),
  );

  const deleteTeam = useMutation(
    trpc.teams.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Team deleted");
        router.push("/teams");
      },
    }),
  );

  const cancelInvitation = useMutation(
    trpc.teams.cancelInvitation.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: teamQueryKey });
        toast.success("Invitation cancelled");
      },
    }),
  );

  const resendInvitation = useMutation(
    trpc.teams.resendInvitation.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: teamQueryKey });
        toast.success("Invitation resent");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh]">
        <BallLoader />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] space-y-4">
        <p className="text-muted-foreground font-sans">Team not found</p>
        <Button
          className="cursor-pointer cursor-pointer"
          asChild
          variant="outline"
          className="rounded-xl font-sans uppercase text-xs"
        >
          <Link href="/teams">Back to Teams</Link>
        </Button>
      </div>
    );
  }

  const isOwner = team.currentUserRole === "OWNER";
  const isAdmin = team.currentUserRole === "ADMIN" || isOwner;

  // Use Polar subscription as ground truth; fall back to DB value
  const effectivePlan = hasActiveSubscription
    ? "PRO"
    : team.plan?.toUpperCase() || "FREE";
  const planKey = effectivePlan as keyof typeof PLANS;
  const maxMembers = PLANS[planKey]?.limits?.teamMembers || 1;
  const currentMembersCount = team.members.length;
  const isLimitReached = currentMembersCount >= maxMembers;

  return (
    <div className="min-h-[100dvh] bg-background p-6 md:p-12 overflow-x-hidden selection:bg-foreground selection:text-background">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1400px] mx-auto space-y-8"
      >
        {/* Navigation & Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-4">
            <Button
              className="cursor-pointer cursor-pointer"
              variant="ghost"
              size="sm"
              asChild
              className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <Link href="/teams">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Teams
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl md:text-6xl font-medium tracking-tighter text-foreground mb-2 font-sans">
                {team.name}
              </h1>
              <p className="text-muted-foreground text-sm font-sans max-w-2xl">
                {team.description ||
                  "Manage your team operations, workflows, and access controls."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="font-sans uppercase px-4 py-1.5 rounded-full border-foreground/20 bg-background shadow-sm"
            >
              {effectivePlan.charAt(0) + effectivePlan.slice(1).toLowerCase()}{" "}
              Plan
            </Badge>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          {/* Left Column (Stats & Danger Zone) */}
          <div className="lg:col-span-4 space-y-8">
            <GlassContainer className="flex flex-col gap-8 bg-primary text-primary-foreground border-none">
              <div>
                <motion.div
                  className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-black/10 flex items-center justify-center mb-6"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Activity className="w-6 h-6 stroke-[1.5]" />
                </motion.div>
                <h3 className="text-sm font-sans uppercase tracking-widest opacity-70 mb-2">
                  Total Executions
                </h3>
                <p className="text-5xl tracking-tighter font-sans">0</p>
              </div>
              <div className="h-px bg-white/10 dark:bg-black/10 w-full" />
              <div>
                <h3 className="text-sm font-sans uppercase tracking-widest opacity-70 mb-2">
                  Workflows
                </h3>
                <p className="text-4xl tracking-tighter font-sans">
                  {team._count.workflows}
                </p>
              </div>
            </GlassContainer>

            {isOwner && (
              <GlassContainer className="border-destructive/20 bg-destructive/5 text-destructive">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-destructive">
                    <AlertCircle className="w-5 h-5 stroke-[1.5]" />
                    <h3 className="font-sans uppercase tracking-widest text-sm font-semibold">
                      Danger Zone
                    </h3>
                  </div>
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    Permanently delete this team and all of its associated data,
                    workflows, and credentials.
                  </p>
                  <Button
                    variant="destructive"
                    className="cursor-pointer w-full rounded-2xl font-sans uppercase text-xs h-12 shadow-sm"
                    onClick={() => {
                      if (
                        confirm(
                          "Are you incredibly certain? This is completely irreversible.",
                        )
                      ) {
                        deleteTeam.mutate({ id: teamId });
                      }
                    }}
                  >
                    Terminate Team
                  </Button>
                </div>
              </GlassContainer>
            )}
          </div>

          {/* Right Column (Intelligent Team List) */}
          <div className="lg:col-span-8">
            <GlassContainer className="h-full flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
                <div>
                  <h2 className="text-2xl font-medium tracking-tight font-sans mb-1">
                    Access Control
                  </h2>
                  <p className="text-sm text-muted-foreground font-sans opacity-80">
                    {team.members.length} active{" "}
                    {team.members.length === 1 ? "member" : "members"}
                  </p>
                </div>

                {isAdmin && (
                  <div>
                    {isLimitReached ? (
                      <Badge
                        variant="destructive"
                        className="font-sans text-[10px] uppercase px-3 py-1.5 rounded-full flex items-center gap-1.5"
                      >
                        <AlertCircle className="w-3 h-3" />
                        Plan Limit ({maxMembers}/{maxMembers})
                      </Badge>
                    ) : (
                      <Dialog
                        open={isInviteOpen}
                        onOpenChange={setIsInviteOpen}
                      >
                        <DialogTrigger asChild>
                          <motion.button
                            whileHover={{ scale: 0.98 }}
                            whileTap={{ scale: 0.95 }}
                            className="cursor-pointer bg-foreground text-background px-6 h-12 rounded-2xl font-sans uppercase text-xs font-semibold flex items-center gap-2 shadow-sm hover:opacity-90 transition-opacity"
                          >
                            <UserPlus className="w-4 h-4 stroke-[2]" />
                            Invite Member
                          </motion.button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md rounded-[2rem] p-8 border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                          <DialogHeader className="mb-6">
                            <DialogTitle className="text-2xl font-sans tracking-tight text-foreground">
                              Add Team Member
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="space-y-3">
                              <Label className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
                                Email Address
                              </Label>
                              <Input
                                type="email"
                                placeholder="name@company.com"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                className="h-12 rounded-xl border-border/50 bg-muted/50 font-sans text-sm focus-visible:ring-1 focus-visible:ring-foreground"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
                                Access Role
                              </Label>
                              <Select
                                value={inviteRole}
                                onValueChange={(v) => setInviteRole(v as any)}
                              >
                                <SelectTrigger className="h-12 rounded-xl border-border/50 bg-muted/50 font-sans text-sm focus:ring-1 focus:ring-foreground">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border bg-background shadow-xl">
                                  <SelectItem
                                    value="ADMIN"
                                    className="font-sans text-xs cursor-pointer"
                                  >
                                    ADMIN
                                  </SelectItem>
                                  <SelectItem
                                    value="MEMBER"
                                    className="font-sans text-xs cursor-pointer"
                                  >
                                    MEMBER
                                  </SelectItem>
                                  <SelectItem
                                    value="VIEWER"
                                    className="font-sans text-xs cursor-pointer"
                                  >
                                    VIEWER
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              className="cursor-pointer w-full h-12 rounded-xl font-sans uppercase tracking-widest text-xs bg-foreground text-background hover:bg-foreground/90 transition-colors"
                              onClick={() =>
                                inviteMember.mutate({
                                  teamId,
                                  email: inviteEmail,
                                  role: inviteRole,
                                })
                              }
                              disabled={!inviteEmail || inviteMember.isPending}
                            >
                              {inviteMember.isPending
                                ? "Configuring..."
                                : "Send Invitation"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {team.members.map((member) => (
                    <motion.div
                      layout
                      layoutId={member.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={springTransition}
                      key={member.id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-transparent hover:border-border/60 hover:bg-muted/30 transition-all gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 rounded-full border border-border/50 shadow-sm">
                          <AvatarImage src={member.user.image || undefined} />
                          <AvatarFallback className="bg-foreground text-background font-sans text-sm">
                            {member.user.name?.[0] ||
                              member.user.email[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-sans tracking-tight font-semibold text-foreground text-sm">
                            {member.user.name || "Pending User"}
                          </span>
                          <span className="font-sans text-xs text-muted-foreground opacity-80 decoration-muted-foreground decoration-1 underline-offset-4 group-hover:underline">
                            {member.user.email}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isOwner && member.role !== "OWNER" ? (
                          <Select
                            value={member.role}
                            onValueChange={(role) =>
                              updateRole.mutate({
                                teamId,
                                userId: member.user.id,
                                role: role as any,
                              })
                            }
                          >
                            <SelectTrigger className="w-28 h-9 border-none bg-muted/50 hover:bg-muted transition-colors rounded-full font-sans text-xs focus:ring-0 shadow-none text-foreground text-center flex justify-center py-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl font-sans border-border bg-background shadow-xl">
                              <SelectItem
                                value="ADMIN"
                                className="text-xs cursor-pointer"
                              >
                                ADMIN
                              </SelectItem>
                              <SelectItem
                                value="MEMBER"
                                className="text-xs cursor-pointer"
                              >
                                MEMBER
                              </SelectItem>
                              <SelectItem
                                value="VIEWER"
                                className="text-xs cursor-pointer"
                              >
                                VIEWER
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="flex items-center justify-center px-4 h-9 rounded-full bg-muted/30 border border-border/30 text-foreground font-sans text-xs tracking-widest uppercase">
                            {member.role === "OWNER" ? (
                              <span className="flex items-center gap-1.5 relative">
                                <Shield className="w-3 h-3 text-emerald-500" />{" "}
                                OWNER
                              </span>
                            ) : (
                              member.role
                            )}
                          </div>
                        )}

                        {isAdmin && member.role !== "OWNER" && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="cursor-pointer w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            onClick={() => {
                              if (confirm("Remove user from team?")) {
                                removeMember.mutate({
                                  teamId,
                                  userId: member.user.id,
                                });
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 stroke-[1.5]" />
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Pending Invitations */}
                {team.invitations && team.invitations.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border/40">
                    <h3 className="text-xs font-sans uppercase tracking-widest text-muted-foreground mb-4">
                      Pending Invitations ({team.invitations.length})
                    </h3>
                    <div className="flex flex-col gap-2">
                      <AnimatePresence mode="popLayout">
                        {team.invitations.map((inv) => (
                          <motion.div
                            layout
                            layoutId={`inv-${inv.id}`}
                            key={inv.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={springTransition}
                            className="flex items-center justify-between p-4 rounded-2xl border border-dashed border-border/60 bg-muted/20"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-muted/60 border border-border/40 flex items-center justify-center text-muted-foreground">
                                <Mail className="w-4 h-4 stroke-[1.5]" />
                              </div>
                              <div>
                                <p className="text-sm font-sans font-medium text-foreground">
                                  {inv.email}
                                </p>
                                <p className="text-xs text-muted-foreground font-sans">
                                  Invited as {inv.role} · expires{" "}
                                  {new Date(inv.expiresAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            {isAdmin && (
                              <div className="flex items-center gap-1">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="Resend invitation"
                                  className="cursor-pointer w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                                  onClick={() =>
                                    resendInvitation.mutate({
                                      invitationId: inv.id,
                                      teamId,
                                    })
                                  }
                                >
                                  <RefreshCw className="w-4 h-4 stroke-[1.5]" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="Cancel invitation"
                                  className="cursor-pointer w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                  onClick={() =>
                                    cancelInvitation.mutate({
                                      invitationId: inv.id,
                                      teamId,
                                    })
                                  }
                                >
                                  <X className="w-4 h-4 stroke-2" />
                                </motion.button>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
            </GlassContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
