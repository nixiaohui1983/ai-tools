import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_COMPARE = 4;

interface CompareState {
  // Selected tool IDs for comparison
  toolIds: string[];

  // Actions
  addTool: (id: string) => void;
  removeTool: (id: string) => void;
  toggleTool: (id: string) => void;
  clearAll: () => void;
  isSelected: (id: string) => boolean;
  canAdd: () => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      toolIds: [],

      addTool: (id: string) => {
        const { toolIds } = get();
        if (toolIds.length >= MAX_COMPARE) return;
        if (toolIds.includes(id)) return;
        set({ toolIds: [...toolIds, id] });
      },

      removeTool: (id: string) => {
        set({ toolIds: get().toolIds.filter((tid) => tid !== id) });
      },

      toggleTool: (id: string) => {
        const { toolIds } = get();
        if (toolIds.includes(id)) {
          set({ toolIds: toolIds.filter((tid) => tid !== id) });
        } else {
          if (toolIds.length >= MAX_COMPARE) return;
          set({ toolIds: [...toolIds, id] });
        }
      },

      clearAll: () => set({ toolIds: [] }),

      isSelected: (id: string) => get().toolIds.includes(id),

      canAdd: () => get().toolIds.length < MAX_COMPARE,
    }),
    {
      name: "compare-storage",
    }
  )
);
