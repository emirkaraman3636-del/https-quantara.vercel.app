"use client";
import React from 'react';
import { motion } from 'framer-motion';

export function ProductShowcase() {
  return (
    <section id="product" className="relative pb-32 pt-10 px-4 md:px-12 bg-[#030308]">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1400px] mx-auto rounded-xl border border-white/10 bg-[#0a0a0f] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[700px]"
      >
        {/* Left Navigation */}
        <div className="hidden md:flex flex-col w-64 border-r border-white/10 bg-[#060609] p-4">
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="w-6 h-6 rounded-sm bg-white text-black flex items-center justify-center text-xs font-bold">Z</div>
            <span className="text-sm font-medium text-white">Acme Corp</span>
          </div>
          <div className="space-y-1">
            <div className="px-3 py-2 bg-white/10 rounded-md text-sm text-white font-medium flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
              Executive Summary
            </div>
            <div className="px-3 py-2 text-sm text-slate-500 font-medium flex items-center gap-2 hover:text-slate-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Data Sources
            </div>
            <div className="px-3 py-2 text-sm text-slate-500 font-medium flex items-center gap-2 hover:text-slate-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              Quality Reports
            </div>
          </div>
        </div>

        {/* Main Dashboard Area */}
        <div className="flex-1 flex flex-col min-w-0 p-6 lg:p-10 relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-medium text-white tracking-tight">Q3 Financial Performance</h2>
              <p className="text-sm text-slate-500 mt-1">Dataset: Q3_Master_Export.csv (Verified)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Data Quality</span>
                <span className="text-sm text-emerald-400 font-medium">99.2% Perfect</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border border-[#0a0a0f] bg-indigo-500 flex items-center justify-center text-xs font-medium">JD</div>
                <div className="w-8 h-8 rounded-full border border-[#0a0a0f] bg-emerald-500 flex items-center justify-center text-xs font-medium">AM</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-5 rounded-lg border border-white/5 bg-white/[0.02]">
              <div className="text-xs text-slate-500 mb-2 font-medium">Gross Revenue</div>
              <div className="text-2xl font-medium text-white">$2,405,110</div>
              <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">↑ 12.4% vs last period</div>
            </div>
            <div className="p-5 rounded-lg border border-white/5 bg-white/[0.02]">
              <div className="text-xs text-slate-500 mb-2 font-medium">Transaction Volume</div>
              <div className="text-2xl font-medium text-white">18,492</div>
              <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">↑ 4.1% vs last period</div>
            </div>
            <div className="p-5 rounded-lg border border-white/5 bg-white/[0.02]">
              <div className="text-xs text-slate-500 mb-2 font-medium">Avg Order Value</div>
              <div className="text-2xl font-medium text-white">$130.06</div>
              <div className="text-xs text-rose-400 mt-2 flex items-center gap-1">↓ 1.2% vs last period</div>
            </div>
          </div>

          {/* Chart Mockup */}
          <div className="flex-1 rounded-lg border border-white/5 bg-white/[0.01] p-6 relative flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium text-slate-300">Revenue Trajectory</span>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <div className="w-2 h-2 rounded-full bg-slate-700" />
                <div className="w-2 h-2 rounded-full bg-slate-700" />
              </div>
            </div>
            <div className="flex-1 relative border-l border-b border-white/10 ml-4 mb-4">
               {/* Synthetic SVG Line Chart */}
               <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
                 <defs>
                   <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="rgba(99,102,241,0.2)" />
                     <stop offset="100%" stopColor="rgba(99,102,241,0)" />
                   </linearGradient>
                 </defs>
                 <path d="M0,250 L100,220 L200,240 L300,180 L400,200 L500,100 L600,120 L700,80 L800,90 L900,40 L1000,60 L1000,300 L0,300 Z" fill="url(#chart-grad)" />
                 <path d="M0,250 L100,220 L200,240 L300,180 L400,200 L500,100 L600,120 L700,80 L800,90 L900,40 L1000,60" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" />
                 <circle cx="900" cy="40" r="4" fill="#6366f1" className="animate-pulse" />
               </svg>
            </div>
          </div>

          {/* Floating AI Analyst Panel */}
          <div className="absolute bottom-10 right-10 w-[320px] rounded-lg border border-white/10 bg-[#12121a]/95 backdrop-blur-xl shadow-2xl overflow-hidden p-4">
            <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">AI Analyst Active</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Revenue surged <span className="text-white font-medium">12.4%</span> despite a drop in Average Order Value. The primary driver was a <span className="text-white font-medium">22% spike</span> in high-frequency transactions from Enterprise clients on Nov 14th.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
