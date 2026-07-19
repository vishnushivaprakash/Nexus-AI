"use client";

import { useState, useEffect } from 'react';
import { Upload, BarChart3, Lightbulb, MessageSquare, FileText, ArrowRight, CheckCircle2, Sparkles, LogOut, Sun, Moon, LayoutGrid, CloudUpload, Settings, ShieldAlert, TrendingUp, PieChart, User, Bell, Lock, BrainCircuit } from 'lucide-react';
import clsx from 'clsx';
import { useDropzone } from 'react-dropzone';
import InsightsCenter from '@/components/InsightsCenter';
import AgentWorkflowBar from '@/components/AgentWorkflowBar';
import AgentDetailsModal from '@/components/AgentDetailsModal';
import { useAgentStore } from '@/store/agentStore';

import UploadView from '@/components/views/UploadView';
import AnalyzeView from '@/components/views/AnalyzeView';
import ChatView from '@/components/views/ChatView';
import SettingsView from '@/components/views/SettingsView';
import ReportsView from '@/components/views/ReportsView';

export type Step = 'dashboard' | 'chat' | 'data-quality' | 'forecasting' | 'upload' | 'analyze' | 'reports' | 'settings' | 'data-insights';

const SIDEBAR_ITEMS = [
  { id: 'upload', title: 'Upload', icon: CloudUpload },
  { id: 'dashboard', title: 'Dashboard', icon: LayoutGrid },
  { id: 'data-insights', title: 'Data Insights', icon: PieChart },
  { id: 'chat', title: 'Chat', icon: MessageSquare },
  { id: 'data-quality', title: 'Anomaly Detection', icon: ShieldAlert },
  { id: 'forecasting', title: 'Predictive Analytics', icon: TrendingUp },
  { id: 'reports', title: 'Reports', icon: BarChart3 },
  { id: 'settings', title: 'Settings', icon: Settings }
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [activeDatasetIndex, setActiveDatasetIndex] = useState(0);
  const [userEmail, setUserEmail] = useState<string>('user@example.com');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [isLightMode]);

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    }
  });

  const [analysisStatus, setAnalysisStatus] = useState("Initializing...");
  const [analysisProgress, setAnalysisProgress] = useState(0);

  type ChatMessage = { role: 'user' | 'ai'; text: string; code?: string };
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'user',
      text: 'What is the most popular product category in Europe?'
    },
    {
      role: 'ai',
      text: 'Based on the dataset, the most popular product category in Europe is **Enterprise Software Licenses**, making up 42% of total European sales volume.',
      code: "SELECT category, SUM(sales) FROM data WHERE region = 'Europe' GROUP BY category ORDER BY SUM(sales) DESC LIMIT 1;"
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    const simulateWorkflow = useAgentStore.getState().simulateWorkflow;

    try {
      // Run agent visualization
      await simulateWorkflow(userMsg);
      
      const activeData = analysisData?.datasets?.[activeDatasetIndex];
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg,
          dataset_name: activeData?.filename || ""
        })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'ai', text: data.answer, code: data.code }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'ai', text: 'Sorry, there was an error connecting to the AI agent.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleUploadSubmit = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    setCurrentStep('analyze');
    
    const ws = new WebSocket('ws://localhost:8000/ws/analysis-status');
    let wsCompleted = false;
    let fetchCompleted = false;
    let fetchedData: any = null;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === "Complete") {
        ws.close();
        wsCompleted = true;
        checkCompletion();
      } else {
        setAnalysisStatus(data.status);
        setAnalysisProgress(data.progress);
      }
    };

    try {
      const response = await fetch('http://localhost:8000/api/analyze/upload', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        fetchedData = await response.json();
      }
    } catch (e) {
      console.error(e);
    } finally {
      fetchCompleted = true;
      checkCompletion();
    }

    function checkCompletion() {
      if (wsCompleted && fetchCompleted) {
        setAnalysisData(fetchedData);
        setActiveDatasetIndex(fetchedData?.datasets?.length ? fetchedData.datasets.length - 1 : 0);
        setCurrentStep('dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col font-sans relative overflow-hidden">
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

      {/* Top Navigation */}
      <header className="h-16 glass border-b-0 flex items-center px-8 justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(139,92,246,0.4)]">
            N
          </div>
          <span className="font-bold tracking-tight text-xl text-glow">Nexus AI</span>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium">
          <button className="hover:text-white transition-colors">Documentation</button>
          <button className="hover:text-white transition-colors">Support</button>
          <button onClick={() => setIsLightMode(!isLightMode)} className="w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors shadow-md" title="Toggle Theme">
            {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button onClick={() => window.location.href = '/login'} className="w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors shadow-md" title="Log out">
            <LogOut className="w-4 h-4" />
          </button>
          <div className="w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-white/10 transition-colors">
            U
          </div>
        </div>
      </header>

      {/* Multi-Agent Visualizer */}
      {currentStep === 'chat' && <AgentWorkflowBar />}

      {/* Main Layout Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 glass-card border-r border-white/10 flex flex-col py-6 z-20 hidden md:flex shrink-0">
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentStep === item.id || (item.id === 'upload' && currentStep === 'analyze');
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentStep(item.id as Step)}
                  className={clsx(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold tracking-wide",
                    isActive 
                      ? "bg-gradient-to-r from-primary/80 to-blue-600/80 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className={clsx("w-5 h-5", isActive ? "text-white" : "text-primary/70")} />
                  {item.title}
                </button>
              );
            })}
          </nav>
          
          <div className="px-4 mt-auto">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20">
              <h4 className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">Storage Used</h4>
              <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-primary w-[45%]" />
              </div>
              <p className="text-[10px] text-muted-foreground font-medium">4.5 GB of 10 GB (45%)</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-10 relative z-10 flex flex-col overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col">
            
            {/* Content Area Box */}
            <div className="flex-1 glass-card rounded-2xl min-h-[550px] flex flex-col relative overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in-95 duration-700">
              
              {/* Subtle top glare effect */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {currentStep === 'upload' && (
            <UploadView 
              files={files} 
              setFiles={setFiles} 
              isUploading={isUploading} 
              handleUploadSubmit={handleUploadSubmit} 
            />
          )}

          {currentStep === 'analyze' && (
            <AnalyzeView 
              analysisStatus={analysisStatus}
              analysisProgress={analysisProgress}
              setCurrentStep={setCurrentStep}
            />
          )}

          {(currentStep === 'dashboard' || currentStep === 'data-quality' || currentStep === 'forecasting' || currentStep === 'data-insights') && analysisData?.datasets && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="w-full bg-black/40 border-b border-white/5 p-4 flex gap-2 overflow-x-auto">
                {analysisData.datasets.map((ds: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveDatasetIndex(idx)}
                    className={clsx(
                      "px-6 py-2 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap",
                      activeDatasetIndex === idx 
                        ? "bg-primary/20 text-primary border border-primary/50 shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
                        : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white border border-transparent"
                    )}
                  >
                    {ds.filename}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto">
                <InsightsCenter data={analysisData.datasets[activeDatasetIndex]} view={currentStep} onNext={() => setCurrentStep('chat')} />
              </div>
            </div>
          )}

          {currentStep === 'settings' && (
            <SettingsView userEmail={userEmail} />
          )}

          {currentStep === 'chat' && (
            <ChatView 
              chatMessages={chatMessages as import('@/components/views/ChatView').ChatMessage[]} 
              chatInput={chatInput} 
              setChatInput={setChatInput} 
              isTyping={isTyping} 
              handleSendMessage={handleSendMessage} 
              setCurrentStep={setCurrentStep}
            />
          )}

          {currentStep === 'reports' && (
            <ReportsView 
              setFiles={setFiles} 
              setCurrentStep={setCurrentStep} 
            />
          )}

            </div>
          </div>
        </main>
      </div>
      
      <AgentDetailsModal />
    </div>
  );
}
