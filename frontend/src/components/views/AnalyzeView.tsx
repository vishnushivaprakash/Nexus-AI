import React from 'react';
import { BarChart3 } from 'lucide-react';

interface AnalyzeViewProps {
  analysisStatus: string;
  analysisProgress: number;
  setCurrentStep: (step: any) => void;
}

export default function AnalyzeView({
  analysisStatus,
  analysisProgress,
  setCurrentStep
}: AnalyzeViewProps) {
  return (
    <div className="flex-1 p-12 flex flex-col items-center justify-center text-center">
      <div className="relative mb-8 animate-float">
        <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full" />
        <div className="w-24 h-24 glass rounded-full flex items-center justify-center relative border border-primary/50 shadow-[0_0_30px_rgba(139,92,246,0.4)]">
          <BarChart3 className="w-10 h-10 text-primary animate-pulse" />
        </div>
      </div>
      <h2 className="text-3xl font-bold mb-4 text-white">Analyzing Data</h2>
      <p className="text-muted-foreground mb-10 max-w-md text-lg">
        Nexus AI agents are currently profiling your dataset, computing statistics, and identifying key business metrics.
      </p>
      
      <div className="w-full max-w-lg glass rounded-full h-3 overflow-hidden p-[1px] border border-white/10">
        <div 
          className="bg-gradient-to-r from-primary to-blue-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(139,92,246,0.8)] relative" 
          style={{ width: `${analysisProgress}%` }} 
        >
          <div className="absolute top-0 bottom-0 left-0 right-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress_1s_linear_infinite]" />
        </div>
      </div>
      <p className="text-sm font-mono text-primary mt-6 uppercase tracking-widest font-semibold">{analysisStatus}</p>

      <button 
        onClick={() => setCurrentStep('dashboard')}
        className="mt-16 text-xs text-muted-foreground/50 hover:text-white transition-colors"
      >
        [Dev: Skip to Insights]
      </button>
    </div>
  );
}
