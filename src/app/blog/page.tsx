import Link from "next/link";
import { CalendarIcon, ClockIcon, TagIcon } from "@heroicons/react/24/outline";

const categories = [
  { key: "decision", label: "Decision Guides", desc: "Which tool should you choose?" },
  { key: "workflow", label: "Workflow Tutorials", desc: "Step-by-step AI workflows" },
  { key: "comparison", label: "Tool Comparisons", desc: "Head-to-head tool battles" },
  { key: "tutorial", label: "Tutorials", desc: "How to use AI tools effectively" },
];

const featuredArticles = [
  {
    id: "1",
    title: "ChatGPT vs Claude vs Gemini: Which AI Assistant is Best in 2026?",
    excerpt: "We tested the top 3 AI assistants across 10 real-world tasks. Here's our detailed comparison with workflow recommendations.",
    category: "comparison",
    readTime: 12,
    date: "2026-06-15",
    featured: true,
    tools: ["ChatGPT", "Claude", "Gemini"],
  },
  {
    id: "2",
    title: "Build a Content Marketing Stack: ChatGPT + SurferSEO + Canva",
    excerpt: "Complete workflow to go from keyword research to published blog post with visuals, in under 2 hours.",
    category: "workflow",
    readTime: 8,
    date: "2026-06-10",
    featured: true,
    tools: ["ChatGPT", "SurferSEO", "Canva"],
  },
  {
    id: "3",
    title: "Best Free AI Tools for Startups in 2026",
    excerpt: "A curated list of the best free (or freemium) AI tools that can power your entire startup stack.",
    category: "decision",
    readTime: 10,
    date: "2026-06-05",
    featured: false,
    tools: ["ChatGPT", "Notion AI", "Runway"],
  },
  {
    id: "4",
    title: "How to Automate Your YouTube Channel with AI",
    excerpt: "From script generation to voiceover and video editing — automate your entire YouTube workflow.",
    category: "tutorial",
    readTime: 15,
    date: "2026-05-28",
    featured: false,
    tools: ["ChatGPT", "ElevenLabs", "CapCut"],
  },
  {
    id: "5",
    title: "Midjourney vs DALL-E 3 vs Stable Diffusion: Image Quality Showdown",
    excerpt: "We generated 50 prompts across 5 categories. See which AI image generator comes out on top.",
    category: "comparison",
    readTime: 10,
    date: "2026-05-20",
    featured: false,
    tools: ["Midjourney", "DALL-E", "Stable Diffusion"],
  },
  {
    id: "6",
    title: "AI Coding Assistant Workflow: Copilot + Cursor + Claude",
    excerpt: "The ultimate AI-powered coding setup. How to combine 3 tools to 10x your development speed.",
    category: "workflow",
    readTime: 14,
    date: "2026-05-15",
    featured: false,
    tools: ["GitHub Copilot", "Cursor", "Claude"],
  },
];

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

function ArticleCard({ article, featured = false }: { article: any; featured?: boolean }) {
  return (
    <Link href={`/blog/${article.id}`} className="group block">
      <div
        className={`p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 card-hover h-full ${
          featured ? "ring-2 ring-primary-500/20" : ""
        }`}
      >
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              categoryColors[article.category] || ""
            }`}
          >
            {categoryLabels[article.category] || article.category}
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
          {article.excerpt}
        </p>

        {/* Tools used */}
        <div className="flex flex-wrap gap-1 mb-4">
          {article.tools.slice(0, 3).map((tool: string) => (
            <span
              key={tool}
              className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-400"
            >
              {tool}
            </span>
          ))}
          {article.tools.length > 3 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-400">
              +{article.tools.length - 3}
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-text-secondary dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            {new Date(article.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon className="w-3.5 h-3.5" />
            {article.readTime} min read
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const featured = featuredArticles.filter((a) => a.featured);
  const regular = featuredArticles.filter((a) => !a.featured);

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
          Decision guides, workflow tutorials, and tool comparisons to help you build the perfect AI
          stack.
        </p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {categories.map((cat) => (
          <Link
            key={cat.key}
            href={`/blog?category=${cat.key}`}
            className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 card-hover text-center"
          >
            <div
              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                categoryColors[cat.key] || ""
              }`}
            >
              {cat.label}
            </div>
            <p className="text-xs text-text-secondary dark:text-gray-400">{cat.desc}</p>
          </Link>
        ))}
      </div>

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
