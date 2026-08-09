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

// We only send the unclassified columns to the AI to get back their SemanticColumn arrays.
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
