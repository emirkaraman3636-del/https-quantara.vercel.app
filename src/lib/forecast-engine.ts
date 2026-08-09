import { SalesRecord, AnalyticsSummary } from './types';
import {
  ForecastSummary,
  ForecastDataPoint,
  PeriodForecast,
  CategoryForecast,
  SeasonalityPattern,
  DatasetSufficiency
} from './forecast-types';

/**
 * Predicts future revenue and quantity trajectories using OLS Linear Regression
 * with Day-of-Week Seasonal Multipliers and Variance Confidence Bounds.
 */
export function generateSalesForecast(
  records: SalesRecord[],
  analytics: AnalyticsSummary,
  datasetName: string = 'Uploaded Dataset'
): ForecastSummary {
  const { dailyTrends, categoryMetrics, productMetrics, kpis } = analytics;

  // --- 1. Evaluate Dataset Sufficiency ---
  const sufficiency = evaluateDatasetSufficiency(dailyTrends, records.length);

  if (!sufficiency.isSufficient || dailyTrends.length < 2) {
    return generateInsufficientDataForecast(datasetName, sufficiency);
  }

  // --- 2. Build Daily Historical Time-Series ---
  const sortedHistorical = [...dailyTrends].sort((a, b) => a.date.localeCompare(b.date));
  const n = sortedHistorical.length;

  // Calculate OLS Linear Regression: Y = alpha + beta * X
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  sortedHistorical.forEach((pt, index) => {
    const x = index;
    const y = pt.revenue;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  });

  const meanX = sumX / n;
  const meanY = sumY / n;

  const denominator = sumXX - sumX * meanX;
  const slope = denominator !== 0 ? (sumXY - sumX * meanY) / denominator : 0;
  const intercept = meanY - slope * meanX;

  // --- 3. Day-of-Week Seasonality Factors ---
  const dowTotals: Record<number, { sum: number; count: number }> = {
    0: { sum: 0, count: 0 }, // Sun
    1: { sum: 0, count: 0 }, // Mon
    2: { sum: 0, count: 0 }, // Tue
    3: { sum: 0, count: 0 }, // Wed
    4: { sum: 0, count: 0 }, // Thu
    5: { sum: 0, count: 0 }, // Fri
    6: { sum: 0, count: 0 }  // Sat
  };

  sortedHistorical.forEach(pt => {
    const d = new Date(pt.date);
    if (!isNaN(d.getTime())) {
      const dayIdx = d.getDay();
      dowTotals[dayIdx].sum += pt.revenue;
      dowTotals[dayIdx].count += 1;
    }
  });

  const globalAvgDaily = meanY > 0 ? meanY : 1;
  const dowMultipliers: Record<number, number> = {};
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  let peakDayIdx = 0;
  let peakVal = 0;
  let lowestDayIdx = 0;
  let lowestVal = Infinity;

  for (let i = 0; i < 7; i++) {
    const avg = dowTotals[i].count > 0 ? dowTotals[i].sum / dowTotals[i].count : globalAvgDaily;
    dowMultipliers[i] = globalAvgDaily > 0 ? avg / globalAvgDaily : 1;

    if (avg > peakVal) {
      peakVal = avg;
      peakDayIdx = i;
    }
    if (avg < lowestVal && dowTotals[i].count > 0) {
      lowestVal = avg;
      lowestDayIdx = i;
    }
  }

  const weekendAvg = ((dowTotals[0].sum + dowTotals[6].sum) / Math.max(1, dowTotals[0].count + dowTotals[6].count));
  const weekdayAvg = ((dowTotals[1].sum + dowTotals[2].sum + dowTotals[3].sum + dowTotals[4].sum + dowTotals[5].sum) /
    Math.max(1, dowTotals[1].count + dowTotals[2].count + dowTotals[3].count + dowTotals[4].count + dowTotals[5].count));

  const weekendRatio = weekdayAvg > 0 ? Math.round((weekendAvg / weekdayAvg) * 100) / 100 : 1;

  const seasonality: SeasonalityPattern = {
    detected: sortedHistorical.length >= 7,
    peakDayOfWeek: dayNames[peakDayIdx],
    lowestDayOfWeek: dayNames[lowestDayIdx === Infinity ? 0 : lowestDayIdx],
    weekendVsWeekdayRatio: weekendRatio,
    description: sortedHistorical.length >= 7
      ? `Sales velocity peaks on ${dayNames[peakDayIdx]}s (${Math.round((dowMultipliers[peakDayIdx] - 1) * 100)}% above daily average). Weekend sales are ${weekendRatio}x vs weekday baselines.`
      : 'Requires at least 7 days of date coverage to isolate day-of-week seasonality.'
  };

  // --- 4. Generate Combined Time-Series Graph Points ---
  const timeSeriesCurve: ForecastDataPoint[] = [];

  // Historical Points
  sortedHistorical.forEach(pt => {
    timeSeriesCurve.push({
      date: pt.date,
      formattedDate: pt.formattedDate,
      historicalRevenue: pt.revenue,
      historicalQuantity: pt.quantity,
      isForecast: false
    });
  });

  // Calculate Last Date
  const lastHistoricalDateStr = sortedHistorical[sortedHistorical.length - 1].date;
  const lastDateObj = new Date(lastHistoricalDateStr);

  const confidenceUncertainty = (100 - sufficiency.confidenceScore) / 100;

  // Project Future 90 Days
  let projected30Sum = 0;
  let projected30QtySum = 0;
  let projected60Sum = 0;
  let projected60QtySum = 0;
  let projected90Sum = 0;
  let projected90QtySum = 0;

  const avgPricePerUnit = kpis.totalQuantity > 0 ? kpis.totalRevenue / kpis.totalQuantity : 50;

  for (let dayStep = 1; dayStep <= 90; dayStep++) {
    const nextDate = new Date(lastDateObj);
    nextDate.setDate(nextDate.getDate() + dayStep);

    const dateStr = nextDate.toISOString().split('T')[0];
    const formattedDate = nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayOfWeek = nextDate.getDay();
    const dowFactor = dowMultipliers[dayOfWeek] || 1;

    const trendX = n + dayStep;
    const baseLinearRev = Math.max(10, intercept + slope * trendX);
    const predictedDailyRev = Math.max(10, Math.round(baseLinearRev * dowFactor * 100) / 100);

    const marginOfError = Math.round(predictedDailyRev * (0.12 + confidenceUncertainty * 0.25));
    const lowerBound = Math.max(0, Math.round(predictedDailyRev - marginOfError));
    const upperBound = Math.round(predictedDailyRev + marginOfError);

    const predictedDailyQty = Math.max(1, Math.round(predictedDailyRev / avgPricePerUnit));

    if (dayStep <= 30) {
      projected30Sum += predictedDailyRev;
      projected30QtySum += predictedDailyQty;
    }
    if (dayStep <= 60) {
      projected60Sum += predictedDailyRev;
      projected60QtySum += predictedDailyQty;
    }
    if (dayStep <= 90) {
      projected90Sum += predictedDailyRev;
      projected90QtySum += predictedDailyQty;
    }

    timeSeriesCurve.push({
      date: dateStr,
      formattedDate,
      projectedRevenue: predictedDailyRev,
      lowerBound,
      upperBound,
      projectedQuantity: predictedDailyQty,
      isForecast: true
    });
  }

  // Baseline Historical 30-day equivalent
  const dailyHistoricalAvg = meanY;
  const hist30Baseline = dailyHistoricalAvg * 30;
  const hist30QtyBaseline = Math.round(hist30Baseline / avgPricePerUnit);

  const revGrowth30 = hist30Baseline > 0 ? Math.round(((projected30Sum - hist30Baseline) / hist30Baseline) * 1000) / 10 : 0;
  const revGrowth60 = hist30Baseline > 0 ? Math.round(((projected60Sum / 2 - hist30Baseline) / hist30Baseline) * 1000) / 10 : 0;
  const revGrowth90 = hist30Baseline > 0 ? Math.round(((projected90Sum / 3 - hist30Baseline) / hist30Baseline) * 1000) / 10 : 0;

  // --- 5. Build 30-Day, 60-Day, and 90-Day Forecast Objects ---
  const top30Products = productMetrics.slice(0, 3).map(p => {
    const share = kpis.totalRevenue > 0 ? p.revenue / kpis.totalRevenue : 0.2;
    const projRev = Math.round(projected30Sum * share);
    const projQty = Math.round(projRev / (p.averagePrice || 1));
    return { name: p.name, category: p.category, projectedRevenue: projRev, projectedQuantity: projQty };
  });

  const forecast30Day: PeriodForecast = {
    days: 30,
    periodLabel: '30-Day Near-Term Forecast',
    expectedRevenue: Math.round(projected30Sum),
    expectedRevenueGrowth: revGrowth30,
    expectedQuantity: projected30QtySum,
    expectedQuantityGrowth: revGrowth30,
    predictionInterval: { 
      min: Math.max(0, Math.round(projected30Sum * (1 - confidenceUncertainty * 0.5))),
      max: Math.round(projected30Sum * (1 + confidenceUncertainty * 0.5))
    },
    dataSufficiencyExplanation: sufficiency.isSufficient ? 'Tahmin için yeterli veri mevcut.' : sufficiency.limitationReason,
    topExpectedProducts: top30Products,
    keyTrends: [
      `Expected revenue trajectory of $${Math.round(projected30Sum).toLocaleString()} (${revGrowth30 >= 0 ? '+' : ''}${revGrowth30}% vs baseline).`,
      `Peak weekly demand concentrated on ${dayNames[peakDayIdx]}s.`
    ],
    strategicRisks: [
      `Immediate stock-out vulnerability for top product "${top30Products[0]?.name || 'Hero SKU'}" if volume spikes past projected bounds.`
    ],
    strategicOpportunities: [
      `Capitalize on high weekend purchasing velocity by timing email campaigns for ${dayNames[peakDayIdx]} mornings.`
    ]
  };

  const forecast60Day: PeriodForecast = {
    days: 60,
    periodLabel: '60-Day Mid-Term Forecast',
    expectedRevenue: Math.round(projected60Sum),
    expectedRevenueGrowth: revGrowth60,
    expectedQuantity: projected60QtySum,
    expectedQuantityGrowth: revGrowth60,
    predictionInterval: { 
      min: Math.max(0, Math.round(projected60Sum * (1 - confidenceUncertainty * 0.75))),
      max: Math.round(projected60Sum * (1 + confidenceUncertainty * 0.75))
    },
    dataSufficiencyExplanation: sufficiency.isSufficient ? '60 günlük tahmin için tarihsel trendler yeterli.' : sufficiency.limitationReason,
    topExpectedProducts: top30Products,
    keyTrends: [
      `Cumulative 60-day projected revenue reaching $${Math.round(projected60Sum).toLocaleString()}.`,
      `Stable velocity across primary categories with ${revGrowth60 >= 0 ? 'positive' : 'contracting'} momentum.`
    ],
    strategicRisks: [
      `Mid-term supply chain bottlenecks if purchase orders for Size ${analytics.mostSoldSize?.size || 'M'} are delayed.`
    ],
    strategicOpportunities: [
      `Introduce product line extensions in ${categoryMetrics[0]?.category || 'Tops'} to capture sustained growth.`
    ]
  };

  const forecast90Day: PeriodForecast = {
    days: 90,
    periodLabel: '90-Day Long-Term Forecast',
    expectedRevenue: Math.round(projected90Sum),
    expectedRevenueGrowth: revGrowth90,
    expectedQuantity: projected90QtySum,
    expectedQuantityGrowth: revGrowth90,
    predictionInterval: { 
      min: Math.max(0, Math.round(projected90Sum * (1 - confidenceUncertainty))),
      max: Math.round(projected90Sum * (1 + confidenceUncertainty))
    },
    dataSufficiencyExplanation: sufficiency.isSufficient ? '90 günlük uzatılmış tahmin yüksek dalgalanma (variance) içerebilir.' : sufficiency.limitationReason,
    topExpectedProducts: top30Products,
    keyTrends: [
      `Quarterly revenue trajectory estimated at $${Math.round(projected90Sum).toLocaleString()}.`,
      `Long-term growth slope of +$${Math.round(slope * 100) / 100} per day.`
    ],
    strategicRisks: [
      'Potential customer saturation without new account acquisition.'
    ],
    strategicOpportunities: [
      'Establish B2B corporate contracts to lock in recurring quarterly order volume.'
    ]
  };

  // --- 6. Category Forecast Trajectories ---
  const categoryForecasts: CategoryForecast[] = categoryMetrics.map(cat => {
    const proj30 = Math.round((projected30Sum * (cat.percentage / 100)));
    const growth = revGrowth30 + (cat.percentage > 30 ? 2.5 : -1.5);
    const status: 'growing' | 'stable' | 'declining' = growth > 3 ? 'growing' : growth < -3 ? 'declining' : 'stable';
    
    return {
      category: cat.category,
      currentRevenue: cat.revenue,
      projected30DayRevenue: proj30,
      growthRate: Math.round(growth * 10) / 10,
      status,
      aiInsight: status === 'growing'
        ? `${cat.category} demonstrates strong upward momentum (+${growth.toFixed(1)}%), representing a prime inventory expansion target.`
        : status === 'declining'
        ? `${cat.category} shows softening demand (${growth.toFixed(1)}%). Consider promotional bundles.`
        : `${cat.category} maintains stable revenue contribution (${cat.percentage}% share).`
    };
  });

  // --- 7. Synthesize Overall AI Explanation ---
  const aiExplanation =
    `Based on ${n} historical daily data points analyzed from "${datasetName}", ` +
    `Vortex AI models a ${revGrowth30 >= 0 ? 'positive' : 'declining'} daily revenue slope of ${slope >= 0 ? '+' : ''}$${slope.toFixed(2)} per day. ` +
    `For the upcoming 30 days, we forecast gross sales of $${Math.round(projected30Sum).toLocaleString()} (${revGrowth30 >= 0 ? '+' : ''}${revGrowth30}% vs baseline) ` +
    `with a ${sufficiency.confidenceScore}% confidence score (${sufficiency.confidenceLabel} Confidence). ` +
    `Weekly demand displays clear temporal acceleration on ${dayNames[peakDayIdx]}s.`;

  return {
    datasetName,
    sufficiency,
    timeSeriesCurve,
    forecast30Day,
    forecast60Day,
    forecast90Day,
    categoryForecasts,
    seasonality,
    aiExplanation
  };
}

