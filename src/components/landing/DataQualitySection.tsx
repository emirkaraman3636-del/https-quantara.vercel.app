"use client";
import { motion, useReducedMotion } from 'framer-motion';

export default function DataQualitySection() {
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
            DATA QUALITY
          </span>
          <h2 className="text-[40px] md:text-[56px] font-medium tracking-[-0.02em] md:tracking-[-0.03em] leading-[1.1] text-white">
            Know your data before you trust it.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Big Score */}
          <div>
            <div className="text-[#94a3b8] text-sm font-medium mb-4 uppercase tracking-widest">Global Quality Score</div>
            <div className="text-[120px] leading-none font-medium tracking-[-0.04em] text-[#10b981]">98.7%</div>
          </div>

          {/* Breakdown */}
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white font-medium">Accuracy</span>
                <span className="text-[#10b981]">99.2%</span>
              </div>
              <div className="w-full h-1 bg-white/5">
                <motion.div 
                  initial={{ width: 0 }} whileInView={{ width: '99.2%' }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-[#10b981]" 
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white font-medium">Completeness</span>
                <span className="text-white">97.8%</span>
              </div>
              <div className="w-full h-1 bg-white/5">
                <motion.div 
                  initial={{ width: 0 }} whileInView={{ width: '97.8%' }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.1 }}
                  className="h-full bg-white/60" 
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white font-medium">Consistency</span>
                <span className="text-white">98.9%</span>
              </div>
              <div className="w-full h-1 bg-white/5">
                <motion.div 
                  initial={{ width: 0 }} whileInView={{ width: '98.9%' }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  className="h-full bg-white/60" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
