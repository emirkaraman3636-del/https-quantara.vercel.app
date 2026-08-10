"use client";
import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="relative py-32 md:py-48 bg-[#030308] border-t border-white/5 overflow-hidden flex items-center justify-center">
      {/* Subtle bottom-up radial gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-900/10 blur-[100px] pointer-events-none" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}
      />

      <div className="max-w-4xl mx-auto px-6 text-center z-10">
        <h2 className="text-[40px] md:text-[64px] font-medium tracking-tight leading-[1.1] text-white mb-4">
          Your data already knows the answer.
        </h2>
        <p className="text-[32px] md:text-[48px] font-light tracking-tight text-[#94a3b8] mb-12">
          Start asking better questions.
        </p>
        
        <Link 
          href="/auth" 
          className="inline-block px-10 py-5 bg-white text-black text-sm font-semibold tracking-wide hover:bg-white/90 transition-colors"
        >
          Explore the Platform
        </Link>
      </div>
    </section>
  );
}
