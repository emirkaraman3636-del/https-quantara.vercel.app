import { 
  SemanticColumn, DatasetSchema, DatasetClassification, SemanticType, AnalyticalRole 
} from './dynamic-types';
import { inferSemanticSchemaAI } from './server-ai';

// Clean column names for matching
function normalizeColumnName(name: string): string {
  return String(name)
    .toLowerCase()
    .replace(/^\uFEFF/, '')
    .replace(/i̇/g, 'i')
    .replace(/ı/g, 'i')
    .replace(/ü/g, 'u')
    .replace(/ğ/g, 'g')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/ş/g, 's')
    .replace(/[^a-z0-9]/g, '');
}

function determineTechnicalType(values: unknown[]): 'string' | 'number' | 'date' | 'boolean' {
  let numCount = 0, dateCount = 0, strCount = 0, boolCount = 0;
  for (const v of values) {
    if (v === null || v === undefined || v === '') continue;
    if (typeof v === 'boolean' || v === 'true' || v === 'false') boolCount++;
    else if (!isNaN(Number(v))) numCount++;
    else if (typeof v === 'string' && (v.includes('-') || v.includes('/')) && !isNaN(Date.parse(v))) dateCount++;
    else strCount++;
  }

  const total = numCount + dateCount + strCount + boolCount;
  if (total === 0) return 'string';

  if (boolCount / total > 0.8) return 'boolean';
  if (dateCount / total > 0.8) return 'date';
  if (numCount / total > 0.8) return 'number';
  return 'string';
}

function getRepresentativeSample(rows: Record<string, unknown>[], column: string, maxSamples = 10): unknown[] {
  const samples = new Set<unknown>();
  
  for (let i = 0; i < rows.length; i++) {
    const val = rows[i][column];
    if (val !== null && val !== undefined && val !== '') {
      samples.add(val);
      if (samples.size >= maxSamples) break;
    }
  }
  return Array.from(samples);
}

function inferSemanticRoleDetermenistic(colName: string, techType: 'string' | 'number' | 'date' | 'boolean'): Partial<SemanticColumn> {
  const norm = normalizeColumnName(colName);
  
  // Identifiers
  if (norm.includes('id') || norm.includes('kodu') || norm.includes('code') || norm.includes('no') || norm.includes('hash')) {
    return { analyticalRole: 'identifier', semanticType: 'text', aggregatable: false, preferredAggregation: 'none', confidence: 90 };
  }
  
  // Currency / Financials
  if (norm.includes('ciro') || norm.includes('gelir') || norm.includes('revenue') || norm.includes('satis') || norm.includes('price') || norm.includes('fiyat') || norm.includes('tutar') || norm.includes('ucret') || norm.includes('fee') || norm.includes('cost') || norm.includes('maliyet') || norm.includes('expense') || norm.includes('spend') || norm.includes('profit') || norm.includes('kar') || norm.includes('vergi') || norm.includes('tax')) {
    return { analyticalRole: 'metric', semanticType: 'currency', aggregatable: true, preferredAggregation: 'sum', confidence: 95 };
  }

  // Temporal
  if (techType === 'date' || norm.includes('tarih') || norm.includes('date') || norm.includes('time') || norm.includes('created') || norm.includes('month') || norm.includes('ay')) {
    return { analyticalRole: 'temporal', semanticType: 'date', aggregatable: false, preferredAggregation: 'none', confidence: 95 };
  }

  // Quantity / Volumes
  if (norm.includes('adet') || norm.includes('miktar') || norm.includes('quantity') || norm.includes('qty') || norm.includes('stok') || norm.includes('stock') || norm.includes('count') || norm.includes('volume') || norm.includes('sayisi') || norm.includes('porsiyon')) {
    return { analyticalRole: 'metric', semanticType: 'quantity', aggregatable: true, preferredAggregation: 'sum', confidence: 95 };
  }

  // Percentages / Rates
  if (norm.includes('yuzde') || norm.includes('oran') || norm.includes('percent') || norm.includes('margin') || norm.includes('marj') || norm.includes('rate') || norm.includes('roas') || norm.includes('roi')) {
    return { analyticalRole: 'metric', semanticType: 'percentage', aggregatable: true, preferredAggregation: 'avg', confidence: 90 };
  }

  // Dimensions
  if (techType === 'string' || techType === 'boolean') {
    return { analyticalRole: 'dimension', semanticType: techType === 'boolean' ? 'boolean' : 'text', aggregatable: false, preferredAggregation: 'none', confidence: 60 };
  }

  // Fallback for remaining numbers
  if (techType === 'number') {
    return { analyticalRole: 'metric', semanticType: 'number', aggregatable: true, preferredAggregation: 'sum', confidence: 50 };
  }

  return { analyticalRole: 'unknown', semanticType: 'unknown', aggregatable: false, preferredAggregation: 'none', confidence: 0 };
}

