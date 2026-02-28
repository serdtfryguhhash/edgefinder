"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Activity,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANDING_NAV_ITEMS } from "@/constants";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                <Activity className="h-5 w-5 text-accent" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Edge<span className="text-accent">Finder</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {LANDING_NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Resources
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="glow" size="sm">
                Start Free Trial
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              {LANDING_NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 space-y-2 border-t border-white/5">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup" className="block">
                  <Button variant="glow" className="w-full" size="sm">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
