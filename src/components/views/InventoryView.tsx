'use client';

import React from 'react';
import {
  Boxes,
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  PackageX,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export function InventoryView() {
  const { inventorySummary, setActiveTab } = useData();
  const { scores, inventoryItems, reorderMatrix, lowStockItems, overstockItems, deadStockItems, fastMovingItems } = inventorySummary;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 4 Score Cards Header Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Inventory Health Score
          </span>
          <div className="text-3xl font-bold font-mono text-emerald-400">
            {scores.inventoryHealthScore} / 100
          </div>
          <p className="text-xs text-slate-400">Based on stock-out & overstock ratios</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Stock Coverage Days
          </span>
          <div className="text-3xl font-bold font-mono text-indigo-400">
            {scores.stockCoverageDays} Days
          </div>
          <p className="text-xs text-slate-400">Average inventory supply remaining</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Reorder Action Items
          </span>
          <div className="text-3xl font-bold font-mono text-rose-400">
            {scores.totalReordersNeeded} SKUs
          </div>
          <p className="text-xs text-rose-400 font-semibold">{scores.totalLowStockSKUs} run-out risks (&lt;14 days)</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Overstock & Idle Supply
          </span>
          <div className="text-3xl font-bold font-mono text-amber-400">
            {scores.totalOverstockSKUs} SKUs
          </div>
          <p className="text-xs text-slate-400">{deadStockItems.length} dead stock items</p>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockItems.length > 0 && (
        <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-rose-400 flex-shrink-0" />
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Immediate Inventory Reorder Required ({lowStockItems.length} SKUs)
              </h3>
              <p className="text-xs text-rose-300 mt-0.5">
                Top item "{lowStockItems[0].productName}" (Size {lowStockItems[0].size}) is expected to run out in {lowStockItems[0].daysOfStockRemaining} days.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('alerts')}
            className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg transition-all"
          >
            <span>View Alerts Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Dynamic Reorder Point (ROP) Matrix */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-indigo-400" />
              Dynamic Reorder Point (ROP) Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Calculated using ROP = (7-Day Lead Time × Daily Demand Velocity) + Safety Stock
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-mono text-[11px]">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Product Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Current Stock</th>
                <th className="px-4 py-3">Daily Velocity</th>
                <th className="px-4 py-3">ROP Threshold</th>
                <th className="px-4 py-3">Rec. Reorder Qty</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3 rounded-r-lg">Target Reorder Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {reorderMatrix.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-100">{item.productName}</td>
                  <td className="px-4 py-3 text-slate-400">{item.category}</td>
                  <td className="px-4 py-3 font-mono font-bold text-indigo-300">{item.size}</td>
                  <td className="px-4 py-3 font-mono font-bold text-rose-400">{item.currentStock} items</td>
                  <td className="px-4 py-3 font-mono">{item.dailyDemandVelocity} / day</td>
                  <td className="px-4 py-3 font-mono">{item.reorderPoint} items</td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-400">+{item.recommendedReorderQty} units</td>
                  <td className="px-4 py-3 font-mono">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        item.priority === 'critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : item.priority === 'high'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-indigo-500/20 text-indigo-300'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-200">{item.suggestedReorderDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Inventory SKU Classification Table */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <Boxes className="w-4 h-4 text-emerald-400" />
          Inventory SKU Classification & Run-Out Timelines
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-mono text-[11px]">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Product SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Current Stock</th>
                <th className="px-4 py-3">Daily Velocity</th>
                <th className="px-4 py-3">Days Remaining</th>
                <th className="px-4 py-3">Stock Status</th>
                <th className="px-4 py-3 rounded-r-lg">AI Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {inventoryItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-100">{item.productName}</td>
                  <td className="px-4 py-3 text-slate-400">{item.category}</td>
                  <td className="px-4 py-3 font-mono font-bold text-indigo-300">{item.size}</td>
                  <td className="px-4 py-3 font-mono">{item.currentStock}</td>
                  <td className="px-4 py-3 font-mono">{item.dailyVelocity} / day</td>
                  <td className="px-4 py-3 font-mono font-bold">{item.daysOfStockRemaining} days</td>
                  <td className="px-4 py-3 font-mono">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        item.statusBadge.color === 'rose'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : item.statusBadge.color === 'amber'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : item.statusBadge.color === 'emerald'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {item.statusBadge.text}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 max-w-xs truncate">{item.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
