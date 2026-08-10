"use client";
import React from 'react';
import { motion } from 'framer-motion';

export function RawDataToIntelligence() {
  return (
    <section className="py-24 px-4 md:px-12 border-t border-white/5 bg-[#05050A]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-[1.2]">
              From messy spreadsheets to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">executive intelligence.</span>
            </h2>
            <p className="text-lg text-slate-400 mb-8 font-light leading-relaxed">
              Upload any business CSV or Excel file. Zentrivo automatically infers the schema, calculates financial metrics deterministically, and presents a production-ready dashboard. Zero configuration required.
            </p>
            <ul className="space-y-4">
              {[
                'Universal file parsing (CSV, XLSX)',
                'Dynamic column mapping & inference',
                'Automatic currency & date formatting',
                'Instant deterministic KPI calculation'
              ].map((text, i) => (
                <li key={i} className="flex items-center text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mr-4 shrink-0">
                    <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent blur-3xl rounded-full" />
            <div className="relative p-6 rounded-2xl border border-white/10 bg-[#0A0A12] shadow-2xl">
              <div className="space-y-3 font-mono text-xs text-slate-500">
                <div className="flex border-b border-white/5 pb-2 font-semibold text-slate-400">
                  <div className="w-1/4">Date</div>
                  <div className="w-1/4">Product</div>
                  <div className="w-1/4 text-right">Revenue</div>
                  <div className="w-1/4 text-right">Cost</div>
                </div>
                {[
                  ['2023-10-01', 'Enterprise Sub', '$12,400', '$4,100'],
                  ['2023-10-01', 'API Access', '$3,200', '$800'],
                  ['2023-10-02', 'Enterprise Sub', '$12,400', '$4,100'],
                  ['2023-10-03', 'Pro License', '$8,900', '$2,200'],
                  ['...', '...', '...', '...']
                ].map((row, i) => (
                  <div key={i} className="flex">
                    <div className="w-1/4">{row[0]}</div>
                    <div className="w-1/4 text-white">{row[1]}</div>
                    <div className="w-1/4 text-right text-emerald-400/70">{row[2]}</div>
                    <div className="w-1/4 text-right text-rose-400/70">{row[3]}</div>
                  </div>
                ))}
              </div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.8)] z-10" />
              
              <div className="absolute -bottom-6 -right-6 p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-xl shadow-2xl">
                <div className="text-xs text-indigo-300 font-medium mb-1">Total Validated Revenue</div>
                <div className="text-2xl font-bold text-white tracking-tight">$36,900.00</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
