"use client";
import { motion } from 'framer-motion';

export default function HeroDashboard() {
  return (
    <div className="relative w-full rounded-xl border border-[#272838] bg-[#0B0C15] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px] font-sans" style={{ perspective: '1200px', transform: 'rotateX(2deg)' }}>
      {/* Top Bar for Mobile */}
      <div className="md:hidden h-14 border-b border-[#272838] bg-[#13141D] flex items-center px-4">
        <div className="text-white font-bold text-sm">GİRDAP Dashboard</div>
      </div>
      
      {/* Sidebar */}
      <div className="hidden md:flex w-[260px] border-r border-[#272838] bg-[#07080F] flex-col p-4">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#7C3AED] to-[#00F0FF] flex items-center justify-center">
             <div className="w-2.5 h-2.5 rounded-full bg-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">GİRDAP <span className="text-[10px] bg-[#7C3AED]/20 text-[#A78BFA] px-1 py-0.5 rounded ml-1">Yapay zeka</span></div>
            <div className="text-[#64748B] text-[10px] mt-0.5">Akıllı Veri Platformu</div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="px-2 mb-2 flex justify-between items-center">
              <span className="text-[#475569] text-[10px] font-bold uppercase tracking-wider">Aktif Veri Kümesi</span>
              <span className="text-[#10B981] text-[10px] bg-[#10B981]/10 px-1.5 py-0.5 rounded border border-[#10B981]/20">30 kayıt</span>
            </div>
            <div className="px-2 py-2 rounded text-white text-xs font-medium bg-[#13141D] border border-[#272838]">Kurumsal Demo Verileri</div>
          </div>

          <div>
            <div className="px-2 mb-2 text-[#475569] text-[10px] font-bold uppercase tracking-wider">ANALİTİK GÖRÜNÜMLER</div>
            <div className="space-y-1">
              <div className="px-2 py-2 flex items-center gap-2 text-xs text-[#94A3B8] hover:bg-[#13141D] rounded cursor-pointer transition-colors">
                <span className="text-[#00F0FF]">⚡</span> Akıllı Gösterge Paneli <span className="ml-auto text-[9px] bg-[#272838] px-1 rounded">Yeni</span>
              </div>
              <div className="px-2 py-2 flex items-center gap-2 text-xs text-white bg-[#00F0FF]/10 rounded border border-[#00F0FF]/20 cursor-pointer">
                <span className="text-[#00F0FF]">✦</span> Yönetici Özeti <span className="ml-auto text-[9px] bg-[#7C3AED]/20 text-[#A78BFA] px-1 rounded">Yapay zeka</span>
              </div>
              <div className="px-2 py-2 flex items-center gap-2 text-xs text-[#94A3B8] hover:bg-[#13141D] rounded cursor-pointer transition-colors">
                <span className="text-[#10B981]">●</span> Veri Kalitesi ve Sağlığı
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#0B0C15] flex flex-col">
        {/* Top Header */}
        <div className="h-[72px] border-b border-[#272838] bg-[#0B0C15] flex items-center justify-between px-6">
          <div>
            <h2 className="text-white font-bold text-lg">Yönetici Satışlarına Genel Bakış</h2>
            <div className="text-[#64748B] text-xs mt-1">Gerçek zamanlı gelir metrikleri, sipariş hızı ve performans KPI'ları</div>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <div className="px-3 py-1.5 rounded border border-[#272838] bg-[#13141D] text-xs text-white flex items-center gap-2">
              <span>Tüm Kategoriler (4)</span>
              <span className="text-[8px]">▼</span>
            </div>
            <div className="px-4 py-1.5 rounded bg-[#7C3AED] text-xs font-medium text-white flex items-center gap-2 hover:bg-[#6D28D9] transition-colors">
              <span>✦ Yardımcı Pilot'a Sor</span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* AI Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-[#A78BFA] text-xl">✦</span>
              <h3 className="text-white text-xl font-bold">AI Yönetici Özeti (Yönetici Brifingi)</h3>
            </div>
            <div className="text-right">
              <div className="text-[#64748B] text-[10px]">İşletme Sağlığı</div>
              <div className="text-[#10B981] text-2xl font-bold tracking-tight">93/100</div>
            </div>
          </div>
          
          <div className="text-[#94A3B8] text-sm mb-6">
            Verinin yapay zeka destekli profesyonel analizini yüklediniz.
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (AI Insights) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Insight Card 1 */}
              <div className="bg-[#13141D] border border-[#272838] rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[#10B981]">◎</span>
                  <div className="text-white font-semibold text-sm">Temel Bulgular ve Genel Durum</div>
                </div>
                <div className="text-[#94A3B8] text-sm leading-relaxed space-y-4">
                  <p>Veri setiniz toplam <span className="text-white font-medium">30 işlem</span> ve <span className="text-white font-medium">161.250 $ ciro</span> içermektedir. Ortalama sepet bölme <span className="text-white font-medium">5375,00 $</span> seviyesindedir.</p>
                  <p><span className="text-white font-medium">En başarılı ürün:</span> Oversize Kapüşonlu Üst ($ 21.750 gelir).</p>
                  <p><span className="text-white font-medium">Düşük performans:</span> Canvas Belt ürün grubundaki satış zayıflığı görülüyor.</p>
                </div>
              </div>

              {/* Insight Card 2 */}
              <div className="bg-[#13141D] border border-[#272838] rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[#FBBF24]">💡</span>
                  <div className="text-white font-semibold text-sm">Stratejik Eylem Önerileri (Ne Yapılmalı?)</div>
                </div>
                <ul className="text-[#94A3B8] text-sm leading-relaxed space-y-3 list-disc pl-5">
                  <li><span className="text-white font-medium">Çapraz Satış:</span> En çok satan Oversize Hoody ürünü ile birlikte aksesuarlar paketlenerek sepet artırılabilir.</li>
                  <li><span className="text-white font-medium">Stok Optimizasyonu:</span> Geliri düşük olan Canvas Kemer için stok devir hızı hesaplanarak indirim kampanyaları planlanmalıdır.</li>
                  <li><span className="text-white font-medium">Sadakat Programı:</span> Hacmin büyük kısmı eski müşterilerden geliyor. Yeni müşteri kazanım maliyeti referansla düşürülebilir.</li>
                </ul>
              </div>

              {/* Chart Mockup */}
              <div className="bg-[#13141D] border border-[#272838] rounded-lg p-5 h-64 flex flex-col">
                 <div className="text-white font-semibold text-sm mb-4">Gelir Trendi (Q3)</div>
                 <div className="flex-1 relative border-l border-b border-[#272838] flex items-end gap-2 p-2 pt-8">
                    {/* SVG Chart Line */}
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d="M0,80 Q20,70 40,50 T70,30 T100,20" fill="none" stroke="#7C3AED" strokeWidth="2" />
                      <path d="M0,100 L0,80 Q20,70 40,50 T70,30 T100,20 L100,100 Z" fill="url(#grad)" opacity="0.2" />
                      <defs>
                        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7C3AED" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Bars */}
                    {[40, 60, 45, 80, 70, 95].map((h, i) => (
                      <div key={i} className="flex-1 bg-[#272838] rounded-t opacity-50 relative z-10 hover:bg-[#00F0FF] transition-colors" style={{ height: h + "%" }}></div>
                    ))}
                 </div>
              </div>

            </div>

            {/* Right Column (Risks & Quality) */}
            <div className="space-y-6">
              
              <div className="bg-[#13141D] border border-[#272838] rounded-lg p-5">
                 <div className="flex items-center gap-2 mb-4">
                  <span className="text-[#EF4444]">⚠</span>
                  <div className="text-white font-semibold text-sm">Risk Analizi ve Darboğazlar</div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-[#94A3B8]">Veri Kalitesi (Data Quality)</span>
                    <span className="text-[#10B981] font-mono">100 / 100</span>
                  </div>
                  <div className="h-1.5 bg-[#272838] rounded-full overflow-hidden">
                    <div className="h-full bg-[#10B981] w-full" />
                  </div>
                  <div className="text-[#64748B] text-[10px] mt-2">Eksik veri oranı: % 0</div>
                </div>

                <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded p-4 mb-4">
                  <div className="text-[#EF4444] text-xs font-semibold mb-1">Müşteri/Talep Riski</div>
                  <div className="text-[#94A3B8] text-[11px] leading-relaxed">Talep belirli zaman dilimlerine aşırı yoğunlaşmış (mevsimsellik). Nakit akışındaki dengesizlikleri engellemek için modeller veya ölü sezon indirimleri tasarlanmalı.</div>
                </div>

                <div className="bg-[#FBBF24]/5 border border-[#FBBF24]/20 rounded p-4">
                  <div className="text-[#FBBF24] text-xs font-semibold mb-1">Büyüme Sınırı</div>
                  <div className="text-[#94A3B8] text-[11px] leading-relaxed">Ürün koleksiyonunun büyük kısmı sadece ana kategorilerden gelir getiriyor. Pazar ödemesini genişletmek için yan hizmetler denenmeli.</div>
                </div>
              </div>

              {/* Data Engine Logs */}
              <div className="bg-[#0B0C15] border border-[#272838] rounded-lg p-4 font-mono text-[10px] text-[#64748B]">
                <div className="mb-2 text-[#94A3B8] uppercase">Engine Status</div>
                <div className="space-y-1">
                  <div><span className="text-[#10B981]">✔</span> VALIDATING RECORDS...</div>
                  <div><span className="text-[#10B981]">✔</span> 48,291 ROWS PARSED</div>
                  <div><span className="text-[#10B981]">✔</span> DETERMINISTIC CHECK PASSED</div>
                  <div className="text-[#7C3AED]">▶ INFERRING INSIGHTS...</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}