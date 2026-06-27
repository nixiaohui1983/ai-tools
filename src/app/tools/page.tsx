"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon, FunnelIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { api } from "@/lib/api";

const categories = [
  { key: "writing", label: "Writing" },
  { key: "image", label: "Image" },
  { key: "video", label: "Video" },
  { key: "coding", label: "Coding" },
  { key: "marketing", label: "Marketing" },
  { key: "productivity", label: "Productivity" },
  { key: "research", label: "Research" },
  { key: "automation", label: "Automation" },
];

const pricingFilters = [
  { key: "free", label: "Free" },
  { key: "freemium", label: "Freemium" },
  { key: "subscription", label: "Subscription" },
  { key: "paid", label: "Paid" },
];

const sortOptions = [
  { key: "featured", label: "Featured" },
  { key: "rating", label: "Highest Rated" },
  { key: "name", label: "Name A-Z" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
];

interface Tool {
  id: string;
  name: string;
  description: string;
  logo?: string;
  pricing?: string;
  price?: number;
  rating?: number;
  categories: string[];
  featured: boolean;
}

// Mock data for initial display
const mockTools: Tool[] = [
  { id: "1", name: "ChatGPT", description: "AI language model for writing, coding, and more", pricing: "freemium", rating: 4.9, categories: ["writing", "coding"], featured: true },
  { id: "2", name: "Midjourney", description: "AI image generation from text prompts", pricing: "subscription", rating: 4.8, categories: ["image"], featured: true },
  { id: "3", name: "GitHub Copilot", description: "AI-powered code completion and chat", pricing: "subscription", rating: 4.7, categories: ["coding"], featured: false },
  { id: "4", name: "Perplexity", description: "AI search engine with cited sources", pricing: "freemium", rating: 4.6, categories: ["research"], featured: true },
  { id: "5", name: "Jasper", description: "AI writing assistant for marketing teams", pricing: "subscription", rating: 4.5, categories: ["writing", "marketing"], featured: false },
  { id: "6", name: "Runway", description: "AI video editing and generation platform", pricing: "freemium", rating: 4.5, categories: ["video"], featured: true },
  { id: "7", name: "Notion AI", description: "AI-powered workspace and note-taking", pricing: "freemium", rating: 4.4, categories: ["productivity", "writing"], featured: false },
  { id: "8", name: "Claude", description: "Constitutional AI assistant by Anthropic", pricing: "freemium", rating: 4.8, categories: ["writing", "analysis"], featured: true },
];

const pricingColors: Record<string, string> = {
  free: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  freemium: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  subscription: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  paid: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
};

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/tools/${tool.id}`} className="group block">
      <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 card-hover h-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/25">
            {tool.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary dark:text-white group-hover:text-primary-500 transition-colors truncate">
              {tool.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              {tool.rating && (
                <span className="text-xs text-yellow-600 dark:text-yellow-400">
                  ⭐ {tool.rating}
                </span>
              )}
            </div>
          </div>
          {tool.featured && (
            <span className="px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium flex-shrink-0">
              Featured
            </span>
          )}
        </div>

        <p className="text-sm text-text-secondary dark:text-gray-400 mb-3 line-clamp-2 min-h-[2.5rem]">
          {tool.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {tool.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-400 text-xs"
            >
              {categories.find((c) => c.key === cat)?.label || cat}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
              pricingColors[tool.pricing || ""] || pricingColors.freemium
            }`}
          >
            {tool.pricing || "freemium"}
          </span>
          <span className="text-primary-500 text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ToolDirectoryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPricing, setSelectedPricing] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort tools client-side (mock data)
  const filteredTools = useMemo(() => {
    let tools = [...mockTools];

    if (search) {
      const q = search.toLowerCase();
      tools = tools.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.categories.some((c) => c.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      tools = tools.filter((t) => t.categories.includes(selectedCategory));
    }

    if (selectedPricing) {
      tools = tools.filter((t) => t.pricing === selectedPricing);
    }

    // Sort
    switch (sortBy) {
      case "rating":
        tools.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name":
        tools.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default:
        tools.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return tools;
  }, [search, selectedCategory, selectedPricing, sortBy]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedCategory(null);
    setSelectedPricing(null);
    setSortBy("featured");
  }, []);

  const hasActiveFilters = search || selectedCategory || selectedPricing;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary dark:text-white mb-2">
          Tool Directory
        </h1>
        <p className="text-text-secondary dark:text-gray-400">
          Discover and compare {mockTools.length}+ AI tools for every use case
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tools by name, description, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
              showFilters || hasActiveFilters
                ? "border-primary-500 text-primary-500 bg-primary-50 dark:bg-primary-900/20"
                : "border-gray-200 dark:border-gray-700 text-text-secondary dark:text-gray-400 hover:border-primary-300"
            }`}
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
                {(selectedCategory ? 1 : 0) + (selectedPricing ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto">
            <AdjustmentsHorizontalIcon className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              {sortOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-fade-in">
            {/* Category Filter */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-text-primary dark:text-white mb-3">
                Category
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() =>
                      setSelectedCategory((prev) => (prev === cat.key ? null : cat.key))
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedCategory === cat.key
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-gray-200 dark:border-gray-700 text-text-secondary dark:text-gray-400 hover:border-primary-300"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Filter */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary dark:text-white mb-3">
                Pricing
              </h3>
              <div className="flex flex-wrap gap-2">
                {pricingFilters.map((p) => (
                  <button
                    key={p.key}
                    onClick={() =>
                      setSelectedPricing((prev) => (prev === p.key ? null : p.key))
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedPricing === p.key
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-gray-200 dark:border-gray-700 text-text-secondary dark:text-gray-400 hover:border-primary-300"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-secondary dark:text-gray-400">
          Showing <span className="font-semibold text-text-primary dark:text-white">{filteredTools.length}</span> tools
        </p>
      </div>

      {/* Tool Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">
            No tools found
          </h3>
          <p className="text-text-secondary dark:text-gray-400">
            Try adjusting your filters or search query
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
