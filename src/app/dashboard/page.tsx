'use client';

import React from 'react';
import { DataProvider, useData } from '../../context/DataContext';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { SmartDashboardView } from '../../components/views/SmartDashboardView';
import { AIChatView } from '../../components/views/AIChatView';
import { UploadView } from '../../components/views/UploadView';
import { AIExecutiveBriefing } from '../../components/ai/AIExecutiveBriefing';
import { DataQualityReport } from '../../components/dashboard/DataQualityReport';
import { AILoadingScreen } from '../../components/ai/AILoadingScreen';
import { ChatSidebar } from '../../components/dashboard/ChatSidebar';

function DashboardContent() {
  const { activeTab, isLoading } = useData();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      <AILoadingScreen isLoading={isLoading} />
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-8 max-w-7xl mx-auto w-full flex-1">
          {activeTab === 'executive-summary' && <AIExecutiveBriefing />}
          {activeTab === 'smart-dashboard' && <SmartDashboardView />}
          {activeTab === 'data-quality' && <DataQualityReport />}
          {activeTab === 'chat' && <AIChatView />}
          {activeTab === 'upload' && <UploadView />}
        </main>
        <ChatSidebar />
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
