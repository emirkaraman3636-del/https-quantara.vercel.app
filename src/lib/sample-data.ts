import { SalesRecord } from './types';

export const INITIAL_SAMPLE_RECORDS: SalesRecord[] = [
  { id: 'REC-001', productName: 'Slim Fit Denim Jacket', category: 'Outerwear', customerName: 'Apex Fashion', date: '2026-07-01', quantity: 45, price: 120, revenue: 5400, size: 'M', stock: 120 },
  { id: 'REC-002', productName: 'Classic Cotton T-Shirt', category: 'Tops', customerName: 'Urban Wear Co.', date: '2026-07-02', quantity: 150, price: 25, revenue: 3750, size: 'L', stock: 450 },
  { id: 'REC-003', productName: 'Classic Cotton T-Shirt', category: 'Tops', customerName: 'Metro Styles', date: '2026-07-03', quantity: 220, price: 25, revenue: 5500, size: 'M', stock: 450 },
  { id: 'REC-004', productName: 'Oversized Hoodie', category: 'Outerwear', customerName: 'Nordic Outfitters', date: '2026-07-04', quantity: 80, price: 75, revenue: 6000, size: 'L', stock: 95 },
  { id: 'REC-005', productName: 'Oversized Hoodie', category: 'Outerwear', customerName: 'Apex Fashion', date: '2026-07-05', quantity: 110, price: 75, revenue: 8250, size: 'XL', stock: 95 },
  { id: 'REC-006', productName: 'Tailored Linen Trousers', category: 'Bottoms', customerName: 'Elegance Retail', date: '2026-07-06', quantity: 60, price: 95, revenue: 5700, size: 'M', stock: 80 },
  { id: 'REC-007', productName: 'Athletic Jogger Pants', category: 'Bottoms', customerName: 'Active Life Store', date: '2026-07-07', quantity: 130, price: 55, revenue: 7150, size: 'S', stock: 210 },
  { id: 'REC-008', productName: 'Athletic Jogger Pants', category: 'Bottoms', customerName: 'Urban Wear Co.', date: '2026-07-08', quantity: 95, price: 55, revenue: 5225, size: 'M', stock: 210 },
  { id: 'REC-009', productName: 'Silk Patterned Scarf', category: 'Accessories', customerName: 'Boutique Luxe', date: '2026-07-09', quantity: 35, price: 40, revenue: 1400, size: 'S', stock: 60 },
  { id: 'REC-010', productName: 'Merino Wool Sweater', category: 'Outerwear', customerName: 'Nordic Outfitters', date: '2026-07-10', quantity: 50, price: 110, revenue: 5500, size: 'L', stock: 75 },
  { id: 'REC-011', productName: 'Slim Fit Denim Jacket', category: 'Outerwear', customerName: 'Metro Styles', date: '2026-07-11', quantity: 30, price: 120, revenue: 3600, size: 'L', stock: 120 },
  { id: 'REC-012', productName: 'Classic Cotton T-Shirt', category: 'Tops', customerName: 'Apex Fashion', date: '2026-07-12', quantity: 180, price: 25, revenue: 4500, size: 'S', stock: 450 },
  { id: 'REC-013', productName: 'Graphic Print Hoodie', category: 'Tops', customerName: 'Streetwise Apparel', date: '2026-07-13', quantity: 90, price: 65, revenue: 5850, size: 'M', stock: 140 },
  { id: 'REC-014', productName: 'Graphic Print Hoodie', category: 'Tops', customerName: 'Urban Wear Co.', date: '2026-07-14', quantity: 70, price: 65, revenue: 4550, size: 'L', stock: 140 },
  { id: 'REC-015', productName: 'Tailored Linen Trousers', category: 'Bottoms', customerName: 'Elegance Retail', date: '2026-07-15', quantity: 45, price: 95, revenue: 4275, size: 'L', stock: 80 },
  { id: 'REC-016', productName: 'Leather Biker Gloves', category: 'Accessories', customerName: 'Rider Depot', date: '2026-07-16', quantity: 20, price: 50, revenue: 1000, size: 'M', stock: 40 },
  { id: 'REC-017', productName: 'Waterproof Trench Coat', category: 'Outerwear', customerName: 'Boutique Luxe', date: '2026-07-17', quantity: 25, price: 210, revenue: 5250, size: 'M', stock: 35 },
  { id: 'REC-018', productName: 'Waterproof Trench Coat', category: 'Outerwear', customerName: 'Apex Fashion', date: '2026-07-18', quantity: 40, price: 210, revenue: 8400, size: 'L', stock: 35 },
  { id: 'REC-019', productName: 'Classic Polo Shirt', category: 'Tops', customerName: 'Golf & Country Club', date: '2026-07-19', quantity: 120, price: 45, revenue: 5400, size: 'M', stock: 300 },
  { id: 'REC-020', productName: 'Classic Polo Shirt', category: 'Tops', customerName: 'Metro Styles', date: '2026-07-20', quantity: 140, price: 45, revenue: 6300, size: 'L', stock: 300 },
  { id: 'REC-021', productName: 'Chino Shorts', category: 'Bottoms', customerName: 'Summer Vibes', date: '2026-07-21', quantity: 110, price: 40, revenue: 4400, size: 'M', stock: 180 },
  { id: 'REC-022', productName: 'Chino Shorts', category: 'Bottoms', customerName: 'Urban Wear Co.', date: '2026-07-22', quantity: 85, price: 40, revenue: 3400, size: 'S', stock: 180 },
  { id: 'REC-023', productName: 'Merino Wool Sweater', category: 'Outerwear', customerName: 'Apex Fashion', date: '2026-07-23', quantity: 65, price: 110, revenue: 7150, size: 'M', stock: 75 },
  { id: 'REC-024', productName: 'Canvas Belt', category: 'Accessories', customerName: 'Metro Styles', date: '2026-07-24', quantity: 50, price: 20, revenue: 1000, size: 'S', stock: 250 },
  { id: 'REC-025', productName: 'Classic Cotton T-Shirt', category: 'Tops', customerName: 'Active Life Store', date: '2026-07-25', quantity: 260, price: 25, revenue: 6500, size: 'M', stock: 450 },
  { id: 'REC-026', productName: 'Slim Fit Denim Jacket', category: 'Outerwear', customerName: 'Boutique Luxe', date: '2026-07-26', quantity: 55, price: 120, revenue: 6600, size: 'XL', stock: 120 },
  { id: 'REC-027', productName: 'Tailored Linen Trousers', category: 'Bottoms', customerName: 'Nordic Outfitters', date: '2026-07-27', quantity: 70, price: 95, revenue: 6650, size: 'XL', stock: 80 },
  { id: 'REC-028', productName: 'Oversized Hoodie', category: 'Outerwear', customerName: 'Streetwise Apparel', date: '2026-07-28', quantity: 100, price: 75, revenue: 7500, size: 'M', stock: 95 },
  { id: 'REC-029', productName: 'Athletic Jogger Pants', category: 'Bottoms', customerName: 'Metro Styles', date: '2026-07-29', quantity: 140, price: 55, revenue: 7700, size: 'L', stock: 210 },
  { id: 'REC-030', productName: 'Waterproof Trench Coat', category: 'Outerwear', customerName: 'Nordic Outfitters', date: '2026-07-30', quantity: 35, price: 210, revenue: 7350, size: 'M', stock: 35 }
];

export function generateSampleCSV(): string {
  const headers = ['Product Name', 'Category', 'Customer Name', 'Date', 'Quantity', 'Price', 'Revenue', 'Size', 'Stock'];
  const rows = INITIAL_SAMPLE_RECORDS.map(r => [
    `"${r.productName}"`,
    `"${r.category}"`,
    `"${r.customerName}"`,
    r.date,
    r.quantity,
    r.price,
    r.revenue,
    `"${r.size}"`,
    r.stock
  ].join(','));
  return [headers.join(','), ...rows].join('\n');
}

export function downloadSampleCSVFile(): void {
  const csvContent = generateSampleCSV();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'enterprise_sales_sample.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
