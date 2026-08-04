'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Award,
  AlertCircle,
  ArrowRight,
  PieChart as PieIcon,
  BarChart3,
  FileSpreadsheet,
  FileText,
  Download,
  ShieldCheck,
  Activity,
  Boxes
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useData } from '../../context/DataContext';
import { KPICard } from '../dashboard/KPICard';
import { AIInsightsWidget } from '../ai/AIInsightsWidget';
import { exportExcelReport, exportPDFReport, exportCSVSummary } from '../../lib/report-exporter';

const CATEGORY_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

export function OverviewView() {
  const { records, analytics, aiSummary, forecastSummary, inventorySummary, setActiveTab, uploadedFileName } = useData();
  const { kpis, dailyTrends, categoryMetrics, topProducts, sizeMetrics } = analytics;
  const [showExportModal, setShowExportModal] = useState(false);

  const handleExport = (type: 'pdf' | 'excel' | 'csv') => {
    const reportData = {
      datasetName: uploadedFileName || 'Enterprise Sales Dataset',
      records,
      analytics,
      aiSummary,
      forecastSummary,
      inventorySummary
    };

    if (type === 'pdf') {
      exportPDFReport(reportData);
    } else if (type === 'excel') {
      exportExcelReport(reportData);
    } else if (type === 'csv') {
      exportCSVSummary(reportData);
    }
    setShowExportModal(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Bar: Enterprise Score Cards & Export Trigger */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 flex-1">
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Inventory Health</span>
            <span className="text-lg font-bold font-mono text-emerald-400">{inventorySummary.scores.inventoryHealthScore}/100</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Business Health</span>
            <span className="text-lg font-bold font-mono text-indigo-400">{aiSummary.healthScore}/100</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Risk Score</span>
            <span className="text-lg font-bold font-mono text-amber-400">{inventorySummary.scores.riskScore}/100</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Forecast Confidence</span>
            <span className="text-lg font-bold font-mono text-emerald-400">{forecastSummary.sufficiency.confidenceScore}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Stock Coverage</span>
            <span className="text-lg font-bold font-mono text-slate-100">{inventorySummary.scores.stockCoverageDays} Days</span>
          </div>
        </div>

        {/* Export Executive Report Trigger */}
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Executive Report</span>
        </button>
      </div>

      {/* AI Business Analyst Assistant Widget */}
      <AIInsightsWidget />

      {/* 6 Core KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <KPICard
          title="Total Revenue"
          value={`$${kpis.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="Cumulative gross sales volume"
          icon={<DollarSign className="w-5 h-5" />}
          trend={kpis.revenueGrowth}
          trendLabel="vs benchmark"
          badge={{ text: 'Revenue', type: 'emerald' }}
          highlight={true}
        />

        <KPICard
          title="Total Sales Quantity"
          value={`${kpis.totalQuantity.toLocaleString()} units`}
          subtitle="Total items sold across dataset"
          icon={<ShoppingBag className="w-5 h-5" />}
          trend={kpis.ordersGrowth}
          trendLabel="unit velocity"
          badge={{ text: 'Units', type: 'indigo' }}
        />

        <KPICard
          title="Total Orders"
          value={`${kpis.totalOrders.toLocaleString()} orders`}
          subtitle="Total transactions processed"
          icon={<ShoppingCart className="w-5 h-5" />}
          badge={{ text: 'Orders', type: 'indigo' }}
        />

        <KPICard
          title="Average Order Value"
          value={`$${kpis.averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="Revenue per transaction (AOV)"
          icon={<TrendingUp className="w-5 h-5" />}
          badge={{ text: 'AOV', type: 'amber' }}
        />

        <KPICard
          title="Best Selling Product"
          value={kpis.bestSellingProduct.name}
          subtitle={`Revenue: $${kpis.bestSellingProduct.revenue.toLocaleString()} (${kpis.bestSellingProduct.quantity} units)`}
          icon={<Award className="w-5 h-5 text-emerald-400" />}
          badge={{ text: '#1 Rank', type: 'emerald' }}
        />

        <KPICard
          title="Lowest Selling Product"
          value={kpis.lowestSellingProduct.name}
          subtitle={`Revenue: $${kpis.lowestSellingProduct.revenue.toLocaleString()} (${kpis.lowestSellingProduct.quantity} units)`}
          icon={<AlertCircle className="w-5 h-5 text-rose-400" />}
          badge={{ text: 'Bottom Rank', type: 'rose' }}
        />
      </div>

      {/* Main Revenue Trend & Category Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Velocity Chart (2 Columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                Revenue & Order Velocity Trend
              </h3>
              <p className="text-xs text-slate-400">Daily sales trajectory over dataset timeline</p>
            </div>

            <button
              onClick={() => setActiveTab('trends')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <span>Detailed Trends</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="formattedDate" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut Chart (1 Column) */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-400" />
                Revenue by Category
              </h3>
              <p className="text-xs text-slate-400">Share of revenue per product group</p>
            </div>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryMetrics}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="revenue"
                  nameKey="category"
                >
                  {categoryMetrics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-2 pt-3 border-t border-slate-800">
            {categoryMetrics.slice(0, 4).map((cat, idx) => (
              <div key={cat.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                  />
                  <span className="text-slate-300 font-medium">{cat.category}</span>
                </div>
                <span className="font-mono text-slate-400 font-semibold">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Executive Report Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Download className="w-5 h-5 text-indigo-400" />
                Export Executive Business Report
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select your preferred export format for dataset <strong>"{uploadedFileName || 'Enterprise Sales Dataset'}"</strong>:
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleExport('pdf')}
                className="w-full p-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-all flex items-center space-x-3 group"
              >
                <FileText className="w-6 h-6 text-rose-400 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-100 block group-hover:text-indigo-300">
                    PDF Presentation Executive Briefing
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Printable PDF with Executive Briefing, KPIs, Products & Inventory Risks.
                  </span>
                </div>
              </button>

              <button
                onClick={() => handleExport('excel')}
                className="w-full p-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-all flex items-center space-x-3 group"
              >
                <FileSpreadsheet className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-100 block group-hover:text-indigo-300">
                    Multi-Sheet Excel Workbook (.xlsx)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Includes Executive Overview, ROP Matrix, Products, and Sizing sheets.
                  </span>
                </div>
              </button>

              <button
                onClick={() => handleExport('csv')}
                className="w-full p-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-all flex items-center space-x-3 group"
              >
                <FileText className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-100 block group-hover:text-indigo-300">
                    Raw CSV Analytical Export
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Structured CSV file containing raw metric breakdowns.
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
