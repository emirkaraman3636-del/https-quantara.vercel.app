import { AnalyticsSummary } from './types';

export interface CrossDatasetComparison {
  revenueGrowth: number;
  orderVolumeGrowth: number;
  newTopProducts: string[];
  decliningProducts: string[];
  comparativeInsight: string;
}

export function compareDatasets(
  current: AnalyticsSummary,
  previous: AnalyticsSummary
): CrossDatasetComparison {
  
  const currentRev = current.kpis.totalRevenue;
  const previousRev = previous.kpis.totalRevenue;
  const revenueGrowth = previousRev > 0 ? ((currentRev - previousRev) / previousRev) * 100 : 100;

  const currentVol = current.kpis.totalOrders;
  const previousVol = previous.kpis.totalOrders;
  const orderVolumeGrowth = previousVol > 0 ? ((currentVol - previousVol) / previousVol) * 100 : 100;

  const currentTop = current.productMetrics.slice(0, 5).map(p => p.name);
  const previousTop = previous.productMetrics.slice(0, 5).map(p => p.name);

  const newTopProducts = currentTop.filter(p => !previousTop.includes(p));
  const decliningProducts = previousTop.filter(p => !currentTop.includes(p));

  let insight = '';
  if (revenueGrowth > 5) {
    insight = `Satış gelirleri önceki döneme göre %${revenueGrowth.toFixed(1)} artış gösterdi. Sipariş hacmi ise %${orderVolumeGrowth.toFixed(1)} değişti. ${newTopProducts.length > 0 ? `Büyümeye özellikle "${newTopProducts.join(', ')}" ürünleri öncülük etti.` : ''}`;
  } else if (revenueGrowth < -5) {
    insight = `Satış gelirleri önceki döneme göre %${Math.abs(revenueGrowth).toFixed(1)} düşüş gösterdi. "${decliningProducts.join(', ')}" gibi eski çok satan ürünlerin ivme kaybetmesi bu duruma neden olmuş olabilir.`;
  } else {
    insight = `Satış gelirleri önceki döneme kıyasla stabil kaldı (Değişim: %${revenueGrowth.toFixed(1)}).`;
  }

  return {
    revenueGrowth,
    orderVolumeGrowth,
    newTopProducts,
    decliningProducts,
    comparativeInsight: insight
  };
}
