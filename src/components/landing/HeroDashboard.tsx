"use client";

export default function HeroDashboard() {
  return (
    <div 
      className="relative w-full h-[700px] bg-[#0a0a0f] border border-white/10 flex overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
    >
      {/* Sidebar */}
      <div className="hidden md:flex w-64 border-r border-white/5 flex-col p-6 space-y-8">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-indigo-500" />
          <span className="text-white font-medium tracking-tight">Acme Corp</span>
        </div>
        <nav className="flex flex-col space-y-4">
          <div className="text-sm font-medium text-white">Overview</div>
          <div className="text-sm font-medium text-[#475569] hover:text-[#94a3b8] cursor-default transition-colors">Analytics</div>
          <div className="text-sm font-medium text-[#475569] hover:text-[#94a3b8] cursor-default transition-colors">Data Quality</div>
          <div className="text-sm font-medium text-[#475569] hover:text-[#94a3b8] cursor-default transition-colors">AI Analyst</div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#10b981] mb-2 flex items-center">
              <div className="w-2 h-2 rounded-full bg-[#10b981] mr-2 animate-pulse" />
              Dataset: Verified
            </div>
            <h2 className="text-3xl font-medium tracking-tight text-white">Q3 Financial Performance</h2>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="p-6 border border-white/5 bg-white/[0.02] hover:border-white/20 transition-colors">
            <div className="text-[#94a3b8] text-xs font-medium mb-3">REVENUE</div>
            <div className="text-3xl font-medium tracking-tight text-white">$2,405,110</div>
            <div className="text-[#10b981] text-xs font-medium mt-2">↑ 12.4% vs last quarter</div>
          </div>
          <div className="p-6 border border-white/5 bg-white/[0.02] hover:border-white/20 transition-colors">
            <div className="text-[#94a3b8] text-xs font-medium mb-3">GROWTH (TX)</div>
            <div className="text-3xl font-medium tracking-tight text-white">18,492</div>
            <div className="text-[#10b981] text-xs font-medium mt-2">↑ 4.1% vs last quarter</div>
          </div>
          <div className="p-6 border border-white/5 bg-white/[0.02] hover:border-white/20 transition-colors">
            <div className="text-[#94a3b8] text-xs font-medium mb-3">DATA QUALITY</div>
            <div className="text-3xl font-medium tracking-tight text-[#10b981]">99.2%</div>
            <div className="text-[#94a3b8] text-xs font-medium mt-2">Verified automatically</div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="flex-1 relative border border-white/5 bg-white/[0.01] p-6 hidden sm:block">
          {/* Grid lines */}
          <div className="absolute inset-x-6 top-6 bottom-6 flex flex-col justify-between border-l border-b border-white/5 pb-6">
            <div className="w-full h-px bg-white/5" />
            <div className="w-full h-px bg-white/5" />
            <div className="w-full h-px bg-white/5" />
            <div className="w-full h-px bg-white/5" />
          </div>
          {/* Synthetic SVG Line Chart */}
          <svg className="absolute inset-x-6 top-6 bottom-12 w-[calc(100%-48px)] h-[calc(100%-72px)] preserveAspectRatio='none'" viewBox="0 0 1000 300">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(99, 102, 241, 0.2)" />
                <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
              </linearGradient>
            </defs>
            <path d="M0,250 L100,230 L200,260 L300,180 L400,200 L500,120 L600,150 L700,80 L800,110 L900,40 L1000,60 L1000,300 L0,300 Z" fill="url(#lineGrad)" />
            <path d="M0,250 L100,230 L200,260 L300,180 L400,200 L500,120 L600,150 L700,80 L800,110 L900,40 L1000,60" fill="none" stroke="#6366f1" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        {/* Floating AI Panel */}
        <div className="absolute bottom-10 right-10 w-[320px] bg-[#12121a]/95 backdrop-blur-md border border-white/10 p-5 shadow-2xl z-20 hidden md:block">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-4 bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-semibold tracking-wider text-indigo-400 uppercase">AI Analyst Insight</span>
          </div>
          <p className="text-sm text-white leading-relaxed font-medium">
            Revenue surged 12.4% primarily due to Enterprise tier expansion. Small business revenue remained flat, while churn dropped by 2.1%.
          </p>
        </div>
      </div>
    </div>
  );
}
