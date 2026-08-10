"use client";
import React from 'react';
import Link from 'next/link';

export function FinalCTA() {
  return (
    <section className="py-32 px-4 relative overflow-hidden text-center bg-[#030308]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030308]/0 to-[#030308]/0 pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
          Ready to see clearly?
        </h2>
        <p className="text-lg text-slate-400 mb-10 font-light">
          Join the enterprises turning messy data into verified intelligence.
        </p>
        <Link 
          href="/auth" 
          className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold rounded-full overflow-hidden transition-transform hover:scale-105"
        >
          Start Analyzing Now
        </Link>
      </div>
    </section>
  );
}
