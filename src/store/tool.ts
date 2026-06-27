import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ToolDTO } from "@/types";

interface ToolState {
  // Tool data
  tools: ToolDTO[];
  selectedTool: ToolDTO | null;
  compareList: ToolDTO[];

  // Filters
  searchQuery: string;
  categoryFilter: string | null;
  pricingFilter: string | null;
  sortBy: "rating" | "name" | "newest";

  // Actions
  setTools: (tools: ToolDTO[]) => void;
  setSelectedTool: (tool: ToolDTO | null) => void;
  addToCompare: (tool: ToolDTO) => void;
  removeFromCompare: (toolId: string) => void;
  clearCompare: () => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string | null) => void;
  setPricingFilter: (pricing: string | null) => void;
  setSortBy: (sort: "rating" | "name" | "newest") => void;

  // Computed
  getFilteredTools: () => ToolDTO[];
  getToolById: (id: string) => ToolDTO | undefined;
}

export const useToolStore = create<ToolState>()(
  persist(
    (set, get) => ({
      tools: [],
      selectedTool: null,
      compareList: [],
      searchQuery: "",
      categoryFilter: null,
      pricingFilter: null,
      sortBy: "rating",

      setTools: (tools) => set({ tools }),
      setSelectedTool: (tool) => set({ selectedTool: tool }),

      addToCompare: (tool) => {
        const list = get().compareList;
        if (list.length >= 4) return; // Max 4 tools for comparison
        if (list.some((t) => t.id === tool.id)) return;
        set({ compareList: [...list, tool] });
      },

      removeFromCompare: (toolId) =>
        set({ compareList: get().compareList.filter((t) => t.id !== toolId) }),

      clearCompare: () => set({ compareList: [] }),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setCategoryFilter: (category) => set({ categoryFilter: category }),
      setPricingFilter: (pricing) => set({ pricingFilter: pricing }),
      setSortBy: (sortBy) => set({ sortBy }),

      getFilteredTools: () => {
        const { tools, searchQuery, categoryFilter, pricingFilter, sortBy } = get();
        let filtered = [...tools];

        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (t) =>
              t.name.toLowerCase().includes(q) ||
              t.description.toLowerCase().includes(q) ||
              t.categories?.some((c) => c.toLowerCase().includes(q))
          );
        }

        if (categoryFilter) {
          filtered = filtered.filter((t) => t.categories?.includes(categoryFilter));
        }

        if (pricingFilter) {
          filtered = filtered.filter((t) => t.pricing === pricingFilter);
        }

        filtered.sort((a, b) => {
          switch (sortBy) {
            case "rating":
              return (b.rating || 0) - (a.rating || 0);
            case "name":
              return a.name.localeCompare(b.name);
            case "newest":
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            default:
              return 0;
          }
        });

        return filtered;
      },

      getToolById: (id) => get().tools.find((t) => t.id === id),
    }),
    {
      name: "tool-storage",
      partialize: (state) => ({
        compareList: state.compareList,
      }),
    }
  )
);
