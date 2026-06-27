const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `API error: ${res.status}`);
  }

  return res.json();
}

// ============ Types ============

export interface ToolDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  website?: string;
  pricing?: string;
  price?: number;
  rating?: number;
  categories: string[];
  capabilities: { id: string; name: string }[];
  featured: boolean;
  createdAt: string;
}

export interface TaskDTO {
  id: string;
  title: string;
  slug: string;
  description?: string;
  difficulty: string;
  category: string;
  toolCount: number;
  output?: string;
  icon?: string;
  featured: boolean;
}

export interface WorkflowDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  nodes: any[];
  edges: any[];
  tools?: any[];
  estimatedCost?: number;
  estimatedTime?: number;
  timeSavedPct?: number;
  isTemplate: boolean;
  isPublic: boolean;
  featured: boolean;
}

export interface ArticleDTO {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
}

// ============ API Client ============

export const api = {
  // ---- Tools ----
  tools: {
    list: async (params?: {
      category?: string;
      search?: string;
      limit?: number;
      offset?: number;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set('category', params.category);
      if (params?.search) searchParams.set('search', params.search);
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.offset) searchParams.set('offset', String(params.offset));
      const query = searchParams.toString();
      return fetchAPI<{ data: { tools: ToolDTO[]; total: number } }>(
        `/api/v1/tools${query ? '?' + query : ''}`
      );
    },

    get: async (id: string) => {
      return fetchAPI<{ data: ToolDTO & { relationsAsSource: any[]; relationsAsTarget: any[]; workflows: any[] } }>(
        `/api/v1/tools/${id}`
      );
    },

    getAlternatives: async (id: string) => {
      return fetchAPI<{ data: any[] }>(`/api/v1/tools/${id}/alternatives`);
    },

    getRelations: async (id: string) => {
      return fetchAPI<{ data: { nodes: any[]; edges: any[] } }>(`/api/v1/tools/${id}/relations`);
    },
  },

  // ---- Tasks ----
  tasks: {
    list: async (params?: { category?: string; limit?: number; offset?: number }) => {
      const sp = new URLSearchParams();
      if (params?.category) sp.set('category', params.category);
      if (params?.limit) sp.set('limit', String(params.limit));
      if (params?.offset) sp.set('offset', String(params.offset));
      const q = sp.toString();
      return fetchAPI<{ data: { tasks: TaskDTO[]; total: number } }>(
        `/api/v1/tasks${q ? '?' + q : ''}`
      );
    },

    get: async (id: string) => {
      return fetchAPI<{ data: TaskDTO & { workflows: WorkflowDTO[] } }>(`/api/v1/tasks/${id}`);
    },

    getWorkflows: async (taskId: string) => {
      return fetchAPI<{ data: WorkflowDTO[] }>(`/api/v1/tasks/${taskId}/workflows`);
    },
  },

  // ---- Workflows ----
  workflows: {
    list: async (params?: { taskId?: string; limit?: number; offset?: number }) => {
      const sp = new URLSearchParams();
      if (params?.taskId) sp.set('taskId', params.taskId);
      if (params?.limit) sp.set('limit', String(params.limit));
      if (params?.offset) sp.set('offset', String(params.offset));
      const q = sp.toString();
      return fetchAPI<{ data: { workflows: WorkflowDTO[]; total: number } }>(
        `/api/v1/workflows${q ? '?' + q : ''}`
      );
    },

    get: async (id: string) => {
      return fetchAPI<{ data: WorkflowDTO }>(`/api/v1/workflows/${id}`);
    },
  },

  // ---- Articles ----
  articles: {
    list: async (params?: { category?: string; limit?: number; offset?: number }) => {
      const sp = new URLSearchParams();
      if (params?.category) sp.set('category', params.category);
      if (params?.limit) sp.set('limit', String(params.limit));
      if (params?.offset) sp.set('offset', String(params.offset));
      const q = sp.toString();
      return fetchAPI<{ data: { articles: ArticleDTO[]; total: number } }>(
        `/api/v1/articles${q ? '?' + q : ''}`
      );
    },

    get: async (id: string) => {
      return fetchAPI<{ data: ArticleDTO }>(`/api/v1/articles/${id}`);
    },
  },

  // ---- Decision Engine ----
  decision: {
    compare: async (toolIds: string[]) => {
      return fetchAPI<{
        data: {
          tools: { id: string; name: string; pricing?: string; price?: number; rating?: number }[];
          matrix: Record<string, Record<string, number>>;
        };
      }>(`/api/v1/decision/compare`, {
        method: 'POST',
        body: JSON.stringify({ toolIds }),
      });
    },

    recommend: async (params: {
      task?: string;
      budget?: number;
      categories?: string[];
    }) => {
      return fetchAPI<{ data: (ToolDTO & { relevanceScore?: number })[] }>(
        `/api/v1/decision/recommend-tools`,
        {
          method: 'POST',
          body: JSON.stringify(params),
        }
      );
    },

    generateWorkflow: async (params: { taskId: string; preferences?: any }) => {
      return fetchAPI<{ data: WorkflowDTO }>(`/api/v1/decision/generate-workflow`, {
        method: 'POST',
        body: JSON.stringify(params),
      });
    },
  },
};
