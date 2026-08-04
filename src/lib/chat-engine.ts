import { ChatContext, ChatMessage } from './chat-types';

/**
 * Natural Language Query Engine for Sales AI Copilot.
 * Classifies user intent and queries active dataset structures to generate numbers-backed analyst responses.
 */
export function processUserQuery(userQuery: string, context: ChatContext): ChatMessage {
  const queryClean = userQuery.toLowerCase().trim();
  const { analytics, aiSummary, forecastSummary, datasetName, records } = context;
  const { kpis, productMetrics, categoryMetrics, sizeMetrics } = analytics;

  const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const msgId = `msg-${Date.now()}`;

  // If no dataset records present
  if (!records || records.length === 0) {
    return {
      id: msgId,
      role: 'assistant',
      timestamp,
      content: `No sales transactions detected in "${datasetName}". Please upload an Excel (.xlsx) or CSV file in the Data Ingestion tab to activate the AI Copilot analyst.`,
      intentCategory: 'general'
    };
  }

  // --- INTENT 1: Best / Top Selling Products ---
  if (
    queryClean.includes('best selling') ||
    queryClean.includes('top product') ||
    queryClean.includes('sold the most') ||
    queryClean.includes('top selling') ||
    queryClean.includes('highest sales')
  ) {
    const topProd = kpis.bestSellingProduct;
    const topProdMetric = productMetrics[0];
    const topProdShare = kpis.totalRevenue > 0 ? ((topProd.revenue / kpis.totalRevenue) * 100).toFixed(1) : '0';

    const content =
      `Based on the uploaded dataset ("${datasetName}"), the #1 best selling product is **${topProd.name}**. ` +
      `It generated **$${topProd.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}** in total revenue ` +
      `across **${topProd.quantity.toLocaleString()} units sold** (${topProdMetric?.ordersCount || 0} orders), representing **${topProdShare}% of your total revenue**.\n\n` +
      `**Analyst Recommendation:** Maintain a minimum 25% inventory safety stock buffer for ${topProd.name} to avoid revenue loss from stock-outs.`;

    return {
      id: msgId,
      role: 'assistant',
      timestamp,
      content,
      intentCategory: 'product',
      dataHighlights: [
        { label: 'Top Product', value: topProd.name, color: 'emerald' },
        { label: 'Product Revenue', value: `$${topProd.revenue.toLocaleString()}`, color: 'emerald' },
        { label: 'Revenue Share', value: `${topProdShare}%`, color: 'indigo' }
      ],
      suggestedFollowUps: [
        'Which product has the lowest sales?',
        'What is our clothing size breakdown?',
        'What is our 30-day forecast for top products?'
      ]
    };
  }

  // --- INTENT 2: Worst Selling / Losing Popularity / Low SKU ---
  if (
    queryClean.includes('worst') ||
    queryClean.includes('lowest') ||
    queryClean.includes('losing popularity') ||
    queryClean.includes('low sales') ||
    queryClean.includes('underperforming') ||
    queryClean.includes('slowest')
  ) {
    const lowestProd = kpis.lowestSellingProduct;
    const lowestShare = kpis.totalRevenue > 0 ? ((lowestProd.revenue / kpis.totalRevenue) * 100).toFixed(2) : '0';

    const content =
      `According to the uploaded data, the lowest performing SKU is **${lowestProd.name}**. ` +
      `It generated only **$${lowestProd.revenue.toLocaleString()}** in gross revenue (**${lowestProd.quantity} units sold**), representing just **${lowestShare}% of total revenue**.\n\n` +
      `**Analyst Recommendation:** Consider bundling ${lowestProd.name} with top seller "${kpis.bestSellingProduct.name}" at a 15% discount, or launch a promotional clearance campaign to free up working capital.`;

    return {
      id: msgId,
      role: 'assistant',
      timestamp,
      content,
      intentCategory: 'product',
      dataHighlights: [
        { label: 'Lowest Product', value: lowestProd.name, color: 'rose' },
        { label: 'Revenue Generated', value: `$${lowestProd.revenue.toLocaleString()}`, color: 'rose' },
        { label: 'Units Sold', value: `${lowestProd.quantity} units`, color: 'amber' }
      ],
      suggestedFollowUps: [
        'How can we increase sales for underperforming items?',
        'Which category generates the most revenue?',
        'What are our top business risks?'
      ]
    };
  }

  // --- INTENT 3: Clothing Size & Inventory Sizing Demand ---
  if (
    queryClean.includes('size') ||
    queryClean.includes('sizing') ||
    queryClean.includes('stock more') ||
    queryClean.includes('demand size') ||
    queryClean.includes('apparel size')
  ) {
    const mostSold = analytics.mostSoldSize;
    const leastSold = analytics.leastSoldSize;

    if (!mostSold) {
      return {
        id: msgId,
        role: 'assistant',
        timestamp,
        content: 'No size column was detected in the active dataset. Ensure your file contains a "Size" column (e.g. S, M, L, XL).',
        intentCategory: 'size'
      };
    }

    const content =
      `Based on transaction analysis, **Size ${mostSold.size}** represents the highest customer demand at **${mostSold.percentage}% of overall apparel volume** ` +
      `(${mostSold.quantity.toLocaleString()} units sold generating **$${mostSold.revenue.toLocaleString()}**).\n\n` +
      `Conversely, Size ${leastSold?.size || 'S'} has the lowest demand at ${leastSold?.percentage}% (${leastSold?.quantity || 0} units).\n\n` +
      `**Analyst Recommendation:** Re-allocate purchase orders to allocate **${mostSold.percentage}% of inventory towards Size ${mostSold.size}**, while scaling down stock reorders for Size ${leastSold?.size || 'S'} by 30%.`;

    return {
      id: msgId,
      role: 'assistant',
      timestamp,
      content,
      intentCategory: 'size',
      dataHighlights: [
        { label: 'Top Demand Size', value: `Size ${mostSold.size}`, color: 'emerald' },
        { label: 'Size Volume Share', value: `${mostSold.percentage}%`, color: 'indigo' },
        { label: 'Units Sold', value: `${mostSold.quantity} units`, color: 'indigo' }
      ],
      suggestedFollowUps: [
        'Which products are vulnerable to stock-outs?',
        'What is our best selling product?',
        'Show 30-day forecast'
      ]
    };
  }

  // --- INTENT 4: Category Revenue & Department Performance ---
  if (
    queryClean.includes('category') ||
    queryClean.includes('department') ||
    queryClean.includes('outerwear') ||
    queryClean.includes('tops') ||
    queryClean.includes('bottoms') ||
    queryClean.includes('accessories')
  ) {
    const topCat = categoryMetrics[0];

    const catBreakdown = categoryMetrics.map(c => `- **${c.category}**: $${c.revenue.toLocaleString()} (${c.percentage}% share)`).join('\n');

    const content =
      `Category analysis shows that **${topCat ? topCat.category : 'General'}** leads revenue generation, accounting for **${topCat ? topCat.percentage : 0}% of gross sales** ($${topCat ? topCat.revenue.toLocaleString() : 0}).\n\n` +
      `**Full Category Breakdown:**\n${catBreakdown}\n\n` +
      `**Analyst Recommendation:** Expand product variants in ${topCat ? topCat.category : 'top categories'} to capture additional market share.`;

    return {
      id: msgId,
      role: 'assistant',
      timestamp,
      content,
      intentCategory: 'category',
      dataHighlights: [
        { label: 'Leading Category', value: topCat ? topCat.category : 'N/A', color: 'emerald' },
        { label: 'Category Share', value: `${topCat ? topCat.percentage : 0}%`, color: 'indigo' },
        { label: 'Total Categories', value: `${categoryMetrics.length}`, color: 'indigo' }
      ],
      suggestedFollowUps: [
        'What is the 30-day forecast by category?',
        'Which product sold the most?',
        'Who are our top customers?'
      ]
    };
  }

  // --- INTENT 5: Top Customers & B2B Buyer Accounts ---
  if (
    queryClean.includes('customer') ||
    queryClean.includes('client') ||
    queryClean.includes('buyer') ||
    queryClean.includes('who bought') ||
    queryClean.includes('top account')
  ) {
    const topCust = aiSummary.customerInsights.topCustomer;
    const totalCust = aiSummary.customerInsights.totalUniqueCustomers;
    const avgSpend = aiSummary.customerInsights.averageSpendPerCustomer;

    const content =
      `Analyzed **${totalCust} active customer accounts** from "${datasetName}". ` +
      `Your #1 key client account is **${topCust.name}**, generating **$${topCust.revenue.toLocaleString()}** (` +
      `**${topCust.percentage}% of total dataset revenue**).\n\n` +
      `The average spend per customer account is **$${avgSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}**.\n\n` +
      `**Analyst Recommendation:** ${
        topCust.percentage > 25
          ? `High account concentration risk detected (${topCust.percentage}% with ${topCust.name}). Assign a dedicated account manager to secure long-term contracts.`
          : 'Customer distribution is healthy. Offer tier-based volume discounts to mid-market accounts.'
      }`;

    return {
      id: msgId,
      role: 'assistant',
      timestamp,
      content,
      intentCategory: 'customer',
      dataHighlights: [
        { label: 'Top Customer', value: topCust.name, color: 'emerald' },
        { label: 'Top Spend', value: `$${topCust.revenue.toLocaleString()}`, color: 'emerald' },
        { label: 'Revenue Share', value: `${topCust.percentage}%`, color: 'amber' }
      ],
      suggestedFollowUps: [
        'What are our top business risks?',
        'What is our total revenue?',
        'Which size has highest demand?'
      ]
    };
  }

  // --- INTENT 6: Total Revenue, AOV & Financial Metrics ---
  if (
    queryClean.includes('revenue') ||
    queryClean.includes('sales') ||
    queryClean.includes('how much') ||
    queryClean.includes('total') ||
    queryClean.includes('money') ||
    queryClean.includes('financial') ||
    queryClean.includes('aov')
  ) {
    const content =
      `Dataset **"${datasetName}"** contains **${records.length} sales records** yielding:\n` +
      `- **Total Gross Revenue:** $${kpis.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n` +
      `- **Total Sales Volume:** ${kpis.totalQuantity.toLocaleString()} units\n` +
      `- **Total Transactions:** ${kpis.totalOrders.toLocaleString()} orders\n` +
      `- **Average Order Value (AOV):** $${kpis.averageOrderValue.toFixed(2)}\n\n` +
      `**Analyst Insight:** To elevate overall revenue, focus on cross-selling bundles to raise Average Order Value past $${Math.round(kpis.averageOrderValue * 1.2)}.`;

    return {
      id: msgId,
      role: 'assistant',
      timestamp,
      content,
      intentCategory: 'revenue',
      dataHighlights: [
        { label: 'Gross Revenue', value: `$${kpis.totalRevenue.toLocaleString()}`, color: 'emerald' },
        { label: 'Average Order Value', value: `$${kpis.averageOrderValue.toFixed(2)}`, color: 'indigo' },
        { label: 'Total Orders', value: `${kpis.totalOrders}`, color: 'indigo' }
      ],
      suggestedFollowUps: [
        'What is our 30-day revenue forecast?',
        'Which product generated the most revenue?',
        'Which size has the highest demand?'
      ]
    };
  }

  // --- INTENT 7: Forecast / Future 30/60/90-Day Predictions ---
  if (
    queryClean.includes('forecast') ||
    queryClean.includes('future') ||
    queryClean.includes('predict') ||
    queryClean.includes('next month') ||
    queryClean.includes('30-day') ||
    queryClean.includes('60-day') ||
    queryClean.includes('90-day') ||
    queryClean.includes('expect')
  ) {
    const f30 = forecastSummary.forecast30Day;
    const conf = forecastSummary.sufficiency.confidenceScore;
    const confLabel = forecastSummary.sufficiency.confidenceLabel;

    const content =
      `Vortex AI's predictive forecasting engine models the following trajectories for "${datasetName}" (${conf}% ${confLabel} Confidence):\n\n` +
      `- **30-Day Forecast:** Expected revenue of **$${f30.expectedRevenue.toLocaleString()}** (${f30.expectedRevenueGrowth >= 0 ? '+' : ''}${f30.expectedRevenueGrowth}% vs baseline), **${f30.expectedQuantity.toLocaleString()} units**.\n` +
      `- **60-Day Forecast:** Projected cumulative revenue of **$${forecastSummary.forecast60Day.expectedRevenue.toLocaleString()}**.\n` +
      `- **90-Day Forecast:** Projected cumulative revenue of **$${forecastSummary.forecast90Day.expectedRevenue.toLocaleString()}**.\n\n` +
      `**Top Expected Product:** ${f30.topExpectedProducts[0]?.name || kpis.bestSellingProduct.name} ($${f30.topExpectedProducts[0]?.projectedRevenue.toLocaleString() || 0}).`;

    return {
      id: msgId,
      role: 'assistant',
      timestamp,
      content,
      intentCategory: 'forecast',
      dataHighlights: [
        { label: '30-Day Projected Rev', value: `$${f30.expectedRevenue.toLocaleString()}`, color: 'emerald' },
        { label: 'Projected Growth', value: `${f30.expectedRevenueGrowth >= 0 ? '+' : ''}${f30.expectedRevenueGrowth}%`, color: 'emerald' },
        { label: 'Confidence Score', value: `${conf}%`, color: 'indigo' }
      ],
      suggestedFollowUps: [
        'What is our day-of-week seasonality pattern?',
        'Which categories are growing?',
        'What are our top inventory risks?'
      ]
    };
  }

  // --- INTENT 8: Recommendations & Strategic Action ("What should we do?") ---
  if (
    queryClean.includes('recommend') ||
    queryClean.includes('what should we do') ||
    queryClean.includes('action') ||
    queryClean.includes('strategy') ||
    queryClean.includes('next step') ||
    queryClean.includes('decrease') ||
    queryClean.includes('why')
  ) {
    const recs = aiSummary.recommendations;
    const recList = recs.map((r, i) => `${i + 1}. **${r.title}**: ${r.action} *(Expected Outcome: ${r.expectedOutcome})*`).join('\n\n');

    const content =
      `Based on dynamic statistical analysis of "${datasetName}", here are your top strategic action items:\n\n` +
      `${recList}\n\n` +
      `**Executive Health Score:** ${aiSummary.healthScore}/100.`;

    return {
      id: msgId,
      role: 'assistant',
      timestamp,
      content,
      intentCategory: 'recommendation',
      dataHighlights: [
        { label: 'Health Score', value: `${aiSummary.healthScore}/100`, color: 'emerald' },
        { label: 'Action Items', value: `${recs.length} Strategic Recs`, color: 'amber' }
      ],
      suggestedFollowUps: [
        'Which product sold the most?',
        'Which size has the highest demand?',
        'What is our 30-day forecast?'
      ]
    };
  }

  // --- DEFAULT FALLBACK: General Dataset Overview ---
  const overviewText =
    `I am your sales analyst assistant connected live to **"${datasetName}"** (${records.length} records).\n\n` +
    `Here is a quick snapshot of your active dataset:\n` +
    `- **Total Revenue:** $${kpis.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n` +
    `- **Best Seller:** ${kpis.bestSellingProduct.name} ($${kpis.bestSellingProduct.revenue.toLocaleString()})\n` +
    `- **Top Category:** ${categoryMetrics[0]?.category || 'General'} (${categoryMetrics[0]?.percentage || 0}% share)\n` +
    `- **Top Demand Size:** Size ${analytics.mostSoldSize?.size || 'M'} (${analytics.mostSoldSize?.percentage || 0}% of volume)\n\n` +
    `Ask me specific questions like *"Which product sold the most?"*, *"Which size has highest demand?"*, *"Who are our best customers?"*, or *"Show 30-day forecast"*.`;

  return {
    id: msgId,
    role: 'assistant',
    timestamp,
    content: overviewText,
    intentCategory: 'general',
    dataHighlights: [
      { label: 'Active Dataset', value: datasetName, color: 'indigo' },
      { label: 'Total Revenue', value: `$${kpis.totalRevenue.toLocaleString()}`, color: 'emerald' }
    ],
    suggestedFollowUps: [
      'Which product sold the most?',
      'Which size has the highest demand?',
      'Who are our best customers?',
      'What is our 30-day forecast?'
    ]
  };
}

export const SUGGESTED_PROMPTS = [
  { id: 'sp-1', prompt: 'Which product sold the most this month?', category: 'product', badge: 'Best Seller' },
  { id: 'sp-2', prompt: 'Which size has the highest demand?', category: 'size', badge: 'Inventory Sizing' },
  { id: 'sp-3', prompt: 'Which category generates the most revenue?', category: 'revenue', badge: 'Category Share' },
  { id: 'sp-4', prompt: 'Who are our top customer accounts?', category: 'customer', badge: 'Client Accounts' },
  { id: 'sp-5', prompt: 'What is our projected 30-day sales forecast?', category: 'forecast', badge: 'AI Forecast' },
  { id: 'sp-6', prompt: 'What strategic actions should we take next month?', category: 'recommendation', badge: 'Recommendations' }
];
