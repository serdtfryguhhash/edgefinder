"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  RefreshCw,
  Loader2,
  AlertTriangle,
  TrendingUp,
  Target,
  Shield,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BriefingPage() {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  const generateBriefing = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategies: [
            { name: "Momentum Alpha v3", market: "stocks", timeframe: "1d" },
            { name: "Mean Reversion Pro", market: "forex", timeframe: "4h" },
            { name: "Crypto Trend Rider", market: "crypto", timeframe: "1h" },
          ],
          markets: ["stocks", "forex", "crypto"],
          date: new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBriefing(data.briefing);
        setGeneratedAt(new Date().toLocaleTimeString());
      } else {
        setError(data.error || "Failed to generate briefing");
      }
    } catch {
      setError("Failed to connect to AI service");
    } finally {
      setLoading(false);
    }
  }, []);

  const sectionIcons: Record<string, React.ReactNode> = {
    "Market Overview": <TrendingUp className="h-4 w-4 text-secondary-400" />,
    "Key Levels": <Target className="h-4 w-4 text-yellow-500" />,
    "Potential Setups": <Eye className="h-4 w-4 text-accent" />,
    "Risk Warnings": <Shield className="h-4 w-4 text-destructive" />,
    "Today": <Sun className="h-4 w-4 text-orange-400" />,
  };

  function getSectionIcon(text: string): React.ReactNode {
    for (const [key, icon] of Object.entries(sectionIcons)) {
      if (text.includes(key)) return icon;
    }
    return <Sun className="h-4 w-4 text-accent" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sun className="h-6 w-6 text-yellow-500" />
            Daily Market Briefing
          </h1>
          <p className="text-muted-foreground">
            AI-generated morning briefing tailored to your active strategies and watched markets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {generatedAt && (
            <span className="text-xs text-muted-foreground">Generated at {generatedAt}</span>
          )}
          <Button
            variant="glow"
            size="sm"
            onClick={generateBriefing}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {briefing ? "Refresh Briefing" : "Generate Briefing"}
          </Button>
        </div>
      </div>

      {/* Active Strategy Context */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground">Analyzing for:</span>
        {["Momentum Alpha v3", "Mean Reversion Pro", "Crypto Trend Rider"].map((name) => (
          <Badge key={name} variant="outline" className="text-[10px]">
            {name}
          </Badge>
        ))}
      </div>

      {error && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">Failed to generate briefing</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!briefing && !loading && !error && (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 mb-4">
              <Sun className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Your Morning Briefing</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              Get an AI-generated market analysis based on your active strategies, watched markets, and key levels to watch today.
            </p>
            <Button variant="glow" size="sm" onClick={generateBriefing}>
              Generate Today&apos;s Briefing
            </Button>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 text-accent animate-spin mb-4" />
            <p className="text-sm text-muted-foreground">Analyzing markets and generating your briefing...</p>
          </CardContent>
        </Card>
      )}

      {briefing && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </CardTitle>
                  <CardDescription>
                    AI-generated analysis for your portfolio
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-[10px]">AI Generated</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert prose-sm max-w-none">
                {briefing.split("\n").map((line, index) => {
                  if (line.startsWith("## ")) {
                    return (
                      <div key={index} className="flex items-center gap-2 mt-6 mb-3 first:mt-0">
                        {getSectionIcon(line)}
                        <h3 className="text-base font-semibold m-0">{line.replace("## ", "")}</h3>
                      </div>
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
