"use client";
import React from 'react';
import { motion } from 'framer-motion';

export function DeterministicEngine() {
  return (
    <section className="py-24 bg-[#0a0a0f] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        
        <div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight leading-[1.1] mb-6">
            Numbers are calculated.<br />
            <span className="text-slate-500">Not imagined.</span>
          </h2>
          <p className="text-lg text-slate-400 font-light leading-relaxed mb-8 max-w-md">
            Unlike generic LLMs that guess math, Zentrivo uses a rigid deterministic analytics engine. 
            The AI acts purely as an interpreter on top of cryptographically verified calculations.
          </p>
          
          <div className="space-y-4 font-mono text-sm">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-500">ENGINE.CALCULATE_MARGIN()</span>
              <span className="text-white">EXECUTED</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-slate-500">AGGREGATE_TIME_SERIES('1D')</span>
              <span className="text-white">EXECUTED</span>
            </div>
            <div className="flex items-center justify-between pb-2">
              <span className="text-slate-500">AI.INTERPRET_RESULTS()</span>
              <span className="text-indigo-400">ACTIVE</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/10 blur-[80px] rounded-full" />
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative border border-white/10 bg-[#12121a] rounded-xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">AI</div>
              <span className="text-sm font-medium text-white tracking-wide">Zentrivo Analyst</span>
            </div>
            <h3 className="text-2xl font-medium text-white mb-4">Gross margin declined 4.2% over the last 30 days.</h3>
            <p className="text-slate-400 font-light leading-relaxed mb-6">
              This decline is exclusively tied to the Enterprise tier, where COGS increased by $14,200 due to the new API pricing model, while Revenue remained flat.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/5 text-xs text-slate-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Based on verified source data
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
