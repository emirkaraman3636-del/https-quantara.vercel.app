"use client";
import React from 'react';
import { motion } from 'framer-motion';

export function TrustAndQuality() {
  return (
    <section id="data-quality" className="py-24 px-4 md:px-12 border-y border-white/5 bg-[#05050A]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 p-8 rounded-2xl border border-white/5 bg-[#0A0A12] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <h3 className="text-xl font-semibold text-white mb-6">Data Quality Engine</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Total Records</span>
                <span className="text-white font-medium">12,450</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full"><div className="w-full h-full bg-slate-600 rounded-full" /></div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400 flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />Valid Financial Rows</span>
                <span className="text-emerald-400 font-medium">12,201 (98%)</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full"><div className="w-[98%] h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" /></div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400 flex items-center"><div className="w-2 h-2 rounded-full bg-rose-500 mr-2" />Anomalies / Missing Data</span>
                <span className="text-rose-400 font-medium">249 (2%)</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full"><div className="w-[2%] h-full bg-rose-500 rounded-full" /></div>
            </div>
          </div>
          
          <div className="mt-8 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-100/80 leading-relaxed font-light">
            <span className="font-semibold text-emerald-400">Passed:</span> Dataset integrity is sufficient for financial analysis. Anomalies have been safely excluded from deterministic calculations.
          </div>
        </motion.div>
        
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6 leading-[1.2]">
            Trust the data before you trust the insights.
          </h2>
          <p className="text-lg text-slate-400 mb-6 font-light leading-relaxed">
            AI is only as good as the data it analyzes. Zentrivo's proprietary Data Quality Engine scans every row of your dataset before any analysis begins.
          </p>
          <p className="text-lg text-slate-400 font-light leading-relaxed">
            We identify null values, type mismatches, and mathematical anomalies, ensuring that your final executive dashboard is built on a foundation of absolute truth.
          </p>
        </div>
      </div>
    </section>
  );
}
