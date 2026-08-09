import { DatasetSchema, DataQualityReport, DynamicMetrics } from './dynamic-types';

export function analyzeDataQuality(rows: Record<string, unknown>[], schema: DatasetSchema): DataQualityReport {
  const missingValues: Record<string, number> = {};
  const typeMismatches: Record<string, number> = {};
  const outliers: Record<string, number> = {};
  let duplicateRows = 0;

  const rowHashes = new Set<string>();

  // Initialize counters
  for (const col of schema.columns) {
    missingValues[col.name] = 0;
    typeMismatches[col.name] = 0;
    outliers[col.name] = 0;
  }

  // First pass: missing, duplicates, type mismatches
  const metricValues: Record<string, number[]> = {};

  for (const row of rows) {
    const hash = JSON.stringify(row);
    if (rowHashes.has(hash)) {
      duplicateRows++;
    } else {
      rowHashes.add(hash);
    }

    for (const col of schema.columns) {
      const val = row[col.name];
      if (val === null || val === undefined || val === '') {
        missingValues[col.name]++;
        continue;
      }

      if (col.analyticalRole === 'metric' && (col.semanticType === 'number' || col.semanticType === 'currency' || col.semanticType === 'quantity')) {
        const num = Number(val);
        if (isNaN(num)) {
          typeMismatches[col.name]++;
        } else {
          if (!metricValues[col.name]) metricValues[col.name] = [];
          metricValues[col.name].push(num);
        }
      }
    }
  }

  // Second pass: Outliers (IQR method)
  for (const colName of Object.keys(metricValues)) {
    const vals = [...metricValues[colName]].sort((a, b) => a - b);
    if (vals.length < 4) continue; // Need at least 4 for IQR

    const q1 = vals[Math.floor(vals.length * 0.25)];
    const q3 = vals[Math.floor(vals.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    outliers[colName] = vals.filter(v => v < lowerBound || v > upperBound).length;
  }

  return {
    totalRows: rows.length,
    duplicateRows,
    missingValues,
    typeMismatches,
    outliers
  };
}

export function calculateGenericMetrics(rows: Record<string, unknown>[], schema: DatasetSchema): DynamicMetrics {
  const metrics: Record<string, number | string | null | Record<string, unknown>> = {};
  const breakdowns: Record<string, Array<{ label: string; value: number }>> = {};

  // Find priority metrics
  const metricCols = schema.columns
    .filter(c => c.analyticalRole === 'metric' && c.aggregatable)
    .sort((a, b) => a.displayPriority - b.displayPriority)
    .slice(0, 5); // Take top 5 metrics to avoid clutter

  for (const col of metricCols) {
    let sum = 0;
    let count = 0;
    let min = Infinity;
    let max = -Infinity;

    for (const row of rows) {
      const rawVal = row[col.name];
      if (rawVal === null || rawVal === undefined || rawVal === '') continue;
      
      const val = Number(rawVal);
      if (!isNaN(val)) {
        sum += val;
        count++;
        if (val < min) min = val;
        if (val > max) max = val;
      }
    }

    metrics[col.name] = {
      preferred: col.preferredAggregation === 'sum' ? sum : (col.preferredAggregation === 'avg' ? (count > 0 ? sum / count : 0) : count),
      sum,
      avg: count > 0 ? sum / count : 0,
      min: count > 0 ? min : 0,
      max: count > 0 ? max : 0,
      count
    };
  }

  // Generate Breakdowns (Dimension + Primary Metric)
  const primaryMetric = metricCols.length > 0 ? metricCols[0] : null;
  const dimensionCols = schema.columns
    .filter(c => c.analyticalRole === 'dimension')
    .sort((a, b) => a.displayPriority - b.displayPriority)
    .slice(0, 3); // Take top 3 dimensions

  if (primaryMetric && dimensionCols.length > 0) {
    for (const dimCol of dimensionCols) {
      const groups: Record<string, { sum: number, count: number }> = {};
      
      for (const row of rows) {
        const dimVal = String(row[dimCol.name] || 'Unknown').trim();
        const rawMetricVal = row[primaryMetric.name];
        if (rawMetricVal === null || rawMetricVal === undefined || rawMetricVal === '') continue;
        
        const metricVal = Number(rawMetricVal);
        
        if (!groups[dimVal]) groups[dimVal] = { sum: 0, count: 0 };
        
        if (!isNaN(metricVal)) {
          groups[dimVal].sum += metricVal;
          groups[dimVal].count++;
        }
      }

      // Convert to array and take top 10
      const groupArray = Object.keys(groups).map(k => ({
        label: k,
        value: primaryMetric.preferredAggregation === 'sum' ? groups[k].sum : (groups[k].count > 0 ? groups[k].sum / groups[k].count : 0)
      })).sort((a, b) => b.value - a.value).slice(0, 10);

      breakdowns[`${primaryMetric.name}_by_${dimCol.name}`] = groupArray;
    }
  }

  // Temporal analysis (Basic Date range)
  const temporalCols = schema.columns.filter(c => c.analyticalRole === 'temporal');
  if (temporalCols.length > 0) {
    const tCol = temporalCols[0];
    let minDate = new Date(8640000000000000); // max date
    let maxDate = new Date(-8640000000000000);
    
    for (const row of rows) {
      const d = new Date(row[tCol.name] as string);
      if (!isNaN(d.getTime())) {
        if (d < minDate) minDate = d;
        if (d > maxDate) maxDate = d;
      }
    }
    
    metrics['dateRange'] = {
      column: tCol.name,
      start: minDate.toISOString().split('T')[0],
      end: maxDate.toISOString().split('T')[0],
      days: Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24))
    };
  }

  return {
    kpis: metrics as unknown as DynamicMetrics['kpis'],
    breakdowns
  };
}
