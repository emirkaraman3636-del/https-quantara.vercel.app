import React, { useMemo } from 'react';
import { DatasetSchema, SemanticColumn, DynamicMetrics } from '../../lib/dynamic-types';
import { KPICard } from './KPICard';
import { formatValue } from '../../lib/formatters';
import { Calculator, DollarSign, Activity, PieChart, TrendingUp, LineChart } from 'lucide-react';

interface DynamicKPIGridProps {
  schema: DatasetSchema;
  metrics: DynamicMetrics;
}

export function DynamicKPIGrid({ schema, metrics }: DynamicKPIGridProps) {
  const kpiColumns = useMemo(() => {
    if (!schema?.columns) return [];

    // Filter valid metric candidates
    let candidates = schema.columns.filter(c => 
      c.analyticalRole === 'metric' && 
      c.aggregatable === true && 
      c.preferredAggregation !== 'none'
    );

    // Sort by display priority (lower number = higher priority)
    candidates.sort((a, b) => a.displayPriority - b.displayPriority);

    // Take top 4-6
    return candidates.slice(0, 6);
  }, [schema]);

  if (!kpiColumns || kpiColumns.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 text-center text-slate-400">
        <Activity className="w-8 h-8 mx-auto mb-3 text-slate-500 opacity-50" />
        <p>Bu veri setinde sayısal analiz yapılabilecek alan bulunamadı.</p>
        <p className="text-sm mt-1">Lütfen daha fazla sayısal alan (tutar, miktar, oran vb.) içeren bir dosya yükleyin.</p>
      </div>
    );
  }

  const getKPITitle = (col: SemanticColumn) => {
    const name = col.name;
    switch (col.preferredAggregation) {
      case 'sum': return `Toplam ${name}`;
      case 'avg': return `Ortalama ${name}`;
      case 'max': return `En Yüksek ${name}`;
      case 'min': return `En Düşük ${name}`;
      case 'count': return `${name} Sayısı`;
      default: return name;
    }
  };

  const getIcon = (col: SemanticColumn) => {
    if (col.semanticType === 'currency') return <DollarSign className="w-5 h-5" />;
    if (col.semanticType === 'percentage') return <PieChart className="w-5 h-5" />;
    if (col.preferredAggregation === 'avg') return <Activity className="w-5 h-5" />;
    if (col.preferredAggregation === 'sum') return <Calculator className="w-5 h-5" />;
    return <LineChart className="w-5 h-5" />;
  };

  const getValue = (col: SemanticColumn) => {
    // Attempt to get the value from backend metrics
    if (metrics?.kpis?.[col.name]) {
      const kpi = metrics.kpis[col.name] as { preferred?: number | string | null };
      return kpi.preferred ?? null;
    }
    return null; // Fallback
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {kpiColumns.map((col, idx) => {
        const rawValue = getValue(col);
        const formattedValue = formatValue(rawValue, col.semanticType, col.name);
        
        return (
          <KPICard
            key={`kpi-${col.name}-${idx}`}
            title={getKPITitle(col)}
            value={formattedValue}
            icon={getIcon(col)}
            highlight={idx === 0}
          />
        );
      })}
    </div>
  );
}
