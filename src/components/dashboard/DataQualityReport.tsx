'use client';

import React from 'react';
import { Database, ShieldAlert, CheckCircle, AlertOctagon, HelpCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

export function DataQualityReport() {
  const { analytics, uploadedFileName } = useData();

  if (!analytics || !analytics.dataQuality) {
    return null;
  }

  const { dataQuality, kpis } = analytics;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-start justify-between border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-6 h-6 text-emerald-400" />
            Veri Kalitesi & Sağlık Raporu
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            "{uploadedFileName || 'Dataset'}" dosyası için otomatik veri keşfi ve kalite denetimi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Quality</span>
            {dataQuality.score >= 90 ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <ShieldAlert className="w-5 h-5 text-amber-400" />}
          </div>
          <div>
            <span className={`text-3xl font-black font-mono ${dataQuality.score >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {dataQuality.score}/100
            </span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Eksik Veri (Missing)</span>
            <AlertOctagon className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <span className="text-3xl font-black font-mono text-slate-100">
              %{dataQuality.missingDataRate}
            </span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Kayıt Sayısı</span>
            <Database className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <span className="text-3xl font-black font-mono text-slate-100">
              {kpis.totalOrders.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Anomali & Hatalar</span>
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-3xl font-black font-mono text-slate-100">
              {dataQuality.anomalyCount} <span className="text-sm font-sans text-slate-400 font-normal">satır</span>
            </span>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 border-b border-slate-700/50 pb-3">
          Veri Sözlüğü (Data Dictionary)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(dataQuality.columnInsights).map(([columnName, insight]) => (
            <div key={columnName} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-start space-x-3">
              <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-200">{columnName}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded font-mono">
                    {dataQuality.dataTypes[columnName] || 'Unknown'}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-1">{insight}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
