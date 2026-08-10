"use client";
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function RawDataTransition() {
  const { scrollYProgress } = useScroll({
    offset: ["start end", "center center"]
  });

  const rawOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [1, 1, 0]);
  const cleanOpacity = useTransform(scrollYProgress, [0.4, 0.7, 1], [0, 1, 1]);
  const rawY = useTransform(scrollYProgress, [0, 0.6], [0, -50]);
  const cleanY = useTransform(scrollYProgress, [0.4, 1], [50, 0]);

  return (
    <section id="data-quality" className="relative py-32 bg-[#030308] border-t border-white/5 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative h-[600px] flex flex-col items-center justify-center">
        
        {/* RAW STATE */}
        <motion.div 
          style={{ opacity: rawOpacity, y: rawY }}
          className="absolute inset-0 flex flex-col items-center justify-center w-full"
        >
          <h2 className="text-4xl md:text-5xl font-medium text-slate-600 tracking-tight mb-12">Raw data is messy.</h2>
          <div className="w-full max-w-4xl bg-black border border-red-900/30 rounded-md overflow-hidden font-mono text-xs md:text-sm text-slate-500 opacity-60">
            <div className="grid grid-cols-4 border-b border-white/5 bg-white/[0.02] p-4 text-slate-400">
              <div>DATE</div><div>REVENUE</div><div>CATEGORY</div><div>CUSTOMER_ID</div>
            </div>
            <div className="grid grid-cols-4 border-b border-white/5 p-4 bg-red-900/5">
              <div>2023-10-01</div><div>1040.50</div><div className="text-red-400">NULL</div><div>CUS_882</div>
            </div>
            <div className="grid grid-cols-4 border-b border-white/5 p-4">
              <div>10/02/2023</div><div className="text-red-400">"$850"</div><div>SaaS</div><div>CUS_110</div>
            </div>
            <div className="grid grid-cols-4 border-b border-white/5 p-4 bg-red-900/5">
              <div>2023-10-03</div><div>-50.00</div><div>Retail</div><div className="text-red-400">N/A</div>
            </div>
            <div className="grid grid-cols-4 p-4">
              <div>2023-10-04</div><div>1200.00</div><div>Enterprise</div><div>CUS_992</div>
            </div>
          </div>
        </motion.div>

        {/* CLEAN STATE */}
        <motion.div 
          style={{ opacity: cleanOpacity, y: cleanY }}
          className="absolute inset-0 flex flex-col items-center justify-center w-full"
        >
          <h2 className="text-4xl md:text-5xl font-medium text-white tracking-tight mb-12">Zentrivo makes uncertainty visible.</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
            <div className="p-6 border border-white/10 rounded-md bg-[#0a0a0f] flex flex-col">
              <span className="text-sm text-slate-400 mb-2">Data Quality Score</span>
              <span className="text-3xl font-medium text-white">98.4%</span>
              <div className="w-full h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
                <div className="w-[98.4%] h-full bg-emerald-500" />
              </div>
            </div>
            <div className="p-6 border border-white/10 rounded-md bg-[#0a0a0f] flex flex-col">
              <span className="text-sm text-slate-400 mb-2">Missing Values</span>
              <span className="text-3xl font-medium text-white">0.8%</span>
              <span className="text-xs text-amber-400 mt-2">12 rows flagged</span>
            </div>
            <div className="p-6 border border-white/10 rounded-md bg-[#0a0a0f] flex flex-col">
              <span className="text-sm text-slate-400 mb-2">Format Anomalies</span>
              <span className="text-3xl font-medium text-white">0.3%</span>
              <span className="text-xs text-emerald-400 mt-2">Automatically cast</span>
            </div>
            <div className="p-6 border border-white/10 rounded-md bg-[#0a0a0f] flex flex-col">
              <span className="text-sm text-slate-400 mb-2">Inferred Schema</span>
              <span className="text-3xl font-medium text-white">Locked</span>
              <span className="text-xs text-indigo-400 mt-2">14 columns mapped</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
