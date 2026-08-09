import { SalesRecord, AnalyticsSummary } from './types';

export interface AIFinding {
  id: string;
  category: 'revenue' | 'product' | 'size' | 'customer' | 'category';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  type: 'positive' | 'negative' | 'neutral';
  metricValue?: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  action: string;
  priority: 'critical' | 'high' | 'medium';
  targetArea: string;
  expectedOutcome: string;
}

export interface AIRiskAlert {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  riskDescription: string;
  mitigationStrategy: string;
  affectedItem?: string;
}

export interface AIOpportunity {
  id: string;
  title: string;
  potentialValue: string;
  strategy: string;
  category: string;
}

export interface AutoInsight {
  title: string;
  description: string;
  metric?: string;
  trend?: 'up' | 'down' | 'flat';
}

export interface AIExecutiveSummary {
  generatedAt: string;
  datasetName: string;
  totalRecordsAnalyzed: number;
  executiveOverview: string;
  healthScore: number; // 0-100 score based on revenue concentration, size balance, and stock turnover
  headlineMetric: string;
  keyFindings: AIFinding[];
  recommendations: AIRecommendation[];
  riskAlerts: AIRiskAlert[];
  opportunities: AIOpportunity[];
  customerInsights: {
    totalUniqueCustomers: number;
    topCustomer: { name: string; revenue: number; percentage: number };
    averageSpendPerCustomer: number;
    customerConcentrationRisk: 'high' | 'medium' | 'low';
  };
  chartInsights?: Record<string, unknown>;
  autoInsights?: AutoInsight[];
}
