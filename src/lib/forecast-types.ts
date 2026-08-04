import { SalesRecord, AnalyticsSummary } from './types';

export interface ForecastDataPoint {
  date: string; // YYYY-MM-DD
  formattedDate: string;
  historicalRevenue?: number;
  projectedRevenue?: number;
  lowerBound?: number;
  upperBound?: number;
  historicalQuantity?: number;
  projectedQuantity?: number;
  isForecast: boolean;
}

export interface PeriodForecast {
  days: number; // 30, 60, 90
  periodLabel: string; // "30-Day Forecast", etc.
  expectedRevenue: number;
  expectedRevenueGrowth: number; // percentage vs historical baseline
  expectedQuantity: number;
  expectedQuantityGrowth: number;
  topExpectedProducts: Array<{ name: string; category: string; projectedRevenue: number; projectedQuantity: number }>;
  keyTrends: string[];
  strategicRisks: string[];
  strategicOpportunities: string[];
}

export interface CategoryForecast {
  category: string;
  currentRevenue: number;
  projected30DayRevenue: number;
  growthRate: number; // percentage
  status: 'growing' | 'stable' | 'declining';
  aiInsight: string;
}

export interface SeasonalityPattern {
  detected: boolean;
  peakDayOfWeek: string; // e.g., "Friday"
  lowestDayOfWeek: string; // e.g., "Monday"
  weekendVsWeekdayRatio: number; // e.g. 1.25 (25% higher on weekends)
  description: string;
}

export interface DatasetSufficiency {
  isSufficient: boolean;
  totalDaysSpanned: number;
  totalRecords: number;
  confidenceScore: number; // 0 - 100
  confidenceLabel: 'High' | 'Moderate' | 'Low' | 'Insufficient';
  limitationReason?: string;
  neededDataDescription?: string;
}

export interface ForecastSummary {
  datasetName: string;
  sufficiency: DatasetSufficiency;
  timeSeriesCurve: ForecastDataPoint[];
  forecast30Day: PeriodForecast;
  forecast60Day: PeriodForecast;
  forecast90Day: PeriodForecast;
  categoryForecasts: CategoryForecast[];
  seasonality: SeasonalityPattern;
  aiExplanation: string;
}
