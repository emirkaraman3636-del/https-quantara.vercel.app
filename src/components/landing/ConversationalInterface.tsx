"use client";
import React from 'react';

export function ConversationalInterface() {
  return (
    <section id="intelligence" className="py-24 bg-[#0a0a0f]">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-medium text-white mb-16 text-center tracking-tight">Zero Hallucination Chat.</h2>
        
        <div className="border border-white/10 rounded-xl bg-[#060609] p-6 md:p-10 space-y-8">
          
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm shrink-0">U</div>
            <div className="pt-1">
              <p className="text-white font-medium mb-1">User</p>
              <p className="text-slate-400">Why did revenue decline this month?</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">Z</div>
            <div className="pt-1">
              <p className="text-white font-medium mb-1">Zentrivo</p>
              <p className="text-slate-300 leading-relaxed mb-4">
                Revenue decreased <span className="text-white font-medium">8.4%</span> compared with the previous period.
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                The primary measurable driver was a decline in transaction volume in the SaaS segment (down 410 transactions). Average Order Value remained statistically stable ($42.10 vs $42.50).
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded border border-amber-500/20 bg-amber-500/5 text-xs text-amber-200">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                No advertising data was provided in the dataset, so external attribution cannot be determined.
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
