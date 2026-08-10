'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Database, Shield, Lock, FileSearch } from 'lucide-react';

export function TrustAndQuality() {
  return (
    <section id="security" className="py-24 px-6 bg-slate-950 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Trust Your Numbers.</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Before generating insights, Zentrivo evaluates the quality and structure of your data.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 md:p-12 bg-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
                <Database className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Raw Data</h3>
              
              <div className="w-px h-12 bg-indigo-500/30 my-4 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                </div>
              </div>
              
              <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 mb-4 relative z-10">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-slate-900 rounded-xl text-sm font-medium text-slate-300">Duplicate Detection</div>
                  <div className="p-3 bg-slate-900 rounded-xl text-sm font-medium text-slate-300">Missing Values</div>
                  <div className="p-3 bg-slate-900 rounded-xl text-sm font-medium text-slate-300">Outliers</div>
                  <div className="p-3 bg-slate-900 rounded-xl text-sm font-medium text-slate-300">Schema Detection</div>
                </div>
              </div>

              <div className="w-px h-12 bg-emerald-500/30 my-4" />
              
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 relative">
                 <Shield className="w-8 h-8 text-emerald-400" />
                 <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                 </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Verified Data</h3>

              <div className="w-px h-12 bg-emerald-500/30 my-4" />

              <div className="w-full bg-indigo-600 rounded-2xl p-6 text-center shadow-[0_0_40px_rgba(79,70,229,0.2)]">
                <h3 className="text-xl font-bold text-white">Business Intelligence</h3>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

