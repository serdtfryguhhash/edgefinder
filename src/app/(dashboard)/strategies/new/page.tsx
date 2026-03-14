"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Settings2,
  Activity,
  TrendingUp,
  Shield,
  Loader2,
  Save,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { MARKETS, TIMEFRAMES, ALL_INDICATORS } from "@/constants";

export default function NewStrategyPage() {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    market: "stocks",
    timeframe: "1d",
    isPublic: false,
    tags: [] as string[],
  });
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput && formData.tags.length < 10 && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const toggleIndicator = (id: string) => {
    setSelectedIndicators((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/strategies">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create New Strategy</h1>
          <p className="text-muted-foreground">
            Define your strategy parameters and trading rules.
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4">
        {[
          { num: 1, label: "Basics" },
          { num: 2, label: "Indicators" },
          { num: 3, label: "Rules & Risk" },
        ].map((s, index) => (
          <React.Fragment key={s.num}>
            <button
              onClick={() => setStep(s.num)}
              className={`flex items-center gap-2 ${
                step === s.num ? "text-accent" : step > s.num ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  step === s.num
                    ? "bg-accent text-accent-foreground"
                    : step > s.num
                    ? "bg-accent/20 text-accent"
                    : "bg-primary-800 text-muted-foreground"
                }`}
              >
                {s.num}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
            </button>
            {index < 2 && <div className="flex-1 h-px bg-white/10" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Basics */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-accent" />
                Strategy Basics
              </CardTitle>
              <CardDescription>Define the core parameters of your trading strategy.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Strategy Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Momentum Alpha v3"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  Choose a descriptive name that reflects your strategy&apos;s approach.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your strategy's approach, entry/exit logic, and market conditions..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Market</Label>
                  <Select
                    value={formData.market}
                    onValueChange={(value) => setFormData({ ...formData, market: value })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MARKETS.map((market) => (
                        <SelectItem key={market.value} value={market.value}>
                          {market.icon} {market.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Timeframe</Label>
                  <Select
                    value={formData.timeframe}
                    onValueChange={(value) => setFormData({ ...formData, timeframe: value })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEFRAMES.map((tf) => (
                        <SelectItem key={tf.value} value={tf.value}>
                          {tf.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={handleAddTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer group">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 opacity-50 group-hover:opacity-100"
                        >
                          &times;
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-primary-800/30 border border-white/5">
                <div>
                  <p className="text-sm font-medium">Public Strategy</p>
                  <p className="text-xs text-muted-foreground">
                    Allow other users to view and clone your strategy
                  </p>
                </div>
                <Switch
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Indicators */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-accent" />
                Select Indicators
              </CardTitle>
              <CardDescription>
                Choose the technical indicators for your strategy. Selected: {selectedIndicators.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ALL_INDICATORS.map((indicator) => (
                  <button
                    key={indicator.id}
                    onClick={() => toggleIndicator(indicator.id)}
                    className={`flex items-start gap-3 p-4 rounded-lg border transition-all text-left ${
                      selectedIndicators.includes(indicator.id)
                        ? "border-accent/50 bg-accent/5"
                        : "border-white/5 bg-primary-800/20 hover:bg-primary-800/40"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        selectedIndicators.includes(indicator.id) ? "bg-accent/20" : "bg-primary-800/50"
                      }`}
                    >
                      <Activity className={`h-4 w-4 ${selectedIndicators.includes(indicator.id) ? "text-accent" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{indicator.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {indicator.short_name}
                        </span>
                        {indicator.is_premium && (
                          <Badge variant="premium" className="text-[9px]">PRO</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {indicator.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-[9px] capitalize">
                          {indicator.category}
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Rules & Risk */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Entry & Exit Rules
              </CardTitle>
              <CardDescription>Define when to enter and exit trades.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-primary-800/30 border border-white/5">
                <h4 className="text-sm font-semibold text-accent mb-3">Entry Rules</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-900/50 border border-white/5">
                    <Badge variant="default" className="text-[10px]">IF</Badge>
                    <Select defaultValue="rsi">
                      <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rsi">RSI(14)</SelectItem>
                        <SelectItem value="macd">MACD</SelectItem>
                        <SelectItem value="sma">SMA(20)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="crosses_below">
                      <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crosses_above">Crosses Above</SelectItem>
                        <SelectItem value="crosses_below">Crosses Below</SelectItem>
                        <SelectItem value="greater_than">Greater Than</SelectItem>
                        <SelectItem value="less_than">Less Than</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input className="w-20 h-8 text-xs font-mono" defaultValue="30" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Plus className="h-3 w-3 mr-1" /> Add Condition
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary-800/30 border border-white/5">
                <h4 className="text-sm font-semibold text-destructive mb-3">Exit Rules</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-900/50 border border-white/5">
                    <Badge variant="destructive" className="text-[10px]">IF</Badge>
                    <Select defaultValue="rsi">
                      <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rsi">RSI(14)</SelectItem>
                        <SelectItem value="macd">MACD</SelectItem>
                        <SelectItem value="sma">SMA(20)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="crosses_above">
                      <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crosses_above">Crosses Above</SelectItem>
                        <SelectItem value="crosses_below">Crosses Below</SelectItem>
                        <SelectItem value="greater_than">Greater Than</SelectItem>
                        <SelectItem value="less_than">Less Than</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input className="w-20 h-8 text-xs font-mono" defaultValue="70" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Plus className="h-3 w-3 mr-1" /> Add Condition
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-yellow-500" />
                Risk Management
              </CardTitle>
              <CardDescription>Configure position sizing and risk controls.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Position Size Type</Label>
                  <Select defaultValue="percent">
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="percent">% of Portfolio</SelectItem>
                      <SelectItem value="kelly">Kelly Criterion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Position Size Value</Label>
                  <Input className="h-11 font-mono" defaultValue="5" placeholder="%" />
                </div>
                <div className="space-y-2">
                  <Label>Stop Loss Type</Label>
                  <Select defaultValue="atr">
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                      <SelectItem value="percent">Percentage</SelectItem>
                      <SelectItem value="atr">ATR Multiple</SelectItem>
                      <SelectItem value="trailing">Trailing Stop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Stop Loss Value</Label>
                  <Input className="h-11 font-mono" defaultValue="2.0" placeholder="ATR multiplier" />
                </div>
                <div className="space-y-2">
                  <Label>Take Profit Type</Label>
                  <Select defaultValue="risk_reward">
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
                      <SelectItem value="percent">Percentage</SelectItem>
                      <SelectItem value="atr">ATR Multiple</SelectItem>
                      <SelectItem value="risk_reward">Risk:Reward Ratio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Take Profit Value</Label>
                  <Input className="h-11 font-mono" defaultValue="3.0" placeholder="R:R ratio" />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Max Open Positions</Label>
                  <Input className="h-11 font-mono" defaultValue="5" type="number" />
                </div>
                <div className="space-y-2">
                  <Label>Max Daily Trades</Label>
                  <Input className="h-11 font-mono" defaultValue="10" type="number" />
                </div>
                <div className="space-y-2">
                  <Label>Max Drawdown %</Label>
                  <Input className="h-11 font-mono" defaultValue="15" type="number" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-3">
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} variant="default">
              Next Step
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSave} variant="glow" disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Strategy
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
