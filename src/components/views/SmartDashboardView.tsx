import React from 'react';
import { useData } from '../../context/DataContext';
import { DynamicKPIGrid } from '../dashboard/DynamicKPIGrid';
import { DynamicChartEngine } from '../dashboard/DynamicChartEngine';
import { DynamicDataQuality } from '../dashboard/DynamicDataQuality';
import { RawDataTable } from '../dashboard/RawDataTable';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Activity, Target, Brain, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { AIInsight } from '../../lib/dynamic-types';

export function SmartDashboardView() {
  const { 
    dynamicSchema, 
    biContext, 
    dataQuality, 
    rawRows, 
    aiAnalysis,
    uploadedFileName 
  } = useData();

  if (!dynamicSchema || !biContext || !rawRows || rawRows.length === 0) {
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

  const score = dataQuality?.dataQualityScore || 0;
  let qColor = 'text-green-400';
  if (score < 60) qColor = 'text-red-400';
  else if (score < 80) qColor = 'text-yellow-400';

  const renderInsightCard = (insight: AIInsight, icon: React.ReactNode, colorClass: string, borderClass: string) => (
    <div key={insight.title} className={`bg-slate-900 rounded-2xl p-6 border ${borderClass} shadow-lg flex flex-col group`}>
      <div className={`flex items-center gap-2 mb-4 pb-4 border-b border-slate-800 ${colorClass}`}>
        {icon}
        <h3 className="text-lg font-bold">{insight.title}</h3>
      </div>
      <div className="space-y-4 flex-1">
        <div>
          <p className="text-slate-300 font-medium">{insight.statement}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1 block">Kanıt / Veri</span>
          <p className="text-sm text-slate-400">{insight.evidence}</p>
        </div>
        {insight.impact && (
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1 block">Etki</span>
            <p className="text-sm text-slate-400">{insight.impact}</p>
          </div>
        )}
        {insight.recommendation && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 mb-1 block">Öneri</span>
            <p className="text-sm text-indigo-200">{insight.recommendation}</p>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-between items-center text-xs font-bold uppercase tracking-wider">
        <span className={
          insight.severity === 'High' ? 'text-rose-400' : 
          insight.severity === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
        }>
          Önem: {insight.severity}
        </span>
        <span className="text-slate-500">Güven: {insight.confidence}</span>
      </div>
    </div>
  );

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

      {/* 2. AI EXECUTIVE SUMMARY */}
      {aiAnalysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="col-span-3 bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" /> Yönetici Özeti (Executive Summary)
            </h2>
            <p className="text-slate-300 leading-relaxed text-lg font-light">
              {aiAnalysis.executiveSummary}
            </p>
            {aiAnalysis.dataLimitations && aiAnalysis.dataLimitations.length > 0 && (
              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <h4 className="text-amber-400 text-sm font-bold flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4" /> Veri Kısıtlamaları
                </h4>
                <ul className="list-disc list-inside text-amber-200/80 text-sm space-y-1">
                  {aiAnalysis.dataLimitations.map((lim, i) => <li key={i}>{lim}</li>)}
                </ul>
              </div>
            )}
          </div>
          
          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-lg flex flex-col justify-center items-center text-center">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">AI Güven Skoru</h3>
             <div className="text-4xl font-bold text-indigo-400 mb-2">{aiAnalysis.confidence}</div>
             <p className="text-xs text-slate-500">Analiz güvenilirliği, verinin kalitesi ve hacmine bağlıdır.</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800/80 flex items-center justify-center gap-3">
          <Brain className="w-6 h-6 text-slate-500" />
          <span className="text-slate-400 font-medium">Yapay zeka içgörüleri şu an kullanılamıyor (API kota sınırına ulaşılmış veya yapılandırma eksik olabilir).</span>
        </div>
      )}

      {/* 3. DYNAMIC METRICS GRID */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-100">Anahtar Göstergeler (KPI)</h2>
        </div>
        <DynamicKPIGrid biContext={biContext} />
      </div>

      {/* 4. CHARTS */}
      <div className="bg-slate-900/50 rounded-2xl p-2 border border-slate-800/50">
        <div className="p-4 mb-2">
          <h2 className="text-xl font-bold text-slate-100">Veri Görselleştirme</h2>
          <p className="text-sm text-slate-400 mt-1">Yapay zeka tarafından otomatik oluşturulan grafikler</p>
        </div>
        <DynamicChartEngine schema={dynamicSchema} biContext={biContext} rawRows={rawRows} />
      </div>

      {/* 5. AI DEEP DIVE: CRITICAL PROBLEMS, OPPORTUNITIES, ACTIONS */}
      {aiAnalysis && (
        <div className="space-y-8">
          
          {aiAnalysis.criticalProblems.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-rose-400 mb-6 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" /> Kritik Problemler
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiAnalysis.criticalProblems.map(insight => renderInsightCard(insight, <AlertTriangle className="w-5 h-5" />, 'text-rose-400', 'border-rose-900/30'))}
              </div>
            </div>
          )}

          {aiAnalysis.opportunities.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
                <Target className="w-6 h-6" /> Fırsatlar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiAnalysis.opportunities.map(insight => renderInsightCard(insight, <Target className="w-5 h-5" />, 'text-emerald-400', 'border-emerald-900/30'))}
              </div>
            </div>
          )}

          {aiAnalysis.recommendedActions.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-indigo-400 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> Önerilen Aksiyonlar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiAnalysis.recommendedActions.map(insight => renderInsightCard(insight, <CheckCircle2 className="w-5 h-5" />, 'text-indigo-400', 'border-indigo-900/30'))}
              </div>
            </div>
          )}

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