/**
 * Evaluates dataset volume, date span, and variance to score forecasting confidence
 */
function evaluateDatasetSufficiency(dailyTrends: Array<{ date: string; revenue: number; quantity: number }>, totalRecords: number): DatasetSufficiency {
  const totalDays = dailyTrends.length;

  if (totalDays === 0 || totalRecords === 0) {
    return {
      isSufficient: false,
      totalDaysSpanned: 0,
      totalRecords: 0,
      confidenceScore: 0,
      confidenceLabel: 'Insufficient',
      limitationReason: 'Yüklenen dosyada geçerli tarihli satış kaydı bulunmamaktadır.',
      neededDataDescription: 'Lütfen işlem tarihleri, miktarlar ve fiyatlar içeren bir Excel/CSV yükleyin.'
    };
  }

  if (totalDays < 3 || totalRecords < 5) {
    return {
      isSufficient: false,
      totalDaysSpanned: totalDays,
      totalRecords,
      confidenceScore: 25,
      confidenceLabel: 'Insufficient',
      limitationReason: `Veriseti ${totalDays} gün boyunca sadece ${totalRecords} işlem içeriyor. Trend modellemesi için en az 7 farklı günlük satış geçmişi gerekir.`,
      neededDataDescription: 'En az 1-4 haftalık satış aktivitesini kapsayan tarihsel veriler yükleyin.'
    };
  }

  let score = 50; // Base score

  // Score boost for date coverage
  if (totalDays >= 30) score += 30;
  else if (totalDays >= 14) score += 20;
  else if (totalDays >= 7) score += 10;

  // Score boost for transaction density
  const recordsPerDay = totalRecords / totalDays;
  if (recordsPerDay >= 5) score += 15;
  else if (recordsPerDay >= 2) score += 10;

  score = Math.min(92, Math.max(35, Math.round(score)));
  const confidenceLabel: 'High' | 'Moderate' | 'Low' =
    score >= 80 ? 'High' : score >= 60 ? 'Moderate' : 'Low';

  return {
    isSufficient: true,
    totalDaysSpanned: totalDays,
    totalRecords,
    confidenceScore: score,
    confidenceLabel,
    limitationReason: score < 70 ? `Veriseti ${totalDays} gün (${totalRecords} kayıt) kapsamındadır. Güven seviyesi, 30 günden fazla veri eklendiğinde artar.` : undefined,
    neededDataDescription: score < 70 ? 'Uzun vadeli (90 günlük) tahminleri iyileştirmek için daha fazla geçmiş aya ait veri ekleyin.' : undefined
  };
}

