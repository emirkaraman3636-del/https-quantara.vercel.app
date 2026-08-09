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
  if (!records || records.length === 0 || !analytics.sufficiency.overall) {
    return {
      id: msgId,
      role: 'assistant',
      timestamp,
      content: !records?.length 
        ? `No sales transactions detected in "${datasetName}". Please upload an Excel (.xlsx) or CSV file.`
        : `Mevcut veri (Satır Sayısı: ${records.length}, Kalite Skoru: ${analytics.sufficiency.basicStats.score}) istatistiksel analiz üretmek için yetersizdir. ${analytics.sufficiency.basicStats.requiredAction}`,
      intentCategory: 'general',
      category: 'Bilinmeyenler',
      evidence: {
        usedColumns: [],
        calculationMethod: 'Data Sufficiency Gate',
        dataVolume: records?.length || 0,
        filtersApplied: [],
        keyMetrics: [{ label: 'Kalite Skoru', value: analytics?.sufficiency?.basicStats?.score || 0 }]
      }
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

    const content = `Based on the uploaded dataset ("${datasetName}"), the #1 best selling product is **${topProd.name}**.`;

    return {
      id: msgId,
      role: 'assistant',
      timestamp,
      content,
      whatHappened: `The product "${topProd.name}" generated $${topProd.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })} in revenue across ${topProd.quantity.toLocaleString()} units sold.`,
      whyItHappened: `Bu ürünün en çok satmasını sağlayan faktör (örn: fiyat, pazarlama, kalite) için veride yeterli kanıt bulunamadı. Yüksek satış hacmi sadece sayısal olarak tespit edilmiştir (Bu sadece olası bir açıklamadır).`,
      whatItMeans: `This SKU is your primary revenue driver. A stock-out here would severely impact overall cash flow.`,
      whatToDo: `Maintain a minimum 25% inventory safety stock buffer and consider slight price elasticity testing to maximize margin.`,
      intentCategory: 'product',
      category: 'Olası Açıklamalar',
      evidence: {
        usedColumns: ['Ürün Adı', 'Ciro (Revenue)', 'Adet (Quantity)'],
        calculationMethod: 'Max Aggregation (Top Seller)',
        dataVolume: records.length,
        filtersApplied: ['None'],
        keyMetrics: [
          { label: 'Ciro', value: `$${topProd.revenue.toLocaleString()}` },
          { label: 'Pay', value: `${topProdShare}%` }
        ]
      },
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

    const content = `According to the uploaded data, the lowest performing SKU is **${lowestProd.name}**.`;

    return {
      id: msgId,
      role: 'assistant',
      timestamp,
      content,
      whatHappened: `The product "${lowestProd.name}" generated only $${lowestProd.revenue.toLocaleString()} in revenue with just ${lowestProd.quantity} units sold.`,
      whyItHappened: `Düşük performansın asıl nedeni (örn: yanlış fiyatlandırma, düşük görünürlük, mevsimsellik) için veride yeterli kanıt bulunamadı. Bu sadece olası bir açıklamadır.`,
      whatItMeans: `Capital is tied up in slow-moving inventory, reducing overall working capital efficiency and taking up warehouse space.`,
      whatToDo: `Bundle "${lowestProd.name}" with top seller "${kpis.bestSellingProduct.name}" at a 15% discount, or launch a promotional clearance campaign.`,
      intentCategory: 'product',
      category: 'Olası Açıklamalar',
      evidence: {
        usedColumns: ['Ürün Adı', 'Ciro (Revenue)'],
        calculationMethod: 'Min Aggregation (Worst Seller)',
        dataVolume: records.length,
        filtersApplied: ['None'],
        keyMetrics: [
          { label: 'Ciro', value: `$${lowestProd.revenue.toLocaleString()}` },
          { label: 'Adet', value: lowestProd.quantity }
        ]
      },
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

    const content = `Based on transaction analysis, **Size ${mostSold.size}** represents the highest customer demand at **${mostSold.percentage}% of overall apparel volume**.`;

    return {
      id: msgId,
      role: 'assistant',
      timestamp,
      content,
      whatHappened: `Size ${mostSold.size} sold ${mostSold.quantity.toLocaleString()} units (generating $${mostSold.revenue.toLocaleString()}), while Size ${leastSold?.size || 'S'} had the lowest demand at ${leastSold?.percentage}% (${leastSold?.quantity || 0} units).`,
      whyItHappened: `Müşteri kitlesinin fiziksel özellikleri veya demografisi hakkında veride yeterli kanıt bulunamadı. Bu yoğunlaşma tamamen işlemsel verilere dayalıdır (Bu sadece olası bir açıklamadır).`,
      whatItMeans: `Your inventory sizing curve does not match the demand curve, risking both stock-outs on popular sizes and dead stock on edge sizes.`,
      whatToDo: `Re-allocate purchase orders to distribute ${mostSold.percentage}% of inventory to Size ${mostSold.size}, while scaling down Size ${leastSold?.size || 'S'} reorders by 30%.`,
      intentCategory: 'size',
      category: 'Olası Açıklamalar',
      evidence: {
        usedColumns: ['Beden (Size)', 'Adet (Quantity)'],
        calculationMethod: 'Group By Size -> Sum(Quantity)',
        dataVolume: records.length,
        filtersApplied: ['None'],
        keyMetrics: [
          { label: 'En Çok Satan Beden', value: mostSold.size },
          { label: 'Hacim Payı', value: `${mostSold.percentage}%` }
        ]
      },
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

    const content = `Category analysis shows that **${topCat ? topCat.category : 'General'}** leads revenue generation, accounting for **${topCat ? topCat.percentage : 0}% of gross sales** ($${topCat ? topCat.revenue.toLocaleString() : 0}).`;

    return {
      id: msgId,
      role: 'assistant',
      timestamp,
      content,
      whatHappened: `The ${topCat ? topCat.category : 'top category'} generated $${topCat ? topCat.revenue.toLocaleString() : 0}, dominating the product mix.\n\n**Category Breakdown:**\n${catBreakdown}`,
      whyItHappened: `Pazarlama kampanyaları, dış etkenler veya müşteri yönelimi için veride yeterli kanıt bulunamadı. Bu yüksek hacim sadece olası bir açıklamadır.`,
      whatItMeans: `High category concentration makes overall revenue vulnerable to seasonal shifts in that specific department.`,
      whatToDo: `Expand product variants in ${topCat ? topCat.category : 'top categories'} to capture additional market share, while running cross-category promotions to lift secondary departments.`,
      intentCategory: 'category',
      category: 'Olası Açıklamalar',
      evidence: {
        usedColumns: ['Kategori', 'Ciro (Revenue)'],
        calculationMethod: 'Group By Category -> Sum(Revenue)',
        dataVolume: records.length,
        filtersApplied: ['None'],
        keyMetrics: [
          { label: 'Lider Kategori', value: topCat ? topCat.category : 'N/A' },
          { label: 'Gelir Payı', value: `${topCat ? topCat.percentage : 0}%` }
        ]
      },
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

    const content = `Analyzed **${totalCust} active customer accounts** from "${datasetName}".`;

    return {
      id: msgId,
      role: 'assistant',
      timestamp,
      content,
      whatHappened: `Your #1 key client account is **${topCust.name}**, generating $${topCust.revenue.toLocaleString()} (${topCust.percentage}% of total dataset revenue). Average spend per account is $${avgSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}.`,
      whyItHappened: `Bu müşterinin neden bu kadar büyük hacimde alım yaptığına dair (örn: kurumsal sözleşme, ihale) veride yeterli kanıt bulunamadı. Bu durum sadece olası bir açıklamadır.`,
      whatItMeans: topCust.percentage > 25 
        ? `High account concentration risk detected. Losing ${topCust.name} would severely impact business stability.` 
        : `Customer distribution is healthy and not overly reliant on a single buyer.`,
      whatToDo: topCust.percentage > 25
        ? `Assign a dedicated account manager to secure long-term contracts with ${topCust.name}, while increasing outbound sales to acquire mid-tier enterprise accounts.`
        : `Offer tier-based volume discounts to mid-market accounts to increase their average order value.`,
      intentCategory: 'customer',
      category: 'Olası Açıklamalar',
      evidence: {
        usedColumns: ['Müşteri Adı', 'Ciro (Revenue)'],
        calculationMethod: 'Group By Customer -> Sum(Revenue)',
        dataVolume: records.length,
        filtersApplied: ['None'],
        keyMetrics: [
          { label: 'Top Müşteri', value: topCust.name },
          { label: 'Gelir Payı', value: `${topCust.percentage}%` }
        ]
      },
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
    const content = `Dataset **"${datasetName}"** contains **${records.length} sales records**.`;

    return {
      id: msgId,
      role: 'assistant',
      timestamp,
      content,
      whatHappened: `Total Gross Revenue reached $${kpis.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })} from ${kpis.totalOrders.toLocaleString()} transactions (${kpis.totalQuantity.toLocaleString()} units). Average Order Value (AOV) is $${kpis.averageOrderValue.toFixed(2)}.`,
      whyItHappened: `Mevcut fiyatlandırma veya sipariş sıklığı stratejisinin bu geliri direkt olarak yaratıp yaratmadığı için veride yeterli kanıt bulunamadı. Bu sadece istatistiksel bir tespittir.`,
      whatItMeans: `Your primary growth lever is currently restricted by the AOV of $${kpis.averageOrderValue.toFixed(2)}. Without increasing this, revenue scales purely on customer acquisition volume.`,
      whatToDo: `Focus on cross-selling bundles to raise Average Order Value past $${Math.round(kpis.averageOrderValue * 1.25)}. Introduce free-shipping thresholds slightly above your current AOV.`,
      intentCategory: 'revenue',
      category: 'Kesin Bulgular',
      evidence: {
        usedColumns: ['Ciro (Revenue)', 'Adet (Quantity)', 'İşlem ID'],
        calculationMethod: 'Sum(Revenue), Average(Revenue/Order)',
        dataVolume: records.length,
        filtersApplied: ['None'],
        keyMetrics: [
          { label: 'Toplam Ciro', value: `$${kpis.totalRevenue.toLocaleString()}` },
          { label: 'AOV', value: `$${kpis.averageOrderValue.toFixed(2)}` }
        ]
      },
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

    const content = `Vortex AI's predictive forecasting engine models the following trajectories for "${datasetName}" (${conf}% ${confLabel} Confidence).`;

    return {
      id: msgId,
      role: 'assistant',
      timestamp,
      content,
      whatHappened: `30-Day Expected Revenue is $${f30.expectedRevenue.toLocaleString()} (${f30.expectedRevenueGrowth >= 0 ? '+' : ''}${f30.expectedRevenueGrowth}%). 60-Day projects $${forecastSummary.forecast60Day.expectedRevenue.toLocaleString()}.`,
      whyItHappened: `Our time-series modeling detected strong seasonal momentum and steady daily order velocity carrying forward.`,
      whatItMeans: `If current trends hold, you are on track to achieve expected targets. However, ${f30.topExpectedProducts[0]?.name || kpis.bestSellingProduct.name} will absorb the majority of this demand.`,
      whatToDo: `Ensure supply chain logistics are secured for ${f30.topExpectedProducts[0]?.name || kpis.bestSellingProduct.name} to fulfill the projected $${f30.topExpectedProducts[0]?.projectedRevenue.toLocaleString() || 0} in upcoming demand.`,
      intentCategory: 'forecast',
      category: forecastSummary.sufficiency.isSufficient ? 'Olası Açıklamalar' : 'Bilinmeyenler',
      evidence: {
        usedColumns: ['Tarih', 'Ciro (Revenue)'],
        calculationMethod: 'OLS Linear Regression + Day-of-Week Multipliers',
        dataVolume: analytics.dailyTrends.length,
        filtersApplied: ['Daily Aggregation'],
        keyMetrics: [
          { label: 'Güven Skoru', value: `${conf}%` },
          { label: 'Tahmin Aralığı (30 Gün)', value: `$${f30.predictionInterval?.min.toLocaleString()} - $${f30.predictionInterval?.max.toLocaleString()}` }
        ]
      },
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

    const content = `Based on dynamic statistical analysis of "${datasetName}", here are your top strategic action items (Executive Health Score: ${aiSummary.healthScore}/100):`;

    return {
      id: msgId,
      role: 'assistant',
      timestamp,
      content,
      whatHappened: `System generated ${recs.length} strategic recommendations based on current dataset patterns.`,
      whyItHappened: `Veri dışında piyasa koşulları veya rakip analizi için veride yeterli kanıt bulunamadı. Bu öneriler tamamen eldeki işlem geçmişinin istatistiksel analizine dayanan sadece olası bir açıklamadır.`,
      whatItMeans: `Executing these strategies is projected to yield high business impact.`,
      whatToDo: recList,
      intentCategory: 'recommendation',
      category: 'Olası Açıklamalar',
      evidence: {
        usedColumns: ['Tarih', 'Ürün Adı', 'Kategori', 'Beden', 'Ciro'],
        calculationMethod: 'Heuristic Rule Engine',
        dataVolume: records.length,
        filtersApplied: ['None'],
        keyMetrics: [
          { label: 'Sağlık Skoru', value: `${aiSummary.healthScore}/100` },
          { label: 'Öneri Sayısı', value: recs.length }
        ]
      },
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
