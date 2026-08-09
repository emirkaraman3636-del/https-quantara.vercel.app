import React from 'react';
import { useData } from '../../context/DataContext';
import { DynamicKPIGrid } from '../dashboard/DynamicKPIGrid';
import { DynamicChartEngine } from '../dashboard/DynamicChartEngine';
import { DynamicDataQuality } from '../dashboard/DynamicDataQuality';
import { RawDataTable } from '../dashboard/RawDataTable';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Activity, Target } from 'lucide-react';

export function SmartDashboardView() {
  const { 
    dynamicSchema, 
    dynamicMetrics, 
    dataQuality, 
    aiAnalysis,
    rawRows, 
    uploadedFileName 
  } = useData();

  if (!dynamicSchema || !dynamicMetrics || !rawRows || rawRows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6 bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="p-6 bg-indigo-500/10 rounded-full">
          <Activity className="w-12 h-12 text-indigo-400 animate-pulse" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-200">Akıllı İş Analisti Bekleniyor</h2>
        <p className="text-slate-400 max-w-md text-center">İşletmenize ait veriyi yükleyin, yapay zeka saniyeler içinde analiz edip size özel bir rapor sunsun.</p>
      </div>
    );
  }

  const getClassificationLabel = (classification: string) => {
    const labels: Record<string, string> = {
      'Sales': 'Satış Verisi',
      'Finance': 'Finansal Veri',
      'HR': 'İnsan Kaynakları Verisi',
      'Inventory': 'Envanter Verisi',
      'Marketing': 'Pazarlama Verisi',
      'Customers': 'Müşteri Verisi',
      'Operations': 'Operasyon Verisi',
      'Generic': 'Genel Veri'
    };
    return labels[classification] || 'Genel Veri';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* 1. HEADER & META */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/30 p-8 rounded-2xl border border-slate-800/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
            {uploadedFileName || 'İsimsiz Veri Seti'}
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm font-semibold border border-indigo-500/30 shadow-inner">
              {getClassificationLabel(dynamicSchema.datasetType)}
            </span>
            <span className="text-slate-400 text-sm font-medium">
              {dataQuality?.totalRows.toLocaleString('tr-TR')} Kayıt
            </span>
            <span className="text-slate-400 text-sm font-medium">
              {dynamicSchema.columns.length} Sütun
            </span>
          </div>
        </div>
      </div>

      {/* 2. AI EXECUTIVE SUMMARY & PERFORMANCE */}
      {aiAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" /> Executive Summary
            </h2>
            <p className="text-slate-300 leading-relaxed text-lg font-light">
              {aiAnalysis.executiveSummary}
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-lg flex flex-col justify-center">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Temel Performans</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                <span className="text-slate-300">{aiAnalysis.performance.strengths[0] || "Güçlü yön belirtilmemiş"}</span>
              </div>
              <div className="flex items-start gap-3">
                <TrendingDown className="w-5 h-5 text-rose-400 mt-1 flex-shrink-0" />
                <span className="text-slate-300">{aiAnalysis.performance.weaknesses[0] || "Zayıf yön belirtilmemiş"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. DYNAMIC METRICS GRID */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-100">Anahtar Göstergeler (KPI)</h2>
        </div>
        <DynamicKPIGrid schema={dynamicSchema} metrics={dynamicMetrics} />
      </div>

      {/* 4. CHARTS */}
      <div className="bg-slate-900/50 rounded-2xl p-2 border border-slate-800/50">
        <div className="p-4 mb-2">
          <h2 className="text-xl font-bold text-slate-100">Veri Görselleştirme</h2>
          <p className="text-sm text-slate-400 mt-1">Yapay zeka tarafından otomatik oluşturulan grafikler</p>
        </div>
        <DynamicChartEngine schema={dynamicSchema} metrics={dynamicMetrics} rawRows={rawRows} />
      </div>

      {/* 5. AI DEEP DIVE: OPPORTUNITIES, RISKS, ANOMALIES */}
      {aiAnalysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Fırsatlar */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-emerald-900/30 shadow-lg">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
              <Target className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Fırsatlar</h3>
            </div>
            <div className="space-y-6">
              {aiAnalysis.opportunities?.slice(0, 3).map((opp, idx) => (
                <div key={idx} className="group">
                  <h4 className="text-emerald-300 font-semibold mb-1 group-hover:text-emerald-200 transition-colors">{opp.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{opp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Riskler */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-rose-900/30 shadow-lg">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h3 className="text-lg font-bold text-white">Riskler</h3>
            </div>
            <div className="space-y-6">
              {aiAnalysis.risks?.slice(0, 3).map((risk, idx) => (
                <div key={idx} className="group">
                  <h4 className="text-rose-300 font-semibold mb-1 group-hover:text-rose-200 transition-colors">{risk.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{risk.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Anomaliler & Aksiyon */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-amber-900/30 shadow-lg flex flex-col">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
              <Activity className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">AI Aksiyon Planı</h3>
            </div>
            <div className="space-y-4 flex-1">
              {aiAnalysis.actionPlan?.slice(0, 3).map((action, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-amber-300 font-semibold text-sm">{action.title}</h4>
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-slate-800 text-slate-300 rounded-md">
                      {action.timeframe}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{action.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. DATA QUALITY & TABLE TABS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
        <div>
          <h2 className="text-lg font-bold text-slate-100 mb-4">Veri Kalitesi</h2>
          <DynamicDataQuality quality={dataQuality} schema={dynamicSchema} />
        </div>
        <div className="flex flex-col h-full">
          <h2 className="text-lg font-bold text-slate-100 mb-4">Ham Veri Önizleme</h2>
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
             <RawDataTable schema={dynamicSchema} rawRows={rawRows} />
          </div>
        </div>
      </div>
    </div>
  );
}
