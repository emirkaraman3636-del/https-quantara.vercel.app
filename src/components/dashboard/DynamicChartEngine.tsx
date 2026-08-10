import React from 'react';
import { DatasetSchema, BusinessIntelligenceContext } from '../../lib/dynamic-types';
import { BarChart2 } from 'lucide-react';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#2dd4bf'];

interface DynamicChartEngineProps {
  schema: DatasetSchema;
  biContext: BusinessIntelligenceContext;
  rawRows: Record<string, unknown>[];
}

export function DynamicChartEngine({ schema, biContext, rawRows }: DynamicChartEngineProps) {
  const { breakdowns, timeSeries } = biContext;

  const hasTimeSeries = timeSeries && timeSeries.length > 0;
  const breakdownKeys = Object.keys(breakdowns);
  const hasBreakdowns = breakdownKeys.length > 0;

  if (!hasTimeSeries && !hasBreakdowns) {
    return (
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-8 text-center text-slate-400">
        <BarChart2 className="w-8 h-8 mx-auto mb-3 text-slate-500 opacity-50" />
        <p>Görselleştirme için yeterli zaman veya kategori boyutu bulunamadı.</p>
      </div>
    );
  }

  // Format time series data for Recharts
  const formatTimeSeries = (data: any[]) => {
    return data.map(d => ({
      ...d,
      revenue: d.revenue,
      quantity: d.quantity,
      profit: d.profit,
      date: d.period // Ensure XAxis has 'date' if we keep dataKey="date"
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {hasTimeSeries && (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-6 shadow-md">
          <h3 className="text-sm font-bold text-slate-200 mb-4 uppercase tracking-wider">Zaman İçindeki Trend (Zaman Serisi)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatTimeSeries(timeSeries)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickFormatter={(v) => String(v).split('T')[0]} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Ciro" stroke="#818cf8" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                {timeSeries[0]?.profit != null && (
                   <Line type="monotone" dataKey="profit" name="Kâr" stroke="#34d399" strokeWidth={3} dot={false} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {breakdownKeys.map((key, idx) => {
        const breakdownData = breakdowns[key].slice(0, 7); // Top 7 items
        const hasRevenue = breakdownData[0]?.revenue != null;
        const hasQuantity = breakdownData[0]?.quantity != null;
        
        if (!hasRevenue && !hasQuantity) return null; // Can't render without a metric

        const metricKey = hasRevenue ? 'revenue' : 'quantity';
        const metricName = hasRevenue ? 'Ciro' : 'Adet';

        return (
          <div key={key} className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-slate-200 mb-4 uppercase tracking-wider">{key} Kırılımı (Top 7)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                {idx % 2 === 0 ? (
                  <BarChart data={breakdownData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                    <XAxis type="number" stroke="#64748b" fontSize={12} />
                    <YAxis dataKey="label" type="category" width={80} stroke="#64748b" fontSize={11} tick={{fill: '#94a3b8'}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                      cursor={{fill: '#1e293b'}}
                    />
                    <Legend />
                    <Bar dataKey={metricKey} name={metricName} fill={COLORS[idx % COLORS.length]} radius={[0, 4, 4, 0]} />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={breakdownData}
                      dataKey={metricKey}
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={50}
                      label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {breakdownData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }} />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
}
