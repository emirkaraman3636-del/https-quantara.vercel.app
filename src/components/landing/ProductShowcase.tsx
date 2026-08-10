"use client";
import HeroDashboard from './HeroDashboard';

export default function ProductShowcase() {
  return (
    <section className="py-32 bg-[#0B0C15] border-t border-[#272838] text-center">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6">
          Your business, <span className="text-[#00F0FF]">at a glance.</span>
        </h2>
        <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
          Experience the complete Quantara platform. High information density, clean hierarchy, and actionable intelligence.
        </p>
      </div>

      <div className="max-w-[95%] lg:max-w-[1200px] mx-auto relative">
        <HeroDashboard />
      </div>
    </section>
  );
}