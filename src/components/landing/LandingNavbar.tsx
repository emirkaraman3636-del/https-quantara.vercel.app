'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 ${
        scrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.05]' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-xl font-bold text-white tracking-tight">Zentrivo</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <a href="#product" className="hover:text-white transition-colors">Product</a>
        <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
        <a href="#ai-analyst" className="hover:text-white transition-colors">AI Analyst</a>
        <a href="#security" className="hover:text-white transition-colors">Security</a>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/auth" className="hidden md:block text-sm font-medium text-slate-300 hover:text-white transition-colors">
          Log In
        </Link>
        <Link href="/auth" className="text-sm font-semibold bg-white text-black px-4 py-2 rounded-full hover:bg-slate-200 transition-colors shadow-lg shadow-white/10">
          Start Analyzing
        </Link>
      </div>
    </motion.nav>
  );
}

