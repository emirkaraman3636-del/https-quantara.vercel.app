import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';
import { formatValue } from '../../lib/formatters';

interface DynamicBarChartProps {
  data: Record<string, unknown>[];
  xAxisKey: string;
  series: {
    key: string;
    name: string;
    color: string;
    semanticType: string;
  }[];
  layout?: 'horizontal' | 'vertical';
}

export function DynamicBarChart({ data, xAxisKey, series, layout = 'horizontal' }: DynamicBarChartProps) {
  return (
    <div className="h-80 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout={layout}
          margin={{ top: 10, right: 30, left: layout === 'vertical' ? 60 : 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={layout === 'horizontal'} vertical={layout === 'vertical'} />
          
          {layout === 'horizontal' ? (
            <>
              <XAxis dataKey={xAxisKey} stroke="#94a3b8" fontSize={12} tickMargin={10} minTickGap={15} />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                  return value;
                }}
              />
            </>
          ) : (
            <>
              <XAxis 
                type="number" 
                stroke="#94a3b8" 
                fontSize={12}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                  return value;
                }}
              />
              <YAxis dataKey={xAxisKey} type="category" stroke="#94a3b8" fontSize={12} width={100} tickFormatter={(val) => val && typeof val === 'string' && val.length > 15 ? val.substring(0, 15) + '...' : val} />
            </>
          )}

          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
            itemStyle={{ color: '#f8fafc' }}
            formatter={(value: unknown, name: unknown) => {
              const sr = series.find(s => s.name === name);
              return [formatValue(Number(value), sr?.semanticType || 'number'), name as string];
            }}
            labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          {series.map((s, idx) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.name}
              fill={s.color}
              radius={layout === 'horizontal' ? [4, 4, 0, 0] : [0, 4, 4, 0]}
              maxBarSize={60}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={s.color} fillOpacity={0.8} />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
