'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, ShieldCheck, Sparkles, Send, CheckCircle2 } from 'lucide-react';

export function AIAnalystPreview() {
  return (
    <section id="ai-analyst" className="py-32 px-6 relative overflow-hidden bg-[#030308] border-t border-slate-800/80">
      {/* Lighting */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Copy Column */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold tracking-wider uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            AI Business Analyst
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.12] mb-6">
            Ask Your Business <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400">
              Anything.
            </span>
          </h2>

          <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8">
            Instead of searching through endless spreadsheet rows or building manual pivot tables, ask plain questions and receive evidence-grounded answers.
          </p>

          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 mb-8">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs text-emerald-300 font-semibold">
              ✓ Grounded in verified business data — Zero financial math hallucinations
            </div>
          </div>
        </motion.div>

        {/* Right Interactive Chat Preview */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-7"
        >
          <div className="bg-[#080812] border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Zentrivo AI Analyst</div>
                  <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Connected to BI Context
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                Model: Zod Strict JSON
              </div>
            </div>

            {/* Conversation Flow */}
            <div className="space-y-4 mb-6">
              
              {/* User Prompt */}
              <div className="flex justify-end">
                <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-3 text-xs max-w-md shadow-md">
                  Why did operating profitability decline in the latest quarter?
                </div>
              </div>

              {/* AI Response */}
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-4 text-xs text-slate-300 leading-relaxed max-w-lg space-y-3">
                  <p>
                    Based on your verified <strong className="text-white">Q3 Financial BI Context</strong>, operating profit declined by <strong className="text-rose-400 font-mono">₺14,200 (-12.8%)</strong>.
                  </p>
                  
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between text-slate-400"><span>Revenue Growth:</span><span className="text-emerald-400">+2.4%</span></div>
                    <div className="flex justify-between text-slate-400"><span>COGS / Expense Growth:</span><span className="text-rose-400">+14.1%</span></div>
                    <div className="flex justify-between text-slate-400"><span>Primary Driver:</span><span className="text-indigo-300">Logistics & COGS</span></div>
                  </div>

                  <p className="text-slate-400">
                    <strong className="text-indigo-300">Action Recommendation:</strong> Renegotiate primary logistics contracts to recover approximately ₺9,000 in gross margin.
                  </p>
                </div>
              </div>

            </div>

            {/* Mock Prompt Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-500">
              <span>Ask follow-up questions about revenue channels, regional growth...</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Send className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
