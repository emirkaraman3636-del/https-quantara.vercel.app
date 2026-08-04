import { SalesRecord, AnalyticsSummary } from './types';

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertCategory = 'inventory' | 'revenue' | 'category' | 'customer' | 'forecast';
export type StockStatus = 'low_stock' | 'optimal' | 'overstock' | 'dead_stock';

export interface InventoryItem {
  id: string;
  productName: string;
  category: string;
  size: string;
  currentStock: number;
  totalQuantitySold: number;
  dailyVelocity: number; // units sold per day
  daysOfStockRemaining: number; // currentStock / dailyVelocity
  stockStatus: StockStatus;
  estimatedRunOutDate?: string;
  statusBadge: { text: string; color: 'emerald' | 'amber' | 'rose' | 'slate' };
  recommendation: string;
}

export interface ReorderItem {
  id: string;
  productName: string;
  category: string;
  size: string;
  currentStock: number;
  dailyDemandVelocity: number;
  leadTimeDays: number; // default 7 days
  safetyStock: number;
  reorderPoint: number; // (leadTimeDays * dailyDemandVelocity) + safetyStock
  recommendedReorderQty: number;
  priority: 'critical' | 'high' | 'medium';
  suggestedReorderDate: string;
}

export interface BusinessAlert {
  id: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  message: string;
  impactMetric: string;
  recommendedAction: string;
  timestamp: string;
  affectedItem?: string;
}

export interface EnterpriseScores {
  inventoryHealthScore: number; // 0 - 100
  businessHealthScore: number; // 0 - 100
  riskScore: number; // 0 - 100 (lower is better)
  forecastConfidence: number; // 0 - 100 %
  stockCoverageDays: number; // Average days of supply remaining across dataset
  totalLowStockSKUs: number;
  totalOverstockSKUs: number;
  totalReordersNeeded: number;
}

export interface InventorySummary {
  datasetName: string;
  scores: EnterpriseScores;
  inventoryItems: InventoryItem[];
  reorderMatrix: ReorderItem[];
  alerts: BusinessAlert[];
  lowStockItems: InventoryItem[];
  overstockItems: InventoryItem[];
  deadStockItems: InventoryItem[];
  fastMovingItems: InventoryItem[];
}
