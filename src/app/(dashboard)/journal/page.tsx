"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  Brain,
  Loader2,
  Calendar,
  Filter,
  Smile,
  Frown,
  AlertTriangle,
  Meh,
  TrendingUp,
  TrendingDown,
  Minus,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";

const JOURNAL_STORAGE_KEY = "edgefinder_journal";

type EmotionalState = "calm" | "anxious" | "greedy" | "fearful" | "confident" | "frustrated";
type Outcome = "win" | "loss" | "breakeven" | "pending";

interface JournalEntry {
  id: string;
  date: string;
  strategyUsed: string;
  marketConditions: string;
  rationale: string;
  emotionalState: EmotionalState;
  outcome: Outcome;
  pnlPercent: number;
  lessons: string;
  createdAt: string;
}

const emotionConfig: Record<EmotionalState, { icon: React.ElementType; color: string; bg: string }> = {
  calm: { icon: Smile, color: "text-accent", bg: "bg-accent/10" },
  confident: { icon: TrendingUp, color: "text-secondary-400", bg: "bg-secondary/10" },
  anxious: { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  greedy: { icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10" },
  fearful: { icon: Frown, color: "text-destructive", bg: "bg-destructive/10" },
  frustrated: { icon: Meh, color: "text-red-400", bg: "bg-red-400/10" },
};

const outcomeConfig: Record<Outcome, { color: string; icon: React.ElementType }> = {
  win: { color: "text-accent", icon: TrendingUp },
  loss: { color: "text-destructive", icon: TrendingDown },
  breakeven: { color: "text-muted-foreground", icon: Minus },
  pending: { color: "text-yellow-500", icon: Meh },
};

function getEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(JOURNAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: JournalEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filterEmotion, setFilterEmotion] = useState<string>("all");
  const [filterOutcome, setFilterOutcome] = useState<string>("all");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [strategyUsed, setStrategyUsed] = useState("");
  const [marketConditions, setMarketConditions] = useState("");
  const [rationale, setRationale] = useState("");
  const [emotionalState, setEmotionalState] = useState<EmotionalState>("calm");
  const [outcome, setOutcome] = useState<Outcome>("pending");
  const [pnlPercent, setPnlPercent] = useState(0);
  const [lessons, setLessons] = useState("");

  useEffect(() => {
    setEntries(getEntries());
  }, []);

  const handleSubmit = useCallback(() => {
    const newEntry: JournalEntry = {
      id: `journal_${Date.now()}`,
      date,
      strategyUsed,
      marketConditions,
      rationale,
      emotionalState,
      outcome,
      pnlPercent,
      lessons,
      createdAt: new Date().toISOString(),
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    saveEntries(updated);
    setShowForm(false);

    // Reset form
    setDate(new Date().toISOString().split("T")[0]);
    setStrategyUsed("");
    setMarketConditions("");
    setRationale("");
    setEmotionalState("calm");
    setOutcome("pending");
    setPnlPercent(0);
    setLessons("");
  }, [date, strategyUsed, marketConditions, rationale, emotionalState, outcome, pnlPercent, lessons, entries]);

  const analyzeJournal = useCallback(async () => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/ai/journal-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      const data = await res.json();
      if (data.success) {
        setAnalysis(data.analysis);
      }
    } catch {
      setAnalysis("Failed to analyze journal entries. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }, [entries]);

  const filteredEntries = entries.filter((e) => {
    const matchEmotion = filterEmotion === "all" || e.emotionalState === filterEmotion;
    const matchOutcome = filterOutcome === "all" || e.outcome === filterOutcome;
    return matchEmotion && matchOutcome;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-secondary-400" />
            Trading Journal
          </h1>
          <p className="text-muted-foreground">
            Log your trades, track your emotions, and discover behavioral patterns.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {entries.length >= 3 && (
            <Button variant="outline" size="sm" onClick={analyzeJournal} disabled={analyzing}>
              {analyzing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Brain className="h-4 w-4 mr-2" />
              )}
              AI Analysis
            </Button>
          )}
          <Button variant="glow" size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            {showForm ? "Cancel" : "New Entry"}
          </Button>
        </div>
      </div>

      {/* New Entry Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card border-accent/20">
              <CardHeader>
                <CardTitle className="text-lg">New Journal Entry</CardTitle>
                <CardDescription>Record your trade and emotional state</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Date</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Strategy Used</Label>
                    <Select value={strategyUsed} onValueChange={setStrategyUsed}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Momentum Alpha v3">Momentum Alpha v3</SelectItem>
                        <SelectItem value="Mean Reversion Pro">Mean Reversion Pro</SelectItem>
                        <SelectItem value="Crypto Trend Rider">Crypto Trend Rider</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Emotional State</Label>
                    <Select value={emotionalState} onValueChange={(v) => setEmotionalState(v as EmotionalState)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(emotionConfig) as EmotionalState[]).map((em) => (
                          <SelectItem key={em} value={em} className="capitalize">
                            {em}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Outcome</Label>
                    <Select value={outcome} onValueChange={(v) => setOutcome(v as Outcome)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="win">Win</SelectItem>
                        <SelectItem value="loss">Loss</SelectItem>
                        <SelectItem value="breakeven">Breakeven</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Market Conditions</Label>
                  <Input
                    value={marketConditions}
                    onChange={(e) => setMarketConditions(e.target.value)}
                    placeholder="e.g., Trending up, high volatility, range-bound..."
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Trade Rationale</Label>
                  <Textarea
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    placeholder="Why did you enter this trade? What signals did you see?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">P&L (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={pnlPercent}
                    onChange={(e) => setPnlPercent(parseFloat(e.target.value) || 0)}
                    placeholder="0.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Lessons Learned</Label>
                  <Textarea
                    value={lessons}
                    onChange={(e) => setLessons(e.target.value)}
                    placeholder="What did you learn from this trade?"
                    rows={2}
                  />
                </div>

                <div className="flex justify-end">
                  <Button variant="glow" size="sm" onClick={handleSubmit}>
                    Save Entry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Analysis */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="glass-card border-secondary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-secondary-400" />
                    <CardTitle className="text-lg">Behavioral Analysis</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setAnalysis(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {analysis}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      {entries.length > 0 && (
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterEmotion} onValueChange={setFilterEmotion}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Emotion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Emotions</SelectItem>
              {(Object.keys(emotionConfig) as EmotionalState[]).map((em) => (
                <SelectItem key={em} value={em} className="capitalize">
                  {em}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterOutcome} onValueChange={setFilterOutcome}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Outcome" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Outcomes</SelectItem>
              <SelectItem value="win">Win</SelectItem>
              <SelectItem value="loss">Loss</SelectItem>
              <SelectItem value="breakeven">Breakeven</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground ml-auto">
            {filteredEntries.length} entries
          </span>
        </div>
      )}

      {/* Journal Entries */}
      {filteredEntries.length === 0 && !showForm ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 mb-4">
              <BookOpen className="h-8 w-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Start Your Trading Journal</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              Log your trades, emotional states, and lessons learned. After 3 entries, get AI-powered behavioral insights.
            </p>
            <Button variant="glow" size="sm" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Entry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry, index) => {
            const EmotionIcon = emotionConfig[entry.emotionalState].icon;
            const OutcomeIcon = outcomeConfig[entry.outcome].icon;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                <Card className="glass-card-hover">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${emotionConfig[entry.emotionalState].bg}`}>
                        <EmotionIcon className={`h-5 w-5 ${emotionConfig[entry.emotionalState].color}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold">{entry.strategyUsed || "No Strategy"}</span>
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {entry.emotionalState}
                          </Badge>
                          <Badge
                            variant={entry.outcome === "win" ? "success" : entry.outcome === "loss" ? "destructive" : "outline"}
                            className="text-[10px] capitalize gap-1"
                          >
                            <OutcomeIcon className="h-2.5 w-2.5" />
                            {entry.outcome}
                          </Badge>
                          {entry.pnlPercent !== 0 && (
                            <span className={`text-xs font-mono font-semibold ${entry.pnlPercent >= 0 ? "text-accent" : "text-destructive"}`}>
                              {entry.pnlPercent >= 0 ? "+" : ""}{entry.pnlPercent.toFixed(1)}%
                            </span>
                          )}
                        </div>

                        {entry.marketConditions && (
                          <p className="text-xs text-muted-foreground mb-1">
                            Conditions: {entry.marketConditions}
                          </p>
                        )}

                        {entry.rationale && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {entry.rationale}
                          </p>
                        )}

                        {entry.lessons && (
                          <div className="text-xs text-secondary-400 bg-secondary/5 rounded-md px-3 py-2">
                            <span className="font-medium">Lesson:</span> {entry.lessons}
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(entry.date)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
