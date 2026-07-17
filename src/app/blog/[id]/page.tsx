import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, CalendarIcon, ClockIcon, ShareIcon } from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "@/lib/api";

const categoryColors: Record<string, string> = {
  decision: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  workflow: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  comparison: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  guide: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  review: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  tutorial: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

const categoryLabels: Record<string, string> = {
  decision: "Decision Guide",
  workflow: "Workflow",
  comparison: "Comparison",
  guide: "Guide",
  review: "Review",
  tutorial: "Tutorial",
};

export default async function BlogArticlePage({ params }: { params: { id: string } }) {
  let article;
  try {
    const res = await api.articles.get(params.id);
    article = res.data;
  } catch {
    notFound();
  }

  const tools = (article.tools ?? []).map((t) => t.tool);
  const readTime = Math.max(1, Math.round((article.content?.length ?? 0) / 800));
  const dateStr = article.publishedAt ?? article.createdAt;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary-500 mb-6 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Content Hub
      </Link>

      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[article.category] || ""}`}>
            {categoryLabels[article.category] || article.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-text-secondary dark:text-gray-400">
            <ClockIcon className="w-3.5 h-3.5" />
            {readTime} min read
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-white mb-4 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 text-sm text-text-secondary dark:text-gray-400">
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              {new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span>By AI Stack Hub Editorial</span>
          </div>

          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ShareIcon className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      {/* Tools Used Banner */}
      {tools.length > 0 && (
        <div className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 mb-8">
          <p className="text-sm text-primary-600 dark:text-primary-400 mb-2 font-medium">Tools discussed in this article:</p>
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="px-3 py-1 rounded-lg bg-white dark:bg-gray-800 text-text-primary dark:text-white text-sm hover:shadow-md transition-shadow"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Article Body (Markdown) */}
      <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-text-primary dark:prose-headings:text-white prose-p:text-text-secondary dark:prose-p:text-gray-400 prose-a:text-primary-500 prose-strong:text-text-primary dark:prose-strong:text-white prose-li:text-text-secondary dark:prose-li:text-gray-400 prose-table:rounded-2xl prose-table:overflow-hidden">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
      </article>

      {/* Related Workflow */}
      {article.workflow && (
        <div className="mt-12 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-4">
            Try This Workflow
          </h3>
          <Link
            href={`/workflow/${article.workflow.id}`}
            className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors group"
          >
            <div>
              <h4 className="font-medium text-text-primary dark:text-white group-hover:text-primary-500 transition-colors">
                {article.workflow.name}
              </h4>
              <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
                Apply this workflow to get results faster.
              </p>
            </div>
            <ArrowLeftIcon className="w-4 h-4 text-text-secondary rotate-180 group-hover:text-primary-500 transition-colors" />
          </Link>
        </div>
      )}

      {/* Author Bio */}
      <div className="mt-8 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center text-white font-bold text-lg">
            AI
          </div>
          <div>
            <h4 className="font-semibold text-text-primary dark:text-white">AI Stack Hub Editorial</h4>
            <p className="text-sm text-text-secondary dark:text-gray-400">
              The editorial team tests and compares AI tools to help you build the perfect stack.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
