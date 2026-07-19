import React from 'react';
import { Settings, User, BrainCircuit, Bell, Lock } from 'lucide-react';

interface SettingsViewProps {
  userEmail: string;
}

export default function SettingsView({ userEmail }: SettingsViewProps) {
  return (
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
                <p className="text-xs text-muted-foreground mt-1">Automatically run analysis when files are uploaded</p>
              </div>
              <div className="w-12 h-6 rounded-full bg-primary/20 flex items-center p-1 cursor-pointer border border-primary/50">
                <div className="w-4 h-4 rounded-full bg-primary transform translate-x-6 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Strict Anomaly Detection</h4>
                <p className="text-xs text-muted-foreground mt-1">Use higher sensitivity for outlier detection (3 sigma)</p>
              </div>
              <div className="w-12 h-6 rounded-full bg-white/10 flex items-center p-1 cursor-pointer border border-white/20">
                <div className="w-4 h-4 rounded-full bg-white/50" />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2 block">Default Forecasting Horizon</label>
              <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors appearance-none">
                <option>3 Months</option>
                <option>6 Months</option>
                <option>12 Months</option>
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
            <div className="flex items-center gap-4">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-black/40 accent-primary" />
              <div>
                <h4 className="text-sm font-bold text-white">Analysis Complete</h4>
                <p className="text-xs text-muted-foreground mt-1">Receive an alert when background processing finishes</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-white/20 bg-black/40 accent-primary" />
              <div>
                <h4 className="text-sm font-bold text-white">Anomaly Alerts</h4>
                <p className="text-xs text-muted-foreground mt-1">Get notified if critical data anomalies are detected</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-black/40 accent-primary" />
              <div>
                <h4 className="text-sm font-bold text-white">Weekly Summary Report</h4>
                <p className="text-xs text-muted-foreground mt-1">Receive an automated email with key insights</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Data */}
        <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Lock className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-bold text-white">Security & Data</h3>
          </div>
          <div className="space-y-4">
            <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-colors flex justify-between items-center group">
              <div>
                <h4 className="text-sm font-bold text-white">Export My Data</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Download a JSON copy of all your configurations</p>
              </div>
            </button>
            <button className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-left transition-colors flex justify-between items-center group">
              <div>
                <h4 className="text-sm font-bold text-red-400">Clear Workspace Data</h4>
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
  );
}
