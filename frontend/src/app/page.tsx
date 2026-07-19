"use client";

import { useState, useEffect } from 'react';
import { Upload, BarChart3, Lightbulb, MessageSquare, FileText, ArrowRight, CheckCircle2, Sparkles, LogOut, Sun, Moon, LayoutGrid, CloudUpload, Settings, ShieldAlert, TrendingUp, PieChart, User, Bell, Lock, BrainCircuit } from 'lucide-react';
import clsx from 'clsx';
import { useDropzone } from 'react-dropzone';
import InsightsCenter from '@/components/InsightsCenter';
import AgentWorkflowBar from '@/components/AgentWorkflowBar';
import AgentDetailsModal from '@/components/AgentDetailsModal';
import { useAgentStore } from '@/store/agentStore';

type Step = 'dashboard' | 'chat' | 'data-quality' | 'forecasting' | 'upload' | 'analyze' | 'reports' | 'settings' | 'data-insights';

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
            <div className="flex-1 p-12 flex flex-col items-center justify-center text-center animate-in slide-in-from-bottom-4 duration-500">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-primary/30 text-primary mb-6 animate-float">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-semibold tracking-wide uppercase">AI-Powered Analysis</span>
              </div>
              <h2 className="text-4xl font-bold mb-4 tracking-tight text-white">Upload your dataset</h2>
              <p className="text-muted-foreground mb-10 max-w-lg text-lg">
                Upload CSV files to begin. Nexus AI will automatically analyze the structure, detect anomalies, and prepare actionable insights.
              </p>
              
              <div 
                {...getRootProps()} 
                className={clsx(
                  "w-full max-w-2xl h-72 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden group",
                  isDragActive ? "border-primary bg-primary/10 scale-105" : "border-white/20 glass hover:border-primary/50 hover:bg-white/5"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <input {...getInputProps()} />
                <div className="w-16 h-16 rounded-full glass flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="font-semibold text-lg text-white">
                  {isDragActive ? "Drop the files here" : "Drag & drop files here"}
                </p>
                <p className="text-sm text-muted-foreground mt-2 font-medium">or click to browse from your computer</p>
              </div>

              {files.length > 0 && (
                <div className="w-full max-w-2xl mt-8 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Selected Files</h4>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">{files.length} file(s)</span>
                  </div>
                  <div className="space-y-3">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center justify-between p-4 glass border border-white/10 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{f.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={handleUploadSubmit}
                      disabled={isUploading}
                      className="bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-3 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] disabled:opacity-50 transition-all duration-300 hover:scale-105"
                    >
                      {isUploading ? (
                        <span className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <>Analyze Dataset <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'analyze' && (
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
            <div className="flex-1 flex flex-col p-8 overflow-y-auto animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                  <Settings className="w-6 h-6 animate-spin-slow" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Settings</h2>
                  <p className="text-muted-foreground text-sm font-medium mt-1">Manage your account, preferences, and AI configurations</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-6xl">
                {/* Profile Settings */}
                <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col gap-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <User className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-white">Profile</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full glass border border-white/20 flex items-center justify-center text-2xl font-bold text-white bg-gradient-to-br from-primary/50 to-blue-500/50">U</div>
                    <div>
                      <button className="px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-sm font-semibold text-white">Change Avatar</button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2 block">Display Name</label>
                      <input type="text" defaultValue="User" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2 block">Email Address</label>
                      <input type="email" value={userEmail} readOnly className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white/70 text-sm focus:outline-none focus:border-primary/50 transition-colors cursor-not-allowed" />
                    </div>
                  </div>
                </div>

                {/* AI & Analysis Preferences */}
                <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col gap-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <BrainCircuit className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-bold text-white">AI Preferences</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">Auto-generate Insights</h4>
                        <p className="text-xs text-muted-foreground mt-1">Automatically analyze datasets upon upload</p>
                      </div>
                      <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">Strict Anomaly Detection</h4>
                        <p className="text-xs text-muted-foreground mt-1">Flag deviations above 1.5 standard deviations</p>
                      </div>
                      <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white/50 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2 block">Default Forecasting Model</label>
                      <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none">
                        <option className="bg-slate-900">Prophet (Time Series)</option>
                        <option className="bg-slate-900">Linear Regression</option>
                        <option className="bg-slate-900">Random Forest</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col gap-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <Bell className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-lg font-bold text-white">Notifications</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">Analysis Completion Alerts</h4>
                        <p className="text-xs text-muted-foreground mt-1">Get notified when a large dataset is done processing</p>
                      </div>
                      <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">Weekly Summary Reports</h4>
                        <p className="text-xs text-muted-foreground mt-1">Receive an automated email with key insights</p>
                      </div>
                      <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white/50 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data & Privacy */}
                <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col gap-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <Lock className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-bold text-white">Data & Privacy</h3>
                  </div>
                  <div className="space-y-4">
                    <button className="w-full text-left px-4 py-3 bg-black/40 hover:bg-white/5 border border-white/5 rounded-xl transition-colors flex items-center justify-between group">
                      <div>
                        <h4 className="text-sm font-bold text-white">Export My Data</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Download a copy of all your datasets and reports</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors flex items-center justify-between group">
                      <div>
                        <h4 className="text-sm font-bold text-red-400">Delete Account</h4>
                        <p className="text-xs text-red-400/60 mt-0.5">Permanently remove all your data from Nexus AI</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end max-w-6xl pb-10">
                <button className="px-8 py-3.5 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-105 transition-all">Save Changes</button>
              </div>
            </div>
          )}

          {currentStep === 'chat' && (
            <div className="flex-1 flex flex-col animate-in fade-in duration-500 h-full">
              <div className="p-8 border-b border-white/10 flex items-center justify-between glass sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">AI Assistant</h2>
                    <p className="text-muted-foreground text-sm font-medium mt-0.5">Query your data in plain English</p>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentStep('reports')}
                  className="text-sm font-bold glass px-6 py-2.5 rounded-xl hover:bg-white/10 border border-white/10 transition-all hover:border-white/30 text-white"
                >
                  Next: Generate Report
                </button>
              </div>
              
              <div className="flex-1 p-8 flex flex-col overflow-y-auto overflow-x-hidden relative">
                <div className="flex-1 space-y-8 pb-8">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={clsx("flex gap-4 animate-in slide-in-from-bottom-2 duration-300", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                      {msg.role === 'user' ? (
                        <div className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center shrink-0 font-bold text-sm text-white shadow-md">U</div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shrink-0 font-bold text-sm text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]">AI</div>
                      )}
                      <div className={clsx("max-w-[80%] pt-1 space-y-3", msg.role === 'user' ? "text-right" : "text-left")}>
                        <div className={clsx(
                          "inline-block p-4 rounded-2xl text-sm font-medium leading-relaxed",
                          msg.role === 'user' ? "bg-white/10 text-white rounded-tr-sm border border-white/5" : "glass border-primary/20 text-white rounded-tl-sm shadow-lg"
                        )}>
                          <p dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary font-bold drop-shadow-sm">$1</strong>') }} />
                        </div>
                        {msg.code && (
                          <div className="glass p-5 rounded-xl border border-white/10 font-mono text-xs text-blue-300 whitespace-pre-wrap shadow-inner relative group text-left">
                            <div className="absolute top-2 right-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-0 group-hover:opacity-100 transition-opacity">SQL</div>
                            {msg.code}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-4 animate-in fade-in">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shrink-0 font-bold text-sm text-white shadow-[0_0_10px_rgba(139,92,246,0.5)]">AI</div>
                      <div className="glass p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-auto pt-4 sticky bottom-0 bg-transparent">
                  <div className="relative glass rounded-2xl p-2 border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] focus-within:border-primary/50 transition-colors duration-300 focus-within:shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask a question about your data..." 
                      className="w-full h-12 bg-transparent pl-4 pr-14 text-sm focus:outline-none text-white placeholder:text-muted-foreground font-medium"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={isTyping}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-primary to-blue-600 text-white flex items-center justify-center rounded-xl hover:shadow-[0_0_15px_rgba(139,92,246,0.6)] transition-all duration-300 disabled:opacity-50 hover:scale-105"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'reports' && (
            <div className="flex-1 p-12 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
              <div className="relative mb-8 animate-float">
                <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
                <div className="w-28 h-28 glass rounded-full flex items-center justify-center border border-green-500/30 shadow-[0_0_40px_rgba(74,222,128,0.2)] relative z-10">
                  <CheckCircle2 className="w-14 h-14 text-green-400" />
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-4 text-white tracking-tight">Analysis Complete</h2>
              <p className="text-muted-foreground mb-12 max-w-lg text-lg">
                Your data has been fully analyzed and insights generated. Download the executive summary or export the cleaned dataset below.
              </p>
              
              <div className="flex gap-6 w-full max-w-md justify-center">
                <button 
                  onClick={() => window.open('http://localhost:8000/api/export/pdf', '_blank')}
                  className="flex-1 bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-4 rounded-xl font-bold text-sm hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-300 hover:-translate-y-1 flex flex-col items-center gap-2"
                >
                  <FileText className="w-6 h-6" />
                  PDF Report
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
          )}

            </div>
          </div>
        </main>
      </div>
      
      <AgentDetailsModal />
    </div>
  );
}
