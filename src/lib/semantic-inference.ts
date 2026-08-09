import { 
  SemanticColumn, DatasetSchema, DatasetClassification 
} from './dynamic-types';
import { inferSemanticSchemaAI } from './server-ai';

// Simple cleaning function for matching heuristics
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
    else if (!isNaN(Date.parse(String(v))) && (String(v).includes('-') || String(v).includes('/'))) dateCount++;
    else strCount++;
  }

  const total = numCount + dateCount + strCount + boolCount;
  if (total === 0) return 'string';

  if (boolCount / total > 0.8) return 'boolean';
  if (dateCount / total > 0.8) return 'date';
  if (numCount / total > 0.8) return 'number';
  return 'string';
}

function maskPII(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  // Basic Email masking
  if (value.includes('@') && value.includes('.')) {
    return value.replace(/(.{1,2})(.*)(@.*)/, '$1***$3');
  }
  // TCKN / SSN masking (11 digits or 9 digits)
  if (/^\d{9,11}$/.test(value)) {
    return value.replace(/^(\d{2})\d+(\d{2})$/, '$1***$2');
  }
  // Phone numbers (contains + and digits)
  if (/^\+?\d{10,14}$/.test(value.replace(/[\s-]/g, ''))) {
    return value.replace(/(\d{3})\d+(\d{2})$/, '$1***$2');
  }
  return value;
}

function getRepresentativeSample(rows: Record<string, unknown>[], column: string, maxSamples = 3): unknown[] {
  const samples = new Set<unknown>();
  
  // 1. First non-empty
  for (let i = 0; i < rows.length; i++) {
    const val = rows[i][column];
    if (val !== null && val !== undefined && val !== '') {
      samples.add(maskPII(val));
      break;
    }
  }

  // 2. Middle non-empty
  const mid = Math.floor(rows.length / 2);
  for (let i = mid; i < rows.length; i++) {
    const val = rows[i][column];
    if (val !== null && val !== undefined && val !== '' && !samples.has(maskPII(val))) {
      samples.add(maskPII(val));
      break;
    }
  }

  // 3. Late distinct
  for (let i = rows.length - 1; i >= 0; i--) {
    if (samples.size >= maxSamples) break;
    const val = rows[i][column];
    if (val !== null && val !== undefined && val !== '' && !samples.has(maskPII(val))) {
      samples.add(maskPII(val));
      break;
    }
  }

  return Array.from(samples);
}

// Local Deterministic Heuristics
function applyHeuristics(colName: string): Partial<SemanticColumn> | null {
  const norm = normalizeColumnName(colName);
  
  // Identifiers
  if (norm.includes('id') || norm.includes('tckn') || norm.includes('kodu') || norm.includes('code') || norm.includes('no')) {
    return { analyticalRole: 'identifier', semanticType: 'text', aggregatable: false, preferredAggregation: 'none', confidence: 90, displayPriority: 10 };
  }
  
  // Temporal
  if (norm.includes('tarih') || norm.includes('date') || norm.includes('time') || norm.includes('created')) {
    return { analyticalRole: 'temporal', semanticType: 'date', aggregatable: false, preferredAggregation: 'none', confidence: 95, displayPriority: 5 };
  }

  // Currency / Revenue
  if (norm.includes('ciro') || norm.includes('gelir') || norm.includes('revenue') || norm.includes('satis') || norm.includes('price') || norm.includes('fiyat') || norm.includes('tutar') || norm.includes('maas') || norm.includes('salary') || norm.includes('cost') || norm.includes('maliyet')) {
    return { analyticalRole: 'metric', semanticType: 'currency', aggregatable: true, preferredAggregation: 'sum', confidence: 95, displayPriority: 1 };
  }

  // Quantity
  if (norm.includes('adet') || norm.includes('miktar') || norm.includes('quantity') || norm.includes('qty') || norm.includes('stok') || norm.includes('stock')) {
    return { analyticalRole: 'metric', semanticType: 'quantity', aggregatable: true, preferredAggregation: 'sum', confidence: 90, displayPriority: 2 };
  }

  // Percentage
  if (norm.includes('yuzde') || norm.includes('oran') || norm.includes('percent') || norm.includes('margin') || norm.includes('marj')) {
    return { analyticalRole: 'metric', semanticType: 'percentage', aggregatable: true, preferredAggregation: 'avg', confidence: 90, displayPriority: 3 };
  }

  // Dimensions
  if (norm.includes('kategori') || norm.includes('category') || norm.includes('departman') || norm.includes('department') || norm.includes('sehir') || norm.includes('city') || norm.includes('bolge') || norm.includes('region') || norm.includes('durum') || norm.includes('status')) {
    return { analyticalRole: 'dimension', semanticType: 'text', aggregatable: false, preferredAggregation: 'none', confidence: 90, displayPriority: 6 };
  }

  // Age (Metric but AVG)
  if (norm === 'yas' || norm === 'age') {
    return { analyticalRole: 'metric', semanticType: 'number', aggregatable: true, preferredAggregation: 'avg', confidence: 95, displayPriority: 4 };
  }

  return null;
}

