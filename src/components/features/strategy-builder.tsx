"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Settings2,
  Activity,
  TrendingUp,
  TrendingDown,
  Shield,
  Save,
  Search,
  Plus,
  Trash2,
  Lock,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ALL_INDICATORS, MARKETS, TIMEFRAMES } from "@/constants";

const STORAGE_KEY = "edgefinder_user_strategies";

interface Condition {
  id: string;
  indicator: string;
  operator: string;
  value: string;
  action: string;
}

interface StrategyFormData {
  name: string;
  description: string;
  market: string;
  timeframe: string;
  isPublic: boolean;
  selectedIndicators: string[];
  entryConditions: Condition[];
  exitConditions: Condition[];
  riskManagement: {
    stopLoss: string;
    takeProfit: string;
    positionSize: string;
    maxOpenPositions: string;
    maxDrawdown: string;
  };
}

const OPERATORS = [
  { value: "crosses_above", label: "Crosses Above" },
  { value: "crosses_below", label: "Crosses Below" },
  { value: "greater_than", label: "Greater Than" },
  { value: "less_than", label: "Less Than" },
  { value: "equals", label: "Equals" },
];

const ACTIONS = [
  { value: "buy", label: "BUY" },
  { value: "sell", label: "SELL" },
];

const STEPS = [
  { num: 1, label: "Basic Info", icon: Settings2 },
  { num: 2, label: "Indicators", icon: Activity },
  { num: 3, label: "Entry Conditions", icon: TrendingUp },
  { num: 4, label: "Exit Conditions", icon: TrendingDown },
  { num: 5, label: "Risk Management", icon: Shield },
];

const INDICATOR_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "trend", label: "Trend" },
  { value: "momentum", label: "Momentum" },
  { value: "volatility", label: "Volatility" },
  { value: "volume", label: "Volume" },
  { value: "statistical", label: "Statistical" },
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function createEmptyCondition(): Condition {
  return {
    id: generateId(),
    indicator: "rsi",
    operator: "crosses_below",
    value: "30",
    action: "buy",
  };
}

