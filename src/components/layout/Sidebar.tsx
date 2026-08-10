'use client';

import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  ShoppingBag,
  Ruler,
  TrendingUp,
  Sun,
  Moon,
  Sparkles,
  RefreshCw,
  Database,
  LineChart,
  MessageSquare,
  Boxes,
  Bell,
  Lightbulb,
  Users
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ActiveTab } from '../../lib/types';

export function Sidebar() {
  const { activeTab, setActiveTab, uploadedFileName, resetToSampleData, theme, toggleTheme, records, inventorySummary } = useData();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'smart-dashboard', label: 'Smart Dashboard', icon: <Sparkles className="w-5 h-5 text-emerald-400" />, badge: 'New' },
    { id: 'executive-summary', label: 'Executive Briefing', icon: <Sparkles className="w-5 h-5 text-indigo-400" />, badge: 'AI' },
    { id: 'data-quality', label: 'Data Quality & Health', icon: <Database className="w-5 h-5 text-emerald-400" /> },
    { id: 'chat', label: 'Ask AI Copilot', icon: <MessageSquare className="w-5 h-5 text-indigo-400" />, badge: 'Live Chat' },
    { id: 'upload', label: 'Data Ingestion', icon: <UploadCloud className="w-5 h-5" />, badge: uploadedFileName ? 'Live File' : 'Upload' }
  ];

  return (
    <aside className="w-64 border-r transition-colors duration-200 flex flex-col justify-between h-screen sticky top-0 bg-slate-900 border-slate-800 text-slate-200 dark:bg-slate-950 dark:border-slate-800">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-slate-100 text-base tracking-wide flex items-center gap-1.5">
                VORTEX <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-mono font-medium">AI</span>
              </h1>
              <p className="text-xs text-slate-400">Smart Data Platform</p>
            </div>
          </div>
        </div>

        {/* Dataset Status Banner */}
        <div className="mx-3 my-4 p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              Active Dataset
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              {records.length} records
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-200 truncate">
            {uploadedFileName || 'Enterprise Demo Data'}
          </p>
          {uploadedFileName && (
            <button
              onClick={resetToSampleData}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Reset to Demo Data
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-2">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Analytics Views
          </p>
          <nav className="space-y-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span className={item.id === 'smart-dashboard' ? 'text-emerald-400 font-bold' : ''}>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs text-slate-400">Enterprise Ready</span>
        </div>
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>
      </div>
    </aside>
  );
}
