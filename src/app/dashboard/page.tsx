"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookmarkIcon,
  HeartIcon,
  ClockIcon,
  ArrowRightIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid, HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

const savedWorkflows = [
  {
    id: "w1",
    name: "Write SEO Blog in 30 min",
    tools: ["ChatGPT", "Perplexity", "SurferSEO"],
    savedAt: "2026-06-20",
    isFavorite: true,
  },
  {
    id: "w2",
    name: "YouTube Automation System",
    tools: ["ChatGPT", "Midjourney", "CapCut"],
    savedAt: "2026-06-15",
    isFavorite: false,
  },
  {
    id: "w3",
    name: "AI eCommerce Product Generator",
    tools: ["ChatGPT", "Midjourney", "Shopify AI"],
    savedAt: "2026-06-10",
    isFavorite: true,
  },
];

const savedTools = [
  { id: "1", name: "ChatGPT", pricing: "freemium", rating: 4.9, savedAt: "2026-06-18" },
  { id: "2", name: "Claude", pricing: "freemium", rating: 4.8, savedAt: "2026-06-18" },
  { id: "6", name: "Runway", pricing: "freemium", rating: 4.5, savedAt: "2026-06-12" },
];

const recentViews = [
  { id: "t1", type: "tool", name: "Midjourney", viewedAt: "2026-06-25" },
  { id: "t2", type: "workflow", name: "Faceless Channel Setup", viewedAt: "2026-06-24" },
  { id: "t3", type: "article", name: "Best Free AI Tools 2026", viewedAt: "2026-06-23" },
];

const tabs = [
  { key: "workflows", label: "Saved Workflows", count: savedWorkflows.length },
  { key: "tools", label: "Saved Tools", count: savedTools.length },
  { key: "history", label: "Recent Views", count: recentViews.length },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("workflows");
  const [favorites, setFavorites] = useState<Record<string, boolean>>(
    Object.fromEntries(savedWorkflows.map((w) => [w.id, w.isFavorite]))
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary dark:text-white mb-2">
          My Dashboard
        </h1>
        <p className="text-text-secondary dark:text-gray-400">
          Manage your saved workflows, tools, and browsing history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center text-white font-bold text-lg">
                U
              </div>
              <div>
                <h3 className="font-semibold text-text-primary dark:text-white">User</h3>
                <p className="text-xs text-text-secondary dark:text-gray-400">Free Plan</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-center">
                <div className="text-xl font-bold text-primary-500">{savedWorkflows.length}</div>
                <div className="text-xs text-text-secondary dark:text-gray-400">Workflows</div>
              </div>
              <div className="p-3 rounded-xl bg-accent-50 dark:bg-accent-900/20 text-center">
                <div className="text-xl font-bold text-accent-500">{savedTools.length}</div>
                <div className="text-xs text-text-secondary dark:text-gray-400">Tools</div>
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-500"
                      : "text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Saved Workflows */}
          {activeTab === "workflows" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-text-primary dark:text-white">
                  Saved Workflows
                </h2>
                <Link
                  href="/workflow"
                  className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Browse Workflows
                </Link>
              </div>

              {savedWorkflows.length === 0 ? (
                <div className="text-center py-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <BookmarkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-text-primary dark:text-white mb-2">No saved workflows yet</h3>
                  <p className="text-text-secondary dark:text-gray-400 text-sm mb-4">
                    Browse workflows and save the ones you like.
                  </p>
                  <Link
                    href="/workflow"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
                  >
                    Explore Workflows
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedWorkflows.map((wf) => (
                    <div
                      key={wf.id}
                      className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 card-hover"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Link
                              href={`/workflow/${wf.id}`}
                              className="font-semibold text-text-primary dark:text-white hover:text-primary-500 transition-colors"
                            >
                              {wf.name}
                            </Link>
                            {favorites[wf.id] && (
                              <HeartSolid className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {wf.tools.map((tool) => (
                              <span
                                key={tool}
                                className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-400"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-text-secondary dark:text-gray-400">
                            Saved on {new Date(wf.savedAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 ml-4">
                          <button
                            onClick={() => toggleFavorite(wf.id)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title={favorites[wf.id] ? "Remove from favorites" : "Add to favorites"}
                          >
                            {favorites[wf.id] ? (
                              <HeartSolid className="w-5 h-5 text-red-500" />
                            ) : (
                              <HeartIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                          <button
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-red-500"
                            title="Remove"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Saved Tools */}
          {activeTab === "tools" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-text-primary dark:text-white">
                  Saved Tools
                </h2>
                <Link
                  href="/tools"
                  className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Browse Tools
                  </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 card-hover"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {tool.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/tools/${tool.id}`}
                          className="font-medium text-text-primary dark:text-white hover:text-primary-500 transition-colors truncate block"
                        >
                          {tool.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-yellow-600 dark:text-yellow-400">⭐ {tool.rating}</span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs">
                            {tool.pricing}
                          </span>
                        </div>
                      </div>
                      <button
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-red-500"
                        title="Remove from saved"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Views */}
          {activeTab === "history" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-text-primary dark:text-white">
                  Recent Views
                </h2>
                <button className="text-sm text-text-secondary hover:text-red-500 transition-colors">
                  Clear History
                </button>
              </div>

              <div className="space-y-2">
                {recentViews.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {item.type === "tool" && <span className="text-sm">🔧</span>}
                        {item.type === "workflow" && <span className="text-sm">⚡</span>}
                        {item.type === "article" && <span className="text-sm">📄</span>}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-text-primary dark:text-white">{item.name}</span>
                        <p className="text-xs text-text-secondary dark:text-gray-400 capitalize">
                          {item.type} · Viewed {new Date(item.viewedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-text-secondary" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
