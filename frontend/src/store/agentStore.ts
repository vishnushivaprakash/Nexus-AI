import { create } from 'zustand';

export type AgentStatus = 'not_used' | 'running' | 'completed' | 'error';

export interface AgentDetails {
  inputs?: any;
  outputs?: any;
  processingSteps?: string[];
  metrics?: {
    confidenceScore?: number;
    processingTime?: string;
    accuracy?: number;
    [key: string]: any;
  };
  specificData?: any; // For agent-specific payloads like anomalies, forecasts, SQL queries
}

export interface Agent {
  id: string;
  name: string;
  purpose: string;
  status: AgentStatus;
  executionTime?: string;
  details: AgentDetails;
}

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'data',
    name: 'Data Agent',
    purpose: 'Ingests, parses, and cleans the uploaded dataset.',
    status: 'not_used',
    details: {}
  },
  {
    id: 'sql',
    name: 'SQL Agent',
    purpose: 'Translates natural language questions into executable SQL queries.',
    status: 'not_used',
    details: {}
  },
  {
    id: 'pandas',
    name: 'Pandas Agent',
    purpose: 'Writes and executes dynamic Python Pandas code for complex calculations.',
    status: 'not_used',
    details: {}
  },
  {
    id: 'analysis',
    name: 'Analysis Agent',
    purpose: 'Performs statistical calculations and identifies trends.',
    status: 'not_used',
    details: {}
  },
  {
    id: 'visualization',
    name: 'Visualization Agent',
    purpose: 'Determines the optimal chart types and renders visual findings.',
    status: 'not_used',
    details: {}
  },
  {
    id: 'insight',
    name: 'Insight Agent',
    purpose: 'Generates business context, explaining what happened and why.',
    status: 'not_used',
    details: {}
  },
  {
    id: 'anomaly',
    name: 'Anomaly Agent',
    purpose: 'Detects statistical outliers and expected vs actual variance.',
    status: 'not_used',
    details: {}
  },
  {
    id: 'predictive',
    name: 'Predictive Analytics Agent',
    purpose: 'Forecasts future trends and predicts upcoming growth patterns.',
    status: 'not_used',
    details: {}
  },
  {
    id: 'recommendation',
    name: 'Recommendation Agent',
    purpose: 'Suggests actionable business decisions based on data.',
    status: 'not_used',
    details: {}
  },
  {
    id: 'reasoning',
    name: 'Reasoning Agent',
    purpose: 'Provides final LLM-based logical deduction and synthesis.',
    status: 'not_used',
    details: {}
  },
  {
    id: 'report',
    name: 'Report Agent',
    purpose: 'Compiles all findings into exportable executive summaries.',
    status: 'not_used',
    details: {}
  }
];

interface AgentStore {
  agents: Agent[];
  activeAgentId: string | null;
  setActiveAgentId: (id: string | null) => void;
  setAgentStatus: (id: string, status: AgentStatus) => void;
  setAgentDetails: (id: string, details: Partial<AgentDetails>) => void;
  resetAgents: () => void;
  simulateWorkflow: (query: string) => Promise<void>;
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: [...INITIAL_AGENTS],
  activeAgentId: null,
  
  setActiveAgentId: (id) => set({ activeAgentId: id }),
  
  setAgentStatus: (id, status) => set((state) => ({
    agents: state.agents.map(a => a.id === id ? { ...a, status } : a)
  })),
  
  setAgentDetails: (id, details) => set((state) => ({
    agents: state.agents.map(a => 
      a.id === id ? { ...a, details: { ...a.details, ...details } } : a
    )
  })),
  
  resetAgents: () => set({ agents: [...INITIAL_AGENTS].map(a => ({...a})), activeAgentId: null }),
  
  simulateWorkflow: async (query: string) => {
    const store = get();
    store.resetAgents();
    
    const q = query.toLowerCase();
    
    // Determine which agents to activate based on the query
    let agentsToRun = ['data', 'sql', 'pandas', 'analysis', 'insight', 'reasoning'];
    
    if (q.includes('revenue') || q.includes('top') || q.includes('region') || q.includes('how') || q.includes('what') || q.includes('popular')) {
      agentsToRun = ['data', 'sql', 'pandas', 'analysis', 'visualization', 'insight', 'reasoning'];
    } else if (q.includes('anomal') || q.includes('spike')) {
      agentsToRun = ['data', 'sql', 'pandas', 'analysis', 'anomaly', 'insight', 'reasoning'];
    } else if (q.includes('forecast') || q.includes('predict') || q.includes('future') || q.includes('month')) {
      agentsToRun = ['data', 'sql', 'pandas', 'analysis', 'predictive', 'visualization', 'insight', 'reasoning'];
    } else if (q.includes('report') || q.includes('summary')) {
      agentsToRun = ['data', 'sql', 'pandas', 'analysis', 'insight', 'recommendation', 'report'];
    }
    
    // Mock sequential execution
    for (const id of agentsToRun) {
      // Set to running
      store.setAgentStatus(id, 'running');
      
      // Simulate processing time
      const delay = Math.floor(Math.random() * 800) + 400; // 400 - 1200ms
      await new Promise(r => setTimeout(r, delay));
      
      // Populate mock data depending on the agent
      const metrics = {
        confidenceScore: 85 + Math.floor(Math.random() * 14),
        processingTime: `${delay}ms`
      };
      
      // Complete
      store.setAgentDetails(id, { metrics });
      store.setAgentStatus(id, 'completed');
    }
  }
}));
