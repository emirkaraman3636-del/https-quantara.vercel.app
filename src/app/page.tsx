'use client';

import React from 'react';
import { DataProvider, useData } from '../context/DataContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { OverviewView } from '../components/views/OverviewView';
import { InventoryView } from '../components/views/InventoryView';
import { AlertCenterView } from '../components/views/AlertCenterView';
import { AIChatView } from '../components/views/AIChatView';
import { AIInsightsView } from '../components/views/AIInsightsView';
import { ForecastingView } from '../components/views/ForecastingView';
import { UploadView } from '../components/views/UploadView';
import { ProductAnalyticsView } from '../components/views/ProductAnalyticsView';
import { SizeAnalyticsView } from '../components/views/SizeAnalyticsView';
import { SalesTrendsView } from '../components/views/SalesTrendsView';

function DashboardContent() {
  const { activeTab } = useData();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-8 max-w-7xl mx-auto w-full flex-1">
          {activeTab === 'overview' && <OverviewView />}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'alerts' && <AlertCenterView />}
          {activeTab === 'chat' && <AIChatView />}
          {activeTab === 'ai-insights' && <AIInsightsView />}
          {activeTab === 'forecasting' && <ForecastingView />}
          {activeTab === 'upload' && <UploadView />}
          {activeTab === 'products' && <ProductAnalyticsView />}
          {activeTab === 'sizes' && <SizeAnalyticsView />}
          {activeTab === 'trends' && <SalesTrendsView />}
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  );
}
