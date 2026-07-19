import React from 'react';
import { FileText, CheckCircle2, FileDown, ArrowRight, BarChart3 } from 'lucide-react';

interface ReportsViewProps {
  setFiles: (files: File[]) => void;
  setCurrentStep: (step: any) => void;
}

export default function ReportsView({ setFiles, setCurrentStep }: ReportsViewProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-500">
      <div className="w-20 h-20 rounded-full glass border border-green-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
        <CheckCircle2 className="w-10 h-10 text-green-400" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-4">Analysis Complete</h2>
      <p className="text-muted-foreground text-center max-w-md mb-10">
        Nexus AI has finished generating insights, detecting anomalies, and producing forecasts. Your executive report is ready for export.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        <button 
          onClick={() => window.open('http://localhost:8000/api/export/pdf', '_blank')}
          className="flex-1 glass text-white border border-white/10 px-6 py-4 rounded-xl font-bold text-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/30 flex flex-col items-center gap-2"
        >
          <FileDown className="w-6 h-6" />
          Export PDF Report
        </button>
        <button 
          onClick={() => window.open('http://localhost:8000/api/export/excel', '_blank')}
          className="flex-1 glass text-white border border-white/10 px-6 py-4 rounded-xl font-bold text-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/30 flex flex-col items-center gap-2"
        >
          <BarChart3 className="w-6 h-6" />
          Export Excel
        </button>
      </div>

      <button 
        onClick={() => { setFiles([]); setCurrentStep('upload'); }}
        className="mt-16 text-sm font-semibold text-muted-foreground hover:text-white transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5"
      >
        <ArrowRight className="w-4 h-4 rotate-180" /> Start new analysis
      </button>
    </div>
  );
}
