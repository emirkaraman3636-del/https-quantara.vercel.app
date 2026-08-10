"use client";

export default function DataQualitySection() {
  return (
    <section className="py-32 bg-[#0B0C15] border-t border-[#272838]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-16">
          Every number is <span className="text-[#10B981]">Verified.</span>
        </h2>
        
        <div className="bg-[#13141D] border border-[#272838] rounded-xl max-w-4xl mx-auto p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="text-[#10B981] text-xs font-mono border border-[#10B981]/20 bg-[#10B981]/10 px-2 py-1 rounded">SYSTEM HEALTH: OPTIMAL</span>
          </div>
          
          <div className="mb-12">
            <div className="text-[110px] md:text-[140px] font-light leading-none tracking-tighter text-[#10B981] mb-2">
              98.7<span className="text-5xl text-[#10B981]/50">%</span>
            </div>
            <div className="text-[#94A3B8] text-sm font-mono uppercase tracking-widest">Global Data Quality Score</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-[#272838] pt-8">
            {[
              { label: "Accuracy", value: "99.2%" },
              { label: "Completeness", value: "97.8%" },
              { label: "Consistency", value: "98.9%" },
              { label: "Validity", value: "99.4%" },
            ].map(metric => (
              <div key={metric.label} className="text-center">
                <div className="text-2xl text-white font-mono mb-1">{metric.value}</div>
                <div className="text-[10px] text-[#64748B] font-bold uppercase">{metric.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-[#272838] flex flex-col md:flex-row justify-center gap-8 text-xs text-[#94A3B8] font-mono">
            <div><span className="text-[#64748B]">RECORDS CHECKED:</span> <span className="text-white">1,492,034</span></div>
            <div><span className="text-[#64748B]">ISSUES RESOLVED:</span> <span className="text-[#10B981]">12,403</span></div>
            <div><span className="text-[#64748B]">LAST VALIDATION:</span> <span className="text-white">Just now</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}