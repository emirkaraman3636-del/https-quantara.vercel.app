'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, DollarSign, ShoppingBag, ShieldCheck, Sparkles, LayoutDashboard, FileSpreadsheet } from 'lucide-react';

export function DashboardPreview() {
  return (
    <section id="product" className="relative pb-28 px-4 sm:px-6 z-20 bg-[#030308]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-6xl mx-auto rounded-3xl bg-slate-900/40 backdrop-blur-2xl border border-slate-700/40 p-2 sm:p-4 shadow-[0_0_80px_-15px_rgba(99,102,241,0.15)] relative"
      >
        {/* Glowing top line accent */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

        {/* Outer App Frame */}
        <div className="bg-[#080811] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          
          {/* App Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-700/60" />
                <div className="w-3 h-3 rounded-full bg-slate-700/60" />
                <div className="w-3 h-3 rounded-full bg-slate-700/60" />
              </div>
              <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs font-medium text-slate-400">
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                <span>Enterprise Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono">q3_sales_data.csv</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Quality Score: 96%</span>
              </div>
            </div>
          </div>

          {/* Main Dashboard Workspace Mock */}
          <div className="p-6 md:p-8 space-y-6">
            
            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-slate-900/60 border border-slate-800/90 rounded-xl p-5 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Revenue</span>
                  <DollarSign className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">₺245,800</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" /> +18.4% growth
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/90 rounded-xl p-5 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Gross Profit</span>
                  <Activity className="w-4 h-4 text-violet-400" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">₺82,400</div>
                <div className="text-xs text-slate-400">Margin: <strong className="text-slate-200">33.5%</strong></div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/90 rounded-xl p-5 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">Transactions</span>
                  <ShoppingBag className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">1,420</div>
                <div className="text-xs text-slate-400">AOV: <strong className="text-slate-200">₺173</strong></div>
              </div>

              <div className="bg-slate-900/60 border border-indigo-500/30 rounded-xl p-5 relative overflow-hidden bg-gradient-to-br from-indigo-950/30 to-slate-900">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI Grounded Insight</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  "Profitability increased primarily because revenue growth outpaced operating costs during the latest period."
                </p>
              </div>

            </div>

            {/* Visual Charts & Breakdown Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Time Series Chart Mock */}
              <div className="col-span-1 lg:col-span-2 bg-slate-900/60 border border-slate-800/90 rounded-xl p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Revenue & Cost Performance</h3>
                    <p className="text-xs text-slate-500">Deterministic metric derivation over time</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500" /><span className="text-slate-400">Revenue</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-violet-400" /><span className="text-slate-400">COGS</span></div>
                  </div>
                </div>

                {/* Bars Visual */}
                <div className="h-56 flex items-end justify-between gap-3 pt-4 border-b border-slate-800/80">
                  {[
                    { rev: 60, cost: 35, month: 'May' },
                    { rev: 75, cost: 40, month: 'Jun' },
                    { rev: 65, cost: 38, month: 'Jul' },
                    { rev: 90, cost: 50, month: 'Aug' },
                    { rev: 85, cost: 45, month: 'Sep' },
                    { rev: 110, cost: 55, month: 'Oct' }
                  ].map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="w-full flex items-end justify-center gap-1.5 h-full">
                        <div className="w-1/2 bg-indigo-500/30 group-hover:bg-indigo-500/60 rounded-t transition-all" style={{ height: `${d.rev}%` }} />
                        <div className="w-1/2 bg-violet-500/20 group-hover:bg-violet-500/40 rounded-t transition-all" style={{ height: `${d.cost}%` }} />
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">{d.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="col-span-1 bg-slate-900/60 border border-slate-800/90 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">Dimension Revenue Share</h3>
                  <p className="text-xs text-slate-500 mb-6">Top performing product categories</p>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'Enterprise Subscriptions', pct: 48, color: 'bg-indigo-500' },
                      { name: 'Professional Services', pct: 32, color: 'bg-violet-500' },
                      { name: 'Add-on Modules', pct: 20, color: 'bg-blue-400' }
                    ].map((cat, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 font-medium">{cat.name}</span>
                          <span className="text-slate-400 font-mono">{cat.pct}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                          <div className={`h-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between">
                  <span>Isolated Data Scope</span>
                  <span className="text-indigo-400 font-semibold">Zero Hallucinations</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
