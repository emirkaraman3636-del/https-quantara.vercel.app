"use client";
import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="py-40 bg-[#07080F] border-t border-[#272838] text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00F0FF]/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-7xl font-medium tracking-tight text-white mb-6">
          Your data already knows the answer.
        </h2>
        <p className="text-xl md:text-3xl text-[#94A3B8] mb-12 font-light">
          Start asking better questions.
        </p>
        
        <Link 
          href="/auth" 
          className="inline-block px-10 py-5 bg-[#13141D] border border-[#272838] hover:border-[#00F0FF]/50 text-white text-base font-semibold transition-colors rounded"
        >
          Explore Quantara
        </Link>
      </div>
    </section>
  );
}