"use client";
import React from 'react';

export function LandingFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#030308] py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-600 font-mono">
        <div>© 2026 Zentrivo. All rights reserved.</div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Security</a>
        </div>
      </div>
    </footer>
  );
}
