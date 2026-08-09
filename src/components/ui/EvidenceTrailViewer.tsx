import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FileSearch, Filter, Calculator, BarChart2 } from 'lucide-react';
import { EvidenceTrail, ResultCategory } from '../../lib/types';

interface Props {
  evidence?: EvidenceTrail;
  category?: ResultCategory;
}

export function EvidenceTrailViewer({ evidence, category }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  if (!evidence || !category) return null;

  const getCategoryBadge = (cat: ResultCategory) => {
    switch (cat) {
      case 'Kesin Bulgular':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">🟢 {cat}</span>;
      case 'Olası Açıklamalar':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">🟡 {cat}</span>;
      case 'Bilinmeyenler':
        return <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">🔴 {cat}</span>;
    }
  };

  return (
    <div className="mt-3 w-full border border-slate-700/50 rounded-xl overflow-hidden bg-slate-800/20">
      <div 
        className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-slate-800/40 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <FileSearch className="w-3.5 h-3.5 text-indigo-400" /> Kanıt Yolu (Evidence Trail)
          </span>
        </div>
        <div>
          {getCategoryBadge(category)}
        </div>
      </div>
      
      {isOpen && (
        <div className="p-3 border-t border-slate-700/50 space-y-3 bg-slate-900/30">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Used Columns */}
            <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/30">
              <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5 mb-1.5">
                <BarChart2 className="w-3 h-3 text-emerald-400" /> Kullanılan Kolonlar
              </span>
              <div className="flex flex-wrap gap-1.5">
                {evidence.usedColumns.length > 0 ? (
                  evidence.usedColumns.map(col => (
                    <span key={col} className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">{col}</span>
                  ))
                ) : (
                  <span className="text-[10px] text-slate-500">Kolon verisi yok</span>
                )}
              </div>
            </div>

            {/* Calculations & Filters */}
            <div className="bg-slate-800/40 p-2 rounded-lg border border-slate-700/30">
              <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5 mb-1.5">
                <Calculator className="w-3 h-3 text-indigo-400" /> Hesaplama Yöntemi
              </span>
              <p className="text-[11px] text-slate-300 font-mono mb-2">{evidence.calculationMethod}</p>
              
              <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5 mb-1.5">
                <Filter className="w-3 h-3 text-amber-400" /> Uygulanan Filtreler
              </span>
              <div className="flex flex-wrap gap-1.5">
                {evidence.filtersApplied.map(f => (
                  <span key={f} className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">{f}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Key Metrics & Data Volume */}
          <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/30 flex flex-wrap items-center justify-between gap-3">
             <div className="flex flex-wrap gap-4">
               {evidence.keyMetrics.map(km => (
                 <div key={km.label} className="flex flex-col">
                   <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wide">{km.label}</span>
                   <span className="text-xs font-mono text-emerald-400">{km.value}</span>
                 </div>
               ))}
             </div>
             
             <div className="text-right">
               <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wide block">Analiz Edilen Veri Hacmi</span>
               <span className="text-xs font-mono text-indigo-300">{evidence.dataVolume.toLocaleString()} satır</span>
             </div>
          </div>

        </div>
      )}
    </div>
  );
}
