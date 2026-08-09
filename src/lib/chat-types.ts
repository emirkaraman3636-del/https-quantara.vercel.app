import { SalesRecord, AnalyticsSummary, AutoInsight, DataQualityMetrics, EvidenceTrail, ResultCategory } from './types';
import { AIExecutiveSummary } from './ai-types';
import { ForecastSummary } from './forecast-types';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string; // Keep for general text or fallback
  whatHappened?: string;
  whyItHappened?: string;
  whatItMeans?: string;
  whatToDo?: string;
  category?: ResultCategory;
  evidence?: EvidenceTrail;
  timestamp: string;
  dataHighlights?: Array<{ label: string; value: string; color?: string }>;
  suggestedFollowUps?: string[];
  intentCategory?: string;
}

export interface SuggestedPrompt {
  id: string;
  prompt: string;
  category: 'product' | 'size' | 'revenue' | 'customer' | 'forecast' | 'recommendation';
  badge: string;
}

export interface ChatContext {
  records: SalesRecord[];
  analytics: AnalyticsSummary;
  aiSummary: AIExecutiveSummary;
  forecastSummary: ForecastSummary;
  datasetName: string;
}
