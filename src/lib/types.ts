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
  [key: string]: any; // Allow custom extra attributes
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
}

export type ActiveTab = 'overview' | 'upload' | 'products' | 'sizes' | 'trends' | 'ai-insights' | 'forecasting' | 'chat' | 'inventory' | 'alerts';
