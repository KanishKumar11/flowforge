"use client";

import { DashboardHeader } from "@/components/DashboardHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { authClient } from "@/lib/auth-client";
import {
  Bell,
  Key,
  Loader2,
  Moon,
  Sun,
  Monitor,
  Palette,
  Shield,
  User,
  Laptop,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const springTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
} as const;


function GlassContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springTransition}
      className={cn(
        "relative rounded-[2rem] p-8 md:p-10 z-10 transition-all",
        "bg-background border border-border/50",
        "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]",
        "before:absolute before:inset-0 before:rounded-[2rem] before:border before:border-white/10 before:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] before:pointer-events-none",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  const [activeTab, setActiveTab] = useState<
    "profile" | "appearance" | "security" | "notifications"
  >("profile");

  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Profile fields
  const [name, setName] = useState("");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Dummy notification states
  const [notifyErrors, setNotifyErrors] = useState(true);
  const [notifyCompleted, setNotifyCompleted] = useState(false);
  const [notifyWeekly, setNotifyWeekly] = useState(true);
  const [notifyUpdates, setNotifyUpdates] = useState(false);

  // Load user data into form
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
    }
  }, [session?.user]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await authClient.updateUser({
        name,
      });
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setIsChangingPassword(true);
    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
      });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Failed to change password. Check your current password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ] as const;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background selection:bg-foreground selection:text-background">
      <DashboardHeader
        title="Settings"
        description="Manage your account preferences and application settings"
      />

      <div className="flex-1 px-6 md:px-12 pb-16 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-[1400px] mx-auto space-y-12 pt-8"
        >
          {/* Navigation Sidebar / Horizontal Scroll */}
          <div className="flex overflow-x-auto pb-4 gap-2 scrollbar-none border-b border-border/40">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-6 py-3 rounded-t-2xl md:rounded-2xl transition-all cursor-pointer whitespace-nowrap",
                    "font-sans font-medium text-sm border border-transparent",
                    isActive
                      ? "bg-foreground text-background shadow-md"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-border/50",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? "stroke-[2]" : "stroke-[1.5]",
                    )}
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={springTransition}
              className="max-w-4xl"
            >
              {activeTab === "profile" && (
                <div className="grid md:grid-cols-12 gap-8">
                  <div className="md:col-span-4 space-y-6">
                    <div>
                      <h2 className="text-xl font-medium tracking-tight font-sans mb-1 text-foreground">
                        Public Profile
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Update your account details and public information.
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-3xl border border-dashed border-border/60">
                      <Avatar className="h-24 w-24 mb-4 ring-2 ring-background shadow-xl">
                        <AvatarImage src={session?.user?.image || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
                          {session?.user?.name?.charAt(0)?.toUpperCase() ||
                            session?.user?.email?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-xs text-muted-foreground text-center">
                        Avatars are synced securely via your authentication
                        provider.
                      </p>
                    </div>
                  </div>

                  <GlassContainer className="md:col-span-8 flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="name"
                          className="text-muted-foreground text-xs uppercase tracking-widest"
                        >
                          Display Name
                        </Label>
                        <Input
                          id="name"
                          placeholder="Your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={isSessionLoading}
                          className="h-12 rounded-xl bg-muted/20 border-border/50 font-sans focus-visible:ring-1 focus-visible:ring-foreground"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="email"
                          className="text-muted-foreground text-xs uppercase tracking-widest"
                        >
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={session?.user?.email || ""}
                          disabled
                          className="h-12 rounded-xl bg-muted/20 border-border/50 font-sans opacity-60 cursor-not-allowed"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          Logins and email addresses are permanently bound to
                          this account.
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border/40 flex justify-end">
                      <motion.button
                        whileHover={{ scale: 0.98 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleSaveProfile}
                        disabled={isSaving || isSessionLoading}
                        className="bg-foreground text-background px-8 h-11 rounded-full font-sans text-sm font-semibold flex items-center justify-center cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        Save Changes
                      </motion.button>
                    </div>
                  </GlassContainer>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="grid md:grid-cols-12 gap-8">
                  <div className="md:col-span-4 space-y-6">
                    <div>
                      <h2 className="text-xl font-medium tracking-tight font-sans mb-1 text-foreground">
                        Theme Preferences
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Customize the look and feel of the application to match
                        your environment.
                      </p>
                    </div>
                  </div>

                  <GlassContainer className="md:col-span-8 flex flex-col gap-6">
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: "light", label: "Light", icon: Sun },
                        { id: "dark", label: "Dark", icon: Moon },
                        { id: "system", label: "System", icon: Laptop },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id)}
                          className={cn(
                            "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all cursor-pointer gap-4",
                            theme === t.id
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-transparent bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                          )}
                        >
                          <t.icon
                            className={cn(
                              "w-6 h-6",
                              theme === t.id ? "stroke-[2]" : "stroke-[1.5]",
                            )}
                          />
                          <span className="font-sans font-medium text-sm">
                            {t.label}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-4">
                      <Monitor className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-primary font-sans">
                          System Sync
                        </h4>
                        <p className="text-xs text-primary/80 mt-1 leading-relaxed">
                          Selecting 'System' will automatically match the
                          appearance with your OS settings (Windows/macOS dark
                          mode parameters).
                        </p>
                      </div>
                    </div>
                  </GlassContainer>
                </div>
              )}

              {activeTab === "security" && (
                <div className="grid md:grid-cols-12 gap-8">
                  <div className="md:col-span-4 space-y-6">
                    <div>
                      <h2 className="text-xl font-medium tracking-tight font-sans mb-1 text-foreground">
                        Security Settings
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Manage your password, authentication layers, and active
                        sessions securely.
                      </p>
                    </div>
                  </div>

                  <GlassContainer className="md:col-span-8">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="currentPassword"
                          className="text-muted-foreground text-xs uppercase tracking-widest"
                        >
                          Current Password
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="h-12 rounded-xl bg-muted/20 border-border/50 font-sans focus-visible:ring-1 focus-visible:ring-foreground"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-3">
                          <Label
                            htmlFor="newPassword"
                            className="text-muted-foreground text-xs uppercase tracking-widest"
                          >
                            New Password
                          </Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="h-12 rounded-xl bg-muted/20 border-border/50 font-sans focus-visible:ring-1 focus-visible:ring-foreground"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label
                            htmlFor="confirmPassword"
                            className="text-muted-foreground text-xs uppercase tracking-widest"
                          >
                            Confirm Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-12 rounded-xl bg-muted/20 border-border/50 font-sans focus-visible:ring-1 focus-visible:ring-foreground"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border/40 flex justify-end">
                      <motion.button
                        whileHover={{ scale: 0.98 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleChangePassword}
                        disabled={
                          isChangingPassword || !currentPassword || !newPassword
                        }
                        className="bg-foreground text-background px-8 h-11 rounded-full font-sans text-sm font-semibold flex items-center justify-center cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {isChangingPassword ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Key className="w-4 h-4 mr-2 stroke-[2]" />
                        )}
                        Update Password
                      </motion.button>
                    </div>
                  </GlassContainer>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="grid md:grid-cols-12 gap-8">
                  <div className="md:col-span-4 space-y-6">
                    <div>
                      <h2 className="text-xl font-medium tracking-tight font-sans mb-1 text-foreground">
                        Alert Preferences
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Control how and when Flowgent communicates workflow
                        events to you.
                      </p>
                    </div>
                  </div>

                  <GlassContainer className="md:col-span-8 flex flex-col gap-2 p-4 md:p-6 bg-transparent md:bg-background">
                    {[
                      {
                        title: "Workflow Errors",
                        desc: "Get notified immediately when a workflow fails",
                        state: notifyErrors,
                        setter: setNotifyErrors,
                      },
                      {
                        title: "Execution Completed",
                        desc: "Notify when long-running executions successfully finish",
                        state: notifyCompleted,
                        setter: setNotifyCompleted,
                      },
                      {
                        title: "Weekly Reports",
                        desc: "Receive a weekly summary rollup of your workspace activity",
                        state: notifyWeekly,
                        setter: setNotifyWeekly,
                      },
                      {
                        title: "Product Updates",
                        desc: "Important news on platform upgrades and beta features",
                        state: notifyUpdates,
                        setter: setNotifyUpdates,
                      },
                    ].map((item, idx) => (
                      <div
                        key={item.title}
                        className={cn(
                          "group flex items-center justify-between p-5 rounded-2xl transition-all border border-transparent",
                          "hover:bg-muted/40 hover:border-border/50",
                        )}
                      >
                        <div className="space-y-1">
                          <h4 className="font-sans font-medium text-foreground">
                            {item.title}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed max-w-[400px]">
                            {item.desc}
                          </p>
                        </div>
                        <Switch
                          checked={item.state}
                          onCheckedChange={item.setter}
                          className="data-[state=checked]:bg-primary shadow-sm cursor-pointer ml-4"
                        />
                      </div>
                    ))}

                    <div className="px-5 mt-4">
                      <p className="text-xs text-muted-foreground">
                        Changes to notification preferences are saved
                        automatically overriding your browser caches.
                      </p>
                    </div>
                  </GlassContainer>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
