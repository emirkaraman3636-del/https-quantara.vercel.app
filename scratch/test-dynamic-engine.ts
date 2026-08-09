import { inferSemanticSchema } from '../src/lib/semantic-inference';
import { analyzeDataQuality, calculateGenericMetrics } from '../src/lib/dynamic-aggregator';

// Test A - Sales
const testSales = [
  { Date: '2024-01-01', Product: 'Laptop', Category: 'Electronics', Quantity: 5, Price: 1000, Revenue: 5000 },
  { Date: '2024-01-02', Product: 'Mouse', Category: 'Electronics', Quantity: 10, Price: 50, Revenue: 500 },
];

// Test B - HR
const testHR = [
  { Employee: 'Ali', Department: 'IT', Position: 'Developer', Age: 30, Salary: 80000, HireDate: '2020-01-01' },
  { Employee: 'Veli', Department: 'HR', Position: 'Recruiter', Age: 35, Salary: 70000, HireDate: '2021-06-15' },
];

// Test C - Expense
const testExpense = [
  { Date: '2024-02-01', Department: 'Marketing', ExpenseType: 'Ads', Amount: 5000, Description: 'Google Ads' },
  { Date: '2024-02-05', Department: 'IT', ExpenseType: 'Software', Amount: 1200, Description: 'AWS Bill' },
];

// Test D - Inventory
const testInventory = [
  { SKU: 'ELEC-01', Product: 'Laptop', Category: 'Electronics', StockQuantity: 50, UnitCost: 800, Warehouse: 'Main' },
  { SKU: 'FURN-02', Product: 'Desk', Category: 'Furniture', StockQuantity: 120, UnitCost: 150, Warehouse: 'North' },
];

// Test E - Generic
const testGeneric = [
  { City: 'Istanbul', Population: 15000000, AverageIncome: 12000, Area: 5343 },
  { City: 'Ankara', Population: 5000000, AverageIncome: 13000, Area: 24521 },
];

// Test F & G - Unknown/AI Fallback
const testUnknown = [
  { ValueA: 'Alpha', ValueB: 'Beta', GroupX: 'X1', RecordDate: '2024-01-01', MetricZ: 105.5 },
  { ValueA: 'Gamma', ValueB: 'Delta', GroupX: 'X2', RecordDate: '2024-01-02', MetricZ: 210.0 },
];

async function runTests() {
  console.log("=== RUNNING PHASE 1 TESTS ===\n");

  const datasets = [
    { name: 'TEST A - SALES', data: testSales },
    { name: 'TEST B - HR', data: testHR },
    { name: 'TEST C - EXPENSE', data: testExpense },
    { name: 'TEST D - INVENTORY', data: testInventory },
    { name: 'TEST E - GENERIC', data: testGeneric },
    { name: 'TEST F - UNKNOWN', data: testUnknown }
  ];

  for (const ds of datasets) {
    console.log(`\n>>> ${ds.name} <<<`);
    try {
      const schema = await inferSemanticSchema(ds.data);
      console.log(`Classification: ${schema.datasetType} (Confidence: ${schema.classificationConfidence})`);
      
      const metricsCols = schema.columns.filter(c => c.analyticalRole === 'metric').map(c => `${c.name} (${c.semanticType}/${c.preferredAggregation})`);
      console.log(`Detected Metrics: ${metricsCols.join(', ')}`);
      
      const dimCols = schema.columns.filter(c => c.analyticalRole === 'dimension').map(c => c.name);
      console.log(`Detected Dimensions: ${dimCols.join(', ')}`);

      const quality = analyzeDataQuality(ds.data, schema);
      console.log(`Data Quality: ${quality.totalRows} rows, ${quality.duplicateRows} duplicates`);

      const metrics = calculateGenericMetrics(ds.data, schema);
      console.log(`Calculated KPIs:`, Object.keys(metrics.kpis));

    } catch (e: any) {
      console.error(`Error in ${ds.name}:`, e.message);
    }
  }
}

// Load env vars if needed
require('dotenv').config({ path: '../.env.local' });
runTests();
