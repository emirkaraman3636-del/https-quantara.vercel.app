import { SalesRecord } from './types';
import { DatasetSchema, SemanticColumn } from './dynamic-types';
import { parseNumber, parseDateString } from './data-parser'; // Assuming these are exported

export function mapDynamicToLegacyRecords(
  rawRows: Record<string, unknown>[],
  schema: DatasetSchema
): SalesRecord[] {
  // Find candidates for mapping
  const metrics = schema.columns.filter(c => c.analyticalRole === 'metric');
  const dimensions = schema.columns.filter(c => c.analyticalRole === 'dimension');
  const temporal = schema.columns.filter(c => c.analyticalRole === 'temporal');
  
  // Sort by priority
  const sortedMetrics = [...metrics].sort((a, b) => a.displayPriority - b.displayPriority);
  const sortedDimensions = [...dimensions].sort((a, b) => a.displayPriority - b.displayPriority);
  
  // Identify key columns
  const dateCol = temporal.length > 0 ? temporal[0] : null;
  
  const quantityCol = sortedMetrics.find(c => c.semanticType === 'quantity' || c.cleanName.includes('adet') || c.cleanName.includes('qty')) || 
                      sortedMetrics.find(c => c.semanticType === 'number');
                      
  const currencyCols = sortedMetrics.filter(c => c.semanticType === 'currency');
  const revenueCol = currencyCols.find(c => c.cleanName.includes('ciro') || c.cleanName.includes('revenue') || c.cleanName.includes('satis') || c.cleanName.includes('toplam')) || currencyCols[0];
  const priceCol = currencyCols.find(c => c !== revenueCol && (c.cleanName.includes('fiyat') || c.cleanName.includes('price') || c.cleanName.includes('birim'))) || null;
  const stockCol = sortedMetrics.find(c => c.cleanName.includes('stok') || c.cleanName.includes('stock')) || null;

  const productCol = sortedDimensions.find(c => c.cleanName.includes('urun') || c.cleanName.includes('product') || c.cleanName.includes('item') || c.cleanName.includes('name')) || sortedDimensions[0] || null;
  const categoryCol = sortedDimensions.find(c => c !== productCol && (c.cleanName.includes('kategori') || c.cleanName.includes('category') || c.cleanName.includes('tur'))) || sortedDimensions.find(c => c !== productCol) || null;
  const customerCol = sortedDimensions.find(c => c !== productCol && c !== categoryCol && (c.cleanName.includes('musteri') || c.cleanName.includes('customer') || c.cleanName.includes('cari'))) || null;
  const sizeCol = sortedDimensions.find(c => c.cleanName.includes('beden') || c.cleanName.includes('size') || c.cleanName.includes('boyut') || c.cleanName.includes('ebat')) || null;

  return rawRows.map((row, idx) => {
    // Extract with safe fallbacks
    const rawProd = productCol && row[productCol.name] ? String(row[productCol.name]) : 'Bilinmeyen Ürün';
    const rawCat = categoryCol && row[categoryCol.name] ? String(row[categoryCol.name]) : 'Genel Kategori';
    const rawCust = customerCol && row[customerCol.name] ? String(row[customerCol.name]) : 'Bilinmeyen Müşteri';
    const rawDate = dateCol && row[dateCol.name] ? String(row[dateCol.name]) : new Date().toISOString().split('T')[0];
    const rawSize = sizeCol && row[sizeCol.name] ? String(row[sizeCol.name]) : 'N/A';
    
    const qty = quantityCol ? parseNumber(row[quantityCol.name], 1) : 1;
    let rev = revenueCol ? parseNumber(row[revenueCol.name], 0) : 0;
    let price = priceCol ? parseNumber(row[priceCol.name], 0) : 0;
    const stock = stockCol ? parseNumber(row[stockCol.name], 0) : 0;

    // Derive missing financials if possible
    if (rev === 0 && price > 0 && qty > 0) rev = price * qty;
    if (price === 0 && rev > 0 && qty > 0) price = rev / qty;

    return {
      id: `REC-${(idx + 1).toString().padStart(4, '0')}`,
      productName: rawProd.trim(),
      category: rawCat.trim(),
      customerName: rawCust.trim(),
      date: parseDateString(rawDate),
      quantity: Math.max(0, qty), // No negative quantities
      price: Math.max(0, price),
      revenue: Math.max(0, rev),
      size: rawSize.trim() || 'N/A',
      stock: Math.max(0, stock),
      ...row // Append all original raw keys
    };
  });
}
