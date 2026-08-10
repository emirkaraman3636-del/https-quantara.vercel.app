"use client";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function RawDataTransition() {
  const [stage, setStage] = useState<'messy' | 'cleaning' | 'verified'>('messy');

  useEffect(() => {
    const timer1 = setTimeout(() => setStage('cleaning'), 3000);
    const timer2 = setTimeout(() => setStage('verified'), 5000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  const data = [
    { id: "CUST-01", rev: "$12,400", date: "2026-10-12", status: "Active", risk: false },
    { id: "CUST-02", rev: stage === 'messy' ? "NULL" : "$8,200", date: "2026-10-12", status: stage === 'messy' ? "N/A" : "Active", risk: stage === 'messy' },
    { id: "CUST-03", rev: "$4,100", date: stage === 'messy' ? "invalid" : "2026-10-13", status: "Inactive", risk: stage === 'messy' },
    { id: "CUST-04", rev: "$19,000", date: "2026-10-13", status: "Active", risk: false },
    { id: "CUST-05", rev: stage === 'messy' ? "NaN" : "$3,450", date: "2026-10-14", status: "Active", risk: stage === 'messy' },
  ];

  return (
    <section id="data-quality" className="py-32 bg-[#07080F] border-t border-[#272838]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6">
            Raw data is messy.<br/>
            <span className="text-[#94A3B8]">We make it trustworthy.</span>
          </h2>
          <p className="text-lg text-[#94A3B8] mb-8 leading-relaxed">
            Stop making decisions on broken spreadsheets. Quantara automatically validates, normalizes, and verifies your raw data before it ever reaches a chart.
          </p>
          <div className="flex gap-4">
            <div className="p-4 rounded border border-[#272838] bg-[#13141D] flex-1">
              <div className="text-[10px] text-[#64748B] font-mono mb-1 uppercase">Stage</div>
              <div className="text-[#00F0FF] font-medium text-sm flex items-center gap-2">
                {stage === 'messy' ? 'RAW INGESTION' : stage === 'cleaning' ? 'VALIDATING...' : 'DATA VERIFIED'}
                {stage === 'cleaning' && <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />}
                {stage === 'verified' && <span className="text-[#10B981]">✔</span>}
              </div>
            </div>
            <div className="p-4 rounded border border-[#272838] bg-[#13141D] flex-1">
              <div className="text-[10px] text-[#64748B] font-mono mb-1 uppercase">Error Rate</div>
              <div className={`font-mono text-lg ${stage === 'verified' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                {stage === 'messy' ? '12.4%' : stage === 'cleaning' ? 'Fixing...' : '0.00%'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0B0C15] border border-[#272838] rounded-xl overflow-hidden relative shadow-2xl">
          <div className="h-10 border-b border-[#272838] bg-[#13141D] flex items-center px-4 justify-between">
            <div className="text-xs text-[#94A3B8] font-mono">transactions.csv</div>
            <div className="text-[10px] text-[#64748B]">Viewer</div>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#272838]">
                  <th className="text-[10px] font-mono text-[#64748B] uppercase pb-2 font-normal">Customer</th>
                  <th className="text-[10px] font-mono text-[#64748B] uppercase pb-2 font-normal">Revenue</th>
                  <th className="text-[10px] font-mono text-[#64748B] uppercase pb-2 font-normal">Date</th>
                  <th className="text-[10px] font-mono text-[#64748B] uppercase pb-2 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="border-b border-[#272838]/50">
                    <td className="py-3 text-xs text-[#E2E8F0] font-mono">{row.id}</td>
                    <td className={`py-3 text-xs font-mono ${row.risk && row.rev.includes('N') ? 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 px-1 rounded' : 'text-[#94A3B8]'}`}>
                      {row.rev}
                    </td>
                    <td className={`py-3 text-xs font-mono ${row.risk && row.date === 'invalid' ? 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 px-1 rounded' : 'text-[#94A3B8]'}`}>
                      {row.date}
                    </td>
                    <td className={`py-3 text-xs font-mono ${row.risk && row.status === 'N/A' ? 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 px-1 rounded' : 'text-[#94A3B8]'}`}>
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Scanning Effect */}
          {stage === 'cleaning' && (
            <motion.div 
              initial={{ top: 0 }}
              animate={{ top: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-8 bg-gradient-to-b from-transparent to-[#00F0FF]/20 border-b border-[#00F0FF] pointer-events-none z-10"
            />
          )}
        </div>
      </div>
    </section>
  );
}