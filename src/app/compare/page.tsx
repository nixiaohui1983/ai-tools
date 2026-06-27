"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  MinusIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

// Mock tools data for selector
const allTools = [
  { id: "1", name: "ChatGPT", pricing: "freemium", rating: 4.9, categories: ["writing", "coding"] },
  { id: "2", name: "Claude", pricing: "freemium", rating: 4.8, categories: ["writing", "analysis"] },
  { id: "3", name: "Midjourney", pricing: "subscription", rating: 4.7, categories: ["image"] },
  { id: "4", name: "GitHub Copilot", pricing: "subscription", rating: 4.6, categories: ["coding"] },
  { id: "5", name: "Perplexity", pricing: "freemium", rating: 4.5, categories: ["research"] },
  { id: "6", name: "Jasper", pricing: "subscription", rating: 4.4, categories: ["writing", "marketing"] },
  { id: "7", name: "Runway", pricing: "freemium", rating: 4.5, categories: ["video"] },
  { id: "8", name: "Notion AI", pricing: "freemium", rating: 4.3, categories: ["productivity", "writing"] },
];

const capabilities = [
  { key: "writing", label: "Writing" },
  { key: "coding", label: "Coding" },
  { key: "image-generation", label: "Image Generation" },
  { key: "video", label: "Video" },
  { key: "automation", label: "Automation" },
  { key: "research", label: "Research" },
  { key: "analysis", label: "Analysis" },
  { key: "translation", label: "Translation" },
  { key: "summarization", label: "Summarization" },
  { key: "seo", label: "SEO" },
];

function CapabilityBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const color =
    pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function RatingStars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) =>
        i <= full ? (
          <StarSolid key={i} className="w-4 h-4 text-yellow-400" />
        ) : (
          <StarIcon key={i} className="w-4 h-4 text-gray-300 dark:text-gray-600" />
        )
      )}
      <span className="ml-1 text-sm font-medium text-text-primary dark:text-white">{rating}</span>
    </div>
  );
}

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [comparison, setComparison] = useState<{ tools: typeof selectedTools; matrix: Record<string, Record<string, number>> } | null>(null);

  const selectedTools = selectedIds
    .map((id) => allTools.find((t) => t.id === id))
    .filter(Boolean);

  const availableTools = allTools.filter(
    (t) =>
      !selectedIds.includes(t.id) &&
      (searchQuery === "" || t.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addTool = useCallback((id: string) => {
    if (selectedIds.length >= 4) return;
    setSelectedIds((prev) => [...prev, id]);
    setSearchQuery("");
    setShowPicker(false);
  }, [selectedIds.length]);

  const removeTool = useCallback((id: string) => {
    setSelectedIds((prev) => prev.filter((tid) => tid !== id));
    setComparison(null);
  }, []);

  const runComparison = () => {
    // Mock comparison data
    const mockComparison: { tools: typeof selectedTools; matrix: Record<string, Record<string, number>> } = {
      tools: selectedTools,
      matrix: {},
    };

    for (const cap of capabilities) {
      mockComparison.matrix[cap.key] = {};
      for (const tool of selectedTools) {
        // Mock: tool has capability if its categories overlap
        const hasCap = tool!.categories.some(
          (c: string) => c === cap.key || (cap.key === "writing" && c === "writing")
        );
        // Add some randomness for demo
        const randomBoost = Math.random() > 0.5;
        mockComparison.matrix[cap.key][tool!.id] = hasCap || randomBoost ? 1 : 0;
      }
    }

    setComparison(mockComparison);
  };

  const getCapabilityScore = (toolId: string, capKey: string): number => {
    if (!comparison) return 0;
    return comparison.matrix[capKey]?.[toolId] || 0;
  };

  const getTotalScore = (toolId: string): number => {
    if (!comparison) return 0;
    let sum = 0;
    let count = 0;
    for (const cap of capabilities) {
      sum += getCapabilityScore(toolId, cap.key);
      count++;
    }
    return count > 0 ? (sum / count) * 100 : 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <Link
        href="/tools"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary-500 mb-6 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Tool Directory
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary dark:text-white mb-2">
          Compare AI Tools
        </h1>
        <p className="text-text-secondary dark:text-gray-400">
          Select 2–4 tools to compare features, pricing, and capabilities side by side.
        </p>
      </div>

      {/* Tool Selector */}
      <div className="mb-8 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-text-primary dark:text-white mb-4">
          Select Tools to Compare
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {/* Selected tools */}
          {selectedTools.map((tool) => (
            <div
              key={tool!.id}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center text-white text-xs font-bold">
                {tool!.name[0]}
              </div>
              <span className="font-medium text-primary-600 dark:text-primary-400 text-sm">
                {tool!.name}
              </span>
              <button
                onClick={() => removeTool(tool!.id)}
                className="ml-1 p-0.5 rounded-md hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
              >
                <XMarkIcon className="w-4 h-4 text-primary-500" />
              </button>
            </div>
          ))}

          {/* Add button */}
          {selectedIds.length < 4 && (
            <div className="relative">
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-text-secondary hover:border-primary-300 hover:text-primary-500 transition-colors text-sm font-medium"
              >
                <PlusIcon className="w-4 h-4" />
                Add Tool
              </button>

              {/* Picker dropdown */}
              {showPicker && (
                <div className="absolute top-full left-0 mt-2 w-72 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <input
                      type="text"
                      placeholder="Search tools..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-text-primary dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {availableTools.length === 0 ? (
                      <div className="p-4 text-center text-sm text-text-secondary">
                        No tools found
                      </div>
                    ) : (
                      availableTools.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => addTool(tool.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center text-white text-sm font-bold">
                            {tool.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-text-primary dark:text-white text-sm truncate">
                              {tool.name}
                            </div>
                            <div className="text-xs text-text-secondary dark:text-gray-400">
                              {tool.categories.join(", ")}
                            </div>
                          </div>
                          <PlusIcon className="w-4 h-4 text-gray-400" />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Compare button */}
        {selectedIds.length >= 2 && (
          <button
            onClick={runComparison}
            className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-400 text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <SparklesIcon className="w-4 h-4" />
            Run Comparison
          </button>
        )}
      </div>

      {/* Comparison Table */}
      {comparison && (
        <div className="space-y-8 animate-fade-in">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedTools.map((tool, idx) => {
              const score = getTotalScore(tool!.id);
              const winner = idx === 0; // Mock: first tool is "recommended"
              return (
                <div
                  key={tool!.id}
                  className={`p-5 rounded-2xl border-2 transition-all ${
                    winner
                      ? "border-primary-500 bg-primary-50/50 dark:bg-primary-900/10"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  }`}
                >
                  {winner && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-500 text-white text-xs font-medium mb-3">
                      <SparklesIcon className="w-3 h-3" />
                      Recommended
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center text-white font-bold">
                      {tool!.name[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary dark:text-white text-sm">
                        {tool!.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <CurrencyDollarIcon className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-text-secondary dark:text-gray-400 capitalize">
                          {tool!.pricing}
                        </span>
                      </div>
                    </div>
                  </div>

                  <RatingStars rating={tool!.rating} />

                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary dark:text-gray-400">
                        Capability Score
                      </span>
                      <span className="font-bold text-primary-500">{Math.round(score)}%</span>
                    </div>
                    <div className="mt-1.5 w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-400"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Comparison Matrix */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary dark:text-white border-r border-gray-200 dark:border-gray-700">
                      Capability
                    </th>
                    {selectedTools.map((tool) => (
                      <th
                        key={tool!.id}
                        className="px-6 py-4 text-center text-sm font-semibold text-text-primary dark:text-white"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span>{tool!.name}</span>
                          <RatingStars rating={tool!.rating} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {capabilities.map((cap, i) => (
                    <tr
                      key={cap.key}
                      className={i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50/50 dark:bg-gray-800/50"}
                    >
                      <td className="px-6 py-3.5 text-sm font-medium text-text-primary dark:text-white border-r border-gray-200 dark:border-gray-700">
                        {cap.label}
                      </td>
                      {selectedTools.map((tool) => {
                        const score = getCapabilityScore(tool!.id, cap.key);
                        return (
                          <td key={tool!.id} className="px-6 py-3.5 text-center">
                            {score > 0 ? (
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30">
                                <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700">
                                <MinusIcon className="w-5 h-5 text-gray-400" />
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Pricing Row */}
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-6 py-3.5 text-sm font-medium text-text-primary dark:text-white border-r border-gray-200 dark:border-gray-700">
                      Pricing
                    </td>
                    {selectedTools.map((tool) => (
                      <td key={tool!.id} className="px-6 py-3.5 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            tool!.pricing === "free"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : tool!.pricing === "freemium"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {tool!.pricing === "free"
                            ? "Free"
                            : tool!.pricing === "freemium"
                            ? "Freemium"
                            : tool!.pricing === "subscription"
                            ? "Paid"
                            : tool!.pricing}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Overall Score Row */}
                  <tr className="bg-primary-50/50 dark:bg-primary-900/10">
                    <td className="px-6 py-4 text-sm font-bold text-text-primary dark:text-white border-r border-gray-200 dark:border-gray-700">
                      Overall Score
                    </td>
                    {selectedTools.map((tool) => {
                      const score = getTotalScore(tool!.id);
                      return (
                        <td key={tool!.id} className="px-6 py-4 text-center">
                          <span className="text-lg font-bold text-primary-500">{Math.round(score)}%</span>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendation */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-primary-500/10 via-accent-400/10 to-cyan-500/10 border border-primary-200 dark:border-primary-800">
            <div className="flex items-center gap-2 mb-3">
              <SparklesIcon className="w-5 h-5 text-primary-500" />
              <h3 className="font-semibold text-text-primary dark:text-white">
                AI Recommendation
              </h3>
            </div>
            <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed">
              Based on the comparison, <strong>{selectedTools[0]?.name}</strong> scores highest for
              overall capability coverage.{" "}
              {selectedTools.length > 1 && (
                <>
                  If budget is a concern, <strong>{selectedTools[1]?.name}</strong> offers great
                  value for money.
                </>
              )}{" "}
              Consider your specific use case and try the workflow builder to see how each tool fits
              into your workflow.
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!comparison && selectedIds.length < 2 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
            <SparklesIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">
            Select at least 2 tools to compare
          </h3>
          <p className="text-text-secondary dark:text-gray-400 max-w-md mx-auto">
            Use the tool selector above to pick the AI tools you want to compare. You can compare up to
            4 tools at once.
          </p>
        </div>
      )}
    </div>
  );
}
