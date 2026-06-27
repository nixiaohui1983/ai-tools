"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
  CheckIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import { api } from "@/lib/api";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { useCompareStore } from "@/store";
import type { ToolDTO } from "@/lib/api";

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

const pricingColors: Record<string, string> = {
  free: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  freemium: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  subscription: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  paid: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
};

function ToolCard({ tool }: { tool: ToolDTO }) {
  const { toolIds, toggleTool } = useCompareStore();
  const isSelected = toolIds.includes(tool.id);

  return (
    <div className="group relative p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 card-hover h-full">
      {/* Compare button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleTool(tool.id);
        }}
        className={`absolute top-3 right-3 p-1.5 rounded-lg transition-all z-10 ${
          isSelected
            ? "bg-primary-500 text-white shadow-md"
            : "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-primary-500 opacity-0 group-hover:opacity-100"
        }`}
        title={isSelected ? "Remove from compare" : "Add to compare"}
      >
        {isSelected ? (
          <CheckIcon className="w-4 h-4" />
        ) : (
          <PlusIcon className="w-4 h-4" />
        )}
      </button>

      <Link href={`/tools/${tool.id}`} className="block">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/25">
            {tool.name[0]}
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <h3 className="font-semibold text-text-primary dark:text-white group-hover:text-primary-500 transition-colors truncate">
              {tool.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              {tool.rating != null && (
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
      </Link>
    </div>
  );
}

export default function ToolDirectoryPage() {
  const { toast } = useToast();
  const { toolIds, clearAll } = useCompareStore();

  const [tools, setTools] = useState<ToolDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPricing, setSelectedPricing] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch tools from API
  useEffect(() => {
    async function fetchTools() {
      try {
        setLoading(true);
        const res = await api.tools.list();
        setTools(res.data?.tools || []);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to load tools");
      } finally {
        setLoading(false);
      }
    }
    fetchTools();
  }, [toast]);

  // Filter and sort tools client-side
  const filteredTools = useMemo(() => {
    let result = [...tools];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.categories.some((c) => c.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      result = result.filter((t) => t.categories.includes(selectedCategory));
    }

    if (selectedPricing) {
      result = result.filter((t) => t.pricing === selectedPricing);
    }

    switch (sortBy) {
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [tools, search, selectedCategory, selectedPricing, sortBy]);

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
          Discover and compare {tools.length}+ AI tools for every use case
        </p>
      </div>

      {/* Compare bar */}
      {toolIds.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <ScaleIcon className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              {toolIds.length} tool{toolIds.length > 1 ? "s" : ""} selected for comparison
              {toolIds.length >= 4 ? " (max 4)" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearAll}
              className="text-xs text-text-secondary dark:text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
            <Link
              href={`/compare?tools=${toolIds.join(",")}`}
              className="px-4 py-1.5 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
            >
              Compare
            </Link>
          </div>
        </div>
      )}

      {/* Search + Filter Bar */}
      <div className="flex flex-col gap-4 mb-8">
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

        {showFilters && (
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-fade-in">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-text-primary dark:text-white mb-3">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory((prev) => (prev === cat.key ? null : cat.key))}
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

            <div>
              <h3 className="text-sm font-semibold text-text-primary dark:text-white mb-3">Pricing</h3>
              <div className="flex flex-wrap gap-2">
                {pricingFilters.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setSelectedPricing((prev) => (prev === p.key ? null : p.key))}
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
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
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
