"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Blocks,
  Zap,
  Activity,
  Trophy,
  Shield,
  Globe,
} from "lucide-react";
import { FEATURES } from "@/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Blocks,
  Zap,
  Activity,
  Trophy,
  Shield,
  Globe,
};

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Find Your Edge</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From strategy creation to performance analysis, EdgeFinder provides the complete
            toolkit for systematic traders.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Activity;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group glass-card-hover p-6"
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-10 mb-4`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
