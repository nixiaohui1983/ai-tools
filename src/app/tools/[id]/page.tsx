"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  StarIcon,
  GlobeAltIcon,
  SparklesIcon,
  FaceFrownIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { api } from "@/lib/api";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import type { ToolDTO } from "@/lib/api";

interface ToolRelation {
  id?: string;
  name?: string;
  pricing?: string;
  sourceId?: string;
  toolId?: string;
  tool?: { name?: string; pricing?: string };
}

interface ToolCapability {
  id?: string;
  name?: string;
}

interface WorkflowSummary {
  id: string;
  name: string;
  tools?: ToolSummary[];
}

interface ToolSummary {
  id?: string;
  name?: string;
}

const categories = [
  "Writing", "Image", "Video", "Coding", "Marketing", "Productivity", "Research", "Automation",
];

const pricingLabels: Record<string, string> = {
  free: "Free",
  freemium: "Freemium",
  subscription: "Subscription",
  paid: "Paid",
};

const pricingColors: Record<string, string> = {
  free: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  freemium: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  subscription: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  paid: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

function RatingStars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) =>
        i <= full ? (
          <StarSolid key={i} className="w-5 h-5 text-yellow-400" />
        ) : i === full + 1 && hasHalf ? (
          <div key={i} className="relative w-5 h-5">
            <StarIcon className="w-5 h-5 text-yellow-400 absolute" />
            <div className="w-1/2 overflow-hidden">
              <StarSolid className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
        ) : (
          <StarIcon key={i} className="w-5 h-5 text-gray-300 dark:text-gray-600" />
        )
      )}
      <span className="ml-1 font-semibold text-text-primary dark:text-white">{rating}</span>
    </div>
  );
}

export default function ToolDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [tool, setTool] = useState<(ToolDTO & { relationsAsSource?: ToolRelation[]; relationsAsTarget?: ToolRelation[]; workflows?: WorkflowSummary[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    async function fetchTool() {
      try {
        setLoading(true);
        const res = await api.tools.get(params.id);
        if (!res.data) {
          setNotFoundError(true);
          return;
        }
        setTool(res.data);
      } catch (err: unknown) {
        if (err?.message?.includes("404") || err?.message?.includes("not found")) {
          setNotFoundError(true);
        } else {
          toast.error(err?.message || "Failed to load tool details");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchTool();
  }, [params.id, toast]);

  if (notFoundError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <FaceFrownIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-text-primary dark:text-white mb-2">Tool not found</h2>
        <p className="text-text-secondary dark:text-gray-400 mb-6">
          The tool you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Tools
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="w-32 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <div className="space-y-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!tool) return null;

  // Extract alternatives from relationsAsTarget (tools that are alternatives to this one)
  const alternatives = (tool.relationsAsTarget || []).map((r: ToolRelation) => ({
    id: r.id || r.sourceId || r.toolId,
    name: r.name || r.tool?.name || "Unknown",
    pricing: r.pricing || r.tool?.pricing || "freemium",
  }));

  // If no relations, show a couple of common alternatives
  const displayAlternatives = alternatives.length > 0
    ? alternatives.slice(0, 4)
    : [
        { id: "claude", name: "Claude", pricing: "freemium" },
        { id: "gemini", name: "Gemini", pricing: "free" },
      ];

  const displayWorkflows = tool.workflows || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Back button */}
      <Link
        href="/tools"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary-500 mb-6 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Tool Directory
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tool Header */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary-500/25 flex-shrink-0">
                {tool.name[0]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-text-primary dark:text-white">
                    {tool.name}
                  </h1>
                  {tool.featured && (
                    <span className="px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium">
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-text-secondary dark:text-gray-400 mb-4">
                  {tool.description}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  {tool.rating != null && <RatingStars rating={tool.rating} />}

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      pricingColors[tool.pricing] || pricingColors.freemium
                    }`}
                  >
                    {pricingLabels[tool.pricing] || tool.pricing}
                    {tool.pricing === "subscription" && tool.price != null && ` · $${tool.price}/mo`}
                  </span>

                  {tool.website && (
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 transition-colors"
                    >
                      <GlobeAltIcon className="w-4 h-4" />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Capabilities */}
          {tool.capabilities && tool.capabilities.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-text-primary dark:text-white mb-4">
                Capabilities
              </h2>
              <div className="flex flex-wrap gap-2">
                {tool.capabilities.map((cap: ToolCapability | string) => (
                  <span
                    key={typeof cap === "string" ? cap : cap.id || cap.name}
                    className="px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium"
                  >
                    <SparklesIcon className="w-4 h-4 inline mr-1" />
                    {typeof cap === "string" ? cap : cap.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Workflows */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-text-primary dark:text-white mb-4">
              Used in Workflows
            </h2>
            {displayWorkflows.length > 0 ? (
              <div className="space-y-3">
                {displayWorkflows.map((wf: WorkflowSummary) => (
                  <Link
                    key={wf.id}
                    href={`/workflow/${wf.id}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors group"
                  >
                    <div>
                      <h3 className="font-medium text-text-primary dark:text-white group-hover:text-primary-500 transition-colors">
                        {wf.name}
                      </h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(wf.tools || []).slice(0, 4).map((t: ToolSummary | string) => (
                          <span
                            key={typeof t === "string" ? t : t.id || t.name}
                            className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-400"
                          >
                            {typeof t === "string" ? t : t.name || t.id}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ArrowLeftIcon className="w-4 h-4 text-text-secondary rotate-180 group-hover:text-primary-500 transition-colors" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-secondary dark:text-gray-400">
                No workflows using this tool yet.{" "}
                <Link href="/workflow" className="text-primary-500 hover:text-primary-600">
                  Browse workflows
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-text-primary dark:text-white mb-4">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {tool.categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/tools?category=${cat}`}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300 text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {categories.find((c) => c.toLowerCase() === cat) || cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Alternatives */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-text-primary dark:text-white mb-4">Alternatives</h3>
            <div className="space-y-3">
              {displayAlternatives.map((alt) => (
                <Link
                  key={alt.id}
                  href={`/tools/${alt.id}`}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm font-bold">
                      {alt.name[0]}
                    </div>
                    <span className="font-medium text-text-primary dark:text-white group-hover:text-primary-500 transition-colors">
                      {alt.name}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      pricingColors[alt.pricing] || ""
                    }`}
                  >
                    {pricingLabels[alt.pricing] || alt.pricing}
                  </span>
                </Link>
              ))}
            </div>

            {displayAlternatives.length > 0 && (
              <Link
                href={`/compare?tools=${displayAlternatives.map((a) => a.id).join(",")},${tool.id}`}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
              >
                Compare Alternatives
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-text-primary dark:text-white mb-4">Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary dark:text-gray-400">Rating</span>
                <span className="font-semibold text-text-primary dark:text-white">
                  {tool.rating != null ? `${tool.rating}/5` : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary dark:text-gray-400">Pricing</span>
                <span className="font-semibold text-text-primary dark:text-white capitalize">
                  {pricingLabels[tool.pricing] || tool.pricing}
                </span>
              </div>
              {tool.price != null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary dark:text-gray-400">Price</span>
                  <span className="font-semibold text-text-primary dark:text-white">
                    ${tool.price}/mo
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
