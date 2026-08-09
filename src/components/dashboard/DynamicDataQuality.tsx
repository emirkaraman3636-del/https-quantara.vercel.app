import React, { useState } from 'react';
import { DataQualityReport, DatasetSchema } from '../../lib/dynamic-types';
import { AlertTriangle, AlertCircle, Info, Hash, FileMinus, Copy } from 'lucide-react';

interface DynamicDataQualityProps {
  quality: DataQualityReport | null;
  schema: DatasetSchema;
}

export function DynamicDataQuality({ quality, schema }: DynamicDataQualityProps) {
  const [expanded, setExpanded] = useState(false);

  if (!quality) return null;

  const missingCols = Object.keys(quality.missingValues).filter(k => quality.missingValues[k] > 0);
  const mismatchCols = Object.keys(quality.typeMismatches).filter(k => quality.typeMismatches[k] > 0);
  const outlierCols = Object.keys(quality.outliers).filter(k => quality.outliers[k] > 0);

  const totalMissing = missingCols.reduce((sum, k) => sum + quality.missingValues[k], 0);
  const totalMismatches = mismatchCols.reduce((sum, k) => sum + quality.typeMismatches[k], 0);
  const totalOutliers = outlierCols.reduce((sum, k) => sum + quality.outliers[k], 0);

  const hasIssues = totalMissing > 0 || quality.duplicateRows > 0 || totalMismatches > 0 || totalOutliers > 0;

  if (!hasIssues) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 text-emerald-400">
        <Info className="w-5 h-5" />
        <div>
          <h3 className="font-medium text-sm">Veri Kalitesi Mükemmel</h3>
          <p className="text-xs opacity-80 mt-0.5">Eksik, hatalı veya tekrarlayan kayıt bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden transition-all duration-300">
      <div 
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-200">İyileştirilebilir Veri Kalitesi</h3>
            <p className="text-xs text-slate-400 mt-0.5">Bazı sütunlarda dikkat edilmesi gereken noktalar tespit edildi.</p>
          </div>
        </div>
        <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300">
          {expanded ? 'Detayları Gizle' : 'Detayları İncele'}
        </button>
      </div>

      {expanded && (
        <div className="p-5 pt-0 border-t border-slate-800/80 bg-slate-900/40 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Duplicates */}
          {quality.duplicateRows > 0 && (
            <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
              <Copy className="w-4 h-4 text-rose-400 mt-0.5" />
              <div>
                <span className="text-sm font-medium text-slate-300">Tekrar Eden Kayıtlar</span>
                <p className="text-xs text-slate-400 mt-1">
                  Veri setinde tam olarak birbiriyle aynı olan <strong className="text-rose-400">{quality.duplicateRows.toLocaleString('tr-TR')}</strong> satır bulundu.
                </p>
              </div>
            </div>
          )}

          {/* Missing Values */}
          {totalMissing > 0 && (
            <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
              <FileMinus className="w-4 h-4 text-amber-400 mt-0.5" />
              <div className="w-full">
                <span className="text-sm font-medium text-slate-300">Eksik Değerler (Boş Hücreler)</span>
                <p className="text-xs text-slate-400 mt-1 mb-2">
                  Toplam <strong className="text-amber-400">{totalMissing.toLocaleString('tr-TR')}</strong> hücrede veri eksik.
                </p>
                <div className="space-y-1">
                  {missingCols.slice(0, 5).map(col => (
                    <div key={col} className="flex justify-between text-xs">
                      <span className="text-slate-500">{col}</span>
                      <span className="text-amber-400/80">{quality.missingValues[col]} eksik</span>
                    </div>
                  ))}
                  {missingCols.length > 5 && (
                    <div className="text-xs text-slate-500 italic">+ {missingCols.length - 5} sütun daha</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Type Mismatches */}
          {totalMismatches > 0 && (
            <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
              <Hash className="w-4 h-4 text-rose-400 mt-0.5" />
              <div className="w-full">
                <span className="text-sm font-medium text-slate-300">Tip Uyuşmazlığı</span>
                <p className="text-xs text-slate-400 mt-1 mb-2">
                  Sayısal olması beklenen sütunlarda metin içeren <strong className="text-rose-400">{totalMismatches.toLocaleString('tr-TR')}</strong> hücre bulundu.
                </p>
                <div className="space-y-1">
                  {mismatchCols.slice(0, 5).map(col => (
                    <div key={col} className="flex justify-between text-xs">
                      <span className="text-slate-500">{col}</span>
                      <span className="text-rose-400/80">{quality.typeMismatches[col]} hatalı tip</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Outliers */}
          {totalOutliers > 0 && (
            <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
              <AlertCircle className="w-4 h-4 text-indigo-400 mt-0.5" />
              <div className="w-full">
                <span className="text-sm font-medium text-slate-300">Aykırı Değerler (Outliers)</span>
                <p className="text-xs text-slate-400 mt-1 mb-2">
                  İstatistiksel olarak normal dağılımın çok dışında kalan <strong className="text-indigo-400">{totalOutliers.toLocaleString('tr-TR')}</strong> değer tespit edildi.
                </p>
                <div className="space-y-1">
                  {outlierCols.slice(0, 5).map(col => (
                    <div key={col} className="flex justify-between text-xs">
                      <span className="text-slate-500">{col}</span>
                      <span className="text-indigo-400/80">{quality.outliers[col]} aykırı değer</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
