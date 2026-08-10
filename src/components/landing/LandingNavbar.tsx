"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

export function LandingNavbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const background = useTransform(
    scrollY,
    [0, 50],
    ['rgba(3, 3, 8, 0)', 'rgba(3, 3, 8, 0.85)']
  );
  const border = useTransform(
    scrollY,
    [0, 50],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.05)']
  );

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

  return (
    <motion.nav
      style={{ backgroundColor: background, borderBottomColor: border, borderBottomWidth: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-md transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-sm bg-white text-black flex items-center justify-center font-bold text-lg tracking-tighter">
          Z
        </div>
        <span className="text-xl font-medium text-white tracking-tight">Zentrivo</span>
      </div>
      
      <div className="hidden md:flex items-center gap-10 text-sm font-medium text-slate-400">
        <Link href="#product" className="hover:text-white transition-colors">Platform</Link>
        <Link href="#data-quality" className="hover:text-white transition-colors">Engine</Link>
        <Link href="#intelligence" className="hover:text-white transition-colors">Intelligence</Link>
        <Link href="#security" className="hover:text-white transition-colors">Security</Link>
      </div>

      <div className="flex items-center gap-6">
        <Link href="/auth" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden md:block">
          Sign In
        </Link>
        <Link 
          href="/auth" 
          className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md transition-colors border border-white/10"
        >
          Start Analyzing
        </Link>
      </div>
    </motion.nav>
  );
}
