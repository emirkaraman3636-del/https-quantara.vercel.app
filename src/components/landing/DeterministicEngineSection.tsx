"use client";

export default function DeterministicEngineSection() {
  return (
    <section id="engine" className="py-32 bg-[#07080F] border-t border-[#272838]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1">
          <div className="bg-[#0B0C15] border border-[#272838] rounded-xl p-6 font-mono shadow-2xl relative">
            <div className="absolute top-0 right-0 p-3">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse block"></span>
            </div>
            <div className="text-[10px] text-[#64748B] mb-6">Deterministic Engine Terminal</div>
            <div className="space-y-4 text-xs text-[#94A3B8]">
              <div>
                <span className="text-[#64748B]">[SYSTEM]</span> DATASET LOADED<br/>
                <span className="text-white">48,291 RECORDS</span>
              </div>
              <div>
                <span className="text-[#64748B]">[VALIDATION]</span> FORMAT CHECK<br/>
                <span className="text-[#10B981]">PASSED</span>
              </div>
              <div>
                <span className="text-[#64748B]">[CALCULATION]</span> AGGREGATING REVENUE<br/>
                <span className="text-[#00F0FF]">RUNNING...</span>
              </div>
              <div className="pt-4 border-t border-[#272838]">
                <span className="text-[#64748B]">[OUTPUT]</span> METRICS GENERATED<br/>
                <span className="text-[#10B981] font-bold">VERIFIED</span>
              </div>
            </div>
            
            {/* KPI Output Mockup */}
            <div className="mt-6 bg-[#13141D] border border-[#272838] rounded p-4">
              <div className="text-[10px] text-[#64748B] uppercase mb-1">Revenue Growth</div>
              <div className="text-3xl text-white font-medium">+18.4%</div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-[9px] bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 px-1.5 py-0.5 rounded">SOURCE: Revenue dataset</span>
                <span className="text-[9px] bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20 px-1.5 py-0.5 rounded">METHOD: Deterministic</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="order-1 md:order-2">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6">
            Numbers are calculated.<br/>
            <span className="text-[#94A3B8]">Not imagined.</span>
          </h2>
          <p className="text-lg text-[#94A3B8] leading-relaxed">
            Unlike LLM-based tools that hallucinate metrics, our Deterministic BI Engine uses strict mathematical aggregations. The AI only explains the math—it never does the math.
          </p>
        </div>
      </div>
    </section>
  );
}