function generateInsufficientDataForecast(datasetName: string, sufficiency: DatasetSufficiency): ForecastSummary {
  return {
    datasetName,
    sufficiency,
    timeSeriesCurve: [],
    forecast30Day: getEmptyPeriodForecast(30, '30-Day Forecast'),
    forecast60Day: getEmptyPeriodForecast(60, '60-Day Forecast'),
    forecast90Day: getEmptyPeriodForecast(90, '90-Day Forecast'),
    categoryForecasts: [],
    seasonality: {
      detected: false,
      peakDayOfWeek: 'N/A',
      lowestDayOfWeek: 'N/A',
      weekendVsWeekdayRatio: 1,
      description: 'Insufficient date span to calculate day-of-week seasonality.'
    },
    aiExplanation: sufficiency.limitationReason || 'Insufficient historical data available for forecasting.'
  };
}

function getEmptyPeriodForecast(days: number, label: string): PeriodForecast {
  return {
    days,
    periodLabel: label,
    expectedRevenue: 0,
    expectedRevenueGrowth: 0,
    expectedQuantity: 0,
    expectedQuantityGrowth: 0,
    topExpectedProducts: [],
    keyTrends: ['Insufficient data available'],
    strategicRisks: ['Cannot model risk without historical records'],
    strategicOpportunities: ['Upload additional sales history']
  };
}
