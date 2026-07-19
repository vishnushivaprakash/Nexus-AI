import React from 'react';
import { MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export type ChatMessage = { role: 'user' | 'ai'; text: string; code?: string };

interface ChatViewProps {
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (val: string) => void;
  isTyping: boolean;
  handleSendMessage: () => void;
  setCurrentStep: (step: any) => void;
}

export default function ChatView({
  chatMessages,
  chatInput,
  setChatInput,
  isTyping,
  handleSendMessage,
  setCurrentStep
}: ChatViewProps) {
  return (
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
              <div className={clsx(
                "p-5 rounded-2xl max-w-[85%] text-sm shadow-lg",
                msg.role === 'user' 
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white rounded-tr-none font-medium" 
                  : "glass border border-white/10 text-white/90 rounded-tl-none leading-relaxed"
              )}>
                {/* Parse markdown manually for simple bolding */}
                <span dangerouslySetInnerHTML={{__html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')}} />
                
                {msg.code && (
                  <div className="mt-4 p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-xs text-blue-300 overflow-x-auto shadow-inner">
                    {msg.code}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4 animate-in fade-in duration-300">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none glass border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>
        
        <div className="sticky bottom-0 mt-4 bg-transparent pt-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl opacity-50" />
            <div className="relative glass border border-white/20 rounded-2xl flex items-center p-2 shadow-2xl transition-all duration-300 focus-within:border-primary/50 focus-within:bg-black/40">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask anything about your data..." 
                className="flex-1 bg-transparent border-none focus:outline-none px-4 text-sm text-white placeholder:text-white/30"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isTyping}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center text-white hover:scale-105 transition-all shadow-md disabled:opacity-50 disabled:hover:scale-100"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-3 font-medium uppercase tracking-widest">
            Nexus AI can make mistakes. Verify important metrics.
          </p>
        </div>
      </div>
    </div>
  );
}
