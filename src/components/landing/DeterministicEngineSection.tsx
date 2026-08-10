"use client";
import { motion, useReducedMotion } from 'framer-motion';

export default function DeterministicEngineSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24 md:py-40 bg-[#0a0a0f] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-24"
        >
          <span className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#475569] mb-4 block">
            BI ENGINE
          </span>
          <h2 className="text-[40px] md:text-[56px] font-medium tracking-[-0.02em] md:tracking-[-0.03em] leading-[1.1] text-white">
            Numbers are calculated.<br />
            <span className="text-[#94a3b8]">Not imagined.</span>
          </h2>
          <p className="mt-6 text-lg font-light text-[#94a3b8] max-w-xl">
            Every metric is calculated from traceable data and deterministic logic. AI doesn't do the math; the engine does.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row border border-white/10 overflow-hidden">
          {/* Terminal Left */}
          <div className="flex-1 bg-[#030308] p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10 font-mono text-sm leading-relaxed">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.3, delayChildren: 0.2 } }
              }}
            >
              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="text-[#475569]">&gt; LOAD DATASET: Q3_Financials.csv</motion.div>
              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="text-[#94a3b8]">&gt; VALIDATING 48,291 RECORDS...</motion.div>
              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="text-[#94a3b8]">&gt; APPLYING DETERMINISTIC RULES...</motion.div>
              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="text-[#94a3b8]">&gt; CALCULATING KPI METRICS...</motion.div>
              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="text-[#10b981]">&gt; RESULT VERIFIED. NO HALLUCINATION DETECTED.</motion.div>
            </motion.div>
          </div>

          {/* Results Right */}
          <div className="flex-1 bg-white/[0.01] p-8 md:p-12 flex flex-col justify-center space-y-12">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-[#94a3b8] text-xs font-medium tracking-widest uppercase">Revenue Growth</span>
                <span className="px-2 py-0.5 border border-[#10b981]/30 text-[#10b981] text-[10px] font-semibold tracking-wider uppercase rounded-sm">Verified Source</span>
              </div>
              <div className="text-4xl md:text-5xl font-medium text-white tracking-tight">+18.4%</div>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-[#94a3b8] text-xs font-medium tracking-widest uppercase">Operating Margin</span>
                <span className="px-2 py-0.5 border border-[#10b981]/30 text-[#10b981] text-[10px] font-semibold tracking-wider uppercase rounded-sm">Verified Source</span>
              </div>
              <div className="text-4xl md:text-5xl font-medium text-white tracking-tight">24.7%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
