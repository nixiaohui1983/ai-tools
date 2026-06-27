"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PlusIcon,
  TrashIcon,
  PlayIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

// Mock workflow data
const mockWorkflows = [
  {
    id: "1",
    name: "SEO Blog Writer",
    description: "Complete workflow for writing SEO-optimized blog posts",
    tools: ["ChatGPT", "Perplexity", "SurferSEO"],
    estimatedCost: 45,
    estimatedTime: 30,
    timeSavedPct: 70,
  },
  {
    id: "2",
    name: "YouTube Automation",
    description: "Automate YouTube video creation from script to thumbnail",
    tools: ["ChatGPT", "Midjourney", "Canva", "CapCut"],
    estimatedCost: 60,
    estimatedTime: 60,
    timeSavedPct: 80,
  },
];

export default function WorkflowPage() {
  const [showBuilder, setShowBuilder] = useState(false);

  if (showBuilder) {
    return <WorkflowBuilder onBack={() => setShowBuilder(false)} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary dark:text-white mb-2">
            Workflow Builder
          </h1>
          <p className="text-text-secondary dark:text-gray-400">
            Create and customize AI tool workflows
          </p>
        </div>
        <button
          onClick={() => setShowBuilder(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-400 text-white font-medium hover:opacity-90 transition-opacity"
        >
          <PlusIcon className="w-5 h-5" />
          Create Workflow
        </button>
      </div>

      {/* Workflow List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockWorkflows.map((wf) => (
          <div
            key={wf.id}
            className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-lg text-text-primary dark:text-white">
                {wf.name}
              </h3>
              <div className="flex gap-2">
                <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Cog6ToothIcon className="w-4 h-4 text-text-secondary" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <TrashIcon className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>

            <p className="text-sm text-text-secondary dark:text-gray-400 mb-4">
              {wf.description}
            </p>

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

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-sm font-semibold text-text-primary dark:text-white">
                  ${wf.estimatedCost}
                </div>
                <div className="text-xs text-text-secondary dark:text-gray-400">
                  Est. Cost
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-text-primary dark:text-white">
                  {wf.estimatedTime}min
                </div>
                <div className="text-xs text-text-secondary dark:text-gray-400">
                  Est. Time
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                  -{wf.timeSavedPct}%
                </div>
                <div className="text-xs text-text-secondary dark:text-gray-400">
                  Time Saved
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowBuilder(true)}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-primary-500 text-primary-500 text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
            >
              <PlayIcon className="w-4 h-4" />
              Open in Builder
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkflowBuilder({ onBack }: { onBack: () => void }) {
  return (
    <div>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm"
          >
            ← Back
          </button>
          <h2 className="text-xl font-bold">Workflow Builder</h2>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm">
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm">
            Save
          </button>
        </div>
      </div>

      {/* Canvas Placeholder */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
            <PlusIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-text-secondary dark:text-gray-400">
            Drag and drop tools to build your workflow
          </p>
          <p className="text-sm text-gray-400 mt-2">
            (React Flow integration coming next)
          </p>
        </div>
      </div>
    </div>
  );
}
