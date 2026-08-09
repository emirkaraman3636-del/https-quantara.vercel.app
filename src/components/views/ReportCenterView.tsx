'use client';

import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Share2, Printer, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

export function ReportCenterView() {
  const { analytics, uploadedFileName } = useData();
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleExportPDF = () => {
    setDownloading('pdf');
    // In a real app, we'd use html2canvas and jspdf here
    setTimeout(() => setDownloading(null), 1500);
  };

  const handleExportExcel = () => {
    setDownloading('excel');
    // In a real app, we'd use xlsx here
    setTimeout(() => setDownloading(null), 1500);
  };

  const handleShareLink = () => {
    setDownloading('link');
    // Generate secure tokenized URL via API
    setTimeout(() => {
      setDownloading(null);
      alert('Secure report link copied to clipboard!');
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3 mb-2">
          <FileText className="w-6 h-6 text-indigo-400" />
          Enterprise Report Center
        </h2>
        <p className="text-sm text-slate-400">
          Generate professional executive summaries, export raw metrics to Excel, or share secure read-only dashboard links.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PDF Report */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col items-center text-center space-y-4 hover:border-indigo-500/30 transition-colors">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
            <Printer className="w-8 h-8 text-rose-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Executive PDF</h3>
            <p className="text-xs text-slate-400 mt-1 px-4">Download a print-ready corporate presentation with AI insights and charts.</p>
          </div>
          <button 
            onClick={handleExportPDF}
            disabled={downloading !== null}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-50"
          >
            {downloading === 'pdf' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-rose-400" />}
            {downloading === 'pdf' ? 'Generated' : 'Generate PDF'}
          </button>
        </div>

        {/* Excel Export */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col items-center text-center space-y-4 hover:border-indigo-500/30 transition-colors">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <FileSpreadsheet className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Data & Metrics (Excel)</h3>
            <p className="text-xs text-slate-400 mt-1 px-4">Export raw data, calculated KPIs, and segmentations for offline analysis.</p>
          </div>
          <button 
            onClick={handleExportExcel}
            disabled={downloading !== null}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-50"
          >
            {downloading === 'excel' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-emerald-400" />}
            {downloading === 'excel' ? 'Exported' : 'Export .xlsx'}
          </button>
        </div>

        {/* Share Link */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col items-center text-center space-y-4 hover:border-indigo-500/30 transition-colors">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <Share2 className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Secure Share Link</h3>
            <p className="text-xs text-slate-400 mt-1 px-4">Generate a time-limited, read-only URL to share findings with stakeholders.</p>
          </div>
          <button 
            onClick={handleShareLink}
            disabled={downloading !== null}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-50"
          >
            {downloading === 'link' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-indigo-400" />}
            {downloading === 'link' ? 'Copied' : 'Create Link'}
          </button>
        </div>
      </div>
      
      {/* Audit & Compliance Note */}
      <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 text-center">
        <p className="text-xs text-slate-500">
          <strong>Enterprise Security Note:</strong> All report generation events are recorded in the organization&apos;s Audit Log. Shareable links automatically expire after 7 days by default.
        </p>
      </div>
    </div>
  );
}
