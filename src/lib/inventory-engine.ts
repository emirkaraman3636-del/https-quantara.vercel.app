import { SalesRecord, AnalyticsSummary } from './types';
import { ForecastSummary } from './forecast-types';
import {
  InventorySummary,
  InventoryItem,
  ReorderItem,
  BusinessAlert,
  EnterpriseScores,
  StockStatus
} from './inventory-types';

/**
 * Enterprise Inventory Intelligence & Reorder Engine
 * Analyzes stock levels, demand velocity, and lead times to calculate ROP, business alerts, and health scores.
 */
export function generateInventoryIntelligence(
  records: SalesRecord[],
  analytics: AnalyticsSummary,
  forecastSummary: ForecastSummary,
  datasetName: string = 'Uploaded Dataset'
): InventorySummary {
  const { dailyTrends, kpis, productMetrics, categoryMetrics, sizeMetrics } = analytics;
  const daysSpanned = Math.max(1, dailyTrends.length || 1);

  if (!records || records.length === 0) {
    return generateEmptyInventorySummary(datasetName);
  }

  // --- 1. Compute Inventory Items Velocity & Days Remaining ---
  // Group by Product Name + Size
  const skuMap = new Map<string, {
    productName: string;
    category: string;
    size: string;
    currentStock: number;
    totalQtySold: number;
    revenue: number;
  }>();

  records.forEach(r => {
    const key = `${r.productName}__${r.size}`;
    if (!skuMap.has(key)) {
      skuMap.set(key, {
        productName: r.productName,
        category: r.category,
        size: r.size,
        currentStock: r.stock || 50,
        totalQtySold: 0,
        revenue: 0
      });
    }
    const item = skuMap.get(key)!;
    item.totalQtySold += r.quantity;
    item.revenue += r.revenue;
    item.currentStock = Math.max(item.currentStock, r.stock || 50);
  });

  const inventoryItems: InventoryItem[] = [];
  const reorderMatrix: ReorderItem[] = [];
  const alerts: BusinessAlert[] = [];

  const now = new Date();

  skuMap.forEach((data, key) => {
    const dailyVelocity = Math.max(0.1, Math.round((data.totalQtySold / daysSpanned) * 100) / 100);
    const daysOfStockRemaining = Math.round(data.currentStock / dailyVelocity);

    let stockStatus: StockStatus = 'optimal';
    let statusBadge: { text: string; color: 'emerald' | 'amber' | 'rose' | 'slate' } = { text: 'Optimal Stock', color: 'emerald' };
    let recommendation = `Maintain current stock buffer of ${data.currentStock} items.`;

    if (data.totalQtySold <= 1 && data.currentStock > 20) {
      stockStatus = 'dead_stock';
      statusBadge = { text: 'Dead Stock', color: 'slate' };
      recommendation = `Apply 25% discount or bundle to liquidate ${data.currentStock} idle items.`;
    } else if (daysOfStockRemaining < 14) {
      stockStatus = 'low_stock';
      statusBadge = { text: 'Low Stock Risk', color: 'rose' };
      recommendation = `Run-out expected in ${daysOfStockRemaining} days! Reorder immediately.`;
    } else if (daysOfStockRemaining > 60) {
      stockStatus = 'overstock';
      statusBadge = { text: 'Overstock Risk', color: 'amber' };
      recommendation = `Excess supply (${daysOfStockRemaining} days remaining). Pause replenishment.`;
    }

    const runOutDate = new Date(now);
    runOutDate.setDate(runOutDate.getDate() + daysOfStockRemaining);
    const estimatedRunOutDate = runOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const itemObj: InventoryItem = {
      id: `inv-${key}`,
      productName: data.productName,
      category: data.category,
      size: data.size,
      currentStock: data.currentStock,
      totalQuantitySold: data.totalQtySold,
      dailyVelocity,
      daysOfStockRemaining,
      stockStatus,
      estimatedRunOutDate,
      statusBadge,
      recommendation
    };

    inventoryItems.push(itemObj);

    // --- 2. Calculate Reorder Point (ROP) ---
    // ROP = (Lead Time [7 days] * Daily Velocity) + Safety Stock
    const leadTimeDays = 7;
    const safetyStock = Math.ceil(dailyVelocity * 5); // 5 days safety buffer
    const reorderPoint = Math.ceil(dailyVelocity * leadTimeDays + safetyStock);

    if (data.currentStock <= reorderPoint || daysOfStockRemaining < 14) {
      const recommendedReorderQty = Math.max(30, Math.ceil(dailyVelocity * 30 - data.currentStock));
      const priority: 'critical' | 'high' | 'medium' = daysOfStockRemaining < 7 ? 'critical' : daysOfStockRemaining < 14 ? 'high' : 'medium';

      const sugDate = new Date(now);
      sugDate.setDate(sugDate.getDate() + Math.max(1, daysOfStockRemaining - 5));

      reorderMatrix.push({
        id: `rop-${key}`,
        productName: data.productName,
        category: data.category,
        size: data.size,
        currentStock: data.currentStock,
        dailyDemandVelocity: dailyVelocity,
        leadTimeDays,
        safetyStock,
        reorderPoint,
        recommendedReorderQty,
        priority,
        suggestedReorderDate: sugDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
  });

  // Filter Subsets
  const lowStockItems = inventoryItems.filter(i => i.stockStatus === 'low_stock');
  const overstockItems = inventoryItems.filter(i => i.stockStatus === 'overstock');
  const deadStockItems = inventoryItems.filter(i => i.stockStatus === 'dead_stock');
  const fastMovingItems = [...inventoryItems].sort((a, b) => b.dailyVelocity - a.dailyVelocity).slice(0, 5);

  // Sort Reorder Matrix by priority
  reorderMatrix.sort((a, b) => {
    const pRank = { critical: 3, high: 2, medium: 1 };
    return pRank[b.priority] - pRank[a.priority];
  });

  // --- 3. Generate Business Alerts ---
  const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Alert 1: Low Stock / Run-Out Risks
  if (lowStockItems.length > 0) {
    const topLow = lowStockItems[0];
    alerts.push({
      id: 'alt-1',
      severity: 'critical',
      category: 'inventory',
      title: `Critical Stock-Out Risk: ${topLow.productName} (${topLow.size})`,
      message: `Stock level (${topLow.currentStock} items) will run out in approximately ${topLow.daysOfStockRemaining} days based on daily velocity of ${topLow.dailyVelocity} units/day.`,
      impactMetric: `${topLow.daysOfStockRemaining} Days Remaining`,
      recommendedAction: `Place reorder for ${topLow.productName} (Size ${topLow.size}) immediately.`,
      timestamp: timeStr,
      affectedItem: topLow.productName
    });
  }

  // Alert 2: Sizing Demand Imbalance
  if (analytics.mostSoldSize) {
    const sz = analytics.mostSoldSize;
    alerts.push({
      id: 'alt-2',
      severity: sz.percentage > 35 ? 'critical' : 'warning',
      category: 'inventory',
      title: `High Apparel Sizing Concentration: Size ${sz.size}`,
      message: `Size ${sz.size} represents ${sz.percentage}% of overall customer volume. Supply chain re-ordering must prioritize Size ${sz.size} stock buffers.`,
      impactMetric: `${sz.percentage}% Demand Share`,
      recommendedAction: `Increase inventory allocation for Size ${sz.size} by 25%.`,
      timestamp: timeStr,
      affectedItem: `Size ${sz.size}`
    });
  }

  // Alert 3: Category Movement Alert
  const decliningCat = forecastSummary.categoryForecasts.find(c => c.status === 'declining');
  if (decliningCat) {
    alerts.push({
      id: 'alt-3',
      severity: 'warning',
      category: 'category',
      title: `Category Revenue Contraction: ${decliningCat.category}`,
      message: `Projected 30-day demand for ${decliningCat.category} is down ${decliningCat.growthRate}% compared to historical baselines.`,
      impactMetric: `${decliningCat.growthRate}% Growth`,
      recommendedAction: `Launch a targeted promotional campaign for ${decliningCat.category}.`,
      timestamp: timeStr,
      affectedItem: decliningCat.category
    });
  }

  // Alert 4: Seasonal Spike Warning
  if (forecastSummary.seasonality.detected) {
    alerts.push({
      id: 'alt-4',
      severity: 'info',
      category: 'forecast',
      title: `Weekly Demand Spike Expected on ${forecastSummary.seasonality.peakDayOfWeek}s`,
      message: forecastSummary.seasonality.description,
      impactMetric: `${forecastSummary.seasonality.weekendVsWeekdayRatio}x Weekend Velocity`,
      recommendedAction: 'Align marketing emails and fulfillment operations ahead of peak days.',
      timestamp: timeStr
    });
  }

  // Alert 5: Key Customer Dependency Risk
  const topCustPct = analytics.kpis.totalRevenue > 0 ? (records.filter(r => r.customerName === records[0]?.customerName).reduce((a, b) => a + b.revenue, 0) / analytics.kpis.totalRevenue) * 100 : 0;
  if (topCustPct > 25) {
    alerts.push({
      id: 'alt-5',
      severity: 'warning',
      category: 'customer',
      title: 'Customer Account Dependency Risk',
      message: `Top customer accounts represent over ${topCustPct.toFixed(1)}% of total revenue.`,
      impactMetric: `${topCustPct.toFixed(1)}% Concentration`,
      recommendedAction: 'Acquire mid-tier accounts to diversify revenue exposure.',
      timestamp: timeStr
    });
  }

  // --- 4. Calculate Enterprise Scores ---
  const lowRatio = inventoryItems.length > 0 ? lowStockItems.length / inventoryItems.length : 0;
  const overRatio = inventoryItems.length > 0 ? overstockItems.length / inventoryItems.length : 0;

  const inventoryHealthScore = Math.max(35, Math.min(98, Math.round(100 - lowRatio * 45 - overRatio * 25)));
  const riskScore = Math.min(95, Math.max(10, Math.round(lowRatio * 50 + (topCustPct > 25 ? 25 : 10))));

  const totalCoverageDaysSum = inventoryItems.reduce((a, b) => a + b.daysOfStockRemaining, 0);
  const stockCoverageDays = inventoryItems.length > 0 ? Math.round(totalCoverageDaysSum / inventoryItems.length) : 45;

  const scores: EnterpriseScores = {
    inventoryHealthScore,
    businessHealthScore: forecastSummary.sufficiency.confidenceScore,
    riskScore,
    forecastConfidence: forecastSummary.sufficiency.confidenceScore,
    stockCoverageDays,
    totalLowStockSKUs: lowStockItems.length,
    totalOverstockSKUs: overstockItems.length,
    totalReordersNeeded: reorderMatrix.length
  };

  return {
    datasetName,
    scores,
    inventoryItems,
    reorderMatrix,
    alerts,
    lowStockItems,
    overstockItems,
    deadStockItems,
    fastMovingItems
  };
}

function generateEmptyInventorySummary(datasetName: string): InventorySummary {
  return {
    datasetName,
    scores: {
      inventoryHealthScore: 0,
      businessHealthScore: 0,
      riskScore: 0,
      forecastConfidence: 0,
      stockCoverageDays: 0,
      totalLowStockSKUs: 0,
      totalOverstockSKUs: 0,
      totalReordersNeeded: 0
    },
    inventoryItems: [],
    reorderMatrix: [],
    alerts: [],
    lowStockItems: [],
    overstockItems: [],
    deadStockItems: [],
    fastMovingItems: []
  };
}
