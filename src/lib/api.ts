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

// Tools
export interface ToolDTO {
  id: string;
  name: string;
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

export interface ToolsResponse {
  data: {
    tools: ToolDTO[];
    total: number;
  };
}

export const api = {
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
      return fetchAPI<ToolsResponse>(`/api/v1/tools${query ? '?' + query : ''}`);
    },

    get: async (id: string) => {
      return fetchAPI<{ data: ToolDTO & { relationsAsSource: any[]; relationsAsTarget: any[]; workflows: any[] } }>(
        `/api/v1/tools/${id}`
      );
    },

    getAlternatives: async (id: string) => {
      return fetchAPI<{ data: any[] }>(`/api/v1/tools/${id}/alternatives`);
    },
  },

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
  },
};
