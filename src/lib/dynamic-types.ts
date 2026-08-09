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
  duplicateRows: number;
  missingValues: Record<string, number>;
  typeMismatches: Record<string, number>;
  outliers: Record<string, number>;
}

export interface DynamicMetrics {
  kpis: Record<string, number | string | null> & {
    dateRange?: { start: string; end: string; days: number };
  };
  breakdowns: Record<string, Array<{ label: string; value: number }>>;
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

export interface AIBusinessAnalysis {
  executiveSummary: string;
  performance: {
    strengths: string[];
    weaknesses: string[];
  };
  profitability: {
    analysis: string;
    marginHealth: 'Good' | 'Average' | 'Poor' | 'Unknown';
  };
  sales: {
    analysis: string;
    topPerformers: string[];
    bottomPerformers: string[];
  };
  trends: {
    direction: 'Up' | 'Down' | 'Stable' | 'Volatile';
    analysis: string;
  };
  anomalies: Array<{
    title: string;
    description: string;
    severity: 'High' | 'Medium' | 'Low';
  }>;
  opportunities: Array<{
    title: string;
    description: string;
    impact: 'High' | 'Medium' | 'Low';
  }>;
  risks: Array<{
    title: string;
    description: string;
    severity: 'High' | 'Medium' | 'Low';
  }>;
  actionPlan: Array<{
    title: string;
    description: string;
    timeframe: 'Immediate' | 'Short-term' | 'Long-term';
  }>;
  marketingRecommendations: string[];
  dataLimitations: string[];
}

export interface DynamicAnalyticsSummary {
  schema: DatasetSchema;
  quality: DataQualityReport;
  metrics: DynamicMetrics;
  aiAnalysis: AIBusinessAnalysis | null;
  rawSample: Record<string, unknown>[];
}
