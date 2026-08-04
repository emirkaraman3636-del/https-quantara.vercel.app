'use client';

import React, { useState } from 'react';
import { TrendingUp, Calendar, BarChart2, DollarSign } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useData } from '../../context/DataContext';

export function SalesTrendsView() {
  const { analytics } = useData();
  const { dailyTrends, monthlyTrends, kpis } = analytics;
  const [timeframe, setTimeframe] = useState<'daily' | 'monthly'>('daily');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Controls & Timeframe Selector */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Revenue Velocity & Temporal Patterns
          </h3>
          <p className="text-xs text-slate-400">
            Tracking sales volume over time across daily and monthly intervals
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setTimeframe('daily')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeframe === 'daily'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daily Velocity ({dailyTrends.length} days)
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeframe === 'monthly'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monthly Aggregate
          </button>
        </div>
      </div>

      {/* Main Interactive Chart (Daily or Monthly) */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
              {timeframe === 'daily' ? 'Daily Revenue & Units Trajectory' : 'Monthly Revenue Performance'}
            </h4>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {timeframe === 'daily' ? (
              <AreaChart data={dailyTrends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDailyRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorDailyQty" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="formattedDate" stroke="#94a3b8" fontSize={11} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v}`} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                  formatter={(val: any, name: any) => [
                    name === 'revenue' ? `$${Number(val).toLocaleString()}` : `${val} units`,
                    name === 'revenue' ? 'Revenue' : 'Units Sold'
                  ]}
                />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorDailyRev)"
                  name="revenue"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="quantity"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDailyQty)"
                  name="quantity"
                />
              </AreaChart>
            ) : (
              <BarChart data={monthlyTrends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="formattedMonth" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} name="Monthly Revenue" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Data Breakdown Table */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
        <h4 className="text-base font-semibold text-slate-100 mb-4">
          Time-Series Breakdown Table
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-mono text-[11px]">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Period Date</th>
                <th className="px-4 py-3">Gross Revenue</th>
                <th className="px-4 py-3">Total Units Sold</th>
                <th className="px-4 py-3">Order Count</th>
                <th className="px-4 py-3 rounded-r-lg">Period AOV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {dailyTrends.slice(0, 15).map((row) => {
                const aov = row.orders > 0 ? row.revenue / row.orders : 0;
                return (
                  <tr key={row.date} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-slate-200">
                      {row.formattedDate} ({row.date})
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                      ${row.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-100">
                      {row.quantity} units
                    </td>
                    <td className="px-4 py-3 font-mono">{row.orders} orders</td>
                    <td className="px-4 py-3 font-mono text-indigo-300">${aov.toFixed(2)}</td>
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
