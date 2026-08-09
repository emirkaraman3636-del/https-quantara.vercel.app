'use client';

import React from 'react';
import { Users, Package, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { useData } from '../../context/DataContext';

export function SegmentationView() {
  const { analytics } = useData();
  const { segmentation } = analytics;
  const { customers, products } = segmentation;

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Users className="w-6 h-6 text-indigo-400" />
            AI-Driven Segmentation
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Dynamic behavioral clustering of your customers and products based on purchase patterns.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-400" /> Customer Cohorts
        </h3>
        
        {customers.length === 0 ? (
          <p className="text-sm text-slate-500">Not enough data to segment customers.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {customers.map(cohort => (
              <div key={cohort.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-100">{cohort.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">{cohort.description}</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                    {cohort.percentage}% of Rev
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Total Revenue</span>
                    <span className="text-lg font-bold text-slate-200">${cohort.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Cohort Size</span>
                    <span className="text-lg font-bold text-slate-200">{cohort.count.toLocaleString()} Accounts</span>
                  </div>
                </div>

                <div className="mt-2 pt-4 border-t border-slate-800/50">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block mb-2">Behavioral Traits</span>
                  <div className="flex flex-wrap gap-2">
                    {cohort.traits.map((trait, idx) => (
                      <span key={idx} className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6 pt-4">
        <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
          <Package className="w-5 h-5 text-amber-400" /> Product Performance Clusters
        </h3>
        
        {products.length === 0 ? (
          <p className="text-sm text-slate-500">Not enough data to segment products.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {products.map(cohort => (
              <div key={cohort.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-100">{cohort.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">{cohort.description}</p>
                  </div>
                  <span className="text-sm font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                    {cohort.percentage}% of Rev
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Cluster Revenue</span>
                    <span className="text-lg font-bold text-slate-200">${cohort.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">SKU Count</span>
                    <span className="text-lg font-bold text-slate-200">{cohort.count.toLocaleString()} Products</span>
                  </div>
                </div>

                <div className="mt-2 pt-4 border-t border-slate-800/50">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block mb-2">Performance Traits</span>
                  <div className="flex flex-wrap gap-2">
                    {cohort.traits.map((trait, idx) => (
                      <span key={idx} className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
