import { prisma } from '../prisma';
import { generateAIInsights } from '../server-ai';
import { inferSemanticSchema } from '../semantic-inference';
import { generateDataQualityReport } from '../data-quality';
import { calculateGenericMetrics } from '../dynamic-aggregator';
import { DynamicAnalyticsSummary } from '../dynamic-types';

export async function rebuildAnalysis(projectId: string, datasetId: string, records: Record<string, unknown>[]) {
  // 1. Dynamic Pipeline Execution
  const schema = await inferSemanticSchema(records);
  const quality = generateDataQualityReport(records, schema);
  const metrics = calculateGenericMetrics(records, schema);
  
  // Create base summary
  const summary: DynamicAnalyticsSummary = {
    schema,
    quality,
    metrics,
    aiAnalysis: null,
    rawSample: records.slice(0, 5) // Send a small sample for UI context
  };

  // Attempt real AI insights if API key is present
  summary.aiAnalysis = await generateAIInsights(summary);

  const analysis = await prisma.analysis.create({
    data: {
      datasetId: datasetId,
      summaryJson: JSON.parse(JSON.stringify(summary))
    }
  });

  return analysis;
}
