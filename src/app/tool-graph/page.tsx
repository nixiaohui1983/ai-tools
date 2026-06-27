"use client";

import { useState, useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";

// Register the dagre layout plugin
cytoscape.use(dagre);

export default function ToolGraphPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTool, setSelectedTool] = useState<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#6366F1",
            label: "data(name)",
            "text-valign": "center",
            "text-halign": "center",
            "font-size": "12px",
            color: "#1E293B",
            "text-outline-color": "#ffffff",
            "text-outline-width": 2,
          },
        },
        {
          selector: "node[isCenter]",
          style: {
            "background-color": "#06B6D4",
            width: 60,
            height: 60,
            "font-size": "14px",
            "font-weight": "bold",
          },
        },
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#cbd5e1",
            "target-arrow-color": "#cbd5e1",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
          },
        },
        {
          selector: "edge[relationType = 'alternative']",
          style: {
            "line-style": "dashed",
            "line-color": "#f59e0b",
          },
        },
        {
          selector: "edge[relationType = 'combo']",
          style: {
            "line-color": "#10b981",
            "target-arrow-color": "#10b981",
          },
        },
      ],
      layout: {
        name: "dagre",
        rankDir: "LR",
      } as any,
    });

    // Mock data - replace with API call
    const mockNodes = [
      { data: { id: "chatgpt", name: "ChatGPT", isCenter: true } },
      { data: { id: "perplexity", name: "Perplexity" } },
      { data: { id: "midjourney", name: "Midjourney" } },
      { data: { id: "zapier", name: "Zapier" } },
      { data: { id: "notion", name: "Notion AI" } },
      { data: { id: "grammarly", name: "Grammarly" } },
    ];

    const mockEdges = [
      { data: { source: "chatgpt", target: "perplexity", relationType: "combo" } },
      { data: { source: "chatgpt", target: "midjourney", relationType: "combo" } },
      { data: { source: "chatgpt", target: "zapier", relationType: "combo" } },
      { data: { source: "notion", target: "chatgpt", relationType: "alternative" } },
      { data: { source: "grammarly", target: "chatgpt", relationType: "combo" } },
    ];

    cy.add([...mockNodes, ...mockEdges]);

    cy.on("tap", "node", (evt: any) => {
      const node = evt.target;
      setSelectedTool({
        id: node.id(),
        name: node.data("name"),
        role: "Core LLM",
        bestFor: "writing, ideation",
      });
    });

    return () => cy.destroy();
  }, []);

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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Graph Visualization */}
        <div className="lg:col-span-3">
          <div
            ref={containerRef}
            className="w-full h-[600px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
        </div>

        {/* Tool Detail Panel */}
        <div className="lg:col-span-1">
          {selectedTool ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg text-text-primary dark:text-white mb-4">
                {selectedTool.name}
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-text-secondary dark:text-gray-400">Role: </span>
                  <span className="text-text-primary dark:text-white">{selectedTool.role}</span>
                </div>
                <div>
                  <span className="text-text-secondary dark:text-gray-400">Best for: </span>
                  <span className="text-text-primary dark:text-white">{selectedTool.bestFor}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-text-secondary dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                  Compare
                </button>
                <button className="flex-1 px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors">
                  Add to Workflow
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
              <p className="text-text-secondary dark:text-gray-400 text-sm">
                Click a node to view tool details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
