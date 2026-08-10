'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Database, Calculator, Network, Bot } from 'lucide-react';

export function DeterministicIntelligence() {
  return (
    <section className="py-24 px-6 bg-[#05050A] relative overflow-hidden">
      {/* Background line connecting the steps visually */}
      <div className="absolute left-1/2 -translate-x-1/2 top-48 bottom-24 w-px bg-gradient-to-b from-slate-800 via-indigo-500/50 to-slate-800 hidden md:block" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Numbers You Can Trust.</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Financial metrics are calculated deterministically from your data. AI interprets the results instead of inventing them.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {/* Step 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center gap-6"
          >
            <div className="md:w-1/2 flex md:justify-end">
              <div className="px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl w-64 text-center">
                <div className="w-10 h-10 mx-auto bg-slate-800 rounded-lg flex items-center justify-center mb-3">
                  <Database className="w-5 h-5 text-slate-300" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Raw Data</h3>
                <p className="text-xs text-slate-500">Verified & Typed</p>
              </div>
            </div>
            <div className="hidden md:flex w-12 h-12 bg-[#05050A] border-4 border-[#05050A] rounded-full items-center justify-center z-10 text-slate-600">
              <div className="w-3 h-3 rounded-full bg-slate-700" />
            </div>
            <div className="md:w-1/2" />
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col md:flex-row-reverse items-center gap-6"
          >
            <div className="md:w-1/2 flex md:justify-start">
              <div className="px-6 py-4 bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-xl w-64 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-500/5" />
                <div className="w-10 h-10 mx-auto bg-indigo-500/10 rounded-lg flex items-center justify-center mb-3 relative z-10">
                  <Calculator className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1 relative z-10">Deterministic Calculations</h3>
                <p className="text-xs text-indigo-300/70 relative z-10">Math, Not Hallucination</p>
              </div>
            </div>
            <div className="hidden md:flex w-12 h-12 bg-[#05050A] border-4 border-[#05050A] rounded-full items-center justify-center z-10">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
            </div>
            <div className="md:w-1/2" />
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col md:flex-row items-center gap-6"
          >
            <div className="md:w-1/2 flex md:justify-end">
              <div className="px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl w-64 text-center">
                <div className="w-10 h-10 mx-auto bg-slate-800 rounded-lg flex items-center justify-center mb-3">
                  <Network className="w-5 h-5 text-slate-300" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Business Intelligence</h3>
                <p className="text-xs text-slate-500">Source of Truth</p>
              </div>
            </div>
            <div className="hidden md:flex w-12 h-12 bg-[#05050A] border-4 border-[#05050A] rounded-full items-center justify-center z-10 text-slate-600">
              <div className="w-3 h-3 rounded-full bg-slate-700" />
            </div>
            <div className="md:w-1/2" />
          </motion.div>

          {/* Step 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col md:flex-row-reverse items-center gap-6"
          >
            <div className="md:w-1/2 flex md:justify-start">
              <div className="px-6 py-4 bg-slate-900 border border-violet-500/30 rounded-2xl shadow-[0_0_30px_-5px_rgba(139,92,246,0.15)] w-64 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-violet-500/5" />
                <div className="w-10 h-10 mx-auto bg-violet-500/10 rounded-lg flex items-center justify-center mb-3 relative z-10">
                  <Bot className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1 relative z-10">AI Interpretation</h3>
                <p className="text-xs text-violet-300/70 relative z-10">Actionable Insights</p>
              </div>
            </div>
            <div className="hidden md:flex w-12 h-12 bg-[#05050A] border-4 border-[#05050A] rounded-full items-center justify-center z-10 text-violet-500">
              <div className="w-4 h-4 rounded-full bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.6)]" />
            </div>
            <div className="md:w-1/2" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
