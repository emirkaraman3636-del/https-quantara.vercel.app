'use client';

import React from 'react';
import { Sparkles, ArrowRight, ShieldAlert, Lightbulb, TrendingUp } from 'lucide-react';
import { useData } from '../../context/DataContext';

export function AIInsightsWidget() {
  const { aiSummary, setActiveTab } = useData();
  const { executiveOverview, healthScore, keyFindings, riskAlerts, recommendations } = aiSummary;

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-xl relative overflow-hidden group">
      {/* Background Glow Element */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-all pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-100 tracking-wide">
                Vortex AI Executive Summary
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                Real-time Dynamic Insights
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated business intelligence computed from active dataset
            </p>
          </div>
        </div>

        {/* Business Health Score Pill */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono text-slate-400">Business Health Score</div>
            <div className="text-lg font-bold font-mono text-emerald-400">{healthScore} / 100</div>
          </div>
          <button
            onClick={() => setActiveTab('ai-insights')}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
          >
            <span>Full AI Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dynamic Narrative Summary */}
      <div className="mt-4">
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
          {executiveOverview}
        </p>
      </div>

      {/* Highlights Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-800/60 text-xs">
        {/* Key Finding 1 */}
        {keyFindings[0] && (
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-2.5">
            <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200 block">{keyFindings[0].title}</span>
              <span className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{keyFindings[0].description}</span>
            </div>
          </div>
        )}

        {/* Critical Recommendation */}
        {recommendations[0] && (
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-2.5">
            <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200 block">{recommendations[0].title}</span>
              <span className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{recommendations[0].action}</span>
            </div>
          </div>
        )}

        {/* Risk Alert */}
        {riskAlerts[0] && (
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200 block">{riskAlerts[0].title}</span>
              <span className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{riskAlerts[0].riskDescription}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
