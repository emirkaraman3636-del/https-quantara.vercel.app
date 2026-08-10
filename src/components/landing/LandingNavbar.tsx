"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingNavbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#272838] bg-[#07080f]/80 backdrop-blur-md"
    >
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="text-white font-bold text-xl tracking-tight flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#7C3AED] to-[#00F0FF] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            QUANTARA
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-[#94a3b8]">
            <Link href="#data-quality" className="hover:text-white transition-colors">Data Quality</Link>
            <Link href="#engine" className="hover:text-white transition-colors">Analytics</Link>
            <Link href="#ai" className="hover:text-white transition-colors">AI Analyst</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth" className="text-sm font-medium text-[#94a3b8] hover:text-white transition-colors">
            Log in
          </Link>
          <Link href="/auth" className="text-sm font-medium px-4 py-2 bg-[#13141D] text-white border border-[#272838] hover:border-[#00F0FF]/50 transition-colors rounded">
            Get Started
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}