import { DatasetSchema, DataQualityReport, SemanticColumn } from './dynamic-types';

export function analyzeDataQuality(rows: Record<string, unknown>[], schema: DatasetSchema): DataQualityReport {
  let validRows = 0;
  let invalidRows = 0;
  let emptyRows = 0;
  let malformedRows = 0;
  let duplicateRows = 0;

  const missingValues: Record<string, number> = {};
  const typeMismatches: Record<string, number> = {};
  const outliers: Record<string, number> = {};
  const detectedTypes: Record<string, string> = {};
  
  const rowHashes = new Set<string>();
  const metricValues: Record<string, number[]> = {};
  const limitations: string[] = [];
  
  let minDate = new Date(8640000000000000);
  let maxDate = new Date(-8640000000000000);

  // Initialize counters
  for (const col of schema.columns) {
    missingValues[col.name] = 0;
    typeMismatches[col.name] = 0;
    outliers[col.name] = 0;
    detectedTypes[col.name] = col.semanticType;
    if (col.analyticalRole === 'metric') {
      metricValues[col.name] = [];
    }
  }

  const temporalCol = schema.columns.find(c => c.analyticalRole === 'temporal');

  for (const row of rows) {
    // Check if row is completely empty
    if (Object.keys(row).length === 0 || Object.values(row).every(v => v === null || v === undefined || v === '')) {
      emptyRows++;
      invalidRows++;
      continue;
    }

    // Duplicates check
    const hash = JSON.stringify(row);
    if (rowHashes.has(hash)) {
      duplicateRows++;
    } else {
      rowHashes.add(hash);
    }

    let isRowValid = true;

    for (const col of schema.columns) {
      const val = row[col.name];
      
      // Missing value check
      if (val === null || val === undefined || val === '') {
        missingValues[col.name]++;
        continue;
      }

      // Type validation
      if (col.analyticalRole === 'metric' && (col.semanticType === 'number' || col.semanticType === 'currency' || col.semanticType === 'quantity')) {
        const num = Number(val);
        if (Number.isNaN(num)) {
          typeMismatches[col.name]++;
          isRowValid = false;
        } else {
          metricValues[col.name].push(num);
        }
      }

      if (temporalCol && col.name === temporalCol.name) {
        const d = new Date(val as string);
        if (Number.isNaN(d.getTime())) {
          typeMismatches[col.name]++;
          isRowValid = false;
        } else {
          if (d < minDate) minDate = d;
          if (d > maxDate) maxDate = d;
        }
      }
    }

    if (isRowValid) {
      validRows++;
    } else {
      malformedRows++;
      invalidRows++;
    }
  }

  // Outlier detection using IQR
  for (const colName of Object.keys(metricValues)) {
    const vals = metricValues[colName].sort((a, b) => a - b);
    if (vals.length < 4) continue; // Not enough data for IQR

    const q1 = vals[Math.floor(vals.length * 0.25)];
    const q3 = vals[Math.floor(vals.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    outliers[colName] = vals.filter(v => v < lowerBound || v > upperBound).length;
    if (outliers[colName] > vals.length * 0.1) {
      limitations.push(`High number of outliers detected in column: ${colName}. Calculations might be skewed.`);
    }
  }

  // General Limitations
  if (duplicateRows > rows.length * 0.05) {
    limitations.push(`Warning: Over 5% of your dataset are duplicate rows. Analysis may be inflated.`);
  }

  if (schema.columns.length > 0 && missingValues[schema.columns[0]?.name] > rows.length * 0.2) {
    limitations.push(`Warning: Key columns have more than 20% missing values.`);
  }

  const score = Math.max(0, 100 - (invalidRows / rows.length) * 100 - (duplicateRows / rows.length) * 50);

  return {
    totalRows: rows.length,
    validRows,
    invalidRows,
    emptyRows,
    malformedRows,
    duplicateRows,
    missingValues,
    typeMismatches,
    outliers,
    detectedTypes,
    limitations,
    dataQualityScore: Math.round(score),
    ...(minDate.getTime() !== 8640000000000000 ? {
      dateCoverage: {
        start: minDate.toISOString().split('T')[0],
        end: maxDate.toISOString().split('T')[0]
      }
    } : {})
  };
}
