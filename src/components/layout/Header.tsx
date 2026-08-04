'use client';

import React from 'react';
import { UploadCloud, Filter, Download, Sparkles, LineChart, MessageSquare, Boxes, Bell } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { downloadSampleCSVFile } from '../../lib/sample-data';

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  overview: {
    title: 'Executive Sales Overview',
    subtitle: 'Real-time revenue metrics, order velocity, and performance KPIs'
  },
  inventory: {
    title: 'Inventory Intelligence & ROP Matrix (Phase 2.4)',
    subtitle: 'Reorder Point calculations, stock coverage days, overstock, and dead stock analysis'
  },
  alerts: {
    title: 'Business Risk & Alert Center (Phase 2.4)',
    subtitle: 'Real-time notifications for stock-outs, revenue risks, and forecast anomalies'
  },
  chat: {
    title: 'Natural Language AI Copilot (Phase 2.3)',
    subtitle: 'Ask questions about products, clothing sizes, revenue, customers, and 30-90 day forecasts'
  },
  'ai-insights': {
    title: 'AI Business Analyst Assistant (Phase 2.1)',
    subtitle: 'Automated executive summary, key findings, risk alerts, and strategic recommendations'
  },
  forecasting: {
    title: 'Sales Forecasting Engine (Phase 2.2)',
    subtitle: 'Predictive 30/60/90-day revenue modeling, day-of-week seasonality, and confidence metrics'
  },
  upload: {
    title: 'Data Ingestion & Validation',
    subtitle: 'Upload Excel (.xlsx) or CSV files with auto column detection and validation'
  },
  products: {
    title: 'Product & Category Intelligence',
    subtitle: 'Product performance rankings, volume breakdown, and revenue analysis'
  },
  sizes: {
    title: 'Size & Inventory Analytics',
    subtitle: 'Clothing size distribution (S/M/L/XL), stock ratios, and demand trends'
  },
  trends: {
    title: 'Sales Trends & Time-Series',
    subtitle: 'Daily and monthly revenue velocity, order growth trends, and temporal patterns'
  }
};

export function Header() {
  const { activeTab, setActiveTab, analytics, selectedCategory, setSelectedCategory } = useData();
  const currentTabInfo = TAB_TITLES[activeTab] || TAB_TITLES.overview;

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-8 py-4 flex items-center justify-between transition-colors">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          {currentTabInfo.title}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">{currentTabInfo.subtitle}</p>
      </div>

      <div className="flex items-center space-x-3">
        {/* Category Filter Dropdown */}
        <div className="relative flex items-center">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-9 pr-4 py-2 text-xs font-medium rounded-lg bg-slate-800 text-slate-200 border border-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="All">All Categories ({analytics.categories.length})</option>
            {analytics.categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Download Sample CSV */}
        <button
          onClick={downloadSampleCSVFile}
          title="Download sample CSV file for testing upload feature"
          className="flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          <span>Sample Template</span>
        </button>

        {/* Quick Inventory ROP Trigger */}
        <button
          onClick={() => setActiveTab('inventory')}
          className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 transition-all"
        >
          <Boxes className="w-4 h-4 text-amber-400" />
          <span>ROP Matrix</span>
        </button>

        {/* Quick AI Chat Trigger */}
        <button
          onClick={() => setActiveTab('chat')}
          className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all"
        >
          <MessageSquare className="w-4 h-4 text-white" />
          <span>Ask Copilot</span>
        </button>

        {/* Quick Upload Button */}
        <button
          onClick={() => setActiveTab('upload')}
          className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
        >
          <UploadCloud className="w-4 h-4 text-indigo-400" />
          <span>Upload File</span>
        </button>
      </div>
    </header>
  );
}
