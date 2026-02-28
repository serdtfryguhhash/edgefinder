"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Share2, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SAMPLE_BLOG_POSTS } from "@/constants";
import { formatDate, getInitials } from "@/lib/utils";

export default function BlogPostPage() {
  const post = SAMPLE_BLOG_POSTS[0];

  return (
    <div className="py-20">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4 capitalize">
            {post.category.replace("_", " ")}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{getInitials(post.author)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{post.author}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.published_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.read_time} min read
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Cover Image Placeholder */}
        <div className="aspect-video rounded-xl bg-gradient-to-br from-secondary/20 to-accent/10 flex items-center justify-center mb-10 border border-white/5">
          <BookOpen className="h-16 w-16 text-muted-foreground/20" />
        </div>

        {/* Article Content */}
        <div className="prose prose-invert max-w-none">
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              Mean reversion strategies exploit the tendency of asset prices to return to their historical average after periods of extreme movement. This concept, rooted in statistical theory, has been a cornerstone of quantitative trading for decades.
            </p>
            <p>
              In this comprehensive guide, we will walk through the process of building a profitable mean reversion strategy using EdgeFinder&apos;s strategy builder and backtesting engine. We will cover everything from identifying suitable assets to optimizing entry and exit parameters.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Understanding Mean Reversion</h2>
            <p>
              At its core, mean reversion is based on the statistical concept that prices and returns eventually move back toward the mean or average. When an asset&apos;s price deviates significantly from its historical average, mean reversion suggests it will eventually return to that average level.
            </p>
            <p>
              The key challenge for traders is determining when a price move is truly an overextension versus the beginning of a new trend. This is where quantitative analysis and proper backtesting become essential.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Selecting Your Indicators</h2>
            <p>
              For our mean reversion strategy, we will use a combination of Bollinger Bands and RSI. Bollinger Bands help us identify when price is statistically overextended, while RSI confirms whether momentum supports a reversal.
            </p>

            <div className="p-4 rounded-lg bg-primary-800/30 border border-white/5 my-6">
              <h4 className="text-sm font-semibold text-foreground mb-2">Strategy Parameters:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Bollinger Bands: 20-period SMA, 2.0 standard deviations</li>
                <li>RSI: 14-period, oversold at 30, overbought at 70</li>
                <li>Position Size: 5% of portfolio per trade</li>
                <li>Stop Loss: 2x ATR(14)</li>
                <li>Take Profit: 1.5x ATR(14) or middle Bollinger Band</li>
              </ul>
            </div>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Entry and Exit Rules</h2>
            <p>
              The entry signal occurs when price touches the lower Bollinger Band AND RSI drops below 30. This dual confirmation reduces false signals and increases the probability of catching genuine mean reversion opportunities.
            </p>
            <p>
              For exits, we use a dynamic approach: close the position when price returns to the middle Bollinger Band (the 20-period SMA), or when RSI exceeds 70. We also implement ATR-based stop losses to protect against adverse moves.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Backtesting Results</h2>
            <p>
              After backtesting this strategy on S&P 500 stocks over a 5-year period using daily candles, we observed the following results:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
              {[
                { label: "Total Return", value: "+32.4%" },
                { label: "Sharpe Ratio", value: "1.92" },
                { label: "Win Rate", value: "68.7%" },
                { label: "Max Drawdown", value: "-8.3%" },
                { label: "Profit Factor", value: "2.14" },
                { label: "Total Trades", value: "247" },
              ].map((stat) => (
                <div key={stat.label} className="p-3 rounded-lg bg-primary-800/30 border border-white/5 text-center">
                  <p className="text-lg font-bold data-text text-accent">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Key Takeaways</h2>
            <p>
              Mean reversion remains a viable and profitable approach when implemented with proper risk management and systematic backtesting. The key is combining multiple confirmation indicators and maintaining strict discipline in trade execution.
            </p>
            <p>
              Remember: past performance does not guarantee future results. Always start with paper trading and gradually scale into live trading as you build confidence in your strategy.
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mt-8">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <Separator className="my-10" />

        {/* Newsletter CTA */}
        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-bold mb-2">Enjoyed this article?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get weekly trading insights delivered to your inbox.
            </p>
            <div className="flex items-center gap-3 max-w-md mx-auto">
              <Input placeholder="Your email" className="h-10" />
              <Button variant="glow" size="sm">
                Subscribe
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Related Posts */}
        <div className="mt-12">
          <h3 className="text-lg font-bold mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SAMPLE_BLOG_POSTS.slice(1, 3).map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`}>
                <Card className="glass-card-hover h-full">
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="text-[10px] capitalize mb-2">
                      {p.category.replace("_", " ")}
                    </Badge>
                    <h4 className="text-sm font-semibold mb-2 line-clamp-2">{p.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{p.excerpt}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {p.read_time} min read
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