export function StrategyBuilder() {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [indicatorSearch, setIndicatorSearch] = useState("");
  const [indicatorCategory, setIndicatorCategory] = useState("all");

  const [formData, setFormData] = useState<StrategyFormData>({
    name: "",
    description: "",
    market: "stocks",
    timeframe: "1d",
    isPublic: false,
    selectedIndicators: [],
    entryConditions: [createEmptyCondition()],
    exitConditions: [
      {
        id: generateId(),
        indicator: "rsi",
        operator: "crosses_above",
        value: "70",
        action: "sell",
      },
    ],
    riskManagement: {
      stopLoss: "2.0",
      takeProfit: "6.0",
      positionSize: "5.0",
      maxOpenPositions: "5",
      maxDrawdown: "15",
    },
  });

  const filteredIndicators = useMemo(() => {
    return ALL_INDICATORS.filter((ind) => {
      const matchesSearch =
        !indicatorSearch ||
        ind.name.toLowerCase().includes(indicatorSearch.toLowerCase()) ||
        ind.short_name.toLowerCase().includes(indicatorSearch.toLowerCase());
      const matchesCategory = indicatorCategory === "all" || ind.category === indicatorCategory;
      return matchesSearch && matchesCategory;
    });
  }, [indicatorSearch, indicatorCategory]);

  const toggleIndicator = useCallback(
    (id: string) => {
      setFormData((prev) => ({
        ...prev,
        selectedIndicators: prev.selectedIndicators.includes(id)
          ? prev.selectedIndicators.filter((i) => i !== id)
          : [...prev.selectedIndicators, id],
      }));
    },
    []
  );

  const addCondition = useCallback(
    (type: "entry" | "exit") => {
      const newCondition = createEmptyCondition();
      if (type === "exit") {
        newCondition.operator = "crosses_above";
        newCondition.value = "70";
        newCondition.action = "sell";
      }
      setFormData((prev) => ({
        ...prev,
        [type === "entry" ? "entryConditions" : "exitConditions"]: [
          ...prev[type === "entry" ? "entryConditions" : "exitConditions"],
          newCondition,
        ],
      }));
    },
    []
  );

  const removeCondition = useCallback(
    (type: "entry" | "exit", id: string) => {
      const key = type === "entry" ? "entryConditions" : "exitConditions";
      setFormData((prev) => ({
        ...prev,
        [key]: prev[key].filter((c) => c.id !== id),
      }));
    },
    []
  );

  const updateCondition = useCallback(
    (type: "entry" | "exit", id: string, field: keyof Condition, value: string) => {
      const key = type === "entry" ? "entryConditions" : "exitConditions";
      setFormData((prev) => ({
        ...prev,
        [key]: prev[key].map((c) => (c.id === id ? { ...c, [field]: value } : c)),
      }));
    },
    []
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const newStrategy = {
        id: generateId(),
        ...formData,
        createdAt: new Date().toISOString(),
        status: "draft",
      };
      existing.push(newStrategy);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save strategy:", error);
    } finally {
      setSaving(false);
    }
  };

  const selectedIndicatorObjects = ALL_INDICATORS.filter((ind) =>
    formData.selectedIndicators.includes(ind.id)
  );

  const renderConditionRow = (condition: Condition, type: "entry" | "exit") => (
    <div
      key={condition.id}
      className="flex items-center gap-2 p-3 rounded-lg bg-primary-900/50 border border-white/5 flex-wrap"
    >
      <Badge variant={type === "entry" ? "default" : "destructive"} className="text-[10px] shrink-0">
        IF
      </Badge>
      <Select
        value={condition.indicator}
        onValueChange={(v) => updateCondition(type, condition.id, "indicator", v)}
      >
        <SelectTrigger className="w-36 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(selectedIndicatorObjects.length > 0 ? selectedIndicatorObjects : ALL_INDICATORS.slice(0, 10)).map(
            (ind) => (
              <SelectItem key={ind.id} value={ind.id}>
                {ind.short_name}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
      <Select
        value={condition.operator}
        onValueChange={(v) => updateCondition(type, condition.id, "operator", v)}
      >
        <SelectTrigger className="w-36 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OPERATORS.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        className="w-20 h-8 text-xs font-mono"
        value={condition.value}
        onChange={(e) => updateCondition(type, condition.id, "value", e.target.value)}
      />
      <Badge variant="secondary" className="text-[10px] shrink-0">THEN</Badge>
      <Select
        value={condition.action}
        onValueChange={(v) => updateCondition(type, condition.id, "action", v)}
      >
        <SelectTrigger className="w-24 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ACTIONS.map((a) => (
            <SelectItem key={a.value} value={a.value}>
              {a.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={() => removeCondition(type, condition.id)}
      >
        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Step Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {STEPS.map((s, index) => {
          const StepIcon = s.icon;
          return (
            <React.Fragment key={s.num}>
              <button
                onClick={() => setStep(s.num)}
                className={`flex items-center gap-2 shrink-0 px-3 py-2 rounded-lg transition-colors ${
                  step === s.num
                    ? "bg-accent/10 text-accent"
                    : step > s.num
                    ? "text-foreground hover:bg-white/5"
                    : "text-muted-foreground hover:bg-white/5"
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    step === s.num
                      ? "bg-accent text-accent-foreground"
                      : step > s.num
                      ? "bg-accent/20 text-accent"
                      : "bg-primary-800 text-muted-foreground"
                  }`}
                >
                  {step > s.num ? <Check className="h-3.5 w-3.5" /> : s.num}
                </div>
                <span className="text-xs font-medium hidden sm:inline">{s.label}</span>
              </button>
              {index < STEPS.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-accent" />
              Basic Information
            </CardTitle>
            <CardDescription>Define the core parameters of your trading strategy.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="strategy-name">Strategy Name</Label>
              <Input
                id="strategy-name"
                placeholder="e.g., Momentum Alpha v3"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strategy-desc">Description</Label>
              <Textarea
                id="strategy-desc"
                placeholder="Describe your strategy's approach, entry/exit logic, and market conditions..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Market</Label>
                <Select
                  value={formData.market}
                  onValueChange={(v) => setFormData({ ...formData, market: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MARKETS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.icon} {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timeframe</Label>
                <Select
                  value={formData.timeframe}
                  onValueChange={(v) => setFormData({ ...formData, timeframe: v })}
                >
                  <SelectTrigger>
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
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary-800/30 border border-white/5">
              <div>
                <p className="text-sm font-medium">Public Strategy</p>
                <p className="text-xs text-muted-foreground">Allow other users to view and clone your strategy</p>
              </div>
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Indicators */}
      {step === 2 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" />
              Select Indicators
            </CardTitle>
            <CardDescription>
              Choose the technical indicators for your strategy.{" "}
              <span className="text-accent font-medium">{formData.selectedIndicators.length} selected</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search indicators..."
                value={indicatorSearch}
                onChange={(e) => setIndicatorSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Tabs value={indicatorCategory} onValueChange={setIndicatorCategory}>
              <TabsList className="w-full flex-wrap h-auto gap-1 bg-transparent p-0">
                {INDICATOR_CATEGORIES.map((cat) => (
                  <TabsTrigger
                    key={cat.value}
                    value={cat.value}
                    className="text-xs data-[state=active]:bg-accent/10 data-[state=active]:text-accent"
                  >
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-1">
              {filteredIndicators.map((indicator) => {
                const isSelected = formData.selectedIndicators.includes(indicator.id);
                return (
                  <button
                    key={indicator.id}
                    onClick={() => !indicator.is_premium && toggleIndicator(indicator.id)}
                    disabled={indicator.is_premium}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                      isSelected
                        ? "border-accent/50 bg-accent/5"
                        : indicator.is_premium
                        ? "border-white/5 bg-primary-800/10 opacity-50 cursor-not-allowed"
                        : "border-white/5 bg-primary-800/20 hover:bg-primary-800/40"
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                        isSelected ? "bg-accent/20" : "bg-primary-800/50"
                      }`}
                    >
                      {isSelected ? (
                        <Check className="h-3.5 w-3.5 text-accent" />
                      ) : (
                        <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium truncate">{indicator.name}</span>
                        {indicator.is_premium && (
                          <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">{indicator.short_name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Entry Conditions */}
      {step === 3 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Entry Conditions
            </CardTitle>
            <CardDescription>Define when to enter trades. All conditions must be met (AND logic).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.entryConditions.map((condition) => renderConditionRow(condition, "entry"))}
            <Button variant="outline" size="sm" className="text-xs" onClick={() => addCondition("entry")}>
              <Plus className="h-3 w-3 mr-1" /> Add Entry Condition
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Exit Conditions */}
      {step === 4 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-destructive" />
              Exit Conditions
            </CardTitle>
            <CardDescription>Define when to exit trades. Any condition triggers an exit (OR logic).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.exitConditions.map((condition) => renderConditionRow(condition, "exit"))}
            <Button variant="outline" size="sm" className="text-xs" onClick={() => addCondition("exit")}>
              <Plus className="h-3 w-3 mr-1" /> Add Exit Condition
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Risk Management */}
      {step === 5 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-500" />
              Risk Management
            </CardTitle>
            <CardDescription>Configure position sizing and risk controls to protect your capital.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Stop Loss (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  className="font-mono"
                  value={formData.riskManagement.stopLoss}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      riskManagement: { ...formData.riskManagement, stopLoss: e.target.value },
                    })
                  }
                />
                <p className="text-[10px] text-muted-foreground">Maximum loss per trade</p>
              </div>
              <div className="space-y-2">
                <Label>Take Profit (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  className="font-mono"
                  value={formData.riskManagement.takeProfit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      riskManagement: { ...formData.riskManagement, takeProfit: e.target.value },
                    })
                  }
                />
                <p className="text-[10px] text-muted-foreground">Profit target per trade</p>
              </div>
              <div className="space-y-2">
                <Label>Position Size (%)</Label>
                <Input
                  type="number"
                  step="0.5"
                  className="font-mono"
                  value={formData.riskManagement.positionSize}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      riskManagement: { ...formData.riskManagement, positionSize: e.target.value },
                    })
                  }
                />
                <p className="text-[10px] text-muted-foreground">% of portfolio per trade</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max Open Positions</Label>
                <Input
                  type="number"
                  className="font-mono"
                  value={formData.riskManagement.maxOpenPositions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      riskManagement: { ...formData.riskManagement, maxOpenPositions: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Max Drawdown (%)</Label>
                <Input
                  type="number"
                  className="font-mono"
                  value={formData.riskManagement.maxDrawdown}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      riskManagement: { ...formData.riskManagement, maxDrawdown: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-lg bg-primary-800/30 border border-white/5 space-y-2">
              <h4 className="text-sm font-semibold">Strategy Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Name: </span>
                  <span className="font-medium">{formData.name || "Untitled"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Market: </span>
                  <span className="font-medium capitalize">{formData.market}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Timeframe: </span>
                  <span className="font-medium uppercase">{formData.timeframe}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Indicators: </span>
                  <span className="font-medium">{formData.selectedIndicators.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Entry Rules: </span>
                  <span className="font-medium">{formData.entryConditions.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Exit Rules: </span>
                  <span className="font-medium">{formData.exitConditions.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Risk/Reward: </span>
                  <span className="font-medium">
                    1:{(parseFloat(formData.riskManagement.takeProfit) / parseFloat(formData.riskManagement.stopLoss) || 0).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="flex items-center gap-3">
          {step < 5 ? (
            <Button onClick={() => setStep(step + 1)} variant="default">
              Next Step
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              variant="glow"
              disabled={saving || !formData.name}
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved!
                </>
              ) : saving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Strategy
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
