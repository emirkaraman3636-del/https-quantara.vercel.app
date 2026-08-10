"use client";
import { motion, useReducedMotion } from 'framer-motion';

export default function RawDataTransition() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24 md:py-40 bg-[#030308] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24"
        >
          <h2 className="text-[40px] md:text-[56px] font-medium tracking-[-0.02em] md:tracking-[-0.03em] leading-[1.1] text-white">
            Raw data is messy.<br />
            <span className="text-[#94a3b8]">Decisions shouldn't be.</span>
          </h2>
        </motion.div>

        <div className="relative mx-auto max-w-4xl h-[400px] border border-white/10 bg-[#0a0a0f] p-1 overflow-hidden group">
          {/* The Scanline */}
          <motion.div 
            initial={{ top: '0%' }}
            whileInView={{ top: '100%' }}
            viewport={{ once: false }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.8)] z-20 pointer-events-none"
          />

          {/* Table Container */}
          <div className="w-full h-full p-6 text-sm font-mono flex flex-col">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 text-[#475569] mb-4 uppercase text-[10px] tracking-wider pb-2 border-b border-white/5">
              <div>Transaction ID</div>
              <div>Date</div>
              <div>Amount</div>
              <div>Status</div>
            </div>

            {/* Rows (Simulating correction on hover/scan) */}
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-[#94a3b8] transition-colors duration-500 group-hover:text-white">
                <div>TRX-9012</div>
                <div className="text-[#ef4444] group-hover:text-[#94a3b8]">03/12/26</div>
                <div>$12,450.00</div>
                <div className="text-[#10b981]">CLEARED</div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-[#94a3b8] transition-colors duration-500 group-hover:text-white">
                <div>TRX-9013</div>
                <div className="text-[#ef4444] group-hover:text-[#94a3b8]">N/A</div>
                <div className="text-[#ef4444] group-hover:text-[#94a3b8]">12450</div>
                <div className="text-[#ef4444] group-hover:text-[#10b981]">PENDING</div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-[#94a3b8] transition-colors duration-500 group-hover:text-white">
                <div>TRX-9014</div>
                <div>2026-12-03</div>
                <div className="text-[#ef4444] group-hover:text-[#94a3b8]">NULL</div>
                <div className="text-[#10b981]">CLEARED</div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-[#94a3b8] transition-colors duration-500 group-hover:text-white">
                <div className="text-[#ef4444] group-hover:text-[#94a3b8]">---</div>
                <div>2026-12-04</div>
                <div>$4,200.00</div>
                <div className="text-[#10b981]">CLEARED</div>
              </div>
            </div>

            {/* Overlay that appears after 'cleaning' */}
            <div className="absolute inset-0 bg-[#0a0a0f]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 flex items-center justify-center backdrop-blur-sm z-10">
              <div className="text-center">
                <div className="text-5xl font-medium text-white mb-2 tracking-tight">DATA CLEANED</div>
                <div className="text-[#10b981] font-medium tracking-wide uppercase text-xs">Ready for analysis</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