export async function inferSemanticSchema(rows: Record<string, unknown>[]): Promise<DatasetSchema> {
  if (!rows || rows.length === 0) {
    return { columns: [], datasetType: 'Generic', classificationConfidence: 0 };
  }

  const columns = Object.keys(rows[0]);
  const semanticColumns: SemanticColumn[] = [];

  for (let i = 0; i < columns.length; i++) {
    const col = columns[i];
    const sampleVals = getRepresentativeSample(rows, col, 20); 
    const techType = determineTechnicalType(sampleVals);

    const inferred = inferSemanticRoleDetermenistic(col, techType);
    
    // Display priority: ID (10) -> Metric (1-4) -> Date (5) -> Dimension (6-9)
    let displayPriority = 10;
    if (inferred.analyticalRole === 'identifier') displayPriority = 10;
    else if (inferred.analyticalRole === 'temporal') displayPriority = 5;
    else if (inferred.analyticalRole === 'metric') {
      if (inferred.semanticType === 'currency') displayPriority = 1;
      else if (inferred.semanticType === 'quantity') displayPriority = 2;
      else if (inferred.semanticType === 'percentage') displayPriority = 3;
      else displayPriority = 4;
    } else if (inferred.analyticalRole === 'dimension') displayPriority = 6 + (i % 3);

    semanticColumns.push({
      name: col,
      cleanName: normalizeColumnName(col),
      analyticalRole: inferred.analyticalRole as AnalyticalRole,
      semanticType: inferred.semanticType as SemanticType,
      aggregatable: inferred.aggregatable!,
      preferredAggregation: inferred.preferredAggregation as 'sum' | 'avg' | 'count' | 'max' | 'min' | 'none',
      displayPriority,
      confidence: inferred.confidence!
    });
  }

  // Dataset Classification based purely on semantics
  let datasetType: DatasetClassification = 'Generic';
  const types = semanticColumns.map(c => c.semanticType);
  const names = semanticColumns.map(c => c.cleanName);

  if (names.some(n => n.includes('adspend') || n.includes('roas') || n.includes('cpc') || n.includes('impression') || n.includes('click') || n.includes('campaign'))) {
    datasetType = 'Marketing';
  } else if (names.some(n => n.includes('maas') || n.includes('salary') || n.includes('employee') || n.includes('calisan'))) {
    datasetType = 'HR';
  } else if (names.some(n => n.includes('stok') || n.includes('stock') || n.includes('inventory'))) {
    datasetType = 'Inventory';
  } else if (types.includes('currency') && types.includes('quantity')) {
    datasetType = 'Sales';
  } else if (types.includes('currency')) {
    datasetType = 'Finance';
  } else if (names.some(n => n.includes('musteri') || n.includes('customer') || n.includes('client'))) {
    datasetType = 'Customers';
  }

  return {
    columns: semanticColumns,
    datasetType,
    classificationConfidence: 90
  };
}
