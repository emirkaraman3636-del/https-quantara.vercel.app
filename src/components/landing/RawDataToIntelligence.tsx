'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Table, Layers, BarChart3, CheckCircle2 } from 'lucide-react';

export function RawDataToIntelligence() {
  return (
    <section className="py-32 px-6 bg-[#030308] relative overflow-hidden border-t border-white/[0.04]">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Narrative Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-5"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Raw Data Transformation
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.15] mb-6">
              From Raw Data <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
                To Decision Fabric.
              </span>
            </h2>

            <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8">
              Spreadsheets are filled with messy schemas, missing values, inconsistent formats, and hidden anomalies. Zentrivo instantly cleans, types, aggregates, and turns chaos into a unified intelligence layer.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { title: 'Zero Configuration Parsing', desc: 'Auto-detects delimiters, dates, financial currencies, and dimensions.' },
                { title: 'Deterministic Metric Isolation', desc: 'Financial calculations are strict math—never guessed by AI models.' },
                { title: 'Automated Anomaly Spotting', desc: 'Instantly highlights revenue leaks, margin drops, and growth levers.' }
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">{feat.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Visual Interactive Grid */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-7 relative"
          >
            <div className="p-1 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-slate-800/40 to-violet-500/20 shadow-2xl backdrop-blur-xl">
              <div className="bg-[#080811] rounded-xl p-6 border border-slate-800/80">
                
                {/* Top Bar showing transformation flow */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                      <Table className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-300">Q3_financials_raw.csv</div>
                      <div className="text-[11px] text-slate-500">24,500 rows • 18 columns</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      Data Quality: 98.4%
                    </span>
                  </div>
                </div>

                {/* Grid Split: Raw vs Cleaned */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Left: Raw CSV snippet */}
                  <div className="bg-slate-950/80 rounded-lg p-4 border border-slate-800/60 font-mono text-[11px] text-slate-400 leading-relaxed overflow-hidden relative">
                    <div className="text-[10px] text-slate-500 font-sans font-semibold uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Raw Input</span>
                      <span className="text-rose-400/80">Unstructured</span>
                    </div>
                    <div className="opacity-60 space-y-1.5">
                      <div className="text-slate-500">Date, Revenue, Cost, Category</div>
                      <div className="text-rose-400/70 bg-rose-500/5 px-1 rounded">2026-08-01, "₺142,500", NULL, Retail</div>
                      <div>2026-08-02, ₺89200, ₺41000, Tech</div>
                      <div className="text-amber-400/70 bg-amber-500/5 px-1 rounded">2026-08-03, N/A, ₺12000, Retail</div>
                      <div>2026-08-04, ₺210000, ₺95000, Tech</div>
                    </div>
                  </div>

                  {/* Right: Transformed Intelligence Tile */}
                  <div className="bg-indigo-950/20 rounded-lg p-4 border border-indigo-500/30 flex flex-col justify-between relative overflow-hidden">
                    <div className="text-[10px] text-indigo-300 font-sans font-semibold uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Normalized BI</span>
                      <span className="text-emerald-400">Validated</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-slate-400">Gross Margin</div>
                        <div className="text-2xl font-bold text-white">54.2%</div>
                      </div>

                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: '0%' }}
                          whileInView={{ width: '54.2%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                        />
                      </div>

                      <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>0 fake zero values injected</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
