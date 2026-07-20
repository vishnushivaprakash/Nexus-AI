import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAgentStore, Agent } from '@/store/agentStore';
import { 
  Database, Code, Activity, PieChart, Lightbulb, 
  ShieldAlert, TrendingUp, Target, BrainCircuit, FileText,
  CheckCircle2, AlertCircle, Loader2, Play
} from 'lucide-react';
import clsx from 'clsx';

const AGENT_ICONS: Record<string, React.ElementType> = {
  data: Database,
  sql: Code,
  analysis: Activity,
  visualization: PieChart,
  insight: Lightbulb,
  anomaly: ShieldAlert,
  predictive: TrendingUp,
  recommendation: Target,
  reasoning: BrainCircuit,
  report: FileText
};

export default function AgentWorkflowBar() {
  const agents = useAgentStore((state) => state.agents);
  const activeAgentId = useAgentStore((state) => state.activeAgentId);
  const setActiveAgentId = useAgentStore((state) => state.setActiveAgentId);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the running agent
  useEffect(() => {
    const runningAgentIndex = agents.findIndex(a => a.status === 'running');
    if (runningAgentIndex !== -1 && scrollRef.current) {
      const cardWidth = 200; // Approximate width of a card + gap
      scrollRef.current.scrollTo({
        left: runningAgentIndex * cardWidth,
        behavior: 'smooth'
      });
    }
  }, [agents]);

  return (
    <div className="w-full border-b border-white/10 bg-black/40 backdrop-blur-md p-2 shadow-lg">
      <div className="flex items-center gap-2 mb-1 px-2">
        <BrainCircuit className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Nexora Agent Swarm</h3>
        <span className="text-[10px] text-muted-foreground ml-2 px-2 py-0.5 rounded-full border border-white/10 bg-white/5">Multi-Agent Workflow Active</span>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 pt-1 px-2 snap-x scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        {agents.map((agent, index) => {
          const Icon = AGENT_ICONS[agent.id] || Database;
          const isRunning = agent.status === 'running';
          const isCompleted = agent.status === 'completed';
          const isError = agent.status === 'error';
          const isNotUsed = agent.status === 'not_used';
          const isSelected = activeAgentId === agent.id;
          
          return (
            <motion.div
              key={agent.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setActiveAgentId(agent.id)}
              className={clsx(
                "shrink-0 w-48 p-3 rounded-lg border cursor-pointer transition-all duration-300 snap-center relative overflow-hidden group",
                isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-black" : "hover:border-white/30",
                isNotUsed && "glass border-white/10 opacity-70",
                isRunning && "bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
                isCompleted && "bg-green-500/10 border-green-500/50",
                isError && "bg-red-500/10 border-red-500/50"
              )}
            >
              {/* Background pulse for running state */}
              {isRunning && (
                <div className="absolute inset-0 bg-blue-500/10 animate-pulse pointer-events-none" />
              )}
              
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className={clsx(
                  "p-2 rounded-lg flex items-center justify-center transition-colors",
                  isNotUsed && "bg-white/10 text-white/50",
                  isRunning && "bg-blue-500/20 text-blue-400",
                  isCompleted && "bg-green-500/20 text-green-400",
                  isError && "bg-red-500/20 text-red-400"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                
                {/* Status Icons */}
                <div className="flex items-center justify-center">
                  {isNotUsed && <div className="w-2 h-2 rounded-full bg-white/20" />}
                  {isRunning && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                  {isError && <AlertCircle className="w-4 h-4 text-red-400" />}
                </div>
              </div>
              
              <div className="relative z-10">
                <h4 className={clsx(
                  "text-xs font-bold mb-0.5 transition-colors",
                  (isRunning || isCompleted) ? "text-white" : "text-white/70"
                )}>
                  {agent.name}
                </h4>
                <p className="text-[10px] text-muted-foreground line-clamp-1 leading-tight">
                  {agent.purpose}
                </p>
              </div>
              
              {/* Connecting lines between cards */}
              {index < agents.length - 1 && (
                <div className="absolute -right-4 top-1/2 w-4 h-[2px] bg-white/10 -translate-y-1/2" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
