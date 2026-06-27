import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  StarIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

const categories = [
  "Writing", "Image", "Video", "Coding", "Marketing", "Productivity", "Research", "Automation",
];

// Mock tool data - in production this would be fetched from API
const mockTool = {
  id: "1",
  name: "ChatGPT",
  description: "AI language model by OpenAI for writing, coding, analysis, and more. The most versatile AI assistant for professionals and creators.",
  longDescription: "ChatGPT is a state-of-the-art language model that can understand and generate human-like text. It can help you write emails, essays, and code; answer questions; create content; and much more. With a simple chat interface, it's the most accessible AI tool for anyone looking to boost productivity.",
  logo: "",
  website: "https://chat.openai.com",
  pricing: "freemium",
  price: 20,
  rating: 4.9,
  categories: ["writing", "coding"],
  capabilities: ["writing", "coding", "research", "summarization"],
  featured: true,
  users: "200M+",
  bestFor: ["Content creation", "Code assistance", "Research", "Brainstorming"],
  alternatives: [
    { id: "2", name: "Claude", pricing: "freemium" },
    { id: "3", name: "Gemini", pricing: "free" },
  ],
  workflows: [
    { id: "w1", name: "Write SEO Blog in 30 min", tools: ["ChatGPT", "Perplexity"] },
    { id: "w2", name: "Code Review Automation", tools: ["ChatGPT", "GitHub Copilot"] },
  ],
};

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
  // In production: fetch tool data from API
  const tool = mockTool;

  if (!tool) return notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              {/* Logo */}
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
                  <RatingStars rating={tool.rating} />

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      pricingColors[tool.pricing] || pricingColors.freemium
                    }`}
                  >
                    {pricingLabels[tool.pricing] || tool.pricing}
                    {tool.pricing === "subscription" && ` · $${tool.price}/mo`}
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

          {/* Long Description */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-text-primary dark:text-white mb-4">
              About {tool.name}
            </h2>
            <p className="text-text-secondary dark:text-gray-400 leading-relaxed">
              {tool.longDescription}
            </p>
          </div>

          {/* Capabilities */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-text-primary dark:text-white mb-4">
              Capabilities
            </h2>
            <div className="flex flex-wrap gap-2">
              {tool.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium"
                >
                  <SparklesIcon className="w-4 h-4 inline mr-1" />
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Related Workflows */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-text-primary dark:text-white mb-4">
              Used in Workflows
            </h2>
            <div className="space-y-3">
              {tool.workflows.map((wf) => (
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
                      {wf.tools.map((t: string) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowLeftIcon className="w-4 h-4 text-text-secondary rotate-180 group-hover:text-primary-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Best For */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-text-primary dark:text-white mb-4 flex items-center gap-2">
              <CheckBadgeIcon className="w-5 h-5 text-primary-500" />
              Best For
            </h3>
            <ul className="space-y-2">
              {tool.bestFor.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-text-secondary dark:text-gray-400"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-text-primary dark:text-white mb-4">
              Categories
            </h3>
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
            <h3 className="font-semibold text-text-primary dark:text-white mb-4">
              Alternatives
            </h3>
            <div className="space-y-3">
              {tool.alternatives.map((alt) => (
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

            <Link
              href={`/compare?tools=${tool.alternatives.map((a) => a.id).join(",")},${tool.id}`}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
            >
              Compare Alternatives
            </Link>
          </div>

          {/* Stats */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-text-primary dark:text-white mb-4">
              Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary dark:text-gray-400">Users</span>
                <span className="font-semibold text-text-primary dark:text-white">{tool.users}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary dark:text-gray-400">Rating</span>
                <span className="font-semibold text-text-primary dark:text-white">{tool.rating}/5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary dark:text-gray-400">Pricing</span>
                <span className="font-semibold text-text-primary dark:text-white capitalize">
                  {pricingLabels[tool.pricing] || tool.pricing}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
