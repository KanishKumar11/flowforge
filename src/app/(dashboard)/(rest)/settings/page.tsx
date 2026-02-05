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
            className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
          >
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        }
      />

      <div className="flex-1 px-8 pb-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px] bg-muted/50 p-1 backdrop-blur-sm border border-border/50 rounded-xl">
              <TabsTrigger
                value="profile"
                className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300"
              >
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300"
              >
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300"
              >
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300"
              >
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="animate-fadeIn">
              <Card className="glass border-white/20 dark:border-white/10 shadow-xl backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your account details and public profile information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Display Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        className="bg-background/50 border-input/50 focus:bg-background transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="bg-background/50 border-input/50 focus:bg-background transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      placeholder="UTC"
                      className="bg-background/50 border-input/50 focus:bg-background transition-all"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your timezone is used for scheduling workflows.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="animate-fadeIn">
              <Card className="glass border-white/20 dark:border-white/10 shadow-xl backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-background/30 border border-border/30 hover:bg-background/50 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base">Workflow Errors</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified immediately when a workflow fails
                      </p>
                    </div>
                    <Switch
                      defaultChecked
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-background/30 border border-border/30 hover:bg-background/50 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base">Execution Completed</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify when long-running executions complete
                      </p>
                    </div>
                    <Switch className="data-[state=checked]:bg-primary" />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-background/30 border border-border/30 hover:bg-background/50 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base">Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a weekly summary of your workflow activity
                      </p>
                    </div>
                    <Switch
                      defaultChecked
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-background/30 border border-border/30 hover:bg-background/50 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base">Product Updates</Label>
                      <p className="text-sm text-muted-foreground">
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
              <Card className="glass border-white/20 dark:border-white/10 shadow-xl backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize the look and feel of the application.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-background/30 border border-border/30 hover:bg-background/50 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4 text-purple-500" />
                        <Label className="text-base">Dark Mode</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Use dark theme for the interface
                      </p>
                    </div>
                    <Switch
                      defaultChecked
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-background/30 border border-border/30 hover:bg-background/50 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base">Reduced Motion</Label>
                      <p className="text-sm text-muted-foreground">
                        Minimize animations throughout the app
                      </p>
                    </div>
                    <Switch className="data-[state=checked]:bg-purple-600" />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-background/30 border border-border/30 hover:bg-background/50 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use smaller spacing in lists and tables
                      </p>
                    </div>
                    <Switch className="data-[state=checked]:bg-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="animate-fadeIn">
              <Card className="glass border-white/20 dark:border-white/10 shadow-xl backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                    Security
                  </CardTitle>
                  <CardDescription>
                    Manage your password and security settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        className="bg-background/50 border-input/50 focus:bg-background transition-all"
                      />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          className="bg-background/50 border-input/50 focus:bg-background transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          className="bg-background/50 border-input/50 focus:bg-background transition-all"
                        />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Update Password
                    </Button>
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">API Keys</h4>
                        <p className="text-sm text-muted-foreground">
                          Manage API keys for external integrations
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-primary/20 hover:bg-primary/5 hover:border-primary/50 transition-colors"
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
