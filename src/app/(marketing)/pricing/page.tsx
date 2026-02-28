"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Star, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PRICING_PLANS } from "@/constants";

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4 px-4 py-1.5">
            <Zap className="h-3 w-3 mr-1" />
            7-day free trial on all paid plans
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Simple, Transparent{" "}
            <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Start free and scale as you grow. All plans include access to our core backtesting engine.
          </p>

          {/* Annual Toggle */}
          <div className="flex items-center justify-center gap-3">
            <Label className={!annual ? "text-foreground" : "text-muted-foreground"}>Monthly</Label>
            <Switch checked={annual} onCheckedChange={setAnnual} />
            <Label className={annual ? "text-foreground" : "text-muted-foreground"}>
              Annual
              <Badge variant="success" className="ml-2 text-[10px]">Save 17%</Badge>
            </Label>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`glass-card relative overflow-hidden h-full ${
                  plan.highlighted ? "ring-2 ring-accent/50 glow-accent" : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-accent-gradient" />
                )}
                <CardHeader className="text-center pb-4">
                  {plan.highlighted && (
                    <Badge variant="success" className="w-fit mx-auto mb-2 text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  {plan.tier === "elite" && (
                    <Badge variant="premium" className="w-fit mx-auto mb-2 text-xs">
                      <Crown className="h-3 w-3 mr-1" />
                      Best Value
                    </Badge>
                  )}
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold data-text">
                      ${annual ? Math.round(plan.price_annual / 12) : plan.price_monthly}
                    </span>
                    {plan.price_monthly > 0 && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                  {annual && plan.price_annual > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ${plan.price_annual}/year (save ${plan.price_monthly * 12 - plan.price_annual})
                    </p>
                  )}
                  {plan.price_monthly === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">Free forever</p>
                  )}
                </CardHeader>
                <CardContent>
                  <Link href={plan.price_monthly === 0 ? "/signup" : "/signup"}>
                    <Button
                      variant={plan.highlighted ? "glow" : "outline"}
                      className="w-full mb-6"
                    >
                      {plan.cta}
                    </Button>
                  </Link>

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I try EdgeFinder for free?",
                a: "Absolutely! Our Free plan gives you access to 3 strategies, 5 backtests per day, and 50+ indicators. No credit card required to get started.",
              },
              {
                q: "What happens after my 7-day trial?",
                a: "After the trial, you'll be charged the plan price unless you cancel. You can cancel anytime from your Settings page with no questions asked.",
              },
              {
                q: "Can I switch plans?",
                a: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated for the remaining billing period. When downgrading, the change takes effect at the end of your current billing cycle.",
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact our support team for a full refund.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, Mastercard, American Express) via Stripe. We also support Apple Pay and Google Pay.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="p-5 rounded-xl border border-white/5 bg-card/50"
              >
                <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                  <HelpCircle className="h-4 w-4 text-accent" />
                  {faq.q}
                </h4>
                <p className="text-sm text-muted-foreground pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
