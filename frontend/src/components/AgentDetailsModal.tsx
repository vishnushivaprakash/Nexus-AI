import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgentStore } from '@/store/agentStore';
import { 
  X, Clock, ShieldCheck, Database, Code, Activity, 
  PieChart, Lightbulb, ShieldAlert, TrendingUp, Target, 
  BrainCircuit, FileText
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

export default function AgentDetailsModal() {
  const activeAgentId = useAgentStore(state => state.activeAgentId);
  const setActiveAgentId = useAgentStore(state => state.setActiveAgentId);
  const agent = useAgentStore(state => state.agents.find(a => a.id === activeAgentId));

  if (!activeAgentId) return null;

  const closePanel = () => setActiveAgentId(null);
  const Icon = agent ? AGENT_ICONS[agent.id] || Database : Database;

  return (
    <AnimatePresence>
      {agent && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePanel}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          
          {/* Side Panel */}
          <motion.div 
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0f] border-l border-white/10 z-50 overflow-y-auto shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0a0a0f]/90 backdrop-blur-md z-10">
              <div className="flex items-center gap-4">
                <div className={clsx(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  agent.status === 'not_used' && "bg-white/5 text-white/50",
                  agent.status === 'running' && "bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
                  agent.status === 'completed' && "bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]",
                  agent.status === 'error' && "bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{agent.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={clsx(
                      "text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                      agent.status === 'not_used' && "bg-white/5 border-white/10 text-white/50",
                      agent.status === 'running' && "bg-blue-500/10 border-blue-500/20 text-blue-400",
                      agent.status === 'completed' && "bg-green-500/10 border-green-500/20 text-green-400",
                      agent.status === 'error' && "bg-red-500/10 border-red-500/20 text-red-400"
                    )}>
                      {agent.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={closePanel} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col gap-8">
              {/* Purpose */}
              <section>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Agent Responsibility
                </h3>
                <div className="glass p-4 rounded-xl border border-white/5 text-sm text-white/90 leading-relaxed">
                  {agent.purpose}
                </div>
              </section>

              {/* Metrics */}
              {agent.details?.metrics && (
                <section>
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Performance Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {agent.details.metrics.confidenceScore && (
                      <div className="glass p-4 rounded-xl border border-white/5 flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground uppercase">Confidence</span>
                        <span className="text-xl font-bold text-green-400">{agent.details.metrics.confidenceScore}%</span>
                      </div>
                    )}
                    {agent.details.metrics.processingTime && (
                      <div className="glass p-4 rounded-xl border border-white/5 flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground uppercase">Exec Time</span>
                        <span className="text-xl font-bold text-blue-400 flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {agent.details.metrics.processingTime}
                        </span>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Processing Steps */}
              {agent.status !== 'not_used' && (
                <section>
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3 flex items-center gap-2">
                    <Code className="w-4 h-4" /> Processing Details
                  </h3>
                  <div className="glass p-4 rounded-xl border border-white/5 font-mono text-xs text-white/70 space-y-2">
                    {agent.status === 'running' ? (
                      <div className="flex items-center gap-2 text-blue-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        Awaiting execution payload...
                      </div>
                    ) : (
                      <>
                        <div className="text-green-400">✓ Received payload from previous agent</div>
                        <div className="text-green-400">✓ Validated input schema</div>
                        <div className="text-green-400">✓ Executed core logic ({agent.details?.metrics?.processingTime || '520ms'})</div>
                        <div className="text-green-400">✓ Passed output to next agent</div>
                      </>
                    )}
                  </div>
                </section>
              )}

              {/* Agent Specific Dummy Content for Preview */}
              {agent.status === 'completed' && agent.id === 'sql' && (
                <section>
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">Generated SQL</h3>
                  <div className="bg-black/60 p-4 rounded-xl border border-white/10 font-mono text-xs text-blue-300">
                    SELECT region, SUM(revenue) as total_revenue<br/>
                    FROM sales_data<br/>
                    GROUP BY region<br/>
                    ORDER BY total_revenue DESC;
                  </div>
                </section>
              )}
              
              {agent.status === 'completed' && agent.id === 'pandas' && agent.details?.specificData?.code && (
                <section>
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">Generated Pandas Code</h3>
                  <div className="bg-black/60 p-4 rounded-xl border border-white/10 font-mono text-xs text-green-300 whitespace-pre-wrap overflow-x-auto">
                    {agent.details.specificData.code}
                  </div>
                </section>
              )}
              
              {agent.status === 'completed' && agent.id === 'reasoning' && (
                <section>
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">LLM Thought Process</h3>
                  <div className="glass p-4 rounded-xl border border-white/5 text-xs text-white/80 space-y-3">
                    <p><span className="text-primary font-bold">1. Understand Request:</span> User asked for highest revenue generating region.</p>
                    <p><span className="text-primary font-bold">2. Analyze Data:</span> SQL Agent returned North America ($5.2M) and Europe ($3.1M).</p>
                    <p><span className="text-primary font-bold">3. Synthesize:</span> North America is the top performer. Draft response explaining this with the 55% contribution context from Insight Agent.</p>
                  </div>
                </section>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
