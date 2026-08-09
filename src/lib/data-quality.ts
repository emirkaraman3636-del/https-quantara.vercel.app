import { DatasetSchema, DataQualityReport } from './dynamic-types';

export function generateDataQualityReport(rows: Record<string, unknown>[], schema: DatasetSchema): DataQualityReport {
  const missingValues: Record<string, number> = {};
  const typeMismatches: Record<string, number> = {};
  const outliers: Record<string, number> = {};
  let duplicateRows = 0;

  const rowHashes = new Set<string>();

  for (const col of schema.columns) {
    missingValues[col.name] = 0;
    typeMismatches[col.name] = 0;
    outliers[col.name] = 0;
  }

  const metricValues: Record<string, number[]> = {};

  for (const row of rows) {
    // Duplicate detection based on stringified row (simple heuristic)
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

  // Calculate Outliers using IQR
  for (const colName of Object.keys(metricValues)) {
    const vals = [...metricValues[colName]].sort((a, b) => a - b);
    if (vals.length < 4) continue; 

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
