'use client';

import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  Info,
  CheckCircle2,
  Filter,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AlertSeverity } from '../../lib/inventory-types';

export function AlertCenterView() {
  const { inventorySummary, setActiveTab } = useData();
  const { alerts } = inventorySummary;

  const [severityFilter, setSeverityFilter] = useState<'all' | AlertSeverity>('all');

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter === 'all') return true;
    return a.severity === severityFilter;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header Controls & Severity Filter */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-amber-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Bell className="w-5 h-5 text-white animate-bounce" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Business Alert & Risk Center
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                {alerts.length} Active Alerts
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated notifications for stock-outs, revenue risks, category shifts, and forecast anomalies
            </p>
          </div>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setSeverityFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              severityFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setSeverityFilter('critical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              severityFilter === 'critical'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Critical ({alerts.filter(a => a.severity === 'critical').length})
          </button>
          <button
            onClick={() => setSeverityFilter('warning')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              severityFilter === 'warning'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Warnings ({alerts.filter(a => a.severity === 'warning').length})
          </button>
          <button
            onClick={() => setSeverityFilter('info')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              severityFilter === 'info'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Info ({alerts.filter(a => a.severity === 'info').length})
          </button>
        </div>
      </div>

      {/* Alert Cards Timeline */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-10 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-semibold text-slate-200">No Alerts Found</h4>
            <p className="text-xs text-slate-400">No active business risk notifications under the selected severity filter.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`p-6 rounded-2xl border transition-all ${
                alert.severity === 'critical'
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-500/5'
                  : alert.severity === 'warning'
                  ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/70 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {alert.severity === 'critical' ? (
                    <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  ) : alert.severity === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-slate-100">{alert.title}</h4>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          alert.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300'
                            : alert.severity === 'warning'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-indigo-500/20 text-indigo-300'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {alert.impactMetric}
                </span>
              </div>

              {/* Recommended Action Box */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <span className="font-bold text-indigo-400 font-mono">Mitigation Action:</span>
                  <span>{alert.recommendedAction}</span>
                </div>

                <span className="text-[11px] text-slate-400 font-mono self-end sm:self-auto">
                  {alert.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
