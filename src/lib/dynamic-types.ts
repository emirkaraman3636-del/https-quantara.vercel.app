export type AnalyticalRole = 
  | 'metric'
  | 'dimension'
  | 'identifier'
  | 'temporal'
  | 'boolean'
  | 'unknown';

export type SemanticType = 
  | 'currency'
  | 'percentage'
  | 'quantity'
  | 'duration'
  | 'number'
  | 'text'
  | 'date'
  | 'boolean'
  | 'unknown';

export type DatasetClassification = 
  | 'Sales'
  | 'Finance'
  | 'HR'
  | 'Inventory'
  | 'Marketing'
  | 'Customers'
  | 'Operations'
  | 'Generic';

export interface SemanticColumn {
  name: string;
  cleanName: string;
  analyticalRole: AnalyticalRole;
  semanticType: SemanticType;
  aggregatable: boolean;
  preferredAggregation: 'sum' | 'avg' | 'count' | 'max' | 'min' | 'none';
  displayPriority: number; // 1 (highest) to 10 (lowest)
  confidence: number;      // 0 to 100
}

export interface DatasetSchema {
  columns: SemanticColumn[];
  datasetType: DatasetClassification;
  classificationConfidence: number; // 0 to 100
}

export interface DataQualityReport {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  missingValues: Record<string, number>;
  typeMismatches: Record<string, number>;
  outliers: Record<string, number>;
  emptyRows: number;
  malformedRows: number;
  dateCoverage?: { start: string; end: string };
  detectedTypes: Record<string, string>;
  limitations: string[];
  dataQualityScore: number; // 0 to 100
}

export interface DeterministicMetrics {
  totalRevenue: number | null;
  totalCost: number | null;
  grossProfit: number | null;
  grossMargin: number | null;
  totalQuantity: number | null;
  totalTransactions: number;
  averageOrderValue: number | null;
  averageSellingPrice: number | null;
  totalDiscount: number | null;
  totalTax: number | null;
  totalExpenses: number | null;
  netProfit: number | null;
}

export interface ConcentrationRisk {
  dimension: string;
  topCount: number;
  concentrationPercentage: number;
  riskLevel: 'High' | 'Medium' | 'Low';
}

export interface Anomaly {
  metric: string;
  actualValue: number;
  expectedRange: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  rows?: number[];
}

export interface TimeSeriesData {
  period: string;
  revenue: number | null;
  quantity: number | null;
  margin: number | null;
  profit: number | null;
}

export interface BusinessIntelligenceContext {
  metadata: {
    datasetType: DatasetClassification;
    dateCoverage?: { start: string; end: string; days?: number };
    totalRows: number;
  };
  metrics: DeterministicMetrics;
  breakdowns: Record<string, Array<{ label: string; revenue: number | null; profit: number | null; quantity: number | null; count: number }>>;
  timeSeries: TimeSeriesData[];
  concentrations: ConcentrationRisk[];
  anomalies: Anomaly[];
  limitations: string[];
}

export type ChartSeries = {
  key: string;
  name: string;
  color: string;
  semanticType: SemanticType;
};

export type ChartConfig = 
  | { id: string; type: 'line'; title: string; data: Record<string, unknown>[]; xAxisKey: string; series: ChartSeries[] }
  | { id: string; type: 'bar'; title: string; data: Record<string, unknown>[]; xAxisKey: string; series: ChartSeries[]; layout?: 'horizontal' | 'vertical' }
  | { id: string; type: 'pie'; title: string; data: Record<string, unknown>[]; nameKey: string; dataKey: string; metricName: string; semanticType: SemanticType };

export interface AIInsight {
  title: string;
  type: string;
  severity: 'High' | 'Medium' | 'Low' | 'Info';
  statement: string;
  evidence: string;
  metric: string | null;
  value: string | null;
  impact: string | null;
  recommendation: string | null;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface AIBusinessAnalysis {
  executiveSummary: string;
  keyFindings: AIInsight[];
  criticalProblems: AIInsight[];
  opportunities: AIInsight[];
  risks: AIInsight[];
  recommendedActions: AIInsight[];
  trendAnalysis: AIInsight[];
  profitabilityInsights: AIInsight[];
  marketingInsights: AIInsight[];
  dataLimitations: string[];
  confidence: 'High' | 'Medium' | 'Low';
}

export interface DynamicAnalyticsSummary {
  schema: DatasetSchema;
  quality: DataQualityReport;
  biContext: BusinessIntelligenceContext;
  aiAnalysis: AIBusinessAnalysis | null;
  rawSample: Record<string, unknown>[];
}
