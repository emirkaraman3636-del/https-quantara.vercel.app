'use client';

import React from 'react';
import { TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  badge?: {
    text: string;
    type?: 'emerald' | 'indigo' | 'amber' | 'rose' | 'violet';
  };
  highlight?: boolean;
}

const BADGE_STYLES = {
  emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  indigo: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  rose: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
  violet: 'bg-violet-500/15 text-violet-400 border-violet-500/20'
};

export function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendLabel = 'vs prev month',
  badge,
  highlight = false
}: KPICardProps) {
  const isPositive = trend && trend >= 0;

  return (
    <div
      className={`relative p-5 rounded-2xl border transition-all duration-300 hover:translate-y-[-2px] ${
        highlight
          ? 'bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-500/40 shadow-xl shadow-indigo-500/10'
          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700/80 shadow-md backdrop-blur-sm'
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className="p-2.5 rounded-xl bg-slate-800/80 text-indigo-400 border border-slate-700/50">
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-slate-100 truncate">
          {value}
        </div>

        {subtitle && (
          <p className="text-xs text-slate-400 mt-1 font-medium truncate">{subtitle}</p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
        {trend !== undefined ? (
          <div className="flex items-center space-x-1.5">
            <span
              className={`flex items-center text-xs font-semibold ${
                isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
              {isPositive ? '+' : ''}{trend}%
            </span>
            <span className="text-slate-400 text-[11px]">{trendLabel}</span>
          </div>
        ) : (
          <span className="text-slate-400 text-[11px]">Real-time dataset metric</span>
        )}

        {badge && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border font-mono ${
              BADGE_STYLES[badge.type || 'emerald']
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>
    </div>
  );
}
