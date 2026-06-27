import Link from "next/link";
import {
  ArrowRightIcon,
  SparklesIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const taskShortcuts = [
  { emoji: "✍️", label: "Write content", href: "/tasks?q=content" },
  { emoji: "🎬", label: "Make video", href: "/tasks?q=video" },
  { emoji: "⚡", label: "Automate work", href: "/tasks?q=automation" },
  { emoji: "🚀", label: "Start business", href: "/tasks?q=business" },
  { emoji: "🎨", label: "Design images", href: "/tasks?q=design" },
  { emoji: "🧠", label: "Learn AI", href: "/tasks?q=learn" },
];

const featuredWorkflows = [
  {
    id: "1",
    title: "Write SEO Blog in 30 min",
    tools: ["ChatGPT", "Perplexity", "SurferSEO"],
    timeSaved: 70,
    color: "from-green-400 to-emerald-500",
  },
  {
    id: "2",
    title: "YouTube Automation System",
    tools: ["ChatGPT", "Midjourney", "Canva", "CapCut"],
    timeSaved: 80,
    color: "from-blue-400 to-indigo-500",
  },
  {
    id: "3",
    title: "AI eCommerce Product Generator",
    tools: ["ChatGPT", "Midjourney", "Shopify AI"],
    timeSaved: 65,
    color: "from-purple-400 to-pink-500",
  },
  {
    id: "4",
    title: "Faceless Channel Setup",
    tools: ["ChatGPT", "ElevenLabs", "HeyGen"],
    timeSaved: 90,
    color: "from-orange-400 to-red-500",
  },
];

const toolStacks = [
  {
    title: "Content Creation Stack",
    tools: "ChatGPT + Perplexity + SurferSEO",
    description: "Perfect for bloggers and content marketers",
    timeSaved: 70,
  },
  {
    title: "Visual Design Stack",
    tools: "Midjourney + Canva + CapCut",
    description: "Create stunning visuals and videos",
    timeSaved: 60,
  },
  {
    title: "Coding Assistant Stack",
    tools: "GitHub Copilot + Cursor + Claude",
    description: "Supercharge your development workflow",
    timeSaved: 50,
  },
  {
    title: "Marketing Automation Stack",
    tools: "HubSpot AI + Jasper + Zapier",
    description: "Automate your marketing campaigns",
    timeSaved: 75,
  },
];

const trendingTasks = [
  { title: "Make money with AI in 2026", trend: "up" },
  { title: "Start faceless YouTube channel", trend: "up" },
  { title: "Build SaaS with AI tools", trend: "up" },
  { title: "AI-powered email marketing", trend: "stable" },
  { title: "Automate customer support", trend: "up" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-accent-400/5 to-cyan-500/5 dark:from-primary-900/20 dark:via-accent-900/20 dark:to-cyan-900/20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-8 animate-fade-in">
            <SparklesIcon className="w-4 h-4" />
            AI Tool Decision & Workflow Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary dark:text-white mb-6 animate-slide-up">
            What do you want to
            <br />
            <span className="bg-gradient-to-r from-primary-500 via-accent-400 to-cyan-500 bg-clip-text text-transparent">
              accomplish with AI?
            </span>
          </h1>

          <p className="text-lg text-text-secondary dark:text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up">
            Choose the right AI tools, combine them into powerful workflows, and complete tasks faster than ever.
          </p>

          {/* Task Shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-4xl mx-auto animate-slide-up">
            {taskShortcuts.map((task) => (
              <Link
                key={task.label}
                href={task.href}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 card-hover group"
              >
                <span className="text-2xl">{task.emoji}</span>
                <span className="text-sm font-medium text-text-secondary dark:text-gray-300 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                  {task.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Workflows */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary dark:text-white">
              Popular AI Workflows
            </h2>
            <p className="text-text-secondary dark:text-gray-400 mt-1">
              Ready-to-use AI tool combinations
            </p>
          </div>
          <Link
            href="/workflow"
            className="flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
          >
            View all
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredWorkflows.map((wf) => (
            <Link
              key={wf.id}
              href={`/workflow/${wf.id}`}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 card-hover"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${wf.color}`} />
              <div className="p-6">
                <h3 className="font-semibold text-text-primary dark:text-white mb-3 group-hover:text-primary-500 transition-colors">
                  {wf.title}
                </h3>
                <div className="flex flex-wrap gap-1 mb-4">
                  {wf.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                  <ClockIcon className="w-4 h-4" />
                  <span>Time saved: {wf.timeSaved}%</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended Tool Stacks */}
      <section className="bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-text-primary dark:text-white">
                Recommended Tool Stacks
              </h2>
              <p className="text-text-secondary dark:text-gray-400 mt-1">
                Curated AI tool combinations for specific use cases
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {toolStacks.map((stack) => (
              <div
                key={stack.title}
                className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 card-hover"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-text-primary dark:text-white">
                    {stack.title}
                  </h3>
                  <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    <ChartBarIcon className="w-4 h-4" />
                    -{stack.timeSaved}%
                  </span>
                </div>
                <p className="text-sm text-text-secondary dark:text-gray-400 mb-4">
                  {stack.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-secondary dark:text-gray-400">
                    Stack:
                  </span>
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-primary-600 dark:text-primary-400">
                    {stack.tools}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Tasks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary dark:text-white">
              Trending Tasks
            </h2>
            <p className="text-text-secondary dark:text-gray-400 mt-1">
              What the community is building with AI
            </p>
          </div>
        </div>

        <div className="max-w-2xl space-y-3">
          {trendingTasks.map((task, i) => (
            <Link
              key={i}
              href={`/tasks?q=${task.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 card-hover group"
            >
              <span className="font-medium text-text-primary dark:text-white group-hover:text-primary-500 transition-colors">
                {task.title}
              </span>
              <div className="flex items-center gap-2">
                {task.trend === "up" ? (
                  <span className="text-green-500 text-sm">↑ Trending</span>
                ) : (
                  <span className="text-gray-400 text-sm">— Stable</span>
                )}
                <ArrowRightIcon className="w-4 h-4 text-text-secondary group-hover:text-primary-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
