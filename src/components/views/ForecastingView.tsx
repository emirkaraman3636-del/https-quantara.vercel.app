'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  ShieldCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line
} from 'recharts';
import { useData } from '../../context/DataContext';

export function ForecastingView() {
  const { forecastSummary, uploadedFileName, records } = useData();
  const {
    sufficiency,
    timeSeriesCurve,
    forecast30Day,
    forecast60Day,
    forecast90Day,
    categoryForecasts,
    seasonality,
    aiExplanation
  } = forecastSummary;

  const [selectedPeriod, setSelectedPeriod] = useState<30 | 60 | 90>(30);

  const currentPeriodForecast =
    selectedPeriod === 30
      ? forecast30Day
      : selectedPeriod === 60
      ? forecast60Day
      : forecast90Day;

  // Filter time series graph points based on selected period
  const displayCurve = timeSeriesCurve.filter(pt => {
    if (!pt.isForecast) return true;
    const dayCount = timeSeriesCurve.filter(p => p.isForecast).indexOf(pt) + 1;
    return dayCount <= selectedPeriod;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Insufficient Data Warning Banner (If applicable) */}
      {!sufficiency.isSufficient && (
        <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 space-y-3">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Insufficient Historical Data for Reliable Forecasting
              </h3>
              <p className="text-xs text-amber-300/90 mt-0.5">
                {sufficiency.limitationReason}
              </p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/20 text-xs font-mono text-slate-300">
            <strong className="text-amber-400">Required Data: </strong>
            {sufficiency.neededDataDescription}
          </div>
        </div>
      )}

      {/* Main Header & Forecast Horizon Controls */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100">
              Predictive Sales & Revenue Forecasting Engine
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Analyzing {sufficiency.totalDaysSpanned} historical days across {sufficiency.totalRecords} sales transactions
          </p>
        </div>

        {/* Forecast Period Horizon Selector */}
        <div className="flex items-center space-x-3">
          {/* Confidence Meter Badge */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Confidence:</span>
            <span className="font-bold text-emerald-400">{sufficiency.confidenceScore}% ({sufficiency.confidenceLabel})</span>
          </div>

          <div className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setSelectedPeriod(30)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPeriod === 30
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              30-Day
            </button>
            <button
              onClick={() => setSelectedPeriod(60)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPeriod === 60
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              60-Day
            </button>
            <button
              onClick={() => setSelectedPeriod(90)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPeriod === 90
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              90-Day
            </button>
          </div>
        </div>
      </div>

      {/* AI Explanation Banner */}
      {currentPeriodForecast.dataSufficiencyExplanation && (
        <div className={`p-4 rounded-xl border mb-4 flex items-start space-x-3 text-xs sm:text-sm ${
          sufficiency.isSufficient 
            ? 'bg-indigo-900/20 border-indigo-500/30 text-indigo-200' 
            : 'bg-amber-900/20 border-amber-500/30 text-amber-200'
        }`}>
          {sufficiency.isSufficient ? <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
          <div>
            <strong className="block mb-1 opacity-80 uppercase tracking-wide text-[10px]">Veri Yeterlilik Durumu</strong>
            {currentPeriodForecast.dataSufficiencyExplanation}
          </div>
        </div>
      )}

      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 flex items-start space-x-3">
        <Sparkles className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5 animate-pulse" />
        <div>
          <h4 className="text-xs font-bold font-mono text-indigo-300 uppercase tracking-wider">
            AI Predictive Modeling Synthesis
          </h4>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
            {aiExplanation}
          </p>
        </div>
      </div>

      {/* Main Historical vs Predicted Revenue Chart */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Historical & Projected Revenue Curve ({selectedPeriod}-Day Horizon)
            </h3>
            <p className="text-xs text-slate-400">Solid line indicates historical sales; dashed curve indicates projected trajectory with confidence bounds.</p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-3 h-0.5 bg-indigo-500 rounded-full" /> Historical
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-0.5 bg-emerald-400 rounded-full border-b border-dashed" /> Projected
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayCurve} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="formattedDate" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(val: any, name: any) => [
                  val !== undefined ? `$${Number(val).toLocaleString()}` : 'N/A',
                  name === 'historicalRevenue' ? 'Historical Revenue' : name === 'projectedRevenue' ? 'AI Projected Revenue' : name
                ]}
              />
              <Area
                type="monotone"
                dataKey="historicalRevenue"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorHist)"
                name="historicalRevenue"
              />
              <Area
                type="monotone"
                dataKey="projectedRevenue"
                stroke="#10b981"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                fillOpacity={1}
                fill="url(#colorProj)"
                name="projectedRevenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Selected Period Metrics Cards (30/60/90-Day Details) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Expected Revenue Card */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Expected Revenue ({selectedPeriod} Days)
          </span>
          <div className="text-3xl font-bold text-emerald-400 font-mono">
            ${currentPeriodForecast.expectedRevenue.toLocaleString()}
          </div>
          {currentPeriodForecast.predictionInterval && (
            <div className="text-[10px] font-mono text-slate-500 border-t border-slate-700/50 pt-2 mt-1">
              Range: <span className="text-slate-300">${currentPeriodForecast.predictionInterval.min.toLocaleString()}</span> - <span className="text-slate-300">${currentPeriodForecast.predictionInterval.max.toLocaleString()}</span>
            </div>
          )}
          <div className="flex items-center space-x-1.5 text-xs font-semibold">
            <span className={currentPeriodForecast.expectedRevenueGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {currentPeriodForecast.expectedRevenueGrowth >= 0 ? '+' : ''}{currentPeriodForecast.expectedRevenueGrowth}%
            </span>
            <span className="text-slate-400 font-normal">vs historical baseline</span>
          </div>
        </div>

        {/* Expected Quantity Card */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Expected Sales Quantity ({selectedPeriod} Days)
          </span>
          <div className="text-3xl font-bold text-indigo-400 font-mono">
            {currentPeriodForecast.expectedQuantity.toLocaleString()} units
          </div>
          <div className="flex items-center space-x-1.5 text-xs font-semibold">
            <span className={currentPeriodForecast.expectedQuantityGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {currentPeriodForecast.expectedQuantityGrowth >= 0 ? '+' : ''}{currentPeriodForecast.expectedQuantityGrowth}%
            </span>
            <span className="text-slate-400 font-normal">volume velocity</span>
          </div>
        </div>

        {/* Seasonality Pattern Card */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Seasonality & Peak Days
          </span>
          <div className="text-2xl font-bold text-slate-100 font-mono">
            Peak: {seasonality.peakDayOfWeek}
          </div>
          <p className="text-xs text-slate-400 line-clamp-2">
            {seasonality.description}
          </p>
        </div>
      </div>

      {/* Category Trajectory & Growth Matrix */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-semibold text-slate-100">
            Category Growth & Decline Trajectories (30-Day Projected)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryForecasts.map(cat => (
            <div
              key={cat.category}
              className={`p-4 rounded-xl border space-y-2 ${
                cat.status === 'growing'
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : cat.status === 'declining'
                  ? 'bg-rose-950/20 border-rose-500/30'
                  : 'bg-slate-800/50 border-slate-700/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100">{cat.category}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    cat.status === 'growing'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : cat.status === 'declining'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {cat.status}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-lg font-bold font-mono text-slate-100">
                  ${cat.projected30DayRevenue.toLocaleString()}
                </span>
                <span
                  className={`text-xs font-bold flex items-center ${
                    cat.growthRate >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {cat.growthRate >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {cat.growthRate >= 0 ? '+' : ''}{cat.growthRate}%
                </span>
              </div>

              <p className="text-[11px] text-slate-300 pt-1 leading-relaxed">
                {cat.aiInsight}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
