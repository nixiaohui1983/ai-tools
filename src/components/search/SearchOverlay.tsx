"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  WrenchScrewdriverIcon,
  BoltIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import type { ToolDTO, TaskDTO, WorkflowDTO } from "@/lib/api";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  type: "tool" | "task" | "workflow";
  id: string;
  title: string;
  subtitle?: string;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Search across tools, tasks, workflows
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const [toolRes, taskRes, wfRes] = await Promise.allSettled([
          api.tools.list({ search: query, limit: 5 }),
          api.tasks.list({ limit: 10 }),
          api.workflows.list({ limit: 10 }),
        ]);

        const items: SearchResult[] = [];

        if (toolRes.status === "fulfilled") {
          const tools = toolRes.value.data?.tools || [];
          items.push(
            ...tools.map((t: ToolDTO) => ({
              type: "tool" as const,
              id: t.id,
              title: t.name,
              subtitle: t.description,
            }))
          );
        }

        if (taskRes.status === "fulfilled") {
          const tasks = taskRes.value.data?.tasks || [];
          const q = query.toLowerCase();
          const filtered = tasks.filter(
            (t: TaskDTO) =>
              t.title.toLowerCase().includes(q) ||
              (t.description && t.description.toLowerCase().includes(q))
          );
          items.push(
            ...filtered.slice(0, 5).map((t: TaskDTO) => ({
              type: "task" as const,
              id: t.id,
              title: t.title,
              subtitle: t.description,
            }))
          );
        }

        if (wfRes.status === "fulfilled") {
          const wfs = wfRes.value.data?.workflows || [];
          const q = query.toLowerCase();
          const filtered = wfs.filter(
            (w: WorkflowDTO) =>
              w.name.toLowerCase().includes(q) ||
              (w.description && w.description.toLowerCase().includes(q))
          );
          items.push(
            ...filtered.slice(0, 5).map((w: WorkflowDTO) => ({
              type: "workflow" as const,
              id: w.id,
              title: w.name,
              subtitle: w.description,
            }))
          );
        }

        setResults(items);
        setSelectedIndex(0);
      } catch {
        toast.error("Search failed");
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, toast]);

  const navigateTo = useCallback((result: SearchResult) => {
    onClose();
    switch (result.type) {
      case "tool":
        router.push(`/tools/${result.id}`);
        break;
      case "task":
        router.push(`/workflow?task=${result.id}`);
        break;
      case "workflow":
        router.push(`/workflow/${result.id}`);
        break;
    }
  }, [onClose, router]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results[selectedIndex]) {
          navigateTo(results[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [results, selectedIndex, onClose, navigateTo]
  );

  if (!isOpen) return null;

  const iconMap = {
    tool: <WrenchScrewdriverIcon className="w-5 h-5" />,
    task: <ListBulletIcon className="w-5 h-5" />,
    workflow: <BoltIcon className="w-5 h-5" />,
  };

  const typeLabel = {
    tool: "Tool",
    task: "Task",
    workflow: "Workflow",
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative max-w-2xl mx-auto mt-[15vh] px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-up">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search tools, tasks, workflows..."
              className="flex-1 bg-transparent text-text-primary dark:text-white placeholder:text-gray-400 text-sm focus:outline-none"
            />
            {loading && (
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((result, idx) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => navigateTo(result)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      idx === selectedIndex
                        ? "bg-primary-50 dark:bg-primary-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                        result.type === "tool"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          : result.type === "workflow"
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                      }`}
                    >
                      {iconMap[result.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary dark:text-white truncate">
                          {result.title}
                        </span>
                        <span className="text-[10px] uppercase text-gray-400 dark:text-gray-500 flex-shrink-0">
                          {typeLabel[result.type]}
                        </span>
                      </div>
                      {result.subtitle && (
                        <p className="text-xs text-text-secondary dark:text-gray-400 truncate">
                          {result.subtitle}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="text-center py-8">
                <MagnifyingGlassIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-text-secondary dark:text-gray-400">
                  No results for &quot;{query}&quot;
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-text-secondary dark:text-gray-400">
                  Start typing to search across tools, tasks, and workflows
                </p>
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">Esc</kbd>
              Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
