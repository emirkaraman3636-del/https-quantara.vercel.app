import { z } from 'zod';

export const ColumnRoleSchema = z.enum([
  'metric',
  'dimension',
  'identifier',
  'temporal',
  'boolean',
  'unknown'
]);

export const SemanticTypeSchema = z.enum([
  'currency',
  'percentage',
  'quantity',
  'duration',
  'number',
  'text',
  'date',
  'boolean',
  'unknown'
]);

export const PreferredAggregationSchema = z.enum([
  'sum',
  'avg',
  'count',
  'max',
  'min',
  'none'
]);

export const SemanticColumnSchema = z.object({
  name: z.string(),
  cleanName: z.string(),
  analyticalRole: ColumnRoleSchema,
  semanticType: SemanticTypeSchema,
  aggregatable: z.boolean(),
  preferredAggregation: PreferredAggregationSchema,
  displayPriority: z.number().min(1).max(10),
  confidence: z.number().min(0).max(100)
});

export const DatasetSchemaSchema = z.object({
  columns: z.array(SemanticColumnSchema)
});

export const AIFallbackResponseSchema = z.object({
  columns: z.array(z.object({
    name: z.string(),
    analyticalRole: ColumnRoleSchema,
    semanticType: SemanticTypeSchema,
    aggregatable: z.boolean(),
    preferredAggregation: PreferredAggregationSchema,
    displayPriority: z.number().min(1).max(10),
    confidence: z.number().min(0).max(100)
  }))
});

export const AIInsightSchema = z.object({
  title: z.string(),
  type: z.string(),
  severity: z.enum(['High', 'Medium', 'Low', 'Info']),
  statement: z.string(),
  evidence: z.string(),
  metric: z.string().nullable(),
  value: z.string().nullable(),
  impact: z.string().nullable(),
  recommendation: z.string().nullable(),
  confidence: z.enum(['High', 'Medium', 'Low'])
});

export const AIBusinessAnalysisSchema = z.object({
  executiveSummary: z.string(),
  keyFindings: z.array(AIInsightSchema),
  criticalProblems: z.array(AIInsightSchema),
  opportunities: z.array(AIInsightSchema),
  risks: z.array(AIInsightSchema),
  recommendedActions: z.array(AIInsightSchema),
  trendAnalysis: z.array(AIInsightSchema),
  profitabilityInsights: z.array(AIInsightSchema),
  marketingInsights: z.array(AIInsightSchema),
  dataLimitations: z.array(z.string()),
  confidence: z.enum(['High', 'Medium', 'Low'])
});

export const AIChatResponseSchema = z.object({
  answer: z.string(),
  confidence: z.enum(['High', 'Medium', 'Low', 'Unknown']),
  evidence: z.array(z.string()).nullable(),
  dataLimitations: z.array(z.string()).nullable(),
  recommendation: z.string().nullable()
});
