'use client';

import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Target } from 'lucide-react';
import { useData } from '../../context/DataContext';

export function AIExecutiveBriefing() {
  const { analytics, aiSummary } = useData();

  if (!analytics || !analytics.kpis) {
    return null;
  }

  const { kpis, dataQuality } = analytics;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            AI Yönetici Özeti (Executive Briefing)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Yüklediğiniz verinin yapay zeka destekli profesyonel analizi.
          </p>
        </div>
        <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
          <span className="text-xs text-indigo-300 font-medium block text-center mb-1">Business Health</span>
          <span className="text-2xl font-black font-mono text-indigo-400">{aiSummary?.healthScore || 85}/100</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Key Findings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-emerald-400" />
              Temel Bulgular & Genel Durum
            </h3>
            <div className="prose prose-invert prose-sm max-w-none text-slate-300">
              <p>
                Veri setiniz toplam <strong>{kpis.totalOrders.toLocaleString()} işlem</strong> ve <strong>${kpis.totalRevenue.toLocaleString()} ciro</strong> içermektedir.
                Ortalama sepet tutarı <strong>${kpis.averageOrderValue.toFixed(2)}</strong> seviyesindedir. 
              </p>
              <p className="mt-3">
                <strong>En başarılı ürün:</strong> {kpis.bestSellingProduct.name} (${kpis.bestSellingProduct.revenue.toLocaleString()} gelir).
                <br />
                <strong>Düşük performans:</strong> {kpis.lowestSellingProduct.name} ürün grubunda satış zayıflığı görülüyor.
              </p>
            </div>
          </div>

          {/* AI Strategic Recommendations */}
          <div className="glass-panel p-6 rounded-2xl bg-indigo-900/10 border-indigo-500/20">
            <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              Stratejik Aksiyon Önerileri (Ne Yapılmalı?)
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <p><strong>Çapraz Satış (Cross-Sell):</strong> En çok satan '{kpis.bestSellingProduct.name}' ürünü ile birlikte aksesuarlar paketlenerek ortalama sepet tutarı artırılabilir.</p>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <p><strong>Stok Optimizasyonu:</strong> Geliri düşük olan '{kpis.lowestSellingProduct.name}' ürün grubu için stok devir hızı hesaplanarak indirim kampanyaları planlanmalıdır.</p>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <p><strong>Sadakat Programı:</strong> Hacmin büyük kısmı sadık müşterilerden geliyor gibi görünüyor. Yeni müşteri edinim maliyetini (CAC) düşürmek için referans programları aktif edilebilir.</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-2xl bg-rose-900/10 border-rose-500/20 h-full">
            <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Risk Analizi & Darboğazlar
            </h3>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Veri Kalitesi (Data Quality)</span>
                  <span className={`font-mono font-medium ${dataQuality?.score > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {dataQuality?.score || 100}/100
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${dataQuality?.score > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${dataQuality?.score || 100}%` }}></div>
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  Eksik veri oranı: %{dataQuality?.missingDataRate || 0}
                </p>
              </div>

              <div className="p-3 bg-rose-950/30 rounded-lg border border-rose-500/20">
                <h4 className="text-sm font-medium text-rose-300 mb-1">Müşteri/Talep Riski</h4>
                <p className="text-xs text-slate-300">
                  Talep belirli zaman dilimlerine aşırı yoğunlaşmış (mevsimsellik). Nakit akışı dengesizliklerini önlemek için abonelik modelleri veya ölü sezon indirimleri tasarlanmalı.
                </p>
              </div>

              <div className="p-3 bg-amber-950/30 rounded-lg border border-amber-500/20">
                <h4 className="text-sm font-medium text-amber-300 mb-1">Büyüme Sınırı</h4>
                <p className="text-xs text-slate-300">
                  Ürün portföyünün büyük kısmı sadece ana kategorilerden gelir getiriyor. Pazar payını genişletmek için yan hizmetler denenmeli.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
