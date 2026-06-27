"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { CalendarIcon, ClockIcon, TagIcon } from "@heroicons/react/24/outline";
import { api } from "@/lib/api";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import type { ArticleDTO } from "@/lib/api";

const categoryColors: Record<string, string> = {
  decision: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  workflow: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  comparison: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  tutorial: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

const categoryLabels: Record<string, string> = {
  decision: "Decision Guide",
  workflow: "Workflow",
  comparison: "Comparison",
  tutorial: "Tutorial",
};

function ArticleCard({ article, featured = false }: { article: ArticleDTO; featured?: boolean }) {
  const category = article.category || "tutorial";
  const excerpt = article.excerpt || article.content?.slice(0, 150) || "";
  const date = article.publishedAt || article.createdAt;
  const readTime = Math.max(1, Math.ceil(excerpt.split(/\s+/).length / 200));

  return (
    <Link href={`/blog/${article.id}`} className="group block">
      <div
        className={`p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 card-hover h-full ${
          featured ? "ring-2 ring-primary-500/20" : ""
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              categoryColors[category] || ""
            }`}
          >
            {categoryLabels[category] || category}
          </span>
          {featured && (
            <span className="px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium">
              Featured
            </span>
          )}
        </div>

        <h3 className="font-semibold text-text-primary dark:text-white group-hover:text-primary-500 transition-colors mb-2 line-clamp-2">
          {article.title}
        </h3>

        <p className="text-sm text-text-secondary dark:text-gray-400 mb-4 line-clamp-3">
          {excerpt}
        </p>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-400"
              >
                {tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-400">
                +{article.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 text-xs text-text-secondary dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            {new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon className="w-3.5 h-3.5" />
            {readTime} min read
          </span>
        </div>
      </div>
    </Link>
  );
}

const categoryTabDefs = [
  { key: "decision", label: "Decision Guides", desc: "Which tool should you choose?" },
  { key: "workflow", label: "Workflow Tutorials", desc: "Step-by-step AI workflows" },
  { key: "comparison", label: "Tool Comparisons", desc: "Head-to-head tool battles" },
  { key: "tutorial", label: "Tutorials", desc: "How to use AI tools effectively" },
];

export default function BlogPage() {
  const { toast } = useToast();
  const [articles, setArticles] = useState<ArticleDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const params: Record<string, string> = {};
        if (activeCategory) params.category = activeCategory;
        const res = await api.articles.list(params);
        setArticles(res.data?.articles || []);
      } catch (err: unknown) {
        toast.error(err?.message || "Failed to load articles");
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [activeCategory, toast]);

  const featured = useMemo(
    () => articles.filter((a) => a.featured),
    [articles]
  );
  const regular = useMemo(
    () => articles.filter((a) => !a.featured),
    [articles]
  );

  // Extract real categories from data
  const categoryTabs = useMemo(() => {
    const catsFromData = new Set(articles.map((a) => a.category).filter(Boolean));
    if (catsFromData.size > 0) {
      return categoryTabDefs.filter((ct) => catsFromData.has(ct.key));
    }
    return categoryTabDefs;
  }, [articles]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium mb-4">
          <TagIcon className="w-4 h-4" />
          Content Hub
        </div>
        <h1 className="text-4xl font-bold text-text-primary dark:text-white mb-4">
          AI Tool Guides &{" "}
          <span className="bg-gradient-to-r from-primary-500 to-accent-400 bg-clip-text text-transparent">
            Workflows
          </span>
        </h1>
        <p className="text-lg text-text-secondary dark:text-gray-400 max-w-2xl mx-auto">
          Decision guides, workflow tutorials, and tool comparisons to help you build the perfect AI stack.
        </p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {categoryTabs.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory((prev) => (prev === cat.key ? null : cat.key))}
            className={`p-4 rounded-2xl border card-hover text-center transition-all ${
              activeCategory === cat.key
                ? "bg-primary-50 dark:bg-primary-900/20 border-primary-500 ring-2 ring-primary-500/20"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            }`}
          >
            <div
              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                categoryColors[cat.key] || ""
              }`}
            >
              {cat.label}
            </div>
            <p className="text-xs text-text-secondary dark:text-gray-400">{cat.desc}</p>
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading ? (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-6">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </div>
        </>
      ) : articles.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <TagIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">
            No articles yet
          </h3>
          <p className="text-text-secondary dark:text-gray-400">
            Check back soon for new AI tool guides and workflows.
          </p>
        </div>
      ) : (
        <div className="animate-fade-in">
          {/* Featured Articles */}
          {featured.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-6">Featured Articles</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featured.map((article) => (
                  <ArticleCard key={article.id} article={article} featured />
                ))}
              </div>
            </div>
          )}

          {/* All Articles */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary dark:text-white mb-6">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regular.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-primary-500/10 via-accent-400/10 to-cyan-500/10 border border-primary-200 dark:border-primary-800 text-center">
        <h3 className="text-xl font-bold text-text-primary dark:text-white mb-2">
          Get AI Tool Insights in Your Inbox
        </h3>
        <p className="text-text-secondary dark:text-gray-400 mb-4 max-w-md mx-auto">
          Weekly curated content on the best AI tools, workflows, and productivity hacks.
        </p>
        <div className="flex items-center gap-2 max-w-sm mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-text-primary dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
          />
          <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-400 text-white text-sm font-medium hover:opacity-90 transition-opacity">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
