import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserDTO } from "@/types";

interface UserState {
  user: UserDTO | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  setUser: (user: UserDTO | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  saveTool: (toolId: string) => void;
  unsaveTool: (toolId: string) => void;
  saveWorkflow: (workflowId: string) => void;
  unsaveWorkflow: (workflowId: string) => void;
  isToolSaved: (toolId: string) => boolean;
  isWorkflowSaved: (workflowId: string) => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user, error: null }),

      setLoading: (isLoading) => set({ isLoading }),

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
          });

          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || "Login failed");
          }

          const data = await response.json();
          set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Login failed";
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      saveTool: (toolId) => {
        const user = get().user;
        if (!user) return;
        if (user.savedTools.includes(toolId)) return;
        set({
          user: { ...user, savedTools: [...user.savedTools, toolId] },
        });
      },

      unsaveTool: (toolId) => {
        const user = get().user;
        if (!user) return;
        set({
          user: { ...user, savedTools: user.savedTools.filter((id) => id !== toolId) },
        });
      },

      saveWorkflow: (workflowId) => {
        const user = get().user;
        if (!user) return;
        if (user.savedWorkflows.includes(workflowId)) return;
        set({
          user: { ...user, savedWorkflows: [...user.savedWorkflows, workflowId] },
        });
      },

      unsaveWorkflow: (workflowId) => {
        const user = get().user;
        if (!user) return;
        set({
          user: {
            ...user,
            savedWorkflows: user.savedWorkflows.filter((id) => id !== workflowId),
          },
        });
      },

      isToolSaved: (toolId) => get().user?.savedTools.includes(toolId) || false,
      isWorkflowSaved: (workflowId) =>
        get().user?.savedWorkflows.includes(workflowId) || false,
    }),
    {
      name: "user-storage",
    }
  )
);
