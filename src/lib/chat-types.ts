import { SalesRecord, AnalyticsSummary } from './types';
import { AIExecutiveSummary } from './ai-types';
import { ForecastSummary } from './forecast-types';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
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
