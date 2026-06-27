import Link from "next/link";
import { ArrowLeftIcon, CalendarIcon, ClockIcon, ShareIcon } from "@heroicons/react/24/outline";

const article = {
  id: "1",
  title: "ChatGPT vs Claude vs Gemini: Which AI Assistant is Best in 2026?",
  body: `## Introduction

With the rapid evolution of AI assistants, 2026 has brought significant updates to the top 3 contenders: ChatGPT, Claude, and Gemini. In this comprehensive comparison, we tested all three across 10 real-world tasks that matter to professionals.

## Methodology

We evaluated each AI assistant across:
- **Writing quality** (blog posts, emails, reports)
- **Code generation** (Python, TypeScript, SQL)
- **Research accuracy** (fact-checking, source citation)
- **Reasoning** (logic puzzles, data analysis)
- **Multimodal capabilities** (image understanding, file processing)

## ChatGPT (GPT-4o)

**Strengths:** Best all-around performer. Excellent at following complex instructions, great code generation, and the ecosystem (plugins, GPTs) is unmatched.

**Weaknesses:** Can be verbose. Sometimes overconfident about incorrect information.

**Best for:** Professionals who need a versatile assistant for varied tasks.

**Pricing:** Free tier available. ChatGPT Plus at $20/month.

## Claude (Claude 3.5 Sonnet)

**Strengths:** Exceptional at writing and analysis. More nuanced and careful in responses. Longer context window (200K tokens). Better at refusing harmful requests.

**Weaknesses:** No internet access by default. Code generation slightly behind GPT-4o.

**Best for:** Writers, researchers, and analysts who prioritize quality over speed.

**Pricing:** Free tier. Claude Pro at $20/month.

## Gemini (Gemini 2.0)

**Strengths:** Deep integration with Google Workspace. Excellent at search-augmented responses. Strong multimodal capabilities.

**Weaknesses:** Inconsistent quality. Sometimes provides shallow answers compared to Claude.

**Best for:** Google Workspace users who want seamless integration.

**Pricing:** Free. Gemini Advanced at $19.99/month.

## Head-to-Head Results

| Task | Winner | Runner-up |
|------|--------|-----------|
| Blog post writing | Claude | ChatGPT |
| Code generation | ChatGPT | Claude |
| Data analysis | Claude | ChatGPT |
| Research | Gemini | Claude |
| Email drafting | Claude | ChatGPT |

## Workflow Recommendation

**For content creators:** Claude + ChatGPT (use Claude for drafts, ChatGPT for SEO optimization)

**For developers:** ChatGPT + GitHub Copilot

**For researchers:** Gemini + Claude (Gemini for search, Claude for synthesis)

## Conclusion

There's no single "best" AI assistant — it depends on your use case. If you can only choose one, ChatGPT offers the best all-around experience. But the real power comes from combining multiple tools into a workflow.

*Updated June 2026 with the latest model versions.*`,
  category: "comparison",
  readTime: 12,
  date: "2026-06-15",
  tools: ["ChatGPT", "Claude", "Gemini"],
  relatedWorkflows: [
    { id: "w1", name: "Content Creation Stack", tools: ["ChatGPT", "Claude"] },
    { id: "w2", name: "Research & Analysis Stack", tools: ["Gemini", "Claude"] },
  ],
};

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

export default function BlogArticlePage() {
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
            {article.readTime} min read
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-white mb-4 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 text-sm text-text-secondary dark:text-gray-400">
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              {new Date(article.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
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
      <div className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 mb-8">
        <p className="text-sm text-primary-600 dark:text-primary-400 mb-2 font-medium">Tools discussed in this article:</p>
        <div className="flex flex-wrap gap-2">
          {article.tools.map((tool) => (
            <Link
              key={tool}
              href={`/tools/${tool.toLowerCase()}`}
              className="px-3 py-1 rounded-lg bg-white dark:bg-gray-800 text-text-primary dark:text-white text-sm hover:shadow-md transition-shadow"
            >
              {tool}
            </Link>
          ))}
        </div>
      </div>

      {/* Article Body */}
      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-text-primary dark:prose-headings:text-white prose-p:text-text-secondary dark:prose-p:text-gray-400 prose-a:text-primary-500 prose-strong:text-text-primary dark:prose-strong:text-white prose-table:rounded-2xl prose-table:overflow-hidden">
        {/* Render markdown-like content */}
        {article.body.split("\n\n").map((paragraph, i) => {
          if (paragraph.startsWith("## ")) {
            return (
              <h2 key={i} className="text-2xl font-bold text-text-primary dark:text-white mt-10 mb-4">
                {paragraph.replace("## ", "")}
              </h2>
            );
          }
          if (paragraph.startsWith("### ")) {
            return (
              <h3 key={i} className="text-xl font-semibold text-text-primary dark:text-white mt-8 mb-3">
                {paragraph.replace("### ", "")}
              </h3>
            );
          }
          if (paragraph.startsWith("|")) {
            // Simple table rendering
            const rows = paragraph.split("\n").filter((r) => r.trim());
            return (
              <div key={i} className="my-6 overflow-x-auto">
                <table className="w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <tbody>
                    {rows.map((row, ri) => {
                      const cells = row.split("|").filter((c) => c.trim());
                      const isHeader = ri === 0 || row.includes("---");
                      if (row.includes("---")) return null;
                      return (
                        <tr key={ri} className={isHeader ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-800"}>
                          {cells.map((cell, ci) => (
                            <td key={ci} className={`px-4 py-2.5 text-sm ${isHeader ? "font-semibold text-text-primary dark:text-white" : "text-text-secondary dark:text-gray-400"}`}>
                              {cell.trim()}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          }
          if (paragraph.startsWith("- **")) {
            const items = paragraph.split("\n").filter((l) => l.trim());
            return (
              <ul key={i} className="my-4 space-y-2">
                {items.map((item, ii) => (
                  <li key={ii} className="flex items-start gap-2 text-text-secondary dark:text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                    <span dangerouslySetInnerHTML={{ __html: item.replace("- **", "<strong>").replace("**", "</strong>") }} />
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={i} className="text-text-secondary dark:text-gray-400 leading-relaxed mb-4">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Related Workflows */}
      {article.relatedWorkflows.length > 0 && (
        <div className="mt-12 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-4">
            Try These Workflows
          </h3>
          <div className="space-y-3">
            {article.relatedWorkflows.map((wf) => (
              <Link
                key={wf.id}
                href={`/workflow/${wf.id}`}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors group"
              >
                <div>
                  <h4 className="font-medium text-text-primary dark:text-white group-hover:text-primary-500 transition-colors">
                    {wf.name}
                  </h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {wf.tools.map((t: string) => (
                      <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-400">
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
