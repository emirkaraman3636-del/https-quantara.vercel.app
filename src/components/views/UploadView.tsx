'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Database,
  ArrowRight,
  RefreshCw,
  FileCode,
  FileCheck
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { downloadSampleCSVFile } from '../../lib/sample-data';

export function UploadView() {
  const { uploadFile, validation, records, uploadedFileName, datasetId, setActiveTab, isLoading, resetToSampleData } = useData();
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await processSelectedFile(file);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await processSelectedFile(file);
    }
  };

  const processSelectedFile = async (file: File) => {
    setFeedback(null);
    const res = await uploadFile(file);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/30 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
            DYNAMIC BACKEND INGESTION ENGINE
          </span>
          <h3 className="text-xl font-bold text-slate-100 mt-2">
            Upload & Analyze Any File (Excel, CSV, TXT, JSON, DOCX, PDF)
          </h3>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Every file upload immediately purges all previous state, sends the file to the backend API (`/api/parse-file`), extracts data dynamically, generates a unique Dataset ID, and computes fresh analytics from scratch.
          </p>
        </div>

        <button
          onClick={downloadSampleCSVFile}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all shadow-md"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Download Test CSV</span>
        </button>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
          dragActive
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
            : 'border-slate-700 hover:border-indigo-500/60 bg-slate-900/40 hover:bg-slate-900/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls,.tsv,.txt,.json,.docx,.pdf"
          onChange={handleChange}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/10">
          <UploadCloud className="w-8 h-8 animate-bounce" />
        </div>

        <h4 className="text-base font-semibold text-slate-200">
          {isLoading ? 'Sending to Backend API & Clearing Old Cache...' : 'Drag & Drop your file here to re-analyze from scratch'}
        </h4>
        <p className="text-xs text-slate-400 mt-1 max-w-md">
          Supported file formats: <span className="text-slate-300 font-medium">.xlsx, .xls, .csv, .tsv, .txt, .json, .docx, .pdf</span>
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs font-medium">
          <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Excel (.xlsx)
          </span>
          <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-cyan-400" /> CSV / TSV
          </span>
          <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-amber-400" /> TXT / JSON
          </span>
          <span className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-indigo-400" /> DOCX / PDF
          </span>
        </div>
      </div>

      {/* Upload Feedback Toast / Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-start justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center space-x-3">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{feedback.message}</span>
          </div>

          {feedback.type === 'success' && (
            <button
              onClick={() => setActiveTab('smart-dashboard')}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
            >
              <span>View Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Schema Detection & Dataset ID Card */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <h4 className="text-base font-semibold text-slate-200">
              Active Dataset Session Info
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Dataset ID: {datasetId}
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Total Records: {records.length}
            </span>
          </div>
        </div>

        {/* Detected Column Pills */}
        {validation && validation.columnMapping && (
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Detected Column Schema Mappings
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(validation.columnMapping).map(([canonical, original]) => (
                <div
                  key={canonical}
                  className={`p-2.5 rounded-lg border text-xs ${
                    original
                      ? 'bg-slate-800/80 border-indigo-500/30 text-slate-200'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">
                    {canonical}
                  </span>
                  <span className="font-semibold text-slate-100 truncate block mt-0.5">
                    {original ? `Mapped: "${original}"` : 'Auto-derived'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dataset Preview Table */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-semibold text-slate-200">
              Extracted Records Preview ({records.length})
            </h4>
            <p className="text-xs text-slate-400">
              Active Source: {uploadedFileName ? `File (${uploadedFileName})` : 'Enterprise Demo Dataset'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {uploadedFileName && (
              <button
                onClick={resetToSampleData}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset to Demo Data
              </button>
            )}
          </div>
        </div>

        {records.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-mono bg-slate-900/40 rounded-xl border border-slate-800">
            No records in active dataset. Upload an Excel, CSV, TXT, JSON, DOCX, or PDF file to compute analytics.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 uppercase font-mono text-[11px]">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">ID</th>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Revenue</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3 rounded-r-lg">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {records.slice(0, 10).map((r, i) => (
                  <tr key={r.id || i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-400">{r.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-100">{r.productName}</td>
                    <td className="px-4 py-3">{r.category}</td>
                    <td className="px-4 py-3 text-slate-400">{r.customerName}</td>
                    <td className="px-4 py-3 font-mono">{r.date}</td>
                    <td className="px-4 py-3 font-semibold">{r.quantity}</td>
                    <td className="px-4 py-3">${r.price.toFixed(2)}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-400">
                      ${r.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-indigo-300">{r.size}</td>
                    <td className="px-4 py-3">{r.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {records.length > 10 && (
              <p className="text-center text-xs text-slate-400 mt-4 font-mono">
                Showing first 10 of {records.length} records. All rows are included in live analytics.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
