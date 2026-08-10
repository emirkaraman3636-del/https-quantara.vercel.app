'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Network, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Drop In Your Data',
      subtitle: 'UPLOAD',
      desc: 'Upload raw CSV or Excel datasets. No data cleaning, manual schema mapping, or template preparation needed.',
      icon: <UploadCloud className="w-6 h-6 text-indigo-400" />,
      detail: 'Supports CSV, XLSX, XLS with automatic encoding and delimiter detection.'
    },
    {
      num: '02',
      title: 'Automatic Structure Inference',
      subtitle: 'UNDERSTAND',
      desc: 'Zentrivo automatically identifies metrics, dimensions, currencies, dates, and temporal granularity without human bias.',
      icon: <Network className="w-6 h-6 text-violet-400" />,
      detail: 'Isolates Revenue, COGS, Profit, Quantities, and Customer channels.'
    },
    {
      num: '03',
      title: 'Act On Grounded Insights',
      subtitle: 'ACT',
      desc: 'Receive deterministic financial metrics paired with evidence-grounded AI recommendations that drive real growth.',
      icon: <Zap className="w-6 h-6 text-emerald-400" />,
      detail: 'Strict Zod schema validation ensures zero AI math hallucinations.'
    }
  ];

  return (
    <section id="how-it-works" className="py-32 px-6 relative bg-[#030308] border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Seamless Architecture</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            How Zentrivo Works
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            From raw spreadsheet files to enterprise decision intelligence in three automated steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group hover:border-indigo-500/40 transition-all hover:-translate-y-1"
            >
              {/* Background Step Number Accent */}
              <div className="absolute top-4 right-6 text-6xl font-black text-slate-800/30 group-hover:text-indigo-500/10 transition-colors pointer-events-none">
                {step.num}
              </div>

              <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-6 relative z-10 shadow-lg">
                {step.icon}
              </div>

              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">
                {step.subtitle}
              </div>

              <h3 className="text-xl font-bold text-white mb-3 relative z-10">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 relative z-10">{step.desc}</p>

              <div className="pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-slate-500 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{step.detail}</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
