// ========================================
// AI Stack Hub — Shared Type Definitions
// ========================================

// ---------- Tool ----------
export interface ToolDTO {
  id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  pricing: "free" | "freemium" | "paid" | "enterprise";
  price?: number;
  rating?: number;
  reviewCount?: number;
  categories: string[];
  capabilities: string[];
  bestFor?: string;
  pros?: string[];
  cons?: string[];
  createdAt: string;
  updatedAt: string;
}

// ---------- Task ----------
export interface TaskDTO {
  id: string;
  title: string;
  description?: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  toolCount: number;
  output?: string;
  icon?: string;
  popularWorkflows?: number;
  createdAt: string;
}

// ---------- Workflow ----------
export interface WorkflowNode {
  id: string;
  type: "input" | "tool" | "output";
  toolId?: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

export interface WorkflowEdge {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface WorkflowDTO {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  estimatedCost?: number;
  estimatedTime?: number;
  isTemplate: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------- Tool Relation (Graph) ----------
export interface ToolGraphNode {
  id: string;
  name: string;
  category: string;
  logo?: string;
  size?: number;
}

export interface ToolGraphEdge {
  source: string;
  target: string;
  relationType: "alternative" | "complement" | "combo";
}

export interface ToolGraphData {
  nodes: ToolGraphNode[];
  edges: ToolGraphEdge[];
}

// ---------- Article ----------
export interface ArticleDTO {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: string;
  coverImage?: string;
  tags: string[];
  readTime?: number;
  publishedAt: string;
  createdAt: string;
}

// ---------- User ----------
export interface UserDTO {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  savedTools: string[];
  savedWorkflows: string[];
  createdAt: string;
}

// ---------- API Response ----------
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

// ---------- Compare Engine ----------
export interface CompareRequest {
  toolIds: string[];
  criteria?: string[];
}

export interface CompareResult {
  tool: ToolDTO;
  scores: Record<string, number>;
  overallScore: number;
  recommendation: string;
}

// ---------- Decision Engine ----------
export interface DecisionRequest {
  task: string;
  requirements?: string[];
  budget?: "free" | "low" | "medium" | "high";
}

export interface DecisionResult {
  recommendedWorkflow: WorkflowDTO;
  alternativeTools: ToolDTO[];
  reasoning: string;
}
