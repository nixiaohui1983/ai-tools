"use client";

import React from "react";
import { ClockIcon, CurrencyDollarIcon, BoltIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface WorkflowSidebarProps {
  selectedNode: {
    id: string;
    type: string;
    label: string;
    toolId?: string;
  } | null;
  estimatedTime?: number;
  estimatedCost?: number;
  onSave: () => void;
  onShare: () => void;
  onExport: () => void;
  workflowName: string;
  onWorkflowNameChange: (name: string) => void;
}

export default function WorkflowSidebar({
  selectedNode,
  estimatedTime,
  estimatedCost,
  onSave,
  onShare,
  onExport,
  workflowName,
  onWorkflowNameChange,
}: WorkflowSidebarProps) {
  return (
    <div className="w-full lg:w-80 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-5 space-y-5">
      {/* Workflow Name */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Workflow Name
        </label>
        <Input
          value={workflowName}
          onChange={(e) => onWorkflowNameChange(e.target.value)}
          placeholder="My Workflow"
          className="text-sm"
        />
      </div>

      {/* Node Properties */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Node Properties
        </label>
        {selectedNode ? (
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 space-y-3">
            <div>
              <span className="text-xs text-gray-400">Type</span>
              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                {selectedNode.type}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-400">Label</span>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedNode.label}
              </p>
            </div>
            {selectedNode.type === "tool" && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Prompt Template
                </label>
                <textarea
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-sm text-gray-900 dark:text-white resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  placeholder="Enter prompt template..."
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400 py-4 text-center">
            Select a node to edit its properties
          </p>
        )}
      </div>

      {/* Estimates */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Estimates
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30">
            <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 mb-1">
              <ClockIcon className="w-3.5 h-3.5" />
              <span className="text-xs">Time</span>
            </div>
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
              {estimatedTime ? `${estimatedTime} min` : "--"}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30">
            <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 mb-1">
              <CurrencyDollarIcon className="w-3.5 h-3.5" />
              <span className="text-xs">Cost</span>
            </div>
            <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
              {estimatedCost !== undefined ? `$${estimatedCost}` : "--"}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
        <Button variant="primary" size="sm" className="w-full" onClick={onSave}>
          <BoltIcon className="w-4 h-4" />
          Save Workflow
        </Button>
        <Button variant="outline" size="sm" className="w-full" onClick={onShare}>
          Share
        </Button>
        <Button variant="ghost" size="sm" className="w-full" onClick={onExport}>
          Export
        </Button>
      </div>
    </div>
  );
}
