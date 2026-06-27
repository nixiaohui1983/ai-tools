"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon, FaceFrownIcon } from "@heroicons/react/24/outline";
import { api } from "@/lib/api";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import type { TaskDTO } from "@/lib/api";

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function TaskLibraryPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input (300ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // Fetch tasks
  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        const params: Record<string, string> = {};
        if (selectedCategory) params.category = selectedCategory;
        const res = await api.tasks.list(params);
        setTasks(res.data?.tasks || []);
      } catch (err: unknown) {
        toast.error(err?.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [selectedCategory, toast]);

  // Filter by debounced search client-side
  const filteredTasks = useMemo(() => {
    if (!debouncedSearch) return tasks;
    const q = debouncedSearch.toLowerCase();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q)
    );
  }, [tasks, debouncedSearch]);

  // Extract categories from real data
  const categories = useMemo(() => {
    const cats = new Map<string, string>();
    tasks.forEach((t) => {
      if (t.category && !cats.has(t.category)) {
        cats.set(t.category, t.category.charAt(0).toUpperCase() + t.category.slice(1));
      }
    });
    return Array.from(cats.entries()).map(([value, label]) => ({ value, label }));
  }, [tasks]);

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              selectedCategory === null
                ? "border-primary-500 bg-primary-500 text-white"
                : "border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 text-text-secondary dark:text-gray-300 hover:text-primary-500"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                selectedCategory === cat.value
                  ? "border-primary-500 bg-primary-500 text-white"
                  : "border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 text-text-secondary dark:text-gray-300 hover:text-primary-500"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <ListSkeleton rows={6} />
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <FaceFrownIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">
            {debouncedSearch ? "No matching tasks" : "No tasks found"}
          </h3>
          <p className="text-text-secondary dark:text-gray-400">
            {debouncedSearch
              ? "Try a different search term or clear filters"
              : "Check back later for new AI task guides"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredTasks.map((task) => (
            <Link key={task.id} href={`/workflow?task=${task.id}`} className="group block">
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 card-hover">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-3xl">{task.icon || "⚡"}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary dark:text-white group-hover:text-primary-500 transition-colors">
                      {task.title}
                    </h3>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        difficultyColors[task.difficulty] || difficultyColors.easy
                      }`}
                    >
                      {task.difficulty || "easy"}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-text-secondary dark:text-gray-400 mb-4 line-clamp-2">
                  {task.description || `${task.title} - AI-powered workflow`}
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
      )}
    </div>
  );
}
