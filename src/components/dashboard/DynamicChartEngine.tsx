import React, { useMemo } from 'react';
import { DatasetSchema, DynamicMetrics, ChartConfig } from '../../lib/dynamic-types';
import { DynamicBarChart } from './DynamicBarChart';
import { DynamicLineChart } from './DynamicLineChart';
import { DynamicPieChart } from './DynamicPieChart';
import { BarChart2 } from 'lucide-react';

interface DynamicChartEngineProps {
  schema: DatasetSchema;
  metrics: DynamicMetrics;
  rawRows: Record<string, unknown>[];
}

export function DynamicChartEngine({ schema, metrics, rawRows }: DynamicChartEngineProps) {
  const chartConfigs = useMemo(() => {
    if (!schema?.columns || !metrics) return [];

    const configs: ChartConfig[] = [];
    const metricCols = schema.columns.filter(c => c.analyticalRole === 'metric' && c.aggregatable).sort((a, b) => a.displayPriority - b.displayPriority);
    const primaryMetric = metricCols.length > 0 ? metricCols[0] : null;

    if (!primaryMetric) return [];

    // 1. Temporal Line Chart (RULE A)
    const temporalCols = schema.columns.filter(c => c.analyticalRole === 'temporal');
    if (temporalCols.length > 0 && primaryMetric) {
      const tCol = temporalCols[0];
      
      // We need to aggregate data by date (default to monthly if range > 60 days, else daily)
      const dateRange = metrics.kpis?.dateRange;
      let format = 'daily';
      if (dateRange) {
        const d1 = new Date(dateRange.start);
        const d2 = new Date(dateRange.end);
        const diffDays = Math.ceil(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 90) format = 'monthly';
      }

      const timeMap: Record<string, { sum: number, count: number }> = {};
      
      for (const row of rawRows) {
        const rawDate = row[tCol.name];
        if (!rawDate) continue;
        const d = new Date(rawDate as string | number | Date);
        if (isNaN(d.getTime())) continue;

        let key = d.toISOString().split('T')[0];
        if (format === 'monthly') {
          key = key.substring(0, 7); // YYYY-MM
        }

        if (!timeMap[key]) timeMap[key] = { sum: 0, count: 0 };
        
        const metricVal = Number(row[primaryMetric.name]);
        if (!isNaN(metricVal)) {
          timeMap[key].sum += metricVal;
          timeMap[key].count++;
        }
      }

      const timeSeries = Object.keys(timeMap).sort().map(k => ({
        date: k,
        value: primaryMetric.preferredAggregation === 'sum' ? timeMap[k].sum : (timeMap[k].count > 0 ? timeMap[k].sum / timeMap[k].count : 0)
      }));

      if (timeSeries.length > 1) {
        configs.push({
          id: 'temporal-trend',
          type: 'line',
          title: `${primaryMetric.name} Zaman İçindeki Değişimi`,
          data: timeSeries,
          xAxisKey: 'date',
          series: [{ key: 'value', name: primaryMetric.name, color: '#6366f1', semanticType: primaryMetric.semanticType }]
        });
      }
    }

    // 2. Breakdowns (RULE B, C, D)
    if (metrics.breakdowns) {
      Object.keys(metrics.breakdowns).forEach((breakdownKey, idx) => {
        const breakdownData = metrics.breakdowns[breakdownKey];
        if (!breakdownData || breakdownData.length === 0) return;

        // breakdownKey is usually "MetricName_by_DimensionName"
        const parts = breakdownKey.split('_by_');
        const metricName = parts[0];
        const dimName = parts[1];
        
        const metricSchema = schema.columns.find(c => c.name === metricName) || primaryMetric;

        // If low cardinality (<= 5), pie chart
        if (breakdownData.length <= 5 && breakdownData.length > 1 && metricSchema.preferredAggregation === 'sum') {
          configs.push({
            id: `pie-${idx}`,
            type: 'pie',
            title: `${dimName} Dağılımına Göre Toplam ${metricSchema.name}`,
            data: breakdownData,
            nameKey: 'label',
            dataKey: 'value',
            metricName: metricSchema.name,
            semanticType: metricSchema.semanticType
          });
        } else {
          // Bar chart
          configs.push({
            id: `bar-${idx}`,
            type: 'bar',
            title: `En Yüksek ${metricSchema.name} Değerine Sahip ${dimName}ler (Top ${breakdownData.length})`,
            data: breakdownData,
            xAxisKey: 'label',
            layout: 'horizontal',
            series: [{ key: 'value', name: metricSchema.name, color: '#10b981', semanticType: metricSchema.semanticType }]
          });
        }
      });
    }

    return configs;
  }, [schema, metrics, rawRows]);

  if (chartConfigs.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-8 text-center text-slate-400">
        <BarChart2 className="w-8 h-8 mx-auto mb-3 text-slate-500 opacity-50" />
        <p>Görselleştirilecek uygun kategorik veya tarihsel alan bulunamadı.</p>
        <p className="text-sm mt-1">Lütfen daha fazla kırılım yapabileceğiniz metin veya tarih sütunları ekleyin.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {chartConfigs.map(config => (
        <div key={config.id} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-300 tracking-wide">{config.title}</h3>
          {config.type === 'line' && (
            <DynamicLineChart 
              data={config.data} 
              xAxisKey={config.xAxisKey} 
              series={config.series} 
            />
          )}
          {config.type === 'bar' && (
            <DynamicBarChart 
              data={config.data} 
              xAxisKey={config.xAxisKey} 
              series={config.series}
              layout={config.type === 'bar' ? config.layout : undefined}
            />
          )}
          {config.type === 'pie' && (
            <DynamicPieChart 
              data={config.data} 
              nameKey={config.nameKey} 
              dataKey={config.dataKey}
              metricName={config.metricName}
              semanticType={config.semanticType}
            />
          )}
        </div>
      ))}
    </div>
  );
}
