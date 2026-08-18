export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  prescriptions?: Prescription[];
  sources?: string[];
}

export interface Prescription {
  id: string;
  title: string;
  description: string;
  category: 'rutinas' | 'rabietas' | 'pantallas' | 'estudio' | 'miedos' | 'limites' | 'general';
  assignedDate: string;
  completed: boolean;
  notes?: string;
}

export interface CaseProfile {
  id: string;
  title: string; // ej. "Familia Gómez - Pablo (8 años)"
  childName?: string;
  childAge?: string;
  mainIssue: string; // ej. "Rabietas y negación a apagar la tablet"
  attemptedSolutions: string[]; // Soluciones intentadas que fallaron (repetir órdenes, castigos, etc.)
  prescriptions: Prescription[];
  notes: string[];
  createdAt: number;
  updatedAt: number;
}

export interface ChatSession {
  id: string;
  caseId: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface AppSettings {
  geminiApiKey: string;
  modelName: string;
  enableSearchGrounding: boolean;
  githubToken?: string;
  githubRepo?: string; // ej. "dga80/BreveApp"
  githubBranch?: string; // ej. "main"
  syncEnabled?: boolean;
  lastSyncTime?: number;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  source: string;
  category: string;
  problem: string;
  attemptedSolutionFailed: string;
  strategicReframing: string;
  prescription: string;
  keyRule: string;
}
