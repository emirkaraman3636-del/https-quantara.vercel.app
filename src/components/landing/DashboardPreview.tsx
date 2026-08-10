"use client";
import React from 'react';
import { motion } from 'framer-motion';

export function DashboardPreview() {
  return (
    <section id="product" className="relative pb-32 px-4 md:px-12 max-w-7xl mx-auto">
      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A12] shadow-2xl shadow-indigo-500/10"
      >
        {/* Mock Topbar */}
        <div className="flex items-center px-4 py-3 border-b border-white/5 bg-[#12121A]">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-slate-700" />
            <div className="w-3 h-3 rounded-full bg-slate-700" />
            <div className="w-3 h-3 rounded-full bg-slate-700" />
          </div>
          <div className="mx-auto bg-black/40 border border-white/5 rounded-md px-32 py-1.5 text-xs text-slate-500 flex items-center">
            <svg className="w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            zentrivo.com/dashboard
          </div>
        </div>

        {/* Mock Dashboard Body */}
        <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-1 tracking-tight">Q3 Financial Performance</h3>
                <p className="text-sm text-slate-400">Analysis of 12,450 transactional records.</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                Data Quality: 98%
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Total Revenue', value: '$2,450,890.00', trend: '+12.4%', up: true },
                { label: 'Gross Margin', value: '64.2%', trend: '+2.1%', up: true },
                { label: 'Operating Cost', value: '$875,400.00', trend: '-4.3%', up: false }
              ].map((kpi, i) => (
                <div key={i} className="p-5 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
                  <span className="text-sm text-slate-400 font-medium mb-2">{kpi.label}</span>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-white tracking-tight">{kpi.value}</span>
                    <span className={`text-xs font-semibold ${kpi.up ? 'text-emerald-400' : 'text-rose-400'}`}>{kpi.trend}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart Area */}
            <div className="p-6 rounded-xl border border-white/5 bg-white/[0.01] h-[300px] flex flex-col">
              <span className="text-sm text-slate-400 font-medium mb-6">Revenue Growth (Trailing 12 Weeks)</span>
              <div className="flex-1 relative flex items-end justify-between px-2">
                {/* Mock Chart Bars */}
                {[40, 55, 45, 60, 75, 65, 80, 95, 85, 100, 110, 125].map((height, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                    className="w-[6%] bg-gradient-to-t from-indigo-600/40 to-indigo-400/80 rounded-t-sm"
                  />
                ))}
                
                {/* Overlay Line */}
                <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                  <motion.path 
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                    d="M 0,220 C 50,190 100,200 150,170 C 200,140 250,160 300,120 C 350,80 400,100 450,50 C 500,20 550,40 600,10"
                    stroke="#818cf8"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]"
                  />
                </svg>
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-slate-500 font-medium uppercase tracking-wider px-2">
                <span>Wk 1</span><span>Wk 4</span><span>Wk 8</span><span>Wk 12</span>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="w-full lg:w-80 space-y-4">
            <div className="p-5 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.03] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span className="font-semibold text-white tracking-tight">AI Analyst Insight</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                <span className="text-white font-medium">Revenue velocity increased by 12.4%</span> in Q3, driven primarily by Enterprise software sales in the EMEA region. Operating margins improved despite a 4.3% reduction in overall cost.
              </p>
            </div>
            
            <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
              <span className="block text-sm text-slate-400 font-medium mb-4">Category Breakdown</span>
              <div className="space-y-4">
                {[
                  { name: 'Enterprise', val: '45%', color: 'bg-indigo-500' },
                  { name: 'Mid-Market', val: '35%', color: 'bg-violet-500' },
                  { name: 'SMB', val: '20%', color: 'bg-slate-500' }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{item.name}</span>
                      <span className="text-white font-medium">{item.val}</span>
                    </div>
                    <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: item.val }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                        className={`h-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
