"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-20 lg:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/30 via-accent/20 to-secondary/30" />
          <div className="absolute inset-0 noise-bg" />
          
          <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-sm text-accent font-medium">7-day free trial on all plans</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 max-w-3xl mx-auto">
              Stop Guessing.{" "}
              <span className="gradient-text">Start Testing.</span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join 12,000+ traders who use EdgeFinder to validate their strategies
              before risking real capital. Your edge is waiting.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="xl" variant="glow" className="group">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="xl" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
            
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
