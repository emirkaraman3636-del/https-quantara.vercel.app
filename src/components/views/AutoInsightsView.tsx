'use client';

import React from 'react';
import { Sparkles, AlertTriangle, TrendingUp, Lightbulb, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { EvidenceTrailViewer } from '../ui/EvidenceTrailViewer';

export function AutoInsightsView() {
  const { analytics, setActiveTab } = useData();
  const { autoInsights } = analytics;

  if (!autoInsights || autoInsights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center animate-fadeIn">
        <Sparkles className="w-12 h-12 text-slate-600 mb-4" />
        <h3 className="text-lg font-bold text-slate-300">No Auto-Insights Detected</h3>
        <p className="text-sm text-slate-500 max-w-md mt-2">
          The AI engine needs more data variance to discover statistical anomalies or hidden opportunities.
        </p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Lightbulb className="w-5 h-5 text-amber-400" />;
      case 'risk': return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'anomaly': return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case 'trend': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      default: return <Sparkles className="w-5 h-5 text-slate-400" />;
    }
  };

  const getBadgeStyle = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'low': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            AI Auto-Insights Discovery
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Machine learning algorithms continuously scan your data for hidden patterns, risks, and opportunities.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {autoInsights.map(insight => (
          <div key={insight.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                {getIcon(insight.type)}
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-slate-100">{insight.title}</h3>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border tracking-wider ${getBadgeStyle(insight.priority)}`}>
                  {insight.priority} Priority
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">What Happened?</span>
                  <p className="text-sm text-slate-300 leading-relaxed">{insight.whatHappened}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Why It Happened?</span>
                  <p className="text-sm text-slate-300 leading-relaxed">{insight.whyItHappened}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block mb-1">Business Impact (What it means)</span>
                <p className="text-sm text-slate-200">{insight.whatItMeans}</p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3 h-3" />
                  Recommended Action
                </span>
                <p className="text-sm font-medium text-indigo-200">{insight.whatToDo}</p>
              </div>

              {insight.evidence && insight.category && (
                <EvidenceTrailViewer evidence={insight.evidence} category={insight.category} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
