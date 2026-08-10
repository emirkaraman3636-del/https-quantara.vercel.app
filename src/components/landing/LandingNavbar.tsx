"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function LandingNavbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-[#030308]/80 backdrop-blur-md border-b border-white/5"
    >
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center">
          <span className="text-white font-bold text-lg leading-none tracking-tighter">Z</span>
        </div>
        <span className="text-white font-semibold text-xl tracking-tight">Zentrivo</span>
      </div>
      
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
        <Link href="#product" className="hover:text-white transition-colors">Platform</Link>
        <Link href="#data-quality" className="hover:text-white transition-colors">Engine</Link>
        <Link href="#intelligence" className="hover:text-white transition-colors">Intelligence</Link>
        <Link href="#security" className="hover:text-white transition-colors">Security</Link>
      </div>

      <div className="flex items-center space-x-4">
        <Link 
          href="/auth" 
          className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          Sign In
        </Link>
        <Link 
          href="/auth" 
          className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-full transition-all hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
        >
          Start Analyzing
        </Link>
      </div>
    </motion.nav>
  );
}
