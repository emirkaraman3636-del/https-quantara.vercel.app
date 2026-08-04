import { SalesRecord, AnalyticsSummary } from './types';
import {
  AIExecutiveSummary,
  AIFinding,
  AIRecommendation,
  AIRiskAlert,
  AIOpportunity
} from './ai-types';

/**
 * Dynamic AI Business Analytics Engine
 * Analyzes raw SalesRecords and AnalyticsSummary to generate a real-time, data-grounded AI Executive Summary.
 */
export function generateAIExecutiveSummary(
  records: SalesRecord[],
  analytics: AnalyticsSummary,
  datasetName: string = 'Uploaded Dataset'
): AIExecutiveSummary {
  const { kpis, productMetrics, categoryMetrics, sizeMetrics, dailyTrends } = analytics;

  if (!records || records.length === 0 || kpis.totalRevenue === 0) {
    return generateEmptyAISummary(datasetName);
  }

  // --- 1. Customer Analytics Computation ---
  const customerMap = new Map<string, { revenue: number; orders: number }>();
  records.forEach(r => {
    const cust = r.customerName || 'Standard Buyer';
    if (!customerMap.has(cust)) {
      customerMap.set(cust, { revenue: 0, orders: 0 });
    }
    const cData = customerMap.get(cust)!;
    cData.revenue += r.revenue;
    cData.orders += 1;
  });

  const customerList = Array.from(customerMap.entries())
    .map(([name, data]) => ({ name, revenue: data.revenue, orders: data.orders }))
    .sort((a, b) => b.revenue - a.revenue);

  const totalCustomers = customerList.length;
  const topCustomer = customerList[0] || { name: 'N/A', revenue: 0, orders: 0 };
  const topCustomerPct = kpis.totalRevenue > 0 ? Math.round((topCustomer.revenue / kpis.totalRevenue) * 1000) / 10 : 0;
  const avgSpendPerCust = totalCustomers > 0 ? Math.round((kpis.totalRevenue / totalCustomers) * 100) / 100 : 0;

  const customerConcentrationRisk: 'high' | 'medium' | 'low' =
    topCustomerPct > 35 ? 'high' : topCustomerPct > 20 ? 'medium' : 'low';

  // --- 2. Health Score Calculation (0 - 100) ---
  let healthScore = 75; // Baseline
  const topProductPct = productMetrics[0] ? (productMetrics[0].revenue / kpis.totalRevenue) * 100 : 0;

  // Deduct score if revenue is overly concentrated in 1 product (>35%)
  if (topProductPct > 35) healthScore -= 12;
  // Deduct score if top customer > 30%
  if (topCustomerPct > 30) healthScore -= 10;
  // Add score if average order value > $100
  if (kpis.averageOrderValue > 100) healthScore += 10;
  // Add score if multiple categories (>3) exist
  if (categoryMetrics.length >= 3) healthScore += 8;

  healthScore = Math.max(35, Math.min(98, Math.round(healthScore)));

  // --- 3. Dynamic Narrative Overview ---
  const topProdName = kpis.bestSellingProduct.name;
  const topProdRev = `$${kpis.bestSellingProduct.revenue.toLocaleString()}`;
  const topCatName = categoryMetrics[0] ? categoryMetrics[0].category : 'General';
  const topCatPct = categoryMetrics[0] ? categoryMetrics[0].percentage : 0;
  const mostSoldSz = analytics.mostSoldSize ? analytics.mostSoldSize.size : 'M';
  const mostSoldSzPct = analytics.mostSoldSize ? analytics.mostSoldSize.percentage : 0;

  const executiveOverview =
    `Across ${records.length} analyzed transactions, total gross revenue reached $${kpis.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })} ` +
    `with an Average Order Value (AOV) of $${kpis.averageOrderValue.toFixed(2)}. ` +
    `Sales performance is primarily anchored by "${topProdName}" generating ${topProdRev} in revenue. ` +
    `The dominant category is "${topCatName}" controlling ${topCatPct}% of overall sales. ` +
    `In terms of apparel sizing, Size ${mostSoldSz} represents the highest customer demand at ${mostSoldSzPct}% of overall volume, requiring targeted inventory replenishment.`;

  // --- 4. Dynamic Key Findings ---
  const keyFindings: AIFinding[] = [];

  // Finding 1: Revenue Velocity & Concentration
  keyFindings.push({
    id: 'find-1',
    category: 'revenue',
    title: 'Revenue Distribution & Concentration',
    description: `The top 2 performing products account for ${(topProductPct + (productMetrics[1] ? (productMetrics[1].revenue / kpis.totalRevenue) * 100 : 0)).toFixed(1)}% of total revenue.`,
    impact: topProductPct > 30 ? 'high' : 'medium',
    type: topProductPct > 40 ? 'neutral' : 'positive',
    metricValue: `$${kpis.totalRevenue.toLocaleString()}`
  });

  // Finding 2: Sizing Demand Imbalance
  if (analytics.mostSoldSize) {
    keyFindings.push({
      id: 'find-2',
      category: 'size',
      title: `Apparel Sizing Shift: Size ${mostSoldSz} Dominance`,
      description: `Size ${mostSoldSz} accounts for ${analytics.mostSoldSize.quantity} units (${mostSoldSzPct}% of all items sold), outperforming Size ${analytics.leastSoldSize?.size || 'S'} by ${Math.round(analytics.mostSoldSize.quantity / (analytics.leastSoldSize?.quantity || 1))}x.`,
      impact: 'high',
      type: 'positive',
      metricValue: `${mostSoldSzPct}% Volume`
    });
  }

  // Finding 3: Lowest Performing SKU Lag
  if (kpis.lowestSellingProduct.name !== 'N/A') {
    keyFindings.push({
      id: 'find-3',
      category: 'product',
      title: 'Underperforming SKU Identification',
      description: `"${kpis.lowestSellingProduct.name}" generated only $${kpis.lowestSellingProduct.revenue.toLocaleString()} (${kpis.lowestSellingProduct.quantity} units), indicating low customer traction or pricing misalignment.`,
      impact: 'medium',
      type: 'negative',
      metricValue: `$${kpis.lowestSellingProduct.revenue.toLocaleString()}`
    });
  }

  // Finding 4: Customer Account Leadership
  if (topCustomer.name !== 'N/A') {
    keyFindings.push({
      id: 'find-4',
      category: 'customer',
      title: `Key Account Leadership: ${topCustomer.name}`,
      description: `${topCustomer.name} is the top purchasing entity, contributing $${topCustomer.revenue.toLocaleString()} across ${topCustomer.orders} orders (${topCustomerPct}% of total dataset revenue).`,
      impact: topCustomerPct > 25 ? 'high' : 'medium',
      type: 'positive',
      metricValue: `${topCustomerPct}% Revenue`
    });
  }

  // --- 5. Strategic Action Recommendations ---
  const recommendations: AIRecommendation[] = [];

  // Rec 1: Sizing Allocation
  if (analytics.mostSoldSize) {
    recommendations.push({
      id: 'rec-1',
      title: `Optimize Inventory Ratio for Size ${mostSoldSz}`,
      action: `Increase stock buffer for Size ${mostSoldSz} by 25-30% to prevent stock-outs, while reducing re-order volumes for low-velocity sizes like ${analytics.leastSoldSize?.size || 'XS'}.`,
      priority: 'high',
      targetArea: 'Inventory & Operations',
      expectedOutcome: '12-18% reduction in stock-out revenue loss'
    });
  }

  // Rec 2: Low-Performance Product Campaign or Bundling
  if (kpis.lowestSellingProduct.name !== 'N/A') {
    recommendations.push({
      id: 'rec-2',
      title: `Promotional Repositioning for ${kpis.lowestSellingProduct.name}`,
      action: `Bundle "${kpis.lowestSellingProduct.name}" with top seller "${topProdName}" at a 15% discount, or launch a targeted category campaign for ${categoryMetrics[categoryMetrics.length - 1]?.category || 'Accessories'}.`,
      priority: 'medium',
      targetArea: 'Merchandising & Marketing',
      expectedOutcome: 'Accelerate slow-moving inventory velocity by 40%'
    });
  }

  // Rec 3: AOV & Cross-Selling
  recommendations.push({
    id: 'rec-3',
    title: 'High-Value Order Expansion',
    action: `Introduce tiered free-shipping thresholds at $${Math.round(kpis.averageOrderValue * 1.25)} to elevate Average Order Value from $${kpis.averageOrderValue.toFixed(2)}.`,
    priority: 'medium',
    targetArea: 'Sales Strategy',
    expectedOutcome: 'Elevate average order value by 15-20%'
  });

  // --- 6. Risk Alerts ---
  const riskAlerts: AIRiskAlert[] = [];

  // Risk 1: Stock vs Demand Imbalance
  if (analytics.mostSoldSize && analytics.mostSoldSize.stockAvailable < analytics.mostSoldSize.quantity * 0.5) {
    riskAlerts.push({
      id: 'risk-1',
      title: `Imminent Stock Out Alert: Size ${mostSoldSz}`,
      severity: 'high',
      riskDescription: `Available stock for Size ${mostSoldSz} (${analytics.mostSoldSize.stockAvailable} units) is dangerously low compared to recent demand (${analytics.mostSoldSize.quantity} units sold).`,
      mitigationStrategy: 'Issue emergency purchase order to supplier immediately.',
      affectedItem: `Size ${mostSoldSz} Apparel`
    });
  } else {
    riskAlerts.push({
      id: 'risk-1',
      title: 'Single-Product Revenue Exposure Risk',
      severity: topProductPct > 35 ? 'high' : 'medium',
      riskDescription: `Product "${topProdName}" represents ${topProductPct.toFixed(1)}% of total revenue. Over-reliance on a single hero product exposes revenue to supply chain disruptions.`,
      mitigationStrategy: 'Diversify marketing focus across secondary categories.',
      affectedItem: topProdName
    });
  }

  // Risk 2: Customer Concentration Alert
  if (customerConcentrationRisk === 'high') {
    riskAlerts.push({
      id: 'risk-2',
      title: `High Key-Account Dependency Risk (${topCustomer.name})`,
      severity: 'high',
      riskDescription: `${topCustomer.name} generates ${topCustomerPct}% of total revenue. Losing this single client would significantly impair cash flow.`,
      mitigationStrategy: 'Expand outbound sales to acquire mid-tier enterprise accounts.',
      affectedItem: topCustomer.name
    });
  }

  // --- 7. Business Opportunities ---
  const opportunities: AIOpportunity[] = [];

  const topCategory = categoryMetrics[0];
  if (topCategory) {
    opportunities.push({
      id: 'opp-1',
      title: `Expand Dominant Category: ${topCategory.category}`,
      potentialValue: `+$${Math.round(topCategory.revenue * 0.35).toLocaleString()} Potential Revenue`,
      strategy: `Double down on product line extensions in ${topCategory.category}, which already commands ${topCategory.percentage}% market share.`,
      category: topCategory.category
    });
  }

  opportunities.push({
    id: 'opp-2',
    title: 'Mid-Market Account Upselling',
    potentialValue: '15-25% Revenue Expansion',
    strategy: `Offer volume-based pricing discounts to secondary accounts purchasing in sizes ${mostSoldSz} and L to elevate order sizes.`,
    category: 'B2B Sales'
  });

  return {
    generatedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    datasetName,
    totalRecordsAnalyzed: records.length,
    executiveOverview,
    healthScore,
    headlineMetric: `$${kpis.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })} Gross Revenue`,
    keyFindings,
    recommendations,
    riskAlerts,
    opportunities,
    customerInsights: {
      totalUniqueCustomers: totalCustomers,
      topCustomer: {
        name: topCustomer.name,
        revenue: topCustomer.revenue,
        percentage: topCustomerPct
      },
      averageSpendPerCustomer: avgSpendPerCust,
      customerConcentrationRisk
    }
  };
}

function generateEmptyAISummary(datasetName: string): AIExecutiveSummary {
  return {
    generatedAt: new Date().toLocaleTimeString(),
    datasetName,
    totalRecordsAnalyzed: 0,
    executiveOverview: 'No sales records detected in the active dataset. Upload an Excel (.xlsx) or CSV file to activate the AI Analyst engine.',
    healthScore: 0,
    headlineMetric: '$0.00 Revenue',
    keyFindings: [],
    recommendations: [],
    riskAlerts: [],
    opportunities: [],
    customerInsights: {
      totalUniqueCustomers: 0,
      topCustomer: { name: 'N/A', revenue: 0, percentage: 0 },
      averageSpendPerCustomer: 0,
      customerConcentrationRisk: 'low'
    }
  };
}
