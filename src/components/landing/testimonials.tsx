"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TESTIMONIALS } from "@/constants";
import { getInitials } from "@/lib/utils";

export function Testimonials() {
  return (
    <section className="py-20 lg:py-32 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Trusted by{" "}
            <span className="gradient-text">12,000+ Traders</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            See what professional traders are saying about EdgeFinder.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }, (_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-xs">
                    {getInitials(testimonial.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
