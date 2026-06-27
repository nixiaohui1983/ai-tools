"use client";

import { ToolGraph } from "@/components/graph";
import type { ToolGraphNode } from "@/types";

export default function ToolGraphPage() {
  const handleNodeClick = (node: ToolGraphNode) => {
    console.log("Selected node:", node.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary dark:text-white mb-2">
          Tool Graph
        </h1>
        <p className="text-text-secondary dark:text-gray-400">
          Explore AI tool relationships and discover new combinations
        </p>
      </div>

      <ToolGraph onNodeClick={handleNodeClick} />
    </div>
  );
}
