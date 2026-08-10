"use client";
import React from 'react';

export function UniversalData() {
  return (
    <section className="py-32 bg-[#030308] border-t border-white/5 relative overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-medium text-white tracking-tight leading-tight mb-8">
          Your business model changes.<br />
          <span className="text-slate-500">The intelligence layer doesn't.</span>
        </h2>
        
        <div className="flex flex-wrap justify-center gap-4 mt-16 max-w-4xl mx-auto">
          {['SaaS', 'Retail', 'E-commerce', 'B2B Services', 'Agencies', 'Healthcare', 'Logistics', 'Custom CSVs'].map((model) => (
            <div key={model} className="px-6 py-3 rounded-full border border-white/10 bg-[#0a0a0f] text-slate-300 font-medium">
              {model}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
