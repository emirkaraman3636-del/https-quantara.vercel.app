"use client";

export default function ProductShowcase() {
  return (
    <section className="py-24 md:py-40 bg-[#030308] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <h2 className="text-[40px] md:text-[56px] font-medium tracking-[-0.02em] md:tracking-[-0.03em] leading-[1.1] text-white">
          Your business, at a glance.
        </h2>
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        <div className="w-full h-[600px] bg-[#0a0a0f] border border-white/10 shadow-2xl flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-16 md:w-64 border-r border-white/5 bg-[#030308] flex flex-col p-4 md:p-6">
             <div className="w-8 h-8 bg-white/10 mb-12 hidden md:block" />
             <div className="w-full h-4 bg-white/5 mb-4 hidden md:block" />
             <div className="w-3/4 h-4 bg-white/5 mb-4 hidden md:block" />
             <div className="w-5/6 h-4 bg-white/5 mb-4 hidden md:block" />
          </div>

          {/* Main Area */}
          <div className="flex-1 p-6 md:p-10 flex flex-col">
            {/* Toolbar */}
            <div className="h-12 border-b border-white/5 mb-8 flex items-center justify-between">
               <div className="w-48 h-6 bg-white/5" />
               <div className="w-24 h-6 bg-white/10 hidden sm:block" />
            </div>

            {/* Content Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 border border-white/5 bg-white/[0.01] p-6 flex flex-col">
                 <div className="text-xs font-semibold text-[#475569] tracking-widest uppercase mb-6">Transactions Data Table</div>
                 
                 {/* CSS Table Simulation */}
                 <div className="flex-1 space-y-3">
                   {[1,2,3,4,5,6].map(i => (
                     <div key={i} className="flex justify-between items-center pb-3 border-b border-white/5 text-xs">
                       <div className="text-white">ID-409{i}2</div>
                       <div className="text-[#94a3b8] hidden sm:block">Oct {i+10}, 2026</div>
                       <div className="text-white">{"$"}{(i * 1234.56).toFixed(2)}</div>
                       <div className="text-[#10b981]">Success</div>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Side Panel */}
              <div className="border border-white/5 bg-[#030308] p-6">
                <div className="text-xs font-semibold text-[#475569] tracking-widest uppercase mb-6">Filter Properties</div>
                <div className="space-y-6">
                  <div>
                    <div className="text-xs text-white mb-2">Status</div>
                    <div className="h-8 border border-white/10 w-full" />
                  </div>
                  <div>
                    <div className="text-xs text-white mb-2">Date Range</div>
                    <div className="h-8 border border-white/10 w-full" />
                  </div>
                  <div>
                    <div className="text-xs text-white mb-2">Confidence Score</div>
                    <div className="h-8 border border-white/10 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
