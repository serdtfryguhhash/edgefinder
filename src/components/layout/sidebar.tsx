"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitBranch,
  Activity,
  Trophy,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  CreditCard,
  HelpCircle,
  Zap,
  Sun,
  BookOpen,
  Bell,
  Swords,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { XPBar } from "@/components/shared/XPBar";
import { StreakBadge } from "@/components/shared/StreakBadge";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Strategies", href: "/strategies", icon: GitBranch },
  { label: "Indicators", href: "/indicators", icon: Activity },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Briefing", href: "/briefing", icon: Sun },
  { label: "Journal", href: "/journal", icon: BookOpen },
  { label: "Alerts", href: "/alerts", icon: Bell },
  { label: "Challenges", href: "/challenges", icon: Swords },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Referrals", href: "/referrals", icon: Users },
];

const bottomItems = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Billing", href: "/settings#billing", icon: CreditCard },
  { label: "Help & Support", href: "/support", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("edgefinder_alerts");
      if (stored) {
        const alerts = JSON.parse(stored);
        const triggered = alerts.filter((a: { triggered: boolean; enabled: boolean }) => a.triggered && a.enabled).length;
        setAlertCount(triggered);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full flex-col border-r border-white/5 bg-primary-950 transition-all duration-300",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/5">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                <Activity className="h-5 w-5 text-accent" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Edge<span className="text-accent">Finder</span>
              </span>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="mx-auto">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                <Activity className="h-5 w-5 text-accent" />
              </div>
            </Link>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-primary-900 text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>

        {/* XP Bar */}
        <XPBar collapsed={collapsed} />

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const content = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-accent")} />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.label === "Strategies" && (
                  <Badge variant="secondary" className="ml-auto text-[10px] px-1.5">
                    3
                  </Badge>
                )}
                {!collapsed && item.label === "Alerts" && alertCount > 0 && (
                  <Badge variant="destructive" className="ml-auto text-[10px] px-1.5">
                    {alertCount}
                  </Badge>
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{content}</TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return content;
          })}
        </nav>

        {!collapsed && (
          <div className="mx-3 mb-4 p-3 rounded-lg bg-gradient-to-br from-secondary/20 to-accent/10 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Unlock unlimited backtests, 150+ indicators, and priority support.
            </p>
            <Link href="/pricing">
              <Button size="sm" variant="glow" className="w-full text-xs">
                Upgrade Now
              </Button>
            </Link>
          </div>
        )}

        <Separator />

        <div className="px-3 py-2 space-y-1">
          {bottomItems.map((item) => {
            const content = (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{content}</TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return content;
          })}
        </div>

        <Separator />

        <div className="p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">MC</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">Marcus Chen</p>
                  <StreakBadge />
                </div>
                <p className="text-xs text-muted-foreground truncate">Free Plan</p>
              </div>
            )}
            {!collapsed && (
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
