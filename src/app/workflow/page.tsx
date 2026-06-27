"use client";

import { useState, useCallback } from "react";
import {
  PlusIcon,
  TrashIcon,
  PlayIcon,
  Cog6ToothIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { WorkflowCanvas } from "@/components/workflow";
import { WorkflowSidebar } from "@/components/workflow";
import { useWorkflowStore } from "@/store";
import Button from "@/components/ui/Button";
import Card, { CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { WorkflowDTO } from "@/types";

// Mock workflow data for the list
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
  {
    id: "3",
    name: "Newsletter Generator",
    description: "AI-powered newsletter creation and distribution",
    tools: ["Claude", "Notion AI", "Mailchimp AI"],
    estimatedCost: 30,
    estimatedTime: 20,
    timeSavedPct: 65,
  },
  {
    id: "4",
    name: "Social Media Content Engine",
    description: "Auto-generate and schedule social media posts across platforms",
    tools: ["ChatGPT", "Canva", "Buffer AI"],
    estimatedCost: 50,
    estimatedTime: 40,
    timeSavedPct: 75,
  },
];

export default function WorkflowPage() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<string | null>(null);

  if (showBuilder) {
    return (
      <WorkflowBuilderView
        workflowId={editingWorkflow}
        onBack={() => {
          setShowBuilder(false);
          setEditingWorkflow(null);
        }}
      />
    );
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
        <Button
          variant="primary"
          size="md"
          leftIcon={<PlusIcon className="w-5 h-5" />}
          onClick={() => setShowBuilder(true)}
        >
          Create Workflow
        </Button>
      </div>

      {/* Workflow List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockWorkflows.map((wf) => (
          <Card key={wf.id} hover padding="md">
            <div className="flex items-start justify-between mb-4">
              <CardTitle>{wf.name}</CardTitle>
              <div className="flex gap-2">
                <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Cog6ToothIcon className="w-4 h-4 text-text-secondary" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <TrashIcon className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>

            <CardDescription>{wf.description}</CardDescription>

            <div className="flex flex-wrap gap-1.5 my-4">
              {wf.tools.map((tool) => (
                <Badge key={tool} variant="primary" size="sm">
                  {tool}
                </Badge>
              ))}
            </div>

            <CardFooter>
              <div className="grid grid-cols-3 w-full text-center">
                <div>
                  <div className="text-sm font-semibold text-text-primary dark:text-white">
                    ${wf.estimatedCost}
                  </div>
                  <div className="text-xs text-text-secondary dark:text-gray-400">
                    Est. Cost
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary dark:text-white">
                    {wf.estimatedTime}min
                  </div>
                  <div className="text-xs text-text-secondary dark:text-gray-400">
                    Est. Time
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                    -{wf.timeSavedPct}%
                  </div>
                  <div className="text-xs text-text-secondary dark:text-gray-400">
                    Saved
                  </div>
                </div>
              </div>
            </CardFooter>

            <button
              onClick={() => {
                setEditingWorkflow(wf.id);
                setShowBuilder(true);
              }}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-primary-200 text-primary-600 text-sm font-semibold hover:bg-primary-50 dark:border-primary-800 dark:text-primary-400 dark:hover:bg-primary-900/30 transition-colors"
            >
              <PlayIcon className="w-4 h-4" />
              Open in Builder
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WorkflowBuilderView({
  workflowId,
  onBack,
}: {
  workflowId: string | null;
  onBack: () => void;
}) {
  const {
    currentWorkflow,
    workflowName,
    selectedNodeId,
    setWorkflowName,
    setSelectedNodeId,
    resetWorkflow,
  } = useWorkflowStore();

  const [estimatedTime, setEstimatedTime] = useState(workflowId ? 30 : undefined);
  const [estimatedCost, setEstimatedCost] = useState(workflowId ? 45 : undefined);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleCanvasChange = useCallback((_nodes: any, _edges: any) => {
    // Auto-save logic would go here (debounced API call)
  }, []);

  const handleSave = useCallback(() => {
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  }, []);

  const selectedNodeInfo = selectedNodeId
    ? {
        id: selectedNodeId,
        type: "tool",
        label: "Selected Node",
        toolId: "tool-1",
      }
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              resetWorkflow();
              onBack();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-text-secondary dark:text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </button>
          <h2 className="text-xl font-bold text-text-primary dark:text-white">
            {workflowId ? "Edit" : "New"} Workflow
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {showSaveSuccess && (
            <span className="text-sm text-green-600 dark:text-green-400 font-medium animate-fade-in">
              ✓ Saved
            </span>
          )}
          <Button variant="outline" size="sm" onClick={onBack}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            Save Workflow
          </Button>
        </div>
      </div>

      {/* Builder Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Canvas */}
        <div className="flex-1 min-w-0">
          <WorkflowCanvas
            workflow={currentWorkflow || undefined}
            onChange={handleCanvasChange}
          />
        </div>

        {/* Sidebar */}
        <WorkflowSidebar
          selectedNode={selectedNodeInfo}
          estimatedTime={estimatedTime}
          estimatedCost={estimatedCost}
          onSave={handleSave}
          onShare={() => console.log("Share")}
          onExport={() => console.log("Export")}
          workflowName={workflowName}
          onWorkflowNameChange={setWorkflowName}
        />
      </div>
    </div>
  );
}
