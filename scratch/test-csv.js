const { validateAndParseRows, cleanHeader } = require('../src/lib/data-parser');
const Papa = require('papaparse');

// Sample Turkish CSV content with semicolon delimiter and Turkish headers
const sampleTurkishCSV = `\uFEFFÜrün Adı;Kategori;Miktar;Birim Fiyat;Tutar;Tarih;Müşteri
Mavi Slim Jeans;Giyim;15;450,00 TL;6750,00 TL;07.08.2026;Ahmet Yılmaz
Klasik Deri Ceket;Dış Giyim;4;1.200,50 TL;4802,00 TL;06.08.2026;Mehmet Kaya
Spor Ayakkabı;Ayakkabı;10;850,00 TL;8500,00 TL;05.08.2026;Ayşe Demir`;

console.log("=== TESTING TURKISH CSV PARSING ===");
const parsed = Papa.parse(sampleTurkishCSV, {
  header: true,
  delimiter: ';',
  skipEmptyLines: 'greedy',
  dynamicTyping: true,
  transformHeader: (h) => h.trim().replace(/^\uFEFF/, '')
});

console.log("Parsed Raw Rows Count:", parsed.data.length);
console.log("Raw Row Sample:", parsed.data[0]);

const { records, validation } = validateAndParseRows(parsed.data);

console.log("Validation isValid:", validation.isValid);
console.log("Records Length:", records.length);
console.log("First Parsed Record:", records[0]);

if (records.length === 3 && records[0].productName === 'Mavi Slim Jeans' && records[0].revenue === 6750) {
  console.log("✅ CSV PARSER TEST PASSED PERFECTLY!");
} else {
  console.error("❌ CSV PARSER TEST FAILED!");
  process.exit(1);
}
