"use client";
import React from 'react';

export function SecuritySection() {
  return (
    <section id="security" className="py-24 px-4 text-center bg-[#05050A] border-y border-white/5">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-4">Enterprise-Grade Security</h2>
        <p className="text-slate-400 font-light mb-8">Your data is processed securely, analyzed deterministically, and never used to train public models.</p>
        
        <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-500">
          <div className="flex items-center"><svg className="w-4 h-4 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> End-to-end Encryption</div>
          <div className="flex items-center"><svg className="w-4 h-4 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> No Model Training</div>
          <div className="flex items-center"><svg className="w-4 h-4 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> Isolated Databases</div>
        </div>
      </div>
    </section>
  );
}
