"use client";

import React, { useState } from "react";
import { User, CreditCard, Bell, Shield, Palette, Loader2, Save, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account, preferences, and billing.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Palette className="h-4 w-4" /> Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" /> Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details and public profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl">MC</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">Change Avatar</Button>
                  <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" defaultValue="Marcus Chen" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="marcus@example.com" className="h-11" disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" placeholder="Tell us about your trading style..." className="h-11" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-primary-800/30 border border-white/5">
                <div>
                  <p className="text-sm font-medium">Referral Code</p>
                  <p className="text-lg font-mono font-bold text-accent mt-1">EF-DEMO01</p>
                </div>
                <Button variant="outline" size="sm">Copy</Button>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} variant="glow" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : saved ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  {saved ? "Saved!" : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Trading Preferences</CardTitle>
              <CardDescription>Set your default markets and timeframes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Market</Label>
                  <Select defaultValue="stocks">
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stocks">Stocks</SelectItem>
                      <SelectItem value="forex">Forex</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                      <SelectItem value="futures">Futures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Timeframe</Label>
                  <Select defaultValue="1d">
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">1 Minute</SelectItem>
                      <SelectItem value="5m">5 Minutes</SelectItem>
                      <SelectItem value="15m">15 Minutes</SelectItem>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="4h">4 Hours</SelectItem>
                      <SelectItem value="1d">Daily</SelectItem>
                      <SelectItem value="1w">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Always use dark theme</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Compact View</p>
                    <p className="text-xs text-muted-foreground">Use condensed tables and lists</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} variant="glow" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Choose what updates you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Backtest Completed", desc: "Get notified when a backtest finishes running", enabled: true },
                { title: "Strategy Cloned", desc: "Someone cloned your public strategy", enabled: true },
                { title: "Leaderboard Updates", desc: "Your strategy rank changed significantly", enabled: true },
                { title: "Weekly Performance Report", desc: "Receive a weekly summary of your portfolio", enabled: false },
                { title: "Product Updates", desc: "New features, indicators, and improvements", enabled: true },
                { title: "Marketing Emails", desc: "Tips, guides, and promotional offers", enabled: false },
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Subscription & Billing</CardTitle>
              <CardDescription>Manage your subscription plan and payment methods.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary-800/30 border border-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">Current Plan</p>
                    <Badge>Free</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 strategies &middot; 5 backtests/day &middot; 2 years data
                  </p>
                </div>
                <Button variant="glow" size="sm">Upgrade Plan</Button>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-3">Payment Method</h4>
                <p className="text-sm text-muted-foreground">
                  No payment method on file. Add one when you upgrade to a paid plan.
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-3 text-destructive flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Danger Zone
                </h4>
                <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                  <div>
                    <p className="text-sm font-medium">Delete Account</p>
                    <p className="text-xs text-muted-foreground">
                      Permanently delete your account and all associated data.
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
