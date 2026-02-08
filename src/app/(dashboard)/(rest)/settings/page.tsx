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
import { Bell, Key, Loader2, Moon, Palette, Shield, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success("Settings saved successfully");
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <DashboardHeader
        title="Settings"
        description="Manage your account preferences and application settings"
        action={
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2 bg-(--arch-fg) text-(--arch-bg) hover:bg-[rgba(var(--arch-fg-rgb)/0.9)] rounded-none border-0 font-mono uppercase text-xs h-10 px-6 shadow-[0_0_15px_rgba(var(--arch-fg-rgb),0.3)]"
          >
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        }
      />

      <div className="flex-1 px-8 pb-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px] bg-(--arch-bg) p-0 border border-(--arch-border) rounded-none h-auto">
              <TabsTrigger
                value="profile"
                className="gap-2 rounded-none border-r border-(--arch-border) last:border-r-0 data-[state=active]:bg-(--arch-fg) data-[state=active]:text-(--arch-bg) transition-all duration-300 font-mono uppercase text-xs h-10"
              >
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="gap-2 rounded-none border-r border-(--arch-border) last:border-r-0 data-[state=active]:bg-(--arch-fg) data-[state=active]:text-(--arch-bg) transition-all duration-300 font-mono uppercase text-xs h-10"
              >
                <Bell className="h-4 w-4" />
                Notify
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="gap-2 rounded-none border-r border-(--arch-border) last:border-r-0 data-[state=active]:bg-(--arch-fg) data-[state=active]:text-(--arch-bg) transition-all duration-300 font-mono uppercase text-xs h-10"
              >
                <Palette className="h-4 w-4" />
                Theme
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="gap-2 rounded-none data-[state=active]:bg-(--arch-fg) data-[state=active]:text-(--arch-bg) transition-all duration-300 font-mono uppercase text-xs h-10"
              >
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="animate-fadeIn">
              <Card className="bg-(--arch-bg) border-(--arch-border) shadow-none rounded-none">
                <CardHeader className="border-b border-(--arch-border)">
                  <CardTitle className="text-xl font-bold font-mono uppercase text-(--arch-fg)">
                    Profile Information
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-(--arch-muted)">
                    Update your account details and public profile information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-(--arch-fg) font-mono uppercase text-xs">Display Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-(--arch-fg) font-mono uppercase text-xs">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-(--arch-fg) font-mono uppercase text-xs">Timezone</Label>
                    <Input
                      id="timezone"
                      placeholder="UTC"
                      className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs"
                    />
                    <p className="text-xs text-(--arch-muted) font-mono">
                      Your timezone is used for scheduling workflows.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="animate-fadeIn">
              <Card className="bg-(--arch-bg) border-(--arch-border) shadow-none rounded-none">
                <CardHeader className="border-b border-(--arch-border)">
                  <CardTitle className="text-xl font-bold font-mono uppercase text-(--arch-fg)">
                    Notification Preferences
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-(--arch-muted)">
                    Choose what notifications you want to receive.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="flex items-center justify-between p-4 border border-(--arch-border) bg-[rgba(var(--arch-bg-secondary-rgb)/0.5)]">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold font-mono text-(--arch-fg)">Workflow Errors</Label>
                      <p className="text-xs text-(--arch-muted) font-mono">
                        Get notified immediately when a workflow fails
                      </p>
                    </div>
                    <Switch
                      defaultChecked
                      className="data-[state=checked]:bg-(--arch-accent)"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-(--arch-border) bg-[rgba(var(--arch-bg-secondary-rgb)/0.5)]">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold font-mono text-(--arch-fg)">Execution Completed</Label>
                      <p className="text-xs text-(--arch-muted) font-mono">
                        Notify when long-running executions complete
                      </p>
                    </div>
                    <Switch className="data-[state=checked]:bg-(--arch-accent)" />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-(--arch-border) bg-[rgba(var(--arch-bg-secondary-rgb)/0.5)]">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold font-mono text-(--arch-fg)">Weekly Reports</Label>
                      <p className="text-xs text-(--arch-muted) font-mono">
                        Receive a weekly summary of your workflow activity
                      </p>
                    </div>
                    <Switch
                      defaultChecked
                      className="data-[state=checked]:bg-(--arch-accent)"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-(--arch-border) bg-[rgba(var(--arch-bg-secondary-rgb)/0.5)]ndary-rgb)/0.5)]">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold font-mono text-(--arch-fg)">Product Updates</Label>
                      <p className="text-xs text-(--arch-muted) font-mono">
                        News about new features and improvements
                      </p>
                    </div>
                    <Switch className="data-[state=checked]:bg-(--arch-accent)" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="animate-fadeIn">
              <Card className="bg-(--arch-bg) border-(--arch-border) shadow-none rounded-none">
                <CardHeader className="border-b border-(--arch-border)">
                  <CardTitle className="text-xl font-bold font-mono uppercase text-(--arch-fg)">
                    Appearance
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-(--arch-muted)">
                    Customize the look and feel of the application.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="flex items-center justify-between p-4 border border-(--arch-border) bg-[rgba(var(--arch-bg-secondary-rgb)/0.5)]">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4 text-(--arch-accent)" />
                        <Label className="text-base font-bold font-mono text-(--arch-fg)">Dark Mode</Label>
                      </div>
                      <p className="text-xs text-(--arch-muted) font-mono">
                        Use dark theme for the interface
                      </p>
                    </div>
                    <Switch
                      defaultChecked
                      className="data-[state=checked]:bg-(--arch-accent)"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-(--arch-border) bg-[rgba(var(--arch-bg-secondary-rgb)/0.5)]">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold font-mono text-(--arch-fg)">Reduced Motion</Label>
                      <p className="text-xs text-(--arch-muted) font-mono">
                        Minimize animations throughout the app
                      </p>
                    </div>
                    <Switch className="data-[state=checked]:bg-(--arch-accent)" />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-(--arch-border) bg-[rgba(var(--arch-bg-secondary-rgb)/0.5)]">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold font-mono text-(--arch-fg)">Compact Mode</Label>
                      <p className="text-xs text-(--arch-muted) font-mono">
                        Use smaller spacing in lists and tables
                      </p>
                    </div>
                    <Switch className="data-[state=checked]:bg-(--arch-accent)" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="animate-fadeIn">
              <Card className="bg-(--arch-bg) border-(--arch-border) shadow-none rounded-none">
                <CardHeader className="border-b border-(--arch-border)">
                  <CardTitle className="text-xl font-bold font-mono uppercase text-(--arch-fg)">
                    Security
                  </CardTitle>
                  <CardDescription className="font-mono text-xs text-(--arch-muted)">
                    Manage your password and security settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className="text-(--arch-fg) font-mono uppercase text-xs">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs"
                      />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="new-password" className="text-(--arch-fg) font-mono uppercase text-xs">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-(--arch-fg) font-mono uppercase text-xs">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          className="bg-(--arch-bg) border-(--arch-border) focus:border-(--arch-fg) text-(--arch-fg) font-mono rounded-none placeholder:text-(--arch-muted) text-xs"
                        />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="border-(--arch-border) text-(--arch-fg) hover:bg-(--arch-fg) hover:text-(--arch-bg) rounded-none font-mono uppercase text-xs h-10"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Update Password
                    </Button>
                  </div>
                  <Separator className="bg-(--arch-border)" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold font-mono text-(--arch-fg)">API Keys</h4>
                        <p className="text-xs text-(--arch-muted) font-mono">
                          Manage API keys for external integrations
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-(--arch-border) text-(--arch-fg) hover:bg-(--arch-fg) hover:text-(--arch-bg) rounded-none font-mono uppercase text-xs h-10"
                      >
                        Manage API Keys
                      </Button>
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
