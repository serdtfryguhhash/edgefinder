"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Copy, DollarSign, Gift, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency, getInitials } from "@/lib/utils";

const referralStats = [
  { label: "Total Referrals", value: "12", icon: Users, color: "text-secondary-400", bgColor: "bg-secondary/10" },
  { label: "Converted", value: "8", icon: Check, color: "text-accent", bgColor: "bg-accent/10" },
  { label: "Earnings", value: "$240", icon: DollarSign, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  { label: "Pending", value: "$60", icon: Gift, color: "text-purple-400", bgColor: "bg-purple-500/10" },
];

const referralHistory = [
  { name: "Sarah Mitchell", date: "2024-12-10", status: "completed", reward: 30 },
  { name: "David Park", date: "2024-12-05", status: "completed", reward: 30 },
  { name: "Alex Johnson", date: "2024-11-28", status: "completed", reward: 30 },
  { name: "Lisa Wang", date: "2024-11-20", status: "pending", reward: 30 },
  { name: "Ryan Torres", date: "2024-11-15", status: "completed", reward: 30 },
  { name: "Emily Chen", date: "2024-11-08", status: "pending", reward: 30 },
];

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = "EF-DEMO01";
  const referralLink = `https://edgefinder.io/signup?ref=${referralCode}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Gift className="h-6 w-6 text-purple-400" />
          Referral Program
        </h1>
        <p className="text-muted-foreground">
          Earn $30 for every friend who subscribes. Your friends get 20% off their first month.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {referralStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="glass-card">
              <CardContent className="p-5">
                <div className={`p-2 rounded-lg ${stat.bgColor} w-fit mb-3`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold data-text">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Referral Link */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Your Referral Link</CardTitle>
          <CardDescription>Share this link with friends to earn rewards.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Input
              value={referralLink}
              readOnly
              className="font-mono text-sm flex-1"
            />
            <Button
              onClick={() => handleCopy(referralLink)}
              variant={copied ? "default" : "outline"}
              className="shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary-800/30 border border-white/5 flex-1">
              <p className="text-sm text-muted-foreground">Your Code:</p>
              <p className="text-sm font-bold font-mono text-accent">{referralCode}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleCopy(referralCode)}>
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex-1 gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              Share on Twitter
            </Button>
            <Button variant="outline" className="flex-1 gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              Share on LinkedIn
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How it works */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Share Your Link", desc: "Send your referral link to friends and colleagues who trade." },
              { step: "2", title: "They Subscribe", desc: "When they sign up for a paid plan, they get 20% off their first month." },
              { step: "3", title: "You Earn $30", desc: "You receive $30 credit for each successful referral. Cash out anytime." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Referral History</CardTitle>
          <CardDescription>Track your referrals and earnings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {referralHistory.map((referral, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-[10px]">{getInitials(referral.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{referral.name}</p>
                    <p className="text-xs text-muted-foreground">{referral.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={referral.status === "completed" ? "success" : "warning"} className="text-[10px]">
                    {referral.status}
                  </Badge>
                  <span className="text-sm font-mono font-semibold text-accent">
                    {formatCurrency(referral.reward)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
