"use client";
import React from 'react';
import { motion } from 'framer-motion';

export function HowItWorks() {
  const steps = [
    { num: "01", title: "Upload Data", desc: "Drag and drop any business dataset. Zentrivo's universal parser handles the formatting instantly." },
    { num: "02", title: "Semantic Engine", desc: "Our engine maps your messy columns to a standardized financial schema with zero manual rules." },
    { num: "03", title: "Deterministic BI", desc: "Calculates Revenue, Cost, Profit, and Margins using strict, hallucination-free deterministic logic." },
    { num: "04", title: "AI Analysis", desc: "An LLM-powered business analyst reviews the verified metrics to provide strategic executive insights." }
  ];

  return (
    <section className="py-24 px-4 md:px-12 bg-[#030308]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">The Zentrivo Pipeline</h2>
          <p className="text-lg text-slate-400 font-light max-w-2xl">A four-stage architecture designed for absolute precision and actionable intelligence.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="hidden md:block absolute top-6 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              className="relative pt-4"
            >
              <div className="w-12 h-12 rounded-full border border-indigo-500/30 bg-[#0A0A12] flex items-center justify-center text-indigo-400 font-bold mb-6 relative z-10 shadow-[0_0_15px_rgba(79,70,229,0.2)]">
                {step.num}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
