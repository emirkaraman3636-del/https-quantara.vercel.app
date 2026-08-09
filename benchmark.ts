import fs from 'fs';
import { parse } from 'papaparse';
import { inferSemanticSchema } from './src/lib/semantic-inference';
import { calculateGenericMetrics, analyzeDataQuality } from './src/lib/dynamic-aggregator';
import { performance } from 'perf_hooks';

// Simulate rows
function generateRows(count: number) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    rows.push({
      Product: `Item_${i % 100}`,
      Category: `Cat_${i % 5}`,
      Date: new Date(Date.now() - Math.random() * 1e10).toISOString().split('T')[0],
      Quantity: Math.floor(Math.random() * 100),
      UnitPrice: (Math.random() * 100).toFixed(2),
      Revenue: (Math.random() * 10000).toFixed(2)
    });
  }
  return rows;
}

async function runBenchmark(size: number) {
  console.log(`\n--- BENCHMARK: ${size} rows ---`);
  
  // Generation (Not counted)
  const rows = generateRows(size);
  const csvStr = Object.keys(rows[0]).join(',') + '\n' + rows.map(r => Object.values(r).join(',')).join('\n');
  
  // Parse
  let start = performance.now();
  const parsed = parse(csvStr, { header: true, dynamicTyping: false });
  const rawRows = parsed.data as Record<string, unknown>[];
  let parseTime = performance.now() - start;
  console.log(`Parse Time: ${parseTime.toFixed(2)} ms`);

  // Semantic Inference
  start = performance.now();
  const schema = await inferSemanticSchema(rawRows);
  let inferenceTime = performance.now() - start;
  console.log(`Inference Time: ${inferenceTime.toFixed(2)} ms`);

  // Quality
  start = performance.now();
  const quality = analyzeDataQuality(rawRows, schema);
  let qualityTime = performance.now() - start;
  console.log(`Quality Time: ${qualityTime.toFixed(2)} ms`);

  // Aggregation
  start = performance.now();
  const metrics = calculateGenericMetrics(rawRows, schema);
  let aggTime = performance.now() - start;
  console.log(`Aggregation Time: ${aggTime.toFixed(2)} ms`);

  const total = parseTime + inferenceTime + qualityTime + aggTime;
  console.log(`Total Time: ${total.toFixed(2)} ms`);
}

async function main() {
  await runBenchmark(10000);
  await runBenchmark(50000);
  await runBenchmark(100000);
}

main().catch(console.error);
