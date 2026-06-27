"use client";

import React, { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { twMerge } from "tailwind-merge";
import type { WorkflowDTO, WorkflowNode as WNode } from "@/types";
import CustomToolNode from "./WorkflowNode";

interface WorkflowCanvasProps {
  workflow?: WorkflowDTO;
  onChange?: (nodes: Node[], edges: Edge[]) => void;
  className?: string;
  readOnly?: boolean;
}

// React Flow 要求的节点数据格式
interface ToolNodeData {
  label: string;
  toolId?: string;
  nodeType: "input" | "tool" | "output";
  icon?: string;
}

const nodeTypes: NodeTypes = {
  toolNode: CustomToolNode,
};

function convertToReactFlowNodes(workflowNodes: WNode[]): Node<ToolNodeData>[] {
  return workflowNodes.map((n) => ({
    id: n.id,
    type: "toolNode",
    position: n.position || { x: Math.random() * 400, y: Math.random() * 300 },
    data: {
      label: (n.data?.label as string) || n.type,
      toolId: n.toolId,
      nodeType: n.type,
      icon: n.data?.icon as string,
    },
  }));
}

export default function WorkflowCanvas({
  workflow,
  onChange,
  className,
  readOnly = false,
}: WorkflowCanvasProps) {
  const initialNodes = useMemo(
    () => (workflow?.nodes ? convertToReactFlowNodes(workflow.nodes) : getDefaultNodes()),
    [workflow?.nodes]
  );
  const initialEdges = useMemo(
    () =>
      workflow?.edges?.map((e) => ({
        id: `${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
        animated: true,
        style: { stroke: "#6366F1", strokeWidth: 2 },
      })) || [],
    [workflow?.edges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (readOnly) return;
      setEdges((eds) => {
        const newEdges = addEdge(
          { ...connection, animated: true, style: { stroke: "#6366F1", strokeWidth: 2 } },
          eds
        );
        onChange?.(nodes, newEdges);
        return newEdges;
      });
    },
    [nodes, setEdges, onChange, readOnly]
  );

  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange(changes);
      // Debounce would be better in production
      setTimeout(() => {
        setNodes((currentNodes) => {
          onChange?.(currentNodes, edges);
          return currentNodes;
        });
      }, 100);
    },
    [onNodesChange, edges, onChange]
  );

  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChange(changes);
      setTimeout(() => {
        setEdges((currentEdges) => {
          onChange?.(nodes, currentEdges);
          return currentEdges;
        });
      }, 100);
    },
    [onEdgesChange, nodes, onChange]
  );

  return (
    <div
      className={twMerge(
        "w-full h-[600px] rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden bg-gray-50/50 dark:bg-gray-800/50",
        className
      )}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e2e8f0" />
        <Controls className="!rounded-xl !shadow-lg !border-gray-100" />
        <MiniMap
          className="!rounded-xl !shadow-lg !border-gray-100"
          nodeStrokeColor="#6366F1"
          nodeColor={(n) => {
            const data = n.data as ToolNodeData | undefined;
            if (data?.nodeType === "input") return "#10B981";
            if (data?.nodeType === "output") return "#8B5CF6";
            return "#6366F1";
          }}
        />
      </ReactFlow>
    </div>
  );
}

function getDefaultNodes(): Node<ToolNodeData>[] {
  return [
    {
      id: "input-1",
      type: "toolNode",
      position: { x: 100, y: 250 },
      data: { label: "Input", nodeType: "input" },
    },
    {
      id: "tool-1",
      type: "toolNode",
      position: { x: 350, y: 150 },
      data: { label: "ChatGPT", nodeType: "tool", toolId: "chatgpt" },
    },
    {
      id: "tool-2",
      type: "toolNode",
      position: { x: 350, y: 350 },
      data: { label: "Canva", nodeType: "tool", toolId: "canva" },
    },
    {
      id: "output-1",
      type: "toolNode",
      position: { x: 600, y: 250 },
      data: { label: "Output", nodeType: "output" },
    },
  ];
}
