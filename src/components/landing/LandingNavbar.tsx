"use client";
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

export default function LandingNavbar() {
  const { scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(3, 3, 8, 0)', 'rgba(3, 3, 8, 0.85)']
  );
  const borderColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.05)']
  );
  const backdropFilter = useTransform(
    scrollY,
    [0, 50],
    ['blur(0px)', 'blur(12px)']
  );

  return (
    <motion.nav
      style={{ backgroundColor, borderColor, backdropFilter }}
      className="fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-white font-bold tracking-tight text-xl">
          ZENTRIVO
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#94a3b8]">
          <Link href="#platform" className="hover:text-white transition-colors">Platform</Link>
          <Link href="#intelligence" className="hover:text-white transition-colors">Intelligence</Link>
          <Link href="#quality" className="hover:text-white transition-colors">Data Quality</Link>
        </div>

        <div className="flex items-center space-x-6">
          <Link href="/auth" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
            Log in
          </Link>
          <Link
            href="/auth"
            className="text-sm font-medium bg-white text-black px-4 py-2 hover:bg-white/90 transition-colors"
          >
            Start Analyzing
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
