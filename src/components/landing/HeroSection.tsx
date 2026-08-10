"use client";
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import HeroDashboard from './HeroDashboard';

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1, ease: "easeOut" as any }
    }
  };

  return (
    <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center min-h-screen bg-[#07080F]">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#7C3AED]/10 blur-[120px] rounded-full pointer-events-none z-[-1]" />

      <motion.div 
        className="max-w-7xl mx-auto px-6 text-center z-10 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#00F0FF] px-3 py-1 bg-[#00F0FF]/10 rounded border border-[#00F0FF]/20">
            Enterprise Data Intelligence
          </span>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-[48px] md:text-[80px] lg:text-[110px] font-medium leading-[1] md:leading-[1] lg:leading-[0.95] tracking-[-0.04em] text-white mb-8 mx-auto"
        >
          TURN BUSINESS<br />
          DATA INTO<br />
          <span className="text-[#94a3b8]">BETTER DECISIONS.</span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-lg font-light leading-[1.6] text-[#94a3b8] max-w-2xl mx-auto mb-10"
        >
          Transform raw business data into trusted intelligence with deterministic analytics, automated data quality validation, and AI-assisted decision support.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/auth" 
            className="w-full sm:w-auto px-8 py-4 bg-white text-[#07080F] text-sm font-semibold hover:bg-white/90 transition-colors rounded"
          >
            Explore the Platform
          </Link>
        </motion.div>
      </motion.div>

      {/* Hero Mockup */}
      <motion.div 
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" as any }}
        className="w-full max-w-[1400px] px-6 mt-20"
      >
        <HeroDashboard />
      </motion.div>
    </section>
  );
}