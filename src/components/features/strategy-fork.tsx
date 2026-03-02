"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitFork, Check, ExternalLink, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FORK_STORAGE_KEY = "edgefinder_forks";

interface ForkData {
  id: string;
  originalId: string;
  originalName: string;
  originalAuthor: string;
  forkedName: string;
  forkedAt: string;
}

function getForksFromStorage(): ForkData[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(FORK_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveForkToStorage(fork: ForkData): void {
  if (typeof window === "undefined") return;
  const forks = getForksFromStorage();
  forks.push(fork);
  localStorage.setItem(FORK_STORAGE_KEY, JSON.stringify(forks));
}

export function getForkCount(strategyId: string): number {
  const forks = getForksFromStorage();
  return forks.filter((f) => f.originalId === strategyId).length;
}

interface StrategyForkProps {
  strategyId: string;
  strategyName: string;
  authorName: string;
  forkCount?: number;
  variant?: "button" | "inline";
}

export function StrategyFork({
  strategyId,
  strategyName,
  authorName,
  forkCount = 0,
  variant = "button",
}: StrategyForkProps) {
  const [open, setOpen] = useState(false);
  const [forkedName, setForkedName] = useState(`${strategyName} (Fork)`);
  const [forked, setForked] = useState(false);
  const [localForkCount, setLocalForkCount] = useState(forkCount);

  const handleFork = useCallback(() => {
    const fork: ForkData = {
      id: `fork_${Date.now()}`,
      originalId: strategyId,
      originalName: strategyName,
      originalAuthor: authorName,
      forkedName: forkedName,
      forkedAt: new Date().toISOString(),
    };

    saveForkToStorage(fork);
    setForked(true);
    setLocalForkCount((prev) => prev + 1);

    setTimeout(() => {
      setOpen(false);
      setTimeout(() => setForked(false), 500);
    }, 1500);
  }, [strategyId, strategyName, authorName, forkedName]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "inline" ? (
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <GitFork className="h-3.5 w-3.5" />
            <span>{localForkCount}</span>
          </button>
        ) : (
          <Button variant="outline" size="sm">
            <GitFork className="h-4 w-4 mr-2" />
            Fork Strategy
            {localForkCount > 0 && (
              <Badge variant="secondary" className="ml-2 text-[10px] px-1.5">
                {localForkCount}
              </Badge>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitFork className="h-5 w-5 text-accent" />
            Fork Strategy
          </DialogTitle>
          <DialogDescription>
            Create your own copy of this strategy with full attribution to the original author.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!forked ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 py-2"
            >
              <div className="p-3 rounded-lg bg-primary-800/30 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Forking from</span>
                </div>
                <p className="text-sm font-semibold">{strategyName}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <User className="h-3 w-3" />
                  by {authorName}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fork-name" className="text-sm">
                  New Strategy Name
                </Label>
                <Input
                  id="fork-name"
                  value={forkedName}
                  onChange={(e) => setForkedName(e.target.value)}
                  placeholder="Enter a name for your fork"
                />
              </div>

              <div className="text-xs text-muted-foreground p-2 rounded-md bg-primary-800/20">
                This will create a copy in your strategies with attribution to {authorName} as
                the original author.
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="glow"
                  size="sm"
                  onClick={handleFork}
                  disabled={!forkedName.trim()}
                >
                  <GitFork className="h-4 w-4 mr-2" />
                  Fork Strategy
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-8"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 mb-3">
                <Check className="h-7 w-7 text-accent" />
              </div>
              <p className="text-sm font-semibold">Strategy Forked!</p>
              <p className="text-xs text-muted-foreground mt-1">
                &quot;{forkedName}&quot; added to your strategies
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
