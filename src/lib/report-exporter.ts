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
      <title>Vortex AI - Executive Sales Report (${datasetName})</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; margin: 30px; line-height: 1.5; font-size: 13px; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #6366f1; padding-bottom: 15px; margin-bottom: 25px; }
        .brand { font-size: 22px; font-weight: bold; color: #4338ca; }
        .title { font-size: 16px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
        .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px; }
        .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 10px; }
        .kpi-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
        .kpi-value { font-size: 20px; font-weight: bold; color: #0f172a; margin-top: 5px; }
        .section { margin-bottom: 25px; background: #ffffff; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px; }
        .section-title { font-size: 15px; font-weight: bold; color: #1e1b4b; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
        th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #f1f5f9; }
        th { background: #f8fafc; color: #475569; font-weight: bold; text-transform: uppercase; font-size: 10px; }
        .badge { padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; font-family: monospace; }
        .badge-rose { background: #ffe4e6; color: #be123c; }
        .badge-emerald { background: #d1fae5; color: #047857; }
        .badge-indigo { background: #e0e7ff; color: #4338ca; }
        .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        @media print {
          body { margin: 0; }
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

      <div class="header">
        <div>
          <div class="brand">VORTEX AI ENTERPRISE</div>
          <div style="font-size: 12px; color: #64748b;">Executive Sales & Inventory Intelligence Briefing</div>
        </div>
        <div style="text-align: right;">
          <div class="title">Official Business Report</div>
          <div style="font-size: 11px; color: #64748b;">Dataset: <strong>${datasetName}</strong> (${data.records.length} records)</div>
          <div style="font-size: 11px; color: #64748b;">Generated: ${new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Total Revenue</div>
          <div class="kpi-value" style="color: #047857;">$${kpis.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Total Units Sold</div>
          <div class="kpi-value">${kpis.totalQuantity.toLocaleString()} units</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Average Order Value (AOV)</div>
          <div class="kpi-value">$${kpis.averageOrderValue.toFixed(2)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Best Selling Product</div>
          <div class="kpi-value" style="font-size: 16px;">${kpis.bestSellingProduct.name}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Inventory Health Score</div>
          <div class="kpi-value" style="color: #4338ca;">${inventorySummary.scores.inventoryHealthScore}/100</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Forecast Confidence</div>
          <div class="kpi-value" style="color: #047857;">${forecastSummary.sufficiency.confidenceScore}% (${forecastSummary.sufficiency.confidenceLabel})</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Executive Summary Brief</div>
        <p style="color: #334155; leading-height: 1.6;">${aiSummary.executiveOverview}</p>
      </div>

      <div class="section">
        <div class="section-title">Top Product Sales Performance</div>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Revenue</th>
              <th>Units Sold</th>
              <th>Avg Price</th>
            </tr>
          </thead>
          <tbody>
            ${productMetrics.slice(0, 5).map((p, i) => `
              <tr>
                <td>#${i + 1}</td>
                <td><strong>${p.name}</strong></td>
                <td>${p.category}</td>
                <td style="color: #047857; font-weight: bold;">$${p.revenue.toLocaleString()}</td>
                <td>${p.quantity} units</td>
                <td>$${p.averagePrice.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <div class="section-title">Apparel Size Distribution</div>
        <table>
          <thead>
            <tr>
              <th>Size Variant</th>
              <th>Total Units Sold</th>
              <th>Volume Share %</th>
              <th>Gross Revenue</th>
            </tr>
          </thead>
          <tbody>
            ${sizeMetrics.map(sz => `
              <tr>
                <td><strong>Size ${sz.size}</strong></td>
                <td>${sz.quantity} units</td>
                <td><span class="badge badge-indigo">${sz.percentage}%</span></td>
                <td style="color: #047857; font-weight: bold;">$${sz.revenue.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <div class="section-title">30-Day Predictive Forecast & Strategic Risks</div>
        <p><strong>Expected 30-Day Revenue:</strong> $${forecastSummary.forecast30Day.expectedRevenue.toLocaleString()} (${forecastSummary.forecast30Day.expectedRevenueGrowth >= 0 ? '+' : ''}${forecastSummary.forecast30Day.expectedRevenueGrowth}% vs baseline)</p>
        <p><strong>Key AI Recommendation:</strong> ${aiSummary.recommendations[0]?.action || 'Optimize inventory ratio for high-velocity items.'}</p>
      </div>

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
