"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, BookOpen, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SAMPLE_BLOG_POSTS } from "@/constants";
import { formatDate, getInitials } from "@/lib/utils";

const categories = [
  { value: "all", label: "All Posts" },
  { value: "strategy", label: "Strategy" },
  { value: "education", label: "Education" },
  { value: "market_update", label: "Market Updates" },
  { value: "tutorial", label: "Tutorials" },
  { value: "product", label: "Product" },
];

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = SAMPLE_BLOG_POSTS.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = SAMPLE_BLOG_POSTS[0];

  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            The EdgeFinder{" "}
            <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trading strategies, market analysis, and platform updates from
            our team of quantitative traders and analysts.
          </p>
        </div>

        {/* Search & Categories */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={activeCategory === cat.value ? "secondary" : "ghost"}
                size="sm"
                className="text-xs"
                onClick={() => setActiveCategory(cat.value)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {activeCategory === "all" && !search && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Link href={`/blog/${featuredPost.slug}`}>
              <Card className="glass-card-hover overflow-hidden group">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-secondary/20 to-accent/10 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                    <div className="p-8">
                      <Badge variant="secondary" className="mb-4 capitalize text-xs">
                        {featuredPost.category.replace("_", " ")}
                      </Badge>
                      <h2 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-[10px]">
                              {getInitials(featuredPost.author)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{featuredPost.author}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(featuredPost.published_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {featuredPost.read_time} min read
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered
            .slice(activeCategory === "all" && !search ? 1 : 0)
            .map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <Card className="glass-card-hover h-full group">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center rounded-t-xl">
                        <BookOpen className="h-10 w-10 text-muted-foreground/20" />
                      </div>
                      <div className="p-5">
                        <Badge variant="secondary" className="mb-3 capitalize text-[10px]">
                          {post.category.replace("_", " ")}
                        </Badge>
                        <h3 className="text-base font-semibold mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-[8px]">
                                {getInitials(post.author)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">{post.author}</span>
                          </div>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.read_time} min
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No posts found</h3>
            <p className="text-sm text-muted-foreground">
              Try a different search term or category.
            </p>
          </div>
        )}

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-8 sm:p-12 text-center">
              <h3 className="text-2xl font-bold mb-3">
                Get Weekly Trading Insights
              </h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Join 8,000+ traders who receive our weekly newsletter with strategy ideas,
                market analysis, and EdgeFinder tips.
              </p>
              <div className="flex items-center gap-3 max-w-md mx-auto">
                <Input placeholder="Your email address" className="h-11" />
                <Button variant="glow" className="h-11 shrink-0">
                  Subscribe
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                No spam. Unsubscribe anytime.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
