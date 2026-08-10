import React from 'react';
import { BusinessIntelligenceContext } from '../../lib/dynamic-types';

interface DynamicKPIGridProps {
  biContext: BusinessIntelligenceContext;
}

export function DynamicKPIGrid({ biContext }: DynamicKPIGridProps) {
  const m = biContext.metrics;

  const formatCurrency = (val: number | null | undefined) => 
    val != null ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val) : 'N/A';
  
  const formatNumber = (val: number | null | undefined) => 
    val != null ? new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 }).format(val) : 'N/A';

  const formatPercent = (val: number | null | undefined) => 
    val != null ? `${val.toFixed(1)}%` : 'N/A';

  const kpis = [];

  if (m.totalRevenue != null) kpis.push({ title: 'Toplam Ciro', value: formatCurrency(m.totalRevenue), icon: '💰' });
  if (m.totalCost != null) kpis.push({ title: 'Toplam Maliyet', value: formatCurrency(m.totalCost), icon: '📉' });
  if (m.grossProfit != null) kpis.push({ title: 'Brüt Kâr', value: formatCurrency(m.grossProfit), icon: '✨' });
  if (m.netProfit != null) kpis.push({ title: 'Net Kâr', value: formatCurrency(m.netProfit), icon: '💎' });
  if (m.grossMargin != null) kpis.push({ title: 'Kâr Marjı', value: formatPercent(m.grossMargin), icon: '📊' });
  
  if (m.totalQuantity != null) kpis.push({ title: 'Toplam Adet/Miktar', value: formatNumber(m.totalQuantity), icon: '📦' });
  if (m.totalTransactions != null) kpis.push({ title: 'İşlem/Sipariş Sayısı', value: formatNumber(m.totalTransactions), icon: '🛒' });
  if (m.averageOrderValue != null) kpis.push({ title: 'Ortalama Sepet Tutarı', value: formatCurrency(m.averageOrderValue), icon: '🛍️' });
  if (m.averageSellingPrice != null) kpis.push({ title: 'Ortalama Satış Fiyatı', value: formatCurrency(m.averageSellingPrice), icon: '🏷️' });
  
  if (m.totalDiscount != null && m.totalDiscount > 0) kpis.push({ title: 'Toplam İndirim', value: formatCurrency(m.totalDiscount), icon: '🎁' });
  if (m.totalTax != null && m.totalTax > 0) kpis.push({ title: 'Toplam Vergi', value: formatCurrency(m.totalTax), icon: '🏛️' });
  if (m.totalExpenses != null && m.totalExpenses > 0) kpis.push({ title: 'Operasyonel Giderler', value: formatCurrency(m.totalExpenses), icon: '🧾' });

  if (kpis.length === 0) {
    return (
      <div className="bg-slate-900/60 p-6 border border-slate-800 rounded-lg text-slate-400 text-center">
        No numeric metrics available in this dataset.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 shadow-md hover:border-indigo-500/30 transition-colors">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {kpi.title}
            </span>
            <div className="text-xl">{kpi.icon}</div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-slate-100 truncate">
              {kpi.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
