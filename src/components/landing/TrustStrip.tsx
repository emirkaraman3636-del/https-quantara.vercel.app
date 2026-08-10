"use client";

export default function TrustStrip() {
  return (
    <section className="py-16 border-t border-white/5 bg-[#030308]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#475569] mb-8">
          BUILT FOR DATA-DRIVEN TEAMS
        </p>
        <div className="flex flex-wrap justify-center gap-12 text-[#94a3b8] text-sm font-medium tracking-wide">
          <span>FINANCE</span>
          <span>OPERATIONS</span>
          <span>STRATEGY</span>
          <span>ANALYTICS</span>
          <span>MANAGEMENT</span>
        </div>
      </div>
    </section>
  );
}
