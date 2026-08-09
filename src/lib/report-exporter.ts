import * as XLSX from 'xlsx';
import { SalesRecord, AnalyticsSummary } from './types';
import { AIExecutiveSummary } from './ai-types';
import { ForecastSummary } from './forecast-types';
import { InventorySummary } from './inventory-types';

export interface ReportExportData {
  datasetName: string;
  records: SalesRecord[];
  analytics: AnalyticsSummary;
  aiSummary: AIExecutiveSummary;
  forecastSummary: ForecastSummary;
  inventorySummary: InventorySummary;
}

/**
 * Generate and trigger download of Multi-Sheet Excel Workbook (.xlsx)
 */
export function exportExcelReport(data: ReportExportData): void {
  const { datasetName, analytics, aiSummary, forecastSummary, inventorySummary } = data;
  const { kpis, productMetrics, sizeMetrics, categoryMetrics } = analytics;

  const workbook = XLSX.utils.book_new();

  // --- Sheet 1: Executive Overview ---
  const overviewData = [
    ['VORTEX AI - EXECUTIVE BUSINESS REPORT'],
    ['Dataset Name', datasetName],
    ['Report Date', new Date().toLocaleDateString()],
    [''],
    ['KEY PERFORMANCE INDICATORS'],
    ['Metric', 'Value'],
    ['Total Revenue', `$${kpis.totalRevenue.toLocaleString()}`],
    ['Total Sales Quantity', `${kpis.totalQuantity.toLocaleString()} units`],
    ['Total Transactions', `${kpis.totalOrders} orders`],
    ['Average Order Value (AOV)', `$${kpis.averageOrderValue.toFixed(2)}`],
    ['Best Selling Product', kpis.bestSellingProduct.name],
    ['Lowest Selling Product', kpis.lowestSellingProduct.name],
    [''],
    ['ENTERPRISE SCORES'],
    ['Inventory Health Score', `${inventorySummary.scores.inventoryHealthScore} / 100`],
    ['Business Health Score', `${aiSummary.healthScore} / 100`],
    ['Risk Score', `${inventorySummary.scores.riskScore} / 100`],
    ['Forecast Confidence', `${forecastSummary.sufficiency.confidenceScore}%`],
    ['Stock Coverage Days', `${inventorySummary.scores.stockCoverageDays} days`],
    [''],
    ['EXECUTIVE SUMMARY BRIEF'],
    [aiSummary.executiveOverview]
  ];

  const wsOverview = XLSX.utils.aoa_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(workbook, wsOverview, 'Executive Overview');

  // --- Sheet 2: Inventory & Reorder Matrix ---
  const inventoryRows = inventorySummary.inventoryItems.map(item => ({
    'Product Name': item.productName,
    'Category': item.category,
    'Size': item.size,
    'Current Stock': item.currentStock,
    'Total Units Sold': item.totalQuantitySold,
    'Daily Velocity': item.dailyVelocity,
    'Days of Stock Remaining': item.daysOfStockRemaining,
    'Stock Status': item.statusBadge.text,
    'Est. Run Out Date': item.estimatedRunOutDate || 'N/A',
    'Recommendation': item.recommendation
  }));

  const wsInventory = XLSX.utils.json_to_sheet(inventoryRows);
  XLSX.utils.book_append_sheet(workbook, wsInventory, 'Inventory & ROP Matrix');

  // --- Sheet 3: Product Performance ---
  const productRows = productMetrics.map((p, idx) => ({
    'Rank': `#${idx + 1}`,
    'Product Name': p.name,
    'Category': p.category,
    'Revenue': p.revenue,
    'Units Sold': p.quantity,
    'Orders Count': p.ordersCount,
    'Average Price': p.averagePrice
  }));

  const wsProducts = XLSX.utils.json_to_sheet(productRows);
  XLSX.utils.book_append_sheet(workbook, wsProducts, 'Product Performance');

  // --- Sheet 4: Size & Category Breakdown ---
  const sizeRows = sizeMetrics.map(sz => ({
    'Size Variant': sz.size,
    'Units Sold': sz.quantity,
    'Volume Percentage': `${sz.percentage}%`,
    'Revenue Generated': sz.revenue,
    'Stock Available': sz.stockAvailable
  }));

  const wsSizes = XLSX.utils.json_to_sheet(sizeRows);
  XLSX.utils.book_append_sheet(workbook, wsSizes, 'Size Distribution');

  // --- Sheet 5: AI Auto Insights (Key Findings) ---
  const aiInsightRows = analytics.autoInsights.map(insight => ({
    'Priority': insight.priority.toUpperCase(),
    'Type': insight.type.toUpperCase(),
    'Title': insight.title,
    'What Happened': insight.whatHappened,
    'Business Impact': insight.whatItMeans,
    'Recommended Action': insight.whatToDo
  }));

  if (aiInsightRows.length > 0) {
    const wsInsights = XLSX.utils.json_to_sheet(aiInsightRows);
    XLSX.utils.book_append_sheet(workbook, wsInsights, 'AI Auto Insights');
  }

  // --- Sheet 6: Segmentation ---
  const segmentationRows = [
    ...analytics.segmentation.customers.map(c => ({
      'Segment Type': 'Customer',
      'Name': c.name,
      'Description': c.description,
      'Revenue': c.revenue,
      'Cohort Size': c.count,
      'Percentage': `${c.percentage}%`,
      'Key Traits': c.traits.join(', ')
    })),
    ...analytics.segmentation.products.map(p => ({
      'Segment Type': 'Product',
      'Name': p.name,
      'Description': p.description,
      'Revenue': p.revenue,
      'Cohort Size': p.count,
      'Percentage': `${p.percentage}%`,
      'Key Traits': p.traits.join(', ')
    }))
  ];

  if (segmentationRows.length > 0) {
    const wsSegmentation = XLSX.utils.json_to_sheet(segmentationRows);
    XLSX.utils.book_append_sheet(workbook, wsSegmentation, 'Behavioral Segments');
  }

  // Trigger File Download
  const fileName = `Vortex_Executive_Report_${datasetName.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

/**
 * Generate Presentation-Ready Printable PDF / HTML Executive Report
 */
export function exportPDFReport(data: ReportExportData): void {
  const { datasetName, analytics, aiSummary, forecastSummary, inventorySummary } = data;
  const { kpis, productMetrics, sizeMetrics, categoryMetrics } = analytics;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download/print the PDF Executive Report.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Vortex AI - Enterprise Data Analytics Report (${datasetName})</title>
      <style>
        body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #0f172a; margin: 40px; line-height: 1.6; font-size: 13px; background-color: #f8fafc; }
        .page { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); margin-bottom: 20px; }
        .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px; }
        .brand { font-size: 28px; font-weight: 900; color: #312e81; letter-spacing: -0.5px; }
        .title { font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; }
        .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
        .kpi-card { background: #ffffff; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; border-top: 4px solid #4f46e5; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1); }
        .kpi-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px; }
        .kpi-value { font-size: 24px; font-weight: 800; color: #0f172a; margin-top: 8px; }
        .section { margin-bottom: 40px; }
        .section-title { font-size: 18px; font-weight: 800; color: #1e1b4b; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .section-title::before { content: ""; display: block; width: 4px; height: 18px; background-color: #4f46e5; border-radius: 2px; }
        .text-block { color: #334155; background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #94a3b8; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
        th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f1f5f9; color: #475569; font-weight: 700; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
        .badge { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; font-family: monospace; }
        .badge-rose { background: #ffe4e6; color: #be123c; border: 1px solid #fda4af; }
        .badge-emerald { background: #d1fae5; color: #047857; border: 1px solid #6ee7b7; }
        .badge-indigo { background: #e0e7ff; color: #4338ca; border: 1px solid #a5b4fc; }
        .badge-amber { background: #fef3c7; color: #b45309; border: 1px solid #fcd34d; }
        .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        @media print {
          body { margin: 0; background-color: white; }
          .page { box-shadow: none; padding: 0; margin-bottom: 40px; page-break-after: always; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 20px; text-align: right;">
        <button onclick="window.print()" style="background: #4338ca; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">
          Print / Save as PDF
        </button>
      </div>

      <div class="page">
        <div class="header">
          <div>
            <div class="brand">VORTEX AI PLATFORM</div>
            <div style="font-size: 14px; color: #64748b; margin-top: 4px;">Enterprise Data Analytics Report</div>
          </div>
          <div style="text-align: right;">
            <div class="title">Confidential</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Dataset: <strong>${datasetName}</strong> (${data.records.length} records)</div>
            <div style="font-size: 12px; color: #64748b;">Generated: ${new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <!-- 1. Executive Summary -->
        <div class="section">
          <div class="section-title">1. Executive Summary</div>
          <div class="text-block" style="border-left-color: #4f46e5;">
            <p style="margin: 0;">${aiSummary.executiveOverview}</p>
          </div>
        </div>

        <!-- 2. Key KPIs -->
        <div class="section">
          <div class="section-title">2. Key Performance Indicators</div>
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">Total Revenue</div>
              <div class="kpi-value" style="color: #047857;">$${kpis.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Total Units Sold</div>
              <div class="kpi-value">${kpis.totalQuantity.toLocaleString()}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Average Order Value (AOV)</div>
              <div class="kpi-value">$${kpis.averageOrderValue.toFixed(2)}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Health Score</div>
              <div class="kpi-value" style="color: #4338ca;">${aiSummary.healthScore}/100</div>
            </div>
          </div>
        </div>

        <!-- 3. Key Findings (Auto Insights) -->
        <div class="section">
          <div class="section-title">3. Key Findings & Discoveries</div>
          ${analytics.autoInsights.length > 0 ? analytics.autoInsights.map(insight => `
            <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #e2e8f0;">
              <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 15px;">
                <span class="badge ${insight.type === 'opportunity' ? 'badge-emerald' : insight.type === 'risk' ? 'badge-rose' : 'badge-indigo'}">${insight.type}</span>
                ${insight.title}
              </h4>
              <p style="margin: 4px 0; font-size: 13px;"><strong>Finding:</strong> ${insight.whatHappened}</p>
              <p style="margin: 4px 0; font-size: 13px;"><strong>Impact:</strong> ${insight.whatItMeans}</p>
            </div>
          `).join('') : '<p>No anomalous findings detected in the current dataset.</p>'}
        </div>

        <!-- 4. Data Quality -->
        <div class="section">
          <div class="section-title">4. Data Quality Analysis</div>
          <div class="kpi-grid" style="grid-template-columns: repeat(3, 1fr);">
            <div class="kpi-card" style="border-top-color: #10b981;">
              <div class="kpi-label">Quality Score</div>
              <div class="kpi-value">${analytics.dataQuality.score}%</div>
            </div>
            <div class="kpi-card" style="border-top-color: #f59e0b;">
              <div class="kpi-label">Missing Data Rate</div>
              <div class="kpi-value">${analytics.dataQuality.missingDataRate}%</div>
            </div>
            <div class="kpi-card" style="border-top-color: #6366f1;">
              <div class="kpi-label">Anomalies Detected</div>
              <div class="kpi-value">${analytics.dataQuality.anomalyCount}</div>
            </div>
          </div>
        </div>
      </div> <!-- End Page 1 -->

      <div class="page">
        <!-- 5. Trend Analysis -->
        <div class="section">
          <div class="section-title">5. Trend Analysis</div>
          <div class="text-block" style="border-left-color: #3b82f6; margin-bottom: 15px;">
            <p style="margin: 0;"><strong>Revenue Trend:</strong> ${analytics.chartInsights.revenue.summary}</p>
            <p style="margin: 8px 0 0 0;"><strong>Driver:</strong> ${analytics.chartInsights.revenue.whyItHappened}</p>
          </div>
        </div>

        <!-- 6. Risks -->
        <div class="section">
          <div class="section-title">6. Business Risks</div>
          ${inventorySummary.alerts.length > 0 ? `
            <ul style="margin: 0; padding-left: 20px; color: #be123c;">
              ${inventorySummary.alerts.slice(0, 5).map(alert => `<li style="margin-bottom: 8px;"><strong>${alert.title}:</strong> ${alert.message}</li>`).join('')}
            </ul>
          ` : '<p style="color: #059669; font-weight: 500;">No immediate critical risks detected in current operations.</p>'}
        </div>

        <!-- 7. Opportunities -->
        <div class="section">
          <div class="section-title">7. Growth Opportunities</div>
          ${analytics.autoInsights.filter(ai => ai.type === 'opportunity').length > 0 ? `
            <ul style="margin: 0; padding-left: 20px; color: #047857;">
              ${analytics.autoInsights.filter(ai => ai.type === 'opportunity').map(insight => `<li style="margin-bottom: 8px;"><strong>${insight.title}:</strong> ${insight.whatToDo}</li>`).join('')}
            </ul>
          ` : '<p>Expand top category variants (' + (categoryMetrics[0]?.category || 'General') + ') to capture more market share.</p>'}
        </div>

        <!-- 8. Forecasts -->
        <div class="section">
          <div class="section-title">8. Predictive Forecasts (30-Day)</div>
          <div class="text-block" style="border-left-color: #8b5cf6;">
            <p style="margin: 0 0 10px 0;"><strong>Expected Revenue:</strong> $${forecastSummary.forecast30Day.expectedRevenue.toLocaleString()} (${forecastSummary.forecast30Day.expectedRevenueGrowth >= 0 ? '+' : ''}${forecastSummary.forecast30Day.expectedRevenueGrowth}% vs baseline)</p>
            <p style="margin: 0 0 10px 0;"><strong>Expected Volume:</strong> ${forecastSummary.forecast30Day.expectedQuantity.toLocaleString()} units</p>
            <p style="margin: 0;"><strong>Top Expected Driver:</strong> ${forecastSummary.forecast30Day.topExpectedProducts[0]?.name || kpis.bestSellingProduct.name}</p>
          </div>
          <p style="font-size: 12px; color: #64748b; margin-top: 10px;">Model Confidence: ${forecastSummary.sufficiency.confidenceScore}% (${forecastSummary.sufficiency.confidenceLabel})</p>
        </div>

        <!-- 9. AI Recommendations -->
        <div class="section">
          <div class="section-title">9. Strategic AI Recommendations</div>
          <table style="margin-top: 0;">
            <thead>
              <tr>
                <th style="width: 25%;">Strategy</th>
                <th style="width: 50%;">Action</th>
                <th style="width: 25%;">Expected Outcome</th>
              </tr>
            </thead>
            <tbody>
              ${aiSummary.recommendations.map(rec => `
                <tr>
                  <td><strong>${rec.title}</strong></td>
                  <td>${rec.action}</td>
                  <td style="color: #047857;">${rec.expectedOutcome}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- 10. Action Plan -->
        <div class="section">
          <div class="section-title">10. Immediate Action Plan</div>
          <div style="background: #eef2ff; border: 1px solid #c7d2fe; padding: 20px; border-radius: 8px;">
            <ol style="margin: 0; padding-left: 20px; color: #312e81; font-weight: 500;">
              <li style="margin-bottom: 10px;">Review risk alerts and restock <strong>${kpis.bestSellingProduct.name}</strong> to prevent stock-outs.</li>
              <li style="margin-bottom: 10px;">Execute cross-sell campaign based on AI Recommendation #1.</li>
              <li style="margin-bottom: 10px;">Adjust marketing spend towards top performing segment (${analytics.segmentation.customers[0]?.name || 'VIPs'}).</li>
              <li style="margin-bottom: 0;">Prepare supply chain for projected $${forecastSummary.forecast30Day.expectedRevenue.toLocaleString()} 30-day demand.</li>
            </ol>
          </div>
        </div>
      </div> <!-- End Page 2 -->

      <div class="footer">
        Generated automatically by Vortex AI Enterprise Analytics Platform. Confidential Business Document.
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

/**
 * Generate CSV Summary Export
 */
export function exportCSVSummary(data: ReportExportData): void {
  const { datasetName, analytics } = data;
  const headers = ['Product Name', 'Category', 'Revenue', 'Units Sold', 'Orders Count', 'Average Price'];
  const rows = analytics.productMetrics.map(p => [
    `"${p.name}"`,
    `"${p.category}"`,
    p.revenue,
    p.quantity,
    p.ordersCount,
    p.averagePrice
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Vortex_Analytics_${datasetName.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
