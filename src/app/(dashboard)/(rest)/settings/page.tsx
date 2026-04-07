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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { Bell, Key, Loader2, Moon, Palette, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Profile fields
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load user data into form
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session?.user]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await authClient.updateUser({
        name,
        image: image || undefined,
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

  return (
    <div className="flex flex-col h-full space-y-6">
      <DashboardHeader
        title="Settings"
        description="Manage your account preferences and application settings"
      />

      <div className="flex-1 px-8 pb-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 lg:w-150 bg-background p-0 border border-border rounded-xl h-auto">
              <TabsTrigger
                value="profile"
                className="gap-2 rounded-xl border-r border-border last:border-r-0 data-[state=active]:bg-foreground data-[state=active]:text-background transition-all duration-300 font-mono uppercase text-xs h-10"
              >
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="gap-2 rounded-xl border-r border-border last:border-r-0 data-[state=active]:bg-foreground data-[state=active]:text-background transition-all duration-300 font-mono uppercase text-xs h-10"
              >
                <Bell className="h-4 w-4" />
                Notify
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="gap-2 rounded-xl border-r border-border last:border-r-0 data-[state=active]:bg-foreground data-[state=active]:text-background transition-all duration-300 font-mono uppercase text-xs h-10"
              >
                <Palette className="h-4 w-4" />
                Theme
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="gap-2 rounded-xl data-[state=active]:bg-foreground data-[state=active]:text-background transition-all duration-300 font-mono uppercase text-xs h-10"
              >
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="animate-fadeIn">
              <Card className="bg-background border-border shadow-none rounded-xl">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-xl font-bold font-mono uppercase text-foreground">
                    Profile Information
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-muted-foreground">
                    Update your account details and public profile information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-foreground font-mono uppercase text-xs"
                      >
                        Display Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isSessionLoading}
                        className="bg-background border-border focus:border-foreground text-foreground font-mono rounded-xl placeholder:text-muted-foreground text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-foreground font-mono uppercase text-xs"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={session?.user?.email || ""}
                        disabled
                        className="bg-background border-border focus:border-foreground text-foreground font-mono rounded-xl placeholder:text-muted-foreground text-xs opacity-60"
                      />
                      <p className="text-xs text-muted-foreground font-mono">
                        Email cannot be changed.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="image"
                      className="text-foreground font-mono uppercase text-xs"
                    >
                      Avatar URL
                    </Label>
                    <Input
                      id="image"
                      placeholder="https://example.com/avatar.png"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      disabled={isSessionLoading}
                      className="bg-background border-border focus:border-foreground text-foreground font-mono rounded-xl placeholder:text-muted-foreground text-xs"
                    />
                  </div>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving || isSessionLoading}
                    className="gap-2 bg-foreground text-background hover:bg-foreground/90 rounded-xl border-0 font-mono uppercase text-xs h-10 px-6"
                  >
                    {isSaving && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Save Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="animate-fadeIn">
              <Card className="bg-background border-border shadow-none rounded-xl">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-xl font-bold font-mono uppercase text-foreground">
                    Notification Preferences
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-muted-foreground">
                    Choose what notifications you want to receive.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="flex items-center justify-between p-4 border border-border bg-secondary">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold font-mono text-foreground">
                        Workflow Errors
                      </Label>
                      <p className="text-xs text-muted-foreground font-mono">
                        Get notified immediately when a workflow fails
                      </p>
                    </div>
                    <Switch
                      defaultChecked
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border bg-secondary">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold font-mono text-foreground">
                        Execution Completed
                      </Label>
                      <p className="text-xs text-muted-foreground font-mono">
                        Notify when long-running executions complete
                      </p>
                    </div>
                    <Switch className="data-[state=checked]:bg-primary" />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border bg-secondary">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold font-mono text-foreground">
                        Weekly Reports
                      </Label>
                      <p className="text-xs text-muted-foreground font-mono">
                        Receive a weekly summary of your workflow activity
                      </p>
                    </div>
                    <Switch
                      defaultChecked
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border bg-secondary/50">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold font-mono text-foreground">
                        Product Updates
                      </Label>
                      <p className="text-xs text-muted-foreground font-mono">
                        News about new features and improvements
                      </p>
                    </div>
                    <Switch className="data-[state=checked]:bg-primary" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="animate-fadeIn">
              <Card className="bg-background border-border shadow-none rounded-xl">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-xl font-bold font-mono uppercase text-foreground">
                    Appearance
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-muted-foreground">
                    Customize the look and feel of the application.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="flex items-center justify-between p-4 border border-border bg-secondary">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4 text-primary" />
                        <Label className="text-base font-bold font-mono text-foreground">
                          Dark Mode
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">
                        Use dark theme for the interface
                      </p>
                    </div>
                    <Switch
                      defaultChecked
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border bg-secondary">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold font-mono text-foreground">
                        Reduced Motion
                      </Label>
                      <p className="text-xs text-muted-foreground font-mono">
                        Minimize animations throughout the app
                      </p>
                    </div>
                    <Switch className="data-[state=checked]:bg-primary" />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border bg-secondary">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold font-mono text-foreground">
                        Compact Mode
                      </Label>
                      <p className="text-xs text-muted-foreground font-mono">
                        Use smaller spacing in lists and tables
                      </p>
                    </div>
                    <Switch className="data-[state=checked]:bg-primary" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="animate-fadeIn">
              <Card className="bg-background border-border shadow-none rounded-xl">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-xl font-bold font-mono uppercase text-foreground">
                    Security
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-muted-foreground">
                    Manage your password and security settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="current-password"
                        className="text-foreground font-mono uppercase text-xs"
                      >
                        Current Password
                      </Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-background border-border focus:border-foreground text-foreground font-mono rounded-xl placeholder:text-muted-foreground text-xs"
                      />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="new-password"
                          className="text-foreground font-mono uppercase text-xs"
                        >
                          New Password
                        </Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-background border-border focus:border-foreground text-foreground font-mono rounded-xl placeholder:text-muted-foreground text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="confirm-password"
                          className="text-foreground font-mono uppercase text-xs"
                        >
                          Confirm Password
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="bg-background border-border focus:border-foreground text-foreground font-mono rounded-xl placeholder:text-muted-foreground text-xs"
                        />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleChangePassword}
                      disabled={
                        isChangingPassword ||
                        !currentPassword ||
                        !newPassword ||
                        !confirmPassword
                      }
                      className="border-border text-foreground hover:bg-foreground hover:text-background rounded-xl font-mono uppercase text-xs h-10"
                    >
                      {isChangingPassword ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Key className="h-4 w-4 mr-2" />
                      )}
                      Update Password
                    </Button>
                  </div>
                  <Separator className="bg-border" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold font-mono text-foreground">
                          Active Sessions
                        </h4>
                        <p className="text-xs text-muted-foreground font-mono">
                          You are currently signed in as{" "}
                          {session?.user?.email || "..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
