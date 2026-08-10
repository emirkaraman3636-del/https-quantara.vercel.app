"use client";

export default function PipelineSection() {
  const nodes = [
    { label: "RAW DATA", color: "#64748B" },
    { label: "DATA QUALITY", color: "#10B981" },
    { label: "BI ENGINE", color: "#00F0FF" },
    { label: "AI ANALYST", color: "#7C3AED" },
    { label: "DECISION", color: "#FFFFFF" }
  ];

  return (
    <section className="py-24 bg-[#07080F] border-t border-[#272838] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Desktop Pipeline */}
        <div className="hidden md:flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#272838] -translate-y-1/2 z-0"></div>
          
          {nodes.map((node, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center bg-[#07080F] px-4">
              <div 
                className="w-3 h-3 rounded-full mb-2 border-2 border-[#07080F]"
                style={{ backgroundColor: node.color, boxShadow: `0 0 10px ${node.color}40` }}
              ></div>
              <div className="text-[10px] font-bold text-[#94A3B8] tracking-widest uppercase">{node.label}</div>
            </div>
          ))}
        </div>

        {/* Mobile Pipeline */}
        <div className="md:hidden flex flex-col gap-8 relative pl-6">
          <div className="absolute top-0 bottom-0 left-[29px] w-[1px] bg-[#272838] z-0"></div>
          
          {nodes.map((node, i) => (
            <div key={i} className="relative z-10 flex items-center gap-6 bg-[#07080F] py-2">
              <div 
                className="w-3 h-3 rounded-full border-2 border-[#07080F] shrink-0"
                style={{ backgroundColor: node.color, boxShadow: `0 0 10px ${node.color}40` }}
              ></div>
              <div>
                <div className="text-sm font-bold text-white tracking-wider">{node.label}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}