export async function inferSemanticSchema(rows: Record<string, unknown>[]): Promise<DatasetSchema> {
  if (!rows || rows.length === 0) {
    return { columns: [], datasetType: 'Generic', classificationConfidence: 0 };
  }

  const columns = Object.keys(rows[0]);
  const semanticColumns: SemanticColumn[] = [];
  const unknownColumnsForAI: Array<{ name: string; sampleValues: unknown[]; technicalType: string }> = [];

  for (const col of columns) {
    // 1. Technical type
    const sampleVals = getRepresentativeSample(rows, col, 20); // Get up to 20 to determine type accurately
    const techType = determineTechnicalType(sampleVals);

    // 2. Heuristics
    const heuristicMatch = applyHeuristics(col);
    
    if (heuristicMatch && heuristicMatch.confidence && heuristicMatch.confidence >= 80) {
      semanticColumns.push({
        name: col,
        cleanName: normalizeColumnName(col),
        analyticalRole: heuristicMatch.analyticalRole!,
        semanticType: heuristicMatch.semanticType!,
        aggregatable: heuristicMatch.aggregatable!,
        preferredAggregation: heuristicMatch.preferredAggregation!,
        displayPriority: heuristicMatch.displayPriority!,
        confidence: heuristicMatch.confidence!
      });
    } else {
      // 3. Fallback to AI
      unknownColumnsForAI.push({
        name: col,
        sampleValues: getRepresentativeSample(rows, col, 4), // Small sample for AI
        technicalType: techType
      });
    }
  }

  // AI Inference Execution
  if (unknownColumnsForAI.length > 0) {
    try {
      const aiResponse = await inferSemanticSchemaAI(unknownColumnsForAI);
      
      for (const unknownCol of unknownColumnsForAI) {
        const aiMatch = (aiResponse.columns as Array<Record<string, unknown>>).find(c => c.name === unknownCol.name);
        if (aiMatch) {
          semanticColumns.push({
            name: unknownCol.name,
            cleanName: normalizeColumnName(unknownCol.name),
            analyticalRole: aiMatch.analyticalRole as unknown as SemanticColumn['analyticalRole'],
            semanticType: aiMatch.semanticType as unknown as SemanticColumn['semanticType'],
            aggregatable: aiMatch.aggregatable as boolean,
            preferredAggregation: aiMatch.preferredAggregation as unknown as SemanticColumn['preferredAggregation'],
            displayPriority: aiMatch.displayPriority as number,
            confidence: aiMatch.confidence as number
          });
        } else {
          throw new Error('AI missed a column');
        }
      }
    } catch (error) {
      console.error("AI inference failed, applying generic deterministic fallback", error);
      // Fallback if AI fails completely
      for (const unknownCol of unknownColumnsForAI) {
        semanticColumns.push({
          name: unknownCol.name,
          cleanName: normalizeColumnName(unknownCol.name),
          analyticalRole: unknownCol.technicalType === 'number' ? 'metric' : (unknownCol.technicalType === 'date' ? 'temporal' : 'dimension'),
          semanticType: unknownCol.technicalType === 'number' ? 'number' : (unknownCol.technicalType === 'date' ? 'date' : 'text'),
          aggregatable: unknownCol.technicalType === 'number',
          preferredAggregation: unknownCol.technicalType === 'number' ? 'sum' : 'none',
          displayPriority: 10,
          confidence: 20
        });
      }
    }
  }

  // 4. Dataset Classification based on collective evidence
  let datasetType: DatasetClassification = 'Generic';
  let classificationConfidence = 0;

  const types = semanticColumns.map(c => c.semanticType);
  const names = semanticColumns.map(c => c.cleanName);

  if (types.includes('currency') && types.includes('quantity') && (names.some(n => n.includes('urun') || n.includes('product')))) {
    datasetType = 'Sales';
    classificationConfidence = 90;
  } else if (types.includes('currency') && names.some(n => n.includes('maas') || n.includes('salary') || n.includes('department'))) {
    datasetType = 'HR';
    classificationConfidence = 85;
  } else if (types.includes('quantity') && names.some(n => n.includes('stok') || n.includes('stock') || n.includes('sku'))) {
    datasetType = 'Inventory';
    classificationConfidence = 85;
  } else if (types.includes('currency') && names.some(n => n.includes('gider') || n.includes('expense') || n.includes('maliyet'))) {
    datasetType = 'Finance';
    classificationConfidence = 80;
  } else {
    datasetType = 'Generic';
    classificationConfidence = Math.min(...semanticColumns.map(c => c.confidence));
  }

  return {
    columns: semanticColumns,
    datasetType,
    classificationConfidence
  };
}
