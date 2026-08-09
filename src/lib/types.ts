export type ResultCategory = 'Kesin Bulgular' | 'Olası Açıklamalar' | 'Bilinmeyenler';

export interface EvidenceTrail {
  usedColumns: string[];
  calculationMethod: string;
  dataVolume: number;
  filtersApplied: string[];
  keyMetrics: { label: string; value: string | number }[];
}

export interface SufficiencyScore {
  isSufficient: boolean;
  score: number;
  reason: string;
  requiredAction?: string;
}

export interface DataSufficiencyReport {
  overall: boolean;
  basicStats: SufficiencyScore;
  forecasting: SufficiencyScore;
  segmentation: SufficiencyScore;
}

export interface SalesRecord {
  id: string;
  productName: string;
  category: string;
  customerName: string;
  date: string; // ISO format YYYY-MM-DD
  quantity: number;
  price: number;
  revenue: number;
  size: string;
  stock: number;
  [key: string]: unknown; // Allow custom extra attributes
}

export interface ColumnMapping {
  productName: string | null;
  category: string | null;
  customerName: string | null;
  date: string | null;
  quantity: string | null;
  price: string | null;
  revenue: string | null;
  size: string | null;
  stock: string | null;
}

export interface ValidationIssue {
  row: number;
  column: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  totalRows: number;
  validRows: number;
  columnMapping: ColumnMapping;
  detectedColumns: string[];
  missingColumns: string[];
  issues: ValidationIssue[];
}

export interface KPIMetrics {
  totalRevenue: number;
  totalQuantity: number;
  totalOrders: number;
  averageOrderValue: number;
  bestSellingProduct: {
    name: string;
    revenue: number;
    quantity: number;
  };
  lowestSellingProduct: {
    name: string;
    revenue: number;
    quantity: number;
  };
  revenueGrowth: number; // percentage vs previous period
  ordersGrowth: number;
}

export interface ProductMetric {
  name: string;
  category: string;
  revenue: number;
  quantity: number;
  ordersCount: number;
  averagePrice: number;
  sizeDistribution: Record<string, number>;
}

export interface CategoryMetric {
  category: string;
  revenue: number;
  quantity: number;
  ordersCount: number;
  percentage: number;
}

export interface SizeMetric {
  size: string;
  quantity: number;
  revenue: number;
  ordersCount: number;
  percentage: number;
  stockAvailable: number;
}

export interface DailyTrendMetric {
  date: string; // YYYY-MM-DD
  formattedDate: string;
  revenue: number;
  quantity: number;
  orders: number;
}

export interface MonthlyTrendMetric {
  month: string; // YYYY-MM
  formattedMonth: string;
  revenue: number;
  quantity: number;
  orders: number;
}

export interface DataQualityMetrics {
  score: number; // 0-100
  missingDataRate: number; // Percentage
  duplicateRows: number;
  anomalyCount: number;
  dataTypes: Record<string, string>;
  columnInsights: Record<string, string>; // AI explanation of column meaning
}

export interface ChartAIInsight {
  title: string;
  summary: string;
  whyItHappened: string;
  whatToDo: string;
  category: ResultCategory;
  evidence?: EvidenceTrail;
}


export interface AutoInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'anomaly' | 'trend';
  title: string;
  whatHappened: string;
  whyItHappened: string;
  whatItMeans: string;
  whatToDo: string;
  priority: 'high' | 'medium' | 'low';
  category: ResultCategory;
  evidence: EvidenceTrail;
}

export interface SegmentationCluster {
  id: string;
  name: string;
  description: string;
  count: number;
  revenue: number;
  percentage: number;
  traits: string[];
}

export interface AnalyticsSummary {
  kpis: KPIMetrics;
  productMetrics: ProductMetric[];
  topProducts: ProductMetric[];
  lowestProducts: ProductMetric[];
  categoryMetrics: CategoryMetric[];
  sizeMetrics: SizeMetric[];
  mostSoldSize: SizeMetric | null;
  leastSoldSize: SizeMetric | null;
  dailyTrends: DailyTrendMetric[];
  monthlyTrends: MonthlyTrendMetric[];
  categories: string[];
  sizes: string[];
  dataQuality: DataQualityMetrics;
  chartInsights: {
    revenue: ChartAIInsight;
    category: ChartAIInsight;
  };
  autoInsights: AutoInsight[];
  segmentation: {
    customers: SegmentationCluster[];
    products: SegmentationCluster[];
  };
  sufficiency: DataSufficiencyReport;
}

export type ActiveTab = 'smart-dashboard' | 'overview' | 'executive-summary' | 'data-quality' | 'upload' | 'products' | 'sizes' | 'trends' | 'ai-insights' | 'auto-insights' | 'segmentation' | 'forecasting' | 'chat' | 'inventory' | 'alerts' | 'reports';
