"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  RefreshCw,
  Loader2,
  Calendar,
  AlertTriangle,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ReportsPage() {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  const generateReport = useCallback(async () => {
    setLoading(true);
    setError(null);

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    try {
      const res = await fetch("/api/ai/weekly-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategies: [
            { name: "Momentum Alpha v3", status: "active" },
            { name: "Mean Reversion Pro", status: "active" },
            { name: "Crypto Trend Rider", status: "draft" },
          ],
          backtests: [
            { strategyName: "Momentum Alpha v3", totalReturn: 24.8, sharpeRatio: 1.85, winRate: 62.5 },
            { strategyName: "Mean Reversion Pro", totalReturn: 18.2, sharpeRatio: 2.14, winRate: 71.2 },
          ],
          journalEntries: [
            { emotionalState: "calm", outcome: "win", lessons: "Followed the plan, good execution" },
            { emotionalState: "anxious", outcome: "loss", lessons: "Cut the trade too early out of fear" },
          ],
          weekStart: weekStart.toLocaleDateString(),
          weekEnd: weekEnd.toLocaleDateString(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReport(data.report);
        setGeneratedAt(new Date().toLocaleString());
      } else {
        setError(data.error || "Failed to generate report");
      }
    } catch {
      setError("Failed to connect to AI service");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-secondary-400" />
            Weekly Performance Report
          </h1>
          <p className="text-muted-foreground">
            AI-generated comprehensive weekly analysis of your trading activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {generatedAt && (
            <span className="text-xs text-muted-foreground">Generated {generatedAt}</span>
          )}
          <Button variant="glow" size="sm" onClick={generateReport} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {report ? "Refresh Report" : "Generate Report"}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">Failed to generate report</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!report && !loading && !error && (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 mb-4">
              <FileText className="h-8 w-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Weekly Performance Report</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              Get an AI-generated analysis of your weekly trading activity, including strategy performance, behavioral insights, and actionable recommendations.
            </p>
            <Button variant="glow" size="sm" onClick={generateReport}>
              <FileText className="h-4 w-4 mr-2" />
              Generate This Week&apos;s Report
            </Button>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 text-accent animate-spin mb-4" />
            <p className="text-sm text-muted-foreground">Analyzing your weekly performance...</p>
          </CardContent>
        </Card>
      )}

      {report && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    Weekly Report
                  </CardTitle>
                  <CardDescription>
                    Comprehensive analysis of your trading week
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-[10px]">AI Generated</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert prose-sm max-w-none">
                {report.split("\n").map((line, index) => {
                  if (line.startsWith("## ")) {
                    return (
                      <h3 key={index} className="text-base font-semibold mt-6 mb-3 first:mt-0 text-foreground">
                        {line.replace("## ", "")}
                      </h3>
                    );
                  }
                  if (line.startsWith("### ")) {
                    return (
                      <h4 key={index} className="text-sm font-semibold mt-4 mb-2 text-foreground">
                        {line.replace("### ", "")}
                      </h4>
                    );
                  }
                  if (line.startsWith("- ") || line.startsWith("* ")) {
                    return (
                      <div key={index} className="flex items-start gap-2 ml-1 mb-1.5">
                        <span className="text-accent mt-1.5 text-[6px]">●</span>
                        <p className="text-sm text-muted-foreground m-0 leading-relaxed">
                          {line.replace(/^[-*]\s/, "")}
                        </p>
                      </div>
                    );
                  }
                  if (line.trim() === "") return <div key={index} className="h-2" />;
                  return (
                    <p key={index} className="text-sm text-muted-foreground leading-relaxed mb-2">
                      {line}
                    </p>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
