'use client';
import React from 'react';
import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Zentrivo</span>
          </div>
          <p className="text-slate-500 text-sm">AI-powered business intelligence.</p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-slate-400">
          <a href="#product" className="hover:text-white transition-colors">Product</a>
          <a href="#ai-analyst" className="hover:text-white transition-colors">AI Analyst</a>
          <Link href="/auth" className="hover:text-white transition-colors">Dashboard</Link>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}

