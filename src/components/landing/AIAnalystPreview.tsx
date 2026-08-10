"use client";
import React from 'react';
import { motion } from 'framer-motion';

export function AIAnalystPreview() {
  return (
    <section id="intelligence" className="py-24 px-4 md:px-12 bg-[#030308]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 p-1 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/10"
        >
          <div className="bg-[#0A0A12] rounded-xl p-6 h-full border border-white/5 relative overflow-hidden">
             <div className="flex items-center space-x-3 mb-6 border-b border-white/5 pb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <div className="text-white font-medium">Zentrivo AI Analyst</div>
                  <div className="text-xs text-indigo-400">Powered by advanced LLMs</div>
                </div>
             </div>
             
             <div className="space-y-4">
               <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 text-sm text-slate-300 font-light leading-relaxed">
                 Based on the deterministic data, <span className="text-white font-medium">Gross Margin declined by 2.4%</span> in the Mid-Market segment during Q3. 
               </div>
               <div className="p-4 rounded-lg bg-indigo-500/[0.05] border border-indigo-500/20 text-sm text-slate-300 font-light leading-relaxed">
                 <span className="text-indigo-400 font-medium">Recommendation:</span> The cost of acquisition in this segment outpaced revenue growth. Consider reviewing the Q3 promotional spend allocation for the API Access product line.
               </div>
             </div>
          </div>
        </motion.div>
        
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6 leading-[1.2]">
            An executive analyst that never sleeps.
          </h2>
          <p className="text-lg text-slate-400 mb-6 font-light leading-relaxed">
            Zentrivo bridges the gap between hard numbers and strategic narrative. 
          </p>
          <p className="text-lg text-slate-400 font-light leading-relaxed">
            Because our deterministic engine calculates the exact metrics first, our AI Analyst is completely immune to math hallucinations. It simply reads the verified truth and tells you what to do next.
          </p>
        </div>
      </div>
    </section>
  );
}
