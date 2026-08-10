"use client";
import React from 'react';

export function PipelineFlow() {
  return (
    <section className="py-32 bg-[#030308] border-t border-b border-white/5 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 font-mono text-sm tracking-widest text-slate-500 uppercase">
          
          <div className="flex flex-col items-center gap-4 relative group">
            <span className="text-white">Raw Data</span>
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>

          <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-white/20 via-white/20 to-white/20" />

          <div className="flex flex-col items-center gap-4">
            <span>Data Quality</span>
            <div className="w-2 h-2 bg-slate-700 rounded-full" />
          </div>

          <div className="hidden md:block flex-1 h-px bg-white/10" />

          <div className="flex flex-col items-center gap-4">
            <span>BI Engine</span>
            <div className="w-2 h-2 bg-slate-700 rounded-full" />
          </div>

          <div className="hidden md:block flex-1 h-px bg-white/10" />

          <div className="flex flex-col items-center gap-4">
            <span className="text-indigo-400">AI Analyst</span>
            <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
          </div>

          <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />

          <div className="flex flex-col items-center gap-4">
            <span className="text-white">Decision</span>
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>

        </div>
      </div>
    </section>
  );
}
