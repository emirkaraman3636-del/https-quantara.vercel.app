'use client';

import React from 'react';
import {
  Sparkles,
  RefreshCw,
  ShieldAlert,
  Lightbulb,
  TrendingUp,
  Target,
  Users,
  CheckCircle2,
  AlertOctagon,
  ArrowUpRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export function AIInsightsView() {
  const { aiSummary, regenerateAISummary, uploadedFileName, records } = useData();
  const {
    executiveOverview,
    healthScore,
    generatedAt,
    keyFindings,
    recommendations,
    riskAlerts,
    opportunities,
    customerInsights
  } = aiSummary;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Controls & Dataset Badge */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              AI Business Analyst Assistant
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Real Data Analysis
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Source: <span className="text-slate-300 font-semibold">{uploadedFileName || 'Enterprise Demo Dataset'}</span> ({records.length} records) • Last generated at {generatedAt}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={regenerateAISummary}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Re-Analyze Dataset</span>
          </button>
        </div>
      </div>

      {/* Main Executive Summary Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-widest block mb-1">
              AUTOMATED EXECUTIVE BRIEFING
            </span>
            <h2 className="text-2xl font-bold text-slate-100">Executive Summary & Business Diagnostics</h2>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center font-mono">
            <span className="text-[10px] uppercase text-slate-400 block">Health Score</span>
            <span className="text-2xl font-bold text-emerald-400">{healthScore}/100</span>
          </div>
        </div>

        <div className="mt-4 p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {executiveOverview}
          </p>
        </div>
      </div>

      {/* 2-Column Grid: Important Findings & Strategic Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Important Key Findings */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-100">Key Analytical Findings</h3>
          </div>

          <div className="space-y-3">
            {keyFindings.map((finding) => (
              <div
                key={finding.id}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    {finding.title}
                  </span>
                  {finding.metricValue && (
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {finding.metricValue}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{finding.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-slate-100">Strategic Business Recommendations</h3>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-100">{rec.title}</h4>
                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {rec.priority} priority
                  </span>
                </div>
                <p className="text-xs text-slate-300">{rec.action}</p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Target: <strong className="text-slate-200">{rec.targetArea}</strong></span>
                  <span className="text-emerald-400 font-semibold">{rec.expectedOutcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Potential Risks & Growth Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk & Vulnerability Alerts */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-semibold text-slate-100">Inventory & Operational Risks</h3>
          </div>

          <div className="space-y-3">
            {riskAlerts.map((risk) => (
              <div
                key={risk.id}
                className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    {risk.title}
                  </h4>
                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    {risk.severity} Severity
                  </span>
                </div>
                <p className="text-xs text-slate-300">{risk.riskDescription}</p>
                <div className="p-2.5 rounded-lg bg-slate-900/80 text-xs text-slate-300 font-mono">
                  <span className="text-rose-400 font-bold">Mitigation: </span>
                  {risk.mitigationStrategy}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Opportunities */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Target className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-slate-100">Revenue Growth Opportunities</h3>
          </div>

          <div className="space-y-3">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-300">{opp.title}</h4>
                  <span className="text-[11px] font-mono font-bold text-emerald-400">
                    {opp.potentialValue}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{opp.strategy}</p>
                <div className="text-[11px] text-slate-400 font-mono">
                  Target Domain: <span className="text-slate-200 font-semibold">{opp.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Behavior & Account Insights */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Users className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-semibold text-slate-100">Customer Behavior & Purchasing Patterns</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Active Customers</span>
            <div className="text-2xl font-bold text-slate-100 font-mono mt-1">
              {customerInsights.totalUniqueCustomers} Accounts
            </div>
            <p className="text-xs text-slate-400 mt-1">Analyzed from sales records</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Top Account Contribution</span>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
              {customerInsights.topCustomer.name}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              ${customerInsights.topCustomer.revenue.toLocaleString()} ({customerInsights.topCustomer.percentage}% of total)
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Average Spend per Customer</span>
            <div className="text-2xl font-bold text-indigo-400 font-mono mt-1">
              ${customerInsights.averageSpendPerCustomer.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">Across active client portfolio</p>
          </div>
        </div>
      </div>
    </div>
  );
}
