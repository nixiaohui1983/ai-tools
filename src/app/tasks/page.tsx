import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const categories = [
  { value: "content", label: "Content" },
  { value: "business", label: "Business" },
  { value: "design", label: "Design" },
  { value: "automation", label: "Automation" },
  { value: "coding", label: "Coding" },
];

// Mock data - replace with API call later
const mockTasks = [
  {
    id: "1",
    title: "Write Blog Post",
    description: "Create SEO-optimized blog posts with AI assistance",
    difficulty: "easy",
    category: "content",
    toolCount: 4,
    icon: "📝",
  },
  {
    id: "2",
    title: "YouTube Video Creation",
    description: "Script, generate visuals, and edit videos with AI tools",
    difficulty: "medium",
    category: "content",
    toolCount: 6,
    icon: "🎬",
  },
  {
    id: "3",
    title: "eCommerce Product Listing",
    description: "Generate product descriptions and images at scale",
    difficulty: "easy",
    category: "business",
    toolCount: 3,
    icon: "🛒",
  },
];

export default function TaskLibraryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary dark:text-white mb-2">
          Task Library
        </h1>
        <p className="text-text-secondary dark:text-gray-400">
          Choose a task to see recommended AI tools and workflows
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 text-text-secondary dark:text-gray-300 hover:text-primary-500"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTasks.map((task) => (
          <Link
            key={task.id}
            href={`/workflow?task=${task.id}`}
            className="group block"
          >
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 card-hover">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-3xl">{task.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary dark:text-white group-hover:text-primary-500 transition-colors">
                    {task.title}
                  </h3>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      task.difficulty === "easy"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : task.difficulty === "medium"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {task.difficulty}
                  </span>
                </div>
              </div>

              <p className="text-sm text-text-secondary dark:text-gray-400 mb-4 line-clamp-2">
                {task.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary dark:text-gray-400">
                  {task.toolCount} tools
                </span>
                <span className="text-primary-500 font-medium group-hover:translate-x-1 transition-transform inline-block">
                  View Workflow →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
