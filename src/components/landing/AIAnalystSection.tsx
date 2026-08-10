"use client";

export default function AIAnalystSection() {
  return (
    <section id="ai" className="py-32 bg-[#0B0C15] border-t border-[#272838]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6">
            Ask the data.<br/>
            <span className="text-[#7C3AED]">Understand the why.</span>
          </h2>
          <p className="text-lg text-[#94A3B8] leading-relaxed">
            Stop digging through dashboards to find reasons. Our AI Analyst reads the deterministically verified numbers and explains exactly why metrics changed in plain English.
          </p>
        </div>

        <div className="bg-[#13141D] border border-[#272838] rounded-xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-[#272838] bg-[#07080F]">
            <div className="text-xs text-[#94A3B8] font-bold">USER QUESTION</div>
            <div className="text-white text-lg mt-1 font-medium">"Why did revenue decline in Q3?"</div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded bg-[#7C3AED] flex items-center justify-center text-white text-[10px]">✦</span>
              <div className="text-[#7C3AED] text-xs font-bold uppercase tracking-wider">AI Analyst Briefing</div>
            </div>
            
            <p className="text-[#E2E8F0] text-sm leading-relaxed mb-6">
              Revenue declined primarily because <span className="font-semibold text-white">Enterprise account revenue decreased by 12.4%</span> compared to the previous quarter. Although SMB revenue grew slightly, it was not enough to offset the enterprise churn.
            </p>

            <div className="bg-[#0B0C15] border border-[#272838] rounded-lg p-4">
              <div className="text-[10px] text-[#64748B] font-bold uppercase mb-3">Evidence (Verified Metrics)</div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-[#272838]">
                  <span className="text-xs text-[#94A3B8]">Enterprise Revenue</span>
                  <span className="text-xs font-mono text-[#EF4444]">-12.4%</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#272838]">
                  <span className="text-xs text-[#94A3B8]">SMB Revenue</span>
                  <span className="text-xs font-mono text-[#10B981]">+7.1%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#94A3B8]">Overall Churn</span>
                  <span className="text-xs font-mono text-[#EF4444]">+3.2%</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-[9px] text-[#64748B] uppercase">Source: Q3 Verified Dataset</div>
              <div className="text-[9px] text-[#7C3AED] uppercase border border-[#7C3AED]/20 bg-[#7C3AED]/10 px-2 py-0.5 rounded">Confidence: High (98%)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}