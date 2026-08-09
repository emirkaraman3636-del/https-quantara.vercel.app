import { inferSemanticSchema } from '../src/lib/semantic-inference';
import { mapDynamicToLegacyRecords } from '../src/lib/schema-mapper';
import { calculateAnalytics } from '../src/lib/data-parser';

async function runTest() {
  const genericRows = [
    { "Kayıt ID": "A1", "Ciro": 150.50, "Puan": 4, "Tarih": "2024-01-01" },
    { "Kayıt ID": "A2", "Ciro": 300.00, "Puan": 5, "Tarih": "2024-01-02" },
    { "Kayıt ID": "A3", "Ciro": 50.00,  "Puan": 2, "Tarih": "2024-01-03" }
  ];

  console.log("1. Inferring dynamic schema for generic dataset (No Product Name, No Size, No Category)");
  const schema = await inferSemanticSchema(genericRows);
  console.log("Detected Columns:", schema.columns.map(c => c.name).join(', '));
  
  console.log("\n2. Mapping to legacy records...");
  const legacyRecords = mapDynamicToLegacyRecords(genericRows, schema);
  console.log("Mapped Records:", JSON.stringify(legacyRecords.slice(0, 2), null, 2));
  
  console.log("\n3. Testing legacy calculateAnalytics...");
  const analytics = calculateAnalytics(legacyRecords);
  console.log("Top Product (Fallback generated):", analytics.topProducts[0]?.name);
  console.log("Total Revenue (Mapped properly):", analytics.kpis.totalRevenue);
  
  console.log("\nTEST PASSED! No runtime crash.");
}

runTest().catch(console.error);
