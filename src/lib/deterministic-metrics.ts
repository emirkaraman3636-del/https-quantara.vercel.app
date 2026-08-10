import { 
  DatasetSchema, 
  DataQualityReport, 
  BusinessIntelligenceContext, 
  DeterministicMetrics,
  TimeSeriesData,
  ConcentrationRisk,
  Anomaly
} from './dynamic-types';

function extractNumeric(val: unknown): number | null {
  if (val === null || val === undefined || val === '') return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
}

export function generateDeterministicBIContext(
  rows: Record<string, unknown>[], 
  schema: DatasetSchema, 
  quality: DataQualityReport
): BusinessIntelligenceContext {
  
  const metrics: DeterministicMetrics = {
    totalRevenue: null,
    totalCost: null,
    grossProfit: null,
    grossMargin: null,
    totalQuantity: null,
    totalTransactions: rows.length,
    averageOrderValue: null,
    averageSellingPrice: null,
    totalDiscount: null,
    totalTax: null,
    totalExpenses: null,
    netProfit: null
  };

  const timeSeries: TimeSeriesData[] = [];
  const concentrations: ConcentrationRisk[] = [];
  const anomalies: Anomaly[] = [];
  const breakdowns: BusinessIntelligenceContext['breakdowns'] = {};
  const limitations: string[] = [];

  if (rows.length === 0) {
    limitations.push('Dataset contains no valid rows.');
    return {
      metadata: { datasetType: schema.datasetType, totalRows: 0 },
      metrics,
      breakdowns,
      timeSeries,
      concentrations,
      anomalies,
      limitations
    };
  }

  // Identify specific semantic columns based on clean names
  const colMap = new Map<string, string>(); // Target -> Actual Column Name
  
  for (const col of schema.columns) {
    if (col.analyticalRole === 'metric') {
      if (!colMap.has('revenue') && (col.cleanName.includes('ciro') || col.cleanName.includes('revenue') || col.cleanName.includes('satis') || col.cleanName.includes('tutar') || col.cleanName.includes('gelir') || col.cleanName.includes('ucret') || col.cleanName.includes('fee'))) {
        colMap.set('revenue', col.name);
      }
      else if (!colMap.has('price') && (col.cleanName.includes('price') || col.cleanName.includes('fiyat') || col.cleanName.includes('unit'))) {
        colMap.set('price', col.name);
      }
      else if (!colMap.has('cost') && (col.cleanName.includes('cost') || col.cleanName.includes('cogs') || col.cleanName.includes('maliyet'))) {
        colMap.set('cost', col.name);
      }
      else if (!colMap.has('quantity') && col.semanticType === 'quantity') {
        colMap.set('quantity', col.name);
      }
      else if (!colMap.has('expense') && (col.cleanName.includes('expense') || col.cleanName.includes('gider') || col.cleanName.includes('spend'))) {
        colMap.set('expense', col.name);
      }
      else if (!colMap.has('tax') && (col.cleanName.includes('tax') || col.cleanName.includes('vergi'))) {
        colMap.set('tax', col.name);
      }
      else if (!colMap.has('discount') && (col.cleanName.includes('discount') || col.cleanName.includes('indirim'))) {
        colMap.set('discount', col.name);
      }
    }
  }

  // Variables for aggregation
  let sumRevenue = 0;
  let hasRevenue = false;
  let sumCost = 0;
  let hasCost = false;
  let sumQty = 0;
  let hasQty = false;
  let sumExpense = 0;
  let hasExpense = false;

  for (const row of rows) {
    // Determine row-level revenue
    let rowRevenue = 0;
    let rowRevValid = false;
    
    if (colMap.has('revenue')) {
      const v = extractNumeric(row[colMap.get('revenue')!]);
      if (v !== null) { rowRevenue = v; rowRevValid = true; }
    } else if (colMap.has('price') && colMap.has('quantity')) {
      const p = extractNumeric(row[colMap.get('price')!]);
      const q = extractNumeric(row[colMap.get('quantity')!]);
      if (p !== null && q !== null) { rowRevenue = p * q; rowRevValid = true; }
    }

    if (rowRevValid) {
      sumRevenue += rowRevenue;
      hasRevenue = true;
    }

    // Determine row-level cost
    let rowCost = 0;
    let rowCostValid = false;
    if (colMap.has('cost')) {
      const c = extractNumeric(row[colMap.get('cost')!]);
      if (c !== null) { rowCost = c; rowCostValid = true; }
    }
    
    if (rowCostValid) {
      sumCost += rowCost;
      hasCost = true;
    }

    // Determine row-level quantity
    if (colMap.has('quantity')) {
      const q = extractNumeric(row[colMap.get('quantity')!]);
      if (q !== null) {
        sumQty += q;
        hasQty = true;
      }
    }

    // Determine expenses
    if (colMap.has('expense')) {
      const e = extractNumeric(row[colMap.get('expense')!]);
      if (e !== null) {
        sumExpense += e;
        hasExpense = true;
      }
    }
  }

  // Assign deterministic totals
  if (hasRevenue) metrics.totalRevenue = sumRevenue;
  if (hasCost) metrics.totalCost = sumCost;
  if (hasQty) metrics.totalQuantity = sumQty;
  if (hasExpense) metrics.totalExpenses = sumExpense;

  // Derived calculations (ONLY if dependencies exist)
  if (hasRevenue && hasCost) {
    metrics.grossProfit = metrics.totalRevenue! - metrics.totalCost!;
    if (metrics.totalRevenue! !== 0) {
      metrics.grossMargin = (metrics.grossProfit / metrics.totalRevenue!) * 100;
    } else {
      metrics.grossMargin = 0;
    }
  }

  if (metrics.grossProfit !== null && hasExpense) {
    metrics.netProfit = metrics.grossProfit - metrics.totalExpenses!;
  }

  if (hasRevenue && metrics.totalTransactions > 0) {
    metrics.averageOrderValue = metrics.totalRevenue! / metrics.totalTransactions;
  }

  if (hasRevenue && hasQty && metrics.totalQuantity! > 0) {
    metrics.averageSellingPrice = metrics.totalRevenue! / metrics.totalQuantity!;
  }

  // Dimensions & Breakdowns
  const dimensions = schema.columns.filter(c => c.analyticalRole === 'dimension');
  for (const dim of dimensions) {
    const dimName = dim.name;
    const groups: Record<string, { rev: number; cost: number; qty: number; count: number }> = {};
    
    for (const row of rows) {
      const label = String(row[dimName] || 'Unknown').trim();
      if (!groups[label]) groups[label] = { rev: 0, cost: 0, qty: 0, count: 0 };
      
      groups[label].count++;

      let rowRev = 0;
      if (colMap.has('revenue')) {
         rowRev = extractNumeric(row[colMap.get('revenue')!]) || 0;
      } else if (colMap.has('price') && colMap.has('quantity')) {
         rowRev = (extractNumeric(row[colMap.get('price')!]) || 0) * (extractNumeric(row[colMap.get('quantity')!]) || 0);
      }
      
      const rowCost = colMap.has('cost') ? (extractNumeric(row[colMap.get('cost')!]) || 0) : 0;
      const rowQty = colMap.has('quantity') ? (extractNumeric(row[colMap.get('quantity')!]) || 0) : 0;

      groups[label].rev += rowRev;
      groups[label].cost += rowCost;
      groups[label].qty += rowQty;
    }

    const breakdownArray = Object.keys(groups).map(label => ({
      label,
      count: groups[label].count,
      revenue: hasRevenue ? groups[label].rev : null,
      profit: (hasRevenue && hasCost) ? (groups[label].rev - groups[label].cost) : null,
      quantity: hasQty ? groups[label].qty : null
    }));

    // Sort by revenue if exists, otherwise by count
    breakdownArray.sort((a, b) => {
      if (hasRevenue) return (b.revenue || 0) - (a.revenue || 0);
      return b.count - a.count;
    });

    breakdowns[dimName] = breakdownArray.slice(0, 50); // Keep top 50

    // Concentration Risk
    if (hasRevenue && breakdownArray.length > 0 && breakdownArray.length < rows.length * 0.5) {
      const top3Rev = breakdownArray.slice(0, 3).reduce((s, x) => s + (x.revenue || 0), 0);
      const concentrationPct = sumRevenue > 0 ? (top3Rev / sumRevenue) * 100 : 0;
      
      if (concentrationPct > 50) {
        concentrations.push({
          dimension: dimName,
          topCount: Math.min(3, breakdownArray.length),
          concentrationPercentage: concentrationPct,
          riskLevel: concentrationPct > 70 ? 'High' : 'Medium'
        });
      }
    }
  }

  // Record limitations for missing data
  if (!hasRevenue) limitations.push("Revenue could not be calculated. Missing revenue/price columns.");
  if (!hasCost) limitations.push("Cost/COGS data is missing. Profitability cannot be determined.");
  if (!hasQty) limitations.push("Quantity data is missing. Volume metrics cannot be determined.");

  return {
    metadata: {
      datasetType: schema.datasetType,
      dateCoverage: quality.dateCoverage,
      totalRows: rows.length
    },
    metrics,
    breakdowns,
    timeSeries,
    concentrations,
    anomalies,
    limitations: [...quality.limitations, ...limitations]
  };
}
