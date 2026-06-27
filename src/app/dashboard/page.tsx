"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookmarkIcon,
  HeartIcon,
  ClockIcon,
  ArrowRightIcon,
  PlusIcon,
  TrashIcon,
  FaceFrownIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid, HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { api } from "@/lib/api";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { useUserStore } from "@/store";
import type { WorkflowDTO, ToolDTO } from "@/lib/api";

export default function DashboardPage() {
  const { toast } = useToast();
  const { user } = useUserStore();

  const [activeTab, setActiveTab] = useState("workflows");
  const [workflows, setWorkflows] = useState<WorkflowDTO[]>([]);
  const [tools, setTools] = useState<ToolDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [wfRes, toolRes] = await Promise.all([
          api.workflows.list({ limit: 10 }),
          api.tools.list({ limit: 10 }),
        ]);
        setWorkflows(wfRes.data?.workflows || []);
        setTools(toolRes.data?.tools || []);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [toast]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const tabs = [
    { key: "workflows", label: "Saved Workflows", count: workflows.length },
    { key: "tools", label: "Saved Tools", count: tools.length },
    { key: "history", label: "Recent Views", count: 3 },
  ];

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
                {user?.name?.[0] || "U"}
              </div>
              <div>
                <h3 className="font-semibold text-text-primary dark:text-white">
                  {user?.name || "User"}
                </h3>
                <p className="text-xs text-text-secondary dark:text-gray-400">Free Plan</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-center">
                <div className="text-xl font-bold text-primary-500">{workflows.length}</div>
                <div className="text-xs text-text-secondary dark:text-gray-400">Workflows</div>
              </div>
              <div className="p-3 rounded-xl bg-accent-50 dark:bg-accent-900/20 text-center">
                <div className="text-xl font-bold text-accent-500">{tools.length}</div>
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
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
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

                  {workflows.length === 0 ? (
                    <div className="text-center py-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <BookmarkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-semibold text-text-primary dark:text-white mb-2">
                        No saved workflows yet
                      </h3>
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
                      {workflows.map((wf) => (
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
                                {(wf.tools || []).slice(0, 4).map((tool: any) => (
                                  <span
                                    key={typeof tool === "string" ? tool : tool.id || tool.name}
                                    className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-400"
                                  >
                                    {typeof tool === "string" ? tool : tool.name || tool.id}
                                  </span>
                                ))}
                              </div>
                              <p className="text-xs text-text-secondary dark:text-gray-400">
                                {wf.estimatedTime != null
                                  ? `~${wf.estimatedTime} min · $${wf.estimatedCost || 0} est. cost`
                                  : "Custom workflow"}
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

                  {tools.length === 0 ? (
                    <div className="text-center py-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <FaceFrownIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-semibold text-text-primary dark:text-white mb-2">
                        No saved tools yet
                      </h3>
                      <p className="text-text-secondary dark:text-gray-400 text-sm mb-4">
                        Discover and save your favorite AI tools.
                      </p>
                      <Link
                        href="/tools"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
                      >
                        Browse Tools
                        <ArrowRightIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {tools.map((tool) => (
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
                                {tool.rating != null && (
                                  <span className="text-xs text-yellow-600 dark:text-yellow-400">
                                    ⭐ {tool.rating}
                                  </span>
                                )}
                                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs capitalize">
                                  {tool.pricing || "freemium"}
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
                  )}
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
                    {[
                      { id: "t1", type: "tool", name: "Midjourney", viewedAt: new Date() },
                      { id: "t2", type: "workflow", name: "Faceless Channel Setup", viewedAt: new Date() },
                      { id: "t3", type: "article", name: "Best Free AI Tools 2026", viewedAt: new Date() },
                    ].map((item) => (
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
                            <span className="text-sm font-medium text-text-primary dark:text-white">
                              {item.name}
                            </span>
                            <p className="text-xs text-text-secondary dark:text-gray-400 capitalize">
                              {item.type} · Viewed {item.viewedAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <ArrowRightIcon className="w-4 h-4 text-text-secondary" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
