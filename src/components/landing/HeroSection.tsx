"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative pt-48 pb-24 md:pt-64 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4 bg-[#030308]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-indigo-900/10 blur-[120px] rounded-[100%] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-5xl mx-auto flex flex-col items-center"
      >
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[110px] font-medium text-white tracking-[-0.04em] leading-[0.95] mb-8 text-center max-w-[1200px]">
          Turn Business Data <br />
          <span className="text-slate-400">Into Better Decisions.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-normal leading-relaxed text-center">
          CSV/Excel → Data Quality → Deterministic Intelligence → AI Analyst → Decisions.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            href="/auth" 
            className="px-8 py-4 bg-white text-black text-sm font-medium rounded-md hover:bg-slate-200 transition-colors"
          >
            Start Analyzing
          </Link>
          <Link 
            href="#product" 
            className="px-8 py-4 text-white text-sm font-medium rounded-md border border-white/20 hover:bg-white/5 transition-colors"
          >
            Explore the Platform
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
