import 'dotenv/config';
import { parseFileBuffer } from '../src/lib/file-parser';
import { inferSemanticSchema } from '../src/lib/semantic-inference';
import { mapDynamicToLegacyRecords } from '../src/lib/schema-mapper';
import { calculateAnalytics } from '../src/lib/data-parser';

async function runTestScenario(name: string, content: string, mimeType: string, filename: string) {
  console.log(`\n--- Senaryo: ${name} ---`);
  try {
    const buffer = Buffer.from(content);
    // 1. Parse File
    const rawRows = await parseFileBuffer(buffer, mimeType, filename);
    if (rawRows.length === 0) throw new Error("Ayrıştırma başarısız, satır yok.");

    // 2. Schema Inference
    const schema = await inferSemanticSchema(rawRows);
    
    // 3. Mapper
    const legacyRecords = mapDynamicToLegacyRecords(rawRows, schema);

    // 4. Analytics
    const analytics = calculateAnalytics(legacyRecords);

    // Assertions / Verifications
    console.log(`✓ Parse başarılı (${rawRows.length} satır)`);
    console.log(`✓ Schema Inference başarılı (${schema.columns.length} kolon, tip: ${schema.datasetType})`);
    console.log(`✓ Mapper başarılı (id: ${legacyRecords[0].id})`);
    console.log(`✓ Analytics başarılı (Total Revenue: ${analytics.kpis.totalRevenue})`);
    
    if (Number.isNaN(analytics.kpis.totalRevenue) || Number.isNaN(analytics.kpis.totalQuantity)) {
      console.error(`X HATA: NaN değer üretildi!`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`X HATA: Senaryo '${name}' başarısız oldu.`, error);
    process.exit(1);
  }
}

async function runAll() {
  await runTestScenario(
    "1. Giyim CSV (ürün, kategori, adet, fiyat, maliyet)",
    "Ürün Adı,Kategori,Adet,Birim Fiyat,Maliyet,Tarih\nT-Shirt,Üst Giyim,10,150,50,2024-01-01\nKazak,Kışlık,5,300,100,2024-01-02",
    "text/csv",
    "giyim.csv"
  );

  await runTestScenario(
    "2. Teknoloji CSV (İngilizce kolonlar)",
    "Product Name,Category,Quantity,Price,Date\nLaptop,Computers,2,1500,2024-01-01\nMouse,Accessories,5,25,2024-01-02",
    "text/csv",
    "tech.csv"
  );

  await runTestScenario(
    "3. Restoran CSV (ürün yerine yemek/hizmet)",
    "Yemek,Kategori,Porsiyon,Tutar,Tarih\nİskender,Kebap,2,300,2024-01-01\nÇorba,Başlangıç,4,50,2024-01-02",
    "text/csv",
    "restoran.csv"
  );

  await runTestScenario(
    "4. Hizmet işletmesi (ürün adı ve kategori olmadan)",
    "Hizmet Kodu,Saat,Saatlik Ücret,Müşteri,Tarih\nHZ-001,5,1000,Ahmet Yılmaz,2024-01-01\nHZ-002,2,1500,Mehmet Kaya,2024-01-02",
    "text/csv",
    "hizmet.csv"
  );

  await runTestScenario(
    "5. Sadece tarih + ciro olan CSV",
    "Tarih,Günlük Ciro\n2024-01-01,5000\n2024-01-02,7500",
    "text/csv",
    "sadece_ciro.csv"
  );

  await runTestScenario(
    "6. Maliyet olmayan CSV",
    "Ürün,Fiyat,Adet,Tarih\nDefter,50,10,2024-01-01\nKalem,20,50,2024-01-02",
    "text/csv",
    "kirtasiye.csv"
  );

  await runTestScenario(
    "7. Noktalı virgül (;) CSV",
    "Urun;Adet;Ciro;Tarih\nElma;10;200;2024-01-01\nArmut;5;150;2024-01-02",
    "text/csv",
    "noktali_virgul.csv"
  );

  await runTestScenario(
    "8. Türkçe karakterli CSV",
    "Ürün Adı,Fiyat,Tarih\nŞişe Çay,25.50,2024-01-01\nÖzel İşlem,150.00,2024-01-02",
    "text/csv",
    "turkce.csv"
  );

  await runTestScenario(
    "10. Eksik/boş hücre içeren CSV",
    "Ürün Adı,Fiyat,Adet,Kategori,Tarih\nAyakkabı,,2,Giyim,2024-01-01\nÇorap,50,,Giyim,2024-01-02\n,100,1,,2024-01-03",
    "text/csv",
    "eksik.csv"
  );

  console.log("\nTÜM TESTLER BAŞARIYLA GEÇTİ!");
}

runAll().catch(console.error);
