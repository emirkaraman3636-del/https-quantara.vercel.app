"use client";
import { motion, useReducedMotion } from 'framer-motion';

export default function AIAnalystSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24 md:py-40 bg-[#030308] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-24"
        >
          <span className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#475569] mb-4 block">
            AI ANALYST
          </span>
          <h2 className="text-[40px] md:text-[56px] font-medium tracking-[-0.02em] md:tracking-[-0.03em] leading-[1.1] text-white">
            Ask the data.<br />
            <span className="text-[#94a3b8]">Understand the why.</span>
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* User Query */}
          <div className="flex-1 lg:flex-none lg:w-1/3">
            <div className="sticky top-40">
              <div className="text-[#475569] text-xs font-medium uppercase tracking-widest mb-4">Your Query</div>
              <div className="p-6 border border-white/10 bg-white/[0.02] text-xl font-medium text-white leading-relaxed">
                "Why did revenue decline in Q3?"
              </div>
            </div>
          </div>

          {/* AI Response Panel */}
          <div className="flex-[2] border border-white/10 bg-[#0a0a0f] p-8 md:p-12 relative">
            <div className="text-[#475569] text-xs font-medium uppercase tracking-widest mb-6 flex items-center">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2" /> AI Response
            </div>
            
            <p className="text-xl md:text-2xl font-light leading-[1.6] text-white mb-12">
              Revenue decreased primarily due to a 12.4% decline in enterprise accounts, partially offset by a 7.1% increase in SMB revenue.
            </p>

            {/* Evidence Box */}
            <div className="border-t border-white/5 pt-8">
              <div className="text-[#94a3b8] text-xs font-medium uppercase tracking-widest mb-4">Evidence & Metrics</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-white/5 bg-white/[0.01]">
                  <div className="text-sm text-[#94a3b8] mb-1">Enterprise Revenue</div>
                  <div className="text-lg font-medium text-[#ef4444]">↓ 12.4%</div>
                </div>
                <div className="p-4 border border-white/5 bg-white/[0.01]">
                  <div className="text-sm text-[#94a3b8] mb-1">SMB Revenue</div>
                  <div className="text-lg font-medium text-[#10b981]">↑ 7.1%</div>
                </div>
              </div>
            </div>

            {/* Footer Tag */}
            <div className="mt-8 inline-flex items-center space-x-2 px-3 py-1.5 border border-[#10b981]/20 bg-[#10b981]/5 rounded-sm">
              <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full" />
              <span className="text-[#10b981] text-[10px] font-semibold tracking-wider uppercase">Based on verified deterministic data</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
