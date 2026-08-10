"use client";

export default function PipelineSection() {
  const nodes = [
    { title: "RAW DATA", desc: "Import messy business data." },
    { title: "DATA QUALITY", desc: "Detect inconsistencies." },
    { title: "BI ENGINE", desc: "Calculate trusted metrics." },
    { title: "AI ANALYST", desc: "Understand the why." },
    { title: "DECISION", desc: "Turn intelligence into action." }
  ];

  return (
    <section className="py-24 md:py-40 bg-[#0a0a0f] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-[32px] md:text-[40px] font-medium tracking-tight text-white">The Unified Pipeline</h2>
        </div>

        {/* Desktop Horizontal Pipeline */}
        <div className="hidden md:flex relative justify-between items-start w-full group">
          {/* Connecting Line */}
          <div className="absolute top-3 left-0 right-0 h-px bg-white/10 z-0" />
          
          {nodes.map((node, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center w-48 opacity-70 hover:opacity-100 transition-opacity duration-300">
              <div className="w-6 h-6 rounded-full bg-[#030308] border-2 border-white/20 mb-6 flex items-center justify-center hover:border-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all">
                <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
              </div>
              <div className="text-sm font-semibold tracking-widest uppercase text-white mb-2">{node.title}</div>
              <div className="text-xs text-[#94a3b8] font-light leading-relaxed px-4">{node.desc}</div>
            </div>
          ))}
        </div>

        {/* Mobile Vertical Pipeline */}
        <div className="md:hidden flex flex-col space-y-12 relative pl-4 border-l border-white/10 ml-4">
          {nodes.map((node, i) => (
            <div key={i} className="relative pl-6">
              <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-white/20 border-2 border-[#0a0a0f]" />
              <div className="text-sm font-semibold tracking-widest uppercase text-white mb-2">{node.title}</div>
              <div className="text-sm text-[#94a3b8] font-light">{node.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
