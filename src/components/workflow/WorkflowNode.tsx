"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { twMerge } from "tailwind-merge";

interface ToolNodeData {
  label: string;
  nodeType: "input" | "tool" | "output";
  icon?: string;
}

const nodeStyles = {
  input: {
    bg: "from-emerald-400 to-green-500",
    border: "border-emerald-300",
    shadow: "shadow-emerald-500/30",
    text: "text-white",
  },
  tool: {
    bg: "from-primary-400 to-indigo-500",
    border: "border-primary-300",
    shadow: "shadow-primary-500/30",
    text: "text-white",
  },
  output: {
    bg: "from-purple-400 to-violet-500",
    border: "border-purple-300",
    shadow: "shadow-purple-500/30",
    text: "text-white",
  },
};

function WorkflowNode({ data, selected }: NodeProps<ToolNodeData>) {
  const style = nodeStyles[data.nodeType] || nodeStyles.tool;
  const isInput = data.nodeType === "input";
  const isOutput = data.nodeType === "output";

  return (
    <div
      className={twMerge(
        "px-5 py-3 rounded-2xl bg-gradient-to-br border-2 shadow-lg min-w-[140px]",
        "transition-all duration-200",
        style.bg,
        style.border,
        style.shadow,
        selected && "ring-2 ring-offset-2 ring-primary-400 scale-105"
      )}
    >
      {/* Input handle (except for input nodes) */}
      {!isInput && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-white !border-2 !border-primary-400"
        />
      )}

      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-xs font-bold">
          {data.icon || data.label.charAt(0)}
        </div>
        <span className={twMerge("font-semibold text-sm", style.text)}>
          {data.label}
        </span>
      </div>

      {/* Output handle (except for output nodes) */}
      {!isOutput && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-white !border-2 !border-primary-400"
        />
      )}
    </div>
  );
}

export default memo(WorkflowNode);
