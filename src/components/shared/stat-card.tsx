import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  iconColor = "text-accent",
  iconBgColor = "bg-accent/10",
}: StatCardProps) {
  return (
    <Card className="glass-card-hover">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className={cn("p-2 rounded-lg", iconBgColor)}>
            <Icon className={cn("h-4 w-4", iconColor)} />
          </div>
          {change && trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trend === "up" ? "text-accent" : trend === "down" ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {trend === "up" ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : trend === "down" ? (
                <ArrowDownRight className="h-3 w-3" />
              ) : null}
              {change}
            </div>
          )}
        </div>
        <p className="text-2xl font-bold data-text">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{title}</p>
      </CardContent>
    </Card>
  );
}
