"use client";

import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import type { ToolGraphData, ToolGraphNode } from "@/types";
import ToolDetail from "../tool/ToolDetail";

interface ToolGraphProps {
  data?: ToolGraphData;
  className?: string;
  onNodeClick?: (node: ToolGraphNode) => void;
}

// Mock data for demo
const mockGraphData: ToolGraphData = {
  nodes: [
    { id: "chatgpt", name: "ChatGPT", category: "text", size: 80 },
    { id: "claude", name: "Claude", category: "text", size: 65 },
    { id: "gemini", name: "Gemini", category: "multimodal", size: 55 },
    { id: "midjourney", name: "Midjourney", category: "image", size: 70 },
    { id: "dalle", name: "DALL·E", category: "image", size: 50 },
    { id: "stablediffusion", name: "Stable Diffusion", category: "image", size: 45 },
    { id: "runway", name: "Runway", category: "video", size: 40 },
    { id: "pika", name: "Pika", category: "video", size: 35 },
    { id: "elevenlabs", name: "ElevenLabs", category: "audio", size: 45 },
    { id: "perplexity", name: "Perplexity", category: "search", size: 55 },
    { id: "notionai", name: "Notion AI", category: "productivity", size: 50 },
    { id: "githubcopilot", name: "GitHub Copilot", category: "code", size: 65 },
    { id: "cursor", name: "Cursor", category: "code", size: 55 },
    { id: "canva", name: "Canva", category: "design", size: 60 },
    { id: "jasper", name: "Jasper", category: "text", size: 40 },
  ],
  edges: [
    { source: "chatgpt", target: "claude", relationType: "alternative" },
    { source: "chatgpt", target: "midjourney", relationType: "complement" },
    { source: "chatgpt", target: "canva", relationType: "combo" },
    { source: "midjourney", target: "dalle", relationType: "alternative" },
    { source: "midjourney", target: "canva", relationType: "complement" },
    { source: "claude", target: "githubcopilot", relationType: "complement" },
    { source: "githubcopilot", target: "cursor", relationType: "alternative" },
    { source: "chatgpt", target: "perplexity", relationType: "complement" },
    { source: "midjourney", target: "runway", relationType: "complement" },
    { source: "runway", target: "pika", relationType: "alternative" },
    { source: "chatgpt", target: "notionai", relationType: "complement" },
    { source: "elevenlabs", target: "runway", relationType: "combo" },
    { source: "canva", target: "jasper", relationType: "complement" },
  ],
};

type ViewMode = "graph" | "category" | "capability";

