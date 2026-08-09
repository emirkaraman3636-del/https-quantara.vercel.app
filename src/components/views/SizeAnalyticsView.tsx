'use client';

import React from 'react';
import { Ruler, PieChart as PieIcon, PackageCheck, Award, AlertCircle } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { useData } from '../../context/DataContext';

const SIZE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'];

export function SizeAnalyticsView() {
  const { analytics } = useData();
  const { sizeMetrics, mostSoldSize, leastSoldSize, kpis } = analytics;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Size Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Most Sold Size
            </span>
            <div className="text-3xl font-bold text-slate-100 font-mono mt-1">
              Size {mostSoldSize ? mostSoldSize.size : 'N/A'}
            </div>
            <p className="text-xs text-emerald-400 mt-1 font-semibold">
              {mostSoldSize ? `${mostSoldSize.quantity} units (${mostSoldSize.percentage}% of total)` : ''}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Least Sold Size
            </span>
            <div className="text-3xl font-bold text-slate-100 font-mono mt-1">
              Size {leastSoldSize ? leastSoldSize.size : 'N/A'}
            </div>
            <p className="text-xs text-amber-400 mt-1 font-semibold">
              {leastSoldSize ? `${leastSoldSize.quantity} units (${leastSoldSize.percentage}% of total)` : ''}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Apparel Volume
            </span>
            <div className="text-3xl font-bold text-slate-100 font-mono mt-1">
              {kpis.totalQuantity.toLocaleString()}
            </div>
            <p className="text-xs text-indigo-400 mt-1 font-semibold">
              Across {sizeMetrics.length} size variants
            </p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Ruler className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visual Charts: Donut Share & Volume Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Size Distribution Donut Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center space-x-2 mb-4">
            <PieIcon className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-100">Size Share Percentage (Example: M: 45%, L: 30%)</h3>
          </div>

          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sizeMetrics}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="quantity"
                  nameKey="size"
                >
                  {sizeMetrics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SIZE_COLORS[index % SIZE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                  formatter={(val: unknown) => [`${val} units`, 'Quantity']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800">
            {sizeMetrics.map((sz, idx) => (
              <div key={sz.size} className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/40 text-center">
                <div className="flex items-center justify-center space-x-1.5 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SIZE_COLORS[idx % SIZE_COLORS.length] }} />
                  <span className="font-bold text-slate-200 text-xs font-mono">Size {sz.size}</span>
                </div>
                <div className="text-xs font-bold text-indigo-300 font-mono">{sz.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Size Revenue Bar Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center space-x-2 mb-4">
            <PackageCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-slate-100">Revenue Generated by Size</h3>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sizeMetrics} margin={{ left: 0, right: 10, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="size" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                  formatter={(val: unknown) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Size & Inventory Table */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
        <h3 className="text-base font-semibold text-slate-100 mb-4">Size Distribution & Stock Ratio</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-mono text-[11px]">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Size Variant</th>
                <th className="px-4 py-3">Total Units Sold</th>
                <th className="px-4 py-3">Volume Share %</th>
                <th className="px-4 py-3">Gross Revenue</th>
                <th className="px-4 py-3">Stock Available</th>
                <th className="px-4 py-3 rounded-r-lg">Demand Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sizeMetrics.map((sz) => {
                const stockRatio = sz.stockAvailable > 0 ? (sz.quantity / sz.stockAvailable).toFixed(2) : '1.00';
                return (
                  <tr key={sz.size} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-300 text-sm">
                      Size {sz.size}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-100">{sz.quantity} units</td>
                    <td className="px-4 py-3 font-mono">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {sz.percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                      ${sz.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">{sz.stockAvailable} items</td>
                    <td className="px-4 py-3 font-mono">
                      <span className="text-slate-400">{stockRatio}x turnover</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
