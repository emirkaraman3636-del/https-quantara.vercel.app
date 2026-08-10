'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Cpu, Utensils, Briefcase, RefreshCw, Building2, Megaphone } from 'lucide-react';

export function UniversalIntelligence() {
  const categories = [
    { name: 'Retail', desc: 'SKU sales, COGS, inventory turnover', icon: <ShoppingBag className="w-5 h-5 text-indigo-400" /> },
    { name: 'Technology', desc: 'Software licenses, ARR, user usage', icon: <Cpu className="w-5 h-5 text-violet-400" /> },
    { name: 'Restaurants', desc: 'Menu mix, daily orders, food costs', icon: <Utensils className="w-5 h-5 text-blue-400" /> },
    { name: 'Services', desc: 'Billable hours, client retainers', icon: <Briefcase className="w-5 h-5 text-emerald-400" /> },
    { name: 'Subscriptions', desc: 'MRR, churn rate, plan distribution', icon: <RefreshCw className="w-5 h-5 text-indigo-300" /> },
    { name: 'B2B Enterprise', desc: 'Deal pipelines, account revenue', icon: <Building2 className="w-5 h-5 text-purple-400" /> },
    { name: 'Marketing', desc: 'Ad spend, CAC, ROAS, conversions', icon: <Megaphone className="w-5 h-5 text-cyan-400" /> }
  ];

  return (
    <section className="py-32 px-6 bg-[#05050C] border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Industry Agnostic Engine</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            One Intelligence Layer. Any Business.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
            Zentrivo adapts dynamically to the structure of your uploaded dataset instead of forcing your business into rigid predefined templates.
          </p>
        </div>

        {/* Dynamic Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="text-white font-bold mb-1 text-base">{cat.name}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{cat.desc}</p>
            </motion.div>
          ))}
          
          {/* Universal Fallback Tile */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: categories.length * 0.08 }}
            className="bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/40 border border-indigo-500/30 p-6 rounded-2xl flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Custom Datasets</div>
              <h3 className="text-white font-bold mb-1 text-base">Generic Business Data</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Works with any tabular dataset with numbers, dates, and dimensions.
              </p>
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold mt-4">
              ✓ Instant Schema Mapping
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
