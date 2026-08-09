import { parseNumber, parseDateString } from '../src/lib/data-parser';
import { calculateGenericMetrics } from '../src/lib/dynamic-aggregator';
import { inferSemanticSchema } from '../src/lib/semantic-inference';

async function runAudit() {
  console.log("=== LOCALIZATION TESTS ===");
  const testNums = [
    { in: '1.250,50', exp: 1250.50 },
    { in: '1250.50', exp: 1250.50 },
    { in: '1,250.50', exp: 1250.50 },
    { in: '₺1.250,50', exp: 1250.50 },
    { in: '$1,250.00', exp: 1250.00 },
    { in: '25%', exp: 25 },
  ];
  for (const t of testNums) {
    console.log(`parseNumber('${t.in}') = ${parseNumber(t.in)} | Expected: ${t.exp}`);
  }

  console.log("\n=== DATE TESTS ===");
  const testDates = [
    { in: '2026-01-15', desc: 'ISO' },
    { in: '15.01.2026', desc: 'Turkish dot' },
    { in: '15/01/2026', desc: 'Turkish slash' },
    { in: '01/15/2026', desc: 'US slash (unambiguous)' },
    { in: '01/02/2026', desc: 'Ambiguous slash' },
    { in: 45000, desc: 'Excel Serial (approx 2023)' },
    { in: 'Invalid Date Text', desc: 'Invalid string' },
  ];
  for (const t of testDates) {
    console.log(`parseDateString('${t.in}') = ${parseDateString(t.in)} | Desc: ${t.desc}`);
  }

  console.log("\n=== SECURITY / DATA MUTATION TESTS ===");
  const rawData = [
    { id: 1, val: '<script>alert(1)</script>', amt: 50 },
    { id: 2, val: '=HYPERLINK(...)', amt: 100 },
    { id: 3, val: '{{ malicious prompt }}', amt: 150 }
  ];
  const origCopy = JSON.parse(JSON.stringify(rawData));
  const schema = await inferSemanticSchema(rawData);
  const agg = calculateGenericMetrics(rawData, schema);
  
  let mutated = false;
  for (let i = 0; i < rawData.length; i++) {
    if (JSON.stringify(rawData[i]) !== JSON.stringify(origCopy[i])) {
      mutated = true;
    }
  }
  console.log(`Data Mutated? ${mutated}`);
  console.log(`Security values passed through? Yes. They remain ordinary strings. First val: ${rawData[0].val}`);

  console.log("\n=== MATH TESTS ===");
  const mathData = [
    { cat: 'A', date: '2026-01-01', val: 10 },
    { cat: 'A', date: '2026-01-01', val: 20 },
    { cat: 'B', date: '2026-01-02', val: 100 },
    { cat: 'B', date: '2026-01-02', val: 50 },
    { cat: 'B', date: '2026-01-03', val: 10 }
  ];
  const mathSchema = await inferSemanticSchema(mathData);
  const mathMet = calculateGenericMetrics(mathData, mathSchema);
  console.log(`SUM (val): ${(mathMet.kpis as any)['val']?.sum} | Expected: 190`);
  // Top N
  console.log(`Group By A sum: ${(mathMet.breakdowns as any)['val_by_cat']?.find((m:any) => m.label === 'A')?.value} | Expected: 30`);
  console.log(`Group By B sum: ${(mathMet.breakdowns as any)['val_by_cat']?.find((m:any) => m.label === 'B')?.value} | Expected: 160`);


  console.log("\n=== PERFORMANCE TESTS ===");
  async function testPerf(rowsCount: number) {
    const data = [];
    for (let i = 0; i < rowsCount; i++) {
      data.push({ id: i, revenue: Math.random() * 1000, category: i % 2 === 0 ? 'A' : 'B', date: '2026-01-01' });
    }
    const t0 = performance.now();
    const infSchema = await inferSemanticSchema(data);
    const t1 = performance.now();
    calculateGenericMetrics(data, infSchema);
    const t3 = performance.now();
    console.log(`[${rowsCount} rows] Total: ${(t3 - t0).toFixed(2)}ms | Inference: ${(t1 - t0).toFixed(2)}ms | Aggregation: ${(t3 - t1).toFixed(2)}ms`);
  }
  await testPerf(10000);
  await testPerf(50000);
  await testPerf(100000);
  await testPerf(250000);
  await testPerf(500000);
}

runAudit().catch(console.error);
