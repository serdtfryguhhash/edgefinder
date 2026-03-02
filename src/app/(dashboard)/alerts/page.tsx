"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Plus,
  Trash2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Shield,
  Zap,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALERTS_STORAGE_KEY = "edgefinder_alerts";

type AlertMetric = "sharpe_ratio" | "max_drawdown" | "win_rate" | "total_return" | "profit_factor";
type AlertCondition = "greater_than" | "less_than";

interface StrategyAlert {
  id: string;
  strategyName: string;
  metric: AlertMetric;
  condition: AlertCondition;
  value: number;
  enabled: boolean;
  triggered: boolean;
  createdAt: string;
  triggeredAt: string | null;
}

const metricLabels: Record<AlertMetric, string> = {
  sharpe_ratio: "Sharpe Ratio",
  max_drawdown: "Max Drawdown (%)",
  win_rate: "Win Rate (%)",
  total_return: "Total Return (%)",
  profit_factor: "Profit Factor",
};

const metricIcons: Record<AlertMetric, React.ElementType> = {
  sharpe_ratio: Zap,
  max_drawdown: Shield,
  win_rate: TrendingUp,
  total_return: TrendingUp,
  profit_factor: TrendingUp,
};

function getAlerts(): StrategyAlert[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(ALERTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveAlerts(alerts: StrategyAlert[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<StrategyAlert[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [strategyName, setStrategyName] = useState("Momentum Alpha v3");
  const [metric, setMetric] = useState<AlertMetric>("sharpe_ratio");
  const [condition, setCondition] = useState<AlertCondition>("greater_than");
  const [value, setValue] = useState(2);

  useEffect(() => {
    setAlerts(getAlerts());
  }, []);

  const triggeredCount = alerts.filter((a) => a.triggered && a.enabled).length;

  const handleCreate = useCallback(() => {
    const newAlert: StrategyAlert = {
      id: `alert_${Date.now()}`,
      strategyName,
      metric,
      condition,
      value,
      enabled: true,
      triggered: false,
      createdAt: new Date().toISOString(),
      triggeredAt: null,
    };

    const updated = [newAlert, ...alerts];
    setAlerts(updated);
    saveAlerts(updated);
    setShowForm(false);
  }, [strategyName, metric, condition, value, alerts]);

  const toggleAlert = useCallback((id: string) => {
    const updated = alerts.map((a) =>
      a.id === id ? { ...a, enabled: !a.enabled } : a
    );
    setAlerts(updated);
    saveAlerts(updated);
  }, [alerts]);

  const deleteAlert = useCallback((id: string) => {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    saveAlerts(updated);
  }, [alerts]);

  const simulateTrigger = useCallback((id: string) => {
    const updated = alerts.map((a) =>
      a.id === id ? { ...a, triggered: true, triggeredAt: new Date().toISOString() } : a
    );
    setAlerts(updated);
    saveAlerts(updated);
  }, [alerts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 text-yellow-500" />
            Strategy Alerts
            {triggeredCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {triggeredCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Set alerts on your strategy metrics and get notified when conditions are met.
          </p>
        </div>
        <Button variant="glow" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {showForm ? "Cancel" : "New Alert"}
        </Button>
      </div>

      {/* Create Alert Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-lg">Create Alert</CardTitle>
                <CardDescription>Define conditions to monitor on your strategies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Strategy</Label>
                    <Select value={strategyName} onValueChange={setStrategyName}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Momentum Alpha v3">Momentum Alpha v3</SelectItem>
                        <SelectItem value="Mean Reversion Pro">Mean Reversion Pro</SelectItem>
                        <SelectItem value="Crypto Trend Rider">Crypto Trend Rider</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Metric</Label>
                    <Select value={metric} onValueChange={(v) => setMetric(v as AlertMetric)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.entries(metricLabels) as [AlertMetric, string][]).map(([k, v]) => (
                          <SelectItem key={k} value={k}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Condition</Label>
                    <Select value={condition} onValueChange={(v) => setCondition(v as AlertCondition)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="greater_than">Greater than</SelectItem>
                        <SelectItem value="less_than">Less than</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Value</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={value}
                      onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-primary-800/30 border border-white/5 text-sm">
                  Alert when <span className="font-semibold text-accent">{strategyName}</span>
                  {" "}{metricLabels[metric].toLowerCase()} is{" "}
                  <span className="font-semibold">{condition === "greater_than" ? "greater than" : "less than"}</span>{" "}
                  <span className="font-mono font-semibold text-yellow-500">{value}</span>
                </div>

                <div className="flex justify-end">
                  <Button variant="glow" size="sm" onClick={handleCreate}>
                    <Bell className="h-4 w-4 mr-2" />
                    Create Alert
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts List */}
      {alerts.length === 0 && !showForm ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 mb-4">
              <Bell className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Alerts Set</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              Create alerts to monitor your strategy metrics. Get notified when Sharpe ratio, drawdown, win rate, or other metrics cross your thresholds.
            </p>
            <Button variant="glow" size="sm" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Alert
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, index) => {
            const MetricIcon = metricIcons[alert.metric];

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                <Card className={`glass-card-hover ${alert.triggered ? "border-yellow-500/30" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${alert.triggered ? "bg-yellow-500/10" : "bg-primary-800/50"}`}>
                        {alert.triggered ? (
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <MetricIcon className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold">{alert.strategyName}</span>
                          {alert.triggered && (
                            <Badge variant="warning" className="text-[10px]">Triggered</Badge>
                          )}
                          {!alert.enabled && (
                            <Badge variant="outline" className="text-[10px]">Paused</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {metricLabels[alert.metric]}{" "}
                          {alert.condition === "greater_than" ? ">" : "<"}{" "}
                          <span className="font-mono font-semibold text-foreground">{alert.value}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {!alert.triggered && alert.enabled && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => simulateTrigger(alert.id)}
                          >
                            Test
                          </Button>
                        )}
                        <button
                          onClick={() => toggleAlert(alert.id)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {alert.enabled ? (
                            <ToggleRight className="h-6 w-6 text-accent" />
                          ) : (
                            <ToggleLeft className="h-6 w-6" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteAlert(alert.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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