export default function ToolGraph({ data, className, onNodeClick }: ToolGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("graph");
  const [selectedTool, setSelectedTool] = useState<ToolGraphNode | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const graphData = data || mockGraphData;

  // Simple canvas-based fallback visualization
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const categoryColors: Record<string, string> = {
    text: "#6366F1",
    image: "#EC4899",
    video: "#F59E0B",
    audio: "#10B981",
    search: "#3B82F6",
    productivity: "#8B5CF6",
    code: "#06B6D4",
    design: "#F97316",
    multimodal: "#14B8A6",
  };

  const relationColors: Record<string, string> = {
    alternative: "#F59E0B",
    complement: "#3B82F6",
    combo: "#10B981",
  };

  const relationLabels: Record<string, string> = {
    alternative: "Alternative",
    complement: "Complement",
    combo: "Combo",
  };

  const filteredNodes = searchTerm
    ? graphData.nodes.filter(
        (n) =>
          n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : graphData.nodes;

  const handleNodeClick = (node: ToolGraphNode) => {
    setSelectedTool(node);
    setDetailOpen(true);
    onNodeClick?.(node);
  };

  // Convert ToolGraphNode to ToolDTO for ToolDetail
  const selectedToolDTO = selectedTool
    ? {
        id: selectedTool.id,
        name: selectedTool.name,
        description: `A powerful ${selectedTool.category} tool`,
        pricing: "freemium" as const,
        categories: [selectedTool.category],
        capabilities: [selectedTool.category, "AI-powered"],
        rating: 4.5,
        pros: [],
        cons: [],
        createdAt: "",
        updatedAt: "",
      }
    : null;

  return (
    <div className={twMerge("space-y-4", className)}>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>

        {/* View mode toggles */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {(["graph", "category", "capability"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={twMerge(
                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
                viewMode === mode
                  ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Graph Visualization Area */}
      <div
        ref={containerRef}
        className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden"
        style={{ height: 550 }}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
              <span className="text-sm text-gray-400">Loading tool graph...</span>
            </div>
          </div>
        ) : viewMode === "graph" ? (
          /* Force-directed Graph View */
          <div className="w-full h-full p-8 flex items-center justify-center">
            <div className="relative w-full h-full max-w-3xl">
              {filteredNodes.map((node, index) => {
                const x = 30 + ((index * 137) % 70);
                const y = 15 + ((index * 89) % 70);
                const color = categoryColors[node.category] || "#6366F1";
                const size = (node.size || 40) / 2;

                return (
                  <div
                    key={node.id}
                    className="absolute transition-all duration-500 cursor-pointer hover:scale-110 hover:z-10 group"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: `translate(-50%, -50%)`,
                    }}
                    onClick={() => handleNodeClick(node)}
                  >
                    <div
                      className="flex flex-col items-center gap-1"
                      style={{ width: size, height: size }}
                    >
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg transition-shadow group-hover:shadow-xl"
                        style={{
                          backgroundColor: color,
                          boxShadow: `0 4px 14px ${color}40`,
                        }}
                      >
                        {node.name.substring(0, 3)}
                      </div>
                    </div>
                    <p className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 text-[10px] font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {node.name}
                    </p>
                  </div>
                );
              })}

              {/* Draw edges */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                {graphData.edges.map((edge) => {
                  const sourceNode = graphData.nodes.find((n) => n.id === edge.source);
                  const targetNode = graphData.nodes.find((n) => n.id === edge.target);
                  if (!sourceNode || !targetNode) return null;
                  if (
                    searchTerm &&
                    (!sourceNode.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                      !targetNode.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                    return null;

                  const sourceIndex = filteredNodes.indexOf(sourceNode);
                  const targetIndex = filteredNodes.indexOf(targetNode);
                  if (sourceIndex < 0 || targetIndex < 0) return null;

                  const sx = 30 + ((sourceIndex * 137) % 70);
                  const sy = 15 + ((sourceIndex * 89) % 70);
                  const tx = 30 + ((targetIndex * 137) % 70);
                  const ty = 15 + ((targetIndex * 89) % 70);

                  return (
                    <line
                      key={`${edge.source}-${edge.target}`}
                      x1={`${sx}%`}
                      y1={`${sy}%`}
                      x2={`${tx}%`}
                      y2={`${ty}%`}
                      stroke={relationColors[edge.relationType] || "#94A3B8"}
                      strokeWidth={1}
                      strokeOpacity={0.3}
                      strokeDasharray={edge.relationType === "alternative" ? "4 2" : "none"}
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        ) : (
          /* Category / Capability Grid View */
          <div className="p-6 overflow-y-auto h-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(
                filteredNodes.reduce<Record<string, ToolGraphNode[]>>((acc, node) => {
                  const key = viewMode === "category" ? node.category : node.category;
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(node);
                  return acc;
                }, {})
              ).map(([group, nodes]) => (
                <div key={group} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: categoryColors[group] || "#6366F1" }}
                    />
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">
                      {group}
                    </h4>
                  </div>
                  <div className="space-y-1.5 pl-5">
                    {nodes.map((node) => (
                      <button
                        key={node.id}
                        onClick={() => handleNodeClick(node)}
                        className="block w-full text-left text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                      >
                        {node.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex items-center gap-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl px-4 py-2 text-xs border border-gray-100 dark:border-gray-700/50">
          {Object.entries(relationColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-gray-500 dark:text-gray-400">{relationLabels[type]}</span>
            </div>
          ))}
        </div>

        {/* Node count */}
        <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-gray-100 dark:border-gray-700/50">
          {filteredNodes.length} tools
        </div>
      </div>

      {/* Tool Detail Panel */}
      <ToolDetail
        tool={selectedToolDTO}
        isOpen={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedTool(null);
        }}
        onAddToWorkflow={(t) => {
          console.log("Add to workflow:", t);
        }}
        onCompare={(t) => {
          console.log("Compare:", t);
        }}
      />
    </div>
  );
}
