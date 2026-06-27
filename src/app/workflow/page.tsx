"use client";

import { useState, useCallback, useEffect } from "react";
import {
  PlusIcon,
  TrashIcon,
  PlayIcon,
  Cog6ToothIcon,
  ArrowLeftIcon,
  FaceFrownIcon,
} from "@heroicons/react/24/outline";
import { WorkflowCanvas } from "@/components/workflow";
import { WorkflowSidebar } from "@/components/workflow";
import { useWorkflowStore } from "@/store";
import { api } from "@/lib/api";
import Button from "@/components/ui/Button";
import Card, { CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import type { WorkflowDTO } from "@/lib/api";

export default function WorkflowPage() {
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState<WorkflowDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        setLoading(true);
        const res = await api.workflows.list();
        setWorkflows(res.data?.workflows || []);
      } catch (err: unknown) {
        toast.error(err?.message || "Failed to load workflows");
      } finally {
        setLoading(false);
      }
    }
    fetchWorkflows();
  }, [toast]);

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

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : workflows.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <FaceFrownIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">
            No workflows yet
          </h3>
          <p className="text-text-secondary dark:text-gray-400 mb-4">
            Create your first AI workflow to get started.
          </p>
          <Button
            variant="primary"
            size="md"
            leftIcon={<PlusIcon className="w-5 h-5" />}
            onClick={() => setShowBuilder(true)}
          >
            Create Workflow
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {workflows.map((wf) => (
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

              <CardDescription>{wf.description || "Custom AI workflow"}</CardDescription>

              <div className="flex flex-wrap gap-1.5 my-4">
                {(wf.tools || []).slice(0, 5).map((tool: { id?: string; name?: string } | string) => (
                  <Badge key={typeof tool === "string" ? tool : tool.id || tool.name} variant="primary" size="sm">
                    {typeof tool === "string" ? tool : tool.name || tool.id}
                  </Badge>
                ))}
              </div>

              <CardFooter>
                <div className="grid grid-cols-3 w-full text-center">
                  <div>
                    <div className="text-sm font-semibold text-text-primary dark:text-white">
                      ${wf.estimatedCost ?? "—"}
                    </div>
                    <div className="text-xs text-text-secondary dark:text-gray-400">Est. Cost</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary dark:text-white">
                      {wf.estimatedTime ?? "—"}min
                    </div>
                    <div className="text-xs text-text-secondary dark:text-gray-400">Est. Time</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {wf.timeSavedPct != null ? `-${wf.timeSavedPct}%` : "—"}
                    </div>
                    <div className="text-xs text-text-secondary dark:text-gray-400">Saved</div>
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
      )}
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
    resetWorkflow,
  } = useWorkflowStore();

  const [estimatedTime] = useState(workflowId ? 30 : undefined);
  const [estimatedCost] = useState(workflowId ? 45 : undefined);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCanvasChange = useCallback(() => {
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

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <WorkflowCanvas
            workflow={currentWorkflow || undefined}
            onChange={handleCanvasChange}
          />
        </div>

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
