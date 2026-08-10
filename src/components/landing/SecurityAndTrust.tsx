"use client";
import React from 'react';

export function SecurityAndTrust() {
  return (
    <section id="security" className="py-24 bg-[#0a0a0f] border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 font-mono text-sm">
          
          <div className="space-y-4">
            <div className="h-px w-12 bg-white" />
            <h3 className="text-white uppercase tracking-widest font-bold">Data Isolation</h3>
            <p className="text-slate-400 leading-relaxed">
              Row-Level Security (RLS) ensures your datasets are cryptographically isolated. Datasets are never co-mingled in vector stores.
            </p>
          </div>

          <div className="space-y-4">
            <div className="h-px w-12 bg-white" />
            <h3 className="text-white uppercase tracking-widest font-bold">Deterministic Bias</h3>
            <p className="text-slate-400 leading-relaxed">
              AI has zero ability to execute mathematical operations. All metrics are calculated by the BI engine and injected as immutable context.
            </p>
          </div>

          <div className="space-y-4">
            <div className="h-px w-12 bg-white" />
            <h3 className="text-white uppercase tracking-widest font-bold">Zero Retention</h3>
            <p className="text-slate-400 leading-relaxed">
              LLM providers are contracted under zero-data-retention policies. Your private CSV structures are never used to train foundational models.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
