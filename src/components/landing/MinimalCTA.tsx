"use client";
import React from 'react';
import Link from 'next/link';

export function MinimalCTA() {
  return (
    <section className="py-40 bg-[#030308] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-5xl md:text-7xl font-medium text-slate-600 tracking-tight leading-tight mb-4">
        Your data already knows.
      </h2>
      <h3 className="text-5xl md:text-7xl font-medium text-white tracking-tight leading-tight mb-16">
        Zentrivo helps you see it.
      </h3>
      <Link 
        href="/auth" 
        className="px-10 py-5 bg-white text-black font-medium rounded-md hover:bg-slate-200 transition-colors text-lg"
      >
        Start Analyzing Now
      </Link>
    </section>
  );
}
