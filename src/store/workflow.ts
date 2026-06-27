import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WorkflowDTO, WorkflowNode, WorkflowEdge } from "@/types";

interface WorkflowState {
  // Current editing workflow
  currentWorkflow: WorkflowDTO | null;
  workflowName: string;
  selectedNodeId: string | null;

  // Actions
  setCurrentWorkflow: (workflow: WorkflowDTO | null) => void;
  setWorkflowName: (name: string) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
  addNode: (node: WorkflowNode) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: WorkflowEdge) => void;
  removeEdge: (source: string, target: string) => void;
  resetWorkflow: () => void;
}

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      currentWorkflow: null,
      workflowName: "My Workflow",
      selectedNodeId: null,

      setCurrentWorkflow: (workflow) =>
        set({ currentWorkflow: workflow, workflowName: workflow?.name || "My Workflow" }),

      setWorkflowName: (name) => set({ workflowName: name }),

      setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),

      updateNodeData: (nodeId, data) => {
        const wf = get().currentWorkflow;
        if (!wf) return;
        set({
          currentWorkflow: {
            ...wf,
            nodes: wf.nodes.map((n) =>
              n.id === nodeId ? { ...n, data: { ...(n.data as Record<string, unknown>), ...data } } : n
            ),
          },
        });
      },

      addNode: (node) => {
        const wf = get().currentWorkflow;
        if (!wf) {
          set({
            currentWorkflow: {
              id: crypto.randomUUID(),
              name: get().workflowName,
              nodes: [node],
              edges: [],
              isTemplate: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          });
        } else {
          set({
            currentWorkflow: {
              ...wf,
              nodes: [...wf.nodes, node],
              updatedAt: new Date().toISOString(),
            },
          });
        }
      },

      removeNode: (nodeId) => {
        const wf = get().currentWorkflow;
        if (!wf) return;
        set({
          currentWorkflow: {
            ...wf,
            nodes: wf.nodes.filter((n) => n.id !== nodeId),
            edges: wf.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
            updatedAt: new Date().toISOString(),
          },
        });
      },

      addEdge: (edge) => {
        const wf = get().currentWorkflow;
        if (!wf) return;
        // Prevent duplicates
        if (wf.edges.some((e) => e.source === edge.source && e.target === edge.target)) return;
        set({
          currentWorkflow: {
            ...wf,
            edges: [...wf.edges, edge],
            updatedAt: new Date().toISOString(),
          },
        });
      },

      removeEdge: (source, target) => {
        const wf = get().currentWorkflow;
        if (!wf) return;
        set({
          currentWorkflow: {
            ...wf,
            edges: wf.edges.filter((e) => !(e.source === source && e.target === target)),
            updatedAt: new Date().toISOString(),
          },
        });
      },

      resetWorkflow: () =>
        set({
          currentWorkflow: null,
          workflowName: "My Workflow",
          selectedNodeId: null,
        }),
    }),
    {
      name: "workflow-storage",
    }
  )
);
